import type { CanvasDocument, CanvasNode, CanvasRect, NodeId } from './types.js'
import type { BatchOperation, CanvasOperation } from './operations.js'

const layout = { mode: 'absolute' as const, horizontal: 'fixed' as const, vertical: 'fixed' as const, gap: 0, padding: [0, 0, 0, 0] as [number, number, number, number] }

export function nextNodeId(document: CanvasDocument, prefix = 'created'): NodeId {
  let index = 1
  while (document.nodes[`${prefix}-${String(index).padStart(4, '0')}`]) index += 1
  return `${prefix}-${String(index).padStart(4, '0')}`
}

export function createPrimitiveNode(document: CanvasDocument, kind: 'frame' | 'group' | 'text', parentId: NodeId | null, bounds: CanvasRect): CanvasNode {
  const id = nextNodeId(document)
  const base = { id, kind, name: kind[0].toUpperCase() + kind.slice(1), parentId, childIds: [], bounds: { ...bounds }, layout: structuredClone(layout), visible: true, locked: false, tokenBindings: {}, source: null }
  if (kind === 'frame') return { ...base, kind, clipContent: false }
  if (kind === 'text') return { ...base, kind, text: 'Text', textStyle: { fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 400, lineHeight: 24 } }
  return { ...base, kind }
}

function childrenDepthFirst(document: CanvasDocument, id: NodeId): NodeId[] {
  const node = document.nodes[id]
  if (!node) throw new Error(`missing node ${id}`)
  return [id, ...node.childIds.flatMap((child) => childrenDepthFirst(document, child))]
}

function batch(id: string, at: string, operations: Exclude<CanvasOperation, BatchOperation>[]): BatchOperation {
  return { id, at, type: 'batch', operations }
}

export function planDeleteSelection(document: CanvasDocument, at: string): BatchOperation {
  const selected = new Set(document.selection)
  const roots = document.selection.filter((id) => {
    let parent = document.nodes[id]?.parentId ?? null
    while (parent) { if (selected.has(parent)) return false; parent = document.nodes[parent]?.parentId ?? null }
    return true
  })
  const ids = roots.flatMap((id) => childrenDepthFirst(document, id)).reverse()
  if (ids.some((id) => document.nodes[id].locked)) throw new Error('cannot delete locked selection')
  return batch(`delete-${at}`, at, ids.map((nodeId) => ({ id: `delete:${nodeId}:${at}`, at, type: 'delete-node', nodeId })))
}

export function planAlign(document: CanvasDocument, axis: 'left' | 'center-x' | 'right' | 'top' | 'center-y' | 'bottom', at: string): CanvasOperation {
  const nodes = document.selection.map((id) => document.nodes[id])
  if (nodes.length < 2) throw new Error('align requires at least two nodes')
  if (nodes.some((node) => node.locked)) throw new Error('cannot align locked selection')
  const minX = Math.min(...nodes.map((node) => node.bounds.x)); const maxX = Math.max(...nodes.map((node) => node.bounds.x + node.bounds.width))
  const minY = Math.min(...nodes.map((node) => node.bounds.y)); const maxY = Math.max(...nodes.map((node) => node.bounds.y + node.bounds.height))
  const boundsById = Object.fromEntries(nodes.map((node) => {
    const b = { ...node.bounds }
    if (axis === 'left') b.x = minX; if (axis === 'right') b.x = maxX - b.width; if (axis === 'center-x') b.x = (minX + maxX - b.width) / 2
    if (axis === 'top') b.y = minY; if (axis === 'bottom') b.y = maxY - b.height; if (axis === 'center-y') b.y = (minY + maxY - b.height) / 2
    return [node.id, b]
  }))
  return { id: `align-${axis}-${at}`, at, type: 'transform-nodes', boundsById }
}

export function planDistribute(document: CanvasDocument, axis: 'horizontal' | 'vertical', at: string): CanvasOperation {
  const nodes = document.selection.map((id) => document.nodes[id]).sort((a, b) => axis === 'horizontal' ? a.bounds.x - b.bounds.x : a.bounds.y - b.bounds.y)
  if (nodes.length < 3) throw new Error('distribute requires at least three nodes')
  if (nodes.some((node) => node.locked)) throw new Error('cannot distribute locked selection')
  const start = axis === 'horizontal' ? nodes[0].bounds.x : nodes[0].bounds.y
  const end = axis === 'horizontal' ? nodes.at(-1)!.bounds.x + nodes.at(-1)!.bounds.width : nodes.at(-1)!.bounds.y + nodes.at(-1)!.bounds.height
  const occupied = nodes.reduce((sum, node) => sum + (axis === 'horizontal' ? node.bounds.width : node.bounds.height), 0)
  const gap = (end - start - occupied) / (nodes.length - 1); let cursor = start
  const boundsById: Record<NodeId, CanvasRect> = {}
  for (const node of nodes) { boundsById[node.id] = { ...node.bounds, [axis === 'horizontal' ? 'x' : 'y']: cursor }; cursor += (axis === 'horizontal' ? node.bounds.width : node.bounds.height) + gap }
  return { id: `distribute-${axis}-${at}`, at, type: 'transform-nodes', boundsById }
}
