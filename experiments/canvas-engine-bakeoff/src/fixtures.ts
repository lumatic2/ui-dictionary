import type { SceneFixture, SceneNode, SceneSize } from './types'

const kinds: SceneNode['kind'][] = ['component', 'instance', 'group', 'frame', 'card', 'text', 'button']
const tokens: SceneNode['token'][] = ['surface.raised', 'surface.muted', 'action.primary']

export function createFixture(size: SceneSize): SceneFixture {
  const columns = 100
  const gapX = 104
  const gapY = 72
  const nodes: SceneNode[] = []

  for (let index = 0; index < size; index += 1) {
    const column = index % columns
    const row = Math.floor(index / columns)
    const kind = index % 20 === 0 ? 'component' : index % 20 === 1 ? 'instance' : kinds[index % kinds.length]
    const width = kind === 'frame' ? 92 : kind === 'card' ? 84 : kind === 'button' ? 72 : 68
    const height = kind === 'frame' ? 58 : kind === 'card' ? 50 : kind === 'button' ? 32 : 24
    nodes.push({
      id: `node-${index}`,
      kind,
      x: 24 + column * gapX + (index % 3) * 2,
      y: 24 + row * gapY + (index % 5),
      width,
      height,
      label: index === 0 ? '한글 입력 테스트' : `${kind} ${index}`,
      tone: (index * 37) % 360,
      token: tokens[index % tokens.length],
      parentId: index > 0 && index % 8 !== 0 ? `node-${index - (index % 8)}` : null,
      componentId: kind === 'instance' ? `node-${index - 1}` : null,
      sourceRef: `src/components/Fixture.tsx:${index + 1}`,
      responsiveMode: (['fixed', 'hug', 'fill'] as const)[index % 3],
      props: {
        size: (['sm', 'md', 'lg'] as const)[index % 3],
        state: (['default', 'hover', 'disabled'] as const)[index % 3],
        visible: true,
      },
    })
  }

  return {
    version: 1,
    id: `representative-ui-${size}`,
    width: columns * gapX + 48,
    height: Math.ceil(size / columns) * gapY + 48,
    selectedId: 'node-0',
    nodes,
  }
}

export function verifyFixture(fixture: SceneFixture): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  for (const node of fixture.nodes) {
    if (ids.has(node.id)) errors.push(`duplicate id: ${node.id}`)
    ids.add(node.id)
    if (node.width <= 0 || node.height <= 0) errors.push(`invalid bounds: ${node.id}`)
    if (!node.token) errors.push(`missing token: ${node.id}`)
    if (!node.sourceRef) errors.push(`missing source ref: ${node.id}`)
    if (!node.responsiveMode) errors.push(`missing responsive mode: ${node.id}`)
    if (!node.props?.size || !node.props?.state || typeof node.props?.visible !== 'boolean') errors.push(`invalid typed props: ${node.id}`)
  }
  for (const node of fixture.nodes) {
    if (node.parentId && !ids.has(node.parentId)) errors.push(`missing parent: ${node.id}`)
    if (node.kind === 'instance' && (!node.componentId || !ids.has(node.componentId))) errors.push(`missing component definition: ${node.id}`)
  }
  if (!ids.has(fixture.selectedId)) errors.push('selected node is missing')
  return errors
}
