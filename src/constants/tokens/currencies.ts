import { Token } from '@/typings'
import { SupportedChainId } from '@/constants/chains'
import { BaseTokens, TokenName } from './_base'
import { Tokens } from './tokens'

const Currencies = {
  NATIVE_ARBITRUM: {
    ...BaseTokens[TokenName.NATIVE_ETHEREUM],
    chainId: SupportedChainId.ARBITRUM,
    address: '0x0000000000000000000000000000000000000000',
  },
  NATIVE_BASE: {
    ...BaseTokens[TokenName.NATIVE_ETHEREUM],
    chainId: SupportedChainId.BASE,
    address: '0x0000000000000000000000000000000000000000',
  },
  NATIVE_BINANCE: {
    ...BaseTokens[TokenName.NATIVE_BINANCE],
    chainId: SupportedChainId.BINANCE,
    address: '0x0000000000000000000000000000000000000000',
  },
  NATIVE_FANTOM: {
    ...BaseTokens[TokenName.NATIVE_FANTOM],
    chainId: SupportedChainId.FANTOM,
    address: '0x0000000000000000000000000000000000000000',
  },
  NATIVE_MAINNET: {
    ...BaseTokens[TokenName.NATIVE_ETHEREUM],
    chainId: SupportedChainId.MAINNET,
    address: '0x0000000000000000000000000000000000000000',
  },
  NATIVE_OPTIMISM: {
    ...BaseTokens[TokenName.NATIVE_ETHEREUM],
    chainId: SupportedChainId.OPTIMISM,
    address: '0x0000000000000000000000000000000000000000',
  },
} satisfies Record<string, Token>

export const NATIVE_CURRENCIES: {
  [chainId in SupportedChainId]: Token
} = {
  [SupportedChainId.ARBITRUM]: Currencies.NATIVE_ARBITRUM,
  [SupportedChainId.BASE]: Currencies.NATIVE_BASE,
  [SupportedChainId.BINANCE]: Currencies.NATIVE_BINANCE,
  [SupportedChainId.FANTOM]: Currencies.NATIVE_FANTOM,
  [SupportedChainId.MAINNET]: Currencies.NATIVE_MAINNET,
  [SupportedChainId.OPTIMISM]: Currencies.NATIVE_OPTIMISM,
}

export const NATIVE_TO_WRAPPED: {
  [chainId in SupportedChainId]: Token
} = {
  [SupportedChainId.ARBITRUM]: Tokens.WRAPPED_ARBITRUM,
  [SupportedChainId.BASE]: Tokens.WRAPPED_BASE,
  [SupportedChainId.BINANCE]: Tokens.WRAPPED_BINANCE,
  [SupportedChainId.FANTOM]: Tokens.WRAPPED_FANTOM,
  [SupportedChainId.MAINNET]: Tokens.WRAPPED_MAINNET,
  [SupportedChainId.OPTIMISM]: Tokens.WRAPPED_OPTIMISM,
}
