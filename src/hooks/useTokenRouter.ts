import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Path, PathsValidator } from '@/lib/router'

import { MinimalToken } from '@/typings'

export function useTokenRouter(tokenIn: MinimalToken, tokenOut: MinimalToken): Path[] {
  const { data } = useQuery({
    queryKey: ['tokenRouter', { tokenIn, tokenOut }],
    queryFn: async () => {
      const url = `/api/router?tokenIn=${tokenIn.address}&tokenOut=${tokenOut.address}&chainId=${tokenIn.chainId}`
      const result = await fetch(url).then(res => res.json())
      const parsed = PathsValidator.safeParse(result)
      return parsed.success ? parsed.data : []
    },
  })

  return useMemo(() => (data ? data : []), [data])
}
