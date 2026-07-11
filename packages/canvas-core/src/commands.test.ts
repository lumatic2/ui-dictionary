import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import { applyOperation, commitOperation, createHistory, undo } from './operations.js'
import { createPrimitiveNode, nextNodeId, planAlign, planDeleteSelection, planDistribute } from './commands.js'

const at = '2026-07-11T09:00:00.000Z'
describe('creation commands', () => {
  it('creates deterministic primitives and stable ids', () => {
    const doc = createDocumentFixture(1000)
    expect(nextNodeId(doc)).toBe('created-0001')
    expect(createPrimitiveNode(doc, 'text', null, { x: 1, y: 2, width: 100, height: 24 }).kind).toBe('text')
  })
  it('deletes a subtree atomically and undoes once', () => {
    const doc = createDocumentFixture(1000); doc.selection = ['node-00000']
    const changed = commitOperation(createHistory(doc), planDeleteSelection(doc, at))
    expect(changed.present.nodes['node-00000']).toBeUndefined()
    expect(changed.past).toHaveLength(1)
    expect(undo(changed).present.nodes['node-00000']).toBeTruthy()
  })
  it('aligns and distributes selected nodes deterministically', () => {
    const doc = createDocumentFixture(1000); doc.selection = ['node-00001', 'node-00002', 'node-00003']
    const aligned = applyOperation(doc, planAlign(doc, 'top', at))
    expect(new Set(aligned.selection.map((id) => aligned.nodes[id].bounds.y)).size).toBe(1)
    const distributed = applyOperation(doc, planDistribute(doc, 'horizontal', at))
    expect(distributed.nodes['node-00002'].bounds.x).toBeGreaterThan(distributed.nodes['node-00001'].bounds.x)
  })
  it('rejects locked destructive commands without mutation', () => {
    const doc = createDocumentFixture(1000); doc.selection = ['node-00001']; doc.nodes['node-00001'].locked = true
    expect(() => planDeleteSelection(doc, at)).toThrow('locked')
  })
})
