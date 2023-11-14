'use client'

import { useEffect, useState } from 'react'
import { NumericalInput } from '@/components/input/NumericalInput'

type Props = {
  label: React.ReactNode
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  disabled?: boolean
  labelPosition?: 'left' | 'right'
}

export function InputPanel({ label, labelPosition = 'left', value, onChange, onFocus, disabled }: Props) {
  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    if (!focused) {
      setInternalValue(value)
    }
  }, [value, focused])

  const _onFocus = () => {
    setFocused(true)
    onFocus?.()
  }
  const _onBlur = () => setFocused(false)

  return (
    <div className='flex w-full p-3 whitespace-nowrap transition-all duration-300 border border-primary rounded-xl focus:border-b1-light dark:focus:border-b1-dark outline-none text-right text-sm font-semibold bg-blue-500/20'>
      <div className='flex flex-row items-center justify-between h-12 w-full gap-2'>
        {labelPosition === 'left' && <div className='flex flex-shrink-0'>{label}</div>}
        <NumericalInput
          className='text-right'
          value={internalValue}
          onUserInput={newValue => {
            setInternalValue(newValue)
            onChange(newValue)
          }}
          placeholder='0.00'
          disabled={disabled}
          autoFocus
          onFocus={_onFocus}
          onBlur={_onBlur}
        />
        {labelPosition === 'right' && <div className='flex flex-shrink-0'>{label}</div>}
      </div>
    </div>
  )
}
