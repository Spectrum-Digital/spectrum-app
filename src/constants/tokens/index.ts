import { BytesLike, Token } from '@/typings'
import { getBaseUrl } from '@/utils/url'
import { SupportedChainId } from '@/constants/chains'

import { WRAPPED } from './wrapped'
import { STABLE } from './stablecoins'
import { Tokens } from './tokens'

const transformTokenURIExternal = (token: Token) => ({
  ...token,
  logoURI: `${getBaseUrl()}/images/tokens/${token.logoURI}`,
})

const transformTokenURIInternal = (token: Token) => ({
  ...token,
  logoURI: `/images/tokens/${token.logoURI}`,
})

const getTokensByChainId = (chainId: SupportedChainId): Token[] => {
  const wrapped = WRAPPED[chainId]
  const stablecoins = STABLE[chainId]
  const tokens = Tokens[chainId]
  return [wrapped, ...Object.values(stablecoins), ...Object.values(tokens)]
}

export function getTokenByAddress(address: BytesLike, chainId: SupportedChainId): Token | undefined {
  return tokens[chainId].find(token => token.address.toLowerCase() === address.toLowerCase())
}

export function getWeightedNodes(chainId: SupportedChainId): BytesLike[] {
  const stables = STABLE[chainId]
  const wrapped = WRAPPED[chainId]
  return [wrapped.address, ...Object.values(stables).map(stable => stable.address)]
}

export const tokens: { [chainId in SupportedChainId]: Token[] } = {
  [SupportedChainId.ARBITRUM]: getTokensByChainId(SupportedChainId.ARBITRUM).map(transformTokenURIInternal),
  [SupportedChainId.BASE]: getTokensByChainId(SupportedChainId.BASE).map(transformTokenURIInternal),
  [SupportedChainId.BINANCE]: getTokensByChainId(SupportedChainId.BINANCE).map(transformTokenURIInternal),
  [SupportedChainId.FANTOM]: getTokensByChainId(SupportedChainId.FANTOM).map(transformTokenURIInternal),
  [SupportedChainId.MAINNET]: getTokensByChainId(SupportedChainId.MAINNET).map(transformTokenURIInternal),
  [SupportedChainId.OPTIMISM]: getTokensByChainId(SupportedChainId.OPTIMISM).map(transformTokenURIInternal),
}

export const externalTokens: { [chainId in SupportedChainId]: Token[] } = {
  [SupportedChainId.ARBITRUM]: getTokensByChainId(SupportedChainId.ARBITRUM).map(transformTokenURIExternal),
  [SupportedChainId.BASE]: getTokensByChainId(SupportedChainId.BASE).map(transformTokenURIExternal),
  [SupportedChainId.BINANCE]: getTokensByChainId(SupportedChainId.BINANCE).map(transformTokenURIExternal),
  [SupportedChainId.FANTOM]: getTokensByChainId(SupportedChainId.FANTOM).map(transformTokenURIExternal),
  [SupportedChainId.MAINNET]: getTokensByChainId(SupportedChainId.MAINNET).map(transformTokenURIExternal),
  [SupportedChainId.OPTIMISM]: getTokensByChainId(SupportedChainId.OPTIMISM).map(transformTokenURIExternal),
}
