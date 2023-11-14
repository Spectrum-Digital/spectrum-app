import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'

import { ERC20_ABI } from '@/constants/abi/ERC20_ABI'
import { BytesLike, Token } from '@/typings'

const MAX_ALLOWANCE = new BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935')

type PartialToken = Pick<Token, 'address' | 'symbol' | 'decimals' | 'chainId' | 'native'>

export function useApproveCallback(token: PartialToken, spender: BytesLike, disabled?: boolean) {
  const { allowance, allowanceRaw } = useTokenAllowance(token, spender, Boolean(token.native || disabled))
  const [pendingConfirmation, setPendingConfirmation] = useState(false)
  const [transactionHash, setTransactionHash] = useState<BytesLike | undefined>(undefined)
  const addRecentTransaction = useAddRecentTransaction()

  const { config } = usePrepareContractWrite({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spender, BigInt(MAX_ALLOWANCE.toFixed())],
    enabled: Boolean(!disabled && !token.native),
    chainId: token.chainId,
  })
  const { writeAsync, isLoading } = useContractWrite(config)

  const { isLoading: transactionPending } = useWaitForTransaction({
    hash: transactionHash,
  })

  useEffect(() => {
    if (isLoading) {
      setPendingConfirmation(true)
    } else {
      setPendingConfirmation(false)
    }
  }, [isLoading])

  return useMemo(
    () => ({
      approve: async () => {
        try {
          const result = await writeAsync?.()
          const transactionHash = result?.hash

          if (transactionHash) {
            setTransactionHash(transactionHash)
            addRecentTransaction({
              hash: transactionHash,
              description: `Approve ${token.symbol}`,
            })
          }
        } catch (err) {
          console.error(err)
        }
      },
      allowance,
      allowanceRaw,
      pendingConfirmation,
      transactionPending,
    }),
    [pendingConfirmation, transactionPending, writeAsync, token, allowance, allowanceRaw, addRecentTransaction],
  )
}

function useTokenAllowance(
  token: PartialToken,
  spender: BytesLike,
  overrideMaximum?: boolean,
): {
  allowance: BigNumber
  allowanceRaw: BigNumber
} {
  const { address } = useAccount()

  const result = useContractRead({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, spender] : undefined,
    watch: true,
    enabled: Boolean(!overrideMaximum),
    chainId: token.chainId,
  })

  return useMemo(
    () =>
      overrideMaximum
        ? {
            allowance: MAX_ALLOWANCE.shiftedBy(-token.decimals),
            allowanceRaw: MAX_ALLOWANCE,
          }
        : {
            allowance: new BigNumber(result.data ? result.data.toString() : 0).shiftedBy(-token.decimals),
            allowanceRaw: new BigNumber(result.data ? result.data.toString() : 0),
          },
    [result.data, token, overrideMaximum],
  )
}
