export interface ExactChange {
  path: string
  before?: unknown
  after?: unknown
}

export interface VerificationEvidence {
  valid: boolean
  checks: string[]
}

export interface TransactionAuditEntry {
  transactionId: string
  actor: 'codex' | 'claude' | 'human' | 'watcher'
  kind: 'operations' | 'source-patch' | 'undo'
  revision: number
  beforeHash: string
  afterHash: string
  exactChanges: ExactChange[]
  sourceDiff?: string
  sourceFile?: string
  verification: VerificationEvidence
  committedAt: string
}

function pointer(path: string, key: string): string {
  const escaped = key.replaceAll('~', '~0').replaceAll('/', '~1')
  return `${path}/${escaped}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function exactChanges(before: unknown, after: unknown, path = ''): ExactChange[] {
  if (Object.is(before, after)) return []
  if (Array.isArray(before) && Array.isArray(after)) {
    return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ path: path || '/', before: structuredClone(before), after: structuredClone(after) }]
  }
  if (isRecord(before) && isRecord(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
    return keys.flatMap((key) => {
      if (!(key in before)) return [{ path: pointer(path, key), after: structuredClone(after[key]) }]
      if (!(key in after)) return [{ path: pointer(path, key), before: structuredClone(before[key]) }]
      return exactChanges(before[key], after[key], pointer(path, key))
    })
  }
  return [{ path: path || '/', before: structuredClone(before), after: structuredClone(after) }]
}

export function unifiedDiff(file: string, before: string, after: string): string {
  if (before === after) return ''
  const beforeLines = before.split('\n')
  const afterLines = after.split('\n')
  return [
    `--- a/${file}`,
    `+++ b/${file}`,
    `@@ -1,${beforeLines.length} +1,${afterLines.length} @@`,
    ...beforeLines.map((line) => `-${line}`),
    ...afterLines.map((line) => `+${line}`),
  ].join('\n')
}
