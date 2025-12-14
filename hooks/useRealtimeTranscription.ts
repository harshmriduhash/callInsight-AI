import { useState, useEffect, useRef } from 'react'

interface TranscriptionState {
  text: string
  isListening: boolean
  error: string | null
}

export function useRealtimeTranscription(language: string = 'pt-BR') {
  const [transcription, setTranscription] = useState<TranscriptionState>({
    text: '',
    isListening: false,
    error: null,
  })
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const interimResultsRef = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setTranscription(prev => ({
        ...prev,
        error: 'Speech recognition not supported in this browser',
      }))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      console.log('Speech recognition started successfully')
      setTranscription(prev => ({ ...prev, isListening: true, error: null }))
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
          console.log('Final transcript:', transcript)
        } else {
          interimTranscript += transcript
        }
      }

      interimResultsRef.current = interimTranscript
      setTranscription(prev => {
        const newText = prev.text + finalTranscript
        console.log('Total transcription length:', newText.length)
        return {
          ...prev,
          text: newText,
        }
      })
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setTranscription(prev => ({
        ...prev,
        error: `Erro no reconhecimento: ${event.error}`,
        isListening: false,
      }))
      
      // Auto-restart on certain errors
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        console.log('Attempting to restart recognition after error:', event.error)
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              console.warn('Failed to restart recognition:', e)
            }
          }
        }, 1000)
      }
    }

    recognition.onend = () => {
      console.log('Speech recognition ended')
      setTranscription(prev => ({ ...prev, isListening: false }))
      
      // Auto-restart if still recording (continuous mode)
      // This is handled by the component's useEffect
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language])

  const start = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not initialized')
      return
    }
    
    try {
      // Always try to start, even if state check fails
      const currentState = recognitionRef.current.state || 'unknown'
      console.log('Starting speech recognition, current state:', currentState)
      
      if (currentState === 'idle' || currentState === 'stopped' || currentState === 'unknown') {
        recognitionRef.current.start()
        console.log('Speech recognition started successfully')
      } else {
        console.log('Speech recognition already running, state:', currentState)
      }
    } catch (error: any) {
      // Ignore errors if already started
      if (error.message?.includes('already started') || error.message?.includes('started')) {
        console.log('Speech recognition already started (ignoring error)')
      } else {
        console.error('Error starting speech recognition:', error)
        setTranscription(prev => ({
          ...prev,
          error: `Erro ao iniciar reconhecimento: ${error.message}`,
        }))
      }
    }
  }

  const stop = () => {
    if (recognitionRef.current && transcription.isListening) {
      try {
        // Check if recognition is running before stopping
        if (recognitionRef.current.state === 'listening' || recognitionRef.current.state === 'processing') {
          recognitionRef.current.stop()
        }
        setTranscription(prev => ({ ...prev, isListening: false }))
      } catch (error: any) {
        console.warn('Error stopping recognition:', error)
        // Force update state even if stop fails
        setTranscription(prev => ({ ...prev, isListening: false }))
      }
    }
  }

  const reset = () => {
    setTranscription({ text: '', isListening: false, error: null })
    interimResultsRef.current = ''
  }

  return {
    ...transcription,
    interimText: interimResultsRef.current,
    start,
    stop,
    reset,
  }
}

// Extend Window interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  state?: 'idle' | 'listening' | 'processing' | 'stopped'
  start(): void
  stop(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

