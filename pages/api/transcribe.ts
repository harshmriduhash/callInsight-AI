import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import formidable from 'formidable'
import fs from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada. Configure a variável OPENAI_API_KEY no arquivo .env.local' })
  }

  try {
    // Parse do FormData
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max
      keepExtensions: true,
    })

    const [fields, files] = await form.parse(req)
    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio

    if (!audioFile) {
      return res.status(400).json({ error: 'Arquivo de áudio não encontrado' })
    }

    try {
      // Ler arquivo como stream (mais eficiente para arquivos grandes)
      const fileStream = fs.createReadStream(audioFile.filepath)
      
      // A OpenAI SDK aceita File, Blob, ou ReadStream
      // No Node.js, podemos passar o stream diretamente ou criar um File
      // Usando File (disponível no Node.js 18+)
      const fileBuffer = fs.readFileSync(audioFile.filepath)
      const audioFileForAPI = new File([fileBuffer], audioFile.originalFilename || 'audio.webm', {
        type: audioFile.mimetype || 'audio/webm',
      })

      // Transcrever usando Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioFileForAPI,
        model: 'whisper-1',
        language: 'pt', // Português
        response_format: 'verbose_json',
      })

      // Limpar arquivo temporário
      fs.unlinkSync(audioFile.filepath)

      return res.status(200).json({
        text: transcription.text,
        language: transcription.language,
        duration: transcription.duration,
        segments: transcription.segments || [],
      })
    } catch (error: any) {
      // Limpar arquivo temporário em caso de erro
      if (audioFile?.filepath && fs.existsSync(audioFile.filepath)) {
        try {
          fs.unlinkSync(audioFile.filepath)
        } catch (e) {
          // Ignorar erro ao deletar
        }
      }
      console.error('Erro na transcrição:', error)
      return res.status(500).json({
        error: 'Erro ao transcrever áudio',
        details: error.message,
      })
    }
  } catch (error: any) {
    console.error('Erro geral:', error)
    return res.status(500).json({
      error: 'Erro ao processar requisição',
      details: error.message,
    })
  }
}

