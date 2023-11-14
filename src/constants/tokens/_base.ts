import bnbLogo from '@/assets/images/tokens/bnb.svg'
import busdtLogo from '@/assets/images/tokens/busdt.png'
import ethLogo from '@/assets/images/tokens/eth.png'
import ftmLogo from '@/assets/images/tokens/ftm.svg'
import token from '@/assets/images/icons/token.svg'
import usdcLogo from '@/assets/images/tokens/usdc.svg'
import usdbcLogo from '@/assets/images/tokens/usdbc.svg'
import usdplusLogo from '@/assets/images/tokens/usdplus.svg'
import usdtLogo from '@/assets/images/tokens/usdt.png'
import { BaseToken } from '@/typings'

export enum TokenName {
  // Native currencies
  NATIVE_BINANCE = 'NATIVE_BINANCE',
  NATIVE_ETHEREUM = 'NATIVE_ETHEREUM',
  NATIVE_FANTOM = 'NATIVE_FANTOM',
  // Wrapped Tokens
  WRAPPED_BINANCE = 'WRAPPED_BINANCE',
  WRAPPED_ETHEREUM = 'WRAPPED_ETHEREUM',
  WRAPPED_FANTOM = 'WRAPPED_FANTOM',
  // LP Tokens
  LIQUIDITY_V2 = 'LIQUIDITY_V2',
  // Stablecoins
  STABLECOIN_BSC_USD = 'STABLECOIN_BSC_USD',
  STABLECOIN_USDC = 'STABLECOIN_USDC',
  STABLECOIN_USDbC = 'STABLECOIN_USDbC',
  STABLECOIN_USDplus = 'STABLECOIN_USDplus',
  STABLECOIN_USDT = 'STABLECOIN_USDT',
  // Tokens
}

export const BaseTokens: {
  [name in TokenName]: BaseToken
} = {
  // Native currencies
  [TokenName.NATIVE_BINANCE]: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    logo: bnbLogo,
    native: true,
  },
  [TokenName.NATIVE_ETHEREUM]: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    logo: ethLogo,
    native: true,
  },
  [TokenName.NATIVE_FANTOM]: {
    name: 'FTM',
    symbol: 'FTM',
    decimals: 18,
    logo: ftmLogo,
    native: true,
  },
  // Wrapped tokens
  [TokenName.WRAPPED_BINANCE]: {
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    decimals: 18,
    logo: bnbLogo,
    wrapped: true,
  },
  [TokenName.WRAPPED_ETHEREUM]: {
    name: 'Wrapped ETH',
    symbol: 'WETH',
    decimals: 18,
    logo: ethLogo,
    wrapped: true,
  },
  [TokenName.WRAPPED_FANTOM]: {
    name: 'Wrapped FTM',
    symbol: 'WFTM',
    decimals: 18,
    logo: ftmLogo,
    wrapped: true,
  },
  // LP Token
  [TokenName.LIQUIDITY_V2]: {
    name: 'LP Token',
    symbol: 'LP',
    decimals: 18,
    logo: token,
  },
  // Stablecoins
  [TokenName.STABLECOIN_BSC_USD]: {
    name: 'BUSDT',
    symbol: 'BSC-USD',
    decimals: 18,
    logo: busdtLogo,
    stablecoin: true,
  },
  [TokenName.STABLECOIN_USDC]: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    logo: usdcLogo,
    stablecoin: true,
  },
  [TokenName.STABLECOIN_USDbC]: {
    name: 'USD Base Coin',
    symbol: 'USDbC',
    decimals: 6,
    logo: usdbcLogo,
    stablecoin: true,
  },
  [TokenName.STABLECOIN_USDplus]: {
    name: 'USD+',
    symbol: 'USD+',
    decimals: 6,
    logo: usdplusLogo,
    stablecoin: true,
  },
  [TokenName.STABLECOIN_USDT]: {
    name: 'USDT',
    symbol: 'USDT',
    decimals: 6,
    logo: usdtLogo,
    stablecoin: true,
  },
}
