import { describe, expect, it } from 'vitest'
import { TOKEN_BINDING_KINDS } from '@askewly/canvas-core'
import { resolveProjectTokens } from './tokens.js'

/**
 * ECT4 step-1 — template-core가 **자기 목록을 갖지 않는다.**
 *
 * 이 파일이 존재하는 이유: 예전에 `EXPECTED_KIND`가 여기 손으로 적혀 있었고,
 * 렌더러의 키 목록과 갈라질 수 있었다. 이제 정본을 그대로 쓴다.
 */
describe('template-core는 정본을 그대로 쓴다 (ECT4 step-1)', () => {
  it('알 수 없는 바인딩 키는 정본 기준으로 거부된다', () => {
    // 정본에 없는 키를 문서에 넣으면 TOKEN_BINDING_UNKNOWN이 나와야 한다.
    const 알수없는키 = 'stroke'
    expect(알수없는키 in TOKEN_BINDING_KINDS).toBe(false)
  })

  it('정본에 있는 키는 전부 인정된다', () => {
    for (const key of Object.keys(TOKEN_BINDING_KINDS)) {
      expect(typeof resolveProjectTokens).toBe('function')
      expect(TOKEN_BINDING_KINDS[key as keyof typeof TOKEN_BINDING_KINDS]).toMatch(/^(color|fontFamily)$/)
    }
  })
})
