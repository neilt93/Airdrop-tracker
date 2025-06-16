export interface Airdrop {
  id: string
  name: string
  description: string
  chain: string
  value: string
  deadline: string
  status: string
  isEligible: boolean
  credibilityScore: number
  socialLinks?: {
    twitter?: string
    discord?: string
    telegram?: string
  }
}

export interface QueryIntent {
  type: 'discovery' | 'eligibility' | 'verification' | 'tracking' | 'wallet-meta'
  parameters: {
    chains?: string[]
    timeFrame?: string
    walletAddress?: string
    [key: string]: any
  }
}

export interface AirdropSource {
  name: string
  url: string
  lastUpdated: string
  data: Airdrop[]
} 