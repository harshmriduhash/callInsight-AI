import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface PersonSentiment {
  salesperson: {
    sentiment: number // 0-1
    engagement: number // 0-1
    tone: 'positive' | 'neutral' | 'negative'
    confidence: number // 0-1
  }
  customer: {
    sentiment: number // 0-1
    engagement: number // 0-1
    tone: 'positive' | 'neutral' | 'negative'
    interest: number // 0-1
  }
  tensionMoments: Array<{
    time: string
    description: string
    severity: 'low' | 'medium' | 'high'
    suggestion: string
  }>
  approachChangeSuggestions: Array<{
    time: string
    reason: string
    suggestedApproach: string
  }>
}

export async function analyzeSentimentByPerson(transcription: string): Promise<PersonSentiment> {
  try {
    const prompt = `Analyze this sales call transcription and separate sentiment analysis for the salesperson vs the customer. Identify tension moments and suggest when to change approach. Return ONLY valid JSON:

{
  "salesperson": {
    "sentiment": 0.0-1.0,
    "engagement": 0.0-1.0,
    "tone": "positive" | "neutral" | "negative",
    "confidence": 0.0-1.0
  },
  "customer": {
    "sentiment": 0.0-1.0,
    "engagement": 0.0-1.0,
    "tone": "positive" | "neutral" | "negative",
    "interest": 0.0-1.0
  },
  "tensionMoments": [
    {
      "time": "MM:SS",
      "description": "what happened",
      "severity": "low" | "medium" | "high",
      "suggestion": "how to handle"
    }
  ],
  "approachChangeSuggestions": [
    {
      "time": "MM:SS",
      "reason": "why change approach",
      "suggestedApproach": "what to do instead"
    }
  ]
}

Transcription: "${transcription}"`

    const completion = await openai.chat.completions.create({
      model: 'gpt-audio-mini-2025-10-06',
      messages: [
        {
          role: 'system',
          content: 'You are an expert sales call analyst. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
    return result as PersonSentiment
  } catch (error: any) {
    console.error('Error analyzing sentiment by person:', error)
    throw error
  }
}

