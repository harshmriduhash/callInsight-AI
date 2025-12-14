// Updated audio analysis service with caching and database integration
import crypto from 'crypto'

// Server-side only imports (will be undefined in browser)
let prisma: any = null
let redis: any = null
let analysisQueue: any = null

if (typeof window === 'undefined') {
  // Only import server-side modules in Node.js environment
  try {
    prisma = require('../lib/prisma').prisma
    redis = require('../lib/redis').default
    analysisQueue = require('../lib/queue').analysisQueue
  } catch (e) {
    // Ignore if modules not available
  }
}

export interface TranscriptionResult {
  text: string
  language: string
  duration?: number
  segments?: Array<{
    id: number
    start: number
    end: number
    text: string
  }>
}

export interface AnalysisResult {
  sentiment: number
  engagement: number
  keywords: string[]
  summary?: string
  positivePoints?: string[]
  improvementAreas?: string[]
  sentimentAnalysis?: {
    overall: 'positive' | 'neutral' | 'negative'
    customerSentiment: number
    salespersonSentiment: number
  }
  engagementMetrics?: {
    conversationFlow: number
    questionQuality: number
    listeningSkills: number
  }
  salesIndicators?: {
    objections: string[]
    buyingSignals: string[]
    nextSteps: string
  }
  recommendations?: string[]
  realTimeData?: Array<{
    time: string
    sentiment: number
    engagement: number
  }>
  analyzedAt?: string
}

// Generate hash for audio caching
function generateAudioHash(audioBlob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer)
      const hash = crypto.createHash('sha256').update(buffer).digest('hex')
      resolve(hash)
    }
    reader.readAsArrayBuffer(audioBlob)
  })
}

/**
 * Transcribe audio using Whisper API with caching
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
  try {
    // Check cache first (only if Redis is available)
    const audioHash = await generateAudioHash(audioBlob)
    const cacheKey = `transcription:${audioHash}`
    
    if (redis) {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    }

    const formData = new FormData()
    const audioFile = new File([audioBlob], 'audio.webm', { type: audioBlob.type || 'audio/webm' })
    formData.append('audio', audioFile)

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error transcribing audio')
    }

    const result = await response.json()
    
    // Cache for 7 days (only if Redis is available)
    if (redis) {
      await redis.setex(cacheKey, 7 * 24 * 60 * 60, JSON.stringify(result))
    }

    return result
  } catch (error: any) {
    console.error('Transcription error:', error)
    throw error
  }
}

/**
 * Analyze transcription using GPT-4 with caching
 */
export async function analyzeTranscription(
  transcription: string,
  duration: number
): Promise<AnalysisResult> {
  try {
    // Check cache (only if Redis is available)
    const cacheKey = `analysis:${crypto.createHash('sha256').update(transcription).digest('hex')}`
    if (redis) {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    }

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcription,
        duration,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error analyzing transcription')
    }

    const result = await response.json()
    
    // Cache for 30 days (only if Redis is available)
    if (redis) {
      await redis.setex(cacheKey, 30 * 24 * 60 * 60, JSON.stringify(result))
    }

    return result
  } catch (error: any) {
    console.error('Analysis error:', error)
    throw error
  }
}

/**
 * Process audio complete: transcribe and analyze (with queue for background processing)
 */
export async function processAudioAnalysis(
  recordingId: string,
  audioBlob: Blob,
  duration: number,
  useQueue: boolean = false // Default to false for browser compatibility
): Promise<{
  transcription: TranscriptionResult
  analysis: AnalysisResult
}> {
  // Only use queue if available and explicitly requested (server-side only)
  if (useQueue && analysisQueue && typeof window === 'undefined') {
    // Add to queue for background processing
    const job = await analysisQueue.add('analyze-recording', {
      recordingId,
      audioBlob,
      duration,
    })
    
    return job.waitUntilFinished(analysisQueue)
  } else {
    // Process immediately (works in browser)
    const transcription = await transcribeAudio(audioBlob)
    const analysis = await analyzeTranscription(transcription.text, duration)
    return { transcription, analysis }
  }
}

/**
 * Process audio complete: transcribe and analyze (alias for processAudioAnalysis)
 * This is the main function used in the frontend
 */
export async function processAudioComplete(
  audioBlob: Blob,
  duration: number,
  compressBeforeUpload: boolean = true
): Promise<{
  transcription: TranscriptionResult
  analysis: AnalysisResult
}> {
  let processedBlob = audioBlob

  // Compress audio before upload if enabled
  if (compressBeforeUpload && typeof window !== 'undefined') {
    try {
      const { compressAudio } = await import('../utils/audioCompression')
      processedBlob = await compressAudio(processedBlob, {
        quality: 0.7,
        format: 'webm',
      })
      console.log('Áudio comprimido:', {
        original: audioBlob.size,
        compressed: processedBlob.size,
        ratio: ((audioBlob.size - processedBlob.size) / audioBlob.size * 100).toFixed(1) + '%'
      })
    } catch (error) {
      console.warn('Erro na compressão, usando áudio original:', error)
    }
  }

  // Process immediately (works in browser)
  const transcription = await transcribeAudio(processedBlob)
  const analysis = await analyzeTranscription(transcription.text, duration)
  return { transcription, analysis }
}
