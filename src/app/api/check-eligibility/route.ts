import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { mainnet, optimism, arbitrum } from 'viem/chains'

// Airdrop contract ABIs (simplified examples)
const AIRDROP_ABIS = {
  'optimism-airdrop': [
    {
      name: 'isEligible',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'bool' }]
    }
  ],
  'arbitrum-airdrop': [
    {
      name: 'checkEligibility',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'user', type: 'address' }],
      outputs: [{ type: 'bool' }]
    }
  ]
}

// Airdrop contract addresses
const AIRDROP_CONTRACTS = {
  'optimism-airdrop': '0x...', // Add actual contract address
  'arbitrum-airdrop': '0x...'  // Add actual contract address
}

// Chain configurations
const CHAINS = {
  ethereum: mainnet,
  optimism: optimism,
  arbitrum: arbitrum
}

export async function POST(req: Request) {
  try {
    const { airdrop, chain, walletAddress } = await req.json()

    if (!airdrop || !chain || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get chain configuration
    const chainConfig = CHAINS[chain.toLowerCase()]
    if (!chainConfig) {
      return NextResponse.json(
        { error: 'Unsupported chain' },
        { status: 400 }
      )
    }

    // Create public client for the chain
    const client = createPublicClient({
      chain: chainConfig,
      transport: http()
    })

    // Check eligibility based on airdrop type
    let isEligible = false

    switch (airdrop.toLowerCase()) {
      case 'optimism-airdrop':
        isEligible = await checkOptimismEligibility(client, walletAddress)
        break
      case 'arbitrum-airdrop':
        isEligible = await checkArbitrumEligibility(client, walletAddress)
        break
      default:
        // For unknown airdrops, check basic requirements
        isEligible = await checkBasicEligibility(client, walletAddress, chain)
    }

    return NextResponse.json({ eligible: isEligible })
  } catch (error) {
    console.error('Error checking eligibility:', error)
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    )
  }
}

async function checkOptimismEligibility(client: any, walletAddress: string): Promise<boolean> {
  try {
    const contract = {
      address: AIRDROP_CONTRACTS['optimism-airdrop'],
      abi: AIRDROP_ABIS['optimism-airdrop']
    }

    const isEligible = await client.readContract({
      ...contract,
      functionName: 'isEligible',
      args: [walletAddress]
    })

    return isEligible
  } catch (error) {
    console.error('Error checking Optimism eligibility:', error)
    return false
  }
}

async function checkArbitrumEligibility(client: any, walletAddress: string): Promise<boolean> {
  try {
    const contract = {
      address: AIRDROP_CONTRACTS['arbitrum-airdrop'],
      abi: AIRDROP_ABIS['arbitrum-airdrop']
    }

    const isEligible = await client.readContract({
      ...contract,
      functionName: 'checkEligibility',
      args: [walletAddress]
    })

    return isEligible
  } catch (error) {
    console.error('Error checking Arbitrum eligibility:', error)
    return false
  }
}

async function checkBasicEligibility(client: any, walletAddress: string, chain: string): Promise<boolean> {
  try {
    // Check if wallet has any activity on the chain
    const balance = await client.getBalance({ address: walletAddress })
    const hasBalance = balance > 0n

    // Check if wallet has any transactions
    const blockNumber = await client.getBlockNumber()
    const recentBlocks = 1000 // Check last 1000 blocks
    const hasActivity = await checkRecentActivity(client, walletAddress, blockNumber - BigInt(recentBlocks))

    return hasBalance || hasActivity
  } catch (error) {
    console.error('Error checking basic eligibility:', error)
    return false
  }
}

async function checkRecentActivity(client: any, walletAddress: string, fromBlock: bigint): Promise<boolean> {
  try {
    // Get recent transactions for the wallet
    const logs = await client.getLogs({
      fromBlock,
      toBlock: 'latest',
      address: walletAddress
    })

    return logs.length > 0
  } catch (error) {
    console.error('Error checking recent activity:', error)
    return false
  }
} 