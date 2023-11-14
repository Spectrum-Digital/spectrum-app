import { encodeFunctionData } from 'viem'

import { __ROUTER_ADDRESS_MAP } from '../abi/__ROUTER_ADDRESS_MAP'
import { __ROUTER_FROM_TO_STABLE } from '../abi/__ROUTER_FROM_TO_STABLE'
import { __ROUTER_FROM_TO_STABLE_FACTORY } from '../abi/__ROUTER_FROM_TO_STABLE_FACTORY'
import { BytesLike, GetAmountsOutArgs, GetAmountsOutCandidatesArgs, Hops, MultiPath } from '../typings'

export abstract class GetAmountsOutHelper {
  public static generateGetAmountsOutCandidatesArgs(candidates: Hops[], amountIn: string): GetAmountsOutCandidatesArgs {
    return [
      candidates.map(hops =>
        hops.map(hop => {
          const calldata = this.getCalldata(hop, amountIn)
          return { router: hop.router.address, data: calldata }
        }),
      ),
    ]
  }

  public static generateGetAmountsOutArgs(hops: Hops, amountIn: string): GetAmountsOutArgs {
    return [
      hops.map(hop => {
        const calldata = this.getCalldata(hop, amountIn)
        return { router: hop.router.address, data: calldata }
      }),
    ]
  }

  private static getCalldata(hop: Hops[number], amountIn: string): BytesLike {
    switch (hop.router.getAmountsOut) {
      case 'address[]':
        return this.getAddressMapCalldata(hop.path, amountIn)
      case 'from_to_stable':
        return this.getFromToStableCalldata(hop.path, amountIn)
      case 'from_to_stable_factory':
        return this.getFromToStableFactoryCalldata(hop.path, amountIn)
    }
  }

  private static getAddressMapCalldata(path: MultiPath, amountIn: string): BytesLike {
    const start = path[0]
    if (!start) return '0x'

    return encodeFunctionData({
      abi: __ROUTER_ADDRESS_MAP,
      functionName: 'getAmountsOut',
      args: [BigInt(amountIn), [start.from.address, ...path.map(leg => leg.to.address)]],
    })
  }

  private static getFromToStableCalldata(path: MultiPath, amountIn: string): BytesLike {
    return encodeFunctionData({
      abi: __ROUTER_FROM_TO_STABLE,
      functionName: 'getAmountsOut',
      args: [
        BigInt(amountIn),
        path.map(leg => ({
          from: leg.from.address,
          to: leg.to.address,
          stable: leg.stable,
        })),
      ],
    })
  }

  private static getFromToStableFactoryCalldata(path: MultiPath, amountIn: string): BytesLike {
    return encodeFunctionData({
      abi: __ROUTER_FROM_TO_STABLE_FACTORY,
      functionName: 'getAmountsOut',
      args: [
        BigInt(amountIn),
        path.map(leg => ({
          from: leg.from.address,
          to: leg.to.address,
          stable: leg.stable,
          factory: leg.factory,
        })),
      ],
    })
  }
}
