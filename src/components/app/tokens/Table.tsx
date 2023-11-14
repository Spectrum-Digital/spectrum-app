'use client'

import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { Skeleton } from '@mui/material'
import { Legs } from '@/lib/router'

import { Token } from '@/typings'
import { Tokens, getTokenByAddressChainId } from '@/constants/tokens/tokens'
import { ChainInfo } from '@/constants/chains/chainInfo'
import { formatDollarAmount } from '@/utils/numbers'
import { useLiquidityAdjustedPrice, useSpotPrice } from '@/hooks/useTokenPrice'
import { TokenLogo } from '@/components/icons/Token'

export function Table({ tokens }: { tokens: Token[] }) {
  return (
    <div className='grid-container w-full'>
      <div className='grid grid-cols-10 w-full'>
        <div className='grid-header text-left col-span-1'>Chain</div>
        <div className='grid-header text-left col-span-2'>Token</div>
        <div className='grid-header text-left col-span-4'>Route</div>
        <div className='grid-header text-right col-span-1'>Spot Price</div>
        <div className='grid-header text-right col-span-2'>Liquid Price</div>
        {!tokens.length ? (
          <div className='grid-empty-row text-sm text-center text-secondary col-span-8'>No tokens found.</div>
        ) : (
          tokens.map((token, index) => <InnerRow key={index} token={token} />)
        )}
      </div>
    </div>
  )
}

const InnerRow = ({ token }: { token: Token }) => {
  const { error: priceError, price: spotPrice } = useSpotPrice(token, Tokens.STABLECOIN_BASE_USDbC)
  const { error: liquidError, price: liquidPrice, route: liquidRoute } = useLiquidityAdjustedPrice(token, Tokens.STABLECOIN_BASE_USDbC)

  const priceImpact = useMemo(
    () =>
      spotPrice.isZero() || liquidPrice.isZero() ? new BigNumber(0) : spotPrice.minus(liquidPrice).div(spotPrice).times(100).times(-1),
    [spotPrice, liquidPrice],
  )

  return (
    <div className='contents group'>
      <div className='grid-item col-span-1 row-start h-16'>
        <Image src={ChainInfo[token.chainId].icon} alt={`${ChainInfo[token.chainId].chainName} logo`} width={25} height={25} />
      </div>
      <div className='grid-item col-span-2 row-start h-16'>
        <Image src={token.logo} alt={`${token.name} logo`} width={25} height={25} />
        <div className='font-bold'>{token.name}</div>
        <div className='text-secondary'>{token.symbol}</div>
      </div>
      <div className='grid-item col-span-4 h-16'>
        {!priceError ? <Route legs={liquidRoute} /> : <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />}
      </div>
      <div className='grid-item text-right middle col-span-1 h-16'>
        {!priceError && spotPrice.gt(0) ? (
          token.stablecoin ? (
            `$${spotPrice.toPrecision(6)}`
          ) : (
            formatDollarAmount(spotPrice.toNumber(), 2)
          )
        ) : (
          <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
        )}
      </div>
      <div className='grid-item text-right middle col-span-2 h-16'>
        {!liquidError && liquidPrice.gt(0) ? (
          <>
            <span>{token.stablecoin ? `$${liquidPrice.toPrecision(6)}` : formatDollarAmount(liquidPrice.toNumber(), 2)}</span>{' '}
            {priceImpact.lt(0) && <span className='text-red-400 text-xs'>({priceImpact.toFixed(2)}%)</span>}
          </>
        ) : (
          <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
        )}
      </div>
    </div>
  )
}

const Route = ({ legs }: { legs: Legs }) => {
  const tokens = useMemo(
    () =>
      legs.reduce(
        (acc, leg, index) => {
          if (index === 0) {
            acc.push(getTokenByAddressChainId(leg.path.from.address, leg.path.from.chainId))
          }
          acc.push(getTokenByAddressChainId(leg.path.to.address, leg.path.to.chainId))
          return acc
        },
        [] as Array<Token | undefined>,
      ),
    [legs],
  )

  return (
    <div className='row-start'>
      {tokens.map((token, index) => {
        return token ? (
          <div key={index} className='row-start !w-fit'>
            <Image src={token.logo} alt={token.name} width={25} height={25} />
            <span className='font-bold text-xs'>{token.symbol}</span>
            {index < tokens.length - 1 && <span className='text-secondary text-center'>&#10230;</span>}
          </div>
        ) : (
          <TokenLogo key={index} />
        )
      })}
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className='grid-container w-full'>
      <div className='grid grid-cols-10 w-full'>
        <div className='grid-header text-left col-span-1'>Chain</div>
        <div className='grid-header text-left col-span-2'>Token</div>
        <div className='grid-header text-left col-span-4'>Route</div>
        <div className='grid-header text-right col-span-1'>Spot Price</div>
        <div className='grid-header text-right col-span-2'>Liquid Price</div>
        <div className='contents group'>
          <div className='grid-item col-span-1 h-16'>
            <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
          </div>
          <div className='grid-item col-span-2 h-16'>
            <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
          </div>
          <div className='grid-item col-span-4 h-16'>
            <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
          </div>
          <div className='grid-item col-span-1 h-16'>
            <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
          </div>
          <div className='grid-item col-span-2 h-16'>
            <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
          </div>
        </div>
      </div>
    </div>
  )
}
