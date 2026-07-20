import { selectionBounds } from './interaction.js'
import type { CanvasDocument, CanvasPoint, CanvasRect, NodeId } from './types.js'

export type ResizeHandle = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
export type BoundsById = Record<NodeId, CanvasRect>

export interface AlignmentGuide {
  axis: 'x' | 'y'
  value: number
}

export function captureBounds(document: CanvasDocument, nodeIds = document.selection): BoundsById {
  return Object.fromEntries(nodeIds
    .map((id) => document.nodes[id])
    .filter((node) => node && !node.locked)
    .map((node) => [node.id, structuredClone(node.bounds)]))
}

export function moveBounds(boundsById: BoundsById, screenDelta: CanvasPoint, zoom: number): BoundsById {
  if (!(zoom > 0)) throw new Error('zoom must be positive')
  const dx = screenDelta.x / zoom
  const dy = screenDelta.y / zoom
  return Object.fromEntries(Object.entries(boundsById).map(([id, bounds]) => [id, { ...bounds, x: bounds.x + dx, y: bounds.y + dy }]))
}

export function resizeRect(bounds: CanvasRect, handle: ResizeHandle, screenDelta: CanvasPoint, zoom: number, minimumSize = 16): CanvasRect {
  if (!(zoom > 0)) throw new Error('zoom must be positive')
  const dx = screenDelta.x / zoom
  const dy = screenDelta.y / zoom
  let left = bounds.x
  let top = bounds.y
  let right = bounds.x + bounds.width
  let bottom = bounds.y + bounds.height
  if (handle.includes('w')) left = Math.min(left + dx, right - minimumSize)
  if (handle.includes('e')) right = Math.max(right + dx, left + minimumSize)
  if (handle.includes('n')) top = Math.min(top + dy, bottom - minimumSize)
  if (handle.includes('s')) bottom = Math.max(bottom + dy, top + minimumSize)
  return { x: left, y: top, width: right - left, height: bottom - top }
}

function boundsUnion(boundsById: BoundsById): CanvasRect | null {
  const values = Object.values(boundsById)
  if (!values.length) return null
  const x = Math.min(...values.map((bounds) => bounds.x))
  const y = Math.min(...values.map((bounds) => bounds.y))
  const right = Math.max(...values.map((bounds) => bounds.x + bounds.width))
  const bottom = Math.max(...values.map((bounds) => bounds.y + bounds.height))
  return { x, y, width: right - x, height: bottom - y }
}

/** 묶음의 각 노드를 union 사각형 `before`→`after` 변화에 맞춰 비례 재배치한다. */
function rescaleInto(boundsById: BoundsById, before: CanvasRect, after: CanvasRect, minimumSize: number): BoundsById {
  const scaleX = after.width / before.width
  const scaleY = after.height / before.height
  return Object.fromEntries(Object.entries(boundsById).map(([id, bounds]) => [id, {
    x: after.x + (bounds.x - before.x) * scaleX,
    y: after.y + (bounds.y - before.y) * scaleY,
    width: Math.max(minimumSize, bounds.width * scaleX),
    height: Math.max(minimumSize, bounds.height * scaleY),
  }]))
}

export function resizeBounds(boundsById: BoundsById, handle: ResizeHandle, screenDelta: CanvasPoint, zoom: number, minimumSize = 16): BoundsById {
  const before = boundsUnion(boundsById)
  if (!before) return {}
  return rescaleInto(boundsById, before, resizeRect(before, handle, screenDelta, zoom, minimumSize), minimumSize)
}

export function boundsChanged(before: BoundsById, after: BoundsById): boolean {
  const ids = Object.keys(before)
  return ids.length !== Object.keys(after).length || ids.some((id) => {
    const a = before[id]
    const b = after[id]
    return !b || a.x !== b.x || a.y !== b.y || a.width !== b.width || a.height !== b.height
  })
}

/**
 * 스냅 허용 오차(문서 단위 px).
 *
 * 공식 출처가 없다 — Figma·Penpot 문서 모두 수치를 공개하지 않는다(리서치 확인 실패 항목).
 * **우리가 정한 값**이며, 기존 가이드 표시가 쓰던 값을 그대로 승계한다.
 */
export const SNAP_THRESHOLD = 4

/** 스냅이 이동시킨 양과, 그 근거가 된 가이드. `dx`/`dy`가 0이면 붙을 이웃이 없었다는 뜻이다. */
export interface SnapResult {
  bounds: BoundsById
  guides: AlignmentGuide[]
  offset: CanvasPoint
}

/** 이웃 좌표 하나와 preview 후보 하나가 만난 지점. `value`는 이웃 쪽 값 — 가이드 선이 거기 그려진다. */
interface AxisMatch {
  value: number
  offset: number
}

function bestMatch(neighbourValues: number[], previewValues: number[], threshold: number): AxisMatch | undefined {
  let best: AxisMatch | undefined
  for (const value of neighbourValues) {
    for (const candidate of previewValues) {
      const offset = value - candidate
      if (Math.abs(offset) > threshold) continue
      // 가장 가까운 쌍을 고른다 — 먼저 찾은 쌍을 쓰면 노드 순회 순서가 스냅 결과를 정한다.
      if (!best || Math.abs(offset) < Math.abs(best.offset)) best = { value, offset }
    }
  }
  return best
}

/** union 사각형에서 이번 조작이 **움직이는 모서리**만 고른다. 안 움직이는 변에 스냅하면 요소가 제자리에서 튄다. */
function snapCandidates(rect: CanvasRect, handle: ResizeHandle | undefined): { xs: number[]; ys: number[] } {
  if (!handle) {
    // 이동은 좌·중앙·우 전부가 붙을 수 있다.
    return {
      xs: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
      ys: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
    }
  }
  const xs: number[] = []
  const ys: number[] = []
  if (handle.includes('w')) xs.push(rect.x)
  if (handle.includes('e')) xs.push(rect.x + rect.width)
  if (handle.includes('n')) ys.push(rect.y)
  if (handle.includes('s')) ys.push(rect.y + rect.height)
  return { xs, ys }
}

function neighbourEdges(document: CanvasDocument, excluded: Set<NodeId>) {
  const xs: number[] = []
  const ys: number[] = []
  for (const node of Object.values(document.nodes)) {
    if (!node.visible || excluded.has(node.id)) continue
    xs.push(node.bounds.x, node.bounds.x + node.bounds.width / 2, node.bounds.x + node.bounds.width)
    ys.push(node.bounds.y, node.bounds.y + node.bounds.height / 2, node.bounds.y + node.bounds.height)
  }
  return { xs, ys }
}

/**
 * 스냅한 변을 목표값에 **정확히** 앉힌다.
 *
 * 비례 재배치는 나눗셈이라 500이 499.99999999999994로 나온다. 화면상 차이는 없지만
 * "붙었나?"를 좌표 비교로 묻는 순간 어긋난 것으로 나온다 — 스냅의 존재 이유가 사라진다.
 * 그래서 union의 바깥 변에 닿아 있던 노드만 목표 좌표로 되돌린다.
 */
function pinSnappedEdges(boundsById: BoundsById, target: CanvasRect, handle: ResizeHandle): BoundsById {
  const epsilon = 1e-6
  const right = target.x + target.width
  const bottom = target.y + target.height
  return Object.fromEntries(Object.entries(boundsById).map(([id, rect]) => {
    const pinned = { ...rect }
    if (handle.includes('w') && Math.abs(pinned.x - target.x) < epsilon) { pinned.width += pinned.x - target.x; pinned.x = target.x }
    if (handle.includes('e') && Math.abs(pinned.x + pinned.width - right) < epsilon) pinned.width = right - pinned.x
    if (handle.includes('n') && Math.abs(pinned.y - target.y) < epsilon) { pinned.height += pinned.y - target.y; pinned.y = target.y }
    if (handle.includes('s') && Math.abs(pinned.y + pinned.height - bottom) < epsilon) pinned.height = bottom - pinned.y
    return [id, pinned]
  }))
}

/**
 * 드래그 중 preview 좌표를 이웃 모서리에 **실제로 붙인다.**
 *
 * 가이드 선을 그리는 것과 좌표를 맞추는 것은 다른 일이다. 예전 `alignmentGuides`는 선만 돌려줬고
 * 아무도 그 값으로 좌표를 보정하지 않아, 선이 떠도 커밋된 좌표는 몇 px 어긋나 있었다.
 * 그래서 이 함수는 가이드와 보정된 bounds를 **함께** 돌려준다 — 둘을 갈라두면 다시 어긋난다.
 */
export function snapBounds(
  document: CanvasDocument,
  preview: BoundsById,
  options: { handle?: ResizeHandle; threshold?: number; enabled?: boolean } = {},
): SnapResult {
  const { handle, threshold = SNAP_THRESHOLD, enabled = true } = options
  const none: SnapResult = { bounds: preview, guides: [], offset: { x: 0, y: 0 } }
  const previewRect = boundsUnion(preview)
  if (!previewRect || !enabled) return none

  const candidates = snapCandidates(previewRect, handle)
  const neighbours = neighbourEdges(document, new Set(Object.keys(preview)))
  const x = bestMatch(neighbours.xs, candidates.xs, threshold)
  const y = bestMatch(neighbours.ys, candidates.ys, threshold)
  if (!x && !y) return none

  const offset = { x: x?.offset ?? 0, y: y?.offset ?? 0 }
  const guides: AlignmentGuide[] = []
  if (x) guides.push({ axis: 'x', value: x.value })
  if (y) guides.push({ axis: 'y', value: y.value })

  if (!handle) {
    // 이동: 묶음 전체를 통째로 민다.
    const bounds = Object.fromEntries(Object.entries(preview).map(([id, rect]) => [id, { ...rect, x: rect.x + offset.x, y: rect.y + offset.y }]))
    return { bounds, guides, offset }
  }
  // 리사이즈: 잡은 모서리만 움직인다 — 반대편 변은 그대로 있어야 한다.
  const after = { ...previewRect }
  if (handle.includes('w')) { after.x += offset.x; after.width -= offset.x } else if (handle.includes('e')) after.width += offset.x
  if (handle.includes('n')) { after.y += offset.y; after.height -= offset.y } else if (handle.includes('s')) after.height += offset.y
  if (!(after.width > 0) || !(after.height > 0)) return none
  return { bounds: pinSnappedEdges(rescaleInto(preview, previewRect, after, 1), after, handle), guides, offset }
}

export function alignmentGuides(document: CanvasDocument, preview: BoundsById, threshold = SNAP_THRESHOLD): AlignmentGuide[] {
  return snapBounds(document, preview, { threshold }).guides
}

export function previewSelectionBounds(document: CanvasDocument, preview: BoundsById): CanvasRect | null {
  if (!Object.keys(preview).length) return selectionBounds(document)
  return boundsUnion(preview)
}

/**
 * 포인터 위치로 회전 각도를 구한다.
 *
 * 회전은 델타(이동량)가 아니라 **중심에서 포인터로 향하는 각도**로 정해진다 —
 * 드래그를 시작한 지점이 어디였든 손이 가리키는 방향이 곧 각도여야 손에 붙는다.
 * `startRotation`은 잡기 시작한 순간의 각도라, 핸들을 잡는 위치가 각도를 튀게 하지 않는다.
 */
export function rotationFromPointer(
  center: CanvasPoint,
  pointer: CanvasPoint,
  grab: { pointer: CanvasPoint; rotation: number },
): number {
  const angle = (point: CanvasPoint) => (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI
  return grab.rotation + (angle(pointer) - angle(grab.pointer))
}

/** 바운딩 박스의 중심 — 회전축이다. */
export function rectCenter(bounds: CanvasRect): CanvasPoint {
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }
}
