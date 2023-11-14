'use client'

import React from 'react'
import { ThemeProvider } from '@wits/next-themes'
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { Provider as JotaiProvider } from 'jotai'

import { FALLBACK_CHAIN_ID } from '@/constants/chains'
import { chains, wagmiConfig } from '@/constants/chains/client-config'
import { SettingsModal } from '../modal'
import { useCurrentTheme } from '@/hooks/useTheme'

import '@rainbow-me/rainbowkit/styles.css'
import '../../styles/globals.css'

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useCurrentTheme()

  return (
    <ThemeProvider attribute='class'>
      <JotaiProvider>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            initialChain={FALLBACK_CHAIN_ID}
            showRecentTransactions
            theme={theme === 'light' ? lightTheme() : darkTheme()}
          >
            {children}
            <SettingsModal />
          </RainbowKitProvider>
        </WagmiConfig>
      </JotaiProvider>
    </ThemeProvider>
  )
}
