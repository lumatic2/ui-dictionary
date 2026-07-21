import type { CanvasDocument, CanvasNode, CodeComponentNode, LayoutConstraints, NodeId } from './types.js'
import { assertValidDocument } from './validation.js'

const createdAt = '2026-07-10T00:00:00.000Z'
const layout = (index: number): LayoutConstraints => ({
  mode: index % 9 === 0 ? 'vertical' : index % 7 === 0 ? 'horizontal' : 'absolute',
  horizontal: (['fixed', 'hug', 'fill'] as const)[index % 3],
  vertical: (['fixed', 'fill', 'hug'] as const)[index % 3],
  gap: index % 4,
  padding: [8, 8, 8, 8],
})

function base(id: NodeId, index: number, parentId: NodeId | null): Omit<CanvasNode, 'kind'> {
  return {
    id,
    name: `Node ${index}`,
    parentId,
    childIds: [],
    bounds: { x: 24 + (index % 100) * 104, y: 24 + Math.floor(index / 100) * 72, width: 92, height: 58 },
    rotation: 0,
    layout: layout(index),
    visible: true,
    locked: false,
    tokenBindings: { background: index % 2 ? 'surface.muted' : 'surface.raised' },
    source: null,
  } as Omit<CanvasNode, 'kind'>
}

export function createDocumentFixture(size: 1000 | 5000): CanvasDocument {
  const nodes: Record<NodeId, CanvasNode> = {}
  const rootIds: NodeId[] = []
  const componentIds: NodeId[] = []

  for (let index = 0; index < size; index += 1) {
    const id = `node-${String(index).padStart(5, '0')}`
    const isRoot = index % 100 === 0
    const parentIndex = index - (index % 100)
    const parentId = isRoot ? null : `node-${String(parentIndex).padStart(5, '0')}`
    let node: CanvasNode
    if (isRoot) {
      node = { ...base(id, index, null), kind: 'frame', clipContent: true }
      rootIds.push(id)
    } else if (index % 20 === 1) {
      node = {
        ...base(id, index, parentId),
        kind: 'code-component',
        source: { file: `src/components/Fixture${index}.tsx`, exportName: `Fixture${index}`, startLine: 1, endLine: 20 },
        props: { label: `Component ${index}`, disabled: false },
        variants: { size: (['sm', 'md', 'lg'] as const)[index % 3], state: 'default' },
      }
      componentIds.push(id)
    } else if (index % 20 === 2) {
      const componentId = componentIds.at(-1)
      if (!componentId) throw new Error('fixture invariant: instance has no component')
      node = { ...base(id, index, parentId), kind: 'instance', componentId, overrides: { label: `Instance ${index}` } }
    } else if (index % 7 === 0) {
      node = { ...base(id, index, parentId), kind: 'text', text: index === 7 ? '한글 캔버스 입력' : `Text ${index}`, textStyle: { fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 500, lineHeight: 20 } }
    } else {
      node = { ...base(id, index, parentId), kind: index % 3 === 0 ? 'group' : 'frame', ...(index % 3 === 0 ? {} : { clipContent: false }) } as CanvasNode
    }
    nodes[id] = node
    if (parentId) nodes[parentId]?.childIds.push(id)
  }

  return assertValidDocument({
    schemaVersion: 1,
    id: `agent-design-fixture-${size}`,
    name: `Agent Design ${size} node fixture`,
    revision: 0,
    rootIds,
    nodes,
    selection: [rootIds[0]],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt, updatedAt: createdAt, sourceRoot: '.' },
  })
}

export function cloneDocument(document: CanvasDocument): CanvasDocument {
  return structuredClone(document)
}

export function firstComponent(document: CanvasDocument): CodeComponentNode {
  const component = Object.values(document.nodes).find((node): node is CodeComponentNode => node.kind === 'code-component')
  if (!component) throw new Error('fixture has no code component')
  return component
}
