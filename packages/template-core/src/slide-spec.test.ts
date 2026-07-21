import { describe, expect, it } from 'vitest'
import {
  contrastRatio,
  meetsWcagContrast,
  presetAspectRatio,
  slidePresets,
  validateSlideDeclaration,
  wcagThresholdFor,
  WCAG_AA_LARGE,
  WCAG_AA_NORMAL,
} from './slide-spec.js'

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
