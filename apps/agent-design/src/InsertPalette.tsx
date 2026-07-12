import { useMemo, useState } from 'react'
import {
  createInstanceNode,
  createPrimitiveNode,
  planInsert,
  planInsertBounds,
  resolveInsertParent,
  type CanvasDocument,
  type CanvasOperation,
} from '@askewly/canvas-core'
import {
  catalog,
  createRegistryNode,
  projectComponents,
  recipeCatalog,
  searchRegistry,
  type RegistryCollection,
  type RegistryEntry,
} from '@askewly/component-registry'

interface Props {
  document: CanvasDocument
  onOperation: (operation: CanvasOperation) => void
}

type Category = 'Primitives' | 'Components' | 'Layout' | 'Recipes' | 'Project'

type PaletteEntry =
  | { key: string; label: string; category: 'Primitives'; kind: 'frame' | 'text' | 'group' }
  | { key: string; label: string; category: Exclude<Category, 'Primitives'>; entry: RegistryEntry }

const primitiveSizes = {
  frame: { width: 240, height: 160 },
  group: { width: 200, height: 140 },
  text: { width: 120, height: 32 },
} as const

const primitiveEntries: PaletteEntry[] = [
  { key: 'primitive-frame', label: 'Frame', category: 'Primitives', kind: 'frame' },
  { key: 'primitive-text', label: 'Text', category: 'Primitives', kind: 'text' },
  { key: 'primitive-group', label: 'Group', category: 'Primitives', kind: 'group' },
]

const categories: Category[] = ['Primitives', 'Components', 'Layout', 'Recipes', 'Project']

function categoryForCollection(collection: RegistryCollection): Exclude<Category, 'Primitives'> {
  if (collection === 'shadcn') return 'Components'
  if (collection === 'layout') return 'Layout'
  if (collection === 'recipe') return 'Recipes'
  return 'Project'
}

function paletteKey(entry: RegistryEntry): string {
  if (entry.collection === 'project') return `component-${entry.slug}`
  if (entry.collection === 'recipe') return `recipe-${entry.slug}`
  return `registry-${entry.slug}`
}

export function InsertPalette({ document, onOperation }: Props) {
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')

  const projectEntries = useMemo(() => projectComponents(document), [document.nodes])
  const hasProjectComponents = projectEntries.length > 0

  const registryAll = useMemo(() => [...catalog, ...recipeCatalog, ...projectEntries], [projectEntries])

  const visibleRegistry = useMemo(() => searchRegistry(registryAll, query), [registryAll, query])

  const visiblePrimitives = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return primitiveEntries
    return primitiveEntries.filter((entry) => entry.label.toLowerCase().includes(needle) || entry.category.toLowerCase().includes(needle))
  }, [query])

  const visible = useMemo<PaletteEntry[]>(() => [
    ...visiblePrimitives,
    ...visibleRegistry.map((entry): PaletteEntry => ({
      key: paletteKey(entry),
      label: entry.name,
      category: categoryForCollection(entry.collection),
      entry,
    })),
  ], [visiblePrimitives, visibleRegistry])

  const insert = (entry: PaletteEntry) => {
    const parentId = resolveInsertParent(document)
    const at = new Date().toISOString()

    if (entry.category === 'Primitives') {
      const size = primitiveSizes[entry.kind]
      const bounds = planInsertBounds(document, parentId, size)
      const node = createPrimitiveNode(document, entry.kind, parentId, bounds)
      onOperation(planInsert(document, node, at))
      setFeedback(`${node.name} inserted into ${parentId ? document.nodes[parentId].name : 'canvas root'}`)
      return
    }

    if (entry.category === 'Project') {
      const sourceNodeId = entry.entry.slug
      const sourceBounds = document.nodes[sourceNodeId]?.bounds ?? entry.entry.defaultSize
      const bounds = planInsertBounds(document, parentId, { width: sourceBounds.width, height: sourceBounds.height })
      const node = createInstanceNode(document, sourceNodeId, parentId, bounds)
      onOperation(planInsert(document, node, at))
      setFeedback(`${node.name} inserted into ${parentId ? document.nodes[parentId].name : 'canvas root'}`)
      return
    }

    const bounds = planInsertBounds(document, parentId, entry.entry.defaultSize)
    const node = createRegistryNode(document, entry.entry, parentId, bounds)
    onOperation(planInsert(document, node, at))
    setFeedback(`${node.name} inserted into ${parentId ? document.nodes[parentId].name : 'canvas root'}`)
  }

  return <div className="insert-palette" data-testid="insert-palette" aria-label="Insert">
    <input
      data-testid="insert-search"
      aria-label="Search insertable items"
      placeholder="Search components…"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
    {visible.length === 0
      ? <p className="insert-empty" data-testid="insert-empty">No matches for “{query.trim()}”.</p>
      : categories.map((category) => {
        const items = visible.filter((entry) => entry.category === category)
        if (category === 'Project' && items.length === 0 && !hasProjectComponents) {
          return <div key={category} className="insert-category">
            <p className="rail-label">Project</p>
            <p className="insert-category-empty" data-testid="insert-project-empty">No project components in this project yet. Insert primitives instead.</p>
          </div>
        }
        if (!items.length) return null
        return <div key={category} className="insert-category">
          <p className="rail-label">{category}</p>
          {items.map((entry) => <button
            key={entry.key}
            type="button"
            className="insert-entry"
            data-testid={`insert-${entry.key}`}
            onClick={() => insert(entry)}
          >{entry.label}</button>)}
        </div>
      })}
    <p role="status" className="insert-feedback" data-testid="insert-feedback">{feedback}</p>
  </div>
}
