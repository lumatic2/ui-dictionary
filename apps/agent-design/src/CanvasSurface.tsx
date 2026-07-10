import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  alignmentGuides,
  boundsChanged,
  captureBounds,
  marqueeHitTest,
  moveBounds,
  normalizeRect,
  paintOrder,
  planNodeDrop,
  planSiblingReorder,
  previewSelectionBounds,
  reduceSelection,
  resizeBounds,
  selectionBounds,
  traverseSelection,
  type AlignmentGuide,
  type BoundsById,
  type CanvasDocument,
  type CanvasNode,
  type CanvasOperation,
  type ResizeHandle,
} from '@askewly/canvas-core'
import { EditorPlane } from './EditorPlane'
import type { EditorPlaneFailure } from './editorPlaneRuntime'

interface Props {
  document: CanvasDocument
  editorPlaneFailure?: EditorPlaneFailure | null
  onOperation?: (operation: CanvasOperation) => void
}

function sourceRef(node: CanvasNode) {
  return node.source ? `${node.source.file}:${node.source.startLine}` : undefined
}

function nodeStyle(node: CanvasNode, previewBounds?: CanvasNode['bounds']): React.CSSProperties {
  const hue = Number.parseInt(node.id.slice(-3), 10) * 37 % 360
  const bounds = previewBounds ?? node.bounds
  return {
    left: bounds.x,
    top: bounds.y,
    width: bounds.width,
    height: bounds.height,
    background: `hsl(${hue} 36% 94%)`,
  }
}

interface CanvasNodeElementProps {
  node: CanvasNode
  selected: boolean
  dropTarget: boolean
  previewBounds?: CanvasNode['bounds']
  onOperation?: (operation: CanvasOperation) => void
}

function TextNodeElement({ node, shared, onOperation }: { node: Extract<CanvasNode, { kind: 'text' }>; shared: Record<string, unknown>; onOperation?: (operation: CanvasOperation) => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  const composing = useRef(false)
  const lastCommitted = useRef(node.text)
  useEffect(() => {
    lastCommitted.current = node.text
    if (!composing.current && ref.current && ref.current.textContent !== node.text) ref.current.textContent = node.text
  }, [node.text])
  const commitText = () => {
    const text = ref.current?.textContent ?? ''
    if (text === lastCommitted.current) return
    lastCommitted.current = text
    onOperation?.({ type: 'update-text', id: `text-${performance.now()}`, at: new Date().toISOString(), nodeId: node.id, text })
  }
  return <span
    {...shared}
    ref={ref}
    role="textbox"
    tabIndex={0}
    contentEditable
    suppressContentEditableWarning
    onCompositionStart={() => { composing.current = true }}
    onCompositionEnd={() => { composing.current = false; commitText() }}
    onBlur={() => { if (!composing.current) commitText() }}
  />
}

function CanvasNodeElement({ node, selected, dropTarget, previewBounds, onOperation }: CanvasNodeElementProps) {
  const shared = {
    'data-canvas-id': node.id,
    'data-parent-id': node.parentId ?? '',
    'data-source-ref': sourceRef(node),
    'data-node-kind': node.kind,
    'aria-label': node.name,
    'aria-selected': selected,
    'data-selection-state': selected ? 'selected' : 'idle',
    'data-drop-target': dropTarget ? 'active' : 'idle',
    draggable: selected && !node.locked,
    className: `canvas-node node-${node.kind}`,
    style: nodeStyle(node, previewBounds),
  }
  if (node.kind === 'text') {
    return <TextNodeElement node={node} shared={shared} onOperation={onOperation} />
  }
  if (node.kind === 'instance') {
    return <button {...shared} type="button">{String(node.overrides.label ?? node.name)}</button>
  }
  if (node.kind === 'code-component') {
    return <article {...shared} role="group" tabIndex={0}>{String(node.props.label ?? node.name)}</article>
  }
  if (node.kind === 'frame') {
    return <section {...shared} role="group" data-layout-mode={node.layout.mode}>{node.name}</section>
  }
  return <div {...shared} role="group" data-layout-mode={node.layout.mode}>{node.name}</div>
}

export function CanvasSurface({ document, editorPlaneFailure = null, onOperation }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const structureDragId = useRef<string | null>(null)
  const [marquee, setMarquee] = useState<ReturnType<typeof normalizeRect> | null>(null)
  const gestureRef = useRef<{ start: { x: number; y: number }; before: BoundsById; kind: 'move' | 'resize'; handle?: ResizeHandle } | null>(null)
  const [previewBounds, setPreviewBounds] = useState<BoundsById>({})
  const [guides, setGuides] = useState<AlignmentGuide[]>([])
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const selectedIds = useMemo(() => new Set(document.selection), [document.selection])
  const orderedNodes = useMemo(() => paintOrder(document).map((id) => document.nodes[id]), [document])
  const nodeElements = useMemo(() => orderedNodes.map((node) => <CanvasNodeElement key={node.id} node={node} selected={selectedIds.has(node.id)} dropTarget={dropTargetId === node.id} previewBounds={previewBounds[node.id]} onOperation={onOperation} />), [dropTargetId, onOperation, orderedNodes, previewBounds, selectedIds])
  const transform = `translate(${document.viewport.pan.x}px, ${document.viewport.pan.y}px) scale(${document.viewport.zoom})`
  const canonicalSelection = Object.keys(previewBounds).length ? previewSelectionBounds(document, previewBounds) : selectionBounds(document)
  const selection = canonicalSelection ? {
    x: canonicalSelection.x * document.viewport.zoom + document.viewport.pan.x,
    y: canonicalSelection.y * document.viewport.zoom + document.viewport.pan.y,
    width: canonicalSelection.width * document.viewport.zoom,
    height: canonicalSelection.height * document.viewport.zoom,
  } : null

  const commitSelection = useCallback((nodeIds: string[]) => {
    onOperation?.({ type: 'select-nodes', id: `select-${performance.now()}`, at: new Date().toISOString(), nodeIds })
  }, [onOperation])

  const canvasPoint = useCallback((clientX: number, clientY: number) => {
    const rect = viewportRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
    return {
      x: (clientX - rect.left - document.viewport.pan.x) / document.viewport.zoom,
      y: (clientY - rect.top - document.viewport.pan.y) / document.viewport.zoom,
    }
  }, [document.viewport])

  const handleClick = useCallback((event: React.MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-canvas-id]') : null
    if (!target) return
    const id = target.dataset.canvasId
    if (!id) return
    commitSelection(reduceSelection(document.selection, [id], event.shiftKey ? 'toggle' : 'replace'))
  }, [commitSelection, document.selection])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && gestureRef.current) {
      event.preventDefault()
      gestureRef.current = null
      setPreviewBounds({})
      setGuides([])
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      commitSelection([])
      viewportRef.current?.focus()
      return
    }
    if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault()
      const selected = document.selection.at(-1)
      if (!selected) return
      const plan = planSiblingReorder(document, selected, event.key === 'ArrowUp' ? -1 : 1)
      if (plan.valid) onOperation?.({ type: 'reparent-node', id: `reorder-${performance.now()}`, at: new Date().toISOString(), ...plan })
      return
    }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = traverseSelection(document, event.key === 'ArrowRight' ? 1 : -1)
    if (next) commitSelection([next])
  }, [commitSelection, document, onOperation])

  const beginGesture = useCallback((event: React.PointerEvent, kind: 'move' | 'resize', handle?: ResizeHandle) => {
    const before = captureBounds(document)
    if (!Object.keys(before).length) return
    event.preventDefault()
    event.stopPropagation()
    gestureRef.current = { start: { x: event.clientX, y: event.clientY }, before, kind, handle }
    setPreviewBounds(before)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }, [document])

  const updateGesture = useCallback((event: React.PointerEvent) => {
    const gesture = gestureRef.current
    if (!gesture) return
    const delta = { x: event.clientX - gesture.start.x, y: event.clientY - gesture.start.y }
    const next = gesture.kind === 'move'
      ? moveBounds(gesture.before, delta, document.viewport.zoom)
      : resizeBounds(gesture.before, gesture.handle ?? 'se', delta, document.viewport.zoom)
    setPreviewBounds(next)
    setGuides(alignmentGuides(document, next))
  }, [document])

  const finishGesture = useCallback(() => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    if (boundsChanged(gesture.before, previewBounds)) {
      onOperation?.({ type: 'transform-nodes', id: `transform-${performance.now()}`, at: new Date().toISOString(), boundsById: previewBounds })
    }
    setPreviewBounds({})
    setGuides([])
  }, [onOperation, previewBounds])

  useEffect(() => {
    const primary = document.selection.at(-1)
    if (!primary) return
    const escapeSelector = globalThis.CSS?.escape ?? ((value: string) => value.replace(/["\\]/g, '\\$&'))
    viewportRef.current?.querySelector<HTMLElement>(`[data-canvas-id="${escapeSelector(primary)}"]`)?.focus({ preventScroll: true })
  }, [document.selection])

  return <div
    ref={viewportRef}
    className="canvas-viewport"
    data-testid="canvas-viewport"
    role="application"
    aria-label="Agent Design canvas"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleKeyDown}
    onPointerDown={(event) => {
      if (event.target !== event.currentTarget) return
      dragStart.current = canvasPoint(event.clientX, event.clientY)
      setMarquee(normalizeRect(dragStart.current, dragStart.current))
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }}
    onPointerMove={(event) => {
      if (gestureRef.current) { updateGesture(event); return }
      if (!dragStart.current) return
      setMarquee(normalizeRect(dragStart.current, canvasPoint(event.clientX, event.clientY)))
    }}
    onPointerUp={(event) => {
      if (gestureRef.current) { finishGesture(); return }
      if (!dragStart.current) return
      const rect = normalizeRect(dragStart.current, canvasPoint(event.clientX, event.clientY))
      const hits = rect.width < 2 && rect.height < 2 ? [] : marqueeHitTest(document, rect)
      commitSelection(reduceSelection(document.selection, hits, event.shiftKey ? 'add' : 'replace'))
      dragStart.current = null
      setMarquee(null)
    }}
    onPointerCancel={() => {
      gestureRef.current = null
      dragStart.current = null
      setPreviewBounds({})
      setGuides([])
      setMarquee(null)
    }}
    onDragStart={(event) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-canvas-id]') : null
      const id = target?.dataset.canvasId ?? null
      if (!id || !document.selection.includes(id)) { event.preventDefault(); return }
      structureDragId.current = id
      event.dataTransfer.setData('application/x-askewly-canvas-node', id)
      event.dataTransfer.effectAllowed = 'move'
    }}
    onDragOver={(event) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-canvas-id]') : null
      const nodeId = structureDragId.current
      const targetId = target?.dataset.canvasId
      if (!nodeId || !targetId) return
      const plan = planNodeDrop(document, nodeId, targetId, 'inside')
      if (!plan.valid) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setDropTargetId(targetId)
    }}
    onDragLeave={(event) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
      setDropTargetId(null)
    }}
    onDrop={(event) => {
      event.preventDefault()
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-canvas-id]') : null
      const nodeId = structureDragId.current ?? event.dataTransfer.getData('application/x-askewly-canvas-node')
      const targetId = target?.dataset.canvasId
      if (nodeId && targetId) {
        const plan = planNodeDrop(document, nodeId, targetId, 'inside', document.nodes[nodeId]?.bounds)
        if (plan.valid) onOperation?.({ type: 'reparent-node', id: `drop-${performance.now()}`, at: new Date().toISOString(), ...plan })
      }
      structureDragId.current = null
      setDropTargetId(null)
    }}
    onDragEnd={() => {
      structureDragId.current = null
      setDropTargetId(null)
    }}
  >
    <div className="canvas-content" data-testid="canvas-content" style={{ transform }}>
      {nodeElements}
    </div>
    {selection ? <div data-selected-id={document.selection.at(-1)}>
      <EditorPlane
        selection={selection}
        guides={guides.map((guide) => ({ ...guide, value: guide.value * document.viewport.zoom + (guide.axis === 'x' ? document.viewport.pan.x : document.viewport.pan.y) }))}
        failure={editorPlaneFailure}
      />
      <div
        className="manipulation-selection"
        data-testid="manipulation-selection"
        aria-label="Move selection"
        style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }}
        onPointerDown={(event) => beginGesture(event, 'move')}
      >
        {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as ResizeHandle[]).map((handle) => <button
          key={handle}
          type="button"
          className={`resize-handle resize-handle-${handle}`}
          data-testid={`resize-${handle}`}
          aria-label={`Resize ${handle}`}
          onPointerDown={(event) => beginGesture(event, 'resize', handle)}
        />)}
      </div>
    </div> : null}
    {marquee ? <div className="selection-marquee" data-testid="selection-marquee" style={{
      left: marquee.x * document.viewport.zoom + document.viewport.pan.x,
      top: marquee.y * document.viewport.zoom + document.viewport.pan.y,
      width: marquee.width * document.viewport.zoom,
      height: marquee.height * document.viewport.zoom,
    }} /> : null}
  </div>
}
