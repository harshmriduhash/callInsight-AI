import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface EmotionData {
  time: string
  salespersonEmotion: string
  customerEmotion: string
  intensity?: number
}

interface EmotionHeatmapProps {
  emotionTimeline: EmotionData[]
  duration: number // seconds
  cellSize?: number // pixels
}

export default function EmotionHeatmap({
  emotionTimeline,
  duration,
  cellSize = 20,
}: EmotionHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Group emotions by time intervals (30 seconds each)
    const interval = 30 // seconds
    const intervals = Math.ceil(duration / interval)
    const data: Array<{
      time: string
      salespersonEmotion: string
      customerEmotion: string
      intensity: number
      count: number
    }> = []

    for (let i = 0; i < intervals; i++) {
      const startTime = i * interval
      const endTime = Math.min((i + 1) * interval, duration)
      const timeLabel = `${Math.floor(startTime / 60)}:${(startTime % 60).toString().padStart(2, '0')}`

      const emotionsInInterval = emotionTimeline.filter((item) => {
        const timeInSeconds = parseTimeToSeconds(item.time)
        return timeInSeconds >= startTime && timeInSeconds < endTime
      })

      if (emotionsInInterval.length > 0) {
        const avgSalespersonEmotion = getEmotionValue(
          emotionsInInterval[emotionsInInterval.length - 1].salespersonEmotion
        )
        const avgCustomerEmotion = getEmotionValue(
          emotionsInInterval[emotionsInInterval.length - 1].customerEmotion
        )
        const avgIntensity =
          emotionsInInterval.reduce((sum, item) => sum + (item.intensity || 0.5), 0) /
          emotionsInInterval.length

        data.push({
          time: timeLabel,
          salespersonEmotion: emotionsInInterval[emotionsInInterval.length - 1].salespersonEmotion,
          customerEmotion: emotionsInInterval[emotionsInInterval.length - 1].customerEmotion,
          intensity: avgIntensity,
          count: emotionsInInterval.length,
        })
      } else {
        data.push({
          time: timeLabel,
          salespersonEmotion: 'neutral',
          customerEmotion: 'neutral',
          intensity: 0.5,
          count: 0,
        })
      }
    }

    return data
  }, [emotionTimeline, duration])

  function parseTimeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }

  function getEmotionValue(emotion: string): number {
    const emotionMap: { [key: string]: number } = {
      joy: 0.9,
      confidence: 0.8,
      excitement: 0.85,
      calm: 0.7,
      neutral: 0.5,
      anxiety: 0.3,
      frustration: 0.2,
      anger: 0.1,
    }
    return emotionMap[emotion.toLowerCase()] || 0.5
  }

  function getEmotionColor(emotion: string, intensity: number): string {
    const baseColors: { [key: string]: string } = {
      joy: 'from-yellow-400 to-green-500',
      confidence: 'from-blue-400 to-blue-600',
      excitement: 'from-pink-400 to-red-500',
      calm: 'from-green-400 to-teal-500',
      neutral: 'from-gray-400 to-gray-600',
      anxiety: 'from-orange-400 to-red-500',
      frustration: 'from-red-400 to-red-600',
      anger: 'from-red-600 to-red-800',
    }

    const colorClass = baseColors[emotion.toLowerCase()] || 'from-gray-400 to-gray-600'
    const opacity = Math.max(0.3, Math.min(1, intensity))

    return `bg-gradient-to-r ${colorClass} opacity-${Math.round(opacity * 10)}`
  }

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Heatmap de Emoções</h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded" />
              <span>Vendedor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded" />
              <span>Cliente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded opacity-30" />
              <span>Baixa Intensidade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded opacity-100" />
              <span>Alta Intensidade</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Salesperson Emotions */}
            <div>
              <h4 className="text-sm font-bold mb-2 text-blue-300">Vendedor</h4>
              <div className="flex flex-col gap-1">
                {heatmapData.map((item, index) => (
                  <motion.div
                    key={`salesperson-${index}`}
                    className={`h-${cellSize / 4} rounded ${getEmotionColor(
                      item.salespersonEmotion,
                      item.intensity
                    )} flex items-center justify-between px-2 text-xs`}
                    whileHover={{ scale: 1.05 }}
                    title={`${item.time}: ${item.salespersonEmotion} (${(item.intensity * 100).toFixed(0)}%)`}
                  >
                    <span className="text-white font-medium">{item.time}</span>
                    <span className="text-white/80 text-xs">{item.salespersonEmotion}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Customer Emotions */}
            <div>
              <h4 className="text-sm font-bold mb-2 text-green-300">Cliente</h4>
              <div className="flex flex-col gap-1">
                {heatmapData.map((item, index) => (
                  <motion.div
                    key={`customer-${index}`}
                    className={`h-${cellSize / 4} rounded ${getEmotionColor(
                      item.customerEmotion,
                      item.intensity
                    )} flex items-center justify-between px-2 text-xs`}
                    whileHover={{ scale: 1.05 }}
                    title={`${item.time}: ${item.customerEmotion} (${(item.intensity * 100).toFixed(0)}%)`}
                  >
                    <span className="text-white font-medium">{item.time}</span>
                    <span className="text-white/80 text-xs">{item.customerEmotion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Emoção Dominante (Vendedor):</span>
            <span className="ml-2 font-bold">
              {getMostFrequentEmotion(heatmapData.map((d) => d.salespersonEmotion))}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Emoção Dominante (Cliente):</span>
            <span className="ml-2 font-bold">
              {getMostFrequentEmotion(heatmapData.map((d) => d.customerEmotion))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getMostFrequentEmotion(emotions: string[]): string {
  const counts: { [key: string]: number } = {}
  emotions.forEach((emotion) => {
    counts[emotion] = (counts[emotion] || 0) + 1
  })
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), 'neutral')
}

