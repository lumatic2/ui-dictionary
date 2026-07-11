import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { reconcileDocumentFromSource } from '@askewly/agent-design-engine'
import { deriveDocumentFromProject } from './marker-ingest.js'
import { REALISTIC_COMPONENTS, writeRealisticProject } from './realistic-fixture.js'
import { BridgeSession, sourceHash } from './session.js'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'agent-design-realistic-'))
  roots.push(root)
  writeRealisticProject(root)
  return root
}

describe('realistic multi-file project ingestion audit', () => {
  it('derives a canonical node for every marked component with correct name/source mapping', () => {
    const root = setup()
    const document = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture' })

    expect(Object.keys(document.nodes)).toHaveLength(REALISTIC_COMPONENTS.length + 1) // +1 for the synthetic root frame

    for (const spec of REALISTIC_COMPONENTS) {
      const node = document.nodes[spec.id]
      expect(node, `expected node for marker id "${spec.id}"`).toBeDefined()
      expect(node.kind).toBe('code-component')
      expect(node.name).toBe(spec.name)
      if (node.kind === 'code-component') {
        expect(node.source.file).toBe(spec.file)
        expect(node.source.exportName).toBe(spec.exportName)
        expect(node.source.startLine).toBeGreaterThanOrEqual(1)
        expect(node.source.endLine).toBeGreaterThanOrEqual(node.source.startLine)
        expect(node.props.label).toBe(spec.label)
      }
    }
  })

  it('does not produce nodes for unmarked files or unmarked JSX', () => {
    const root = setup()
    const document = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture' })
    const markedIds = new Set(REALISTIC_COMPONENTS.map((spec) => spec.id))
    for (const node of Object.values(document.nodes)) {
      if (node.id === 'ingested-root') continue
      expect(markedIds.has(node.id)).toBe(true)
    }
    // Badge.tsx (unmarked JSX) and formatDate.ts / App.tsx (no markers) must not appear as source files.
    const sourceFiles = Object.values(document.nodes)
      .map((node) => (node.kind === 'code-component' ? node.source.file : null))
      .filter((file): file is string => Boolean(file))
    expect(sourceFiles).not.toContain('src/components/Badge.tsx')
    expect(sourceFiles).not.toContain('src/lib/formatDate.ts')
    expect(sourceFiles).not.toContain('src/App.tsx')
  })

  it('is deterministic across two independent runs', () => {
    const root = setup()
    const first = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture', at: '2026-07-12T00:00:00.000Z' })
    const second = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture', at: '2026-07-12T00:00:00.000Z' })
    expect(second).toEqual(first)
  })

  it('leaves unmarked source bytes untouched by the scan itself', () => {
    const root = setup()
    const before = readFileSync(join(root, 'src/lib/formatDate.ts'), 'utf8')
    const beforeApp = readFileSync(join(root, 'src/App.tsx'), 'utf8')
    deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture' })
    expect(readFileSync(join(root, 'src/lib/formatDate.ts'), 'utf8')).toBe(before)
    expect(readFileSync(join(root, 'src/App.tsx'), 'utf8')).toBe(beforeApp)
  })

  it('boots a BridgeSession from the derived multi-file document and tracks every marked source file', () => {
    const root = setup()
    const document = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture' })
    const session = new BridgeSession({ projectRoot: root, document, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
    const tracked = session.sourceFiles().map((entry) => entry.file).sort()
    expect(tracked).toEqual(REALISTIC_COMPONENTS.map((spec) => spec.file).sort())
  })

  it('reconciles a single-file edit against the derived document without disturbing other nodes (existing multi-file reconcile path)', () => {
    const root = setup()
    const document = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture' })
    const heroSpec = REALISTIC_COMPONENTS.find((spec) => spec.id === 'hero')!
    const heroFile = join(root, heroSpec.file)
    const before = readFileSync(heroFile, 'utf8')
    const after = before.replace('Build faster, ship calmer', 'Ship even faster')
    const session = new BridgeSession({ projectRoot: root, document, verifySource: () => ({ valid: true, checks: ['tsx-fixture'] }) })
    const snapshot = session.snapshot()

    session.applySourcePatch({
      transactionId: 'tx-hero-edit',
      actor: 'human',
      baseRevision: snapshot.revision,
      beforeHash: snapshot.hash,
      file: heroSpec.file,
      beforeFileHash: sourceHash(before),
      content: after,
      at: '2026-07-12T00:10:00.000Z',
    })

    const next = session.snapshot().document
    const heroNode = next.nodes['hero']
    expect(heroNode.kind === 'code-component' ? heroNode.props.label : null).toBe('Ship even faster')
    // Every other marked component keeps its original label and file.
    for (const spec of REALISTIC_COMPONENTS) {
      if (spec.id === 'hero') continue
      const node = next.nodes[spec.id]
      expect(node.kind === 'code-component' ? node.props.label : null).toBe(spec.label)
      expect(node.kind === 'code-component' ? node.source.file : null).toBe(spec.file)
    }
    expect(readFileSync(join(root, REALISTIC_COMPONENTS.find((spec) => spec.id === 'footer')!.file), 'utf8')).toContain('All rights reserved')
  })

  it('sanity check: reconcileDocumentFromSource (the engine-owned reconcile primitive) only updates nodes the document already knows, confirming it cannot perform discovery', () => {
    const root = setup()
    const document = deriveDocumentFromProject(root, { documentId: 'agent-design-realistic', documentName: 'Realistic fixture' })
    const cardGridFile = join(root, 'src/components/CardGrid.tsx')
    const content = readFileSync(cardGridFile, 'utf8')
    const reconciled = reconcileDocumentFromSource(document, 'src/components/CardGrid.tsx', content, '2026-07-12T00:20:00.000Z')
    // Same node count: reconciliation never adds or removes nodes, only updates fields on matches.
    expect(Object.keys(reconciled.nodes)).toEqual(Object.keys(document.nodes))
  })
})
