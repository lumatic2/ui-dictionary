import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import { alignmentGuides, boundsChanged, captureBounds, moveBounds, rectCenter, resizeBounds, resizeRect, rotationFromPointer } from './manipulation.js'
import { applyOperation, commitOperation, createHistory, invertOperation, normalizeRotation, redo, undo } from './operations.js'

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

describe('회전 (EU1)', () => {
  const center = { x: 100, y: 100 }

  it('중심 기준 포인터 방향이 각도가 된다', () => {
    // 오른쪽(0°)에서 잡아 아래쪽(90°)으로 끌면 90° 돈다.
    const rotation = rotationFromPointer(center, { x: 100, y: 200 }, { pointer: { x: 200, y: 100 }, rotation: 0 })
    expect(rotation).toBeCloseTo(90, 5)
  })

  it('잡은 지점이 어디든 그 순간의 각도가 기준이 된다', () => {
    // 위쪽에서 잡아 오른쪽으로 끌면 +90° — 잡은 위치 자체는 각도를 튀게 하지 않는다.
    const rotation = rotationFromPointer(center, { x: 200, y: 100 }, { pointer: { x: 100, y: 0 }, rotation: 30 })
    expect(rotation).toBeCloseTo(120, 5)
  })

  it('회전축은 바운딩 박스 중심이다', () => {
    expect(rectCenter({ x: 10, y: 20, width: 100, height: 40 })).toEqual({ x: 60, y: 40 })
  })

  it('각도를 [0,360)으로 접는다', () => {
    expect(normalizeRotation(370)).toBeCloseTo(10, 5)
    expect(normalizeRotation(-90)).toBeCloseTo(270, 5)
    expect(normalizeRotation(0)).toBe(0)
    expect(normalizeRotation(-0)).toBe(0)
  })
})

describe('회전 연산 (EU1)', () => {
  it('각도만 바꾸고 bounds는 건드리지 않는다', () => {
    const document = createDocumentFixture(1000)
    const id = document.selection[0]
    const before = structuredClone(document.nodes[id].bounds)
    const next = applyOperation(document, { id: 'r1', at: 1, type: 'rotate-nodes', rotationById: { [id]: 45 } })
    expect(next.nodes[id].rotation).toBe(45)
    expect(next.nodes[id].bounds).toEqual(before)
  })

  it('되돌리면 이전 각도로 돌아온다', () => {
    const document = createDocumentFixture(1000)
    const id = document.selection[0]
    const operation = { id: 'r2', at: 1, type: 'rotate-nodes' as const, rotationById: { [id]: 30 } }
    const rotated = applyOperation(document, operation)
    const inverse = invertOperation(document, operation)
    expect(applyOperation(rotated, inverse).nodes[id].rotation).toBe(0)
  })

  it('잠긴 노드는 회전하지 않는다', () => {
    const document = createDocumentFixture(1000)
    const id = document.selection[0]
    const locked = { ...document, nodes: { ...document.nodes, [id]: { ...document.nodes[id], locked: true } } }
    expect(() => applyOperation(locked, { id: 'r3', at: 1, type: 'rotate-nodes', rotationById: { [id]: 10 } }))
      .toThrowError(/locked/)
  })
})
