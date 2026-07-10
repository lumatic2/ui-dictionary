import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { documentHash, type TransactionEnvelope } from '@askewly/agent-design-engine'
import { afterEach, describe, expect, it } from 'vitest'
import { BridgeSession, resolveProjectPath, sourceHash } from './session.js'

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

  it('undoes the latest transaction as a new guarded revision', () => {
    const session = new BridgeSession({ projectRoot: root(), document: createDocumentFixture(1000) })
    const original = session.snapshot()
    session.commit(input(session, 'tx-change'))
    const changed = session.snapshot()
    const event = session.undo({ id: 'tx-undo', actor: 'claude', baseRevision: changed.revision, beforeHash: changed.hash, at: '2026-07-10T02:01:00.000Z' })
    expect(event.transactionId).toBe('tx-undo')
    expect(session.snapshot().document.nodes[firstComponent(original.document).id]?.name).toBe(firstComponent(original.document).name)
    expect(session.snapshot().revision).toBe(2)
  })

  it('atomically applies, audits, and undoes an allowlisted source patch', () => {
    const project = root()
    const file = join(project, 'src', 'components', 'Fixture1.tsx')
    mkdirSync(join(project, 'src', 'components'), { recursive: true })
    const before = 'export const Fixture1 = () => <div>Before</div>\n'
    const after = 'export const Fixture1 = () => <div>After</div>\n'
    writeFileSync(file, before)
    const session = new BridgeSession({ projectRoot: project, document: createDocumentFixture(1000), verifySource: () => ({ valid: true, checks: ['fixture-verify'] }) })
    const snapshot = session.snapshot()
    const event = session.applySourcePatch({
      transactionId: 'tx-source', actor: 'codex', baseRevision: snapshot.revision, beforeHash: snapshot.hash,
      file: 'src/components/Fixture1.tsx', beforeFileHash: sourceHash(before), content: after, at: '2026-07-10T02:10:00.000Z',
    })
    expect(readFileSync(file, 'utf8')).toBe(after)
    expect(event.sourcePatch).toMatchObject({ file: 'src/components/Fixture1.tsx', beforeFileHash: sourceHash(before), afterFileHash: sourceHash(after) })
    expect(session.auditLog().at(-1)).toMatchObject({ transactionId: 'tx-source', kind: 'source-patch', verification: { valid: true, checks: ['fixture-verify'] } })
    expect(session.auditLog().at(-1)?.sourceDiff).toContain('-export const Fixture1 = () => <div>Before</div>')
    const changed = session.snapshot()
    session.undo({ id: 'undo-source', actor: 'claude', baseRevision: changed.revision, beforeHash: changed.hash, at: '2026-07-10T02:11:00.000Z' })
    expect(readFileSync(file, 'utf8')).toBe(before)
    expect(session.auditLog().at(-1)?.kind).toBe('undo')
  })

  it('leaves source, revision, and audit unchanged when verification or audit persistence fails', () => {
    const project = root()
    const file = join(project, 'src', 'components', 'Fixture1.tsx')
    mkdirSync(join(project, 'src', 'components'), { recursive: true })
    const before = 'export const Fixture1 = () => <div>Before</div>\n'
    writeFileSync(file, before)
    const document = createDocumentFixture(1000)
    const failingVerify = new BridgeSession({ projectRoot: project, document, verifySource: () => ({ valid: false, checks: ['tsx-build'] }) })
    const request = { transactionId: 'tx-fail', actor: 'codex' as const, baseRevision: 0, beforeHash: failingVerify.snapshot().hash, file: 'src/components/Fixture1.tsx', beforeFileHash: sourceHash(before), content: 'broken', at: '2026-07-10T02:12:00.000Z' }
    expect(() => failingVerify.applySourcePatch(request)).toThrowError(/verification failed/)
    expect(readFileSync(file, 'utf8')).toBe(before)
    expect(failingVerify.snapshot().revision).toBe(0)
    expect(failingVerify.auditLog()).toEqual([])

    const failingAudit = new BridgeSession({ projectRoot: project, document, verifySource: () => ({ valid: true, checks: ['tsx-build'] }), auditSink: () => { throw new Error('audit disk full') } })
    expect(() => failingAudit.applySourcePatch({ ...request, transactionId: 'tx-audit', beforeHash: failingAudit.snapshot().hash })).toThrowError('audit disk full')
    expect(readFileSync(file, 'utf8')).toBe(before)
    expect(failingAudit.snapshot().revision).toBe(0)
    expect(failingAudit.auditLog()).toEqual([])
  })

  it('serializes competing actors, rejects duplicate IDs, and audits exact operation changes', () => {
    const session = new BridgeSession({ projectRoot: root(), document: createDocumentFixture(1000) })
    const shared = session.snapshot()
    const nodeId = firstComponent(shared.document).id
    const codex: TransactionEnvelope = {
      id: 'tx-race-codex', actor: 'codex', baseRevision: shared.revision, beforeHash: shared.hash,
      operations: [{ id: 'op-race-codex', at: '2026-07-10T02:20:00.000Z', type: 'update-node', nodeId, patch: { name: 'Codex wins' } }],
    }
    const claude: TransactionEnvelope = {
      id: 'tx-race-claude', actor: 'claude', baseRevision: shared.revision, beforeHash: shared.hash,
      operations: [{ id: 'op-race-claude', at: '2026-07-10T02:20:00.000Z', type: 'update-node', nodeId, patch: { name: 'Claude stale' } }],
    }
    session.commit(codex)
    expect(() => session.commit(claude)).toThrowError(expect.objectContaining({ code: 'REVISION_CONFLICT' }))
    expect(() => session.commit({ ...codex, baseRevision: session.snapshot().revision, beforeHash: session.snapshot().hash })).toThrowError(/duplicate transaction id/)
    expect(session.snapshot().document.nodes[nodeId]?.name).toBe('Codex wins')
    expect(session.auditLog()).toHaveLength(1)
    expect(session.auditLog()[0]?.exactChanges).toContainEqual({ path: `/nodes/${nodeId}/name`, before: firstComponent(shared.document).name, after: 'Codex wins' })
  })

  it('does not publish or mutate an operation when audit persistence fails', () => {
    const session = new BridgeSession({
      projectRoot: root(),
      document: createDocumentFixture(1000),
      auditSink: () => { throw new Error('audit unavailable') },
    })
    const before = session.snapshot()
    expect(() => session.commit(input(session, 'tx-operation-audit-fail'))).toThrowError('audit unavailable')
    expect(session.snapshot()).toEqual(before)
    expect(session.replay(0)).toMatchObject({ mode: 'events', events: [], cursor: 0 })
    expect(session.auditLog()).toEqual([])
  })

  it('does not publish or mutate an operation when desktop recovery persistence fails', () => {
    const session = new BridgeSession({
      projectRoot: root(),
      document: createDocumentFixture(1000),
      persistenceSink: () => { throw new Error('snapshot disk full') },
    })
    const before = session.snapshot()
    expect(() => session.commit(input(session, 'tx-operation-recovery-fail'))).toThrowError('snapshot disk full')
    expect(session.snapshot()).toEqual(before)
    expect(session.auditLog()).toEqual([])
    expect(session.replay(0)).toMatchObject({ mode: 'events', events: [], cursor: 0 })
  })

  it('rejects every mutation in read-only recovery mode', () => {
    const session = new BridgeSession({ projectRoot: root(), document: createDocumentFixture(1000), readOnly: true })
    expect(() => session.commit(input(session, 'tx-read-only'))).toThrowError(expect.objectContaining({ status: 423 }))
    expect(session.snapshot()).toMatchObject({ revision: 0, cursor: 0 })
  })
})
