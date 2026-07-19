import type { CanvasDocument, CanvasNode, LayoutConstraints } from '@askewly/canvas-core'
import type { TemplateProject } from './types.js'

const layout: LayoutConstraints = {
  mode: 'absolute',
  horizontal: 'fixed',
  vertical: 'fixed',
  gap: 0,
  padding: [0, 0, 0, 0],
}

type Bounds = { x: number; y: number; width: number; height: number }

const base = (id: string, parentId: string | null, childIds: string[], bounds: Bounds) => ({
  id,
  name: id,
  parentId,
  childIds,
  bounds,
  layout,
  visible: true,
  locked: false,
  tokenBindings: {},
  source: null,
})

/** 편집 가능한 템플릿의 기준 fixture — 텍스트·도형·이미지 레이어가 전부 살아 있다. */
export function businessCardFixture(): TemplateProject {
  const nodes: Record<string, CanvasNode> = {
    root: {
      ...base('root', null, ['accent', 'name', 'portrait'], { x: 0, y: 0, width: 1050, height: 600 }),
      kind: 'frame',
      clipContent: true,
      tokenBindings: { background: 'surface.canvas' },
    },
    accent: {
      ...base('accent', 'root', [], { x: 0, y: 0, width: 32, height: 600 }),
      kind: 'shape',
      shape: 'rectangle',
      fill: '#2f7d4f',
      stroke: null,
      strokeWidth: 0,
      tokenBindings: { fill: 'brand.primary' },
    },
    name: {
      ...base('name', 'root', [], { x: 96, y: 180, width: 520, height: 88 }),
      kind: 'text',
      text: '전유성',
      textStyle: { fontFamily: 'Noto Sans KR', fontSize: 54, fontWeight: 700, lineHeight: 72 },
      tokenBindings: { color: 'text.primary', fontFamily: 'type.heading' },
    },
    portrait: {
      ...base('portrait', 'root', [], { x: 720, y: 100, width: 240, height: 400 }),
      kind: 'image',
      assetId: 'portrait',
      alt: '프로필 사진',
      fit: 'cover',
      opacity: 1,
    },
  }

  const scene: CanvasDocument = {
    schemaVersion: 1,
    id: 'business-card-minimal',
    name: 'Business card minimal',
    revision: 0,
    rootIds: ['root'],
    nodes,
    selection: [],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    // 장면은 자족적이어야 한다 — 이미지 노드가 가리키는 소재를 문서가 직접 갖는다.
    assets: {
      portrait: {
        uri: './fixtures/portrait.svg',
        mimeType: 'image/svg+xml',
        width: 240,
        height: 400,
      },
    },
    metadata: {
      createdAt: '2026-07-19T00:00:00.000Z',
      updatedAt: '2026-07-19T00:00:00.000Z',
      sourceRoot: '.',
    },
  }

  return {
    schemaVersion: 1,
    request: {
      id: 'card-1',
      format: 'business-card',
      width: 1050,
      height: 600,
      tokenSetId: 'askewly.default',
      content: { name: '전유성', role: 'AI Builder', contact: 'hello@askewly.com' },
    },
    assets: [
      {
        id: 'portrait',
        uri: './fixtures/portrait.svg',
        mimeType: 'image/svg+xml',
        width: 240,
        height: 400,
        provenance: { provider: 'local', source: 'fixture' },
      },
    ],
    scene,
  }
}

/**
 * 거부돼야 하는 fixture — 전체가 이미지 한 장으로 눌린 평면 시안.
 * 편집 가능한 템플릿과 평면 결과물의 경계를 검증이 실제로 구분하는지 확인한다.
 */
export function flatArtworkFixture(): TemplateProject {
  const project = businessCardFixture()
  project.scene.nodes = {
    root: {
      ...base('root', null, [], { x: 0, y: 0, width: 1050, height: 600 }),
      kind: 'image',
      assetId: 'portrait',
      alt: 'flattened artwork',
      fit: 'cover',
      opacity: 1,
    },
  }
  return project
}
