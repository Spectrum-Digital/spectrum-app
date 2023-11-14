'use client'

import { useState, useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import ExpandMore from '@mui/icons-material/ExpandMore'

import { useOnClickOutside } from '@/hooks/useOnOutsideClick'
import { DoneLogo } from '../icons/Done'

export function Dropdown<TValue extends string | number>({
  selectedOption,
  setSelectedOption,
  options,
  activeClass = '',
}: {
  selectedOption: TValue
  setSelectedOption: (option: TValue) => void
  options: Array<{
    value: TValue
    label: string | JSX.Element
  }>
  activeClass?: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  const activeOption = useMemo(() => options.find(option => option.value === selectedOption), [options, selectedOption])
  const ref = useRef(null)
  useOnClickOutside(ref, () => setCollapsed(false))

  return (
    <div className='relative inline-block hover:cursor-pointer' ref={ref}>
      <div className={twMerge('flex flex-row h-full items-center', activeClass)} onClick={() => setCollapsed(prev => !prev)}>
        <h1 className='prevent-select'>{activeOption ? activeOption.label : null}</h1>
        <ExpandMore className={`${collapsed && 'rotate-180'} transition-all`} />
      </div>
      <div
        className={`${
          collapsed ? 'block' : 'hidden'
        } absolute mt-2 left-0 w-fit z-10 bg-primary border border-primary rounded-xl shadow-xl overflow-hidden p-2`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`relative block rounded-md w-full whitespace-nowrap last-of-type:border-b-0 hover:cursor-pointer hover-bg-tertiary text-left px-2 py-2 ${
              option.value === selectedOption ? 'bg-secondary' : ''
            }`}
            onClick={() => {
              setSelectedOption(option.value)
              setCollapsed(false)
            }}
          >
            <div className='row-start'>
              {option.label}
              {option.value === selectedOption && <DoneLogo className='w-4' />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
