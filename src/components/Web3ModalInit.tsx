'use client'

import { useEffect } from 'react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, optimism, arbitrum, zkSync } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const appMetadata = {
  name: 'Airdrop Tracker',
  description: 'Track and claim crypto airdrops',
  url: 'https://airdrop-tracker.com',
  icons: ['https://airdrop-tracker.com/icon.png']
}

const chains = [mainnet, optimism, arbitrum, zkSync] as const

export function Web3ModalInit() {
  useEffect(() => {
    const wagmiConfig = defaultWagmiConfig({ 
      chains, 
      projectId, 
      metadata: appMetadata
    })
    createWeb3Modal({ wagmiConfig, projectId })
  }, [])

  return null
} 