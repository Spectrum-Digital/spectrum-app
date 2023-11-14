import { useCallback, useMemo } from 'react'
import { useAtom } from 'jotai'

import { SlippageType, settingsModalOpenAtom, slippagePercentageAtom, slippageTypeAtom } from './index'

export function useSettingsModal() {
  const [open, setOpen] = useAtom(settingsModalOpenAtom)

  return useMemo(
    () => ({
      open,
      toggle: () => setOpen(!open),
    }),
    [open, setOpen],
  )
}

export function useSlippage() {
  const [slippagePercentage, setSlippagePercentage] = useAtom(slippagePercentageAtom)
  const [slippageType, setSlippageType] = useAtom(slippageTypeAtom)

  const update = useCallback(
    (type: SlippageType, percentage: number) => {
      setSlippageType(type)
      setSlippagePercentage(percentage)
    },
    [setSlippagePercentage, setSlippageType],
  )

  return useMemo(
    () => ({
      slippagePercentage,
      slippageType,
      multiplier: 1 - slippagePercentage / 100,
      update,
    }),
    [slippagePercentage, slippageType, update],
  )
}
