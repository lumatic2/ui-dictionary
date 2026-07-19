import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import {
  bleedPx,
  hasPrintSpecs,
  matchPrintSpec,
  mmToPrintPx,
  orientedTrim,
  mmToLogicalPx,
  printPixelSize,
  printSpecs,
  safeAreaInsetPx,
  safeMarginPx,
  validatePrintSpec,
  validateSpecDeclaration,
} from './print-spec.js'
import type { TemplateBlueprint } from './types.js'

/**
 * TH2 step 3 — 인쇄 규격·도련·안전영역.
 *
 * 근거: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md`
 */

function blueprint(id: string): TemplateBlueprint {
  return formatPackCatalog.find((item) => item.id === id)!
}

describe('인쇄 규격 프리셋', () => {
  it('한국 두 표준이 서로 다른 비율로 공존한다', () => {
    const kr90 = printSpecs['kr-business-card-90x50']
    const kr85 = printSpecs['kr-business-card-85x55']

    expect(kr90.trim.width / kr90.trim.height).toBeCloseTo(1.8, 2)
    expect(kr85.trim.width / kr85.trim.height).toBeCloseTo(1.545, 2)
    // 두 규격 모두 도련·안전영역은 사방 3mm로 같다.
    expect(kr90.bleedMm).toBe(3)
    expect(kr85.bleedMm).toBe(3)
    expect(kr90.safeAreaMm).toBe(3)
    expect(kr85.safeAreaMm).toBe(3)
  })

  it('가로 명함은 미국 3.5×2in 규격에 대응된다', () => {
    // 1050/600 = 1.75 — 한국 두 표준(1.8 / 1.545) 어느 쪽도 아니다.
    expect(matchPrintSpec(blueprint('business-card-minimal'))?.id).toBe('us-business-card-3.5x2')
  })

  it('세로 명함은 한국 90×50 규격을 세운 것으로 대응된다', () => {
    // 600/1050 = 0.571 ≈ 50/90 = 0.556. 규격은 방향과 직교하므로 세로도 대응된다.
    expect(matchPrintSpec(blueprint('business-card-vertical'))?.id).toBe('kr-business-card-90x50')
  })

  it('명함이 아닌 포맷은 규격 대응이 없다', () => {
    expect(matchPrintSpec(blueprint('infographic-stats'))).toBeNull()
    expect(validatePrintSpec(blueprint('infographic-stats'))).toEqual([])
  })

  it('mm 단위 인셋이 청사진 논리 px로 환산된다', () => {
    const vertical = blueprint('business-card-vertical')
    const spec = printSpecs['kr-business-card-90x50']

    // 짧은 변 600px = 50mm → 3mm ≈ 36px
    expect(safeAreaInsetPx(vertical, spec)).toBe(36)
    expect(bleedPx(vertical, spec)).toBe(36)
  })
})

describe('인쇄 규격 위반 검사', () => {
  it('현 명함 청사진 2종은 규격 위반이 없다', () => {
    expect(validatePrintSpec(blueprint('business-card-minimal'))).toEqual([])
    expect(validatePrintSpec(blueprint('business-card-vertical'))).toEqual([])
  })

  it('필수 슬롯을 재단선 가까이 옮기면 안전영역 위반으로 거부한다', () => {
    const base = blueprint('business-card-vertical')
    const tampered: TemplateBlueprint = {
      ...structuredClone(base),
      slots: base.slots.map((slot) =>
        // 안전영역 36px 안쪽인 12px 지점으로 이름 슬롯을 민다.
        slot.id === 'name' ? { ...slot, bounds: { ...slot.bounds, x: 12 } } : slot,
      ),
    }

    const violations = validatePrintSpec(tampered)
    expect(violations).toHaveLength(1)
    expect(violations[0]).toMatchObject({ code: 'SAFE_AREA_VIOLATION', slotId: 'name' })
  })

  it('배경 도형이 재단선까지 덮지 않으면 도련 위반으로 거부한다', () => {
    const base = blueprint('business-card-vertical')
    const tampered: TemplateBlueprint = {
      ...structuredClone(base),
      slots: base.slots.map((slot) =>
        slot.id === 'backdrop'
          ? { ...slot, bounds: { x: 10, y: 10, width: 580, height: 1030 } }
          : slot,
      ),
    }

    const violations = validatePrintSpec(tampered)
    expect(violations).toHaveLength(1)
    expect(violations[0]).toMatchObject({ code: 'BLEED_NOT_COVERED', slotId: 'backdrop' })
  })

  it('accent rail 같은 부분 도형은 도련 대상이 아니다', () => {
    // business-card-minimal의 accent는 32×600 — 캔버스를 덮으려는 배경이 아니다.
    const violations = validatePrintSpec(blueprint('business-card-minimal'))
    expect(violations.filter((item) => item.slotId === 'accent')).toEqual([])
  })

  it('선택 슬롯은 안전영역 검사 대상이 아니다', () => {
    const base = blueprint('business-card-vertical')
    const tampered: TemplateBlueprint = {
      ...structuredClone(base),
      slots: base.slots.map((slot) =>
        // portrait는 required: false — 재단선 밖으로 나가도(full-bleed 의도) 막지 않는다.
        slot.id === 'portrait' ? { ...slot, bounds: { x: 0, y: 0, width: 600, height: 400 } } : slot,
      ),
    }

    expect(validatePrintSpec(tampered).filter((item) => item.slotId === 'portrait')).toEqual([])
  })
})

describe('절대 mm 계약 (TH11)', () => {
  it('mm→인쇄 px가 리서치 수치와 일치한다', () => {
    // 리서치 6.2 검증 예시: 300dpi에서 85×55mm → 1004×650px
    expect(mmToPrintPx(85)).toBe(1004)
    expect(mmToPrintPx(55)).toBe(650)
    expect(mmToPrintPx(210)).toBe(2480) // A4 폭
    expect(mmToPrintPx(297)).toBe(3508) // A4 높이
  })

  it('규격을 종횡비로 추론하지 않고 선언에서 읽는다', () => {
    // 이게 결함의 정체였다 — 1050×600(비율 1.75)은 두 규격 오차 안에 다 들어온다.
    const minimal = blueprint('business-card-minimal')
    expect(matchPrintSpec(minimal)?.id).toBe('us-business-card-3.5x2')
    expect(minimal.output.medium).toBe('print')
  })

  it('화면용 청사진은 인쇄 규격을 갖지 않는다', () => {
    const poster = blueprint('product-poster-hero')
    expect(poster.output.medium).toBe('screen')
    expect(matchPrintSpec(poster)).toBeNull()
    // 왜 인쇄 규격이 아닌지 이유가 남아 있다.
    if (poster.output.medium === 'screen') expect(poster.output.reason).toContain('소셜')
  })

  it('세로 청사진은 규격 치수를 방향에 맞춰 뒤집는다', () => {
    const vertical = blueprint('business-card-vertical')
    const spec = matchPrintSpec(vertical)!
    expect(orientedTrim(vertical, spec)).toEqual({ width: 50, height: 90 })
    expect(printPixelSize(vertical, spec)).toEqual({ width: 591, height: 1063 })
  })

  it('안전 여백이 규격 mm에서 나온다 (px 고정 상수 아님)', () => {
    // 그전에는 전 포맷이 24px 고정이었다. 이제 규격마다 다르다.
    expect(safeMarginPx(blueprint('business-card-minimal'))).toBe(38)
    expect(safeMarginPx(blueprint('business-card-vertical'))).toBe(36)
    // 화면용은 청사진이 직접 선언한 px를 쓴다.
    expect(safeMarginPx(blueprint('product-poster-hero'))).toBe(24)
  })

  it('없는 규격을 선언하면 거부한다', () => {
    const fake = { ...blueprint('business-card-minimal'), output: { medium: 'print' as const, printSpecId: 'nope' } }
    expect(validateSpecDeclaration(fake).map((v) => v.code)).toEqual(['PRINT_SPEC_NOT_FOUND'])
  })

  it('선언한 규격과 비율이 어긋나면 거부한다', () => {
    // 선언이 정본이 된 만큼 거짓 선언을 잡아야 한다.
    const lying = { ...blueprint('business-card-minimal'), width: 1050, height: 300 }
    expect(validateSpecDeclaration(lying).map((v) => v.code)).toEqual(['SPEC_RATIO_MISMATCH'])
    expect(validatePrintSpec(lying).map((v) => v.code)).toEqual(['SPEC_RATIO_MISMATCH'])
  })

  it('카탈로그의 모든 청사진이 출력 매체를 선언한다', () => {
    for (const item of formatPackCatalog) {
      expect(['print', 'screen']).toContain(item.output.medium)
      expect(validateSpecDeclaration(item)).toEqual([])
    }
  })
})

describe('종횡비 추론은 답을 낼 수 없다 (TH11 — 계약이 존재하는 이유)', () => {
  const TOLERANCE = 0.02
  const withinTolerance = (ratio: number) =>
    Object.values(printSpecs).filter((spec) => {
      const landscape = spec.trim.width / spec.trim.height
      return Math.abs(ratio - landscape) < TOLERANCE || Math.abs(ratio - 1 / landscape) < TOLERANCE
    })

  it('세로 명함 비율은 두 규격에 동시에 들어맞는다', () => {
    // 600×1050(0.5714)은 kr-90x50(0.5556)과 us-3.5x2(0.5714) 양쪽 오차 안이다.
    // 종횡비만 보면 어느 쪽인지 **고를 수 없다** — 순서에 따라 답이 달라진다.
    const candidates = withinTolerance(600 / 1050)
    expect(candidates.length).toBeGreaterThan(1)
    expect(candidates.map((spec) => spec.id)).toEqual(
      expect.arrayContaining(['kr-business-card-90x50', 'us-business-card-3.5x2']),
    )
  })

  it('같은 치수라도 선언이 다르면 다른 규격이 나온다', () => {
    const base = blueprint('business-card-vertical')
    const asKorean = matchPrintSpec(base)
    const asAmerican = matchPrintSpec({
      ...base,
      output: { medium: 'print' as const, printSpecId: 'us-business-card-3.5x2' },
    })
    // 치수는 같은데 규격이 다르다 — 종횡비 추론으로는 불가능한 구별이다.
    expect(asKorean?.id).toBe('kr-business-card-90x50')
    expect(asAmerican?.id).toBe('us-business-card-3.5x2')
    // 그리고 인쇄 px가 실제로 달라진다.
    expect(printPixelSize(base, asKorean!)).not.toEqual(printPixelSize(base, asAmerican!))
  })
})

describe('A계열 프리셋과 인쇄판 (TH11 step-2)', () => {
  const aSeries = ['iso-a4', 'iso-a3', 'iso-a2', 'iso-a1']

  it('A계열 치수가 ISO 216 비율(1:√2)을 따른다', () => {
    // 프리셋 값이 리서치 수치 그대로인지 — 데이터 자체를 검사한다.
    for (const id of aSeries) {
      const { trim } = printSpecs[id]
      expect(trim.height / trim.width, `${id}`).toBeCloseTo(Math.SQRT2, 2)
    }
    expect(printSpecs['iso-a3'].trim).toEqual({ width: 297, height: 420 })
    expect(printSpecs['iso-a2'].trim).toEqual({ width: 420, height: 594 })
    expect(printSpecs['iso-a1'].trim).toEqual({ width: 594, height: 841 })
  })

  it('A계열 인쇄 px가 300dpi 환산과 일치한다', () => {
    const a3 = blueprint('product-poster-print-a3')
    expect(printPixelSize(a3, matchPrintSpec(a3)!)).toEqual({ width: 3508, height: 4961 })
  })

  it('모든 포맷에 인쇄판이 있다', () => {
    for (const format of ['business-card', 'product-poster', 'infographic'] as const) {
      expect(hasPrintSpecs(format), format).toBe(true)
    }
  })

  it('인포그래픽 인쇄판이 A계열을 차용한다 — 산문이 아니라 규격 id로', () => {
    const print = blueprint('infographic-print-a4')
    expect(print.output).toEqual({ medium: 'print', printSpecId: 'iso-a4' })
    // 인포그래픽 고유 규격은 없다(리서치 5.1) — 포스터와 같은 A계열 표를 공유한다.
    expect(matchPrintSpec(print)).toBe(printSpecs['iso-a4'])
  })

  it('소셜 비율 청사진은 보존되고 여전히 화면용이다', () => {
    for (const id of ['product-poster-hero', 'product-poster-editorial']) {
      const social = blueprint(id)
      expect(social.width / social.height).toBeCloseTo(0.8, 3)
      expect(matchPrintSpec(social)).toBeNull()
    }
  })

  it('게시 여백과 안전영역은 다른 값이다 — 한 값으로 뭉개지 않는다', () => {
    const a3 = printSpecs['iso-a3']
    expect(a3.safeAreaMm).toBe(3)
    expect(a3.postingMarginMm).toBe(15)
    // 안전 여백 계산은 게시 여백을 쓰지 않는다(재단 오차 대비 값만 쓴다).
    const poster = blueprint('product-poster-print-a3')
    expect(safeMarginPx(poster)).toBe(safeAreaInsetPx(poster, a3))
    expect(safeMarginPx(poster)).toBeLessThan(mmToLogicalPx(poster, a3, 15))
  })

  it('A계열 비율에서 벗어난 치수에 A3를 선언하면 거부한다', () => {
    // 실패 probe — 소셜 4:5(0.800) 판에 A3(0.707)를 붙여본다.
    const lying: TemplateBlueprint = {
      ...blueprint('product-poster-hero'),
      output: { medium: 'print', printSpecId: 'iso-a3' },
    }
    expect(validateSpecDeclaration(lying).map((v) => v.code)).toEqual(['SPEC_RATIO_MISMATCH'])
  })

  it('인쇄판 청사진은 규격 위반이 없다', () => {
    expect(validatePrintSpec(blueprint('product-poster-print-a3'))).toEqual([])
    expect(validatePrintSpec(blueprint('infographic-print-a4'))).toEqual([])
  })
})
