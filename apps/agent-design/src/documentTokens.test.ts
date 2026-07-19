import { describe, expect, it } from 'vitest'
import { documentTokens } from './documentTokens'
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
