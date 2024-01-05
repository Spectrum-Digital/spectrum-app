import { useMemo } from 'react'
import z from 'zod'
import { useQuery } from '@tanstack/react-query'
import { MinimalToken } from '@/typings'

const Validator = z.object({
  success: z.boolean(),
  data: z.array(z.string()),
})

export function useTokenRouter(tokenIn: MinimalToken, tokenOut: MinimalToken): string[] {
  const { data } = useQuery({
    queryKey: ['tokenRouter', { tokenIn, tokenOut }],
    queryFn: async () => {
      const url = new URL(process.env.NEXT_PUBLIC_ROUTER_API_URL!)
      url.pathname = '/v1/path'
      url.searchParams.append('tokenIn', tokenIn.address)
      url.searchParams.append('tokenOut', tokenOut.address)
      url.searchParams.append('chainId', tokenIn.chainId.toString())

      const result = await fetch(url).then(res => res.json())
      const parsed = Validator.safeParse(result)
      return parsed.success ? parsed.data.data : []
    },
  })

  return useMemo(() => data ?? [], [data])
}
