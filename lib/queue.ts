import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'
import { processAudioAnalysis } from '../services/audioAnalysis'

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export const analysisQueue = new Queue('audio-analysis', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

export const analysisWorker = new Worker(
  'audio-analysis',
  async (job) => {
    const { recordingId, audioBlob, duration } = job.data
    
    try {
      const result = await processAudioAnalysis(recordingId, audioBlob, duration)
      return result
    } catch (error: any) {
      throw new Error(`Analysis failed: ${error.message}`)
    }
  },
  { connection }
)

analysisWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

analysisWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err)
})

