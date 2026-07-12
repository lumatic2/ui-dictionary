import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { planInsert, planInsertBounds } from '@askewly/canvas-core'
import { createRegistryNode, planMaterializeRegistryNode, recipeCatalog } from '@askewly/component-registry'
import { deriveDocumentFromProject } from './marker-ingest.js'
import { writeRealisticProject } from './realistic-fixture.js'
import { BridgeSession, NEW_FILE_HASH } from './session.js'

/**
 * QA3 Step 3 - recipe materialization roundtrip at the bridge session level.
 *
 * Mirrors registry-materialization.test.ts but for a recipe node: the plan
 * emits the recipe's real embedded standalone source (not the generic
 * skeleton), the session accepts it through the NEW_FILE_HASH channel, and a
 * cold re-derive of the project resolves the very same node id to the new
 * file (identity contract). The transaction id deliberately contains colons:
 * Windows forbids ':' in file names, and the session's staging-path
 * sanitization (session.ts) must keep the patch applicable regardless of the
 * caller's id format - this was a real packaged-E2E failure before the fix.
 */

const roots: string[] = []
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }) })

describe('QA3 - recipe materialization roundtrip', () => {
  it('materializes an inserted recipe node and a cold re-derive resolves the same id', () => {
    const root = mkdtempSync(join(tmpdir(), 'recipe-materialize-'))
    roots.push(root)
    writeRealisticProject(root)
    const document = deriveDocumentFromProject(root, { documentId: 'recipe-roundtrip', documentName: 'Recipe roundtrip fixture' })
    const session = new BridgeSession({ projectRoot: root, document })

    const entry = recipeCatalog.find((candidate) => candidate.slug === 'bottom-tab-bar')
    expect(entry).toBeTruthy()
    let snapshot = session.snapshot()
    const bounds = planInsertBounds(snapshot.document, null, entry!.defaultSize)
    const node = createRegistryNode(snapshot.document, entry!, null, bounds)
    session.commit({ id: 'tx-insert-recipe', actor: 'human', baseRevision: snapshot.revision, beforeHash: snapshot.hash, operations: [planInsert(snapshot.document, node, '2026-07-12T10:00:00.000Z')] })

    snapshot = session.snapshot()
    const plan = planMaterializeRegistryNode(snapshot.document, node.id)
    const event = session.applySourcePatch({
      transactionId: 'human:materialize:windows-unsafe',
      actor: 'human',
      baseRevision: snapshot.revision,
      beforeHash: snapshot.hash,
      file: plan.filePath,
      beforeFileHash: NEW_FILE_HASH,
      content: plan.content,
      at: '2026-07-12T10:00:01.000Z',
    })
    expect(event.type).toBe('transaction-committed')

    const written = join(root, plan.filePath)
    expect(existsSync(written)).toBe(true)
    const content = readFileSync(written, 'utf8')
    expect(content).toContain(`data-agent-design-id="${node.id}"`)
    expect(content).not.toContain('__AD_')
    expect(content).toContain('BottomTabBar')

    const rederived = deriveDocumentFromProject(root, { documentId: 'recipe-roundtrip', documentName: 'Recipe roundtrip fixture' })
    const rederivedNode = rederived.nodes[node.id]
    expect(rederivedNode).toBeTruthy()
    expect(rederivedNode.source?.file).toBe(plan.filePath)
    expect(Object.values(rederived.nodes).filter((candidate) => candidate.id === node.id)).toHaveLength(1)
  })
})
