import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useContractRead } from 'wagmi'
import { Legs } from '@/lib/router'

import { SpectrumRouter } from '@/constants/routes'
import { useAmountsOut } from '@/hooks/useAmountsOut'
import { MinimalToken } from '@/typings'

export function useLiquidityAdjustedPrice(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
): {
  error: string
  price: BigNumber
  route: Legs
} {
  const result = useAmountsOut(tokenIn, tokenOut, '1')
  return useMemo(
    () => ({
      error: result.error,
      price: result.amountsOut,
      route: result.route,
    }),
    [result],
  )
}

export function useSpotPrice(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
): {
  error: string
  price: BigNumber
  route: Legs
} {
  const params = useMemo(() => SpectrumRouter.getPrice(tokenIn, tokenOut), [tokenIn, tokenOut])

  const { data } = useContractRead({
    address: params.payload.address,
    abi: params.payload.abi,
    functionName: params.payload.functionName,
    args: params.payload.args,
    chainId: tokenIn.chainId,
    watch: true,
    enabled: Boolean(!params.error && params.payload.address),
  })

  // useEffect(() => {
  //   if (params.error) {
  //     console.error(params.errorMessage)
  //   }
  // }, [params])

  return useMemo(() => {
    if (tokenIn.address.toLowerCase() === tokenOut.address.toLowerCase()) {
      return { error: '', price: new BigNumber(1), route: [] }
    } else {
      return {
        error: params.errorCode ?? '',
        ...params.parse('highest', data),
      }
    }
  }, [tokenIn, tokenOut, data, params])
}
