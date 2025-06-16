import { NextResponse } from 'next/server'
import { classifyQuery } from '@/services/queryClassifier'
import { discoverAirdrops, filterAirdrops } from '@/services/airdropDiscovery'
import { scoreCredibility, updateAirdropCredibility } from '@/services/credibilityScorer'

export async function POST(request: Request) {
  try {
    const { query, walletAddress } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // 1. Classify the query
    const intent = await classifyQuery(query)

    // 2. Discover airdrops
    let airdrops = await discoverAirdrops(query, walletAddress)

    // 3. Apply filters based on intent
    if (intent.parameters.chains || intent.parameters.timeFrame) {
      airdrops = await filterAirdrops(airdrops, {
        chains: intent.parameters.chains,
        timeFrame: intent.parameters.timeFrame
      })
    }

    // 4. Score credibility for each airdrop
    const scoredAirdrops = await Promise.all(
      airdrops.map(async (airdrop) => {
        const { score } = await scoreCredibility(airdrop)
        return updateAirdropCredibility(airdrop, score)
      })
    )

    // 5. Sort by credibility score
    scoredAirdrops.sort((a, b) => b.credibilityScore - a.credibilityScore)

    // 6. Return top 5 airdrops
    const topAirdrops = scoredAirdrops.slice(0, 5)

    return NextResponse.json({ airdrops: topAirdrops })
  } catch (error) {
    console.error('Error processing query:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
} 