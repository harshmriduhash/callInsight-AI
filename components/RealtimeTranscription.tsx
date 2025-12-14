import { useEffect } from 'react'
import { useRealtimeTranscription } from '../hooks/useRealtimeTranscription'
import { Mic, MicOff } from 'lucide-react'
import { motion } from 'framer-motion'

interface RealtimeTranscriptionProps {
  isRecording: boolean
  onTranscriptionChange?: (text: string) => void
  language?: string
}

export default function RealtimeTranscription({
  isRecording,
  onTranscriptionChange,
  language = 'pt-BR',
}: RealtimeTranscriptionProps) {
  const { text, interimText, isListening, error, start, stop } = useRealtimeTranscription(language)

  // Sync with recording state
  useEffect(() => {
    if (isRecording) {
      // Try to start immediately and retry if needed
      console.log('Recording started, attempting to start transcription...')
      const timeout = setTimeout(() => {
        if (!isListening) {
          console.log('Starting transcription (delayed start)')
          start()
        }
      }, 500) // Increased delay to ensure microphone is ready
      
      // Also try immediately
      if (!isListening) {
        console.log('Starting transcription (immediate start)')
        start()
      }
      
      return () => clearTimeout(timeout)
    } else if (!isRecording && isListening) {
      console.log('Recording stopped, stopping transcription')
      stop()
    }
  }, [isRecording, isListening, start, stop])

  // Notify parent of transcription changes
  useEffect(() => {
    if (onTranscriptionChange) {
      const fullText = (text || '') + (interimText || '')
      onTranscriptionChange(fullText.trim())
    }
  }, [text, interimText, onTranscriptionChange])

  // Highlight keywords in real-time
  const highlightKeywords = (text: string) => {
    const keywords = ['preço', 'orçamento', 'desconto', 'prazo', 'garantia', 'produto', 'serviço']
    let highlighted = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      highlighted = highlighted.replace(regex, `<mark class="bg-yellow-300 text-yellow-900 px-1 rounded">${keyword}</mark>`)
    })
    return highlighted
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-300 text-sm font-bold">⚠️ Erro na Transcrição em Tempo Real</p>
        <p className="text-red-200 text-sm mt-2">{error}</p>
        <p className="text-gray-400 text-xs mt-3">
          <strong>Nota:</strong> A transcrição em tempo real requer um navegador compatível (Chrome, Edge). 
          Mesmo sem transcrição em tempo real, o áudio será transcrito e analisado completamente após salvar a gravação.
        </p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Mic className="w-5 h-5 text-red-400" />
            </motion.div>
          ) : (
            <MicOff className="w-5 h-5 text-gray-400" />
          )}
          Transcrição ao Vivo
        </h3>
        {isListening && (
          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
            Ouvindo...
          </span>
        )}
      </div>
      
      <div className="max-h-64 overflow-y-auto bg-black/20 rounded-lg p-4 text-sm">
        {text && (
          <div
            className="text-gray-200 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightKeywords(text) }}
          />
        )}
        {interimText && (
          <span className="text-gray-400 italic">{interimText}</span>
        )}
        {!text && !interimText && (
          <div className="text-gray-500 italic">
            <p>Aguardando fala...</p>
            {!isListening && (
              <p className="text-xs mt-2 text-yellow-400">
                ⚠️ Transcrição não iniciada. Verifique se o navegador suporta Web Speech API (Chrome/Edge) e se o microfone tem permissão.
              </p>
            )}
          </div>
        )}
      </div>
      
      {text && (
        <div className="mt-4 text-xs text-gray-400">
          {text.split(' ').length} palavras transcritas
        </div>
      )}
    </div>
  )
}

