# Meeting Summarizer

Upload a meeting audio recording (MP3/WAV/M4A) → get a full transcript via OpenAI Whisper → structured summary, key points, action items, and decisions via GPT-4o. Export as Markdown.

## Stack

- **Nuxt 3** — fullstack framework
- **OpenAI Whisper** — audio transcription
- **OpenAI GPT-4o** — meeting analysis
- **Tailwind CSS** — styling

## Features

- Drag & drop audio file upload
- Real-time progress tracking
- Transcript from Whisper
- AI-generated summary (executive overview)
- Key discussion points
- Action items with owner and deadline
- Decisions made
- Copy to clipboard or download as Markdown

## Getting Started

```bash
npm install
cp .env.example .env
# Add your OpenAI API key
npm run dev
```

Open http://localhost:3000

## Environment Variables

```
OPENAI_API_KEY=sk-...
```

## Supported Audio Formats

MP3, WAV, M4A, OGG, FLAC, WEBM (up to 25MB — Whisper API limit)

## Project Structure

```
├── pages/index.vue              # Main UI
├── server/api/
│   ├── transcribe.post.ts       # Whisper transcription
│   └── summarize.post.ts        # GPT-4o analysis
└── nuxt.config.ts
```
