import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { TransactionEnvelope } from '@askewly/agent-design-engine'
import { deriveDocumentFromProject } from './marker-ingest.js'
import { REALISTIC_COMPONENTS, writeRealisticProject } from './realistic-fixture.js'
import { BridgeSession, sourceHash } from './session.js'

/**
 * RT Step 2 — proves the canvas-edit -> source-patch -> re-derive loop is
 * lossless on the realistic multi-file fixture, and that every byte outside
 * the edited marker attribute is preserved exactly.
 *
 * Ops -> source-patch contract (mapped by reading session.ts / sourceReconcile.ts):
 * there is no automatic generator that turns a CanvasOperation into a source
 * text patch anywhere in the repo (searched apps/agent-design-desktop and
 * packages/agent-design-engine). The only source-write path is
 * `BridgeSession.applySourcePatch`, which takes a full replacement file
 * `content` string authored by the caller (an agent) and reconciles it back
 * into the document via `reconcileDocumentFromSource`. That reconcile
 * function reads exactly three things out of the marked JSX element:
 *   - `data-agent-design-name` attribute -> node.name
 *   - `data-agent-design-label` attribute (else static text body) -> code-component props.label
 *   - static text body -> text-node .text (only for kind === 'text' nodes)
 * The realistic fixture's five components are all `code-component` nodes, so
 * only name and props.label are source-representable here; update-text has
 * no exercisable target in this fixture (no marked text-kind node exists),
 * and bounds/visible/locked/tokenBindings are never read back from source.
 * Each test below therefore applies the canonical operation via
 * `session.commit`, then hand-authors the mirroring source patch (as an
 * agent would) and applies it via `session.applySourcePatch`.
 */

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'agent-design-lossless-'))
  roots.push(root)
  writeRealisticProject(root)
  const document = deriveDocumentFromProject(root, { documentId: 'agent-design-lossless', documentName: 'Lossless fixture' })
  const session = new BridgeSession({ projectRoot: root, document, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
  return { root, document, session }
}

function readSource(root: string, relativeFile: string): string {
  return readFileSync(join(root, relativeFile), 'utf8')
}

function commitTransaction(session: BridgeSession, id: string, operations: TransactionEnvelope['operations']): void {
  const snapshot = session.snapshot()
  session.commit({ id, actor: 'human', baseRevision: snapshot.revision, beforeHash: snapshot.hash, operations })
}

function applySourceEdit(session: BridgeSession, root: string, file: string, before: string, after: string, transactionId: string): void {
  const snapshot = session.snapshot()
  session.applySourcePatch({
    transactionId,
    actor: 'human',
    baseRevision: snapshot.revision,
    beforeHash: snapshot.hash,
    file,
    beforeFileHash: sourceHash(before),
    content: after,
    at: '2026-07-12T01:00:00.000Z',
  })
}

describe('RT Step 2 — lossless canvas-edit source reflection', () => {
  it('reflects an update-node name edit into the marked source file and re-derives an identical name', () => {
    const { root, session } = setup()
    const heroSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'hero')!

    commitTransaction(session, 'tx-hero-name', [{ id: 'op-hero-name', at: '2026-07-12T00:30:00.000Z', type: 'update-node', nodeId: 'hero', patch: { name: 'Hero updated' } }])
    expect(session.snapshot().document.nodes['hero'].name).toBe('Hero updated')

    // Op-only commit never touches disk: a fresh cold-start read still sees the original name.
    const beforeSourceEdit = deriveDocumentFromProject(root, { documentId: 'agent-design-lossless', documentName: 'Lossless fixture' })
    expect(beforeSourceEdit.nodes['hero'].name).toBe(heroSpec.name)

    const before = readSource(root, heroSpec.file)
    const oldAttr = `data-agent-design-name="${heroSpec.name}"`
    const newAttr = 'data-agent-design-name="Hero updated"'
    expect(before.split(oldAttr)).toHaveLength(2) // attribute occurs exactly once
    const after = before.replace(oldAttr, newAttr)
    const expectedFile = before.split(oldAttr).join(newAttr)
    expect(after).toBe(expectedFile)

    applySourceEdit(session, root, heroSpec.file, before, after, 'tx-hero-name-source')

    expect(session.snapshot().document.nodes['hero'].name).toBe('Hero updated')
    expect(readSource(root, heroSpec.file)).toBe(expectedFile)

    // Byte preservation: everything outside the attribute is untouched.
    expect(readSource(root, heroSpec.file)).toContain("import { Badge } from './Badge'")
    expect(readSource(root, heroSpec.file)).toContain('// Marketing hero banner. The marked <section> below is the canvas node;')
    expect(readSource(root, heroSpec.file)).toContain('<Badge>New</Badge>')
    expect(readSource(root, heroSpec.file)).toContain(`data-agent-design-label="${heroSpec.label}"`)

    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-lossless', documentName: 'Lossless fixture' })
    expect(rederived.nodes['hero'].name).toBe('Hero updated')
    expect(rederived.nodes['hero'].kind === 'code-component' && rederived.nodes['hero'].props.label).toBe(heroSpec.label)
  })

  it('reflects a set-node-property prop.label edit into the marked source file and re-derives an identical label', () => {
    const { root, session } = setup()
    const cardGridSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'card-grid')!

    commitTransaction(session, 'tx-card-grid-label', [
      { id: 'op-card-grid-label', at: '2026-07-12T00:31:00.000Z', type: 'set-node-property', nodeId: 'card-grid', scope: 'prop', key: 'label', value: 'Everything you need, faster' },
    ])
    const afterCommitNode = session.snapshot().document.nodes['card-grid']
    expect(afterCommitNode.kind === 'code-component' && afterCommitNode.props.label).toBe('Everything you need, faster')

    const before = readSource(root, cardGridSpec.file)
    const oldAttr = `data-agent-design-label="${cardGridSpec.label}"`
    const newAttr = 'data-agent-design-label="Everything you need, faster"'
    expect(before.split(oldAttr)).toHaveLength(2)
    const expectedFile = before.split(oldAttr).join(newAttr)

    applySourceEdit(session, root, cardGridSpec.file, before, expectedFile, 'tx-card-grid-label-source')

    const afterDoc = session.snapshot().document.nodes['card-grid']
    expect(afterDoc.kind === 'code-component' && afterDoc.props.label).toBe('Everything you need, faster')
    expect(readSource(root, cardGridSpec.file)).toBe(expectedFile)

    // Byte preservation: import, comment, formatDate() call site, unmarked JSX untouched.
    expect(readSource(root, cardGridSpec.file)).toContain("import { formatDate } from '../lib/formatDate'")
    expect(readSource(root, cardGridSpec.file)).toContain('const today = formatDate(new Date(2026, 6, 12))')
    expect(readSource(root, cardGridSpec.file)).toContain('<article>Card one</article>')
    expect(readSource(root, cardGridSpec.file)).toContain('<article>Card two</article>')
    expect(readSource(root, cardGridSpec.file)).toContain(`data-agent-design-name="${cardGridSpec.name}"`)

    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-lossless', documentName: 'Lossless fixture' })
    const rederivedNode = rederived.nodes['card-grid']
    expect(rederivedNode.kind === 'code-component' && rederivedNode.props.label).toBe('Everything you need, faster')
    expect(rederivedNode.name).toBe(cardGridSpec.name)
  })

  it('rejects a source patch with a stale beforeFileHash and leaves the file byte-identical', () => {
    const { root, session } = setup()
    const footerSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'footer')!
    const before = readSource(root, footerSpec.file)
    const after = before.replace('All rights reserved', 'All rights reserved, forever')
    const snapshot = session.snapshot()

    expect(() =>
      session.applySourcePatch({
        transactionId: 'tx-footer-stale',
        actor: 'human',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        file: footerSpec.file,
        beforeFileHash: sourceHash('stale-content-that-does-not-match-disk'),
        content: after,
        at: '2026-07-12T00:40:00.000Z',
      }),
    ).toThrowError(expect.objectContaining({ code: 'HASH_CONFLICT' }))

    expect(readSource(root, footerSpec.file)).toBe(before)
    expect(session.snapshot().revision).toBe(snapshot.revision)
    expect(session.auditLog()).toHaveLength(0)
  })

  it('rejects a source patch targeting a file the canvas document has not registered', () => {
    const { root, session } = setup()
    const unmarkedFile = 'src/components/Badge.tsx'
    const before = readSource(root, unmarkedFile)
    const after = before.replace('badge', 'badge-updated')
    const snapshot = session.snapshot()

    expect(() =>
      session.applySourcePatch({
        transactionId: 'tx-badge-unmarked',
        actor: 'human',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        file: unmarkedFile,
        beforeFileHash: sourceHash(before),
        content: after,
        at: '2026-07-12T00:41:00.000Z',
      }),
    ).toThrowError(expect.objectContaining({ code: 'PROJECT_SCOPE_VIOLATION' }))

    expect(readSource(root, unmarkedFile)).toBe(before)
    expect(session.snapshot().revision).toBe(snapshot.revision)
    expect(session.auditLog()).toHaveLength(0)
  })

  it('edits Hero.tsx in isolation, leaving the other four marked component files completely byte-unchanged', () => {
    const { root, session } = setup()
    const heroSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'hero')!
    const others = REALISTIC_COMPONENTS.filter((spec) => spec.id !== 'hero')
    const untouchedBefore = new Map(others.map((spec) => [spec.file, readSource(root, spec.file)]))

    commitTransaction(session, 'tx-hero-only-name', [{ id: 'op-hero-only-name', at: '2026-07-12T00:32:00.000Z', type: 'update-node', nodeId: 'hero', patch: { name: 'Hero isolated edit' } }])
    const before = readSource(root, heroSpec.file)
    const after = before.replace(`data-agent-design-name="${heroSpec.name}"`, 'data-agent-design-name="Hero isolated edit"')
    applySourceEdit(session, root, heroSpec.file, before, after, 'tx-hero-only-name-source')

    expect(session.snapshot().document.nodes['hero'].name).toBe('Hero isolated edit')
    for (const spec of others) {
      expect(readSource(root, spec.file)).toBe(untouchedBefore.get(spec.file))
    }
  })

  it('keeps every node in sync with a fresh re-derive of the mutated project after two chained edits across two files', () => {
    const { root, session } = setup()
    const heroSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'hero')!
    const navSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'navbar')!

    commitTransaction(session, 'tx-hero-chain', [{ id: 'op-hero-chain', at: '2026-07-12T00:33:00.000Z', type: 'update-node', nodeId: 'hero', patch: { name: 'Hero chained' } }])
    const heroBefore = readSource(root, heroSpec.file)
    const heroAfter = heroBefore.replace(`data-agent-design-name="${heroSpec.name}"`, 'data-agent-design-name="Hero chained"')
    applySourceEdit(session, root, heroSpec.file, heroBefore, heroAfter, 'tx-hero-chain-source')

    commitTransaction(session, 'tx-nav-chain', [
      { id: 'op-nav-chain', at: '2026-07-12T00:34:00.000Z', type: 'set-node-property', nodeId: 'navbar', scope: 'prop', key: 'label', value: 'Askewly Inc' },
    ])
    const navBefore = readSource(root, navSpec.file)
    const navAfter = navBefore.replace(`data-agent-design-label="${navSpec.label}"`, 'data-agent-design-label="Askewly Inc"')
    applySourceEdit(session, root, navSpec.file, navBefore, navAfter, 'tx-nav-chain-source')

    // documentHash intentionally differs (revision/metadata.updatedAt diverge between an
    // incrementally-mutated session document and a freshly cold-started re-derive) - the
    // lossless contract is that every source-representable field on every node matches.
    const rederived = deriveDocumentFromProject(root, { documentId: 'agent-design-lossless', documentName: 'Lossless fixture' })
    const sessionDoc = session.snapshot().document
    expect(rederived.nodes['hero'].name).toBe('Hero chained')
    expect(sessionDoc.nodes['hero'].name).toBe('Hero chained')
    const rederivedNav = rederived.nodes['navbar']
    const sessionNav = sessionDoc.nodes['navbar']
    expect(rederivedNav.kind === 'code-component' && rederivedNav.props.label).toBe('Askewly Inc')
    expect(sessionNav.kind === 'code-component' && sessionNav.props.label).toBe('Askewly Inc')
    for (const spec of REALISTIC_COMPONENTS) {
      const rederivedNode = rederived.nodes[spec.id]
      const sessionNode = sessionDoc.nodes[spec.id]
      expect(rederivedNode.name).toBe(sessionNode.name)
      expect(rederivedNode.kind === 'code-component' && sessionNode.kind === 'code-component' ? rederivedNode.props.label : null).toBe(
        sessionNode.kind === 'code-component' ? sessionNode.props.label : null,
      )
    }
  })
})
