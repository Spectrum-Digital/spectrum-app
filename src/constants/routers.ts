import { DEXRouter } from '@/lib/router'

export const DEXRouters = {
  ARBITRUM_CAMELOT: {
    name: 'Camelot',
    address: '0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
    factory: '0x6EcCab422D763aC031210895C81787E87B43A652',
    getAmountsOut: 'address[]',
    getPair: 'getPair_A_B',
    getReserves: 'getReserves_112_112_16_16',
  },
  BASE_AERODROME_V2: {
    name: 'Aerodrome V2',
    address: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
    factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
    getAmountsOut: 'from_to_stable_factory',
    getPair: 'getPool_A_B_stable',
    getReserves: 'getReserves_256_256_256',
  },
  BINANCE_PANCAKESWAP_V2: {
    name: 'Pancakeswap V2',
    address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    getAmountsOut: 'address[]',
    getPair: 'getPair_A_B',
    getReserves: 'getReserves_112_112_32',
  },
  FANTOM_SPOOKYSWAP_V2: {
    name: 'Spookyswap V2',
    address: '0xF491e7B69E4244ad4002BC14e878a34207E38c29',
    factory: '0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3',
    getAmountsOut: 'address[]',
    getPair: 'getPair_A_B',
    getReserves: 'getReserves_112_112_32',
  },
  MAINNET_UNISWAP_V2: {
    name: 'Uniswap V2',
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    getAmountsOut: 'address[]',
    getPair: 'getPair_A_B',
    getReserves: 'getReserves_112_112_32',
  },
} satisfies Record<string, DEXRouter>
