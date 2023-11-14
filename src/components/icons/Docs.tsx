import { twMerge } from 'tailwind-merge'
import Description from '@mui/icons-material/Description'

export function Docs({ className }: { className?: string }) {
  return <Description className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500', className)} />
}
