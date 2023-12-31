export enum SupportedChainId {
  ARBITRUM = 42161,
  BASE = 8453,
  BINANCE = 56,
  FANTOM = 250,
  MAINNET = 1,
  OPTIMISM = 10,
}

export const SupportedChainIds: SupportedChainId[] = [
  SupportedChainId.ARBITRUM,
  SupportedChainId.BASE,
  SupportedChainId.BINANCE,
  SupportedChainId.FANTOM,
  SupportedChainId.MAINNET,
  SupportedChainId.OPTIMISM,
]

export const FALLBACK_CHAIN_ID = SupportedChainId.MAINNET
