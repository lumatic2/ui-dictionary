import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import {
  planNodeDrop,
  planSiblingReorder,
  type CanvasDocument,
  type CanvasNode,
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
  /** 검색어에 직접 걸린 행인가. 조상은 맥락으로 함께 보이지만 매칭은 아니다. */
  match: boolean
}

const LAYER_DRAG_TYPE = 'application/x-agent-design-layer'

/**
 * 종류마다 다른 글자.
 *
 * `Record<CanvasNode['kind'], …>`로 두는 게 핵심이다 — 전에는 삼항 연쇄 끝의 `: '▭'` 폴백이
 * frame·image·shape 세 종류를 조용히 삼켰고, 1000행 트리에서 프레임과 이미지가 같아 보였다.
 * 이제 새 kind가 생기면 여기가 비어 컴파일이 거부한다.
 */
export const LAYER_KIND_ICONS: Record<CanvasNode['kind'], string> = {
  frame: '▣',
  group: '⌗',
  'code-component': '⧉',
  text: 'T',
  image: '▤',
  shape: '◑',
  instance: '◇',
}

function operationId(prefix: string) {
  return { id: `${prefix}-${performance.now()}`, at: new Date().toISOString() }
}

export function LayersPanel({ document, onOperation }: Props) {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<NodeId>>(new Set())
  const [focusedId, setFocusedId] = useState<NodeId | null>(null)
  const [renamingId, setRenamingId] = useState<NodeId | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [dropState, setDropState] = useState<{ id: NodeId; valid: boolean } | null>(null)
  const [search, setSearch] = useState('')
  const itemRefs = useRef(new Map<NodeId, HTMLDivElement>())
  const renameReturnId = useRef<NodeId | null>(null)
  const renameClosing = useRef(false)
  const layerDragId = useRef<NodeId | null>(null)

  /**
   * 검색어에 걸린 노드와 **그 조상 전부**의 집합. 검색어가 없으면 null(= 필터 없음)이다.
   *
   * 조상을 같이 담는 게 요점이다. 매칭 행만 남기면 계층이 사라져 "어디 있는 건지"를 못 답한다 —
   * 그건 검색이 아니라 목록이다.
   */
  const searchMatches = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return null
    const keep = new Set<NodeId>()
    const hits = new Set<NodeId>()
    for (const node of Object.values(document.nodes)) {
      if (!node.name.toLowerCase().includes(needle)) continue
      hits.add(node.id)
      keep.add(node.id)
      let parentId = node.parentId
      while (parentId && !keep.has(parentId)) {
        keep.add(parentId)
        parentId = document.nodes[parentId]?.parentId ?? null
      }

    }
    return { keep, hits }
  }, [document.nodes, search])

  const rows = useMemo(() => {
    const result: LayerRow[] = []
    const walk = (ids: NodeId[], level: number) => {
      for (const id of ids) {
        const node = document.nodes[id]
        if (!node) continue
        if (searchMatches && !searchMatches.keep.has(id)) continue
        // 검색 중에는 조상을 강제로 펼친다 — 접힌 조상 아래 결과가 숨으면 찾은 게 아니다.
        const expanded = searchMatches ? node.childIds.some((childId) => searchMatches.keep.has(childId)) : expandedIds.has(id)
        const hasChildren = searchMatches
          ? node.childIds.some((childId) => searchMatches.keep.has(childId))
          : node.childIds.length > 0
        result.push({ id, level, hasChildren, expanded, match: searchMatches ? searchMatches.hits.has(id) : false })
        if (expanded && node.childIds.length) walk(node.childIds, level + 1)
      }
    }
    walk(document.rootIds, 1)
    return result
  }, [document.nodes, document.rootIds, expandedIds, searchMatches])

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
    <div className="layers-search">
      <input
        type="search"
        data-testid="layer-search"
        aria-label="Search layers"
        placeholder="레이어 검색"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {searchMatches ? <span className="layers-search-count" data-testid="layer-search-count">
        {`${searchMatches.hits.size}건`}
      </span> : null}
    </div>
    {searchMatches && searchMatches.hits.size === 0
      ? <p className="layers-empty" data-testid="layers-no-match">{`"${search}"에 맞는 레이어가 없다.`}</p>
      : rows.length === 0
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
          className={`layer-row${selected ? ' selected' : ''}${node.visible ? '' : ' hidden-node'}${row.match ? ' layer-match' : ''}`}
          data-layer-match={row.match ? 'hit' : searchMatches ? 'context' : undefined}
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
          <span className="layer-kind" data-layer-kind={node.kind} title={node.kind}>{LAYER_KIND_ICONS[node.kind]}</span>
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
