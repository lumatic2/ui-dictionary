import type { CanvasDocument, CanvasNode, CanvasRect, CanvasSize, NodeId } from './types.js'
import type { BatchOperation, CanvasOperation } from './operations.js'

const layout = { mode: 'absolute' as const, horizontal: 'fixed' as const, vertical: 'fixed' as const, gap: 0, padding: [0, 0, 0, 0] as [number, number, number, number] }

export function nextNodeId(document: CanvasDocument, prefix = 'created'): NodeId {
  let index = 1
  while (document.nodes[`${prefix}-${String(index).padStart(4, '0')}`]) index += 1
  return `${prefix}-${String(index).padStart(4, '0')}`
}

export function createPrimitiveNode(document: CanvasDocument, kind: 'frame' | 'group' | 'text', parentId: NodeId | null, bounds: CanvasRect): CanvasNode {
  const id = nextNodeId(document)
  const base = { id, kind, name: kind[0].toUpperCase() + kind.slice(1), parentId, childIds: [], bounds: { ...bounds }, rotation: 0, layout: structuredClone(layout), visible: true, locked: false, tokenBindings: {}, source: null }
  if (kind === 'frame') return { ...base, kind, clipContent: false }
  if (kind === 'text') return { ...base, kind, text: 'Text', textStyle: { fontFamily: 'Geist, sans-serif', fontSize: 16, fontWeight: 400, lineHeight: 24 } }
  return { ...base, kind }
}

export function createInstanceNode(document: CanvasDocument, componentId: NodeId, parentId: NodeId | null, bounds: CanvasRect): CanvasNode {
  const component = document.nodes[componentId]
  if (!component || component.kind !== 'code-component') throw new Error(`missing code component ${componentId}`)
  const id = nextNodeId(document)
  return { id, kind: 'instance', name: component.name, parentId, childIds: [], bounds: { ...bounds }, rotation: 0, layout: structuredClone(layout), visible: true, locked: false, tokenBindings: {}, source: null, componentId, overrides: {} }
}

export function resolveInsertParent(document: CanvasDocument): NodeId | null {
  if (document.selection.length !== 1) return null
  const node = document.nodes[document.selection[0]]
  if (!node || node.locked) return null
  return node.kind === 'frame' || node.kind === 'group' || node.kind === 'code-component' ? node.id : null
}

export function planInsertBounds(document: CanvasDocument, parentId: NodeId | null, size: CanvasSize): CanvasRect {
  if (parentId === null) return { x: 40, y: 40, width: size.width, height: size.height }
  const parent = document.nodes[parentId]
  if (!parent) throw new Error(`missing parent ${parentId}`)
  return { x: parent.bounds.x + 24, y: parent.bounds.y + 24, width: size.width, height: size.height }
}

export function planInsert(document: CanvasDocument, node: CanvasNode, at: string): BatchOperation {
  if (node.parentId && !document.nodes[node.parentId]) throw new Error(`missing parent ${node.parentId}`)
  const index = node.parentId === null ? document.rootIds.length : document.nodes[node.parentId]!.childIds.length
  return batch(`insert-${node.id}-${at}`, at, [
    { id: `insert:create:${node.id}:${at}`, at, type: 'create-node', node: structuredClone(node), parentId: node.parentId, index },
    { id: `insert:select:${node.id}:${at}`, at, type: 'select-nodes', nodeIds: [node.id] },
  ])
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

export function planDuplicateSelection(document: CanvasDocument, at: string, offset = 16): BatchOperation {
  const selected = new Set(document.selection)
  const roots = document.selection.filter((id) => {
    let parent = document.nodes[id]?.parentId ?? null
    while (parent) { if (selected.has(parent)) return false; parent = document.nodes[parent]?.parentId ?? null }
    return true
  })
  if (!roots.length) throw new Error('duplicate requires a selection')
  const used = new Set(Object.keys(document.nodes))
  let counter = 1
  const nextId = (): NodeId => {
    let id = `created-${String(counter).padStart(4, '0')}`
    while (used.has(id)) { counter += 1; id = `created-${String(counter).padStart(4, '0')}` }
    used.add(id)
    return id
  }
  const siblingsOf = (parentId: NodeId | null) => parentId === null ? document.rootIds : document.nodes[parentId]!.childIds
  const operations: Exclude<CanvasOperation, BatchOperation>[] = []
  const duplicateRootIds: NodeId[] = []
  for (const rootId of roots) {
    const idMap = new Map<NodeId, NodeId>()
    const subtree = childrenDepthFirst(document, rootId)
    for (const id of subtree) idMap.set(id, nextId())
    for (const id of subtree) {
      const original = document.nodes[id]
      const clone = structuredClone(original)
      clone.id = idMap.get(id)!
      clone.childIds = []
      const isRoot = id === rootId
      clone.parentId = isRoot ? original.parentId : idMap.get(original.parentId!)!
      if (isRoot) clone.bounds = { ...clone.bounds, x: clone.bounds.x + offset, y: clone.bounds.y + offset }
      const index = isRoot
        ? siblingsOf(original.parentId).indexOf(id) + 1
        : siblingsOf(original.parentId).indexOf(id)
      operations.push({ id: `duplicate:${id}:${at}`, at, type: 'create-node', node: clone, parentId: clone.parentId, index })
    }
    duplicateRootIds.push(idMap.get(rootId)!)
  }
  operations.push({ id: `duplicate:select:${at}`, at, type: 'select-nodes', nodeIds: duplicateRootIds })
  return batch(`duplicate-${at}`, at, operations)
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

export function planTidyGap(document: CanvasDocument, axis: 'horizontal' | 'vertical', gap: number, at: string): CanvasOperation {
  if (!(Number.isFinite(gap) && gap >= 0)) throw new Error('tidy gap must be a non-negative number')
  const nodes = document.selection.map((id) => document.nodes[id]).sort((a, b) => axis === 'horizontal' ? a.bounds.x - b.bounds.x : a.bounds.y - b.bounds.y)
  if (nodes.length < 2) throw new Error('tidy requires at least two nodes')
  if (nodes.some((node) => node.locked)) throw new Error('cannot tidy locked selection')
  let cursor = axis === 'horizontal' ? nodes[0].bounds.x : nodes[0].bounds.y
  const boundsById: Record<NodeId, CanvasRect> = {}
  for (const node of nodes) { boundsById[node.id] = { ...node.bounds, [axis === 'horizontal' ? 'x' : 'y']: cursor }; cursor += (axis === 'horizontal' ? node.bounds.width : node.bounds.height) + gap }
  return { id: `tidy-${axis}-${at}`, at, type: 'transform-nodes', boundsById }
}

export function planGroupSelection(document: CanvasDocument, at: string): BatchOperation {
  const nodes = document.selection.map((id) => {
    const node = document.nodes[id]
    if (!node) throw new Error(`missing node ${id}`)
    return node
  })
  if (nodes.length < 2) throw new Error('group requires at least two nodes')
  if (nodes.some((node) => node.locked)) throw new Error('cannot group locked selection')
  const parentId = nodes[0].parentId
  if (nodes.some((node) => node.parentId !== parentId)) throw new Error('group requires siblings under one parent')
  const siblings = parentId === null ? document.rootIds : document.nodes[parentId]!.childIds
  const ordered = [...nodes].sort((a, b) => siblings.indexOf(a.id) - siblings.indexOf(b.id))
  const bounds = {
    x: Math.min(...nodes.map((node) => node.bounds.x)),
    y: Math.min(...nodes.map((node) => node.bounds.y)),
    width: Math.max(...nodes.map((node) => node.bounds.x + node.bounds.width)) - Math.min(...nodes.map((node) => node.bounds.x)),
    height: Math.max(...nodes.map((node) => node.bounds.y + node.bounds.height)) - Math.min(...nodes.map((node) => node.bounds.y)),
  }
  const group: CanvasNode = { id: nextNodeId(document, 'grouped'), kind: 'group', name: 'Group', parentId, childIds: [], bounds, rotation: 0, layout: structuredClone(layout), visible: true, locked: false, tokenBindings: {}, source: null }
  return batch(`group-${at}`, at, [
    { id: `group:create:${at}`, at, type: 'create-node', node: group, parentId, index: Math.min(...ordered.map((node) => siblings.indexOf(node.id))) },
    ...ordered.map((node, index) => ({ id: `group:reparent:${node.id}:${at}`, at, type: 'reparent-node' as const, nodeId: node.id, parentId: group.id, index })),
    { id: `group:select:${at}`, at, type: 'select-nodes' as const, nodeIds: [group.id] },
  ])
}

export function planUngroup(document: CanvasDocument, at: string): BatchOperation {
  if (document.selection.length !== 1) throw new Error('ungroup requires exactly one selected group')
  const group = document.nodes[document.selection[0]]
  if (!group || group.kind !== 'group') throw new Error('ungroup requires a group node')
  if (group.locked) throw new Error('cannot ungroup locked node')
  if (!group.childIds.length) throw new Error('cannot ungroup an empty group')
  if (group.childIds.some((id) => document.nodes[id]?.locked)) throw new Error('cannot ungroup locked children')
  const siblings = group.parentId === null ? document.rootIds : document.nodes[group.parentId]!.childIds
  const groupIndex = siblings.indexOf(group.id)
  const children = [...group.childIds]
  return batch(`ungroup-${group.id}-${at}`, at, [
    ...children.map((childId, index) => ({ id: `ungroup:reparent:${childId}:${at}`, at, type: 'reparent-node' as const, nodeId: childId, parentId: group.parentId, index: groupIndex + 1 + index })),
    { id: `ungroup:delete:${group.id}:${at}`, at, type: 'delete-node' as const, nodeId: group.id },
    { id: `ungroup:select:${at}`, at, type: 'select-nodes' as const, nodeIds: children },
  ])
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
