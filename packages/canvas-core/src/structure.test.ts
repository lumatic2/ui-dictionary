import { describe, expect, it } from 'vitest'
import { cloneDocument, createDocumentFixture } from './fixtures.js'
import { applyOperation, contentSignature, invertOperation } from './operations.js'
import { planNodeDrop, planSiblingReorder } from './structure.js'

const at = '2026-07-10T09:45:00.000Z'

describe('structure drop planning', () => {
  it('plans inside reparent and round-trips hierarchy, bounds, and responsive constraints', () => {
    const document = createDocumentFixture(1000)
    const before = cloneDocument(document)
    const originalLayout = structuredClone(document.nodes['node-00001'].layout)
    const bounds = { x: 400, y: 220, width: 180, height: 72 }
    const plan = planNodeDrop(document, 'node-00001', 'node-00100', 'inside', bounds)
    expect(plan.valid).toBe(true)
    if (!plan.valid) return
    const operation = { id: 'drop', at, type: 'reparent-node' as const, ...plan }
    const changed = applyOperation(document, operation)
    expect(changed.nodes['node-00001'].parentId).toBe('node-00100')
    expect(changed.nodes['node-00001'].bounds).toEqual(bounds)
    expect(changed.nodes['node-00001'].layout).toEqual(originalLayout)
    const restored = applyOperation(changed, invertOperation(before, operation))
    expect(contentSignature(restored)).toBe(contentSignature(before))
  })

  it('plans reorder against the post-removal sibling index', () => {
    const document = createDocumentFixture(1000)
    const plan = planSiblingReorder(document, 'node-00001', 1)
    expect(plan).toMatchObject({ valid: true, parentId: 'node-00000', index: 1 })
    if (!plan.valid) return
    const changed = applyOperation(document, { id: 'reorder', at, type: 'reparent-node', ...plan })
    expect(changed.nodes['node-00000'].childIds.slice(0, 3)).toEqual(['node-00002', 'node-00001', 'node-00003'])
  })

  it('rejects cycles, locked nodes, and instance boundaries in planner and operation defense', () => {
    const document = createDocumentFixture(1000)
    document.nodes['node-00003'].childIds.push('nested')
    document.nodes.nested = { ...structuredClone(document.nodes['node-00004']), id: 'nested', parentId: 'node-00003', childIds: [] }
    expect(planNodeDrop(document, 'node-00003', 'nested', 'inside')).toMatchObject({ valid: false, reason: expect.stringContaining('cycle') })
    document.nodes['node-00004'].locked = true
    expect(planNodeDrop(document, 'node-00004', 'node-00100', 'inside')).toMatchObject({ valid: false, reason: expect.stringContaining('locked') })
    expect(planNodeDrop(document, 'node-00003', 'node-00002', 'inside')).toMatchObject({ valid: false, reason: expect.stringContaining('instance') })
    expect(() => applyOperation(document, { id: 'bad', at, type: 'reparent-node', nodeId: 'node-00003', parentId: 'node-00002', index: 0 })).toThrow('cannot reparent into instance')
  })

  it.each(['fixed', 'hug', 'fill'] as const)('preserves %s sizing through bounds transforms', (sizing) => {
    const document = createDocumentFixture(1000)
    document.nodes['node-00001'].layout.horizontal = sizing
    const changed = applyOperation(document, {
      id: `resize-${sizing}`,
      at,
      type: 'transform-nodes',
      boundsById: { 'node-00001': { x: 10, y: 10, width: 320, height: 80 } },
    })
    expect(changed.nodes['node-00001'].layout.horizontal).toBe(sizing)
  })
})
