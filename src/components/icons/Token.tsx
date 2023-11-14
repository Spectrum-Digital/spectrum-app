import { twMerge } from 'tailwind-merge'
import TokenIcon from '@mui/icons-material/Token'

export function TokenLogo({ className }: { className?: string }) {
  return <TokenIcon className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500', className)} />
}
