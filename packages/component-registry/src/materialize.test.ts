import { describe, expect, it } from 'vitest'
import { applyOperation, createDocumentFixture, planInsert, planInsertBounds } from '@askewly/canvas-core'
import { catalog } from './catalog.js'
import { createRegistryNode } from './registry.js'
import { planMaterializeRegistryNode } from './materialize.js'

const at = '2026-07-12T00:00:00.000Z'

function insertButton(existingFiles?: string[]) {
  const doc = createDocumentFixture(1000)
  const entry = catalog.find((item) => item.id === 'shadcn/button')!
  const node = createRegistryNode(doc, entry, null, planInsertBounds(doc, null, entry.defaultSize))
  const next = applyOperation(doc, planInsert(doc, node, at))
  return { document: next, nodeId: node.id, entry, existingFiles }
}

describe('planMaterializeRegistryNode', () => {
  it('produces a deterministic src/components/<ExportName>.tsx plan for a registry node', () => {
    const { document, nodeId } = insertButton()
    const result = planMaterializeRegistryNode(document, nodeId)
    expect(result.filePath).toBe('src/components/Button.tsx')
    expect(result.operations).toEqual([])
    expect(result.content).toContain('export function Button()')
  })

  it('is byte-for-byte deterministic across repeated calls', () => {
    const { document, nodeId } = insertButton()
    const first = planMaterializeRegistryNode(document, nodeId)
    const second = planMaterializeRegistryNode(document, nodeId)
    expect(first).toEqual(second)
  })

  it('embeds the canonical node id, name, and label as data-agent-design-* markers', () => {
    const { document, nodeId } = insertButton()
    const result = planMaterializeRegistryNode(document, nodeId)
    expect(result.content).toContain(`data-agent-design-id="${nodeId}"`)
    expect(result.content).toContain('data-agent-design-name="Button"')
    expect(result.content).toContain('data-agent-design-label="Button"')
  })

  it('reflects defaultProps.label overrides into the generated label marker and body text', () => {
    const doc = createDocumentFixture(1000)
    const entry = catalog.find((item) => item.id === 'shadcn/button')!
    const node = createRegistryNode(doc, entry, null, planInsertBounds(doc, null, entry.defaultSize))
    node.props.label = 'Ship it'
    const next = applyOperation(doc, planInsert(doc, node, at))
    const result = planMaterializeRegistryNode(next, node.id)
    expect(result.content).toContain('data-agent-design-label="Ship it"')
    expect(result.content).toContain('>\n      Ship it\n    <')
  })

  it('builds a className from the sorted variant entries', () => {
    const { document, nodeId } = insertButton()
    const result = planMaterializeRegistryNode(document, nodeId)
    // shadcn/button variants: { size: 'md', variant: 'default' }
    expect(result.content).toContain('className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium size-md variant-default"')
  })

  it('suffixes the export/file name deterministically on collision', () => {
    const { document, nodeId } = insertButton()
    const first = planMaterializeRegistryNode(document, nodeId, { existingFiles: ['src/components/Button.tsx'] })
    expect(first.filePath).toBe('src/components/Button2.tsx')
    expect(first.content).toContain('export function Button2()')

    const second = planMaterializeRegistryNode(document, nodeId, {
      existingFiles: ['src/components/Button.tsx', 'src/components/Button2.tsx'],
    })
    expect(second.filePath).toBe('src/components/Button3.tsx')
    expect(second.content).toContain('export function Button3()')
  })

  it('throws for a node that is not a registry:// code-component', () => {
    const doc = createDocumentFixture(1000)
    const [rootId] = doc.rootIds
    expect(() => planMaterializeRegistryNode(doc, rootId)).toThrow(/not a code-component/)
  })

  it('throws for a code-component node already backed by a real file', () => {
    const { document, nodeId } = insertButton()
    const node = document.nodes[nodeId]
    if (node.kind !== 'code-component') throw new Error('expected code-component')
    const alreadySourced = { ...document, nodes: { ...document.nodes, [nodeId]: { ...node, source: { ...node.source, file: 'src/components/Button.tsx' } } } }
    expect(() => planMaterializeRegistryNode(alreadySourced, nodeId)).toThrow(/already source-backed/)
  })

  it('throws for a missing node id', () => {
    const doc = createDocumentFixture(1000)
    expect(() => planMaterializeRegistryNode(doc, 'does-not-exist')).toThrow(/missing node/)
  })
})
