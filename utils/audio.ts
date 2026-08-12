export const MAX_AUDIO_BYTES = 25 * 1024 * 1024
export const AUDIO_EXTENSIONS = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'webm', 'mp4', 'mpeg', 'mpga']

export function getAudioError(name: string, size: number): string | null {
  if (size === 0) return 'The audio file is empty.'
  if (size > MAX_AUDIO_BYTES) return 'The audio file must be 25 MB or smaller.'
  const extension = name.split('.').pop()?.toLowerCase()
  if (!extension || !AUDIO_EXTENSIONS.includes(extension)) {
    return 'Please select a supported audio file (MP3, WAV, M4A, OGG, FLAC, WEBM, MP4, MPEG or MPGA).'
  }
  return null
}
