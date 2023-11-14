'use client'

import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { Close } from '../icons/Close'
import { SearchLogo } from '../icons/Search'

export function SearchField({
  placeholder,
  value,
  onChange,
  showSearchIcon,
  className,
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  showSearchIcon?: boolean
  className?: string
}) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onChange('')
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={twMerge('flex flex-row items-center justify-between gap-1 h-full text-sm px-3 bg-transparent', className)}>
      {showSearchIcon && <SearchLogo className='w-5 mr-1' />}
      <input
        className='bg-transparent w-24 focus:outline-none'
        autoFocus
        type='text'
        placeholder={placeholder}
        spellCheck='false'
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <Close onClick={() => onChange('')} className='w-4' />
    </div>
  )
}
