import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import { alignmentGuides, boundsChanged, captureBounds, moveBounds, resizeBounds, resizeRect } from './manipulation.js'
import { applyOperation, commitOperation, createHistory, redo, undo } from './operations.js'

const at = '2026-07-10T09:40:00.000Z'

describe('bounds manipulation transaction', () => {
  it('adjusts screen deltas by zoom and enforces minimum resize size', () => {
    const moved = moveBounds({ a: { x: 10, y: 20, width: 40, height: 30 } }, { x: 20, y: -10 }, 2)
    expect(moved.a).toEqual({ x: 20, y: 15, width: 40, height: 30 })
    expect(resizeRect(moved.a, 'nw', { x: 100, y: 100 }, 1)).toEqual({ x: 44, y: 29, width: 16, height: 16 })
  })

  it('scales multi-selection bounds as one group', () => {
    const resized = resizeBounds({
      a: { x: 0, y: 0, width: 20, height: 20 },
      b: { x: 20, y: 20, width: 20, height: 20 },
    }, 'se', { x: 40, y: 40 }, 1)
    expect(resized.a).toEqual({ x: 0, y: 0, width: 40, height: 40 })
    expect(resized.b).toEqual({ x: 40, y: 40, width: 40, height: 40 })
  })

  it('commits one transform operation and undoes/redoes all selected bounds', () => {
    const document = createDocumentFixture(1000)
    document.selection = ['node-00001', 'node-00002']
    const before = captureBounds(document)
    const after = moveBounds(before, { x: 24, y: 12 }, 1)
    const operation = { id: 'gesture-1', at, type: 'transform-nodes' as const, boundsById: after }
    const history = commitOperation(createHistory(document), operation)
    expect(history.log).toHaveLength(1)
    expect(history.present.nodes['node-00001'].bounds.x).toBe(before['node-00001'].x + 24)
    expect(undo(history).present.nodes['node-00001'].bounds).toEqual(before['node-00001'])
    expect(redo(undo(history)).present.nodes['node-00002'].bounds).toEqual(after['node-00002'])
    expect(applyOperation(history.present, { ...operation, id: 'inverse-check', boundsById: before }).nodes['node-00001'].bounds).toEqual(before['node-00001'])
  })

  it('rejects locked nodes, detects cancellation, and derives nearby guides', () => {
    const document = createDocumentFixture(1000)
    document.nodes['node-00001'].locked = true
    expect(captureBounds(document, ['node-00001'])).toEqual({})
    expect(() => applyOperation(document, {
      id: 'locked-transform',
      at,
      type: 'transform-nodes',
      boundsById: { 'node-00001': { x: 0, y: 0, width: 20, height: 20 } },
    })).toThrow('cannot transform locked node')
    const captured = captureBounds(document, ['node-00002'])
    expect(boundsChanged(captured, structuredClone(captured))).toBe(false)
    document.nodes['node-00003'].bounds.x = document.nodes['node-00002'].bounds.x + 2
    expect(alignmentGuides(document, captured).some((guide) => guide.axis === 'x')).toBe(true)
  })
})
