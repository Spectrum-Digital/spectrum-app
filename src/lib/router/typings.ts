import { ContractFunctionResult, GetFunctionArgs } from 'viem'
import { SPECTRUM_ROUTER_ABI } from './abi/SPECTRUM_ROUTER_ABI'

export type BytesLike = `0x${string}`

export type Token = { address: BytesLike; chainId: number; decimals: number }

export enum SupportedChainId {
  // MAINNET = 1,
  BASE = 8453,
}

export type GetAmountsOut = 'address[]' | 'from_to_stable' | 'from_to_stable_factory'
export type GetPair = 'getPair_A_B' | 'pairFor_A_B_stable' | 'getPool_A_B_stable'
export type GetReserves = 'getReserves_112_112_32' | 'getReserves_112_112_16_16' | 'getReserves_256_256_256'

export type DEXRouter = {
  name: string
  address: BytesLike
  factory: BytesLike
  getAmountsOut: GetAmountsOut
  getPair: GetPair
  getReserves: GetReserves
}

export type UserHops<TType extends GetAmountsOut> = Array<
  TType extends 'address[]'
    ? Token
    : TType extends 'from_to_stable' | 'from_to_stable_factory'
    ? {
        to: Token
        stable: boolean
      }
    : never
>

export type Hops = Array<{
  router: DEXRouter
  path: Array<{
    from: Token
    to: Token
    stable: boolean
    factory: BytesLike
  }>
}>

export type MultiPath = Hops[number]['path']
export type Path = MultiPath[number]

export type Legs = Array<{ router: DEXRouter; path: Path }>
export type Leg = Legs[number]

export type RouterErrorCode = 'NO_CANDIDATES_FOUND' | 'UNNECESSARY_REQUEST' | 'UNKNOWN_CHAIN_ID'

export type GetAmountsOutCandidatesReturnValue = ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getAmountsOutCandidates'>
export type GetAmountsOutReturnValue = ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getAmountsOut'>
export type GetPoolRequestCandidatesReturnValue = ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequestsCandidates'>
export type GetPoolRequestReturnValue = ContractFunctionResult<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequests'>

// The below types ensure that any ABI changes are picked up by the compiler because
// GetFunctionArgs/ContractFunctionResult aren't actively type checking for the functionName
type NonOptionalKeys<T> = { [k in keyof T]-?: undefined extends T[k] ? never : k }[keyof T]

type _GetAmountsOutCandidatesArgs = GetFunctionArgs<typeof SPECTRUM_ROUTER_ABI, 'getAmountsOutCandidates'>
export type GetAmountsOutCandidatesArgs = NonOptionalKeys<_GetAmountsOutCandidatesArgs> extends never
  ? never
  : _GetAmountsOutCandidatesArgs['args']

type _GetAmountsOutArgs = GetFunctionArgs<typeof SPECTRUM_ROUTER_ABI, 'getAmountsOut'>
export type GetAmountsOutArgs = NonOptionalKeys<_GetAmountsOutArgs> extends never ? never : _GetAmountsOutArgs['args']

type _GetPoolRequestsCandidatesArgs = GetFunctionArgs<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequestsCandidates'>
export type GetPoolRequestsCandidatesArgs = NonOptionalKeys<_GetPoolRequestsCandidatesArgs> extends never
  ? never
  : _GetPoolRequestsCandidatesArgs['args']

type _GetPoolRequestsArgs = GetFunctionArgs<typeof SPECTRUM_ROUTER_ABI, 'getPoolRequests'>
export type GetPoolRequestsArgs = NonOptionalKeys<_GetPoolRequestsArgs> extends never ? never : _GetPoolRequestsArgs['args']
