import { describe, expect, it } from 'vitest'
import { businessCardFixture, flatArtworkFixture } from './fixtures.js'
import { validateTemplateProject } from './validation.js'

describe('template contract', () => {
  it('accepts an editable structured scene', () => {
    expect(validateTemplateProject(businessCardFixture())).toEqual({ valid: true, errors: [] })
  })

  it('rejects a flattened image as a template', () => {
    const result = validateTemplateProject(flatArtworkFixture())
    expect(result.valid).toBe(false)
    expect(result.errors.map((error) => error.code)).toContain('FLAT_ARTWORK_NOT_EDITABLE')
  })

  it('rejects missing content and broken asset references', () => {
    const project = businessCardFixture()
    project.request.content.contact = ''
    const portrait = project.scene.nodes.portrait
    if (portrait.kind === 'image') portrait.assetId = 'missing'
    expect(validateTemplateProject(project).errors.map((error) => error.code)).toEqual(expect.arrayContaining(['MISSING_CONTENT', 'BROKEN_ASSET_REFERENCE']))
  })
})

describe('형태가 깨진 입력 — 코드로 거부한다 (TH10)', () => {
  // 그전에는 전부 `TypeError: Cannot read properties of undefined`로 터졌다.
  // 차단은 됐지만 어디가 잘못됐는지 알 수 없어, 재가져오기 화면이 스택 트레이스를 보여줬다.
  it.each([
    [null, 'NOT_A_TEMPLATE_PROJECT'],
    [undefined, 'NOT_A_TEMPLATE_PROJECT'],
    ['문자열', 'NOT_A_TEMPLATE_PROJECT'],
    [[], 'NOT_A_TEMPLATE_PROJECT'],
  ])('%s는 객체가 아니므로 거부된다', (input, code) => {
    const result = validateTemplateProject(input as never)
    expect(result.valid).toBe(false)
    expect(result.errors[0].code).toBe(code)
  })

  it('빠진 최상위 필드를 각각 지목한다', () => {
    const result = validateTemplateProject({} as never)
    expect(result.errors.map((error) => error.code)).toEqual([
      'MISSING_REQUEST',
      'MISSING_ASSETS',
      'MISSING_SCENE',
    ])
  })

  it('한 겹 안쪽의 빠진 필드도 지목한다', () => {
    const scene = validateTemplateProject({
      schemaVersion: 1,
      request: { content: {} },
      assets: [],
      scene: {},
    } as never)
    expect(scene.errors.map((error) => error.code)).toContain('MISSING_SCENE_NODES')
  })

  it('어떤 입력에도 TypeError를 던지지 않는다', () => {
    for (const input of [null, undefined, 0, '', [], {}, { scene: null }, { request: 1 }]) {
      expect(() => validateTemplateProject(input as never)).not.toThrow()
    }
  })
})
