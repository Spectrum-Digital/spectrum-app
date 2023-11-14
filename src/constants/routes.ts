import Router from '@/lib/router'

import { Tokens } from './tokens/tokens'
import { DEXRouters } from './routers'

export const SpectrumRouter = new Router()

/**
 * The SpectrumRouter can grow too large in memory + RAM consumption if an unneccesary
 * number of hops are defined for a given route. It is for this reason recommended to
 * strictly route hops towards WrappedNative on a given DEX. For any given route, you
 * can assume that the inverse path can also be traversed automatically. For example:
 *
 * Route 1: A -> B
 * Route 2: B -> C
 * A path from A -> C will exist.
 *
 * Route 1: A -> B
 * Route 2: A -> C
 * A path from C -> B will exist.
 */

// ARBITRUM -> WRAPPED TO STABLECOIN ROUTES
SpectrumRouter.start(Tokens.WRAPPED_ARBITRUM).hop(DEXRouters.ARBITRUM_CAMELOT, [Tokens.STABLECOIN_ARBITRUM_USDC]).end()

// BASE CHAIN -> WRAPPED TO STABLECOIN ROUTES
SpectrumRouter.start(Tokens.WRAPPED_BASE)
  .hop(DEXRouters.BASE_AERODROME_V2, [{ to: Tokens.STABLECOIN_BASE_USDbC, stable: false }])
  .end()

// BASE CHAIN -> STABLE TO STABLE ROUTES
SpectrumRouter.start(Tokens.STABLECOIN_BASE_USDplus)
  .hop(DEXRouters.BASE_AERODROME_V2, [{ to: Tokens.STABLECOIN_BASE_USDbC, stable: true }])
  .end()

SpectrumRouter.start(Tokens.STABLECOIN_BASE_USDbC)
  .hop(DEXRouters.BASE_AERODROME_V2, [{ to: Tokens.STABLECOIN_BASE_USDC, stable: true }])
  .end()

// const BINANCE_FROM_WRAPPED = SpectrumRouter.spawn(Tokens.WRAPPED_BINANCE)
//   .hop(DEXRouters.BINANCE_PANCAKESWAP_V2, [Tokens.STABLECOIN_BINANCE_BSC_USD])
//   .define()

// const FANTOM_FROM_WRAPPED = SpectrumRouter.spawn(Tokens.WRAPPED_FANTOM)
//   .hop(DEXRouters.FANTOM_SPOOKYSWAP_V2, [Tokens.STABLECOIN_FANTOM_USDC])
//   .define()

// const MAINNET_FROM_WRAPPED = SpectrumRouter.spawn(Tokens.WRAPPED_MAINNET)
//   .hop(DEXRouters.MAINNET_UNISWAP_V2, [Tokens.STABLECOIN_MAINNET_USDC])
//   .define()
