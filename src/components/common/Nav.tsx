'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useConnectModal, ConnectButton } from '@rainbow-me/rainbowkit'

import ThemeSwitch from '@/components/theme'
import logo from '@/assets/images/logo.png'
import { useBreakpoint } from '@/hooks/useBreakpoint'

export default function Nav() {
  const pathname = usePathname()
  const { openConnectModal } = useConnectModal()
  const { isAboveXl } = useBreakpoint('xl')

  return (
    <header className='fixed w-full px-5 top-0 left-0 z-0 h-16 border-b border-primary'>
      <div className='row-between py-3'>
        <Link href='/' className='w-12'>
          <Image src={logo} alt='logo' width={40} height={40} className='cursor-pointer' />
        </Link>
        <nav className='hidden md:flex ml-8'>
          <ul className='row-center list-none [&>li]:flex [&>li]:h-full hidden'>
            <li>
              <Link
                href='/tokens'
                className={`hover-bg-tertiary hover:rounded-xl px-3 py-2 ${pathname == '/tokens/' ? 'font-semibold' : 'text-secondary'}`}
              >
                Tokens
              </Link>
            </li>
            <li>
              <Link
                href='/swap'
                className={`hover-bg-tertiary hover:rounded-xl px-3 py-2 ${pathname == '/swap/' ? 'font-semibold' : 'text-secondary'}`}
              >
                Swap
              </Link>
            </li>
          </ul>
        </nav>
        <div className='row-end ml-auto h-full'>
          <ThemeSwitch className='hidden md:flex h-full' />
          {openConnectModal ? (
            <div className='flex gap-2'>
              <button className='btn-primary' onClick={openConnectModal}>
                Connect Wallet
              </button>
            </div>
          ) : (
            <ConnectButton accountStatus={isAboveXl ? 'full' : 'address'} chainStatus='full' showBalance={false} />
          )}
        </div>
      </div>
    </header>
  )
}
