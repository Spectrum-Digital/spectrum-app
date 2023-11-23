import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../../../../.graphclient'
import { BytesLike, DEXRouter, SpectrumChainId, SubgraphChainName, Token } from '../typings'

const sdk = getBuiltGraphSDK({ chainName: SubgraphChainName.BASE })

export abstract class SpectrumPeriphery {
  static async getPools(router: DEXRouter): Promise<
    Array<{
      address: BytesLike
      stable: boolean
      token0: Token
      token1: Token
    }>
  > {
    const chainName = this.getChainName(router.chainId)
    if (!chainName) return []

    const pools = await sdk.Pools({ factory: router.factory.toLowerCase() }, { chainName })
    return pools.pools.map(pool => ({
      address: getAddress(pool.id),
      stable: pool.stable,
      token0: { address: getAddress(pool.token0.id), chainId: router.chainId, decimals: pool.token0.decimals },
      token1: { address: getAddress(pool.token1.id), chainId: router.chainId, decimals: pool.token1.decimals },
    }))
  }

  private static getChainName(chainId: number): SubgraphChainName | undefined {
    const isSpectrumChainId = Object.values(SpectrumChainId).includes(chainId)
    if (isSpectrumChainId) return this._getChainName(chainId)

    console.error(`Subgraph not available for chainId: ${chainId}`)
    return undefined
  }

  private static _getChainName(chainId: SpectrumChainId): SubgraphChainName {
    switch (chainId) {
      case SpectrumChainId.BASE:
        return SubgraphChainName.BASE
    }
  }
}
