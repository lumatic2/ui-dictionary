import { useMemo, useState } from 'react'
import {
  createInstanceNode,
  createPrimitiveNode,
  planInsert,
  planInsertBounds,
  resolveInsertParent,
  type CanvasDocument,
  type CanvasOperation,
  type NodeId,
} from '@askewly/canvas-core'

interface Props {
  document: CanvasDocument
  onOperation: (operation: CanvasOperation) => void
}

type PaletteEntry =
  | { key: string; label: string; category: 'Primitives'; kind: 'frame' | 'text' | 'group' }
  | { key: string; label: string; category: 'Components'; componentId: NodeId }

const primitiveSizes = {
  frame: { width: 240, height: 160 },
  group: { width: 200, height: 140 },
  text: { width: 120, height: 32 },
} as const

export function InsertPalette({ document, onOperation }: Props) {
  const [query, setQuery] = useState('')
  const [feedback, setFeedback] = useState('')

  const entries = useMemo<PaletteEntry[]>(() => {
    const components = Object.values(document.nodes)
      .filter((node) => node.kind === 'code-component')
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((node): PaletteEntry => ({ key: `component-${node.id}`, label: node.name, category: 'Components', componentId: node.id }))
    return [
      { key: 'primitive-frame', label: 'Frame', category: 'Primitives', kind: 'frame' },
      { key: 'primitive-text', label: 'Text', category: 'Primitives', kind: 'text' },
      { key: 'primitive-group', label: 'Group', category: 'Primitives', kind: 'group' },
      ...components,
    ]
  }, [document.nodes])

  const hasComponents = useMemo(() => entries.some((entry) => entry.category === 'Components'), [entries])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return entries
    return entries.filter((entry) => entry.label.toLowerCase().includes(needle) || entry.category.toLowerCase().includes(needle))
  }, [entries, query])

  const insert = (entry: PaletteEntry) => {
    const parentId = resolveInsertParent(document)
    const at = new Date().toISOString()
    const size = entry.category === 'Primitives' ? primitiveSizes[entry.kind] : document.nodes[entry.componentId].bounds
    const bounds = planInsertBounds(document, parentId, { width: size.width, height: size.height })
    const node = entry.category === 'Primitives'
      ? createPrimitiveNode(document, entry.kind, parentId, bounds)
      : createInstanceNode(document, entry.componentId, parentId, bounds)
    onOperation(planInsert(document, node, at))
    setFeedback(`${node.name} inserted into ${parentId ? document.nodes[parentId].name : 'canvas root'}`)
  }

  const categories = ['Primitives', 'Components'] as const
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
        if (category === 'Components' && items.length === 0 && !hasComponents) {
          return <div key={category} className="insert-category">
            <p className="rail-label">Components</p>
            <p className="insert-category-empty" data-testid="insert-components-empty">No code components in this project yet. Insert primitives instead.</p>
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
