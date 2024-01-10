import { useMemo } from 'react'
import z from 'zod'
import { useQuery } from '@tanstack/react-query'
import { MinimalToken } from '@/typings'
import BigNumber from 'bignumber.js'

const PathValidator = z.object({
  success: z.boolean(),
  data: z.string(),
})

const PathsValidator = z.object({
  success: z.boolean(),
  data: z.array(z.string()),
})

const PriceValidator = z.object({
  success: z.boolean(),
  data: z.string(),
})

const BASE_URL = process.env.NEXT_PUBLIC_ROUTER_API_URL!

export function useOptimalPathAPI(tokenIn: MinimalToken, tokenOut: MinimalToken, amountIn: string): string {
  const { data } = useQuery({
    queryKey: ['spectrum-router-path', { tokenIn, tokenOut }],
    queryFn: async () => {
      const url = new URL(BASE_URL)
      url.pathname = '/v1/path'
      url.searchParams.append('tokenIn', tokenIn.address)
      url.searchParams.append('tokenOut', tokenOut.address)
      url.searchParams.append('chainId', tokenIn.chainId.toString())
      url.searchParams.append('amountIn', amountIn)

      const result = await fetch(url).then(res => res.json())
      const parsed = PathValidator.safeParse(result)
      return parsed.success ? parsed.data.data : false
    },
  })

  return useMemo(() => data || '', [data])
}

export function useAvailablePathsAPI(tokenIn: MinimalToken, tokenOut: MinimalToken): string[] {
  const { data } = useQuery({
    queryKey: ['spectrum-router-paths', { tokenIn, tokenOut }],
    queryFn: async () => {
      const url = new URL(BASE_URL)
      url.pathname = '/v1/paths'
      url.searchParams.append('tokenIn', tokenIn.address)
      url.searchParams.append('tokenOut', tokenOut.address)
      url.searchParams.append('chainId', tokenIn.chainId.toString())

      const result = await fetch(url).then(res => res.json())
      const parsed = PathsValidator.safeParse(result)
      return parsed.success ? parsed.data.data : []
    },
  })

  return useMemo(() => data ?? [], [data])
}

export function useSpotPriceAPI(tokenIn: MinimalToken, tokenOut: MinimalToken): BigNumber {
  const { data } = useQuery({
    queryKey: ['spectrum-router-price', { tokenIn, tokenOut }],
    queryFn: async () => {
      const url = new URL(BASE_URL)
      url.pathname = '/v1/price'
      url.searchParams.append('tokenIn', tokenIn.address)
      url.searchParams.append('tokenOut', tokenOut.address)
      url.searchParams.append('chainId', tokenIn.chainId.toString())

      const result = await fetch(url).then(res => res.json())
      const parsed = PriceValidator.safeParse(result)
      return parsed.success ? parsed.data.data : false
    },
  })

  return useMemo(() => new BigNumber(data && parseFloat(data) > 0 ? data : 0), [data])
}
