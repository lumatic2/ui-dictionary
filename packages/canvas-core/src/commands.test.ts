import { describe, expect, it } from 'vitest'
import { createDocumentFixture, firstComponent } from './fixtures.js'
import { applyOperation, commitOperation, createHistory, undo } from './operations.js'
import { createInstanceNode, createPrimitiveNode, nextNodeId, planAlign, planDeleteSelection, planDistribute, planInsert, planInsertBounds, resolveInsertParent } from './commands.js'

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
  it('resolves the insert parent from a single unlocked container selection', () => {
    const doc = createDocumentFixture(1000)
    doc.selection = ['node-00000']
    expect(resolveInsertParent(doc)).toBe('node-00000')
    doc.selection = ['node-00007']
    expect(resolveInsertParent(doc)).toBeNull()
    doc.selection = ['node-00000']; doc.nodes['node-00000'].locked = true
    expect(resolveInsertParent(doc)).toBeNull()
    doc.selection = []
    expect(resolveInsertParent(doc)).toBeNull()
  })
  it('plans deterministic insert bounds for root and container targets', () => {
    const doc = createDocumentFixture(1000)
    expect(planInsertBounds(doc, null, { width: 240, height: 160 })).toEqual({ x: 40, y: 40, width: 240, height: 160 })
    const parent = doc.nodes['node-00000']
    expect(planInsertBounds(doc, 'node-00000', { width: 120, height: 32 })).toEqual({ x: parent.bounds.x + 24, y: parent.bounds.y + 24, width: 120, height: 32 })
  })
  it('inserts, selects, and undoes in one history entry', () => {
    const doc = createDocumentFixture(1000)
    const node = createPrimitiveNode(doc, 'frame', null, planInsertBounds(doc, null, { width: 240, height: 160 }))
    const changed = commitOperation(createHistory(doc), planInsert(doc, node, at))
    expect(changed.present.rootIds.at(-1)).toBe(node.id)
    expect(changed.present.selection).toEqual([node.id])
    expect(changed.past).toHaveLength(1)
    const reverted = undo(changed).present
    expect(reverted.nodes[node.id]).toBeUndefined()
    expect(reverted.selection).toEqual(doc.selection)
  })
  it('creates instances only from known code components', () => {
    const doc = createDocumentFixture(1000)
    const component = firstComponent(doc)
    const instance = createInstanceNode(doc, component.id, null, { x: 40, y: 40, width: 92, height: 58 })
    expect(instance.kind).toBe('instance')
    expect(instance.kind === 'instance' && instance.componentId).toBe(component.id)
    expect(() => createInstanceNode(doc, 'node-00000', null, { x: 0, y: 0, width: 10, height: 10 })).toThrow('code component')
  })
  it('rejects locked destructive commands without mutation', () => {
    const doc = createDocumentFixture(1000); doc.selection = ['node-00001']; doc.nodes['node-00001'].locked = true
    expect(() => planDeleteSelection(doc, at)).toThrow('locked')
  })
})
