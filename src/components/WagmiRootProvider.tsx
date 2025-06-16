'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { useState, useEffect } from 'react'

export function WagmiRootProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const { chains, publicClient } = configureChains(
      [mainnet, sepolia],
      [publicProvider()]
    )

    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
          chains,
          options: {
            projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
          },
        }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'Airdrop Tracker',
          },
        }),
      ],
      publicClient,
    })

    setConfig(wagmiConfig)
  }, [])

  if (!config) return null

  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 