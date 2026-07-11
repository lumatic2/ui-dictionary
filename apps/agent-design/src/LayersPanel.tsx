import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import {
  planNodeDrop,
  planSiblingReorder,
  type CanvasDocument,
  type CanvasOperation,
  type NodeId,
} from '@askewly/canvas-core'

interface Props {
  document: CanvasDocument
  onOperation: (operation: CanvasOperation) => void
}

interface LayerRow {
  id: NodeId
  level: number
  hasChildren: boolean
  expanded: boolean
}

const LAYER_DRAG_TYPE = 'application/x-agent-design-layer'

function operationId(prefix: string) {
  return { id: `${prefix}-${performance.now()}`, at: new Date().toISOString() }
}

export function LayersPanel({ document, onOperation }: Props) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<NodeId>>(new Set())
  const [focusedId, setFocusedId] = useState<NodeId | null>(null)
  const [renamingId, setRenamingId] = useState<NodeId | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [dropState, setDropState] = useState<{ id: NodeId; valid: boolean } | null>(null)
  const itemRefs = useRef(new Map<NodeId, HTMLDivElement>())
  const renameReturnId = useRef<NodeId | null>(null)
  const renameClosing = useRef(false)
  const layerDragId = useRef<NodeId | null>(null)

  const rows = useMemo(() => {
    const result: LayerRow[] = []
    const walk = (ids: NodeId[], level: number) => {
      for (const id of ids) {
        const node = document.nodes[id]
        if (!node) continue
        const expanded = expandedIds.has(id)
        result.push({ id, level, hasChildren: node.childIds.length > 0, expanded })
        if (expanded && node.childIds.length) walk(node.childIds, level + 1)
      }
    }
    walk(document.rootIds, 1)
    return result
  }, [document.nodes, document.rootIds, expandedIds])

  useEffect(() => {
    if (!document.selection.length) return
    setExpandedIds((current) => {
      const next = new Set(current)
      for (const id of document.selection) {
        let parentId = document.nodes[id]?.parentId ?? null
        while (parentId) {
          next.add(parentId)
          parentId = document.nodes[parentId]?.parentId ?? null
        }
      }
      return next.size === current.size ? current : next
    })
  }, [document.nodes, document.selection])

  useEffect(() => {
    if (renamingId !== null || !renameReturnId.current) return
    itemRefs.current.get(renameReturnId.current)?.focus()
    renameReturnId.current = null
  }, [renamingId])

  const focusRow = useCallback((id: NodeId | undefined) => {
    if (!id) return
    setFocusedId(id)
    itemRefs.current.get(id)?.focus()
  }, [])

  const toggleExpanded = useCallback((id: NodeId, expanded?: boolean) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      const open = expanded ?? !next.has(id)
      if (open) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const selectRow = useCallback((id: NodeId, additive: boolean) => {
    const nodeIds = additive
      ? document.selection.includes(id) ? document.selection.filter((selected) => selected !== id) : [...document.selection, id]
      : [id]
    onOperation({ ...operationId('layer-select'), type: 'select-nodes', nodeIds })
  }, [document.selection, onOperation])

  const beginRename = useCallback((id: NodeId) => {
    const node = document.nodes[id]
    if (!node || node.locked) return
    renameClosing.current = false
    setRenameDraft(node.name)
    setRenamingId(id)
  }, [document.nodes])

  const closeRename = useCallback((commit: boolean) => {
    if (renameClosing.current || renamingId === null) return
    renameClosing.current = true
    const node = document.nodes[renamingId]
    const nextName = renameDraft.trim()
    if (commit && node && nextName && nextName !== node.name) {
      onOperation({ ...operationId('layer-rename'), type: 'update-node', nodeId: renamingId, patch: { name: nextName } })
    }
    renameReturnId.current = renamingId
    setRenamingId(null)
  }, [document.nodes, onOperation, renameDraft, renamingId])

  const reorderRow = useCallback((id: NodeId, direction: -1 | 1) => {
    const plan = planSiblingReorder(document, id, direction)
    if (!plan.valid) return
    onOperation({ ...operationId('layer-reorder'), type: 'reorder-node', nodeId: plan.nodeId, index: plan.index })
  }, [document, onOperation])

  const onRowKeyDown = useCallback((event: KeyboardEvent, row: LayerRow, rowIndex: number) => {
    if (renamingId !== null) return
    if (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      reorderRow(row.id, event.key === 'ArrowDown' ? 1 : -1)
      return
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusRow(rows[rowIndex + 1]?.id)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusRow(rows[rowIndex - 1]?.id)
        break
      case 'ArrowRight':
        event.preventDefault()
        if (!row.hasChildren) break
        if (row.expanded) focusRow(rows[rowIndex + 1]?.id)
        else toggleExpanded(row.id, true)
        break
      case 'ArrowLeft': {
        event.preventDefault()
        if (row.expanded) { toggleExpanded(row.id, false); break }
        const parentId = document.nodes[row.id]?.parentId
        if (parentId) focusRow(parentId)
        break
      }
      case 'Enter':
      case ' ':
        event.preventDefault()
        selectRow(row.id, event.shiftKey)
        break
      case 'F2':
        event.preventDefault()
        beginRename(row.id)
        break
    }
  }, [beginRename, document.nodes, focusRow, renamingId, reorderRow, rows, selectRow, toggleExpanded])

  const onRowDrop = useCallback((event: DragEvent, targetId: NodeId) => {
    event.preventDefault()
    setDropState(null)
    const nodeId = layerDragId.current ?? event.dataTransfer.getData(LAYER_DRAG_TYPE)
    layerDragId.current = null
    if (!nodeId) return
    const plan = planNodeDrop(document, nodeId, targetId, 'inside')
    if (!plan.valid) return
    toggleExpanded(targetId, true)
    onOperation({ ...operationId('layer-reparent'), type: 'reparent-node', nodeId: plan.nodeId, parentId: plan.parentId, index: plan.index })
  }, [document, onOperation, toggleExpanded])

  const focusTargetId = focusedId && document.nodes[focusedId] ? focusedId : document.selection[0] ?? rows[0]?.id

  return <div className="layers-panel" data-testid="layers-panel">
    {rows.length === 0
      ? <p className="layers-empty" data-testid="layers-empty">No layers yet. Insert a frame to get started.</p>
      : <div role="tree" aria-label="Layers" className="layers-tree">
      {rows.map((row, rowIndex) => {
        const node = document.nodes[row.id]
        const selected = document.selection.includes(row.id)
        const renaming = renamingId === row.id
        return <div
          key={row.id}
          role="treeitem"
          ref={(element) => { if (element) itemRefs.current.set(row.id, element); else itemRefs.current.delete(row.id) }}
          aria-level={row.level}
          aria-selected={selected}
          aria-expanded={row.hasChildren ? row.expanded : undefined}
          aria-label={node.name}
          data-testid={`layer-${row.id}`}
          data-layer-parent-id={node.parentId ?? ''}
          data-drop-target={dropState?.id === row.id ? (dropState.valid ? 'active' : 'invalid') : 'idle'}
          className={`layer-row${selected ? ' selected' : ''}${node.visible ? '' : ' hidden-node'}`}
          style={{ paddingLeft: `${(row.level - 1) * 14 + 6}px` }}
          tabIndex={focusTargetId === row.id ? 0 : -1}
          draggable={!node.locked && !renaming}
          onClick={(event) => { setFocusedId(row.id); selectRow(row.id, event.shiftKey) }}
          onDoubleClick={() => beginRename(row.id)}
          onKeyDown={(event) => onRowKeyDown(event, row, rowIndex)}
          onFocus={() => setFocusedId(row.id)}
          onDragStart={(event) => {
            layerDragId.current = row.id
            event.dataTransfer.setData(LAYER_DRAG_TYPE, row.id)
            event.dataTransfer.effectAllowed = 'move'
          }}
          onDragOver={(event) => {
            const nodeId = layerDragId.current
            const valid = nodeId ? planNodeDrop(document, nodeId, row.id, 'inside').valid : false
            if (valid) event.preventDefault()
            setDropState((current) => current?.id === row.id && current.valid === valid ? current : { id: row.id, valid })
          }}
          onDragLeave={() => setDropState((current) => current?.id === row.id ? null : current)}
          onDragEnd={() => { layerDragId.current = null; setDropState(null) }}
          onDrop={(event) => onRowDrop(event, row.id)}
        >
          {row.hasChildren
            ? <button
              type="button"
              className="layer-toggle"
              aria-label={`${row.expanded ? 'Collapse' : 'Expand'} ${node.name}`}
              tabIndex={-1}
              onClick={(event) => { event.stopPropagation(); toggleExpanded(row.id) }}
            >{row.expanded ? '▾' : '▸'}</button>
            : <span className="layer-toggle" aria-hidden="true" />}
          <span className="layer-kind" aria-hidden="true">{node.kind === 'code-component' ? '⧉' : node.kind === 'instance' ? '◇' : node.kind === 'text' ? 'T' : node.kind === 'group' ? '⌗' : '▭'}</span>
          {renaming
            ? <input
              className="layer-rename"
              data-testid="layer-rename-input"
              aria-label={`Rename ${node.name}`}
              value={renameDraft}
              autoFocus
              onChange={(event) => setRenameDraft(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              onDoubleClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation()
                if (event.key === 'Enter') closeRename(true)
                if (event.key === 'Escape') closeRename(false)
              }}
              onBlur={() => closeRename(true)}
            />
            : <span className="layer-name">{node.name}</span>}
          <span className="layer-actions">
            <button
              type="button"
              className="layer-action"
              aria-label={`Toggle visibility for ${node.name}`}
              aria-pressed={node.visible}
              tabIndex={-1}
              onClick={(event) => {
                event.stopPropagation()
                onOperation({ ...operationId('layer-visibility'), type: 'update-node', nodeId: row.id, patch: { visible: !node.visible } })
              }}
            >{node.visible ? '👁' : '—'}</button>
            <button
              type="button"
              className="layer-action"
              aria-label={`Toggle lock for ${node.name}`}
              aria-pressed={node.locked}
              tabIndex={-1}
              onClick={(event) => {
                event.stopPropagation()
                onOperation({ ...operationId('layer-lock'), type: 'update-node', nodeId: row.id, patch: { locked: !node.locked } })
              }}
            >{node.locked ? '🔒' : '🔓'}</button>
          </span>
        </div>
      })}
    </div>}
  </div>
}
