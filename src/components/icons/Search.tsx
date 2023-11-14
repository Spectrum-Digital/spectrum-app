import { twMerge } from 'tailwind-merge'
import Search from '@mui/icons-material/Search'

export function SearchLogo({ className }: { className?: string }) {
  return <Search className={twMerge('fill-gray-900 dark:fill-gray-300', className)} />
}
