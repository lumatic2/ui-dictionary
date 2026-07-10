import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import { hitTest, marqueeHitTest, normalizeRect, paintOrder, reduceSelection, selectionBounds, traverseSelection } from './interaction.js'

describe('canvas interaction geometry', () => {
  it('uses hierarchy and sibling order as deterministic topmost paint order', () => {
    const document = createDocumentFixture(1000)
    document.nodes['node-00001'].bounds = { x: 10, y: 10, width: 100, height: 100 }
    document.nodes['node-00002'].bounds = { x: 10, y: 10, width: 100, height: 100 }
    expect(paintOrder(document).slice(0, 3)).toEqual(['node-00000', 'node-00001', 'node-00002'])
    expect(hitTest(document, { x: 20, y: 20 })).toBe('node-00002')
    document.nodes['node-00002'].visible = false
    expect(hitTest(document, { x: 20, y: 20 })).toBe('node-00001')
  })

  it('normalizes reverse marquee geometry and returns visible intersecting nodes', () => {
    const document = createDocumentFixture(1000)
    const rect = normalizeRect({ x: 230, y: 100 }, { x: 120, y: 10 })
    expect(rect).toEqual({ x: 120, y: 10, width: 110, height: 90 })
    expect(marqueeHitTest(document, rect)).toContain('node-00001')
  })

  it('reduces replace, add, and toggle selection without duplicates', () => {
    expect(reduceSelection(['a'], ['b', 'b'], 'replace')).toEqual(['b'])
    expect(reduceSelection(['a'], ['b', 'a'], 'add')).toEqual(['a', 'b'])
    expect(reduceSelection(['a', 'b'], ['b', 'c'], 'toggle')).toEqual(['a', 'c'])
  })

  it('traverses visible paint order and derives a multi-selection union', () => {
    const document = createDocumentFixture(1000)
    document.selection = ['node-00001']
    expect(traverseSelection(document, 1)).toBe('node-00002')
    expect(traverseSelection(document, -1)).toBe('node-00000')
    const union = selectionBounds(document, ['node-00001', 'node-00002'])
    expect(union).toEqual({ x: 128, y: 24, width: 196, height: 58 })
  })
})
