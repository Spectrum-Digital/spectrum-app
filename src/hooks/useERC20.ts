import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount, useContractRead, useBalance as useBalanceHook } from 'wagmi'

import { BytesLike, MinimalToken } from '@/typings'
import { SupportedChainId } from '@/constants/chains'
import { ERC20_ABI } from '@/constants/abi/ERC20_ABI'

export function useBalance(chainId: SupportedChainId, tokenAddress?: BytesLike) {
  const { address } = useAccount()

  const result = useBalanceHook({
    address,
    chainId,
    watch: true,
    token: tokenAddress,
  })

  return useMemo(
    () => ({
      ...result,
      balance: result.data ? result.data.formatted : '0',
    }),
    [result],
  )
}

export function useTotalSupply(token: MinimalToken): {
  totalSupply: BigNumber
  totalSupplyRaw: BigNumber
} {
  const { address } = useAccount()

  const { data, isError, error } = useContractRead({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
    watch: true,
    enabled: Boolean(address),
    chainId: token.chainId,
  })

  useEffect(() => {
    if (isError && error) {
      console.error(error)
    }
  }, [isError, error])

  return useMemo(
    () => ({
      totalSupply: data ? new BigNumber(data.toString()).shiftedBy(-token.decimals) : new BigNumber(0),
      totalSupplyRaw: data ? new BigNumber(data.toString()) : new BigNumber(0),
    }),
    [data, token],
  )
}
