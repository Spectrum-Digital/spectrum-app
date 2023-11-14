import { SupportedChainId } from '@/constants/chains'
import { BytesLike, Token } from '@/typings'
import { TokenName, BaseTokens } from './_base'

export const Tokens = {
  // Wrapped Tokens
  WRAPPED_ARBITRUM: {
    ...BaseTokens[TokenName.WRAPPED_ETHEREUM],
    chainId: SupportedChainId.ARBITRUM,
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  WRAPPED_BASE: {
    ...BaseTokens[TokenName.WRAPPED_ETHEREUM],
    chainId: SupportedChainId.BASE,
    address: '0x4200000000000000000000000000000000000006',
  },
  WRAPPED_BINANCE: {
    ...BaseTokens[TokenName.WRAPPED_BINANCE],
    chainId: SupportedChainId.BINANCE,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  },
  WRAPPED_MAINNET: {
    ...BaseTokens[TokenName.WRAPPED_ETHEREUM],
    chainId: SupportedChainId.MAINNET,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  WRAPPED_FANTOM: {
    ...BaseTokens[TokenName.WRAPPED_FANTOM],
    chainId: SupportedChainId.FANTOM,
    address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  },
  WRAPPED_OPTIMISM: {
    ...BaseTokens[TokenName.WRAPPED_ETHEREUM],
    chainId: SupportedChainId.OPTIMISM,
    address: '0x4200000000000000000000000000000000000006',
  },
  // Stablecoins -> Arbitrum
  STABLECOIN_ARBITRUM_USDC: {
    ...BaseTokens[TokenName.STABLECOIN_USDC],
    chainId: SupportedChainId.ARBITRUM,
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
  // Stablecoins -> Base
  STABLECOIN_BASE_USDplus: {
    ...BaseTokens[TokenName.STABLECOIN_USDplus],
    chainId: SupportedChainId.BASE,
    address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
  },
  STABLECOIN_BASE_USDbC: {
    ...BaseTokens[TokenName.STABLECOIN_USDbC],
    chainId: SupportedChainId.BASE,
    address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
  },
  STABLECOIN_BASE_USDC: {
    ...BaseTokens[TokenName.STABLECOIN_USDC],
    chainId: SupportedChainId.BASE,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  // Stablecoins -> Binance
  STABLECOIN_BINANCE_BSC_USD: {
    ...BaseTokens[TokenName.STABLECOIN_BSC_USD],
    chainId: SupportedChainId.BINANCE,
    address: '0x55d398326f99059fF775485246999027B3197955',
  },
  // Stablecoins -> Fantom
  STABLECOIN_FANTOM_USDC: {
    ...BaseTokens[TokenName.STABLECOIN_USDC],
    chainId: SupportedChainId.FANTOM,
    address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  },
  // Stablecoins -> Optimism
  STABLECOIN_OPTIMISM_USDC: {
    ...BaseTokens[TokenName.STABLECOIN_USDC],
    chainId: SupportedChainId.OPTIMISM,
    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  },
  // Stablecoins -> Mainnet
  STABLECOIN_MAINNET_USDC: {
    ...BaseTokens[TokenName.STABLECOIN_USDC],
    chainId: SupportedChainId.MAINNET,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
} satisfies Record<string, Token>

export function getTokenByAddressChainId(address: BytesLike, chainId: SupportedChainId): Token | undefined {
  return Object.values(Tokens).find(token => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId)
}
