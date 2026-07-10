import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { documentHash, type TransactionEnvelope } from '@askewly/agent-design-engine'
import { afterEach, describe, expect, it } from 'vitest'
import { BridgeSession, resolveProjectPath } from './session.js'

const roots: string[] = []

function root(): string {
  const value = mkdtempSync(join(tmpdir(), 'agent-design-bridge-'))
  roots.push(value)
  return value
}

afterEach(() => {
  for (const value of roots.splice(0)) rmSync(value, { recursive: true, force: true })
})

function input(session: BridgeSession, id: string): TransactionEnvelope {
  const document = session.snapshot().document
  return {
    id,
    actor: 'codex',
    baseRevision: document.revision,
    beforeHash: documentHash(document),
    operations: [{ id: `op:${id}`, at: '2026-07-10T02:00:00.000Z', type: 'update-node', nodeId: firstComponent(document).id, patch: { name: id } }],
  }
}

describe('bridge session', () => {
  it('requires loopback and the exact ephemeral token', () => {
    const session = new BridgeSession({ projectRoot: root(), document: createDocumentFixture(1000), token: 'secret' })
    expect(() => session.authorize(undefined, '127.0.0.1')).toThrowError(expect.objectContaining({ code: 'AUTH_REQUIRED' }))
    expect(() => session.authorize('secret', '192.168.1.10')).toThrowError(expect.objectContaining({ code: 'LOOPBACK_REQUIRED' }))
    expect(() => session.authorize('secret', '::1')).not.toThrow()
  })

  it('rejects paths outside the trusted project root', () => {
    const project = root()
    expect(resolveProjectPath(project, 'src/App.tsx')).toBe(join(project, 'src', 'App.tsx'))
    expect(() => resolveProjectPath(project, '..\\secret.txt')).toThrowError(expect.objectContaining({ code: 'PROJECT_SCOPE_VIOLATION' }))
  })

  it('serializes commits and switches to snapshot when the cursor fell out of the log', () => {
    const session = new BridgeSession({ projectRoot: root(), document: createDocumentFixture(1000), maxEvents: 1 })
    const first = session.commit(input(session, 'tx-1'))
    const second = session.commit(input(session, 'tx-2'))
    expect([first.cursor, second.cursor]).toEqual([1, 2])
    expect(session.replay(1)).toMatchObject({ mode: 'events', cursor: 2, events: [{ transactionId: 'tx-2' }] })
    expect(session.replay(0)).toMatchObject({ mode: 'snapshot', reason: 'cursor-gap', snapshot: { cursor: 2 } })
  })
})
