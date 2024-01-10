import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useContractRead } from 'wagmi'
import { Path, SpectrumContract } from '@spectrum-digital/spectrum-router'

import { MinimalToken } from '@/typings'
import { useOptimalPathAPI } from './useSpectrumRouter'

export function useLiquidityAdjustedPrice(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
): {
  price: BigNumber
  path: Path
} {
  const path = useOptimalPathAPI(tokenIn, tokenOut, '1')

  const params = useMemo(
    () => SpectrumContract.getAmountsOut(tokenIn.chainId, tokenIn.address, tokenOut.address, '1', [path]),
    [tokenIn, tokenOut, path],
  )

  const { data } = useContractRead({
    address: params.error ? undefined : params.payload.address,
    abi: params.error ? undefined : params.payload.abi,
    functionName: params.error ? undefined : params.payload.functionName,
    args: params.error ? undefined : params.payload.args,
    chainId: tokenIn.chainId,
    watch: true,
    enabled: Boolean(!params.error),
  })

  return useMemo(() => {
    if (params.error) {
      return { price: new BigNumber(0), path: [] }
    } else {
      const parsed = params.parse('highest', data)
      return {
        price: parsed.amountsOut,
        path: parsed.path,
      }
    }
  }, [data, params])
}

export function useSpotPrice(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
): {
  price: BigNumber
  path: Path
} {
  const path = useOptimalPathAPI(tokenIn, tokenOut, '1')

  const params = useMemo(
    () => SpectrumContract.getPrice(tokenIn.chainId, tokenIn.address, tokenOut.address, path ?? ''),
    [tokenIn, tokenOut, path],
  )

  const { data } = useContractRead({
    address: params.error ? undefined : params.payload.address,
    abi: params.error ? undefined : params.payload.abi,
    functionName: params.error ? undefined : params.payload.functionName,
    args: params.error ? undefined : params.payload.args,
    chainId: tokenIn.chainId,
    watch: true,
    enabled: Boolean(!params.error),
  })

  return useMemo(() => {
    if (params.error) {
      return { price: new BigNumber(0), path: [] }
    } else {
      const parsed = params.parse(data)
      return {
        price: parsed.price,
        path: parsed.path,
      }
    }
  }, [data, params])
}
