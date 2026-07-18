import type { CanvasDocument, CanvasNode, ValidationResult } from './types.js'

const validKinds = new Set(['frame', 'group', 'code-component', 'text', 'image', 'shape', 'instance'])
const validSizing = new Set(['fixed', 'hug', 'fill'])
const validLayout = new Set(['absolute', 'horizontal', 'vertical'])

function validateNodeShape(node: CanvasNode, errors: string[]) {
  if (!node.id) errors.push('node has an empty id')
  if (!validKinds.has(node.kind)) errors.push(`${node.id}: unsupported kind`)
  if (node.bounds.width <= 0 || node.bounds.height <= 0) errors.push(`${node.id}: bounds must be positive`)
  if (!validLayout.has(node.layout.mode)) errors.push(`${node.id}: invalid layout mode`)
  if (!validSizing.has(node.layout.horizontal) || !validSizing.has(node.layout.vertical)) errors.push(`${node.id}: invalid sizing mode`)
  if (!Array.isArray(node.layout.padding) || node.layout.padding.length !== 4) errors.push(`${node.id}: padding must contain four values`)
  if (node.source && (node.source.startLine < 1 || node.source.endLine < node.source.startLine || !node.source.file || !node.source.exportName)) {
    errors.push(`${node.id}: invalid source mapping`)
  }
  if (node.kind === 'code-component' && !node.source) errors.push(`${node.id}: code component requires a source mapping`)
  if (node.kind === 'text' && (!node.textStyle.fontFamily || node.textStyle.fontSize <= 0 || node.textStyle.lineHeight <= 0)) {
    errors.push(`${node.id}: invalid text style`)
  }
  if (node.kind === 'image' && (!node.assetId || !node.alt || node.opacity < 0 || node.opacity > 1)) errors.push(`${node.id}: invalid image properties`)
  if (node.kind === 'shape' && (!node.fill || node.strokeWidth < 0)) errors.push(`${node.id}: invalid shape properties`)
  if ((node.kind === 'text' || node.kind === 'image' || node.kind === 'shape' || node.kind === 'instance') && node.childIds.length > 0) {
    errors.push(`${node.id}: ${node.kind} nodes cannot contain children`)
  }
}

export function validateDocument(document: CanvasDocument): ValidationResult {
  const errors: string[] = []
  if (document.schemaVersion !== 1) errors.push(`unsupported schema version: ${String(document.schemaVersion)}`)
  if (!document.id || !document.name) errors.push('document id and name are required')
  if (!Number.isInteger(document.revision) || document.revision < 0) errors.push('revision must be a non-negative integer')
  if (!document.tokenSetId) errors.push('tokenSetId is required')
  if (!document.metadata.sourceRoot) errors.push('metadata.sourceRoot is required')

  const ids = new Set(Object.keys(document.nodes))
  for (const [key, node] of Object.entries(document.nodes)) {
    if (key !== node.id) errors.push(`${key}: node key does not match id ${node.id}`)
    validateNodeShape(node, errors)
    if (node.parentId && !ids.has(node.parentId)) errors.push(`${node.id}: missing parent ${node.parentId}`)
    for (const childId of node.childIds) {
      const child = document.nodes[childId]
      if (!child) errors.push(`${node.id}: missing child ${childId}`)
      else if (child.parentId !== node.id) errors.push(`${node.id}: child ${childId} points to parent ${String(child.parentId)}`)
    }
    if (new Set(node.childIds).size !== node.childIds.length) errors.push(`${node.id}: duplicate child id`)
    if (node.kind === 'instance') {
      const component = document.nodes[node.componentId]
      if (!component || component.kind !== 'code-component') errors.push(`${node.id}: dangling component ${node.componentId}`)
    }
  }

  for (const rootId of document.rootIds) {
    const root = document.nodes[rootId]
    if (!root) errors.push(`missing root ${rootId}`)
    else if (root.parentId !== null) errors.push(`${rootId}: root must not have a parent`)
  }
  if (new Set(document.rootIds).size !== document.rootIds.length) errors.push('duplicate root id')
  for (const node of Object.values(document.nodes)) {
    if (node.parentId === null && !document.rootIds.includes(node.id)) errors.push(`${node.id}: detached root is not listed`)
  }
  for (const selectedId of document.selection) if (!ids.has(selectedId)) errors.push(`selection references missing node ${selectedId}`)
  if (!(document.viewport.zoom > 0 && Number.isFinite(document.viewport.zoom))) errors.push('viewport zoom must be positive')

  const visiting = new Set<string>()
  const visited = new Set<string>()
  const walk = (id: string) => {
    if (visiting.has(id)) { errors.push(`${id}: hierarchy cycle detected`); return }
    if (visited.has(id)) return
    visiting.add(id)
    for (const child of document.nodes[id]?.childIds ?? []) walk(child)
    visiting.delete(id)
    visited.add(id)
  }
  for (const rootId of document.rootIds) walk(rootId)
  for (const id of ids) if (!visited.has(id)) errors.push(`${id}: unreachable from roots`)

  return { valid: errors.length === 0, errors }
}

export function assertValidDocument(document: CanvasDocument): CanvasDocument {
  const result = validateDocument(document)
  if (!result.valid) throw new Error(`Invalid canvas document:\n${result.errors.join('\n')}`)
  return document
}
