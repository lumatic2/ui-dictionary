import { describe, expect, it } from 'vitest'
import { createDocumentFixture, firstComponent } from './fixtures.js'
import { applyOperation, replayOperations } from './operations.js'
import { validateLiteralColor } from './properties.js'
import type { CanvasNode } from './types.js'

const at = '2026-07-21T00:00:00.000Z'

const badValues = ['javascript:alert(1)', 'url(evil)', '#zzz', 'expression(alert(1))', 'x'.repeat(100000)]

describe('probe: literal color bypass attempts', () => {
  it('1. update-node patch cannot inject literalColors', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    for (const bad of badValues) {
      expect(() => applyOperation(document, {
        id: 'probe-update', at, type: 'update-node', nodeId: component.id,
        // @ts-expect-error - runtime bypass attempt, patch type does not declare literalColors
        patch: { literalColors: { background: bad } },
      })).toThrow()
    }
  })

  it('2. create-node cannot inject literalColors', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    for (const bad of badValues) {
      const node: CanvasNode = {
        ...structuredClone(component),
        id: 'probe-new-node',
        childIds: [],
        literalColors: { background: bad },
      }
      expect(() => applyOperation(document, {
        id: 'probe-create', at, type: 'create-node', node, parentId: null, index: 0,
      })).toThrow()
    }
  })

  it('3. all bad values rejected by validateLiteralColor directly', () => {
    for (const bad of badValues) {
      expect(validateLiteralColor(bad)).not.toBeNull()
    }
  })

  it('4. co-existing binding + literal on same key is rejected', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => applyOperation(document, {
      id: 'probe-coexist', at, type: 'update-node', nodeId: component.id,
      // @ts-expect-error - runtime bypass
      patch: { literalColors: { background: '#ffffff' } },
    })).toThrow()
  })

  it('5. nested batch cannot inject literalColors', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => applyOperation(document, {
      id: 'probe-batch', at, type: 'batch', operations: [
        {
          id: 'inner', at, type: 'update-node', nodeId: component.id,
          // @ts-expect-error
          patch: { literalColors: { background: 'javascript:alert(1)' } },
        },
      ],
    })).toThrow()
  })

  it('6. reparent-node cannot smuggle literalColors (no field on op, but check gate still fires if node has bad literal after other ops in same batch)', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    const other = Object.values(document.nodes).find((n) => n.id !== component.id && n.parentId === null)!
    expect(() => applyOperation(document, {
      id: 'probe-reparent-batch', at, type: 'batch', operations: [
        {
          id: 'inner-update', at, type: 'update-node', nodeId: component.id,
          // @ts-expect-error
          patch: { literalColors: { background: 'url(evil)' } },
        },
        { id: 'inner-reparent', at, type: 'reparent-node', nodeId: component.id, parentId: other.id, index: 0 },
      ],
    })).toThrow()
  })

  it('7. replayOperations cannot be used to smuggle literalColors', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(() => replayOperations(document, [
      {
        id: 'probe-replay', at, type: 'update-node', nodeId: component.id,
        // @ts-expect-error
        patch: { literalColors: { background: 'expression(alert(1))' } },
      },
    ])).toThrow()
  })

  it('8. delete-node + create-node (recreate) cannot inject literalColors', () => {
    const document = createDocumentFixture(1000)
    const leaf = Object.values(document.nodes).find((n) => n.childIds.length === 0)!
    const recreated: CanvasNode = { ...structuredClone(leaf), literalColors: { background: '#zzz' } }
    expect(() => applyOperation(document, {
      id: 'probe-delete-recreate', at, type: 'batch', operations: [
        { id: 'del', at, type: 'delete-node', nodeId: leaf.id },
        { id: 're', at, type: 'create-node', node: recreated, parentId: recreated.parentId, index: 0 },
      ],
    })).toThrow()
  })

  it('9. every color value actually used in tokens/askewly.tokens.json, template-core tokens.ts, and agent-design editorTokens.ts passes validateLiteralColor', () => {
    // extracted programmatically (hex + color-function literals) from the three files named in the audit brief
    const realValues = [
      '#6F2DBD', '#A663CC', '#B298DC', '#B8D0EB', '#B9FAF8', '#f7f2e8', '#2f7d4f', '#2b241b',
      '#685d50', '#8d8172', '#1c2320', '#7fd4a0', '#f4efe4', '#c3bcae', '#8d867a',
      'oklch(0.985 0 0)', 'oklch(1 0 0)', 'oklch(0.95 0.015 270)', 'oklch(0.94 0.02 270)',
      'oklch(0.16 0.015 270)', 'oklch(0.46 0.03 270)', 'oklch(0.25 0.03 270)', 'oklch(0.58 0.22 27)',
      'oklch(0.88 0.015 270)', 'oklch(0.35 0.03 270)', 'oklch(0.72 0.02 270)',
    ]
    for (const value of realValues) {
      const error = validateLiteralColor(value)
      expect(error, `expected ${value} to be valid but got: ${error}`).toBeNull()
    }
  })

  it('10. delta rule: rewriting an existing bad literal with the SAME value is allowed (no new corruption)', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    delete component.tokenBindings.background
    component.literalColors = { background: 'javascript:alert(1)' }
    // same-value rewrite should not throw (matches documented behavior)
    const result = applyOperation(document, {
      id: 'probe-samevalue', at, type: 'update-node', nodeId: component.id,
      // @ts-expect-error
      patch: { literalColors: { background: 'javascript:alert(1)' } },
    })
    expect(result.nodes[component.id].literalColors?.background).toBe('javascript:alert(1)')
  })

  it('11. delta rule: changing an existing bad literal to a DIFFERENT bad value is rejected', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    delete component.tokenBindings.background
    component.literalColors = { background: 'javascript:alert(1)' }
    expect(() => applyOperation(document, {
      id: 'probe-diffvalue', at, type: 'update-node', nodeId: component.id,
      // @ts-expect-error
      patch: { literalColors: { background: 'url(other-evil)' } },
    })).toThrow()
  })
})
