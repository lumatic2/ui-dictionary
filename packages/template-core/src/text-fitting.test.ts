import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  estimateWidth,
  fitText,
  overflowAmount,
  wrapLines,
  TextFitError,
  DEFAULT_MIN_FONT_SIZE,
} from './text-fitting.js'

/**
 * TH9 step-1 — 문자폭 근사 모델과 맞춤 함수.
 *
 * 모델은 근사다. 그래서 **브라우저 실측과 대조해 오차를 계약으로 못 박는다.**
 */

interface Metric {
  font: string
  size: number
  label: string
  text: string
  measured: number
}

const here = dirname(fileURLToPath(import.meta.url))
const metrics: Metric[] = JSON.parse(
  readFileSync(resolve(here, '__fixtures__/browser-text-metrics.json'), 'utf8'),
)

/**
 * 오차는 **비대칭**으로 다룬다.
 *
 * - 과소추정(모델 < 실제)은 위험하다 — 안 들어가는 글자를 들어간다고 판단해 잘린 산출물이 나간다.
 * - 과대추정(모델 > 실제)은 안전하다 — 글자가 필요보다 작아질 뿐이다.
 *
 * 그래서 허용치가 다르다. 이 값을 사후에 늘려 통과시키지 않는다 — 늘리려면 근거를 남긴다.
 */
const MAX_UNDERESTIMATE = 0.08
const MAX_OVERESTIMATE = 0.25

describe('문자폭 모델 정확도 (브라우저 실측 대조)', () => {
  it('실측 표본이 비어 있지 않다', () => {
    expect(metrics.length).toBeGreaterThanOrEqual(50)
  })

  it.each(metrics)('$label / $font / $size px', (metric) => {
    const estimated = estimateWidth(metric.text, metric.size)
    const error = (estimated - metric.measured) / metric.measured

    expect(error, `과소추정 ${(error * 100).toFixed(1)}% — 잘린 산출물이 나간다`).toBeGreaterThan(
      -MAX_UNDERESTIMATE,
    )
    expect(error, `과대추정 ${(error * 100).toFixed(1)}% — 글자가 불필요하게 작아진다`).toBeLessThan(
      MAX_OVERESTIMATE,
    )
  })

  it('폭은 글자 크기에 선형이다', () => {
    expect(estimateWidth('가나다', 100)).toBeCloseTo(estimateWidth('가나다', 50) * 2, 5)
  })
})

describe('줄 나눔', () => {
  it('어절 단위로 끊는다', () => {
    const lines = wrapLines('한 줄로 말하는 약속', 40, 200)
    expect(lines.length).toBeGreaterThan(1)
    // 어절이 쪼개지지 않았다.
    expect(lines.join(' ')).toBe('한 줄로 말하는 약속')
  })

  it('한 어절이 한 줄보다 길면 글자 단위로 쪼갠다', () => {
    const lines = wrapLines('supercalifragilistic', 40, 100)
    expect(lines.length).toBeGreaterThan(1)
    expect(lines.join('')).toBe('supercalifragilistic')
  })

  it('모든 줄이 상자 폭 안에 들어간다', () => {
    const text = '숫자가 무엇을 뜻하는지 한 문장으로 설명합니다.'
    for (const line of wrapLines(text, 36, 400)) {
      expect(estimateWidth(line, 36)).toBeLessThanOrEqual(400)
    }
  })
})

describe('맞춤', () => {
  it('상자에 들어가는 크기를 찾고 그 결과가 실제로 안 넘친다', () => {
    const box = { width: 920, height: 220 }
    const result = fitText('한 줄로 말하는 약속', box)

    expect(result.widestLine).toBeLessThanOrEqual(box.width)
    expect(result.lines.length * result.lineHeight).toBeLessThanOrEqual(box.height)
    expect(overflowAmount(result.lines[0], result.fontSize, box)).toBe(0)
  })

  it('긴 문장은 작은 크기와 여러 줄로 들어간다', () => {
    const box = { width: 1000, height: 380 }
    const long = '숫자가 무엇을 뜻하는지 한 문장으로 설명합니다.'
    const short = fitText('42', box)
    const result = fitText(long, box)

    expect(result.lines.length).toBeGreaterThan(1)
    expect(result.fontSize).toBeLessThan(short.fontSize)
  })

  it('maxLines를 넘지 않는다', () => {
    const result = fitText('숫자가 무엇을 뜻하는지 한 문장으로 설명합니다.', { width: 400, height: 600 }, { maxLines: 2 })
    expect(result.lines.length).toBeLessThanOrEqual(2)
  })

  it('큰 상자에서는 큰 글자를 고른다', () => {
    const small = fitText('약속', { width: 200, height: 60 })
    const large = fitText('약속', { width: 900, height: 300 })
    expect(large.fontSize).toBeGreaterThan(small.fontSize)
  })
})

describe('들어가지 않는 텍스트', () => {
  it('최소 크기로도 안 들어가면 잘린 채 통과시키지 않고 던진다', () => {
    const box = { width: 60, height: 20 }
    expect(() => fitText('이 문장은 이 작은 상자에 절대 들어가지 않습니다', box)).toThrowError(
      TextFitError,
    )
  })

  it('거부 메시지에 상자 크기와 최소 크기가 담긴다', () => {
    try {
      fitText('들어가지 않는 아주 긴 한국어 문장입니다 정말로', { width: 40, height: 16 })
      throw new Error('던졌어야 한다')
    } catch (error) {
      expect((error as TextFitError).code).toBe('TEXT_DOES_NOT_FIT')
      expect((error as TextFitError).message).toContain(String(DEFAULT_MIN_FONT_SIZE))
    }
  })
})

describe('넘침 검출 (게이트용)', () => {
  it('현재 청사진의 알려진 넘침을 수치로 잡는다', () => {
    // TH7이 산출물 실물에서 적발한 두 건. 게이트가 이걸 잡아야 한다.
    expect(overflowAmount('한 줄로 말하는 약속', 126, { width: 920, height: 220 })).toBeGreaterThan(0)
    expect(
      overflowAmount('숫자가 무엇을 뜻하는지 한 문장으로 설명합니다.', 189, { width: 1000, height: 420 }),
    ).toBeGreaterThan(0)
  })

  it('맞춘 결과에는 넘침이 없다', () => {
    const box = { width: 920, height: 220 }
    const fitted = fitText('한 줄로 말하는 약속', box)
    for (const line of fitted.lines) {
      expect(overflowAmount(line, fitted.fontSize, box)).toBe(0)
    }
  })
})
