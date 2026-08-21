import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isSummaryResult } from '../utils/summary'

const summary = {
  title: 'Planning', summary: 'Next steps agreed.', duration: '~10 minutes',
  keyPoints: ['Ship the update'], decisions: [],
  actionItems: [{ task: 'Review', owner: 'TBD', deadline: '' }],
}

test('accepts a complete summary including empty arrays', () => {
  assert.equal(isSummaryResult(summary), true)
  assert.equal(isSummaryResult({ ...summary, actionItems: [], keyPoints: [] }), true)
})

test('rejects missing fields, wrong types and malformed action items', () => {
  for (const value of [null, [], {}, { ...summary, title: null },
    { ...summary, keyPoints: 'not an array' }, { ...summary, decisions: [42] },
    { ...summary, actionItems: [null] }, { ...summary, actionItems: [{ task: 'Review' }] }]) {
    assert.equal(isSummaryResult(value), false)
  }
})
