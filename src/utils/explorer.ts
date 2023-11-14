import { SupportedChainId } from '@/constants/chains'
import { ChainInfo } from '@/constants/chains/chainInfo'

export function getExplorerLink(chainId: SupportedChainId, type: 'transaction' | 'address', data: string): string {
  const baseURL = ChainInfo[chainId].blockExplorerUrl

  switch (type) {
    case 'transaction':
      return `${baseURL}/tx/${data}`
    case 'address':
      return `${baseURL}/address/${data}`
  }
}
