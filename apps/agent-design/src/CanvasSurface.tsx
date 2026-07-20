import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
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
  snapBounds,
  traverseSelection,
  zoomAroundPoint,
  type AlignmentGuide,
  type BoundsById,
  type CanvasDocument,
  type CanvasNode,
  type CanvasOperation,
  type ResizeHandle,
  normalizeRotation,
  rotationFromPointer,
} from '@askewly/canvas-core'
import { EditorPlane } from './EditorPlane'
import type { EditorPlaneFailure } from './editorPlaneRuntime'
import { documentTokens } from './documentTokens'

interface Props {
  document: CanvasDocument
  editorPlaneFailure?: EditorPlaneFailure | null
  onOperation?: (operation: CanvasOperation) => void
}

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
}

function sourceRef(node: CanvasNode) {
  return node.source ? `${node.source.file}:${node.source.startLine}` : undefined
}

/**
 * 노드 표면 스타일 — 색·글꼴은 문서의 토큰 세트에서만 온다.
 *
 * 도형은 `tokenBindings.fill`이 있으면 그것이 이긴다. 컴파일러가 넣는 `node.fill`
 * 리터럴은 토큰이 없는 자유 도형용 폴백으로만 남는다.
 */
function nodeStyle(node: CanvasNode, tokenSetId: string, previewBounds?: CanvasNode['bounds'], previewRotation?: number): React.CSSProperties {
  const bounds = previewBounds ?? node.bounds
  const rotation = previewRotation ?? node.rotation
  const tokens = documentTokens(tokenSetId)

  // 규칙 하나: **바인딩이 있으면 그 바인딩만이 값을 정한다.** 안 풀리면 칠하지 않는다.
  // 다른 경로로 흘러내려 그럴듯한 색을 얻으면 결함이 화면에서 사라진다.
  const fillBinding = node.kind === 'shape' ? node.tokenBindings.fill : undefined
  const backgroundBinding = node.tokenBindings.background
  const colorBinding = node.tokenBindings.color

  let background: string | null = null
  if (fillBinding) background = tokens.resolve(fillBinding)
  else if (node.kind === 'shape') background = node.fill
  else background = tokens.resolveBackground(backgroundBinding)

  const color = colorBinding ? tokens.resolve(colorBinding) : tokens.resolve('text.default')
  const fontFamily = tokens.resolve(node.tokenBindings.fontFamily)

  const style: React.CSSProperties = {
    left: bounds.x,
    top: bounds.y,
    width: bounds.width,
    height: bounds.height,
  }
  // 회전축은 바운딩 박스 중심 — 문서 모델의 정의와 같은 축을 쓴다.
  if (rotation) style.transform = `rotate(${rotation}deg)`
  if (background) style.background = background
  if (color) style.color = color
  if (fontFamily) style.fontFamily = fontFamily

  if (node.kind === 'text') {
    style.fontSize = node.textStyle.fontSize
    style.fontWeight = node.textStyle.fontWeight
    style.lineHeight = `${node.textStyle.lineHeight}px`
    if (!fontFamily) style.fontFamily = node.textStyle.fontFamily
  }

  return style
}

/** 토큰이 해석되지 않은 노드는 미해결로 표시한다 — 그럴듯한 색으로 덮지 않는다. */
function unresolvedBindings(node: CanvasNode, tokenSetId: string): boolean {
  const tokens = documentTokens(tokenSetId)
  if (tokens.source === 'unknown') return true
  const bindings = [node.tokenBindings.background, node.tokenBindings.fill, node.tokenBindings.color, node.tokenBindings.fontFamily]
  return bindings.some((binding) => binding !== undefined && tokens.resolve(binding) === null)
}

interface CanvasNodeElementProps {
  node: CanvasNode
  selected: boolean
  dropTarget: boolean
  primary: boolean
  /** 이 선택이 단일인지 다중인지 — 다중은 외곽선이 굵어지고 개수 배지가 함께 뜬다. */
  selectionScope: 'single' | 'multi'
  tokenSetId: string
  assets: CanvasDocument['assets']
  previewBounds?: CanvasNode['bounds']
  /** 회전 드래그 중인 각도 — 놓기 전까지는 문서를 건드리지 않는다. */
  previewRotation?: number
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
    contentEditable
    suppressContentEditableWarning
    onCompositionStart={() => { composing.current = true }}
    onCompositionEnd={() => { composing.current = false; commitText() }}
    onBlur={() => { if (!composing.current) commitText() }}
  />
}

const CanvasNodeElement = memo(function CanvasNodeElement({ node, selected, dropTarget, primary, selectionScope, tokenSetId, assets, previewBounds, previewRotation, onOperation }: CanvasNodeElementProps) {
  const shared = {
    'data-canvas-id': node.id,
    'data-parent-id': node.parentId ?? '',
    'data-source-ref': sourceRef(node),
    'data-node-kind': node.kind,
    'aria-label': node.name,
    'aria-selected': selected,
    'data-selection-state': selected ? 'selected' : 'idle',
    'data-selection-scope': selectionScope,
    'data-drop-target': dropTarget ? 'active' : 'idle',
    draggable: selected && !node.locked,
    tabIndex: primary ? 0 : -1,
    className: `canvas-node node-${node.kind}`,
    'data-token-unresolved': unresolvedBindings(node, tokenSetId) ? '' : undefined,
    style: nodeStyle(node, tokenSetId, previewBounds, previewRotation),
  }
  if (node.kind === 'text') {
    return <TextNodeElement node={node} shared={shared} onOperation={onOperation} />
  }
  if (node.kind === 'image') {
    const asset = assets?.[node.assetId]
    // 소재를 못 찾으면 빈 상자로 넘기지 않는다 — 무엇이 없는지 화면에 적는다.
    if (!asset) {
      return <div {...shared} role="img" aria-label={node.alt} data-asset-missing="">{`소재 없음: ${node.assetId}`}</div>
    }
    return <img {...shared} alt={node.alt} src={asset.uri} data-asset-id={node.assetId} style={{ ...shared.style, objectFit: node.fit, opacity: node.opacity }} />
  }
  if (node.kind === 'instance') {
    return <button {...shared} type="button">{String(node.overrides.label ?? node.name)}</button>
  }
  if (node.kind === 'code-component') {
    return <article {...shared} role="group">{String(node.props.label ?? node.name)}</article>
  }
  if (node.kind === 'frame') {
    return <section {...shared} role="group" data-layout-mode={node.layout.mode}>{node.name}</section>
  }
  return <div {...shared} role="group" data-layout-mode={node.layout.mode}>{node.name}</div>
})

export function CanvasSurface({ document, editorPlaneFailure = null, onOperation }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const structureDragId = useRef<string | null>(null)
  const [marquee, setMarquee] = useState<ReturnType<typeof normalizeRect> | null>(null)
  const gestureRef = useRef<{
    start: { x: number; y: number }
    before: BoundsById
    kind: 'move' | 'resize' | 'rotate'
    handle?: ResizeHandle
    /** 회전 시작 순간의 상태 — 잡은 위치가 각도를 튀게 하지 않도록 기준으로 삼는다. */
    grab?: { center: { x: number; y: number }; pointer: { x: number; y: number }; rotation: number }
  } | null>(null)
  const [previewBounds, setPreviewBounds] = useState<BoundsById>({})
  const [previewRotation, setPreviewRotation] = useState<number | null>(null)
  const [guides, setGuides] = useState<AlignmentGuide[]>([])
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const spaceHeld = useRef(false)
  const panGesture = useRef<{ start: { x: number; y: number }; panBefore: { x: number; y: number } } | null>(null)
  const [panPreview, setPanPreview] = useState<{ x: number; y: number } | null>(null)
  const selectedIds = useMemo(() => new Set(document.selection), [document.selection])
  const orderedNodes = useMemo(() => paintOrder(document).map((id) => document.nodes[id]), [document])
  const primaryId = document.selection.at(-1)
  const nodeElements = useMemo(() => orderedNodes.map((node) => <CanvasNodeElement key={node.id} node={node} selected={selectedIds.has(node.id)} primary={primaryId === node.id} selectionScope={document.selection.length > 1 ? 'multi' : 'single'} dropTarget={dropTargetId === node.id} tokenSetId={document.tokenSetId} assets={document.assets} previewBounds={previewBounds[node.id]} previewRotation={primaryId === node.id && previewRotation !== null ? previewRotation : undefined} onOperation={onOperation} />), [document.assets, document.tokenSetId, dropTargetId, onOperation, orderedNodes, previewBounds, primaryId, selectedIds])
  const activePan = panPreview ?? document.viewport.pan
  const transform = `translate(${activePan.x}px, ${activePan.y}px) scale(${document.viewport.zoom})`
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
    if (event.nativeEvent.isComposing || isEditableTarget(event.target)) return
    if (event.key === ' ') {
      event.preventDefault()
      spaceHeld.current = true
      return
    }
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

  const beginGesture = useCallback((event: React.PointerEvent, kind: 'move' | 'resize' | 'rotate', handle?: ResizeHandle) => {
    const before = captureBounds(document)
    if (!Object.keys(before).length) return
    event.preventDefault()
    event.stopPropagation()
    let grab: { center: { x: number; y: number }; pointer: { x: number; y: number }; rotation: number } | undefined
    if (kind === 'rotate') {
      const id = document.selection.at(-1)
      const node = id ? document.nodes[id] : undefined
      if (!node) return
      // 회전축을 **화면에 있는 선택 상자**에서 직접 읽는다.
      // 문서 좌표를 zoom·pan으로 환산하면 뷰포트 요소가 창 안에서 밀려 있는 만큼
      // 중심이 어긋난다 — 브라우저 실조작에서 90° 드래그가 8°로 나와 적발됐다.
      const box = event.currentTarget.parentElement?.getBoundingClientRect()
      if (!box) return
      grab = {
        // `left`/`top`을 쓴다 — 일부 DOM 구현의 DOMRect에는 `x`/`y`가 없어 중심이 NaN이 된다.
        center: { x: box.left + box.width / 2, y: box.top + box.height / 2 },
        pointer: { x: event.clientX, y: event.clientY },
        rotation: node.rotation,
      }
      setPreviewRotation(node.rotation)
    }
    gestureRef.current = { start: { x: event.clientX, y: event.clientY }, before, kind, handle, grab }
    setPreviewBounds(before)
    if (event.isTrusted) event.currentTarget.setPointerCapture?.(event.pointerId)
  }, [document])

  const updateGesture = useCallback((event: React.PointerEvent) => {
    const gesture = gestureRef.current
    if (!gesture) return
    if (gesture.kind === 'rotate' && gesture.grab) {
      // 중심·포인터가 둘 다 화면 좌표라 zoom·pan·요소 오프셋이 전부 상쇄된다.
      setPreviewRotation(normalizeRotation(rotationFromPointer(
        gesture.grab.center,
        { x: event.clientX, y: event.clientY },
        { pointer: gesture.grab.pointer, rotation: gesture.grab.rotation },
      )))
      return
    }
    const delta = { x: event.clientX - gesture.start.x, y: event.clientY - gesture.start.y }
    const dragged = gesture.kind === 'move'
      ? moveBounds(gesture.before, delta, document.viewport.zoom)
      : resizeBounds(gesture.before, gesture.handle ?? 'se', delta, document.viewport.zoom)
    // 스냅이 보정한 좌표를 그대로 preview 로 쓴다 — 가이드만 그리고 원래 좌표를 커밋하면
    // 화면의 선과 문서의 값이 어긋난다(EU2 실사에서 발견된 상태가 정확히 그거였다).
    const snapped = snapBounds(document, dragged, { handle: gesture.kind === 'resize' ? gesture.handle ?? 'se' : undefined, enabled: snapEnabled })
    setPreviewBounds(snapped.bounds)
    setGuides(snapped.guides)
  }, [document, snapEnabled])

  const finishGesture = useCallback(() => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    if (gesture.kind === 'rotate') {
      const id = document.selection.at(-1)
      if (id && previewRotation !== null && previewRotation !== document.nodes[id]?.rotation) {
        onOperation?.({ type: 'rotate-nodes', id: `rotate-${performance.now()}`, at: new Date().toISOString(), rotationById: { [id]: previewRotation } })
      }
      setPreviewRotation(null)
      setPreviewBounds({})
      setGuides([])
      return
    }
    if (boundsChanged(gesture.before, previewBounds)) {
      onOperation?.({ type: 'transform-nodes', id: `transform-${performance.now()}`, at: new Date().toISOString(), boundsById: previewBounds })
    }
    setPreviewBounds({})
    setGuides([])
  }, [document, onOperation, previewBounds, previewRotation])

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
    aria-label="AskewlyDesign canvas"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleKeyDown}
    onKeyUp={(event) => { if (event.key === ' ') spaceHeld.current = false }}
    onWheel={(event) => {
      if (event.ctrlKey || event.metaKey) {
        const rect = viewportRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
        const next = zoomAroundPoint(document.viewport, document.viewport.zoom * (event.deltaY < 0 ? 1.1 : 1 / 1.1), { x: event.clientX - rect.left, y: event.clientY - rect.top })
        onOperation?.({ type: 'set-viewport', id: `wheel-zoom-${performance.now()}`, at: new Date().toISOString(), ...next })
        return
      }
      onOperation?.({ type: 'set-viewport', id: `wheel-pan-${performance.now()}`, at: new Date().toISOString(), pan: { x: document.viewport.pan.x - event.deltaX, y: document.viewport.pan.y - event.deltaY }, zoom: document.viewport.zoom })
    }}
    onPointerDown={(event) => {
      if (spaceHeld.current) {
        event.preventDefault()
        panGesture.current = { start: { x: event.clientX, y: event.clientY }, panBefore: { ...document.viewport.pan } }
        setPanPreview({ ...document.viewport.pan })
        if (event.isTrusted) event.currentTarget.setPointerCapture?.(event.pointerId)
        return
      }
      if (event.target !== event.currentTarget) return
      dragStart.current = canvasPoint(event.clientX, event.clientY)
      setMarquee(normalizeRect(dragStart.current, dragStart.current))
      if (event.isTrusted) event.currentTarget.setPointerCapture?.(event.pointerId)
    }}
    onPointerMove={(event) => {
      if (panGesture.current) {
        const gesture = panGesture.current
        setPanPreview({ x: gesture.panBefore.x + event.clientX - gesture.start.x, y: gesture.panBefore.y + event.clientY - gesture.start.y })
        return
      }
      if (gestureRef.current) { updateGesture(event); return }
      if (!dragStart.current) return
      setMarquee(normalizeRect(dragStart.current, canvasPoint(event.clientX, event.clientY)))
    }}
    onPointerUp={(event) => {
      if (panGesture.current) {
        const finalPan = panPreview ?? panGesture.current.panBefore
        panGesture.current = null
        setPanPreview(null)
        onOperation?.({ type: 'set-viewport', id: `pan-${performance.now()}`, at: new Date().toISOString(), pan: finalPan, zoom: document.viewport.zoom })
        return
      }
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
      panGesture.current = null
      setPanPreview(null)
      setPreviewBounds({})
      setGuides([])
      setMarquee(null)
    }}
    onDragStart={(event) => {
      const structureHandle = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-structure-drag-id]') : null
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-canvas-id]') : null
      const id = structureHandle?.dataset.structureDragId ?? target?.dataset.canvasId ?? null
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
    <div className="canvas-toolbar" onPointerDown={(event) => event.stopPropagation()}>
      <label className="canvas-toggle">
        <input
          type="checkbox"
          data-testid="snap-toggle"
          checked={snapEnabled}
          onChange={(event) => setSnapEnabled(event.target.checked)}
        />
        스냅
      </label>
    </div>
    {selection ? <div data-selected-id={document.selection.at(-1)}>
      <EditorPlane
        selection={selection}
        guides={guides.map((guide) => ({ ...guide, value: guide.value * document.viewport.zoom + (guide.axis === 'x' ? document.viewport.pan.x : document.viewport.pan.y) }))}
        failure={editorPlaneFailure}
      />
      <div
        className={`manipulation-selection${document.selection.length === 1 && document.nodes[document.selection[0]]?.kind === 'text' ? ' manipulation-selection-text' : ''}`}
        data-testid="manipulation-selection"
        aria-label="Move selection"
        style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }}
        onPointerDown={(event) => beginGesture(event, 'move')}
      >
        {document.selection.length === 1 ? <button
          type="button"
          className="structure-drag-handle"
          data-testid="structure-drag-handle"
          data-structure-drag-id={document.selection[0]}
          draggable
          aria-label="Reparent selection"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 4h6M5 8h6M5 12h6" /></svg>
        </button> : null}
        {document.selection.length > 1 ? <span className="selection-count" data-testid="selection-count-badge">
          {document.selection.length}개 선택
        </span> : null}
        {document.selection.length === 1 ? <button
          type="button"
          className="rotate-handle"
          data-testid="rotate-handle"
          aria-label="Rotate selection"
          onPointerDown={(event) => beginGesture(event, 'rotate')}
        /> : null}
        {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as ResizeHandle[]).map((handle) => <button
          key={handle}
          type="button"
          // 모서리는 양축, 변은 단축을 바꾼다. 그 역할 차이를 형태로 낸다(EU1).
          className={`resize-handle resize-handle-${handle} resize-handle-${handle.length === 2 ? 'corner' : 'edge'}`}
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
