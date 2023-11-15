import { twMerge } from 'tailwind-merge'
import GithubIcon from '@mui/icons-material/GitHub'

export function Github({ className }: { className?: string }) {
  return <GithubIcon className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500', className)} />
}
