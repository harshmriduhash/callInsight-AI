import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Play, Pause, RotateCcw } from 'lucide-react'

interface TrainingModeProps {
  onStart: () => void
  onStop: () => void
  isRecording: boolean
  scenario?: string
}

const scenarios = [
  {
    id: 'objection-price',
    name: 'Objeção de Preço',
    description: 'Pratique lidar com objeções de preço',
    script: 'Customer: "This is too expensive for our budget."',
  },
  {
    id: 'objection-timeline',
    name: 'Objeção de Prazo',
    description: 'Pratique lidar com preocupações de prazo',
    script: 'Customer: "We need this implemented faster than you can deliver."',
  },
  {
    id: 'competitor',
    name: 'Menção de Concorrente',
    description: 'Pratique responder a menções de concorrentes',
    script: 'Customer: "We are also considering [Competitor Name]."',
  },
  {
    id: 'closing',
    name: 'Fechamento de Venda',
    description: 'Pratique técnicas de fechamento',
    script: 'Customer: "I need to think about it."',
  },
]

export default function TrainingMode({ onStart, onStop, isRecording, scenario }: TrainingModeProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [showScript, setShowScript] = useState(false)

  const handleStart = () => {
    if (selectedScenario) {
      onStart()
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-2xl font-bold">Modo de Treinamento</h2>
            <p className="text-gray-300 text-sm">Pratique suas habilidades de vendas sem clientes reais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {scenarios.map(scen => (
            <motion.button
              key={scen.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedScenario(scen.id)
                setShowScript(true)
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedScenario === scen.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-600 bg-black/20 hover:border-gray-500'
              }`}
            >
              <h3 className="font-bold mb-1">{scen.name}</h3>
              <p className="text-sm text-gray-400">{scen.description}</p>
            </motion.button>
          ))}
        </div>

        {selectedScenario && showScript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">Roteiro do Cenário</h4>
              <button
                onClick={() => setShowScript(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-300">
              {scenarios.find(s => s.id === selectedScenario)?.script}
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">
              Pratique sua resposta para este cenário
            </p>
          </motion.div>
        )}

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!selectedScenario || isRecording}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              !selectedScenario || isRecording
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600'
            }`}
          >
            {isRecording ? (
              <>
                <Pause className="w-5 h-5" />
                Gravando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Iniciar Sessão de Prática
              </>
            )}
          </motion.button>

          {isRecording && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700"
            >
              <Pause className="w-5 h-5" />
              Parar Gravação
            </motion.button>
          )}

          {selectedScenario && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedScenario(null)
                setShowScript(false)
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium glass hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </motion.button>
          )}
        </div>
      </div>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-6 border-2 border-yellow-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h3 className="font-bold">Sessão de Prática Ativa</h3>
          </div>
          <p className="text-sm text-gray-300">
            Você está agora no modo de treinamento. Pratique sua resposta para o cenário.
            Sua gravação será analisada com feedback imediato.
          </p>
        </motion.div>
      )}
    </div>
  )
}

