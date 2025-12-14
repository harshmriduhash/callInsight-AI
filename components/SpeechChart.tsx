import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Mic, User } from 'lucide-react'

interface SpeechSegment {
  timestamp: string
  speaker: 'salesperson' | 'customer'
  duration: number // seconds
  wordCount: number
}

interface SpeechChartProps {
  segments: SpeechSegment[]
  interruptions?: Array<{
    timestamp: string
    interrupter: 'salesperson' | 'customer'
    interrupted: 'salesperson' | 'customer'
  }>
}

export default function SpeechChart({ segments, interruptions = [] }: SpeechChartProps) {
  const chartData = useMemo(() => {
    // Group by time intervals (30 seconds)
    const interval = 30
    const dataMap: { [key: string]: { salesperson: number; customer: number } } = {}

    segments.forEach((segment) => {
      const timeInSeconds = parseTimeToSeconds(segment.timestamp)
      const intervalKey = Math.floor(timeInSeconds / interval) * interval
      const timeLabel = `${Math.floor(intervalKey / 60)}:${(intervalKey % 60).toString().padStart(2, '0')}`

      if (!dataMap[timeLabel]) {
        dataMap[timeLabel] = { salesperson: 0, customer: 0 }
      }

      if (segment.speaker === 'salesperson') {
        dataMap[timeLabel].salesperson += segment.duration
      } else {
        dataMap[timeLabel].customer += segment.duration
      }
    })

    return Object.keys(dataMap)
      .sort()
      .map((time) => ({
        time,
        salesperson: dataMap[time].salesperson,
        customer: dataMap[time].customer,
      }))
  }, [segments])

  const pieData = useMemo(() => {
    const totalSalesperson = segments
      .filter((s) => s.speaker === 'salesperson')
      .reduce((sum, s) => sum + s.duration, 0)
    const totalCustomer = segments
      .filter((s) => s.speaker === 'customer')
      .reduce((sum, s) => sum + s.duration, 0)

    return [
      { name: 'Vendedor', value: totalSalesperson, color: '#3b82f6' },
      { name: 'Cliente', value: totalCustomer, color: '#10b981' },
    ]
  }, [segments])

  const statistics = useMemo(() => {
    const salespersonSegments = segments.filter((s) => s.speaker === 'salesperson')
    const customerSegments = segments.filter((s) => s.speaker === 'customer')

    const salespersonTotalTime = salespersonSegments.reduce((sum, s) => sum + s.duration, 0)
    const customerTotalTime = customerSegments.reduce((sum, s) => sum + s.duration, 0)
    const totalTime = salespersonTotalTime + customerTotalTime

    const salespersonWords = salespersonSegments.reduce((sum, s) => sum + s.wordCount, 0)
    const customerWords = customerSegments.reduce((sum, s) => sum + s.wordCount, 0)

    const salespersonInterruptions = interruptions.filter((i) => i.interrupter === 'salesperson').length
    const customerInterruptions = interruptions.filter((i) => i.interrupter === 'customer').length

    return {
      salesperson: {
        totalTime: salespersonTotalTime,
        percentage: (salespersonTotalTime / totalTime) * 100,
        words: salespersonWords,
        wordsPerMinute: salespersonTotalTime > 0 ? (salespersonWords / salespersonTotalTime) * 60 : 0,
        interruptions: salespersonInterruptions,
        segments: salespersonSegments.length,
      },
      customer: {
        totalTime: customerTotalTime,
        percentage: (customerTotalTime / totalTime) * 100,
        words: customerWords,
        wordsPerMinute: customerTotalTime > 0 ? (customerWords / customerTotalTime) * 60 : 0,
        interruptions: customerInterruptions,
        segments: customerSegments.length,
      },
    }
  }, [segments, interruptions])

  function parseTimeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }

  const COLORS = ['#3b82f6', '#10b981']

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Gráfico de Fala</h3>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-blue-400" />
            <h4 className="font-bold text-blue-300">Vendedor</h4>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Tempo Total:</span>
              <span className="font-bold">{Math.floor(statistics.salesperson.totalTime / 60)}:{(statistics.salesperson.totalTime % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Percentual:</span>
              <span className="font-bold">{statistics.salesperson.percentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Palavras/min:</span>
              <span className="font-bold">{statistics.salesperson.wordsPerMinute.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Interrupções:</span>
              <span className="font-bold">{statistics.salesperson.interruptions}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-5 h-5 text-green-400" />
            <h4 className="font-bold text-green-300">Cliente</h4>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Tempo Total:</span>
              <span className="font-bold">{Math.floor(statistics.customer.totalTime / 60)}:{(statistics.customer.totalTime % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Percentual:</span>
              <span className="font-bold">{statistics.customer.percentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Palavras/min:</span>
              <span className="font-bold">{statistics.customer.wordsPerMinute.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Interrupções:</span>
              <span className="font-bold">{statistics.customer.interruptions}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold mb-2">Distribuição de Fala ao Longo do Tempo</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#999" tick={{ fill: '#999', fontSize: 12 }} />
              <YAxis stroke="#999" tick={{ fill: '#999', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="salesperson" stackId="a" fill="#3b82f6" name="Vendedor" />
              <Bar dataKey="customer" stackId="a" fill="#10b981" name="Cliente" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pie Chart */}
      <div>
        <h4 className="text-sm font-bold mb-2">Distribuição Total de Fala</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

