import type { CanvasDocument, CanvasNode, CanvasRect, NodeId } from './types.js'
import { applyNodeProperty, readNodeProperty, validateTokenMode, type NodePropertyEdit } from './properties.js'
import { assertValidDocument } from './validation.js'

interface OperationBase {
  id: string
  at: string
}

export interface CreateNodeOperation extends OperationBase {
  type: 'create-node'
  node: CanvasNode
  parentId: NodeId | null
  index: number
}

export interface DeleteNodeOperation extends OperationBase {
  type: 'delete-node'
  nodeId: NodeId
}

export interface UpdateNodeOperation extends OperationBase {
  type: 'update-node'
  nodeId: NodeId
  patch: Partial<Pick<CanvasNode, 'name' | 'bounds' | 'visible' | 'locked' | 'tokenBindings'>>
}

export interface TransformNodesOperation extends OperationBase {
  type: 'transform-nodes'
  boundsById: Record<NodeId, CanvasRect>
}

/** 회전은 bounds를 바꾸지 않는다 — 각도만 바뀌므로 transform-nodes와 별개 연산이다. */
export interface RotateNodesOperation extends OperationBase {
  type: 'rotate-nodes'
  rotationById: Record<NodeId, number>
}

export interface SetNodePropertyOperation extends OperationBase, NodePropertyEdit {
  type: 'set-node-property'
}

export interface UpdateTextOperation extends OperationBase {
  type: 'update-text'
  nodeId: NodeId
  text: string
}

export interface SetTokenModeOperation extends OperationBase {
  type: 'set-token-mode'
  tokenSetId: string
}

export interface ReparentNodeOperation extends OperationBase {
  type: 'reparent-node'
  nodeId: NodeId
  parentId: NodeId | null
  index: number
  bounds?: CanvasRect
}

export interface ReorderNodeOperation extends OperationBase {
  type: 'reorder-node'
  nodeId: NodeId
  index: number
}

export interface SelectNodesOperation extends OperationBase {
  type: 'select-nodes'
  nodeIds: NodeId[]
}

export interface SetViewportOperation extends OperationBase {
  type: 'set-viewport'
  pan: { x: number; y: number }
  zoom: number
}

export interface BatchOperation extends OperationBase {
  type: 'batch'
  operations: Exclude<CanvasOperation, BatchOperation>[]
}

export type CanvasOperation =
  | CreateNodeOperation
  | DeleteNodeOperation
  | UpdateNodeOperation
  | TransformNodesOperation
  | RotateNodesOperation
  | SetNodePropertyOperation
  | UpdateTextOperation
  | SetTokenModeOperation
  | ReparentNodeOperation
  | ReorderNodeOperation
  | SelectNodesOperation
  | SetViewportOperation
  | BatchOperation

/** 각도를 [0, 360)으로 접는다 — 370°와 10°가 다른 문서가 되지 않게. */
export function normalizeRotation(degrees: number): number {
  const wrapped = degrees % 360
  return Object.is(wrapped, -0) ? 0 : wrapped < 0 ? wrapped + 360 : wrapped
}

function insertAt<T>(items: T[], value: T, index: number) {
  items.splice(Math.max(0, Math.min(index, items.length)), 0, value)
}

function siblings(document: CanvasDocument, parentId: NodeId | null): NodeId[] {
  if (parentId === null) return document.rootIds
  const parent = document.nodes[parentId]
  if (!parent) throw new Error(`missing parent ${parentId}`)
  return parent.childIds
}

function removeFromParent(document: CanvasDocument, node: CanvasNode) {
  const list = siblings(document, node.parentId)
  const index = list.indexOf(node.id)
  if (index < 0) throw new Error(`${node.id} is missing from its parent list`)
  list.splice(index, 1)
  return index
}

function hasAncestor(document: CanvasDocument, nodeId: NodeId, ancestorId: NodeId): boolean {
  let parentId = document.nodes[nodeId]?.parentId ?? null
  while (parentId) {
    if (parentId === ancestorId) return true
    parentId = document.nodes[parentId]?.parentId ?? null
  }
  return false
}

function copyPatch(patch: UpdateNodeOperation['patch']): UpdateNodeOperation['patch'] {
  return structuredClone(patch)
}

function mutateOperation(next: CanvasDocument, operation: CanvasOperation) {
  const revisionBefore = next.revision
  switch (operation.type) {
    case 'batch':
      if (!operation.operations.length) throw new Error('batch requires at least one operation')
      for (const child of operation.operations) mutateOperation(next, child)
      next.revision = revisionBefore
      break
    case 'create-node': {
      if (next.nodes[operation.node.id]) throw new Error(`node already exists: ${operation.node.id}`)
      const node = structuredClone(operation.node)
      if (node.parentId !== operation.parentId) throw new Error('create-node parent does not match node.parentId')
      next.nodes[node.id] = node
      insertAt(siblings(next, operation.parentId), node.id, operation.index)
      break
    }
    case 'delete-node': {
      const node = next.nodes[operation.nodeId]
      if (!node) throw new Error(`missing node ${operation.nodeId}`)
      if (node.childIds.length) throw new Error(`cannot delete non-leaf node ${node.id}`)
      removeFromParent(next, node)
      delete next.nodes[node.id]
      next.selection = next.selection.filter((id) => id !== node.id)
      break
    }
    case 'update-node': {
      const node = next.nodes[operation.nodeId]
      if (!node) throw new Error(`missing node ${operation.nodeId}`)
      Object.assign(node, copyPatch(operation.patch))
      break
    }
    case 'transform-nodes': {
      const entries = Object.entries(operation.boundsById)
      if (!entries.length) throw new Error('transform-nodes requires at least one node')
      for (const [id, bounds] of entries) {
        const node = next.nodes[id]
        if (!node) throw new Error(`missing node ${id}`)
        if (node.locked) throw new Error(`cannot transform locked node ${id}`)
        node.bounds = structuredClone(bounds)
      }
      break
    }
    case 'rotate-nodes': {
      const entries = Object.entries(operation.rotationById)
      if (!entries.length) throw new Error('rotate-nodes requires at least one node')
      for (const [id, rotation] of entries) {
        const node = next.nodes[id]
        if (!node) throw new Error(`missing node ${id}`)
        if (node.locked) throw new Error(`cannot rotate locked node ${id}`)
        if (!Number.isFinite(rotation)) throw new Error(`rotation must be finite for ${id}`)
        node.rotation = normalizeRotation(rotation)
      }
      break
    }
    case 'set-node-property':
      applyNodeProperty(next, operation)
      break
    case 'update-text': {
      const node = next.nodes[operation.nodeId]
      if (!node) throw new Error(`missing node ${operation.nodeId}`)
      if (node.kind !== 'text') throw new Error('update-text requires a text node')
      node.text = operation.text
      break
    }
    case 'set-token-mode':
      if (!validateTokenMode(operation.tokenSetId)) throw new Error(`invalid token mode ${operation.tokenSetId}`)
      next.tokenSetId = operation.tokenSetId
      break
    case 'reparent-node': {
      const node = next.nodes[operation.nodeId]
      if (!node) throw new Error(`missing node ${operation.nodeId}`)
      if (node.locked) throw new Error(`cannot reparent locked node ${node.id}`)
      if (operation.parentId === node.id) throw new Error('node cannot parent itself')
      if (operation.parentId) {
        const parent = next.nodes[operation.parentId]
        if (!parent) throw new Error(`missing parent ${operation.parentId}`)
        if (parent.locked) throw new Error(`cannot reparent into locked node ${parent.id}`)
        if (parent.kind === 'instance' || parent.kind === 'text' || parent.kind === 'image' || parent.kind === 'shape') throw new Error(`cannot reparent into ${parent.kind} node ${parent.id}`)
        if (hasAncestor(next, parent.id, node.id)) throw new Error(`cannot reparent ${node.id} into its descendant ${parent.id}`)
      }
      removeFromParent(next, node)
      node.parentId = operation.parentId
      if (operation.bounds) node.bounds = structuredClone(operation.bounds)
      insertAt(siblings(next, operation.parentId), node.id, operation.index)
      break
    }
    case 'reorder-node': {
      const node = next.nodes[operation.nodeId]
      if (!node) throw new Error(`missing node ${operation.nodeId}`)
      if (node.locked) throw new Error(`cannot reorder locked node ${node.id}`)
      const list = siblings(next, node.parentId)
      const from = list.indexOf(node.id)
      if (from < 0) throw new Error(`${node.id} is missing from its sibling list`)
      list.splice(from, 1)
      insertAt(list, node.id, operation.index)
      break
    }
    case 'select-nodes':
      next.selection = [...new Set(operation.nodeIds)]
      break
    case 'set-viewport':
      next.viewport = { pan: structuredClone(operation.pan), zoom: operation.zoom }
      break
  }
  next.revision += 1
  next.metadata.updatedAt = operation.at
}

export function applyOperation(document: CanvasDocument, operation: CanvasOperation): CanvasDocument {
  if (operation.type === 'select-nodes') {
    const nodeIds = [...new Set(operation.nodeIds)]
    for (const id of nodeIds) if (!document.nodes[id]) throw new Error(`selection references missing node ${id}`)
    return { ...document, selection: nodeIds, revision: document.revision + 1, metadata: { ...document.metadata, updatedAt: operation.at } }
  }
  if (operation.type === 'set-viewport') {
    if (!(operation.zoom > 0 && Number.isFinite(operation.zoom))) throw new Error('viewport zoom must be positive')
    return { ...document, viewport: { pan: { ...operation.pan }, zoom: operation.zoom }, revision: document.revision + 1, metadata: { ...document.metadata, updatedAt: operation.at } }
  }
  const next = structuredClone(document)
  mutateOperation(next, operation)
  return assertValidDocument(next)
}

export function replayOperations(initial: CanvasDocument, operations: CanvasOperation[]): CanvasDocument {
  const next = structuredClone(initial)
  for (const operation of operations) mutateOperation(next, operation)
  return assertValidDocument(next)
}

export function invertOperation(before: CanvasDocument, operation: CanvasOperation): CanvasOperation {
  const inverseBase = { id: `inverse:${operation.id}`, at: operation.at }
  switch (operation.type) {
    case 'batch': {
      let cursor = structuredClone(before)
      const inverses: Exclude<CanvasOperation, BatchOperation>[] = []
      for (const child of operation.operations) {
        inverses.unshift(invertOperation(cursor, child) as Exclude<CanvasOperation, BatchOperation>)
        cursor = applyOperation(cursor, child)
      }
      return { ...inverseBase, type: 'batch', operations: inverses }
    }
    case 'create-node':
      return { ...inverseBase, type: 'delete-node', nodeId: operation.node.id }
    case 'delete-node': {
      const node = before.nodes[operation.nodeId]
      if (!node) throw new Error(`cannot invert missing node ${operation.nodeId}`)
      return { ...inverseBase, type: 'create-node', node: structuredClone(node), parentId: node.parentId, index: siblings(before, node.parentId).indexOf(node.id) }
    }
    case 'update-node': {
      const node = before.nodes[operation.nodeId]
      if (!node) throw new Error(`cannot invert missing node ${operation.nodeId}`)
      const patch: UpdateNodeOperation['patch'] = {}
      for (const key of Object.keys(operation.patch) as Array<keyof UpdateNodeOperation['patch']>) {
        ;(patch as Record<string, unknown>)[key] = structuredClone(node[key])
      }
      return { ...inverseBase, type: 'update-node', nodeId: node.id, patch }
    }
    case 'transform-nodes': {
      const boundsById: Record<NodeId, CanvasRect> = {}
      for (const id of Object.keys(operation.boundsById)) {
        const node = before.nodes[id]
        if (!node) throw new Error(`cannot invert missing node ${id}`)
        boundsById[id] = structuredClone(node.bounds)
      }
      return { ...inverseBase, type: 'transform-nodes', boundsById }
    }
    case 'rotate-nodes': {
      const rotationById: Record<NodeId, number> = {}
      for (const id of Object.keys(operation.rotationById)) {
        const node = before.nodes[id]
        if (!node) throw new Error(`cannot invert missing node ${id}`)
        rotationById[id] = node.rotation
      }
      return { ...inverseBase, type: 'rotate-nodes', rotationById }
    }
    case 'set-node-property': {
      const node = before.nodes[operation.nodeId]
      if (!node) throw new Error(`cannot invert missing node ${operation.nodeId}`)
      return { ...inverseBase, type: 'set-node-property', nodeId: node.id, scope: operation.scope, key: operation.key, value: readNodeProperty(node, operation.scope, operation.key) }
    }
    case 'update-text': {
      const node = before.nodes[operation.nodeId]
      if (!node || node.kind !== 'text') throw new Error(`cannot invert text node ${operation.nodeId}`)
      return { ...inverseBase, type: 'update-text', nodeId: node.id, text: node.text }
    }
    case 'set-token-mode':
      return { ...inverseBase, type: 'set-token-mode', tokenSetId: before.tokenSetId }
    case 'reparent-node': {
      const node = before.nodes[operation.nodeId]
      if (!node) throw new Error(`cannot invert missing node ${operation.nodeId}`)
      return { ...inverseBase, type: 'reparent-node', nodeId: node.id, parentId: node.parentId, index: siblings(before, node.parentId).indexOf(node.id), bounds: structuredClone(node.bounds) }
    }
    case 'reorder-node': {
      const node = before.nodes[operation.nodeId]
      if (!node) throw new Error(`cannot invert missing node ${operation.nodeId}`)
      return { ...inverseBase, type: 'reorder-node', nodeId: node.id, index: siblings(before, node.parentId).indexOf(node.id) }
    }
    case 'select-nodes':
      return { ...inverseBase, type: 'select-nodes', nodeIds: [...before.selection] }
    case 'set-viewport':
      return { ...inverseBase, type: 'set-viewport', pan: structuredClone(before.viewport.pan), zoom: before.viewport.zoom }
  }
}

export interface CanvasHistory {
  present: CanvasDocument
  past: CanvasDocument[]
  future: CanvasDocument[]
  log: CanvasOperation[]
  futureLog: CanvasOperation[]
}

export function createHistory(document: CanvasDocument): CanvasHistory {
  return { present: structuredClone(document), past: [], future: [], log: [], futureLog: [] }
}

export function commitOperation(history: CanvasHistory, operation: CanvasOperation): CanvasHistory {
  return {
    present: applyOperation(history.present, operation),
    past: [...history.past, history.present],
    future: [],
    log: [...history.log, structuredClone(operation)],
    futureLog: [],
  }
}

export function undo(history: CanvasHistory): CanvasHistory {
  const previous = history.past.at(-1)
  if (!previous) return history
  const operation = history.log.at(-1)
  return { ...history, present: previous, past: history.past.slice(0, -1), future: [history.present, ...history.future], log: history.log.slice(0, -1), futureLog: operation ? [operation, ...history.futureLog] : history.futureLog }
}

export function redo(history: CanvasHistory): CanvasHistory {
  const next = history.future[0]
  if (!next) return history
  const operation = history.futureLog[0]
  return { ...history, present: next, past: [...history.past, history.present], future: history.future.slice(1), log: operation ? [...history.log, operation] : history.log, futureLog: history.futureLog.slice(1) }
}

export function historyFromOperations(initial: CanvasDocument, operations: CanvasOperation[]): CanvasHistory {
  return operations.reduce(commitOperation, createHistory(initial))
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortValue(item)]))
  }
  return value
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortValue(value))
}

export function contentSignature(document: CanvasDocument): string {
  const copy = structuredClone(document)
  copy.revision = 0
  copy.metadata.updatedAt = copy.metadata.createdAt
  return canonicalStringify(copy)
}

export function translateBounds(bounds: CanvasRect, x: number, y: number): CanvasRect {
  return { ...bounds, x, y }
}
