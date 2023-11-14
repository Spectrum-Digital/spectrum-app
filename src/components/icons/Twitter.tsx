import { twMerge } from 'tailwind-merge'
import Bird from '@mui/icons-material/Twitter'

export function Twitter({ className }: { className?: string }) {
  return <Bird className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500', className)} />
}
