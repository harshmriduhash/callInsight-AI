import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface EmotionAnalysis {
  emotions: Array<{
    emotion: 'joy' | 'frustration' | 'anxiety' | 'confidence' | 'neutral' | 'excitement' | 'calm' | 'anger'
    timestamp: string // "MM:SS"
    intensity: number // 0-1
    speaker: 'salesperson' | 'customer' | 'unknown'
  }>
  dominantEmotion: string
  emotionTimeline: Array<{
    time: string
    salespersonEmotion: string
    customerEmotion: string
  }>
}

export interface SilenceAnalysis {
  silences: Array<{
    start: string // "MM:SS"
    end: string // "MM:SS"
    duration: number // seconds
    type: 'strategic' | 'discomfort' | 'thinking' | 'awkward'
    context: string
  }>
  totalSilenceTime: number
  averageSilenceDuration: number
  strategicPauses: number
  uncomfortablePauses: number
}

export interface InterruptionAnalysis {
  interruptions: Array<{
    timestamp: string
    interrupter: 'salesperson' | 'customer'
    interrupted: 'salesperson' | 'customer'
    context: string
  }>
  salespersonInterruptions: number
  customerInterruptions: number
  interruptionRatio: number // salesperson/customer
}

export interface ToneAnalysis {
  tones: Array<{
    timestamp: string
    speaker: 'salesperson' | 'customer'
    tone: 'assertive' | 'empathetic' | 'defensive' | 'neutral' | 'aggressive' | 'passive' | 'enthusiastic'
    confidence: number // 0-1
  }>
  salespersonToneProfile: {
    dominant: string
    assertiveness: number
    empathy: number
    defensiveness: number
  }
  customerToneProfile: {
    dominant: string
    receptiveness: number
    skepticism: number
    engagement: number
  }
}

export interface CompetitiveKeywordsAnalysis {
  competitors: Array<{
    name: string
    mentions: number
    context: string[]
    sentiment: 'positive' | 'negative' | 'neutral'
  }>
  competitiveMentions: number
  competitivePressure: 'low' | 'medium' | 'high'
}

export interface QuestionAnalysis {
  questions: Array<{
    timestamp: string
    speaker: 'salesperson' | 'customer'
    text: string
    type: 'open' | 'closed' | 'probing' | 'objection' | 'clarification'
    quality: 'high' | 'medium' | 'low'
  }>
  questionCount: {
    salesperson: number
    customer: number
  }
  statementCount: {
    salesperson: number
    customer: number
  }
  questionToStatementRatio: number
  openQuestionRatio: number
}

export interface ClosingAnalysis {
  closingAttempts: Array<{
    timestamp: string
    type: 'assumptive' | 'alternative' | 'summary' | 'direct' | 'trial'
    success: boolean
    response: string
  }>
  closingAttemptsCount: number
  successfulCloses: number
  closingRate: number // 0-1
  bestClosingMoment: string // timestamp
}

export interface RapportAnalysis {
  rapportScore: number // 0-1
  rapportMoments: Array<{
    timestamp: string
    type: 'shared_interests' | 'humor' | 'empathy' | 'agreement' | 'personal_connection'
    strength: number // 0-1
  }>
  connectionIndicators: string[]
  rapportTrend: 'improving' | 'stable' | 'declining'
}

export interface PersuasionScore {
  overallScore: number // 0-100
  factors: {
    storytelling: number // 0-1
    socialProof: number // 0-1
    urgency: number // 0-1
    reciprocity: number // 0-1
    authority: number // 0-1
    consistency: number // 0-1
  }
  persuasionTechniques: Array<{
    technique: string
    usage: number
    effectiveness: number
  }>
  recommendations: string[]
}

export interface AdvancedAnalysisResult {
  emotionAnalysis: EmotionAnalysis
  silenceAnalysis: SilenceAnalysis
  interruptionAnalysis: InterruptionAnalysis
  toneAnalysis: ToneAnalysis
  competitiveKeywords: CompetitiveKeywordsAnalysis
  questionAnalysis: QuestionAnalysis
  closingAnalysis: ClosingAnalysis
  rapportAnalysis: RapportAnalysis
  persuasionScore: PersuasionScore
  objectionTypes: {
    price: number
    timing: number
    authority: number
    need: number
    product: number
    other: number
  }
}

export async function performAdvancedAnalysis(
  transcription: string,
  duration: number,
  segments?: Array<{ start: number; end: number; text: string }>
): Promise<AdvancedAnalysisResult> {
  try {
    const prompt = `Você é um especialista em análise avançada de chamadas de vendas. Analise a seguinte transcrição e forneça uma análise completa e detalhada em formato JSON.

Transcrição:
"${transcription}"

Duração: ${duration} segundos

${segments ? `Segmentos temporais: ${JSON.stringify(segments)}` : ''}

Forneça uma análise completa com os seguintes campos (responda APENAS em JSON válido):

{
  "emotionAnalysis": {
    "emotions": [
      {
        "emotion": "joy" | "frustration" | "anxiety" | "confidence" | "neutral" | "excitement" | "calm" | "anger",
        "timestamp": "MM:SS",
        "intensity": 0-1,
        "speaker": "salesperson" | "customer" | "unknown"
      }
    ],
    "dominantEmotion": "string",
    "emotionTimeline": [
      {
        "time": "MM:SS",
        "salespersonEmotion": "string",
        "customerEmotion": "string"
      }
    ]
  },
  "silenceAnalysis": {
    "silences": [
      {
        "start": "MM:SS",
        "end": "MM:SS",
        "duration": number,
        "type": "strategic" | "discomfort" | "thinking" | "awkward",
        "context": "string"
      }
    ],
    "totalSilenceTime": number,
    "averageSilenceDuration": number,
    "strategicPauses": number,
    "uncomfortablePauses": number
  },
  "interruptionAnalysis": {
    "interruptions": [
      {
        "timestamp": "MM:SS",
        "interrupter": "salesperson" | "customer",
        "interrupted": "salesperson" | "customer",
        "context": "string"
      }
    ],
    "salespersonInterruptions": number,
    "customerInterruptions": number,
    "interruptionRatio": number
  },
  "toneAnalysis": {
    "tones": [
      {
        "timestamp": "MM:SS",
        "speaker": "salesperson" | "customer",
        "tone": "assertive" | "empathetic" | "defensive" | "neutral" | "aggressive" | "passive" | "enthusiastic",
        "confidence": 0-1
      }
    ],
    "salespersonToneProfile": {
      "dominant": "string",
      "assertiveness": 0-1,
      "empathy": 0-1,
      "defensiveness": 0-1
    },
    "customerToneProfile": {
      "dominant": "string",
      "receptiveness": 0-1,
      "skepticism": 0-1,
      "engagement": 0-1
    }
  },
  "competitiveKeywords": {
    "competitors": [
      {
        "name": "string",
        "mentions": number,
        "context": ["string"],
        "sentiment": "positive" | "negative" | "neutral"
      }
    ],
    "competitiveMentions": number,
    "competitivePressure": "low" | "medium" | "high"
  },
  "questionAnalysis": {
    "questions": [
      {
        "timestamp": "MM:SS",
        "speaker": "salesperson" | "customer",
        "text": "string",
        "type": "open" | "closed" | "probing" | "objection" | "clarification",
        "quality": "high" | "medium" | "low"
      }
    ],
    "questionCount": {
      "salesperson": number,
      "customer": number
    },
    "statementCount": {
      "salesperson": number,
      "customer": number
    },
    "questionToStatementRatio": number,
    "openQuestionRatio": number
  },
  "closingAnalysis": {
    "closingAttempts": [
      {
        "timestamp": "MM:SS",
        "type": "assumptive" | "alternative" | "summary" | "direct" | "trial",
        "success": boolean,
        "response": "string"
      }
    ],
    "closingAttemptsCount": number,
    "successfulCloses": number,
    "closingRate": 0-1,
    "bestClosingMoment": "MM:SS"
  },
  "rapportAnalysis": {
    "rapportScore": 0-1,
    "rapportMoments": [
      {
        "timestamp": "MM:SS",
        "type": "shared_interests" | "humor" | "empathy" | "agreement" | "personal_connection",
        "strength": 0-1
      }
    ],
    "connectionIndicators": ["string"],
    "rapportTrend": "improving" | "stable" | "declining"
  },
  "persuasionScore": {
    "overallScore": 0-100,
    "factors": {
      "storytelling": 0-1,
      "socialProof": 0-1,
      "urgency": 0-1,
      "reciprocity": 0-1,
      "authority": 0-1,
      "consistency": 0-1
    },
    "persuasionTechniques": [
      {
        "technique": "string",
        "usage": number,
        "effectiveness": number
      }
    ],
    "recommendations": ["string"]
  },
  "objectionTypes": {
    "price": number,
    "timeline": number,
    "authority": number,
    "need": number,
    "product": number,
    "other": number
  }
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-audio-mini',
      messages: [
        {
          role: 'system',
          content:
            'Você é um analista especializado em análise avançada de chamadas de vendas. Sempre responda APENAS com JSON válido, sem texto adicional, markdown ou explicações.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const analysisText = completion.choices[0]?.message?.content

    if (!analysisText) {
      throw new Error('Resposta vazia da API')
    }

    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch (parseError) {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Não foi possível parsear a resposta')
      }
    }

    return analysis as AdvancedAnalysisResult
  } catch (error: any) {
    console.error('Erro na análise avançada:', error)
    throw error
  }
}

