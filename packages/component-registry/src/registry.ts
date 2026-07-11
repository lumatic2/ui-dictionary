import type { CanvasDocument, CanvasNode, CanvasRect, CodeComponentNode, NodeId } from '@askewly/canvas-core'
import { nextNodeId } from '@askewly/canvas-core'
import type { RegistryEntry } from './types.js'

const layout = { mode: 'absolute' as const, horizontal: 'fixed' as const, vertical: 'fixed' as const, gap: 0, padding: [0, 0, 0, 0] as [number, number, number, number] }

export function validateCatalog(entries: RegistryEntry[]): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const entry of entries) {
    if (!entry.id) errors.push('entry has an empty id')
    else if (seen.has(entry.id)) errors.push(`duplicate entry id: ${entry.id}`)
    else seen.add(entry.id)
    if (!entry.slug) errors.push(`${entry.id}: slug is required`)
    if (!entry.name) errors.push(`${entry.id}: name is required`)
    if (!entry.collection) errors.push(`${entry.id}: collection is required`)
    if (!entry.category) errors.push(`${entry.id}: category is required`)
    if (!entry.description) errors.push(`${entry.id}: description is required`)
    if (!(entry.defaultSize.width > 0) || !(entry.defaultSize.height > 0)) errors.push(`${entry.id}: defaultSize must be positive`)
    for (const [key, value] of Object.entries(entry.defaultProps)) {
      const type = typeof value
      if (value !== null && type !== 'string' && type !== 'number' && type !== 'boolean') {
        errors.push(`${entry.id}: defaultProps.${key} has unsupported type ${type}`)
      }
    }
    for (const [key, value] of Object.entries(entry.variants)) {
      if (typeof value !== 'string') errors.push(`${entry.id}: variants.${key} must be a string`)
    }
    if (!Array.isArray(entry.keywords)) errors.push(`${entry.id}: keywords must be an array`)
  }
  return errors
}

function collectionRank(collection: RegistryEntry['collection']): number {
  return collection === 'shadcn' ? 0 : collection === 'layout' ? 1 : 2
}

function sortEntries(entries: RegistryEntry[]): RegistryEntry[] {
  return [...entries].sort((a, b) => collectionRank(a.collection) - collectionRank(b.collection) || a.name.localeCompare(b.name))
}

export function searchRegistry(entries: RegistryEntry[], query: string): RegistryEntry[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return sortEntries(entries)
  const matches = entries.filter((entry) => {
    const haystack = [entry.name, entry.category, entry.collection, ...entry.keywords].join(' ').toLowerCase()
    return haystack.includes(trimmed)
  })
  return sortEntries(matches)
}

export function createRegistryNode(document: CanvasDocument, entry: RegistryEntry, parentId: NodeId | null, bounds: CanvasRect): CodeComponentNode {
  const id = nextNodeId(document)
  return {
    id,
    kind: 'code-component',
    name: entry.name,
    parentId,
    childIds: [],
    bounds: { ...bounds },
    layout: structuredClone(layout),
    visible: true,
    locked: false,
    tokenBindings: {},
    source: { file: `registry://${entry.id}`, exportName: entry.name.replace(/\s+/g, ''), startLine: 1, endLine: 1 },
    props: structuredClone(entry.defaultProps),
    variants: structuredClone(entry.variants),
  }
}

function isCodeComponent(node: CanvasNode): node is CodeComponentNode {
  return node.kind === 'code-component'
}

export function projectComponents(document: CanvasDocument): RegistryEntry[] {
  const entries = Object.values(document.nodes)
    .filter(isCodeComponent)
    .filter((node) => !node.source.file.startsWith('registry://'))
    .map((node): RegistryEntry => ({
      id: `project/${node.id}`,
      slug: node.id,
      name: node.name,
      collection: 'project',
      category: 'Project',
      description: `Project component sourced from ${node.source.file}.`,
      defaultSize: { width: node.bounds.width, height: node.bounds.height },
      defaultProps: structuredClone(node.props),
      variants: structuredClone(node.variants),
      keywords: [node.name],
    }))
  return sortEntries(entries)
}
