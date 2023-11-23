import { useMemo } from 'react'
import { useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Path, SpectrumContract } from '@/lib/router'

import { MinimalToken } from '@/typings'

export function useAmountsOut(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
  amountIn: string | BigNumber,
  paths: Path[],
): {
  error: string
  amountsOut: BigNumber
  path: Path
} {
  const amountInRaw = useMemo(() => new BigNumber(amountIn).shiftedBy(tokenIn.decimals), [amountIn, tokenIn])

  const params = useMemo(
    () => SpectrumContract.getAmountsOut(tokenIn, tokenOut, amountInRaw, paths),
    [tokenIn, tokenOut, amountInRaw, paths],
  )

  const { data } = useContractRead({
    address: params.payload.address,
    abi: params.payload.abi,
    functionName: params.payload.functionName,
    args: params.payload.args,
    chainId: tokenIn.chainId,
    watch: true,
    enabled: Boolean(!params.error && params.payload.address),
  })

  return useMemo(() => {
    if (tokenIn.address.toLowerCase() === tokenOut.address.toLowerCase()) {
      return { error: '', amountsOut: new BigNumber(amountIn), path: [] }
    } else {
      return {
        error: params.errorCode ?? '',
        ...params.parse('highest', data),
      }
    }
  }, [tokenIn, tokenOut, amountIn, data, params])
}
