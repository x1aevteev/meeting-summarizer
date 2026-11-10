import OpenAI from 'openai'
import demo from '../demo.json'
import { isSummaryResult } from '../../utils/summary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const transcript = body?.transcript

  if (typeof transcript !== 'string' || !transcript.trim()) {
    throw createError({ statusCode: 400, message: 'transcript must be a non-empty string' })
  }

  if (transcript.trim() === demo.transcript) return demo.summary
  if (!config.openaiApiKey) {
    throw createError({ statusCode: 503, message: 'Summarization for other recordings requires an API key.' })
  }
  const client = new OpenAI({ apiKey: config.openaiApiKey })

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are an expert meeting assistant. Extract a structured summary from meeting transcripts.',
      },
      {
        role: 'user',
        content: `Analyze this meeting transcript and return a JSON with:
- "title": short meeting title (infer from content)
- "summary": 3-5 sentence executive summary
- "keyPoints": array of 3-7 key discussion points
- "actionItems": array of objects with { "task": string, "owner": string (if mentioned, else "TBD"), "deadline": string (if mentioned, else "") }
- "decisions": array of decisions made
- "duration": estimated meeting duration based on content (e.g. "~30 minutes")

Transcript:
${transcript}`,
      },
    ],
    temperature: 0.3,
  })

  const content = response.choices[0]?.message.content
  if (!content) throw createError({ statusCode: 502, message: 'No summary returned. Please try again.' })

  let summary: unknown
  try {
    summary = JSON.parse(content)
  } catch {
    throw createError({ statusCode: 502, message: 'Invalid summary returned. Please try again.' })
  }
  if (!isSummaryResult(summary)) {
    throw createError({ statusCode: 502, message: 'Incomplete summary returned. Please try again.' })
  }
  return summary
})
