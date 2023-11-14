import { StaticImageData } from 'next/image'

import arbitrum from '@/assets/images/chains/arbitrum.svg'
import base from '@/assets/images/chains/base.svg'
import binance from '@/assets/images/chains/binance.svg'
import fantom from '@/assets/images/chains/fantom.svg'
import ethereum from '@/assets/images/chains/ethereum.svg'
import optimism from '@/assets/images/chains/optimism.svg'
import { SupportedChainId } from './index'

interface Info {
  chainName: string
  label: string
  icon: StaticImageData
  blockExplorerUrl: string
}

export const ChainInfo: {
  [chainId in SupportedChainId]: Info
} = {
  [SupportedChainId.ARBITRUM]: {
    chainName: 'Arbitrum',
    label: 'Arbitrum',
    icon: arbitrum,
    blockExplorerUrl: 'https://arbiscan.io',
  },
  [SupportedChainId.BASE]: {
    chainName: 'Base',
    label: 'Base',
    icon: base,
    blockExplorerUrl: 'https://basescan.org',
  },
  [SupportedChainId.BINANCE]: {
    chainName: 'BSC',
    label: 'BSC',
    icon: binance,
    blockExplorerUrl: 'https://bscscan.com',
  },
  [SupportedChainId.FANTOM]: {
    chainName: 'Fantom',
    label: 'Fantom',
    icon: fantom,
    blockExplorerUrl: 'https://ftmscan.com',
  },
  [SupportedChainId.MAINNET]: {
    chainName: 'Ethereum',
    label: 'Ethereum',
    icon: ethereum,
    blockExplorerUrl: 'https://etherscan.io',
  },
  [SupportedChainId.OPTIMISM]: {
    chainName: 'Optimism',
    label: 'Optimism',
    icon: optimism,
    blockExplorerUrl: 'https://optimistic.etherscan.io',
  },
}
