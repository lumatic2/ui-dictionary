import type { CanvasDocument, CanvasPoint, CanvasRect, NodeId } from './types.js'

export type SelectionIntent = 'replace' | 'toggle' | 'add'

export function paintOrder(document: CanvasDocument): NodeId[] {
  const order: NodeId[] = []
  const visit = (id: NodeId) => {
    const node = document.nodes[id]
    if (!node) return
    order.push(id)
    for (const childId of node.childIds) visit(childId)
  }
  for (const rootId of document.rootIds) visit(rootId)
  return order
}

export function rectContainsPoint(rect: CanvasRect, point: CanvasPoint): boolean {
  return point.x >= rect.x && point.x <= rect.x + rect.width
    && point.y >= rect.y && point.y <= rect.y + rect.height
}

export function rectsIntersect(a: CanvasRect, b: CanvasRect): boolean {
  return a.x <= b.x + b.width && a.x + a.width >= b.x
    && a.y <= b.y + b.height && a.y + a.height >= b.y
}

export function normalizeRect(start: CanvasPoint, end: CanvasPoint): CanvasRect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  }
}

export function hitTest(document: CanvasDocument, point: CanvasPoint): NodeId | null {
  const order = paintOrder(document)
  for (let index = order.length - 1; index >= 0; index -= 1) {
    const node = document.nodes[order[index]]
    if (node.visible && rectContainsPoint(node.bounds, point)) return node.id
  }
  return null
}

export function marqueeHitTest(document: CanvasDocument, rect: CanvasRect): NodeId[] {
  return paintOrder(document).filter((id) => {
    const node = document.nodes[id]
    return node.visible && rectsIntersect(node.bounds, rect)
  })
}

export function reduceSelection(current: NodeId[], targets: NodeId[], intent: SelectionIntent): NodeId[] {
  const uniqueTargets = [...new Set(targets)]
  if (intent === 'replace') return uniqueTargets
  const next = new Set(current)
  if (intent === 'add') {
    for (const id of uniqueTargets) next.add(id)
  } else {
    for (const id of uniqueTargets) next.has(id) ? next.delete(id) : next.add(id)
  }
  return [...next]
}

export function traverseSelection(document: CanvasDocument, direction: 1 | -1): NodeId | null {
  const order = paintOrder(document).filter((id) => document.nodes[id].visible)
  if (!order.length) return null
  const current = document.selection.at(-1)
  const index = current ? order.indexOf(current) : -1
  const next = index < 0
    ? direction === 1 ? 0 : order.length - 1
    : (index + direction + order.length) % order.length
  return order[next]
}

export function selectionBounds(document: CanvasDocument, nodeIds = document.selection): CanvasRect | null {
  const nodes = nodeIds.map((id) => document.nodes[id]).filter((node) => node?.visible)
  if (!nodes.length) return null
  const minX = Math.min(...nodes.map((node) => node.bounds.x))
  const minY = Math.min(...nodes.map((node) => node.bounds.y))
  const maxX = Math.max(...nodes.map((node) => node.bounds.x + node.bounds.width))
  const maxY = Math.max(...nodes.map((node) => node.bounds.y + node.bounds.height))
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}
