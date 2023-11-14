import { ContractFunctionResult, InferFunctionName } from 'viem'
import BigNumber from 'bignumber.js'

import { SPECTRUM_ROUTER_ABI } from '../abi/SPECTRUM_ROUTER_ABI'
import {
  BytesLike,
  DEXRouter,
  GetAmountsOutCandidatesArgs,
  GetPoolRequestsCandidatesArgs,
  Hops,
  Legs,
  RouterErrorCode,
  Token,
  UserHops,
} from '../typings'
import { TokenRouter } from '../router'

export interface ISpectrumRouter {
  /**
   * Spawn a TokenRouter for a given token.
   * @param tokenIn The token we are routing from.
   * @returns A new TokenRouter instance.
   */
  start(tokenIn: Token): TokenRouter

  /**
   * Get the amount of tokenOut received for a given amount of tokenIn.
   * @param amountIn The amount of tokenIn to input.
   * @returns The payload to call `getAmountsOut` in the SpectrumRouter contract.
   */
  getAmountsOut(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: BigNumber | string | number,
  ): {
    error: boolean
    errorCode: RouterErrorCode | undefined
    payload: {
      address: BytesLike | undefined
      abi: typeof SPECTRUM_ROUTER_ABI
      functionName: InferFunctionName<typeof SPECTRUM_ROUTER_ABI>
      args: GetAmountsOutCandidatesArgs
    }
    parse: (
      type: 'highest' | 'lowest',
      data: ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getAmountsOutCandidates'>,
    ) => { amountsOut: BigNumber; route: Legs }
  }

  /**
   * Get a token's spot price as per the state of the reserves across hops.
   * @returns {payload} The payload to call `getPoolRequests` in the SpectrumRouter contract.
   * @returns {decode} The function to decode the result of `getPoolRequests`.
   */
  getPrice(
    tokenIn: Token,
    tokenOut: Token,
  ): {
    error: boolean
    errorCode: RouterErrorCode | undefined
    payload: {
      address: BytesLike | undefined
      abi: typeof SPECTRUM_ROUTER_ABI
      functionName: InferFunctionName<typeof SPECTRUM_ROUTER_ABI>
      args: GetPoolRequestsCandidatesArgs
    }
    parse: (
      type: 'highest' | 'lowest',
      data: ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequestsCandidates'>,
    ) => { price: BigNumber; route: Legs }
  }
}

export interface ITokenRouter {
  /**
   * @returns The token we are routing from.
   */
  get tokenIn(): Token

  /**
   * @returns The token we are routing to.
   */
  get tokenOut(): Token

  /**
   * @returns The hops we make across different routers.
   */
  get hops(): Hops

  /**
   * @returns The cumulative individual paths we cross via hops.
   */
  get legs(): Legs

  /**
   * Define a hop pertaining a path across a DEXRouter.
   * @param router The DEXRouter we're hopping across.
   * @param args A list of legs that make up the path we're hopping across.
   * @returns The TokenRouter instance for optional chaining.
   */
  hop<TRouter extends DEXRouter>(router: TRouter, args: UserHops<TRouter['getAmountsOut']>): this

  /**
   * Finish a set of hops.
   */
  end(): void

  /**
   * Dangerously override the internal hops.
   * @warning Should only be called by the SpectrumRouter instance.
   * @param hops A defined set of hops.
   */
  dangerouslyInjectHops(hops: Hops): this
}
