import { Abi, ContractFunctionResult } from 'viem'
import BigNumber from 'bignumber.js'

import { SPECTRUM_ROUTER_ABI } from './abi/SPECTRUM_ROUTER_ABI'
import { BytesLike, DEXRouter, Hops, Leg, Legs, MultiPath, RouterErrorCode, SupportedChainId, Token, UserHops } from './typings'
import { GetAmountsOutHelper } from './helpers/getAmountsOut'
import { GetPoolRequestsHelper } from './helpers/getPoolRequest'
import { Transformers } from './helpers/transformers'
import { RouterAddresses } from './addresses'
import { ISpectrumRouter, ITokenRouter } from './interfaces'
import { AMMHelper } from './helpers/AMM'

export class SpectrumRouter implements ISpectrumRouter {
  private routers = new Map<BytesLike, TokenRouter[]>()

  public start(tokenIn: Token) {
    const set = this.routers.get(tokenIn.address) || []
    const router = new TokenRouter(tokenIn, (tokenOut, reversedHops) => {
      const inversedSet = this.routers.get(tokenOut.address) || []
      const inversedRouter = new TokenRouter(tokenOut).dangerouslyInjectHops(reversedHops)
      this.routers.set(tokenOut.address, [...inversedSet, inversedRouter])
    })
    this.routers.set(tokenIn.address, [...set, router])
    return router
  }

  public getAmountsOut(tokenIn: Token, tokenOut: Token, amountIn: BigNumber | string | number) {
    const amount = amountIn instanceof BigNumber ? amountIn.toFixed() : amountIn === typeof 'string' ? amountIn : amountIn.toString()

    // Validate input data
    const address = this.getSpectrumRouterAddress(tokenIn.chainId)
    const addressError = address === undefined
    const routingError = tokenIn.address.toLowerCase() === tokenOut.address.toLowerCase()

    // Saving computation if we're exiting early anyway.
    const candidates = addressError || routingError ? [] : this.findPath(tokenIn, tokenOut).map(Transformers.legsToHops)

    let error: RouterErrorCode | undefined
    if (addressError) {
      error = 'UNKNOWN_CHAIN_ID'
    } else if (routingError) {
      error = 'UNNECESSARY_REQUEST'
    } else if (!candidates.length) {
      error = 'NO_CANDIDATES_FOUND'
    }

    return {
      error: Boolean(error),
      errorCode: error,
      payload: {
        address: this.getSpectrumRouterAddress(tokenIn.chainId),
        abi: this.getSpectrumRouterABI(),
        functionName: 'getAmountsOutCandidates' as const,
        args: GetAmountsOutHelper.generateGetAmountsOutCandidatesArgs(candidates, amount),
      },
      parse: (
        type: 'highest' | 'lowest',
        data: ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getAmountsOutCandidates'> | undefined,
      ) => {
        const DEFAULT_RETURN = { amountsOut: new BigNumber(0), route: [] }
        if (!data || !data.length) return DEFAULT_RETURN

        // We have to stringify the amounts in order to find the indexOf a few lines later.
        const amounts = data.map(amount => new BigNumber(amount.toString()).toFixed())
        const amountsOut = type === 'highest' ? BigNumber.max(...amounts) : BigNumber.min(...amounts)
        const winner = candidates[amounts.indexOf(amountsOut.toFixed())]

        return winner ? { amountsOut: amountsOut.shiftedBy(-tokenOut.decimals), route: Transformers.hopsToLegs(winner) } : DEFAULT_RETURN
      },
    }
  }

  public getPrice(tokenIn: Token, tokenOut: Token) {
    // Validate input data
    const address = this.getSpectrumRouterAddress(tokenIn.chainId)
    const addressError = address === undefined
    const routingError = tokenIn.address.toLowerCase() === tokenOut.address.toLowerCase()

    // Saving computation if we're exiting early anyway.
    const candidates = addressError || routingError ? [] : this.findPath(tokenIn, tokenOut)

    let error: RouterErrorCode | undefined
    if (addressError) {
      error = 'UNKNOWN_CHAIN_ID'
    } else if (routingError) {
      error = 'UNNECESSARY_REQUEST'
    } else if (!candidates.length) {
      error = 'NO_CANDIDATES_FOUND'
    }

    return {
      error: Boolean(error),
      errorCode: error,
      payload: {
        address: this.getSpectrumRouterAddress(tokenIn.chainId),
        abi: this.getSpectrumRouterABI(),
        functionName: 'getPoolRequestsCandidates' as const,
        args: GetPoolRequestsHelper.generateGetPoolRequestsCandidatesArgs(candidates),
      },
      parse: (
        type: 'highest' | 'lowest',
        data: ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequestsCandidates'> | undefined,
      ) => {
        const DEFAULT_RETURN = { price: new BigNumber(0), route: [] }
        if (!data || !data.length) return DEFAULT_RETURN

        const prices = data
          .map((results, index) =>
            this.decodePriceResult(
              // @ts-ignore
              candidates[index],
              results,
            ),
          )
          // We have to stringify them in order to find the indexOf a few lines later.
          .map(price => price.toFixed())

        const price = type === 'highest' ? BigNumber.max(...prices) : BigNumber.min(...prices)
        const route = candidates[prices.indexOf(price.toFixed())]

        return route ? { price, route } : DEFAULT_RETURN
      },
    }
  }

  private decodePriceResult(legs: Legs, data: ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequestsCandidates'>[number]) {
    const legResults = data.results
    const legTokens0 = data.tokens0

    // This should NOT be possible unless we make architectural changes to our code.
    if (legs.length !== legResults.length || legs.length !== legTokens0.length) {
      throw new Error('legs, legResults, legTokens0 do not match length')
    }

    const calculateRatio = (leg: Leg, token0: BytesLike, _reserve0: bigint, _reserve1: bigint): BigNumber => {
      const isToken0 = token0.toLowerCase() === leg.path.from.address.toLowerCase()
      if (leg.path.stable) {
        const price = AMMHelper.getAmountOutStableOnly(
          new BigNumber(1).shiftedBy(leg.path.from.decimals),
          leg.path.from,
          isToken0 ? leg.path.from : leg.path.to,
          isToken0 ? leg.path.to : leg.path.from,
          new BigNumber(_reserve0.toString()),
          new BigNumber(_reserve1.toString()),
        )
        return new BigNumber(price).shiftedBy(-leg.path.to.decimals)
      } else {
        const reserve0 = new BigNumber(_reserve0.toString()).shiftedBy(isToken0 ? -leg.path.from.decimals : -leg.path.to.decimals)
        const reserve1 = new BigNumber(_reserve1.toString()).shiftedBy(isToken0 ? -leg.path.to.decimals : -leg.path.from.decimals)
        return isToken0 ? reserve1.div(reserve0) : reserve0.div(reserve1)
      }
    }

    // Each hop calculates the price of the `from` token in terms of the `to` token.
    // After each hop, we end up with a multiplier per hop that we ultimately need to
    // multiply together to get the final price of tokenIn in terms of tokenOut.
    const multipliers = legResults.map((result, index) => {
      const leg = legs[index]! // We know this is safe because of the check above.
      const token0 = legTokens0[index]! // We know this is safe because of the check above.

      const { reserve0, reserve1 } = GetPoolRequestsHelper.decodeReservesResult(leg, result)
      return calculateRatio(leg, token0, reserve0, reserve1)
    })

    return multipliers.reduce((acc, multiplier) => acc.multipliedBy(multiplier), new BigNumber(1))
  }

  private getSupportedChainId(chainId: number | undefined): SupportedChainId | undefined {
    if (Object.values(SupportedChainId).includes(chainId as SupportedChainId)) {
      return chainId as SupportedChainId
    } else {
      return undefined
    }
  }

  private getSpectrumRouterAddress(_chainId: number | undefined): BytesLike | undefined {
    const chainId = this.getSupportedChainId(_chainId)
    return chainId ? RouterAddresses[chainId] : undefined
  }

  private getSpectrumRouterABI() {
    return SPECTRUM_ROUTER_ABI satisfies Abi
  }

  private findPath(tokenIn: Token, tokenOut: Token): Legs[] {
    // Gather all routers that have tokenIn and tokenOut as a starting point
    const routersIn = this.routers.get(tokenIn.address)
    const routersOut = this.routers.get(tokenOut.address)

    // If either has no known routers, then there is no intersection
    if (!routersIn || !routersOut) return []

    /**
     * Router A1: [A -> D]
     * Router A2: [A -> B]
     * Router B1: [B -> D]
     * Router B2: [B -> A] auto-mirror
     * Router D1: [D -> A] auto-mirror (not used)
     * Router D2: [D -> B] auto-mirror (not used)
     *
     * Objective: Find all possible paths from A -> B
     * Common nodes are: [B, D]
     */

    // Flatten routers belonging to TokenIn.
    const tokensA: BytesLike[] = [
      ...new Set(
        routersIn.reduce((acc, router) => {
          const tokensIn = router.legs.map(r => r.path.to.address)
          return [...acc, ...tokensIn]
        }, [] as BytesLike[]),
      ),
    ]

    // Flatten routers belonging to TokenOut.
    const tokensB: BytesLike[] = [
      // We're injecting tokenOut here so it can be considered a common node.
      tokenOut.address,
      ...new Set(
        routersOut.reduce((acc, router) => {
          const tokensIn = router.legs.map(r => r.path.to.address)
          return [...acc, ...tokensIn]
        }, [] as BytesLike[]),
      ),
    ]

    // Find the common nodes between the two lists: e.g. [B, D].
    const common = tokensA.filter(token => tokensB.includes(token))

    // For each route, find the common nodes and extract the legs before it.
    // For example - knowing B and D are common nodes, we would then propose
    // the following candidate routes: (1) A -> B and (2) A -> D -> B. It
    // would seem as if (1) is superior to (2), but the liquidity may disagree.
    return routersIn.reduce((acc, router) => {
      // For each common node: find the index of the leg that contains it.
      common.forEach(node => {
        // We would be trying to find B or D here.
        const index = router.legs.findIndex(leg => leg.path.to.address === node)
        if (index === -1) return

        // Extract all legs before or equal to the common node, e.g.: [A -> B] or [A -> D]
        const left = router.legs.slice(0, index + 1)

        // If we're dealing with common node B in [A -> B] continue to the next iteration.
        if (node === tokenOut.address) {
          acc.push(left) // [A -> B]
          return
        }

        // For each route that starts with B, find the legs towards the common node.
        routersOut.forEach(r => {
          // Find the index of the leg that contains the common node.
          // We would be looking for B -> D, because B -> A was already picked up by the early return.
          const index = r.legs.findIndex(leg => leg.path.to.address === node)
          if (index === -1) return

          // Extract all legs before or equal to the common node
          let right = r.legs.slice(0, index + 1) // [B -> D] yields [B -> D]

          // We have to reverse the list because we're going backwards.
          right = right.reverse() // [D -> B]

          // By reversing it we've corrupted the `from` and `to` fields, so we need to fix them.
          right = right.map(leg => {
            return {
              ...leg,
              path: {
                ...leg.path,
                from: leg.path.to, // D
                to: leg.path.from, // B
              },
            }
          })

          // Finally construct a new route from A -> D -> B
          acc.push([...left, ...right])
        })
      })
      return acc
    }, [] as Array<Legs>)
  }
}

export class TokenRouter implements ITokenRouter {
  private _onEndCallback: undefined | ((tokenIn: Token, reversedHops: Hops) => void)
  private _tokenIn: Token
  private _fromIterative: Token // gets updated on each hop, ends up being `tokenOut`
  private _hops: Hops = []

  constructor(tokenIn: Token, onEndCallback?: (tokenOut: Token, reversedHops: Hops) => void) {
    this._tokenIn = tokenIn
    this._fromIterative = tokenIn
    this._onEndCallback = onEndCallback
  }

  public get tokenIn() {
    return this._tokenIn
  }

  public get tokenOut() {
    return this._fromIterative
  }

  public get hops() {
    return this._hops
  }

  public get legs() {
    return Transformers.hopsToLegs(this._hops)
  }

  public hop<TRouter extends DEXRouter>(router: TRouter, args: UserHops<TRouter['getAmountsOut']>) {
    const start = args[0]
    const end = args[args.length - 1]

    // Enforce a minimum of 1 hop
    if (!start || !end) return this

    // Construct our multipath
    const multipath = this.constructMultiPath(router, args)

    this._fromIterative = 'to' in end ? end.to : end
    this._hops.push({ router, path: multipath })

    return this
  }

  public end() {
    if (!this._onEndCallback) return

    let reversed = [...this._hops].reverse()
    reversed = reversed.map(hop => ({
      router: hop.router,
      path: hop.path.reverse().map(leg => ({
        from: leg.to,
        to: leg.from,
        stable: leg.stable,
        factory: leg.factory,
      })),
    }))

    this._onEndCallback(this.tokenOut, reversed)
  }

  public dangerouslyInjectHops(hops: Hops) {
    const end = hops[hops.length - 1]
    if (!end) throw new Error('No hops to inject')
    const last = end.path[end.path.length - 1]
    if (!last) throw new Error('Empty path')

    this._hops = hops
    this._fromIterative = last.to
    return this
  }

  private constructMultiPath<TRouter extends DEXRouter>(router: TRouter, args: UserHops<TRouter['getAmountsOut']>): MultiPath {
    switch (router.getAmountsOut) {
      case 'address[]':
        return (args as UserHops<'address[]'>).reduce((acc, arg, index) => {
          if (index === 0) {
            acc.push({
              from: this._fromIterative,
              to: arg,
              stable: false,
              factory: '0x',
            })
          } else {
            acc.push({
              // @ts-ignore
              from: acc[index - 1].to,
              to: arg,
              stable: false,
              factory: router.factory,
            })
          }
          return acc
        }, [] as MultiPath)
      case 'from_to_stable':
      case 'from_to_stable_factory':
        return (args as UserHops<'from_to_stable'>).reduce((acc, arg, index) => {
          if (index === 0) {
            acc.push({ from: this._fromIterative, to: arg.to, stable: arg.stable, factory: router.factory })
          } else {
            acc.push({
              // @ts-ignore
              from: acc[index - 1].to,
              to: arg.to,
              stable: arg.stable,
              factory: router.factory,
            })
          }
          return acc
        }, [] as MultiPath)
    }
  }
}
