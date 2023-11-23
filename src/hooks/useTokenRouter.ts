import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Path, PathsValidator } from '@/lib/router'

import { getBaseUrl } from '@/utils/url'
import { MinimalToken } from '@/typings'

export function useTokenRouter(tokenIn: MinimalToken, tokenOut: MinimalToken): Path[] {
  const { data } = useQuery({
    queryKey: ['tokenRouter', { tokenIn, tokenOut }],
    queryFn: async () => {
      const url = new URL(`${getBaseUrl()}/api/router`)
      url.searchParams.set('tokenIn', tokenIn.address)
      url.searchParams.set('tokenOut', tokenOut.address)
      url.searchParams.set('chainId', tokenOut.chainId.toString())
      const result = await fetch(url).then(res => res.json())
      const parsed = PathsValidator.safeParse(result)
      return parsed.success ? parsed.data : []
    },
  })

  return useMemo(() => (data ? data : []), [data])
}
