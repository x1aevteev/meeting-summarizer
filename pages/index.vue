<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Meeting Summarizer</h1>
      <p class="text-gray-500">Upload a meeting recording → get transcript + summary + action items</p>
    </div>

    <!-- Upload -->
    <div v-if="!result" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div
        class="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center transition hover:border-indigo-400 cursor-pointer"
        role="button"
        :tabindex="loading ? -1 : 0"
        :aria-disabled="loading"
        aria-label="Choose an audio recording"
        @click="fileInput?.click()"
        @keydown.enter.prevent="fileInput?.click()"
        @keydown.space.prevent="fileInput?.click()"
        @dragover.prevent
        @drop.prevent="onDrop">
        <div class="text-5xl mb-4">🎙️</div>
        <p class="text-gray-700 font-medium mb-1">Drop an audio file here, or click to browse</p>
        <p class="text-gray-400 text-sm">Supports MP3, WAV, M4A, OGG, FLAC, WEBM, MP4, MPEG, MPGA (max 25MB)</p>
        <input ref="fileInput" type="file" :accept="AUDIO_EXTENSIONS.map(ext => `.${ext}`).join(',')" :disabled="loading" class="hidden" @change="onFileSelect" />
      </div>

      <div v-if="file" class="mt-4 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
        <span class="text-2xl">🎵</span>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-800 truncate">{{ file.name }}</div>
          <div class="text-xs text-gray-400">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</div>
        </div>
        <button @click="file = null" :disabled="loading" aria-label="Remove audio file" class="text-gray-400 hover:text-gray-600 disabled:opacity-50">✕</button>
      </div>

      <div class="mt-6">
        <button
          @click="process"
          :disabled="!file || loading"
          class="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
          {{ loading ? stepLabel : 'Transcribe & Summarize' }}
        </button>
      </div>

      <div v-if="loading" class="mt-4">
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-500 rounded-full transition-all duration-500" :style="{ width: progress + '%' }" />
        </div>
        <p role="status" class="text-xs text-gray-400 mt-1 text-center">{{ stepLabel }}</p>
      </div>

      <p v-if="error" role="alert" class="mt-4 text-red-600 text-sm bg-red-50 rounded-lg p-3">{{ error }}</p>
    </div>

    <!-- Results -->
    <div v-if="result">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-900">{{ result.title }}</h2>
        <div class="flex flex-wrap gap-2">
          <button @click="copyMarkdown" class="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            {{ copied ? '✓ Copied' : 'Copy MD' }}
          </button>
          <button @click="downloadMarkdown" class="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Download MD
          </button>
          <button @click="reset" class="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            New Recording
          </button>
        </div>
      </div>

      <p v-if="copyError" role="alert" class="mb-4 text-red-600 text-sm">{{ copyError }}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="md:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="font-semibold text-gray-800 mb-2">Summary</h3>
          <p class="text-gray-700 text-sm leading-relaxed">{{ result.summary }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="font-semibold text-gray-800 mb-3">Key Points</h3>
          <ul class="space-y-1.5">
            <li v-for="pt in result.keyPoints" :key="pt" class="text-sm text-gray-700 flex gap-2">
              <span class="text-indigo-500 mt-0.5">•</span> {{ pt }}
            </li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="font-semibold text-gray-800 mb-3">Action Items</h3>
          <div v-if="result.actionItems.length" class="space-y-2">
            <div v-for="item in result.actionItems" :key="item.task" class="flex items-start gap-3">
              <div class="w-5 h-5 rounded border-2 border-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div class="text-sm font-medium text-gray-800">{{ item.task }}</div>
                <div class="text-xs text-gray-400 mt-0.5">
                  <span v-if="item.owner !== 'TBD'">{{ item.owner }}</span>
                  <span v-if="item.deadline"> · {{ item.deadline }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">No action items</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <h3 class="font-semibold text-gray-800 mb-3">Decisions</h3>
          <ul v-if="result.decisions.length" class="space-y-2">
            <li v-for="d in result.decisions" :key="d" class="text-sm text-gray-700 flex gap-2">
              <span class="text-green-500">✓</span> {{ d }}
            </li>
          </ul>
          <p v-else class="text-gray-400 text-sm">No decisions recorded</p>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-gray-800">Transcript</h3>
          <span class="text-xs text-gray-400">{{ result.duration }}</span>
        </div>
        <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ transcript }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AUDIO_EXTENSIONS, getAudioError } from '~/utils/audio'
import type { SummaryResult } from '~/utils/summary'

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const progress = ref(0)
const stepLabel = ref('')
const error = ref('')
const transcript = ref('')
const result = ref<SummaryResult | null>(null)
const copied = ref(false)
const copyError = ref('')
let copyTimer: ReturnType<typeof setTimeout> | undefined
onUnmounted(() => clearTimeout(copyTimer))

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  selectFile(input.files?.[0] ?? null)
  input.value = ''
}

function onDrop(e: DragEvent) {
  selectFile(e.dataTransfer?.files?.[0] ?? null)
}

function selectFile(candidate: File | null) {
  if (loading.value || !candidate) return
  error.value = getAudioError(candidate.name, candidate.size) || ''
  file.value = error.value ? null : candidate
}

async function process() {
  if (!file.value || loading.value) return
  loading.value = true
  error.value = ''
  progress.value = 10
  stepLabel.value = 'Uploading audio...'

  try {
    const form = new FormData()
    form.append('file', file.value)

    stepLabel.value = 'Transcribing with Whisper...'
    progress.value = 30

    const { transcript: t } = await $fetch<{ transcript: string }>('/api/transcribe', {
      method: 'POST',
      body: form,
    })
    transcript.value = t
    progress.value = 65
    stepLabel.value = 'Generating summary with GPT-4o...'

    const summary = await $fetch<SummaryResult>('/api/summarize', {
      method: 'POST',
      body: { transcript: t },
    })
    progress.value = 100
    result.value = summary
  } catch (e: any) {
    error.value = e?.data?.message || 'Something went wrong. Check your OpenAI API key.'
  } finally {
    loading.value = false
  }
}

function buildMarkdown(): string {
  if (!result.value) return ''
  const r = result.value
  const lines = [
    `# ${r.title}`,
    '',
    `> ${r.duration}`,
    '',
    '## Summary',
    r.summary,
    '',
    '## Key Points',
    ...r.keyPoints.map(p => `- ${p}`),
    '',
    '## Action Items',
    ...r.actionItems.map(a => `- [ ] ${a.task}${a.owner !== 'TBD' ? ` — ${a.owner}` : ''}${a.deadline ? ` (${a.deadline})` : ''}`),
    '',
    '## Decisions',
    ...r.decisions.map(d => `- ✓ ${d}`),
    '',
    '## Transcript',
    transcript.value,
  ]
  return lines.join('\n')
}

async function copyMarkdown() {
  clearTimeout(copyTimer)
  copied.value = false
  copyError.value = ''
  try {
    await navigator.clipboard.writeText(buildMarkdown())
    copied.value = true
    copyTimer = setTimeout(() => copied.value = false, 2000)
  } catch {
    copyError.value = 'Could not access the clipboard. Use Download MD instead.'
  }
}

function downloadMarkdown() {
  const blob = new Blob([buildMarkdown()], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meeting-summary-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function reset() {
  clearTimeout(copyTimer)
  copied.value = false
  copyError.value = ''
  stepLabel.value = ''
  file.value = null
  result.value = null
  transcript.value = ''
  error.value = ''
  progress.value = 0
}
</script>
