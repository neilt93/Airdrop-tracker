import OpenAI from 'openai'
import { QueryIntent } from '@/types/airdrop'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are an AI assistant that classifies user queries about crypto airdrops into specific intents.
The possible intents are:
- discovery: Find new or trending airdrops
- eligibility: Check wallet eligibility
- verification: Score credibility (scam detection)
- tracking: List claim windows and deadlines
- wallet-meta: Suggest actions to become eligible

Extract relevant parameters from the query such as:
- chains: Array of blockchain names
- timeFrame: Time period for the query
- walletAddress: Ethereum address if mentioned

Return the classification in JSON format.`

export async function classifyQuery(query: string): Promise<QueryIntent> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" }
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')
    return response as QueryIntent
  } catch (error) {
    console.error('Error classifying query:', error)
    // Default to discovery if classification fails
    return {
      type: 'discovery',
      parameters: {}
    }
  }
} 