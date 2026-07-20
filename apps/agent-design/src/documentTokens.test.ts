import { describe, expect, it } from 'vitest'
import { validateTokenMode } from '@askewly/canvas-core'
import { resolveTokenSet } from '@askewly/template-core'
import { documentTokens, isKnownTokenSet, listDocumentTokenSets } from './documentTokens'
import { editorTokenMaps, FALLBACK_BACKGROUND_TOKEN } from './editorTokens'

/**
 * TH7 step-1 — 두 토큰 어휘가 한 캔버스에 공존한다. 출처로 가르고, 폴백하지 않는다.
 */

describe('문서 토큰 출처 판별', () => {
  it('템플릿 세트는 디자인 어휘로 해석된다', () => {
    const tokens = documentTokens('askewly.warm')
    expect(tokens.source).toBe('template')
    expect(tokens.resolve('surface.canvas')).toBe('#f7f2e8')
    expect(tokens.resolve('brand.primary')).toBe('#2f7d4f')
    expect(tokens.resolve('type.heading')).toContain('serif')
  })

  it('편집기 세트는 chrome 어휘로 해석된다', () => {
    const tokens = documentTokens('askewly.default')
    expect(tokens.source).toBe('editor')
    expect(tokens.resolve('surface.muted')).toBe(editorTokenMaps['askewly.default']['surface.muted'])
  })

  it('두 어휘는 서로를 알지 못한다 — 별칭으로 잇지 않는다', () => {
    // 템플릿을 편집기 색으로 칠하면 디자인이 아니라 편집기가 보인다.
    expect(documentTokens('askewly.warm').resolve('surface.muted')).toBeNull()
    expect(documentTokens('askewly.default').resolve('surface.canvas')).toBeNull()
  })

  it('등록되지 않은 세트는 unknown이고 아무 값도 주지 않는다', () => {
    const tokens = documentTokens('warm.craft')
    expect(tokens.source).toBe('unknown')
    expect(tokens.resolve('surface.canvas')).toBeNull()
    expect(tokens.resolveBackground(undefined)).toBeNull()
  })
})

describe('배경 폴백 경계', () => {
  it('편집기 문서는 바인딩이 없을 때만 중립 배경으로 떨어진다', () => {
    const tokens = documentTokens('askewly.default')
    expect(tokens.resolveBackground(undefined)).toBe(
      editorTokenMaps['askewly.default'][FALLBACK_BACKGROUND_TOKEN],
    )
  })

  it('바인딩이 있는데 세트에 없으면 폴백하지 않는다', () => {
    // 이게 템플릿이 회색 상자로 보이던 원인이었다 — surface.canvas가 조용히 surface.muted가 됐다.
    expect(documentTokens('askewly.default').resolveBackground('surface.canvas')).toBeNull()
  })

  it('템플릿 문서는 바인딩이 없어도 폴백하지 않는다', () => {
    expect(documentTokens('askewly.warm').resolveBackground(undefined)).toBeNull()
  })
})

describe('토큰 세트 목록·실재 판정 (TH10)', () => {
  it('실재하는 세트 넷을 전부 담고 출처로 가른다', () => {
    const choices = listDocumentTokenSets()
    expect(choices.map((choice) => choice.id).sort()).toEqual([
      'askewly.dark',
      'askewly.default',
      'askewly.ink',
      'askewly.warm',
    ])
    expect(choices.filter((choice) => choice.source === 'editor')).toHaveLength(2)
    expect(choices.filter((choice) => choice.source === 'template')).toHaveLength(2)
  })

  it('모양 검사와 실재 판정은 다른 질문이다', () => {
    // 이게 결함의 정체다 — `validateTokenMode`는 점 표기 모양만 보므로 없는 세트를 통과시킨다.
    expect(validateTokenMode('foo.bar')).toBe(true)
    expect(isKnownTokenSet('foo.bar')).toBe(false)
    for (const id of ['askewly.default', 'askewly.dark', 'askewly.warm', 'askewly.ink']) {
      expect(isKnownTokenSet(id)).toBe(true)
    }
  })
})

/**
 * ECT1 step-1 — 화면이 "이 문서가 쓸 수 있는 토큰이 뭐냐"고 물어볼 곳을 만든다.
 *
 * EU5에서 사용자가 색을 못 바꾼 이유는 데이터가 없어서가 아니라 **UI가 안 물어봐서**였다.
 * 물어볼 API 자체가 없었다.
 *
 * 대조 상대는 열거 API가 아니라 **세트 원본 객체**다 — 자기 출력을 자기 출력으로 검사하면
 * 둘 다 틀렸을 때 통과한다.
 */
describe('토큰 열거 (ECT1 step-1)', () => {
  it('템플릿 세트는 원본 객체와 정확히 같은 토큰을 내놓는다', () => {
    const set = resolveTokenSet('askewly.warm')!
    const listed = documentTokens('askewly.warm').listTokens()

    expect(listed.map((t) => t.name).sort()).toEqual(Object.keys(set.tokens).sort())
    for (const entry of listed) {
      expect(entry.value).toBe(set.tokens[entry.name].value)
      expect(entry.kind).toBe(set.tokens[entry.name].kind)
    }
  })

  it('편집기 세트는 원본 맵과 정확히 같은 토큰을 내놓는다', () => {
    const map = editorTokenMaps['askewly.default']
    const listed = documentTokens('askewly.default').listTokens()

    expect(listed.map((t) => t.name).sort()).toEqual(Object.keys(map).sort())
    for (const entry of listed) {
      expect(entry.value).toBe(map[entry.name])
    }
  })

  it('편집기 토큰의 종류는 아직 모른다 — 색으로 단정하지 않는다', () => {
    // 여기서 'color'로 채우면 나중에 글꼴 토큰이 들어오는 순간 색 목록에 섞인다.
    // step-2에서 생성기가 SSOT로부터 채우고, 그때 이 테스트가 뒤집힌다.
    expect(documentTokens('askewly.default').listTokens().every((t) => t.kind === null)).toBe(true)
  })

  it('두 어휘는 열거에서도 서로를 알지 못한다 — 양방향', () => {
    const templateNames = new Set(documentTokens('askewly.warm').listTokens().map((t) => t.name))
    const editorNames = new Set(documentTokens('askewly.default').listTokens().map((t) => t.name))

    // 어느 쪽 목록에도 **상대 어휘 고유의 이름**이 없다. 한쪽만 보는 게이트는 EU2에서 이미 새어 봤다.
    expect(templateNames.has('surface.canvas')).toBe(true)
    expect(templateNames.has('type.heading')).toBe(true)
    expect(templateNames.has('surface.base')).toBe(false)
    expect(templateNames.has('action.primary')).toBe(false)

    expect(editorNames.has('surface.base')).toBe(true)
    expect(editorNames.has('action.primary')).toBe(true)
    expect(editorNames.has('surface.canvas')).toBe(false)
    expect(editorNames.has('type.heading')).toBe(false)
  })

  it('이름이 겹쳐도 값은 갈린다 — 격리는 이름이 아니라 출처로 이뤄진다', () => {
    // ECT1 step-1 실측: `text.muted`·`text.secondary`는 **양쪽에 다 있다.**
    // 기존 주석("두 어휘는 겹치지 않는다")은 사실이 아니었다. 겹치는 이름이 있어도
    // 문서는 자기 세트에서만 값을 얻으므로 격리는 유지된다 — 그걸 여기서 못박는다.
    const shared = ['text.muted', 'text.secondary']
    for (const name of shared) {
      const fromTemplate = documentTokens('askewly.warm').listTokens().find((t) => t.name === name)
      const fromEditor = documentTokens('askewly.default').listTokens().find((t) => t.name === name)
      expect(fromTemplate, `${name}은 템플릿 어휘에 있어야 한다`).toBeDefined()
      expect(fromEditor, `${name}은 편집기 어휘에 있어야 한다`).toBeDefined()
      expect(fromTemplate!.value).not.toBe(fromEditor!.value)
    }
  })

  it('모르는 세트는 빈 목록이다 — 그럴듯한 팔레트를 지어내지 않는다', () => {
    expect(documentTokens('warm.craft').listTokens()).toEqual([])
  })

  it('열거는 하드코딩된 목록이 아니다 — 세트가 늘면 목록도 는다', () => {
    const set = resolveTokenSet('askewly.ink')!
    const before = documentTokens('askewly.ink').listTokens().length
    set.tokens['brand.secondary'] = { kind: 'color', value: '#123456' }
    try {
      const after = documentTokens('askewly.ink').listTokens()
      expect(after).toHaveLength(before + 1)
      expect(after.find((t) => t.name === 'brand.secondary')?.value).toBe('#123456')
    } finally {
      delete set.tokens['brand.secondary']
    }
  })
})
