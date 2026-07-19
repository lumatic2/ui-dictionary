import type { TemplateBlueprint, TemplateFormat } from './types.js'

/**
 * 인쇄 규격 — 재단 크기·도련(bleed)·안전영역(safe area).
 *
 * 근거: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md`
 * - 한국 명함은 두 표준이 공존한다: 90×50mm(전통, 금융·법률·공공 선호)와
 *   85×55mm(카드지갑 규격, IT·디자인·스타트업 선호). 비율이 1.8 대 1.545로 다르다.
 * - 도련과 안전영역은 두 규격 모두 사방 3mm(≈0.125in)로 같다.
 *
 * 규격 프리셋은 청사진의 **방향 축과 직교**한다 — 가로/세로 어느 쪽이든 두 규격을 다 쓸 수 있다.
 * 그래서 청사진을 늘리는 축으로 쓰지 않고 검증 규칙으로만 인코딩한다.
 */

/** 렌더 좌표는 px다. 300dpi 기준 1mm ≈ 11.811px이지만, 청사진은 논리 px로 작성되므로
 *  규격 대조는 **종횡비**로 하고 도련·안전영역은 캔버스 짧은 변 대비 비율로 환산한다. */
export const MM_PER_INCH = 25.4

export interface PrintSpec {
  id: string
  label: string
  /** 재단 크기(mm). */
  trim: { width: number; height: number }
  /** 도련 폭(mm) — 재단선 바깥으로 배경이 넘어가야 하는 여유. */
  bleedMm: number
  /** 안전영역 인셋(mm) — 필수 콘텐츠가 재단선에서 안쪽으로 확보해야 하는 거리. */
  safeAreaMm: number
}

export const printSpecs: Record<string, PrintSpec> = {
  'kr-business-card-90x50': {
    id: 'kr-business-card-90x50',
    label: '한국 표준 명함 90×50mm',
    trim: { width: 90, height: 50 },
    bleedMm: 3,
    safeAreaMm: 3,
  },
  'kr-business-card-85x55': {
    id: 'kr-business-card-85x55',
    label: '한국 카드지갑 규격 명함 85×55mm',
    trim: { width: 85, height: 55 },
    bleedMm: 3,
    safeAreaMm: 3,
  },
  // 현 `business-card-minimal`(1050×600, 비율 1.75)이 실제로 따르는 규격.
  // 한국 두 표준(1.8 / 1.545)과 모두 다르다 — 리서치가 기록한 미국/캐나다 규격이다.
  'us-business-card-3.5x2': {
    id: 'us-business-card-3.5x2',
    label: '미국·캐나다 명함 3.5×2in (88.9×50.8mm)',
    trim: { width: 88.9, height: 50.8 },
    bleedMm: 3.175,
    safeAreaMm: 3.175,
  },
}

/** 종횡비 대조 허용 오차. 논리 px 반올림을 흡수할 만큼만 둔다. */
const RATIO_TOLERANCE = 0.02

export function specAspectRatio(spec: PrintSpec): number {
  return spec.trim.width / spec.trim.height
}

/**
 * 청사진이 어느 인쇄 규격에 해당하는지 — 가로/세로 양쪽을 다 본다.
 * 어느 규격과도 맞지 않으면 `null`(자유 비율 청사진).
 */
export function matchPrintSpec(blueprint: TemplateBlueprint): PrintSpec | null {
  const ratio = blueprint.width / blueprint.height

  for (const spec of Object.values(printSpecs)) {
    const landscape = specAspectRatio(spec)
    const portrait = 1 / landscape
    if (Math.abs(ratio - landscape) < RATIO_TOLERANCE) return spec
    if (Math.abs(ratio - portrait) < RATIO_TOLERANCE) return spec
  }
  return null
}

/** 규격의 안전영역 인셋을 이 청사진의 논리 px로 환산한다. */
export function safeAreaInsetPx(blueprint: TemplateBlueprint, spec: PrintSpec): number {
  const shortEdgePx = Math.min(blueprint.width, blueprint.height)
  const shortEdgeMm = Math.min(spec.trim.width, spec.trim.height)
  return Math.round((spec.safeAreaMm / shortEdgeMm) * shortEdgePx)
}

/** 도련 폭을 이 청사진의 논리 px로 환산한다. */
export function bleedPx(blueprint: TemplateBlueprint, spec: PrintSpec): number {
  const shortEdgePx = Math.min(blueprint.width, blueprint.height)
  const shortEdgeMm = Math.min(spec.trim.width, spec.trim.height)
  return Math.round((spec.bleedMm / shortEdgeMm) * shortEdgePx)
}

export type PrintSpecViolation =
  | { code: 'SAFE_AREA_VIOLATION'; slotId: string; message: string }
  | { code: 'BLEED_NOT_COVERED'; slotId: string; message: string }

/**
 * 인쇄 규격 위반 검사.
 *
 * - **안전영역**: 필수 텍스트·이미지 슬롯은 안전영역 안에 들어와야 한다. 재단 오차로 잘린다.
 * - **도련**: 배경 도형은 재단선을 넘어 캔버스 전체를 덮어야 한다. 안 그러면 재단 오차로 흰 띠가 생긴다.
 */
export function validatePrintSpec(blueprint: TemplateBlueprint): PrintSpecViolation[] {
  const spec = matchPrintSpec(blueprint)
  if (!spec) return []

  const inset = safeAreaInsetPx(blueprint, spec)
  const violations: PrintSpecViolation[] = []

  for (const slot of blueprint.slots) {
    if (slot.kind === 'shape') {
      // 캔버스 전체를 덮으려는 배경 도형만 도련 대상으로 본다(accent rail 같은 부분 도형은 제외).
      const coversMostOfCanvas =
        slot.bounds.width >= blueprint.width * 0.9 && slot.bounds.height >= blueprint.height * 0.9
      if (coversMostOfCanvas) {
        const covers =
          slot.bounds.x <= 0 &&
          slot.bounds.y <= 0 &&
          slot.bounds.x + slot.bounds.width >= blueprint.width &&
          slot.bounds.y + slot.bounds.height >= blueprint.height
        if (!covers) {
          violations.push({
            code: 'BLEED_NOT_COVERED',
            slotId: slot.id,
            message: `${slot.id}는 배경인데 재단선까지 덮지 않는다 (도련 ${spec.bleedMm}mm 필요)`,
          })
        }
      }
      continue
    }

    if (!slot.required) continue

    const outside =
      slot.bounds.x < inset ||
      slot.bounds.y < inset ||
      slot.bounds.x + slot.bounds.width > blueprint.width - inset ||
      slot.bounds.y + slot.bounds.height > blueprint.height - inset

    if (outside) {
      violations.push({
        code: 'SAFE_AREA_VIOLATION',
        slotId: slot.id,
        message: `${slot.id}가 ${spec.label}의 안전영역(${spec.safeAreaMm}mm ≈ ${inset}px)을 침범한다`,
      })
    }
  }

  return violations
}

/** 이 포맷에 인쇄 규격 프리셋이 정의돼 있는가. */
export function hasPrintSpecs(format: TemplateFormat): boolean {
  return format === 'business-card'
}
