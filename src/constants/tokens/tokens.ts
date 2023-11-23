import type { Token } from '@/typings'
import { SupportedChainId } from '../chains'
import { checksum } from './utils'

export const Tokens = {
  [SupportedChainId.ARBITRUM]: checksum({}),
  [SupportedChainId.BASE]: checksum({
    AERO: {
      name: 'AERO',
      symbol: 'AERO',
      decimals: 18,
      logoURI: 'aerodrome.svg',
      chainId: SupportedChainId.BASE,
      address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    },
  }),
  [SupportedChainId.BINANCE]: checksum({}),
  [SupportedChainId.FANTOM]: checksum({}),
  [SupportedChainId.OPTIMISM]: checksum({}),
  [SupportedChainId.MAINNET]: checksum({}),
} satisfies {
  [chainId in SupportedChainId]: Record<string, Token>
}
