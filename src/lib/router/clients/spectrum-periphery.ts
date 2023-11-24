import { getAddress } from 'viem'

import { getBuiltGraphSDK } from '../../../../.graphclient'
import { BytesLike, DEXRouter, SpectrumChainId, Token } from '../typings'
import { SubgraphURL } from '../config'

const sdk = getBuiltGraphSDK({
  url: SubgraphURL[250], // this default will be overridden
})

export abstract class SpectrumPeriphery {
  static async getPools(router: DEXRouter): Promise<
    Array<{
      address: BytesLike
      stable: boolean
      token0: Token
      token1: Token
    }>
  > {
    const url = this.getSubgraphURL(router.chainId)
    if (!url) return []

    const pools = await sdk.Pools({ factory: router.factory.toLowerCase() }, { url })
    return pools.pools.map(pool => ({
      address: getAddress(pool.id),
      stable: pool.stable,
      token0: { address: getAddress(pool.token0.id), chainId: router.chainId, decimals: pool.token0.decimals },
      token1: { address: getAddress(pool.token1.id), chainId: router.chainId, decimals: pool.token1.decimals },
    }))
  }

  private static getSubgraphURL(chainId: number): string | undefined {
    const isSpectrumChainId = Object.values(SpectrumChainId).includes(chainId)
    if (isSpectrumChainId) return this._getSubgraphURL(chainId)

    console.error(`Subgraph not available for chainId: ${chainId}`)
    return undefined
  }

  private static _getSubgraphURL(chainId: SpectrumChainId): string {
    return SubgraphURL[chainId]
  }
}
