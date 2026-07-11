import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { planInsert, planInsertBounds } from '@askewly/canvas-core'
import { catalog, createRegistryNode, planMaterializeRegistryNode, searchRegistry } from '@askewly/component-registry'
import { BridgeProtocolError } from '@askewly/agent-design-engine'
import { deriveDocumentFromProject } from './marker-ingest.js'
import { writeRealisticProject } from './realistic-fixture.js'
import { BridgeSession, NEW_FILE_HASH, sourceHash } from './session.js'

/**
 * RT Step 4 — reopen continuity and concurrent-agent E2E.
 * One flow on the realistic multi-file fixture: agent source edit, human
 * conflict + recovery, registry insert + materialization, cold re-derive
 * identity continuity, and a second session (reopen) editing the
 * materialized file.
 */

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('real-project round-trip continuity', () => {
  it('survives concurrent edits, materialization, and reopen with stable identities', () => {
    const root = mkdtempSync(join(tmpdir(), 'agent-design-continuity-'))
    roots.push(root)
    writeRealisticProject(root)
    const document = deriveDocumentFromProject(root, { documentId: 'agent-design-continuity', documentName: 'Continuity fixture' })
    const session = new BridgeSession({ projectRoot: root, document, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
    const heroPath = join(root, 'src', 'components', 'Hero.tsx')

    // Agent (codex) edits Hero's name through the source-patch channel.
    const heroBefore = readFileSync(heroPath, 'utf8')
    const codexContent = heroBefore.replace('data-agent-design-name="Hero"', 'data-agent-design-name="Hero Prime"')
    expect(codexContent).not.toBe(heroBefore)
    const snapshotA = session.snapshot()
    session.applySourcePatch({
      transactionId: 'tx-codex-rename', actor: 'codex',
      baseRevision: snapshotA.revision, beforeHash: snapshotA.hash,
      file: 'src/components/Hero.tsx', beforeFileHash: sourceHash(heroBefore),
      content: codexContent, at: '2026-07-12T04:20:00.000Z',
    })
    expect(session.snapshot().document.nodes['hero']).toMatchObject({ name: 'Hero Prime' })

    // Human (claude) concurrently authored a patch against the STALE file — rejected without mutation.
    const staleContent = heroBefore.replace('data-agent-design-label="Build faster, ship calmer"', 'data-agent-design-label="Bold headline"')
    const snapshotB = session.snapshot()
    expect(() => session.applySourcePatch({
      transactionId: 'tx-claude-stale', actor: 'claude',
      baseRevision: snapshotB.revision, beforeHash: snapshotB.hash,
      file: 'src/components/Hero.tsx', beforeFileHash: sourceHash(heroBefore),
      content: staleContent, at: '2026-07-12T04:21:00.000Z',
    })).toThrowError(BridgeProtocolError)
    expect(readFileSync(heroPath, 'utf8')).toBe(codexContent)

    // Human retries from fresh state — succeeds.
    const heroCurrent = readFileSync(heroPath, 'utf8')
    const claudeContent = heroCurrent.replace('data-agent-design-label="Build faster, ship calmer"', 'data-agent-design-label="Bold headline"')
    const snapshotC = session.snapshot()
    session.applySourcePatch({
      transactionId: 'tx-claude-retry', actor: 'claude',
      baseRevision: snapshotC.revision, beforeHash: snapshotC.hash,
      file: 'src/components/Hero.tsx', beforeFileHash: sourceHash(heroCurrent),
      content: claudeContent, at: '2026-07-12T04:22:00.000Z',
    })

    // Registry insert + materialization to a brand-new real file.
    const snapshotD = session.snapshot()
    const [button] = searchRegistry(catalog, 'button')
    const buttonNode = createRegistryNode(snapshotD.document, button, null, planInsertBounds(snapshotD.document, null, button.defaultSize))
    session.commit({ id: 'tx-insert-button', actor: 'claude', baseRevision: snapshotD.revision, beforeHash: snapshotD.hash, operations: [planInsert(snapshotD.document, buttonNode, '2026-07-12T04:23:00.000Z')] })
    const plan = planMaterializeRegistryNode(session.snapshot().document, buttonNode.id)
    const snapshotE = session.snapshot()
    session.applySourcePatch({
      transactionId: 'tx-materialize', actor: 'claude',
      baseRevision: snapshotE.revision, beforeHash: snapshotE.hash,
      file: plan.filePath, beforeFileHash: NEW_FILE_HASH,
      content: plan.content, at: '2026-07-12T04:24:00.000Z',
    })

    // Cold re-derive: same identities, both actors' edits present, materialized node on a real file.
    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-continuity', documentName: 'Continuity fixture' })
    expect(rederived.nodes['hero']).toMatchObject({ name: 'Hero Prime' })
    const heroNode = rederived.nodes['hero']
    expect(heroNode.kind === 'code-component' ? heroNode.props.label : null).toBe('Bold headline')
    const materialized = rederived.nodes[buttonNode.id]
    expect(materialized).toMatchObject({ kind: 'code-component', name: 'Button' })
    expect(materialized.kind === 'code-component' ? materialized.source.file : null).toBe(plan.filePath)
    expect(['navbar', 'card-grid', 'contact-form', 'footer'].every((id) => rederived.nodes[id])).toBe(true)

    // Reopen: a fresh session from the re-derived document tracks the materialized file and can edit it.
    const reopened = new BridgeSession({ projectRoot: root, document: rederived, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
    expect(reopened.sourceFiles().map((entry) => typeof entry === 'string' ? entry : entry.file)).toContain(plan.filePath)
    const materializedContent = readFileSync(join(root, plan.filePath), 'utf8')
    const editedContent = materializedContent.replace('data-agent-design-label="Button"', 'data-agent-design-label="Get started"')
    expect(editedContent).not.toBe(materializedContent)
    const snapshotF = reopened.snapshot()
    reopened.applySourcePatch({
      transactionId: 'tx-reopen-edit', actor: 'codex',
      baseRevision: snapshotF.revision, beforeHash: snapshotF.hash,
      file: plan.filePath, beforeFileHash: sourceHash(materializedContent),
      content: editedContent, at: '2026-07-12T04:25:00.000Z',
    })
    const finalNode = reopened.snapshot().document.nodes[buttonNode.id]
    expect(finalNode.kind === 'code-component' ? finalNode.props.label : null).toBe('Get started')
    const finalDerive = deriveDocumentFromProject(root, { documentId: 'agent-design-continuity', documentName: 'Continuity fixture' })
    const finalDerived = finalDerive.nodes[buttonNode.id]
    expect(finalDerived.kind === 'code-component' ? finalDerived.props.label : null).toBe('Get started')
  })
})
