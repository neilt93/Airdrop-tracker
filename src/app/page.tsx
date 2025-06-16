'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { ChatInput } from '@/components/ChatInput'
import { AirdropList } from '@/components/AirdropList'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [airdrops, setAirdrops] = useState([])
  const { address } = useAccount()

  const handleQuery = async (query: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, walletAddress: address }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch airdrops')
      }

      const data = await response.json()
      setAirdrops(data.airdrops)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Airdrop Tracker
            </h1>
            <p className="text-text-secondary text-lg">
              Discover and track crypto airdrops with AI-powered insights
            </p>
          </div>

          <div className="grid gap-8">
            <WalletConnect />
            <ChatInput onQuery={handleQuery} isLoading={isLoading} />
            <AirdropList airdrops={airdrops} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
} 