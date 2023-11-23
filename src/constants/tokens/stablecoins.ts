import type { BaseToken, Token } from '@/typings'
import { SupportedChainId } from '@/constants/chains'
import { checksum } from './utils'

const STABLECOIN_USDC: BaseToken = {
  name: 'USDC',
  symbol: 'USDC',
  decimals: 6,
  logoURI: 'usdc.svg',
  stablecoin: true,
}

const STABLECOIN_BSC_USD: BaseToken = {
  name: 'BUSDT',
  symbol: 'BSC-USD',
  decimals: 18,
  logoURI: 'bsc-usd.png',
  stablecoin: true,
}

const STABLECOIN_USDbC: BaseToken = {
  name: 'USD Base Coin',
  symbol: 'USDbC',
  decimals: 6,
  logoURI: 'usdbc.svg',
  stablecoin: true,
}

const STABLECOIN_USD_PLUS: BaseToken = {
  name: 'USD+',
  symbol: 'USD+',
  decimals: 6,
  logoURI: 'usd_plus.svg',
  stablecoin: true,
}

const STABLECOIN_USDT: BaseToken = {
  name: 'USDT',
  symbol: 'USDT',
  decimals: 6,
  logoURI: 'usdt.png',
  stablecoin: true,
}

export const STABLE = {
  [SupportedChainId.ARBITRUM]: checksum({
    STABLECOIN_USDC: {
      ...STABLECOIN_USDC,
      chainId: SupportedChainId.ARBITRUM,
      address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    },
  }),
  [SupportedChainId.BASE]: checksum({
    STABLECOIN_USD_PLUS: {
      ...STABLECOIN_USD_PLUS,
      chainId: SupportedChainId.BASE,
      address: '0xb79dd08ea68a908a97220c76d19a6aa9cbde4376',
    },
    STABLECOIN_USDbC: {
      ...STABLECOIN_USDbC,
      chainId: SupportedChainId.BASE,
      address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    },
    STABLECOIN_USDC: {
      ...STABLECOIN_USDC,
      chainId: SupportedChainId.BASE,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  }),
  [SupportedChainId.BINANCE]: checksum({
    STABLECOIN_BSC_USD: {
      ...STABLECOIN_BSC_USD,
      chainId: SupportedChainId.BINANCE,
      address: '0x55d398326f99059fF775485246999027B3197955',
    },
  }),
  [SupportedChainId.FANTOM]: checksum({
    STABLECOIN_USDC: {
      ...STABLECOIN_USDC,
      chainId: SupportedChainId.FANTOM,
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    },
  }),
  [SupportedChainId.OPTIMISM]: checksum({
    STABLECOIN_USDC: {
      ...STABLECOIN_USDC,
      chainId: SupportedChainId.OPTIMISM,
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    },
  }),
  [SupportedChainId.MAINNET]: checksum({
    STABLECOIN_USDC: {
      ...STABLECOIN_USDC,
      chainId: SupportedChainId.MAINNET,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    STABLECOIN_USDT: {
      ...STABLECOIN_USDT,
      chainId: SupportedChainId.MAINNET,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
  }),
} satisfies {
  [chainId in SupportedChainId]: Record<string, Token>
}

export const PRIMARY_STABLECOIN: {
  [chainId in SupportedChainId]: Token
} = {
  [SupportedChainId.ARBITRUM]: STABLE[SupportedChainId.ARBITRUM].STABLECOIN_USDC,
  [SupportedChainId.BASE]: STABLE[SupportedChainId.BASE].STABLECOIN_USDbC,
  [SupportedChainId.BINANCE]: STABLE[SupportedChainId.BINANCE].STABLECOIN_BSC_USD,
  [SupportedChainId.FANTOM]: STABLE[SupportedChainId.FANTOM].STABLECOIN_USDC,
  [SupportedChainId.MAINNET]: STABLE[SupportedChainId.MAINNET].STABLECOIN_USDC,
  [SupportedChainId.OPTIMISM]: STABLE[SupportedChainId.OPTIMISM].STABLECOIN_USDC,
}
