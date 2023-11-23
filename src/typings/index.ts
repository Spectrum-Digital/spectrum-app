import { SupportedChainId } from '@/constants/chains'

export type BytesLike = `0x${string}`

export interface BaseToken {
  name: string
  symbol: string
  decimals: number
  logoURI: string
  native?: true
  wrapped?: true
  stablecoin?: true
}

export interface Token extends BaseToken {
  chainId: SupportedChainId
  address: BytesLike
}

export type MinimalToken = { address: BytesLike; chainId: number; decimals: number }
