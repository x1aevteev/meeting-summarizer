# Meeting Summarizer

Upload a meeting audio recording (MP3/WAV/M4A) → get a full transcript via OpenAI Whisper → structured summary, key points, action items, and decisions via GPT-4o. Export as Markdown.

## Stack

- **Nuxt 3** — fullstack framework
- **OpenAI Whisper** — audio transcription
- **OpenAI GPT-4o** — meeting analysis
- **Tailwind CSS** — styling

## Features

- Drag & drop audio file upload
- Processing stage indicator (estimated progress, not a live upload percentage)
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

MP3, WAV, M4A, OGG, FLAC, WEBM, MP4, MPEG, MPGA. The application rejects empty files and files larger than 25 MiB before sending them to OpenAI. An accepted extension does not guarantee that a file contains decodable audio.

## Checks and production build

Use Node.js 22 LTS or newer.

```bash
npm test
npm run build
NUXT_OPENAI_API_KEY=your-key node .output/server/index.mjs
```

Tests cover audio validation boundaries and the structured summary response without calling OpenAI. The production server reads `NUXT_OPENAI_API_KEY` at runtime; keep this variable on the server, never in public client configuration. Set it through your hosting provider's secret manager rather than committing it.

## Privacy and deployment limits

- Audio is sent to the application server and then OpenAI; the transcript is sent to OpenAI for summarization. Obtain permission before uploading recordings.
- The application has no database or saved meeting history. Refreshing the page clears the current result; download Markdown if you need to keep it. Provider retention policies still apply.
- This demo does not include authentication or rate limiting. Add access controls, request limits and usage monitoring before making it publicly accessible with a paid API key.
- A rejected or incomplete AI response is reported as an error instead of being rendered as a broken result. Retrying the full flow transcribes the audio again and can incur another API charge.
- Clipboard access may be blocked by the browser or an insecure connection. Use **Download MD** as a fallback.

## Project Structure

```
├── pages/index.vue              # Main UI
├── server/api/
│   ├── transcribe.post.ts       # Whisper transcription
│   └── summarize.post.ts        # GPT-4o analysis
└── nuxt.config.ts
```

## Offline walkthrough

Run `npm install` and `npm run dev`, then upload `public/samples/planning.m4a`. This is a synthetic meeting recording; the server matches its content hash and replays the corresponding transcript and summary from `server/demo.json`. No credentials or network requests to OpenAI are needed. Other recordings require a configured key.
