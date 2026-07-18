import type { CanvasDocument, CanvasRect, NodeId } from './types.js'

export type DropPosition = 'inside' | 'before' | 'after'

export type DropPlan =
  | { valid: true; nodeId: NodeId; parentId: NodeId | null; index: number; bounds?: CanvasRect }
  | { valid: false; reason: string }

function ancestors(document: CanvasDocument, nodeId: NodeId): NodeId[] {
  const result: NodeId[] = []
  let current = document.nodes[nodeId]?.parentId ?? null
  while (current) {
    result.push(current)
    current = document.nodes[current]?.parentId ?? null
  }
  return result
}

function siblingIds(document: CanvasDocument, parentId: NodeId | null): NodeId[] {
  return parentId ? document.nodes[parentId]?.childIds ?? [] : document.rootIds
}

export function planNodeDrop(
  document: CanvasDocument,
  nodeId: NodeId,
  targetId: NodeId,
  position: DropPosition,
  bounds?: CanvasRect,
): DropPlan {
  const node = document.nodes[nodeId]
  const target = document.nodes[targetId]
  if (!node) return { valid: false, reason: `missing node ${nodeId}` }
  if (!target) return { valid: false, reason: `missing target ${targetId}` }
  if (node.locked) return { valid: false, reason: `node ${nodeId} is locked` }
  if (target.locked) return { valid: false, reason: `target ${targetId} is locked` }
  if (nodeId === targetId || ancestors(document, targetId).includes(nodeId)) return { valid: false, reason: 'drop would create a hierarchy cycle' }
  if (ancestors(document, nodeId).some((id) => document.nodes[id]?.kind === 'instance')) return { valid: false, reason: 'cannot move instance-owned structure' }
  if (position === 'inside') {
    if (target.kind === 'instance' || target.kind === 'text' || target.kind === 'image' || target.kind === 'shape') return { valid: false, reason: `cannot drop inside ${target.kind}` }
    if (ancestors(document, targetId).some((id) => document.nodes[id]?.kind === 'instance')) return { valid: false, reason: 'cannot drop inside an instance boundary' }
    return { valid: true, nodeId, parentId: targetId, index: target.childIds.length, bounds: bounds ? structuredClone(bounds) : undefined }
  }
  const parentId = target.parentId
  const siblings = siblingIds(document, parentId).filter((id) => id !== nodeId)
  const targetIndex = siblings.indexOf(targetId)
  if (targetIndex < 0) return { valid: false, reason: 'target is missing from its parent' }
  return { valid: true, nodeId, parentId, index: targetIndex + (position === 'after' ? 1 : 0), bounds: bounds ? structuredClone(bounds) : undefined }
}

export function planSiblingReorder(document: CanvasDocument, nodeId: NodeId, direction: -1 | 1): DropPlan {
  const node = document.nodes[nodeId]
  if (!node) return { valid: false, reason: `missing node ${nodeId}` }
  const siblings = siblingIds(document, node.parentId)
  const index = siblings.indexOf(nodeId)
  const target = siblings[index + direction]
  if (!target) return { valid: false, reason: 'node is already at the sibling boundary' }
  return planNodeDrop(document, nodeId, target, direction === -1 ? 'before' : 'after')
}
