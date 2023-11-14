import { twMerge } from 'tailwind-merge'
import Plane from '@mui/icons-material/Telegram'

export function Telegram({ className }: { className?: string }) {
  return <Plane className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500', className)} />
}
