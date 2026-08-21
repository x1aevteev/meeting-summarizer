export interface SummaryResult {
  title: string
  summary: string
  keyPoints: string[]
  actionItems: Array<{ task: string; owner: string; deadline: string }>
  decisions: string[]
  duration: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

export function isSummaryResult(value: unknown): value is SummaryResult {
  return isRecord(value)
    && typeof value.title === 'string'
    && typeof value.summary === 'string'
    && typeof value.duration === 'string'
    && isStringArray(value.keyPoints)
    && isStringArray(value.decisions)
    && Array.isArray(value.actionItems)
    && value.actionItems.every(item => isRecord(item)
      && typeof item.task === 'string'
      && typeof item.owner === 'string'
      && typeof item.deadline === 'string')
}
