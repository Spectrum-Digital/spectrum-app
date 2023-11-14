import { useEffect, useMemo } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'

import { BytesLike, MinimalToken } from '@/typings'
import { LIQUIDITY_V2_ABI } from '@/constants/abi/LIQUIDITY_V2_ABI'
import { useTotalSupply } from '@/hooks/useERC20'
import { useSpotPrice } from './useTokenPrice'

export function useLiquidityAmountsV2(pair: MinimalToken, tokenX: MinimalToken, tokenY: MinimalToken, liquidity: BigNumber) {
  const { reserve0, reserve1 } = useLiquidityReservesV2(pair.address, tokenX, tokenY)
  const { totalSupply } = useTotalSupply(pair)

  return useMemo(() => {
    const isZero = liquidity.isZero() || totalSupply.isZero()
    return {
      amountX: isZero ? new BigNumber(0) : liquidity.div(totalSupply).multipliedBy(reserve0),
      amountY: isZero ? new BigNumber(0) : liquidity.div(totalSupply).multipliedBy(reserve1),
    }
  }, [liquidity, totalSupply, reserve0, reserve1])
}

export function useLiquidityReservesV2(
  pair: BytesLike,
  tokenX: MinimalToken,
  tokenY: MinimalToken,
): {
  reserve0: BigNumber
  reserve1: BigNumber
  reserve0Raw: BigNumber
  reserve1Raw: BigNumber
} {
  const { address } = useAccount()

  const { data, error } = useContractRead({
    address: pair,
    abi: LIQUIDITY_V2_ABI,
    functionName: 'getReserves',
    watch: true,
    enabled: Boolean(address),
    chainId: tokenX.chainId,
  })

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  const reserve0 = useMemo(() => (data && data[0] ? new BigNumber(data[0].toString()) : new BigNumber(0)), [data])
  const reserve1 = useMemo(() => (data && data[1] ? new BigNumber(data[1].toString()) : new BigNumber(0)), [data])

  return useMemo(
    () => ({
      reserve0: reserve0.shiftedBy(-tokenX.decimals),
      reserve1: reserve1.shiftedBy(-tokenY.decimals),
      reserve0Raw: reserve0,
      reserve1Raw: reserve1,
    }),
    [reserve0, reserve1, tokenX.decimals, tokenY.decimals],
  )
}

export function useLiquidityValueV2(pair: MinimalToken, tokenX: MinimalToken, tokenY: MinimalToken, usdToken: MinimalToken): BigNumber {
  const { reserve0, reserve1 } = useLiquidityReservesV2(pair.address, tokenX, tokenY)
  const { price: priceX } = useSpotPrice(tokenX, usdToken)
  const { price: priceY } = useSpotPrice(tokenY, usdToken)

  return useMemo(() => {
    const x = reserve0.multipliedBy(priceX)
    const y = reserve1.multipliedBy(priceY)
    return x.plus(y)
  }, [reserve0, reserve1, priceX, priceY])
}

export function useLiquidityTokenPriceV2(
  pair: MinimalToken,
  tokenX: MinimalToken,
  tokenY: MinimalToken,
  usdToken: MinimalToken,
): BigNumber {
  const tvl = useLiquidityValueV2(pair, tokenX, tokenY, usdToken)
  const { totalSupply } = useTotalSupply(pair)

  return useMemo(() => {
    if (tvl.isZero() || totalSupply.isZero()) return new BigNumber(0)
    return tvl.dividedBy(totalSupply)
  }, [tvl, totalSupply])
}
