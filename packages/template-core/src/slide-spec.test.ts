import { describe, expect, it } from 'vitest'
import {
  checkSlideHeuristics,
  contrastRatio,
  meetsWcagContrast,
  presetAspectRatio,
  slidePresets,
  validateSlideDeclaration,
  wcagThresholdFor,
  WCAG_AA_LARGE,
  WCAG_AA_NORMAL,
} from './slide-spec.js'
import type { SlideTextRegion } from './slide-spec.js'

/**
 * DOG5 step-1 — 확정 사실만으로 서는 슬라이드 규격 계약.
 *
 * 근거: `research/2026-07-22-design-output-gates-slide-spec.md` §1(캔버스)·§5(대비)
 */

describe('캔버스 프리셋', () => {
  it('리서치 §1.4 표의 절대 치수를 그대로 담는다', () => {
    expect(slidePresets['pptx-widescreen-16-9'].canvas).toEqual({ width: 13.333, height: 7.5, unit: 'in' })
    expect(slidePresets['pptx-onscreen-16-9'].canvas).toEqual({ width: 10, height: 5.625, unit: 'in' })
    expect(slidePresets['pptx-standard-4-3'].canvas).toEqual({ width: 10, height: 7.5, unit: 'in' })
    expect(slidePresets['gslides-default-16-9'].canvas).toEqual({ width: 960, height: 540, unit: 'px' })
    expect(slidePresets['keynote-16-9'].canvas).toEqual({ width: 1920, height: 1080, unit: 'px' })
  })

  it('비율이 같아도 절대 치수가 다르다 — 이름만으로 캔버스가 정해지지 않는다', () => {
    const pptWide = slidePresets['pptx-widescreen-16-9']
    const gslides = slidePresets['gslides-default-16-9']

    // 둘 다 16:9 다.
    expect(presetAspectRatio(pptWide)).toBeCloseTo(16 / 9, 2)
    expect(presetAspectRatio(gslides)).toBeCloseTo(16 / 9, 2)

    // 그런데 PowerPoint Widescreen 은 13.333in, Google Slides 기본은 10in 다.
    // 인쇄 규격에서 90×50 과 85×55 가 갈린 것과 같은 구조 — 비율 일치는 규격 일치가 아니다.
    expect(pptWide.canvas.width).not.toBe(10)
    expect(slidePresets['pptx-onscreen-16-9'].canvas.width).toBe(10)
  })

  it('Google Slides·Keynote 는 1차 출처가 없어 confirmed 가 아니다', () => {
    expect(slidePresets['pptx-widescreen-16-9'].evidenceGrade).toBe('confirmed')
    expect(slidePresets['gslides-default-16-9'].evidenceGrade).toBe('inferred')
    expect(slidePresets['keynote-16-9'].evidenceGrade).toBe('inferred')
  })
})

describe('선언 검증', () => {
  it('선언과 실제 비율이 맞으면 위반 0건', () => {
    expect(validateSlideDeclaration({ presetId: 'pptx-widescreen-16-9', width: 1920, height: 1080 })).toEqual([])
    // 같은 프리셋의 2배 해상도도 정상 — 절대 치수가 아니라 비율을 본다.
    expect(validateSlideDeclaration({ presetId: 'gslides-default-16-9', width: 1920, height: 1080 })).toEqual([])
  })

  it('16:9 라고 선언하고 4:3 으로 만들면 잡는다', () => {
    const violations = validateSlideDeclaration({ presetId: 'pptx-widescreen-16-9', width: 1024, height: 768 })
    expect(violations).toHaveLength(1)
    expect(violations[0].code).toBe('SLIDE_RATIO_MISMATCH')
  })

  it('없는 프리셋을 선언하면 잡는다', () => {
    const violations = validateSlideDeclaration({ presetId: 'nope', width: 1920, height: 1080 })
    expect(violations).toHaveLength(1)
    expect(violations[0].code).toBe('SLIDE_PRESET_NOT_FOUND')
  })
})

describe('WCAG 대비', () => {
  it('WebAIM 공개 예시값과 일치한다 (#767676 on #FFFFFF ≈ 4.54:1)', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 1)
  })

  it('흑백이 최대 대비 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2)
  })

  it('순서를 바꿔도 같은 값', () => {
    expect(contrastRatio('#FFFFFF', '#767676')).toBeCloseTo(contrastRatio('#767676', '#FFFFFF'), 5)
  })

  it('큰 텍스트 임계와 일반 텍스트 임계가 갈린다', () => {
    expect(wcagThresholdFor({ fontSizePt: 24 })).toBe(WCAG_AA_LARGE)
    expect(wcagThresholdFor({ fontSizePt: 18 })).toBe(WCAG_AA_LARGE)
    expect(wcagThresholdFor({ fontSizePt: 14, bold: true })).toBe(WCAG_AA_LARGE)
    expect(wcagThresholdFor({ fontSizePt: 17.9 })).toBe(WCAG_AA_NORMAL)
    expect(wcagThresholdFor({ fontSizePt: 14 })).toBe(WCAG_AA_NORMAL)
    expect(wcagThresholdFor({ fontSizePt: 13, bold: true })).toBe(WCAG_AA_NORMAL)
  })

  it('같은 색 조합이 크기에 따라 통과·불통과로 갈린다', () => {
    // 3:1 은 넘고 4.5:1 은 못 넘는 회색 — 임계 분기가 실제로 결과를 바꾸는지 본다.
    const gray = '#949494'
    const ratio = contrastRatio(gray, '#FFFFFF')
    expect(ratio).toBeGreaterThan(WCAG_AA_LARGE)
    expect(ratio).toBeLessThan(WCAG_AA_NORMAL)

    expect(meetsWcagContrast(gray, '#FFFFFF', { fontSizePt: 24 })).toBe(true)
    expect(meetsWcagContrast(gray, '#FFFFFF', { fontSizePt: 12 })).toBe(false)
  })
})

/**
 * DOG5 step-2 — 통설·유추 항목은 근거 등급을 달고 옵트인으로 들어온다.
 *
 * 근거: `research/2026-07-22-design-output-gates-slide-spec.md` §2(안전영역)·§3(최소 pt)·§4(6×6)
 */

const CANVAS = { width: 1920, height: 1080 }

/** 세 규칙을 모두 어기는 fixture. */
const messy: SlideTextRegion[] = [
  {
    id: 'body-outside',
    bounds: { x: 10, y: 10, width: 1900, height: 1060 }, // title-safe 90% 밖
    fontSizePt: 8,
    role: 'body',
    bullets: [
      'one two three four five six seven eight nine ten eleven twelve',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    ],
  },
]

/** 세 규칙을 모두 지키는 fixture. */
const tidy: SlideTextRegion[] = [
  {
    id: 'body-inside',
    bounds: { x: 200, y: 200, width: 1500, height: 600 },
    fontSizePt: 28,
    role: 'body',
    bullets: ['짧은 항목 하나', '짧은 항목 둘'],
  },
]

describe('통설 항목 — 옵트인', () => {
  it('기본값에서는 명백한 위반에도 아무것도 보고하지 않는다', () => {
    expect(checkSlideHeuristics(messy, { canvas: CANVAS })).toEqual([])
  })

  it('켜면 세 규칙이 모두 보고된다', () => {
    const violations = checkSlideHeuristics(messy, { canvas: CANVAS, enable: true })
    const codes = new Set(violations.map((v) => v.code))
    expect(codes).toContain('OUTSIDE_TITLE_SAFE')
    expect(codes).toContain('BODY_TEXT_TOO_SMALL')
    expect(codes).toContain('TOO_MANY_BULLETS')
    expect(codes).toContain('BULLET_TOO_WORDY')
  })

  it('모든 위반이 근거 등급을 달고 나온다 — 확정 사실인 척 나가지 않는다', () => {
    const violations = checkSlideHeuristics(messy, { canvas: CANVAS, enable: true })
    expect(violations.length).toBeGreaterThan(0)
    for (const violation of violations) {
      expect(['inferred', 'folklore']).toContain(violation.evidenceGrade)
      expect(violation.basis.length).toBeGreaterThan(0)
    }
  })

  it('무엇도 차단하지 않는다 — severity 는 warning 뿐', () => {
    const violations = checkSlideHeuristics(messy, { canvas: CANVAS, enable: true })
    expect(violations.every((v) => v.severity === 'warning')).toBe(true)
  })

  it('규칙을 지킨 fixture 는 켜도 위반 0건', () => {
    expect(checkSlideHeuristics(tidy, { canvas: CANVAS, enable: true })).toEqual([])
  })

  it('안전영역은 방송 표준 차용이라 inferred, 나머지는 folklore', () => {
    const violations = checkSlideHeuristics(messy, { canvas: CANVAS, enable: true })
    const safe = violations.find((v) => v.code === 'OUTSIDE_TITLE_SAFE')!
    const small = violations.find((v) => v.code === 'BODY_TEXT_TOO_SMALL')!
    expect(safe.evidenceGrade).toBe('inferred')
    expect(small.evidenceGrade).toBe('folklore')
  })
})
