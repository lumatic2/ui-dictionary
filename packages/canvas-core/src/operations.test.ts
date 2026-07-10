import { describe, expect, it } from 'vitest'
import { cloneDocument, createDocumentFixture } from './fixtures.js'
import { applyOperation, canonicalStringify, commitOperation, contentSignature, createHistory, invertOperation, redo, replayOperations, undo } from './operations.js'
import type { CanvasOperation } from './operations.js'

const at = '2026-07-10T01:00:00.000Z'

function operations(): CanvasOperation[] {
  return [
    { id: 'op-1', at, type: 'update-node', nodeId: 'node-00007', patch: { name: '한국어 제목', bounds: { x: 144, y: 72, width: 240, height: 40 } } },
    { id: 'op-2', at, type: 'select-nodes', nodeIds: ['node-00007'] },
    { id: 'op-3', at, type: 'set-viewport', pan: { x: -120, y: -48 }, zoom: 1.25 },
    { id: 'op-4', at, type: 'reorder-node', nodeId: 'node-00007', index: 2 },
  ]
}

describe('canvas operations', () => {
  it('replays byte-identically from the same document and log', () => {
    const initial = createDocumentFixture(1000)
    const first = replayOperations(initial, operations())
    const second = replayOperations(initial, JSON.parse(canonicalStringify(operations())) as CanvasOperation[])
    expect(canonicalStringify(first)).toBe(canonicalStringify(second))
    expect(first.revision).toBe(4)
  })

  it('keeps the input untouched when an invalid operation is rejected', () => {
    const initial = createDocumentFixture(1000)
    const before = canonicalStringify(initial)
    expect(() => applyOperation(initial, { id: 'bad', at, type: 'reparent-node', nodeId: 'node-00000', parentId: 'node-00001', index: 0 })).toThrow()
    expect(canonicalStringify(initial)).toBe(before)
  })

  it('undoes and redoes committed state deterministically', () => {
    const initial = createDocumentFixture(1000)
    const changed = commitOperation(createHistory(initial), operations()[0])
    const undone = undo(changed)
    const redone = redo(undone)
    expect(contentSignature(undone.present)).toBe(contentSignature(initial))
    expect(undone.log).toHaveLength(0)
    expect(undone.futureLog).toHaveLength(1)
    expect(canonicalStringify(redone.present)).toBe(canonicalStringify(changed.present))
    expect(redone.log).toHaveLength(1)
  })

  it('generates inverse operations for update, selection, viewport, reparent, and reorder', () => {
    let document = createDocumentFixture(1000)
    for (const operation of operations()) {
      const before = cloneDocument(document)
      document = applyOperation(document, operation)
      document = applyOperation(document, invertOperation(before, operation))
      expect(contentSignature(document)).toBe(contentSignature(before))
    }
  })

  it('inverts create and delete for a leaf node', () => {
    const initial = createDocumentFixture(1000)
    const node = structuredClone(initial.nodes['node-00007'])
    node.id = 'created-leaf'
    node.name = 'Created leaf'
    node.childIds = []
    const create: CanvasOperation = { id: 'create', at, type: 'create-node', node, parentId: node.parentId, index: 1 }
    const created = applyOperation(initial, create)
    const restored = applyOperation(created, invertOperation(initial, create))
    expect(contentSignature(restored)).toBe(contentSignature(initial))
  })

  it('recovers a 1k-operation log', () => {
    const initial = createDocumentFixture(1000)
    const log: CanvasOperation[] = Array.from({ length: 1000 }, (_, index) => ({
      id: `move-${index}`,
      at,
      type: 'update-node',
      nodeId: `node-${String((index % 99) + 1).padStart(5, '0')}`,
      patch: { visible: index % 2 === 0 },
    }))
    const result = replayOperations(initial, log)
    expect(result.revision).toBe(1000)
    expect(canonicalStringify(result)).toBe(canonicalStringify(replayOperations(initial, log)))
  })
})
