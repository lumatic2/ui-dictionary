import { describe, expect, it } from 'vitest'
import { createDocumentFixture, firstComponent } from './fixtures.js'
import { applyOperation, commitOperation, createHistory, redo, undo } from './operations.js'
import { propertyFieldsForNode, validateNodePropertyEdit } from './properties.js'

const at = '2026-07-10T09:47:00.000Z'

describe('typed property runtime', () => {
  it('derives kind-aware fields and commits typed props, variants, tokens, layout, and mode', () => {
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(propertyFieldsForNode(component).map((field) => `${field.scope}.${field.key}`)).toEqual(expect.arrayContaining([
      'prop.label', 'prop.disabled', 'variant.size', 'token.background', 'layout.mode',
    ]))
    document = applyOperation(document, { id: 'prop', at, type: 'set-node-property', nodeId: component.id, scope: 'prop', key: 'disabled', value: true })
    document = applyOperation(document, { id: 'variant', at, type: 'set-node-property', nodeId: component.id, scope: 'variant', key: 'size', value: 'lg' })
    document = applyOperation(document, { id: 'token', at, type: 'set-node-property', nodeId: component.id, scope: 'token', key: 'background', value: 'surface.base' })
    document = applyOperation(document, { id: 'layout', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'horizontal', value: 'fill' })
    document = applyOperation(document, { id: 'mode', at, type: 'set-token-mode', tokenSetId: 'askewly.dark' })
    expect(firstComponent(document).props.disabled).toBe(true)
    expect(firstComponent(document).variants.size).toBe('lg')
    expect(firstComponent(document).tokenBindings.background).toBe('surface.base')
    expect(firstComponent(document).layout.horizontal).toBe('fill')
    expect(document.tokenSetId).toBe('askewly.dark')
  })

  it('rejects unknown, mismatched, and invalid property input before mutation', () => {
    const document = createDocumentFixture(1000)
    const component = firstComponent(document)
    expect(validateNodePropertyEdit(document, { nodeId: component.id, scope: 'prop', key: 'missing', value: true })).toContain('unknown prop')
    expect(() => applyOperation(document, { id: 'bad-type', at, type: 'set-node-property', nodeId: component.id, scope: 'prop', key: 'disabled', value: 'yes' })).toThrow('type mismatch')
    expect(() => applyOperation(document, { id: 'bad-token', at, type: 'set-node-property', nodeId: component.id, scope: 'token', key: 'background', value: 'purple' })).toThrow('invalid token')
    expect(() => applyOperation(document, { id: 'bad-variant', at, type: 'set-node-property', nodeId: component.id, scope: 'variant', key: 'size', value: '' })).toThrow('invalid variant')
    expect(() => applyOperation(document, { id: 'bad-mode', at, type: 'set-token-mode', tokenSetId: 'dark' })).toThrow('invalid token mode')
  })

  it('applies uniform padding and gap through the layout scope', () => {
    let document = createDocumentFixture(1000)
    const component = firstComponent(document)
    document = applyOperation(document, { id: 'gap', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'gap', value: 12 })
    document = applyOperation(document, { id: 'padding', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'padding', value: 20 })
    expect(firstComponent(document).layout.gap).toBe(12)
    expect(firstComponent(document).layout.padding).toEqual([20, 20, 20, 20])
    expect(propertyFieldsForNode(firstComponent(document)).map((field) => `${field.scope}.${field.key}`)).toEqual(expect.arrayContaining(['layout.gap', 'layout.padding']))
    expect(() => applyOperation(document, { id: 'bad-padding', at, type: 'set-node-property', nodeId: component.id, scope: 'layout', key: 'padding', value: -1 })).toThrow('invalid layout padding')
  })

  it('commits Korean text as one operation and restores it through undo/redo', () => {
    const document = createDocumentFixture(1000)
    const history = commitOperation(createHistory(document), { id: 'ime-1', at, type: 'update-text', nodeId: 'node-00007', text: '한글 조합 완료' })
    expect(history.log).toHaveLength(1)
    expect(history.present.nodes['node-00007']).toMatchObject({ kind: 'text', text: '한글 조합 완료' })
    expect(undo(history).present.nodes['node-00007']).toMatchObject({ kind: 'text', text: '한글 캔버스 입력' })
    expect(redo(undo(history)).present.nodes['node-00007']).toMatchObject({ kind: 'text', text: '한글 조합 완료' })
  })
})
