import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createDocumentFixture } from '@askewly/canvas-core'
import { createSnapshot, type TransactionAuditEntry } from '@askewly/agent-design-engine'
import { afterEach, describe, expect, it } from 'vitest'
import { DesktopRecoveryStore, type RecoveryFaultStage } from './desktop-recovery.js'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function root(): string {
  const value = mkdtempSync(join(tmpdir(), 'agent-design-recovery-'))
  roots.push(value)
  return value
}

function audit(revision: number): TransactionAuditEntry {
  return {
    transactionId: `tx-${revision}`,
    actor: 'codex',
    kind: 'operations',
    revision,
    beforeHash: `before-${revision}`,
    afterHash: `after-${revision}`,
    exactChanges: [],
    verification: { valid: true, checks: ['test'] },
    committedAt: `2026-07-11T01:00:0${revision}.000Z`,
  }
}

describe('desktop recovery generations', () => {
  it('atomically recovers matching snapshot and audit generations', () => {
    const directory = root()
    const store = new DesktopRecoveryStore(directory)
    const first = createSnapshot(createDocumentFixture(1000), 0)
    store.commit(first, [])
    const nextDocument = structuredClone(first.document)
    nextDocument.revision = 1
    const second = createSnapshot(nextDocument, 1)
    const entry = audit(1)
    const generation = store.commit(second, [entry])
    expect(store.recover()).toMatchObject({ mode: 'recovered', generation, snapshot: { cursor: 1, revision: 1 }, audits: [entry] })
    expect(readFileSync(join(directory, 'generations', generation, 'audit.jsonl'), 'utf8')).toContain('"transactionId":"tx-1"')
  })

  it('quarantines a corrupt current generation and opens the previous generation read-only', () => {
    const directory = root()
    const store = new DesktopRecoveryStore(directory)
    const first = createSnapshot(createDocumentFixture(1000), 0)
    const firstGeneration = store.commit(first, [])
    const nextDocument = structuredClone(first.document)
    nextDocument.revision = 1
    const secondGeneration = store.commit(createSnapshot(nextDocument, 1), [audit(1)])
    writeFileSync(join(directory, 'generations', secondGeneration, 'snapshot.json'), '{corrupt')
    expect(store.recover()).toMatchObject({ mode: 'read-only', generation: firstGeneration, snapshot: { cursor: 0 } })
    expect(readdirSync(join(directory, 'generations')).some((name) => name.startsWith(`.corrupt-${secondGeneration}`))).toBe(true)
  })

  it.each(['after-files-fsync', 'after-generation-rename', 'before-pointer-swap'] as RecoveryFaultStage[])(
    'keeps the prior CURRENT generation when failure is injected at %s',
    (stage) => {
      const directory = root()
      const baseline = new DesktopRecoveryStore(directory)
      const first = createSnapshot(createDocumentFixture(1000), 0)
      const firstGeneration = baseline.commit(first, [])
      const nextDocument = structuredClone(first.document)
      nextDocument.revision = 1
      const failing = new DesktopRecoveryStore(directory, (current) => { if (current === stage) throw new Error(`fault:${stage}`) })
      expect(() => failing.commit(createSnapshot(nextDocument, 1), [audit(1)])).toThrow(`fault:${stage}`)
      expect(new DesktopRecoveryStore(directory).recover()).toMatchObject({ generation: firstGeneration, snapshot: { cursor: 0 } })
    },
  )
})
