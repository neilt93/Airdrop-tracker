import OpenAI from 'openai'
import { Airdrop } from '@/types/airdrop'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are an AI assistant that evaluates the credibility of crypto airdrops.
Analyze the following aspects:
1. Project legitimacy (team, history, documentation)
2. Social media presence and engagement
3. Smart contract security (if applicable)
4. Community trust and sentiment
5. Red flags (fake links, impersonation, etc.)

Return a JSON object with:
- score: number (0-100)
- warnings: string[] (list of potential issues)
- rationale: string (brief explanation)`

export async function scoreCredibility(airdrop: Airdrop): Promise<{
  score: number
  warnings: string[]
  rationale: string
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            name: airdrop.name,
            chain: airdrop.chain,
            socialLinks: airdrop.socialLinks
          })
        }
      ],
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')
    return {
      score: response.score || 0,
      warnings: response.warnings || [],
      rationale: response.rationale || 'Unable to evaluate credibility'
    }
  } catch (error) {
    console.error('Error scoring credibility:', error)
    return {
      score: 0,
      warnings: ['Unable to evaluate credibility'],
      rationale: 'Error occurred during evaluation'
    }
  }
}

export function updateAirdropCredibility(airdrop: Airdrop, score: number): Airdrop {
  return {
    ...airdrop,
    credibilityScore: score
  }
} 