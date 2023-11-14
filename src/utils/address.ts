import { BytesLike } from '@/typings'

export function truncateAddress(address: BytesLike, chars = 4) {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

export function truncateHash(hash: BytesLike, chars = 4) {
  return `${hash.substring(0, chars + 2)}...${hash.substring(64 - chars)}`
}
