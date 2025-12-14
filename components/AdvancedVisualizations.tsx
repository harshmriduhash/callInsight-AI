import { useMemo } from 'react'
import { motion } from 'framer-motion'
import WordCloud from 'react-wordcloud'

interface Recording {
  aiData?: {
    keywords: string[]
    realTimeData?: Array<{ time: string; sentiment: number; engagement: number }>
  }
}

interface AdvancedVisualizationsProps {
  recordings: Recording[]
}

export function SentimentHeatmap({ recordings }: AdvancedVisualizationsProps) {
  const heatmapData = useMemo(() => {
    const data: Array<{ time: string; sentiment: number }> = []
    
    recordings.forEach((rec, recIndex) => {
      rec.aiData?.realTimeData?.forEach(point => {
        data.push({
          time: `${recIndex}-${point.time}`,
          sentiment: point.sentiment,
        })
      })
    })

    // Group by time segments
    const grouped: { [key: string]: number[] } = {}
    data.forEach(item => {
      const segment = item.time.split(':')[0] // Get minute
      if (!grouped[segment]) grouped[segment] = []
      grouped[segment].push(item.sentiment)
    })

    return Object.entries(grouped).map(([time, sentiments]) => ({
      time,
      avgSentiment: sentiments.reduce((a, b) => a + b, 0) / sentiments.length,
    }))
  }, [recordings])

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Sentiment Heatmap</h3>
      <div className="grid grid-cols-12 gap-1">
        {heatmapData.map((item, index) => {
          const intensity = Math.min(item.avgSentiment * 100, 100)
          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className="aspect-square rounded"
              style={{
                backgroundColor: `rgba(6, 182, 212, ${intensity / 100})`,
              }}
              title={`${item.time}: ${intensity.toFixed(0)}%`}
            />
          )
        })}
      </div>
    </div>
  )
}

export function KeywordWordCloud({ recordings }: AdvancedVisualizationsProps) {
  const wordData = useMemo(() => {
    const keywordCounts: { [key: string]: number } = {}
    
    recordings.forEach(rec => {
      rec.aiData?.keywords?.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1
      })
    })

    return Object.entries(keywordCounts)
      .map(([text, value]) => ({ text, value: value * 10 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50)
  }, [recordings])

  if (wordData.length === 0) return null

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Keyword Word Cloud</h3>
      <div className="h-64 flex items-center justify-center">
        <WordCloud
          words={wordData}
          options={{
            fontSizes: [20, 60],
            rotations: 0,
            colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
          }}
        />
      </div>
    </div>
  )
}

export function InteractiveTimeline({ recordings }: AdvancedVisualizationsProps) {
  const timelineData = useMemo(() => {
    return recordings
      .filter(rec => rec.aiData?.realTimeData)
      .map((rec, index) => ({
        id: index,
        name: `Recording ${index + 1}`,
        data: rec.aiData!.realTimeData!,
      }))
  }, [recordings])

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Interactive Timeline</h3>
      <div className="space-y-4">
        {timelineData.map((item, index) => (
          <div key={index} className="border-l-2 border-cyan-500 pl-4">
            <h4 className="font-bold mb-2">{item.name}</h4>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {item.data.map((point, pIndex) => (
                <motion.div
                  key={pIndex}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-1 min-w-[60px]"
                >
                  <div
                    className="w-full h-8 rounded"
                    style={{
                      backgroundColor: `rgba(6, 182, 212, ${point.sentiment})`,
                    }}
                    title={`Sentiment: ${(point.sentiment * 100).toFixed(0)}%`}
                  />
                  <div
                    className="w-full h-8 rounded"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${point.engagement})`,
                    }}
                    title={`Engagement: ${(point.engagement * 100).toFixed(0)}%`}
                  />
                  <span className="text-xs text-gray-400">{point.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

