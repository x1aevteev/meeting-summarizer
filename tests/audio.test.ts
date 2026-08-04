import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AUDIO_EXTENSIONS, getAudioError, MAX_AUDIO_BYTES } from '../utils/audio'

test('accepts every advertised audio extension', () => {
  for (const extension of AUDIO_EXTENSIONS) {
    assert.equal(getAudioError(`recording.${extension}`, 1024), null)
  }
})

test('file extensions are case insensitive', () => {
  assert.equal(getAudioError('meeting.final.MP3', 1024), null)
})

test('allows the exact size limit and rejects one byte more', () => {
  assert.equal(getAudioError('recording.mp3', MAX_AUDIO_BYTES), null)
  assert.match(getAudioError('recording.mp3', MAX_AUDIO_BYTES + 1)!, /25 MB/)
})

test('rejects empty files', () => {
  assert.match(getAudioError('recording.mp3', 0)!, /empty/)
})

test('rejects missing and unsupported extensions', () => {
  for (const name of ['', 'recording', 'recording.txt', 'recording.mp3.exe']) {
    assert.match(getAudioError(name, 1024)!, /supported audio/)
  }
})
