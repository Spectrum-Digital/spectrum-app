'use client'

import React from 'react'
import { twMerge } from 'tailwind-merge'

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

type Props = {
  className?: string
  value: string | number
  onUserInput: (input: string) => void
  placeholder: string
  disabled?: boolean
  onFocus?: () => void
  onBlur?: () => void
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>

export const NumericalInput = ({ className, value, onUserInput, placeholder, disabled, onFocus, onBlur, ...rest }: Props) => {
  const enforcer = (userInput: string) => {
    if (userInput === '' || inputRegex.test(escapeRegExp(userInput))) {
      onUserInput(userInput)
    }
  }

  return (
    <input
      {...rest}
      className={twMerge(`flex h-full border-none bg-transparent w-full focus:outline-none hover:outline-none ${className ?? ''}`)}
      disabled={disabled}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        // replace commas with periods
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      // universal input options
      inputMode='decimal'
      title='Amount'
      autoComplete='off'
      autoCorrect='off'
      // text-specific options
      type='text'
      pattern='^[0-9]*[.,]?[0-9]*$'
      placeholder={placeholder || '0.00'}
      min={0}
      minLength={1}
      maxLength={79}
      spellCheck='false'
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
}
