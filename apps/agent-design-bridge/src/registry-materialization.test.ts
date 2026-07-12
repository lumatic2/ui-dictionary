import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { applyOperation, planInsert, planInsertBounds, type CanvasDocument } from '@askewly/canvas-core'
import { catalog, createRegistryNode, planMaterializeRegistryNode, searchRegistry } from '@askewly/component-registry'
import type { TransactionEnvelope } from '@askewly/agent-design-engine'
import { deriveDocumentFromProject } from './marker-ingest.js'
import { REALISTIC_COMPONENTS, writeRealisticProject } from './realistic-fixture.js'
import { BridgeSession, NEW_FILE_HASH, sourceHash } from './session.js'

/**
 * RT Step 3 — registry component materialization.
 *
 * Seam mapped by reading session.ts: `applySourcePatch` only ever accepted
 * patches to files already in `allowedSourceFiles` (built once, at session
 * construction, from the document's existing node.source.file values) *and*
 * required the target file to already exist on disk (`sourceFile()` throws
 * `INVALID_TRANSACTION` otherwise). There was no channel to create a file
 * the document does not yet reference. That genuinely blocks materializing a
 * registry:// node into a brand-new src/components/<Export>.tsx file, so
 * this is exactly the "session API gap" the task allowed a minimal bridge
 * change for: `session.ts` now accepts `beforeFileHash: NEW_FILE_HASH` as an
 * explicit "this file does not exist yet" sentinel, confined to the same
 * `resolveProjectPath` project-root boundary as every other write.
 *
 * Identity contract (see materialize.ts docstring): the generated file's
 * data-agent-design-id is the canvas node's own id, so a cold re-derive
 * resolves the SAME node id to the real file - no duplicate identity, and no
 * canonical operation is needed to rewrite `source` on the live document
 * (canvas-core has none). `planMaterializeRegistryNode` therefore returns an
 * empty `operations` array by design.
 */

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'agent-design-registry-materialize-'))
  roots.push(root)
  writeRealisticProject(root)
  const document = deriveDocumentFromProject(root, { documentId: 'agent-design-materialize', documentName: 'Materialize fixture' })
  const session = new BridgeSession({ projectRoot: root, document, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
  return { root, document, session }
}

function commitTransaction(session: BridgeSession, id: string, operations: TransactionEnvelope['operations']): void {
  const snapshot = session.snapshot()
  session.commit({ id, actor: 'claude', baseRevision: snapshot.revision, beforeHash: snapshot.hash, operations })
}

function insertRegistryButton(session: BridgeSession, txId: string, at: string): string {
  const snapshot = session.snapshot()
  const [button] = searchRegistry(catalog, 'button')
  const bounds = planInsertBounds(snapshot.document, null, button.defaultSize)
  const node = createRegistryNode(snapshot.document, button, null, bounds)
  const batch = planInsert(snapshot.document, node, at)
  commitTransaction(session, txId, [batch])
  return node.id
}

function materializeAndPatch(session: BridgeSession, document: CanvasDocument, nodeId: string, txId: string, at: string, existingFiles?: string[]) {
  const plan = planMaterializeRegistryNode(document, nodeId, existingFiles ? { existingFiles } : undefined)
  const snapshot = session.snapshot()
  expect(plan.operations).toEqual([])
  session.applySourcePatch({
    transactionId: txId,
    actor: 'claude',
    baseRevision: snapshot.revision,
    beforeHash: snapshot.hash,
    file: plan.filePath,
    beforeFileHash: NEW_FILE_HASH,
    content: plan.content,
    at,
  })
  return plan
}

describe('RT Step 3 — registry component materialization', () => {
  it('materializes a registry Button into a new file and a cold re-derive discovers the same node id', () => {
    const { root, session } = setup()

    const before = new Map(REALISTIC_COMPONENTS.map((spec) => [spec.file, readFileSync(join(root, spec.file), 'utf8')]))

    const nodeId = insertRegistryButton(session, 'tx-insert-button', '2026-07-12T04:00:00.000Z')
    const inserted = session.snapshot().document.nodes[nodeId]
    expect(inserted.kind === 'code-component' ? inserted.source.file : null).toBe('registry://shadcn/button')

    const plan = materializeAndPatch(session, session.snapshot().document, nodeId, 'tx-materialize-button', '2026-07-12T04:01:00.000Z')
    expect(plan.filePath).toBe('src/components/Button.tsx')

    // Existing marked files are byte-unchanged.
    for (const spec of REALISTIC_COMPONENTS) {
      expect(readFileSync(join(root, spec.file), 'utf8')).toBe(before.get(spec.file))
    }

    // The new file exists on disk with exactly the planned content.
    expect(readFileSync(join(root, plan.filePath), 'utf8')).toBe(plan.content)

    // The live session document still points at the registry source (no operation rewrote it).
    const liveNode = session.snapshot().document.nodes[nodeId]
    expect(liveNode.kind === 'code-component' ? liveNode.source.file : null).toBe('registry://shadcn/button')

    // A fresh cold-start re-derive discovers the SAME node id, now source-backed by the real file.
    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-materialize', documentName: 'Materialize fixture' })
    const rederivedNode = rederived.nodes[nodeId]
    expect(rederivedNode).toBeDefined()
    expect(rederivedNode.kind).toBe('code-component')
    expect(rederivedNode.kind === 'code-component' ? rederivedNode.source.file : null).toBe(plan.filePath)
    expect(rederivedNode.name).toBe('Button')
    expect(rederivedNode.kind === 'code-component' ? rederivedNode.props.label : null).toBe('Button')

    // No duplicate node identity: exactly one node carries this id, and the total
    // node count is exactly the five fixture components plus the materialized root
    // plus one materialized Button - no extra "registry" node was left behind.
    expect(Object.values(rederived.nodes).filter((n) => n.id === nodeId)).toHaveLength(1)
    expect(Object.keys(rederived.nodes)).toHaveLength(REALISTIC_COMPONENTS.length + 2)
  })

  it('generates deterministic, marker-carrying content across two independent runs', () => {
    const { session } = setup()
    const nodeId = insertRegistryButton(session, 'tx-insert-button-det', '2026-07-12T04:02:00.000Z')
    const document = session.snapshot().document

    const first = planMaterializeRegistryNode(document, nodeId)
    const second = planMaterializeRegistryNode(document, nodeId)
    expect(first).toEqual(second)
    expect(first.content).toContain(`data-agent-design-id="${nodeId}"`)
    expect(first.content).toContain('data-agent-design-name="Button"')
    expect(first.content).toContain('data-agent-design-label="Button"')
  })

  it('rejects materializing to a path that already exists', () => {
    const { root, session } = setup()
    insertRegistryButton(session, 'tx-insert-button-collide', '2026-07-12T04:03:00.000Z')
    const snapshot = session.snapshot()

    expect(() =>
      session.applySourcePatch({
        transactionId: 'tx-bad-existing-target',
        actor: 'claude',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        file: REALISTIC_COMPONENTS[0].file,
        beforeFileHash: NEW_FILE_HASH,
        content: '// should not be allowed to clobber an existing file\n',
        at: '2026-07-12T04:04:00.000Z',
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_TRANSACTION' }))

    expect(readFileSync(join(root, REALISTIC_COMPONENTS[0].file), 'utf8')).not.toContain('should not be allowed')
  })

  it('rejects a new-file patch that escapes the project root', () => {
    const { session } = setup()
    const snapshot = session.snapshot()
    expect(() =>
      session.applySourcePatch({
        transactionId: 'tx-escape',
        actor: 'claude',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        file: '../outside.tsx',
        beforeFileHash: NEW_FILE_HASH,
        content: 'export function Outside() { return null }\n',
        at: '2026-07-12T04:05:00.000Z',
      }),
    ).toThrowError(expect.objectContaining({ code: 'PROJECT_SCOPE_VIOLATION' }))
  })

  it('deterministically suffixes the export/file name when two registry components collide', () => {
    const { root, session } = setup()

    const firstId = insertRegistryButton(session, 'tx-insert-button-1', '2026-07-12T04:06:00.000Z')
    const firstPlan = materializeAndPatch(session, session.snapshot().document, firstId, 'tx-materialize-button-1', '2026-07-12T04:07:00.000Z')
    expect(firstPlan.filePath).toBe('src/components/Button.tsx')

    const secondId = insertRegistryButton(session, 'tx-insert-button-2', '2026-07-12T04:08:00.000Z')
    const secondPlan = materializeAndPatch(session, session.snapshot().document, secondId, 'tx-materialize-button-2', '2026-07-12T04:09:00.000Z', [
      firstPlan.filePath,
    ])
    expect(secondPlan.filePath).toBe('src/components/Button2.tsx')
    expect(secondPlan.content).toContain('export function Button2()')
    expect(secondPlan.content).toContain(`data-agent-design-id="${secondId}"`)

    expect(readFileSync(join(root, firstPlan.filePath), 'utf8')).toBe(firstPlan.content)
    expect(readFileSync(join(root, secondPlan.filePath), 'utf8')).toBe(secondPlan.content)

    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-materialize', documentName: 'Materialize fixture' })
    expect(rederived.nodes[firstId].kind === 'code-component' ? rederived.nodes[firstId].source.file : null).toBe('src/components/Button.tsx')
    expect(rederived.nodes[secondId].kind === 'code-component' ? rederived.nodes[secondId].source.file : null).toBe('src/components/Button2.tsx')
    expect(firstId).not.toBe(secondId)
  })

  it('undoing a materialization DELETES the created file rather than leaving an empty ghost file', () => {
    const { root, session } = setup()

    const nodeId = insertRegistryButton(session, 'tx-insert-button-undo', '2026-07-12T04:10:00.000Z')
    const plan = materializeAndPatch(session, session.snapshot().document, nodeId, 'tx-materialize-button-undo', '2026-07-12T04:11:00.000Z')
    const filePath = join(root, plan.filePath)
    expect(existsSync(filePath)).toBe(true)

    const snapshot = session.snapshot()
    const event = session.undo({ id: 'tx-undo-materialize', actor: 'claude', baseRevision: snapshot.revision, beforeHash: snapshot.hash, at: '2026-07-12T04:12:00.000Z' })

    // The file must be gone entirely, not truncated to an empty ghost file.
    expect(existsSync(filePath)).toBe(false)

    // The audit/event faithfully represent a deletion: the resulting file
    // hash is the same "does not exist" sentinel used to request creation.
    expect(event.sourcePatch).toMatchObject({ file: plan.filePath, afterFileHash: NEW_FILE_HASH })
    const audit = session.auditLog().at(-1)
    expect(audit?.kind).toBe('undo')
    expect(audit?.sourceFile).toBe(plan.filePath)
    expect(audit?.sourceDiff).toContain(`--- a/${plan.filePath}`)
    for (const line of plan.content.split('\n')) {
      if (line.length > 0) expect(audit?.sourceDiff).toContain(`-${line}`)
    }
    expect(audit?.sourceDiff).not.toContain('+export')

    // A cold re-derive no longer discovers a source-backed node at this path.
    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-materialize', documentName: 'Materialize fixture' })
    expect(Object.keys(rederived.nodes)).toHaveLength(REALISTIC_COMPONENTS.length + 1)
  })

  it('refuses to undo a materialization when the created file was modified afterward (hash guard)', () => {
    const { root, session } = setup()

    const nodeId = insertRegistryButton(session, 'tx-insert-button-guard', '2026-07-12T04:13:00.000Z')
    const plan = materializeAndPatch(session, session.snapshot().document, nodeId, 'tx-materialize-button-guard', '2026-07-12T04:14:00.000Z')
    const filePath = join(root, plan.filePath)

    writeFileSync(filePath, `${plan.content}\n// modified after materialization\n`)

    const snapshot = session.snapshot()
    expect(() =>
      session.undo({ id: 'tx-undo-guard', actor: 'claude', baseRevision: snapshot.revision, beforeHash: snapshot.hash, at: '2026-07-12T04:15:00.000Z' }),
    ).toThrowError(expect.objectContaining({ code: 'HASH_CONFLICT' }))

    // The guard must refuse cleanly: the modified file survives untouched.
    expect(existsSync(filePath)).toBe(true)
    expect(readFileSync(filePath, 'utf8')).toContain('// modified after materialization')
  })

  it('fails cleanly (not a crash) when the same undo transaction id is replayed after a materialization delete', () => {
    const { root, session } = setup()

    const nodeId = insertRegistryButton(session, 'tx-insert-button-replay', '2026-07-12T04:16:00.000Z')
    const plan = materializeAndPatch(session, session.snapshot().document, nodeId, 'tx-materialize-button-replay', '2026-07-12T04:17:00.000Z')
    const filePath = join(root, plan.filePath)

    const snapshot = session.snapshot()
    session.undo({ id: 'tx-undo-replay', actor: 'claude', baseRevision: snapshot.revision, beforeHash: snapshot.hash, at: '2026-07-12T04:18:00.000Z' })
    expect(existsSync(filePath)).toBe(false)

    // Replaying the same (now-stale) undo request must fail cleanly with the
    // existing revision-conflict protocol error, not throw an fs error or
    // crash trying to delete/read the already-deleted file again.
    expect(() =>
      session.undo({ id: 'tx-undo-replay', actor: 'claude', baseRevision: snapshot.revision, beforeHash: snapshot.hash, at: '2026-07-12T04:19:00.000Z' }),
    ).toThrowError(expect.objectContaining({ code: 'REVISION_CONFLICT' }))
    expect(existsSync(filePath)).toBe(false)

    // A duplicate undo id at the CURRENT (up-to-date) revision — e.g. the
    // client retrying the exact request it just successfully sent — must
    // also fail cleanly, via the duplicate-transaction guard, instead of
    // attempting to delete/read the already-deleted file again.
    const current = session.snapshot()
    expect(() =>
      session.undo({ id: 'tx-undo-replay', actor: 'claude', baseRevision: current.revision, beforeHash: current.hash, at: '2026-07-12T04:20:00.000Z' }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_TRANSACTION' }))
    expect(existsSync(filePath)).toBe(false)
  })
})
