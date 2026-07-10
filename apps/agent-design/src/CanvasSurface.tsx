import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { marqueeHitTest, normalizeRect, reduceSelection, selectionBounds, traverseSelection, type CanvasDocument, type CanvasNode, type CanvasOperation } from '@askewly/canvas-core'
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

function nodeStyle(node: CanvasNode): React.CSSProperties {
  const hue = Number.parseInt(node.id.slice(-3), 10) * 37 % 360
  return {
    left: node.bounds.x,
    top: node.bounds.y,
    width: node.bounds.width,
    height: node.bounds.height,
    background: `hsl(${hue} 36% 94%)`,
  }
}

function CanvasNodeElement({ node, selected }: { node: CanvasNode; selected: boolean }) {
  const shared = {
    'data-canvas-id': node.id,
    'data-parent-id': node.parentId ?? '',
    'data-source-ref': sourceRef(node),
    'data-node-kind': node.kind,
    'aria-label': node.name,
    'aria-selected': selected,
    'data-selection-state': selected ? 'selected' : 'idle',
    className: `canvas-node node-${node.kind}`,
    style: nodeStyle(node),
  }
  if (node.kind === 'text') {
    return <span {...shared} role="textbox" tabIndex={0} contentEditable suppressContentEditableWarning>{node.text}</span>
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
  const [marquee, setMarquee] = useState<ReturnType<typeof normalizeRect> | null>(null)
  const selectedIds = useMemo(() => new Set(document.selection), [document.selection])
  const orderedNodes = useMemo(() => Object.values(document.nodes), [document.nodes])
  const nodeElements = useMemo(() => orderedNodes.map((node) => <CanvasNodeElement key={node.id} node={node} selected={selectedIds.has(node.id)} />), [orderedNodes, selectedIds])
  const transform = `translate(${document.viewport.pan.x}px, ${document.viewport.pan.y}px) scale(${document.viewport.zoom})`
  const canonicalSelection = selectionBounds(document)
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
    if (event.key === 'Escape') {
      event.preventDefault()
      commitSelection([])
      viewportRef.current?.focus()
      return
    }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = traverseSelection(document, event.key === 'ArrowRight' ? 1 : -1)
    if (next) commitSelection([next])
  }, [commitSelection, document])

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
      if (!dragStart.current) return
      setMarquee(normalizeRect(dragStart.current, canvasPoint(event.clientX, event.clientY)))
    }}
    onPointerUp={(event) => {
      if (!dragStart.current) return
      const rect = normalizeRect(dragStart.current, canvasPoint(event.clientX, event.clientY))
      const hits = rect.width < 2 && rect.height < 2 ? [] : marqueeHitTest(document, rect)
      commitSelection(reduceSelection(document.selection, hits, event.shiftKey ? 'add' : 'replace'))
      dragStart.current = null
      setMarquee(null)
    }}
  >
    <div className="canvas-content" data-testid="canvas-content" style={{ transform }}>
      {nodeElements}
    </div>
    {selection ? <div data-selected-id={document.selection.at(-1)}><EditorPlane selection={selection} failure={editorPlaneFailure} /></div> : null}
    {marquee ? <div className="selection-marquee" data-testid="selection-marquee" style={{
      left: marquee.x * document.viewport.zoom + document.viewport.pan.x,
      top: marquee.y * document.viewport.zoom + document.viewport.pan.y,
      width: marquee.width * document.viewport.zoom,
      height: marquee.height * document.viewport.zoom,
    }} /> : null}
  </div>
}
