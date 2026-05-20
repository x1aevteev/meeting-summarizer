import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { transcript } = await readBody(event)

  if (!transcript) {
    throw createError({ statusCode: 400, message: 'transcript is required' })
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

  const content = response.choices[0].message.content
  if (!content) throw createError({ statusCode: 500, message: 'No response from OpenAI' })

  return JSON.parse(content)
})
