import { describe, expect, it } from 'vitest'
import { validateDocument } from '@askewly/canvas-core'
import { formatPackCatalog } from './blueprints/registry.js'
import { templateSignature } from './signature.js'
import { resolveProjectTokens } from './tokens.js'
import {
  createTemplateProject,
  starterAssets,
  TemplateStarterError,
} from './starter.js'

/**
 * TH3 step-2 — 청사진 갤러리가 캔버스로 여는 경로.
 *
 * 여기서 나온 `scene`은 그대로 AskewlyDesign 문서로 쓰인다.
 */

describe('템플릿 시작점', () => {
  it('청사진 6종이 전부 유효한 캔버스 문서로 열린다', () => {
    for (const blueprint of formatPackCatalog) {
      const project = createTemplateProject({ blueprintId: blueprint.id })
      const result = validateDocument(project.scene)
      expect(result.errors).toEqual([])
      expect(result.valid).toBe(true)
    }
  })

  it('6종의 서명이 서로 다르다 — 갤러리에서 고른 게 실제로 반영된다', () => {
    const signatures = formatPackCatalog.map((blueprint) =>
      templateSignature(createTemplateProject({ blueprintId: blueprint.id })),
    )
    expect(new Set(signatures).size).toBe(formatPackCatalog.length)
  })

  it('열린 문서의 토큰이 전부 해석된다', () => {
    for (const blueprint of formatPackCatalog) {
      for (const tokenSetId of ['askewly.warm', 'askewly.ink']) {
        const project = createTemplateProject({ blueprintId: blueprint.id, tokenSetId })
        expect(resolveProjectTokens(project).issues).toEqual([])
      }
    }
  })

  it('자리표시 소재는 네트워크를 타지 않는다', () => {
    for (const asset of starterAssets) expect(asset.uri.startsWith('data:')).toBe(true)
  })

  it('같은 입력이면 같은 서명이 나온다', () => {
    const first = createTemplateProject({ blueprintId: 'business-card-minimal' })
    const second = createTemplateProject({ blueprintId: 'business-card-minimal' })
    expect(templateSignature(first)).toBe(templateSignature(second))
  })
})

describe('시작점 실패 경로', () => {
  it('없는 청사진 id는 빈 문서가 아니라 예외다', () => {
    expect(() => createTemplateProject({ blueprintId: 'business-card-imaginary' })).toThrowError(
      TemplateStarterError,
    )
    try {
      createTemplateProject({ blueprintId: 'business-card-imaginary' })
    } catch (error) {
      expect((error as TemplateStarterError).code).toBe('BLUEPRINT_NOT_FOUND')
      // 진단은 무엇을 고를 수 있는지까지 말한다.
      expect((error as TemplateStarterError).message).toContain('business-card-minimal')
    }
  })

  it('없는 토큰 세트는 기본 세트로 조용히 대체되지 않는다', () => {
    try {
      createTemplateProject({ blueprintId: 'business-card-minimal', tokenSetId: 'warm.craft' })
      throw new Error('던졌어야 한다')
    } catch (error) {
      expect((error as TemplateStarterError).code).toBe('TOKEN_SET_NOT_FOUND')
    }
  })

  it('필수 항목을 빈 문자열로 지우면 거부한다', () => {
    try {
      createTemplateProject({
        blueprintId: 'business-card-minimal',
        content: { name: '   ' },
      })
      throw new Error('던졌어야 한다')
    } catch (error) {
      expect((error as TemplateStarterError).code).toBe('CONTENT_INCOMPLETE')
      expect((error as TemplateStarterError).message).toContain('name')
    }
  })

  it('반복 목록을 최소 개수 미만으로 주면 컴파일러가 거부한다', () => {
    expect(() =>
      createTemplateProject({
        blueprintId: 'infographic-comparison',
        lists: { comparisons: [{ label: '하나', value: '1' }] },
      }),
    ).toThrowError(/REPEAT_COUNT_OUT_OF_RANGE|units/)
  })
})
