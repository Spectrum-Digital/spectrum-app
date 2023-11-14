import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type SlippageType = 'custom' | 'auto'

export const settingsModalOpenAtom = atom<boolean>(false)
export const slippageTypeAtom = atomWithStorage<SlippageType>('application.slippageType', 'auto')
export const slippagePercentageAtom = atomWithStorage<number>('application.slippagePercentage', 0.3)
