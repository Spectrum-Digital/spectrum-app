import { getAddress } from 'viem'

import type { BaseToken, Token } from '@/typings'
import { SupportedChainId } from '@/constants/chains'

const WRAPPED_BINANCE: BaseToken = {
  name: 'Wrapped BNB',
  symbol: 'WBNB',
  decimals: 18,
  logoURI: 'bnb.svg',
  wrapped: true,
}

const WRAPPED_ETHEREUM: BaseToken = {
  name: 'Wrapped ETH',
  symbol: 'WETH',
  decimals: 18,
  logoURI: 'eth.png',
  wrapped: true,
}

const WRAPPED_FANTOM: BaseToken = {
  name: 'Wrapped FTM',
  symbol: 'WFTM',
  decimals: 18,
  logoURI: 'ftm.svg',
  wrapped: true,
}

export const WRAPPED: {
  [chainId in SupportedChainId]: Token
} = {
  [SupportedChainId.ARBITRUM]: {
    ...WRAPPED_ETHEREUM,
    chainId: SupportedChainId.ARBITRUM,
    address: getAddress('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'),
  },
  [SupportedChainId.BASE]: {
    ...WRAPPED_ETHEREUM,
    chainId: SupportedChainId.BASE,
    address: getAddress('0x4200000000000000000000000000000000000006'),
  },
  [SupportedChainId.BINANCE]: {
    ...WRAPPED_BINANCE,
    chainId: SupportedChainId.BINANCE,
    address: getAddress('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'),
  },
  [SupportedChainId.FANTOM]: {
    ...WRAPPED_FANTOM,
    chainId: SupportedChainId.FANTOM,
    address: getAddress('0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83'),
  },
  [SupportedChainId.MAINNET]: {
    ...WRAPPED_ETHEREUM,
    chainId: SupportedChainId.MAINNET,
    address: getAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
  },
  [SupportedChainId.OPTIMISM]: {
    ...WRAPPED_ETHEREUM,
    chainId: SupportedChainId.OPTIMISM,
    address: getAddress('0x4200000000000000000000000000000000000006'),
  },
}
