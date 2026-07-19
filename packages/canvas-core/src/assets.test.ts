import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import { validateDocument } from './validation.js'
import type { CanvasDocument, ImageNode } from './types.js'

/**
 * TH7 step-2 — 문서가 소재를 직접 싣는다.
 *
 * 소재를 문서 바깥에 두면 문서만 오가는 경로에서 이미지가 사라진다.
 * 그리고 사라진 것이 빈 상자로 렌더되면 결함인지 상태인지 구별되지 않는다.
 */

function documentWithImage(assets?: CanvasDocument['assets']): CanvasDocument {
  const base = createDocumentFixture(1000)
  const rootId = base.rootIds[0]
  const image: ImageNode = {
    id: 'image-1',
    kind: 'image',
    name: 'hero',
    parentId: rootId,
    childIds: [],
    bounds: { x: 0, y: 0, width: 100, height: 100 },
    layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
    visible: true,
    locked: false,
    tokenBindings: {},
    source: null,
    assetId: 'hero-asset',
    alt: '히어로 이미지',
    fit: 'cover',
    opacity: 1,
  }

  return {
    ...base,
    assets,
    nodes: {
      ...base.nodes,
      [rootId]: { ...base.nodes[rootId], childIds: [...base.nodes[rootId].childIds, image.id] },
      [image.id]: image,
    },
  }
}

describe('문서 소재 참조', () => {
  it('소재가 실려 있으면 유효하다', () => {
    const document = documentWithImage({
      'hero-asset': { uri: './hero.svg', mimeType: 'image/svg+xml', width: 100, height: 100 },
    })
    expect(validateDocument(document)).toEqual({ valid: true, errors: [] })
  })

  it('이미지가 가리키는 소재가 없으면 거부한다', () => {
    const result = validateDocument(documentWithImage({}))
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('image-1: missing asset hero-asset')
  })

  it('소재 목록 자체가 없어도 거부한다 — 빈 상자로 조용히 넘어가지 않는다', () => {
    const result = validateDocument(documentWithImage(undefined))
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('image-1: missing asset hero-asset')
  })

  it('이미지 노드가 없는 문서는 소재 목록 없이도 유효하다 — 기존 문서 호환', () => {
    expect(validateDocument(createDocumentFixture(1000))).toEqual({ valid: true, errors: [] })
  })
})
