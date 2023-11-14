'use client'

import { twMerge } from 'tailwind-merge'
import Moon from '@mui/icons-material/DarkMode'
import Sun from '@mui/icons-material/LightMode'
import { useHasMounted } from '@/hooks/useHasMounted'
import { useCurrentTheme } from '@/hooks/useTheme'

export default function ThemeSwitch({ className }: { className?: string }) {
  const mounted = useHasMounted()
  const { theme, setTheme } = useCurrentTheme()
  const toggle = () => (theme === 'dark' ? setTheme('light') : setTheme('dark'))

  if (!mounted) {
    return null
  }

  return (
    <div onClick={toggle} className={twMerge('btn-primary flex items-center justify-center hover:cursor-pointer', className)}>
      {theme === 'dark' ? <Sun className='w-5 h-5 text-yellow-500' /> : <Moon className='w-5 h-5 text-gray-900' />}
    </div>
  )
}
