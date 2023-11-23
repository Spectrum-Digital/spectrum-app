import { getAddress } from 'viem'
import { Token } from '@/typings'

const typeSafeObjectEntries = <T extends Record<PropertyKey, unknown>>(obj: T): { [K in keyof T]: [K, T[K]] }[keyof T][] => {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][]
}

export function checksum<TKey extends string>(map: Record<TKey, Token>) {
  return typeSafeObjectEntries(map).reduce(
    (acc, [key, value]) => {
      acc[key as TKey] = {
        ...value,
        address: getAddress(value.address),
      }
      return acc
    },
    {} as Record<TKey, Token>,
  )
}
