import { describe, expect, it } from 'vitest'
import { cloneDocument, createDocumentFixture, firstComponent } from './fixtures.js'
import type { CanvasDocument } from './types.js'
import { validateDocument } from './validation.js'

describe('canonical canvas document', () => {
  it.each([1000, 5000] as const)('validates the %i-node representative fixture', (size) => {
    const document = createDocumentFixture(size)
    const result = validateDocument(document)
    expect(result).toEqual({ valid: true, errors: [] })
    expect(Object.keys(document.nodes)).toHaveLength(size)
    expect(Object.values(document.nodes).filter((node) => node.source)).not.toHaveLength(0)
  })

  it('rejects a broken hierarchy', () => {
    const document = cloneDocument(createDocumentFixture(1000))
    document.nodes['node-00001'].parentId = 'missing-parent'
    const result = validateDocument(document)
    expect(result.valid).toBe(false)
    expect(result.errors.join('\n')).toContain('missing parent')
  })

  it('rejects a dangling instance component', () => {
    const document = cloneDocument(createDocumentFixture(1000))
    const instance = Object.values(document.nodes).find((node) => node.kind === 'instance')
    if (!instance || instance.kind !== 'instance') throw new Error('fixture has no instance')
    instance.componentId = 'missing-component'
    expect(validateDocument(document).errors.join('\n')).toContain('dangling component')
  })

  it('rejects an invalid source mapping', () => {
    const document = cloneDocument(createDocumentFixture(1000))
    firstComponent(document).source.endLine = 0
    expect(validateDocument(document).errors.join('\n')).toContain('invalid source mapping')
  })

  it('rejects unknown schema versions', () => {
    const document = cloneDocument(createDocumentFixture(1000)) as unknown as Omit<CanvasDocument, 'schemaVersion'> & { schemaVersion: number }
    document.schemaVersion = 2
    expect(validateDocument(document as unknown as CanvasDocument).errors.join('\n')).toContain('unsupported schema version')
  })
})
