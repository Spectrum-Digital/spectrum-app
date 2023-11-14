'use client'

import { useTheme } from '@wits/next-themes'
import { useMemo } from 'react'

export function useCurrentTheme(): {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
} {
  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  return useMemo(
    () => ({
      theme: currentTheme === 'light' ? 'light' : 'dark',
      setTheme: setTheme,
    }),
    [currentTheme, setTheme],
  )
}
