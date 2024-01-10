'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

import { tokens } from '@/constants/tokens'
import { SupportedChainId, SupportedChainIds } from '@/constants/chains'
import { ChainInfo } from '@/constants/chains/chainInfo'
import { useSearch } from '@/hooks/useSearch'
import { useHasMounted } from '@/hooks/useHasMounted'

import { Dropdown } from '@/components/dropdown'
import { TokenLogo } from '@/components/icons/Token'
import { SearchField } from '@/components/search'
import { Table, TableSkeleton } from './Table'

export default function Overview() {
  const mounted = useHasMounted()
  const [selectedChain, setSelectedChain] = useState<SupportedChainId | 'All Networks'>('All Networks')
  const [typedQuery, setTypedQuery] = useState('')

  const filteredTokens = useMemo(() => {
    if (selectedChain === 'All Networks') {
      return Object.values(tokens).flat()
    } else {
      return tokens[selectedChain]
    }
  }, [selectedChain])

  const filtered = useSearch(typedQuery, filteredTokens, ['name', 'symbol', 'address'])

  return (
    <>
      <div className='row-start'>
        <Dropdown
          selectedOption={selectedChain}
          setSelectedOption={chain => setSelectedChain(chain)}
          options={[
            {
              value: 'All Networks',
              label: (
                <div className='row-start'>
                  <TokenLogo className='w-5' />
                  <div>All Networks</div>
                </div>
              ),
            },
            ...SupportedChainIds.map(chainId => ({
              value: chainId,
              label: (
                <div className='row-start'>
                  <Image src={ChainInfo[chainId].icon} alt='chain' width={20} height={20} />
                  <div>{ChainInfo[chainId].label}</div>
                </div>
              ),
            })),
          ]}
          activeClass='btn-primary'
        />
        <SearchField
          value={typedQuery}
          onChange={setTypedQuery}
          placeholder='Filter Tokens'
          showSearchIcon
          className='border border-primary px-3 py-2 rounded-xl'
        />
      </div>
      {mounted ? <Table tokens={filtered} /> : <TableSkeleton />}
    </>
  )
}
