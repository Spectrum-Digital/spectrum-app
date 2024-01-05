'use client'

import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import { Skeleton } from '@mui/material'
import { Path } from '@spectrum-digital/spectrum-router'

import { PRIMARY_STABLECOIN } from '@/constants/tokens/stablecoins'
import { ChainInfo } from '@/constants/chains/chainInfo'
import { getTokenByAddress } from '@/constants/tokens'
import { SupportedChainId } from '@/constants/chains'
import { BytesLike, Token } from '@/typings'
import { formatDollarAmount } from '@/utils/numbers'
import { getExplorerLink } from '@/utils/explorer'
import { TokenLogo } from '@/components/icons/Token'
import { useLiquidityAdjustedPrice, useSpotPrice } from '@/hooks/useTokenPrice'

export function Table({ tokens }: { tokens: Token[] }) {
  return (
    <div className='grid-container w-full'>
      <div className='grid grid-cols-11 w-full'>
        <div className='grid-header text-left col-span-1'>Chain</div>
        <div className='grid-header text-left col-span-2'>Token</div>
        <div className='grid-header text-left col-span-4'>Route</div>
        <div className='grid-header text-center col-span-1'># Options</div>
        <div className='grid-header text-right col-span-1'>Spot Price</div>
        <div className='grid-header text-right col-span-2'>Liquid Price</div>
        {!tokens.length ? (
          <div className='grid-empty-row text-sm text-center text-secondary col-span-10'>No tokens found.</div>
        ) : (
          tokens.map((token, index) => <InnerRow key={index} token={token} />)
        )}
      </div>
    </div>
  )
}

const InnerRow = ({ token }: { token: Token }) => {
  const { error: liquidError, price: liquidPrice, path, considered } = useLiquidityAdjustedPrice(token, PRIMARY_STABLECOIN[token.chainId])
  const { error: priceError, price: spotPrice } = useSpotPrice(token, PRIMARY_STABLECOIN[token.chainId])

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
        <Image src={token.logoURI} alt={`${token.name} logo`} width={25} height={25} />
        <div className='font-bold'>{token.name}</div>
        <div className='text-secondary'>{token.symbol}</div>
      </div>
      <div className='grid-item col-span-4 h-16'>
        {!priceError ? (
          <Route chainId={token.chainId} path={path} />
        ) : (
          <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
        )}
      </div>
      <div className='grid-item col-span-1 h-16 text-center'>{considered}</div>
      <div className='grid-item text-right middle col-span-1 h-16'>
        {!priceError && spotPrice.gt(0) ? (
          formatDollarAmount(spotPrice.toNumber(), 6)
        ) : (
          <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
        )}
      </div>
      <div className='grid-item text-right middle col-span-2 h-16'>
        {!liquidError && liquidPrice.gt(0) ? (
          <>
            <span>{formatDollarAmount(liquidPrice.toNumber(), 6)}</span>{' '}
            {priceImpact.lt(0) && <span className='text-red-400 text-xs'>({priceImpact.toFixed(2)}%)</span>}
          </>
        ) : (
          <Skeleton variant='rectangular' className='w-full h-6 dark:bg-gray-700' />
        )}
      </div>
    </div>
  )
}

const Route = ({ chainId, path }: { chainId: SupportedChainId; path: Path }) => {
  const tokens = useMemo(
    () =>
      path.reduce(
        (acc, leg, index) => {
          const from = getTokenByAddress(leg.from.address, chainId)
          const to = getTokenByAddress(leg.to.address, chainId)

          if (index === 0) {
            acc.push(from ? from : { address: leg.from.address, chainId })
          }
          acc.push(to ? to : { address: leg.to.address, chainId })
          return acc
        },
        [] as Array<Token | { address: BytesLike; chainId: number }>,
      ),
    [path, chainId],
  )

  return (
    <div className='row-start'>
      {tokens.map((token, index) => {
        return 'logoURI' in token ? (
          <div key={index} className='row-start !w-fit'>
            <Image src={token.logoURI} alt={token.name} width={25} height={25} />
            <span className='font-bold text-xs'>{token.symbol}</span>
            {index < tokens.length - 1 && <span className='text-secondary text-center'>&#10230;</span>}
          </div>
        ) : (
          <a
            key={index}
            className='row-start !w-fit'
            href={getExplorerLink(chainId, 'address', token.address)}
            target='_blank'
            rel='noreferrer'
          >
            <TokenLogo key={index} />
            <span className='font-bold text-xs'>Unknown</span>
            {index < tokens.length - 1 && <span className='text-secondary text-center'>&#10230;</span>}
          </a>
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
        <div className='grid-header text-left col-span-1'># Options</div>
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
          <div className='grid-item col-span-2 h-16'>
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
