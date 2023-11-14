import { twMerge } from 'tailwind-merge'
import Done from '@mui/icons-material/Done'

export function DoneLogo({ className }: { className?: string }) {
  return <Done className={twMerge('fill-gray-900 dark:fill-gray-300 hover:fill-gray-500', className)} />
}
