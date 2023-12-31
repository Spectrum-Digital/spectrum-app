import { useMemo } from 'react'
import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js'

export function useSearch<TItem extends { [key: string]: any }>(query: string, list: Array<TItem>, keys: Array<keyof TItem>): TItem[] {
  const fuse = useMemo(() => {
    const options = {
      keys: keys as FuseOptionKey<TItem>[],
      isCaseSensitive: false,
      threshold: 0.2,
    } satisfies IFuseOptions<TItem>

    return new Fuse(list, options, Fuse.createIndex(options.keys, list))
  }, [list, keys])

  return useMemo(() => (query ? fuse.search(query).map(o => o.item) : list), [fuse, query, list])
}
