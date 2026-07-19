import { describe, expect, it } from 'vitest'
import { formatPackCatalog } from './blueprints/registry.js'
import {
  bleedPx,
  matchPrintSpec,
  printSpecs,
  safeAreaInsetPx,
  validatePrintSpec,
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
