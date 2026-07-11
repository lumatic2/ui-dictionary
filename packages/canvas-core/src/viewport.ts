import type { CanvasDocument, CanvasPoint, CanvasRect, CanvasSize } from './types.js'

export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 4

export interface ViewportState {
  pan: CanvasPoint
  zoom: number
}

export function clampZoom(zoom: number): number {
  return Number.isFinite(zoom) ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) : 1
}

export function zoomAroundPoint(viewport: ViewportState, nextZoom: number, anchor: CanvasPoint): ViewportState {
  const zoom = clampZoom(nextZoom)
  const point = { x: (anchor.x - viewport.pan.x) / viewport.zoom, y: (anchor.y - viewport.pan.y) / viewport.zoom }
  return { pan: { x: anchor.x - point.x * zoom, y: anchor.y - point.y * zoom }, zoom }
}

export function documentContentBounds(document: CanvasDocument): CanvasRect | null {
  const nodes = Object.values(document.nodes)
  if (!nodes.length) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const node of nodes) {
    minX = Math.min(minX, node.bounds.x)
    minY = Math.min(minY, node.bounds.y)
    maxX = Math.max(maxX, node.bounds.x + node.bounds.width)
    maxY = Math.max(maxY, node.bounds.y + node.bounds.height)
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

export function fitViewport(bounds: CanvasRect, size: CanvasSize, padding = 48): ViewportState {
  if (!(bounds.width > 0 && bounds.height > 0)) throw new Error('fit requires positive bounds')
  const zoom = clampZoom(Math.min((size.width - padding * 2) / bounds.width, (size.height - padding * 2) / bounds.height))
  return {
    pan: {
      x: (size.width - bounds.width * zoom) / 2 - bounds.x * zoom,
      y: (size.height - bounds.height * zoom) / 2 - bounds.y * zoom,
    },
    zoom,
  }
}
