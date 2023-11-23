import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type SlippageType = 'custom' | 'auto'

export const defaultSlippageType: SlippageType = 'auto'
export const defaultSlippagePercentage = 0.3

export const settingsModalOpenAtom = atom<boolean>(false)
export const slippageTypeAtom = atomWithStorage<SlippageType>('application.slippageType', defaultSlippageType)
export const slippagePercentageAtom = atomWithStorage<number>('application.slippagePercentage', defaultSlippagePercentage)
