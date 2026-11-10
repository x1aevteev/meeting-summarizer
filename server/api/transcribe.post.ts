import OpenAI from 'openai'
import { createHash } from 'node:crypto'
import demo from '../demo.json'
import { readMultipartFormData } from 'h3'
import { getAudioError, MAX_AUDIO_BYTES } from '../../utils/audio'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const filePart = parts.find(p => p.name === 'file')
  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 400, message: 'Missing file field' })
  }

  const filename = filePart.filename || ''
  const validationError = getAudioError(filename, filePart.data.length)
  if (validationError) {
    throw createError({
      statusCode: filePart.data.length > MAX_AUDIO_BYTES ? 413 : 400,
      message: validationError,
    })
  }
  if (createHash('sha256').update(filePart.data).digest('hex') === demo.sha256) {
    return { transcript: demo.transcript }
  }
  if (!config.openaiApiKey) {
    throw createError({ statusCode: 503, message: 'For offline playback, upload the included planning.m4a recording.' })
  }
  const client = new OpenAI({ apiKey: config.openaiApiKey })
  const blob = new Blob([filePart.data], { type: filePart.type || 'audio/mpeg' })
  const file = new File([blob], filename)

  const transcription = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    response_format: 'text',
  })

  return { transcript: transcription }
})
