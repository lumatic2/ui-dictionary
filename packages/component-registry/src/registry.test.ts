import { describe, expect, it } from 'vitest'
import { applyOperation, assertValidDocument, createDocumentFixture, planInsert, planInsertBounds } from '@askewly/canvas-core'
import { catalog, layoutCatalog, shadcnCatalog } from './catalog.js'
import { createRegistryNode, projectComponents, searchRegistry, validateCatalog } from './registry.js'

const at = '2026-07-12T00:00:00.000Z'

describe('catalog', () => {
  it('has the expected collection counts', () => {
    expect(shadcnCatalog).toHaveLength(10)
    expect(layoutCatalog).toHaveLength(6)
    expect(catalog).toHaveLength(16)
  })

  it('passes validateCatalog with zero errors', () => {
    expect(validateCatalog(catalog)).toEqual([])
  })

  it('flags duplicate ids and invalid fields', () => {
    const errors = validateCatalog([
      { ...catalog[0], id: '' },
      { ...catalog[1], id: catalog[1].id },
      { ...catalog[1], defaultSize: { width: 0, height: 10 } },
    ])
    expect(errors.length).toBeGreaterThan(0)
  })
})

describe('createRegistryNode', () => {
  it('produces a valid canonical code-component node for every catalog entry', () => {
    for (const entry of catalog) {
      const doc = createDocumentFixture(1000)
      const bounds = planInsertBounds(doc, null, entry.defaultSize)
      const node = createRegistryNode(doc, entry, null, bounds)
      const next = applyOperation(doc, planInsert(doc, node, at))
      expect(() => assertValidDocument(next)).not.toThrow()
      const created = next.nodes[node.id]
      expect(created.kind).toBe('code-component')
      expect(created.name).toBe(entry.name)
      if (created.kind === 'code-component') {
        expect(created.source.file).toBe(`registry://${entry.id}`)
        expect(created.source.startLine).toBe(1)
        expect(created.source.endLine).toBe(1)
        expect(created.props).toEqual(entry.defaultProps)
        expect(created.variants).toEqual(entry.variants)
      }
    }
  })

  it('clones props and variants rather than sharing references', () => {
    const doc = createDocumentFixture(1000)
    const entry = catalog[0]
    const node = createRegistryNode(doc, entry, null, planInsertBounds(doc, null, entry.defaultSize))
    expect(node.props).not.toBe(entry.defaultProps)
    expect(node.variants).not.toBe(entry.variants)
  })
})

describe('searchRegistry', () => {
  it('returns all entries in deterministic collection-then-name order for an empty query', () => {
    const result = searchRegistry(catalog, '')
    expect(result).toHaveLength(catalog.length)
    expect(result.slice(0, 10).every((entry) => entry.collection === 'shadcn')).toBe(true)
    const shadcnNames = result.filter((entry) => entry.collection === 'shadcn').map((entry) => entry.name)
    expect(shadcnNames).toEqual([...shadcnNames].sort((a, b) => a.localeCompare(b)))
  })

  it('matches case-insensitively across name, category, keywords, and collection', () => {
    expect(searchRegistry(catalog, 'BUTTON').map((entry) => entry.id)).toEqual(['shadcn/button'])
    expect(searchRegistry(catalog, 'forms').map((entry) => entry.id).sort()).toEqual(['shadcn/input', 'shadcn/select'])
    expect(searchRegistry(catalog, 'dropdown').map((entry) => entry.id)).toEqual(['shadcn/select'])
    expect(searchRegistry(catalog, 'layout').length).toBeGreaterThan(0)
  })

  it('is deterministic across repeated calls', () => {
    const first = searchRegistry(catalog, 'a').map((entry) => entry.id)
    const second = searchRegistry(catalog, 'a').map((entry) => entry.id)
    expect(first).toEqual(second)
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchRegistry(catalog, 'zzz-nonexistent')).toEqual([])
  })
})

describe('projectComponents', () => {
  it('derives project entries from code-component nodes not sourced from the registry', () => {
    const doc = createDocumentFixture(1000)
    const derived = projectComponents(doc)
    expect(derived.length).toBeGreaterThan(0)
    for (const entry of derived) {
      expect(entry.collection).toBe('project')
      expect(entry.id.startsWith('project/')).toBe(true)
    }
  })

  it('excludes registry:// sourced nodes from the derivation', () => {
    const doc = createDocumentFixture(1000)
    const entry = catalog[0]
    const node = createRegistryNode(doc, entry, null, planInsertBounds(doc, null, entry.defaultSize))
    const next = applyOperation(doc, planInsert(doc, node, at))
    const derived = projectComponents(next)
    expect(derived.some((item) => item.id === `project/${node.id}`)).toBe(false)
  })
})
