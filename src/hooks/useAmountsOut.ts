import { useMemo } from 'react'
import { useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Legs } from '@/lib/router'

import { SpectrumRouter } from '@/constants/routes'
import { MinimalToken } from '@/typings'

export function useAmountsOut(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
  amountIn: string | BigNumber,
): {
  error: string
  amountsOut: BigNumber
  route: Legs
} {
  const amountInRaw = useMemo(() => new BigNumber(amountIn).shiftedBy(tokenIn.decimals), [amountIn, tokenIn])
  const params = useMemo(() => SpectrumRouter.getAmountsOut(tokenIn, tokenOut, amountInRaw), [tokenIn, tokenOut, amountInRaw])

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
      return { error: '', amountsOut: new BigNumber(amountIn), route: [] }
    } else {
      return {
        error: params.errorCode ?? '',
        ...params.parse('highest', data),
      }
    }
  }, [tokenIn, tokenOut, amountIn, data, params])
}
