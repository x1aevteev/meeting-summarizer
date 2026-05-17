import OpenAI from 'openai'
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const client = new OpenAI({ apiKey: config.openaiApiKey })

  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const filePart = parts.find(p => p.name === 'file')
  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 400, message: 'Missing file field' })
  }

  const filename = filePart.filename || 'audio.mp3'
  const blob = new Blob([filePart.data], { type: filePart.type || 'audio/mpeg' })
  const file = new File([blob], filename)

  const transcription = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'text',
  })

  return { transcript: transcription }
})
