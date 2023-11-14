import { twMerge } from 'tailwind-merge'

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={twMerge('fill-gray-700 dark:fill-gray-300 hover:fill-gray-500', className)} viewBox='0 -960 960 960'>
      <path d='M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z' />
    </svg>
  )
}
