import { useEffect, useMemo, useState } from 'react'
import { useChainId, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { ContractFunctionExecutionError, parseUnits } from 'viem'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'

import { BytesLike, Token } from '@/typings'
import { simplifyViemError } from '@/utils/errors'
import { ERC20_ABI } from '@/constants/abi/ERC20_ABI'
import { useDebounce } from '@/hooks/useDebounce'

export function useExampleInteraction(
  token: Token,
  amount_: string,
  haltPrefetching: boolean,
): {
  callback: () => Promise<void>
  pendingConfirmation: boolean
  transactionPending: boolean
  error: string | undefined
} {
  const chainId = useChainId()
  const [pendingConfirmation, setPendingConfirmation] = useState(false)
  const [transactionHash, setTransactionHash] = useState<BytesLike | undefined>(undefined)
  const addRecentTransaction = useAddRecentTransaction()

  const amount = useDebounce(amount_ ? parseFloat(amount_) : 0, 500)
  const amountRaw = useMemo(() => parseUnits(amount.toString(), token.decimals), [amount, token])

  const { config, error: transferError } = usePrepareContractWrite({
    address: token.address,
    chainId,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [token.address, amountRaw],
    enabled: Boolean(amount && !haltPrefetching && chainId === token.chainId),
  })

  const { writeAsync, isLoading } = useContractWrite(config)
  const error = useMemo(() => transferError as ContractFunctionExecutionError | undefined, [transferError])
  const { isLoading: transactionPending } = useWaitForTransaction({ hash: transactionHash })

  useEffect(() => {
    if (isLoading) {
      setPendingConfirmation(true)
    } else {
      setPendingConfirmation(false)
    }
  }, [isLoading])

  return useMemo(
    () => ({
      callback: async () => {
        try {
          let transactionHash = undefined
          if (writeAsync) {
            const result = await writeAsync()
            transactionHash = result.hash
          }

          if (transactionHash) {
            setTransactionHash(transactionHash)
            addRecentTransaction({
              hash: transactionHash,
              description: `Transfer ${token.symbol}`,
            })
          }
        } catch (err) {
          console.error(err)
        }
      },
      pendingConfirmation,
      transactionPending,
      error: simplifyViemError(error?.shortMessage),
    }),
    [setTransactionHash, addRecentTransaction, pendingConfirmation, token.symbol, transactionPending, writeAsync, error],
  )
}
