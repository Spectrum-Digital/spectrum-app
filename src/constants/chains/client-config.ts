import { configureChains, createConfig, mainnet } from 'wagmi'
import { fantom, base, optimism, arbitrum, bsc } from '@wagmi/core/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

export const { chains, publicClient } = configureChains([arbitrum, base, bsc, fantom, mainnet, optimism], [publicProvider()], {
  batch: { multicall: true },
})

const { connectors } = getDefaultWallets({
  appName: 'Spectrum App',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})
