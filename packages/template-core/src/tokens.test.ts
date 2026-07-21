import { describe, expect, it } from 'vitest'
import { compileTemplate } from './compiler.js'
import { formatPackCatalog } from './blueprints/registry.js'
import {
  listTokenSets,
  resolveProjectTokens,
  resolveTokenSet,
  resolveTokenValue,
  tokenSets,
} from './tokens.js'
import type { AssetManifestEntry, TemplateProject, TemplateRequest } from './types.js'

/**
 * TH3 step-1 — 토큰 조회가 실제로 일어나는가, 실패가 조용히 넘어가지 않는가.
 */

const assets: AssetManifestEntry[] = [
  {
    id: 'portrait',
    role: 'portrait',
    uri: './portrait.svg',
    mimeType: 'image/svg+xml',
    width: 800,
    height: 1000,
    provenance: { provider: 'local', source: 'test' },
  },
  {
    id: 'product',
    role: 'product',
    uri: './product.svg',
    mimeType: 'image/svg+xml',
    width: 1000,
    height: 800,
    provenance: { provider: 'local', source: 'test' },
  },
]

function project(tokenSetId: string): TemplateProject {
  const request: TemplateRequest = {
    id: 'tokens-test',
    format: 'business-card',
    width: 1050,
    height: 600,
    tokenSetId,
    content: { name: '전유성', role: 'AI Builder', contact: 'hello@askewly.com' },
  }
  return compileTemplate(request, assets, formatPackCatalog[0])
}

describe('토큰 세트', () => {
  it('세트가 2개 이상 등록돼 있어 전환이 관측 가능하다', () => {
    expect(listTokenSets().length).toBeGreaterThanOrEqual(2)
  })

  it('두 세트는 같은 binding에 서로 다른 값을 준다', () => {
    const warm = resolveTokenSet('askewly.warm')
    const ink = resolveTokenSet('askewly.ink')

    expect(resolveTokenValue(warm, 'text.primary')).not.toBe(resolveTokenValue(ink, 'text.primary'))
    expect(resolveTokenValue(warm, 'surface.canvas')).not.toBe(
      resolveTokenValue(ink, 'surface.canvas'),
    )
  })

  it('없는 세트·없는 토큰은 폴백 값이 아니라 null이다', () => {
    expect(resolveTokenSet('warm.craft')).toBeNull()
    expect(resolveTokenValue(resolveTokenSet('askewly.warm'), 'text.nonexistent')).toBeNull()
  })
})

describe('장면 토큰 해석', () => {
  it('청사진이 참조하는 binding이 전부 값으로 해석된다', () => {
    const resolution = resolveProjectTokens(project('askewly.warm'))

    expect(resolution.issues).toEqual([])
    expect(resolution.set?.id).toBe('askewly.warm')
    expect(resolution.values['text.primary']).toBe('#2b241b')
    // fontFamily 바인딩도 해석된다 — 하드코딩 팔레트는 색만 갖고 있어 이걸 조용히 버렸다.
    expect(resolution.values['type.heading']).toContain('serif')
  })

  it('세트를 바꾸면 해석된 값이 실제로 달라진다', () => {
    const warm = resolveProjectTokens(project('askewly.warm'))
    const ink = resolveProjectTokens(project('askewly.ink'))

    expect(ink.issues).toEqual([])
    expect(ink.values['text.primary']).not.toBe(warm.values['text.primary'])
  })

  it('override가 세트 값을 덮어쓴다', () => {
    const resolution = resolveProjectTokens(project('askewly.warm'), {
      'brand.primary': '#b03030',
    })

    expect(resolution.values['brand.primary']).toBe('#b03030')
    expect(resolution.issues).toEqual([])
  })

  it('세트에 없는 binding은 override로도 만들어지지 않는다', () => {
    const resolution = resolveProjectTokens(project('askewly.warm'), {
      'text.invented': '#000000',
    })

    expect(resolution.values['text.invented']).toBeUndefined()
  })
})

describe('토큰 조회 실패 진단', () => {
  it('없는 토큰 세트는 조용한 기본색이 아니라 진단을 낸다', () => {
    const resolution = resolveProjectTokens(project('warm.craft'))

    expect(resolution.set).toBeNull()
    expect(resolution.values).toEqual({})
    expect(resolution.issues).toHaveLength(1)
    expect(resolution.issues[0]).toMatchObject({
      code: 'TOKEN_SET_NOT_FOUND',
      tokenSetId: 'warm.craft',
    })
    // 진단은 색만이 아니라 글로 원인을 말한다.
    expect(resolution.issues[0].message).toContain('askewly.warm')
  })

  it('세트에 정의되지 않은 토큰을 참조하면 노드 단위로 지목한다', () => {
    const tampered = structuredClone(project('askewly.warm'))
    const nodeId = Object.keys(tampered.scene.nodes).find(
      (id) => tampered.scene.nodes[id].tokenBindings?.color,
    )!
    tampered.scene.nodes[nodeId].tokenBindings.color = 'text.ghost'

    const resolution = resolveProjectTokens(tampered)

    expect(resolution.issues).toHaveLength(1)
    expect(resolution.issues[0]).toMatchObject({ code: 'TOKEN_NOT_DEFINED', nodeId })
    expect(resolution.values['text.ghost']).toBeUndefined()
  })

  it('색 토큰을 fontFamily 자리에 쓰면 종류 불일치로 잡는다', () => {
    const tampered = structuredClone(project('askewly.warm'))
    const nodeId = Object.keys(tampered.scene.nodes).find(
      (id) => tampered.scene.nodes[id].tokenBindings?.fontFamily,
    )!
    tampered.scene.nodes[nodeId].tokenBindings.fontFamily = 'brand.primary'

    const resolution = resolveProjectTokens(tampered)

    expect(resolution.issues[0]).toMatchObject({ code: 'TOKEN_KIND_MISMATCH', nodeId })
  })

  it('등록된 모든 세트가 청사진 6종의 binding을 빠짐없이 갖는다', () => {
    // 세트를 추가할 때 토큰 하나를 빠뜨리면 화면이 아니라 여기서 먼저 터진다.
    for (const set of listTokenSets()) {
      for (const blueprint of formatPackCatalog) {
        const request: TemplateRequest = {
          id: `coverage-${set.id}-${blueprint.id}`,
          format: blueprint.format,
          width: blueprint.width,
          height: blueprint.height,
          tokenSetId: set.id,
          lists: {
            comparisons: [
              { label: '명함', value: '5 슬롯' },
              { label: '인포그래픽', value: '3 슬롯' },
            ],
          },
          content: {
            name: '전유성',
            role: 'AI Builder',
            contact: 'hello@askewly.com',
            product: '매일컵',
            headline: '손이 빚은 하루의 그릇',
            cta: '이번 가마 보기',
            title: '편집 가능한 제작 시스템',
            stat: '3 formats',
            explanation: '구조화된 장면이 편집 레이어를 보존합니다.',
            source: 'Askewly fixture',
          },
        }
        const compiled = compileTemplate(request, assets, blueprint)
        expect(resolveProjectTokens(compiled).issues).toEqual([])
      }
    }
  })
})

it('등록된 세트 id는 자기 키와 일치한다', () => {
  for (const [key, set] of Object.entries(tokenSets)) expect(set.id).toBe(key)
})
