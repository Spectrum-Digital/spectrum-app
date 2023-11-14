import { BytesLike, SupportedChainId } from './typings'

export const RouterAddresses: { [chainId in SupportedChainId]: BytesLike } = {
  [SupportedChainId.BASE]: '0x23629dDF11D082f9f6911F46f45a08e8d1aC81Aa',
}
