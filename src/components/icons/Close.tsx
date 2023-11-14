import { twMerge } from 'tailwind-merge'
import CloseIcon from '@mui/icons-material/Close'

export function Close({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <CloseIcon
      className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500 dark:hover:fill-gray-500 hover:cursor-pointer', className)}
      onClick={onClick}
    />
  )
}
