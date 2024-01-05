import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useContractRead } from 'wagmi'
import { Path, SpectrumContract } from '@spectrum-digital/spectrum-router'

import { MinimalToken } from '@/typings'
import { useAmountsOut } from './useAmountsOut'
import { useTokenRouter } from './useTokenRouter'

export function useLiquidityAdjustedPrice(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
): {
  error: string
  price: BigNumber
  path: Path
  compressedPath: string
  considered: number
} {
  const paths = useTokenRouter(tokenIn, tokenOut)
  const result = useAmountsOut(tokenIn, tokenOut, '1', paths)

  return useMemo(
    () => ({
      error: result.error,
      price: result.amountsOut,
      path: result.path,
      compressedPath: result.compressedPath,
      considered: paths.length,
    }),
    [result, paths],
  )
}

export function useSpotPrice(
  tokenIn: MinimalToken,
  tokenOut: MinimalToken,
): {
  error: string
  price: BigNumber
  path: Path
} {
  const { path, compressedPath } = useLiquidityAdjustedPrice(tokenIn, tokenOut)

  const params = useMemo(
    () => SpectrumContract.getPrice(tokenIn.chainId, tokenIn, tokenOut, compressedPath),
    [tokenIn, tokenOut, compressedPath],
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
      return { error: '', price: new BigNumber(1), path: [] }
    } else {
      return {
        error: params.errorCode ?? '',
        price: params.parse(data),
        path: path,
      }
    }
  }, [tokenIn, tokenOut, data, params, path])
}
