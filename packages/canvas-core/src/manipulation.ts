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

export function resizeBounds(boundsById: BoundsById, handle: ResizeHandle, screenDelta: CanvasPoint, zoom: number, minimumSize = 16): BoundsById {
  const before = boundsUnion(boundsById)
  if (!before) return {}
  const after = resizeRect(before, handle, screenDelta, zoom, minimumSize)
  const scaleX = after.width / before.width
  const scaleY = after.height / before.height
  return Object.fromEntries(Object.entries(boundsById).map(([id, bounds]) => [id, {
    x: after.x + (bounds.x - before.x) * scaleX,
    y: after.y + (bounds.y - before.y) * scaleY,
    width: Math.max(minimumSize, bounds.width * scaleX),
    height: Math.max(minimumSize, bounds.height * scaleY),
  }]))
}

export function boundsChanged(before: BoundsById, after: BoundsById): boolean {
  const ids = Object.keys(before)
  return ids.length !== Object.keys(after).length || ids.some((id) => {
    const a = before[id]
    const b = after[id]
    return !b || a.x !== b.x || a.y !== b.y || a.width !== b.width || a.height !== b.height
  })
}

export function alignmentGuides(document: CanvasDocument, preview: BoundsById, threshold = 4): AlignmentGuide[] {
  const previewRect = boundsUnion(preview)
  if (!previewRect) return []
  const excluded = new Set(Object.keys(preview))
  const xCandidates = [previewRect.x, previewRect.x + previewRect.width / 2, previewRect.x + previewRect.width]
  const yCandidates = [previewRect.y, previewRect.y + previewRect.height / 2, previewRect.y + previewRect.height]
  let xGuide: AlignmentGuide | undefined
  let yGuide: AlignmentGuide | undefined
  const findMatch = (values: number[], candidates: number[]) => values.find((value) => candidates.some((candidate) => Math.abs(value - candidate) <= threshold))
  for (const node of Object.values(document.nodes)) {
    if (!node.visible || excluded.has(node.id)) continue
    const xs = [node.bounds.x, node.bounds.x + node.bounds.width / 2, node.bounds.x + node.bounds.width]
    const ys = [node.bounds.y, node.bounds.y + node.bounds.height / 2, node.bounds.y + node.bounds.height]
    const xMatch = xGuide ? undefined : findMatch(xs, xCandidates)
    const yMatch = yGuide ? undefined : findMatch(ys, yCandidates)
    if (xMatch !== undefined) xGuide = { axis: 'x', value: xMatch }
    if (yMatch !== undefined) yGuide = { axis: 'y', value: yMatch }
    if (xGuide && yGuide) break
  }
  return [xGuide, yGuide].filter((guide): guide is AlignmentGuide => Boolean(guide))
}

export function previewSelectionBounds(document: CanvasDocument, preview: BoundsById): CanvasRect | null {
  if (!Object.keys(preview).length) return selectionBounds(document)
  return boundsUnion(preview)
}
