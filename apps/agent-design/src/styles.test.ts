import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(__dirname, 'styles.css'), 'utf-8')

describe('workspace toolbar density', () => {
  it('lets toolbar sections wrap onto new lines instead of overflowing horizontally', () => {
    const rule = css.match(/\.document-actions\s*\{[^}]*\}/)
    expect(rule).not.toBeNull()
    expect(rule?.[0]).toMatch(/flex-wrap:\s*wrap/)
  })

  it('keeps each toolbar group intact as a single wrap unit', () => {
    const rule = css.match(/\.toolbar-group\s*\{[^}]*\}/)
    expect(rule).not.toBeNull()
    expect(rule?.[0]).toMatch(/flex:\s*0 0 auto/)
  })
})

describe('editor chrome color token discipline', () => {
  it('has no raw hex color literals outside documented token-exception lines', () => {
    const offendingLines = css
      .split('\n')
      .filter((line) => /#[0-9a-fA-F]{3,8}\b/.test(line) && !line.includes('token-exception'))
    expect(offendingLines).toEqual([])
  })
})

describe('선택 핸들의 역할 구분 (EU1)', () => {
  it('모서리 핸들과 변 핸들의 치수 규칙이 서로 다르다', () => {
    const corner = css.match(/\.resize-handle-corner\s*\{[^}]*\}/)?.[0]
    const edgeNS = css.match(/\.resize-handle-edge\.resize-handle-n[^{]*\{[^}]*\}/)?.[0]
    const edgeEW = css.match(/\.resize-handle-edge\.resize-handle-e[^{]*\{[^}]*\}/)?.[0]
    expect(corner).toBeDefined()
    expect(edgeNS).toBeDefined()
    expect(edgeEW).toBeDefined()
    // 모서리는 정사각, 변은 이동 축 방향으로 누운 막대다.
    expect(corner).toMatch(/width:\s*9px/)
    expect(corner).toMatch(/height:\s*9px/)
    expect(edgeNS).toMatch(/width:\s*20px/)
    expect(edgeNS).toMatch(/height:\s*6px/)
    expect(edgeEW).toMatch(/width:\s*6px/)
    expect(edgeEW).toMatch(/height:\s*20px/)
  })

  it('핸들 배경이 리터럴이 아니라 토큰에서 온다', () => {
    const base = css.match(/\.resize-handle\s*\{[^}]*\}/)?.[0]
    expect(base).toMatch(/background:\s*var\(--ad-surface-base\)/)
    expect(base).not.toMatch(/background:\s*white/)
  })

  it('호버·선택·다중선택이 각각 다른 규칙을 갖는다', () => {
    expect(css).toMatch(/\[data-selection-state="idle"\]:hover\s*\{[^}]*dashed/)
    expect(css).toMatch(/\[data-selection-state="selected"\]\s*\{[^}]*solid/)
    expect(css).toMatch(/\[data-selection-scope="multi"\]\s*\{[^}]*outline-width:\s*2px/)
  })
})
