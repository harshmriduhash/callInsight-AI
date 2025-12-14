import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Recording {
  id: string
  name: string
  date: string
  sentiment: number
  engagement: number
  keywords: string[]
  aiData?: {
    sentiment: number
    engagement: number
    keywords: string[]
    realTimeData?: Array<{ time: string; sentiment: number; engagement: number }>
  }
}

interface ComparisonViewProps {
  recordings: Recording[]
}

export default function ComparisonView({ recordings }: ComparisonViewProps) {
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([])

  const toggleRecording = (id: string) => {
    setSelectedRecordings(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id].slice(0, 5) // Max 5 comparisons
    )
  }

  const comparisonData = recordings
    .filter(r => selectedRecordings.includes(r.id))
    .map(r => ({
      name: r.name,
      sentiment: r.aiData?.sentiment || r.sentiment || 0,
      engagement: r.aiData?.engagement || r.engagement || 0,
    }))

  const radarData = comparisonData.map((r, index) => ({
    subject: `Recording ${index + 1}`,
    sentiment: r.sentiment * 100,
    engagement: r.engagement * 100,
    fullMark: 100,
  }))

  const avgSentiment = comparisonData.reduce((sum, r) => sum + r.sentiment, 0) / comparisonData.length || 0
  const avgEngagement = comparisonData.reduce((sum, r) => sum + r.engagement, 0) / comparisonData.length || 0

  // Calculate trends
  const trends = comparisonData.map((r, i) => {
    if (i === 0) return { sentiment: 0, engagement: 0 }
    const prev = comparisonData[i - 1]
    return {
      sentiment: r.sentiment - prev.sentiment,
      engagement: r.engagement - prev.engagement,
    }
  })

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Comparar Gravações</h2>
        <p className="text-gray-300 mb-6">Selecione até 5 gravações para comparar lado a lado</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordings.map(recording => (
            <motion.button
              key={recording.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleRecording(recording.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedRecordings.includes(recording.id)
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-600 bg-black/20 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">{recording.name}</h3>
                {selectedRecordings.includes(recording.id) && (
                  <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400">
                Sentimento: {((recording.aiData?.sentiment || recording.sentiment || 0) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400">
                Engajamento: {((recording.aiData?.engagement || recording.engagement || 0) * 100).toFixed(0)}%
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {comparisonData.length > 0 && (
        <>
          {/* Comparison Chart */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Comparação de Sentimento e Engajamento</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="sentiment" stroke="#06b6d4" strokeWidth={2} name="Sentiment" />
                <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} name="Engagement" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Radar de Desempenho</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                <Radar name="Sentiment" dataKey="sentiment" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Radar name="Engagement" dataKey="engagement" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Métricas Médias</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Sentimento Médio</span>
                    <span className="font-bold">{(avgSentiment * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${avgSentiment * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Engajamento Médio</span>
                    <span className="font-bold">{(avgEngagement * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${avgEngagement * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Tendências</h3>
              <div className="space-y-2">
                {trends.map((trend, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>Gravação {i + 1} → {i + 2}</span>
                    <div className="flex items-center gap-2">
                      {trend.sentiment > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : trend.sentiment < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={trend.sentiment > 0 ? 'text-green-400' : trend.sentiment < 0 ? 'text-red-400' : 'text-gray-400'}>
                        {(trend.sentiment * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

