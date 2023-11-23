import type { BaseToken, Token } from '@/typings'
import { SupportedChainId } from '@/constants/chains'
import { WRAPPED } from './wrapped'

const NATIVE_BINANCE: BaseToken = {
  name: 'BNB',
  symbol: 'BNB',
  decimals: 18,
  logoURI: 'bnb.svg',
  native: true,
}

const NATIVE_ETHEREUM: BaseToken = {
  name: 'ETH',
  symbol: 'ETH',
  decimals: 18,
  logoURI: 'eth.png',
  native: true,
}

const NATIVE_FANTOM: BaseToken = {
  name: 'FTM',
  symbol: 'FTM',
  decimals: 18,
  logoURI: 'ftm.svg',
  native: true,
}

export const NATIVE: {
  [chainId in SupportedChainId]: Token
} = {
  [SupportedChainId.ARBITRUM]: {
    ...NATIVE_ETHEREUM,
    chainId: SupportedChainId.ARBITRUM,
    address: '0x0000000000000000000000000000000000000000',
  },
  [SupportedChainId.BASE]: {
    ...NATIVE_ETHEREUM,
    chainId: SupportedChainId.BASE,
    address: '0x0000000000000000000000000000000000000000',
  },
  [SupportedChainId.BINANCE]: {
    ...NATIVE_BINANCE,
    chainId: SupportedChainId.BINANCE,
    address: '0x0000000000000000000000000000000000000000',
  },
  [SupportedChainId.FANTOM]: {
    ...NATIVE_FANTOM,
    chainId: SupportedChainId.FANTOM,
    address: '0x0000000000000000000000000000000000000000',
  },
  [SupportedChainId.MAINNET]: {
    ...NATIVE_ETHEREUM,
    chainId: SupportedChainId.MAINNET,
    address: '0x0000000000000000000000000000000000000000',
  },
  [SupportedChainId.OPTIMISM]: {
    ...NATIVE_ETHEREUM,
    chainId: SupportedChainId.OPTIMISM,
    address: '0x0000000000000000000000000000000000000000',
  },
}

export const NATIVE_TO_WRAPPED: {
  [chainId in SupportedChainId]: Token
} = {
  [SupportedChainId.ARBITRUM]: WRAPPED[SupportedChainId.ARBITRUM],
  [SupportedChainId.BASE]: WRAPPED[SupportedChainId.BASE],
  [SupportedChainId.BINANCE]: WRAPPED[SupportedChainId.BINANCE],
  [SupportedChainId.FANTOM]: WRAPPED[SupportedChainId.FANTOM],
  [SupportedChainId.MAINNET]: WRAPPED[SupportedChainId.MAINNET],
  [SupportedChainId.OPTIMISM]: WRAPPED[SupportedChainId.OPTIMISM],
}
