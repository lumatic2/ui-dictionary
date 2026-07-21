import { describe, expect, it } from 'vitest'
import { COLOR_BINDING_KEYS, TOKEN_BINDING_KINDS } from './properties.js'

/**
 * ECT4 step-1 — 허용 바인딩 키의 **정본은 하나다.**
 *
 * 같은 목록이 네 군데 따로 살고 있었다(template-core EXPECTED_KIND, 렌더러 하드코딩,
 * 미해결 검사 배열, 인스펙터 라벨). 한쪽에 키를 더하면 나머지가 조용히 뒤처진다.
 *
 * 이 horizon은 "규칙이 흩어져서 한 곳만 막힌다"에 네 번 당했다. 그래서 단일 출처를
 * 선택지가 아니라 **통과 조건**으로 잡는다.
 */
describe('바인딩 키 정본 (ECT4 step-1)', () => {
  it('색 키는 정본에서 유도된다 — 손으로 나열하지 않는다', () => {
    expect(COLOR_BINDING_KEYS.slice().sort()).toEqual(['background', 'color', 'fill'])
    // 정본에서 유도됐다는 증거: kind가 color인 것만 들어 있다.
    for (const key of COLOR_BINDING_KEYS) {
      expect(TOKEN_BINDING_KINDS[key]).toBe('color')
    }
  })

  it('색이 아닌 키는 색 목록에 없다', () => {
    expect(COLOR_BINDING_KEYS).not.toContain('fontFamily')
    expect(TOKEN_BINDING_KINDS.fontFamily).toBe('fontFamily')
  })

  it('정본이 비어 있지 않다 — 필터가 전부를 걸러내면 UI가 통째로 사라진다', () => {
    expect(Object.keys(TOKEN_BINDING_KINDS).length).toBeGreaterThan(0)
    expect(COLOR_BINDING_KEYS.length).toBeGreaterThan(0)
  })
})
