import { formatPackCatalog } from './blueprints/registry.js'
import type { TemplateBlueprint, TemplateFormat } from './types.js'

/**
 * 인쇄 규격 — 재단 크기·도련(bleed)·안전영역(safe area).
 *
 * 근거: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md`,
 * `research/2026-07-20-template-production-hardening-print-spec.md`
 * - 한국 명함은 두 표준이 공존한다: 90×50mm(전통, 금융·법률·공공 선호)와
 *   85×55mm(카드지갑 규격, IT·디자인·스타트업 선호). 비율이 1.8 대 1.545로 다르다.
 * - 도련과 안전영역은 두 규격 모두 사방 3mm(≈0.125in)로 같다.
 *
 * **TH11에서 방향이 뒤집혔다.** 그전에는 청사진 px가 정본이고 규격을 종횡비로 역추론했다.
 * 이제 청사진이 자기 규격을 선언하고 px가 거기서 파생된다 — 그러지 않으면
 * 1050×600px가 90mm인지 88.9mm인지 코드가 답할 수 없어 인쇄 파일을 만들지 못한다.
 */

export const MM_PER_INCH = 25.4

/** 인쇄 발주 표준 해상도. 출처: 리서치 6.1 (Venngage / 파란디자인, 접근 2026-07-20). */
export const PRINT_DPI = 300

/**
 * mm → 인쇄 px. `px = mm / 25.4 × dpi` (리서치 6.2 — 2개 출처 일치).
 *
 * 300dpi에서 1mm ≈ 11.811px. **절대 환산의 유일한 출처**다.
 */
export function mmToPrintPx(mm: number, dpi: number = PRINT_DPI): number {
  return Math.round((mm / MM_PER_INCH) * dpi)
}

export interface PrintSpec {
  id: string
  label: string
  /** 재단 크기(mm). */
  trim: { width: number; height: number }
  /** 도련 폭(mm) — 재단선 바깥으로 배경이 넘어가야 하는 여유. */
  bleedMm: number
  /** 안전영역 인셋(mm) — 필수 콘텐츠가 재단선에서 안쪽으로 확보해야 하는 거리. */
  safeAreaMm: number
  /**
   * 게시 여백(mm) — 액자·게시판 클립에 가려지는 바깥 띠.
   *
   * **안전영역과 다른 값이고 다른 목적이다.** 안전영역은 재단 오차 대비(3mm),
   * 게시 여백은 게시물이 물리적으로 가려지는 것 대비(15mm)다. 한 값으로 뭉개면
   * 명함을 15mm로 조이거나 포스터를 3mm로 방치하게 된다. 재단 검증에는 쓰지 않는다.
   * 출처: 리서치 4.3(포스터 게시 여백 15mm, 단일 출처).
   */
  postingMarginMm?: number
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
  ...aSeriesSpecs(),
}

/**
 * ISO 216 A계열 — 포스터·인포그래픽 인쇄의 정본 규격.
 *
 * 치수 출처: 리서치 4.1(A3 297×420 · A2 420×594 · A1 594×841mm — 국제 1 + 한국 2 교차검증),
 * A4 210×297mm. 도련 3mm는 명함과 공통(리서치 4.2, 2개 출처 일치).
 *
 * **안전영역 3mm는 유추다 — 포스터 전용 수치의 1차 출처를 찾지 못했다(리서치 4.4 "출처 확인 실패").**
 * 근거 있는 값처럼 쓰지 않기 위해 여기 남긴다: 명함의 "재단선 안쪽 3mm" 원칙이 재단 오차라는
 * 같은 물리 현상에서 나오므로 그대로 옮겼다. 실제 발주 전 인쇄소 확인 대상이다.
 */
function aSeriesSpecs(): Record<string, PrintSpec> {
  const sizes: Array<[string, number, number]> = [
    ['iso-a4', 210, 297],
    ['iso-a3', 297, 420],
    ['iso-a2', 420, 594],
    ['iso-a1', 594, 841],
  ]
  return Object.fromEntries(
    sizes.map(([id, width, height]) => [
      id,
      {
        id,
        label: `ISO ${id.slice(4).toUpperCase()} ${width}×${height}mm`,
        trim: { width, height },
        bleedMm: 3,
        safeAreaMm: 3,
        postingMarginMm: 15,
      } satisfies PrintSpec,
    ]),
  )
}

/** 종횡비 대조 허용 오차. 논리 px 반올림을 흡수할 만큼만 둔다. */
const RATIO_TOLERANCE = 0.02

export function specAspectRatio(spec: PrintSpec): number {
  return spec.trim.width / spec.trim.height
}

/**
 * 청사진이 어느 인쇄 규격인지 — **청사진의 선언을 읽는다.**
 *
 * 그전에는 종횡비로 역추론했다. 그 방식은 답을 낼 수 없는 질문이 있다:
 * 1050×600px(비율 1.75)가 90×50mm인지 88.9×50.8mm인지 종횡비만으로는 갈리지 않는다.
 * 이제 청사진이 자기 규격을 말하고, 종횡비는 그 선언을 **검증**하는 데만 쓴다.
 */
export function matchPrintSpec(blueprint: TemplateBlueprint): PrintSpec | null {
  if (blueprint.output.medium !== 'print') return null
  return printSpecs[blueprint.output.printSpecId] ?? null
}

/** 청사진 방향에 맞춘 재단 크기(mm). 세로 청사진이면 규격의 가로·세로를 바꾼다. */
export function orientedTrim(
  blueprint: TemplateBlueprint,
  spec: PrintSpec,
): { width: number; height: number } {
  const blueprintIsPortrait = blueprint.height > blueprint.width
  const specIsPortrait = spec.trim.height > spec.trim.width
  return blueprintIsPortrait === specIsPortrait
    ? { ...spec.trim }
    : { width: spec.trim.height, height: spec.trim.width }
}

/** 논리 px 1개가 몇 mm인가. 절대 환산의 다리다. */
export function mmPerLogicalPx(blueprint: TemplateBlueprint, spec: PrintSpec): number {
  return orientedTrim(blueprint, spec).width / blueprint.width
}

/**
 * 이 청사진을 실제로 인쇄할 때의 픽셀 크기(재단 크기 기준, 도련 제외).
 *
 * 리서치 검증 예시: 85×55mm → 300dpi에서 1004×650px.
 */
export function printPixelSize(
  blueprint: TemplateBlueprint,
  spec: PrintSpec,
  dpi: number = PRINT_DPI,
): { width: number; height: number } {
  const trim = orientedTrim(blueprint, spec)
  return { width: mmToPrintPx(trim.width, dpi), height: mmToPrintPx(trim.height, dpi) }
}

/** mm 길이를 이 청사진의 논리 px로 환산한다. */
export function mmToLogicalPx(blueprint: TemplateBlueprint, spec: PrintSpec, mm: number): number {
  return Math.round(mm / mmPerLogicalPx(blueprint, spec))
}

/** 규격의 안전영역 인셋을 이 청사진의 논리 px로 환산한다. */
export function safeAreaInsetPx(blueprint: TemplateBlueprint, spec: PrintSpec): number {
  return mmToLogicalPx(blueprint, spec, spec.safeAreaMm)
}

/** 도련 폭을 이 청사진의 논리 px로 환산한다. */
export function bleedPx(blueprint: TemplateBlueprint, spec: PrintSpec): number {
  return mmToLogicalPx(blueprint, spec, spec.bleedMm)
}

export type PrintSpecViolation =
  | { code: 'SAFE_AREA_VIOLATION'; slotId: string; message: string }
  | { code: 'BLEED_NOT_COVERED'; slotId: string; message: string }
  | { code: 'PRINT_SPEC_NOT_FOUND'; slotId: string; message: string }
  | { code: 'SPEC_RATIO_MISMATCH'; slotId: string; message: string }

/**
 * 선언한 규격과 실제 치수가 맞는가 — 선언이 정본이 된 만큼 거짓 선언을 잡아야 한다.
 *
 * 종횡비는 이제 규격을 **고르는** 근거가 아니라 선언을 **검증하는** 수단이다.
 */
export function validateSpecDeclaration(blueprint: TemplateBlueprint): PrintSpecViolation[] {
  if (blueprint.output.medium !== 'print') return []

  const spec = printSpecs[blueprint.output.printSpecId]
  if (!spec) {
    return [{
      code: 'PRINT_SPEC_NOT_FOUND',
      slotId: blueprint.id,
      message: `${blueprint.id}가 선언한 규격 '${blueprint.output.printSpecId}'가 없습니다.`,
    }]
  }

  const trim = orientedTrim(blueprint, spec)
  const declared = trim.width / trim.height
  const actual = blueprint.width / blueprint.height
  if (Math.abs(declared - actual) >= RATIO_TOLERANCE) {
    return [{
      code: 'SPEC_RATIO_MISMATCH',
      slotId: blueprint.id,
      message:
        `${blueprint.id}의 비율 ${actual.toFixed(3)}이 선언 규격 ${spec.id}의 ` +
        `${declared.toFixed(3)}과 다릅니다(허용 ${RATIO_TOLERANCE}).`,
    }]
  }
  return []
}

/**
 * 인쇄 규격 위반 검사.
 *
 * - **안전영역**: 필수 텍스트·이미지 슬롯은 안전영역 안에 들어와야 한다. 재단 오차로 잘린다.
 * - **도련**: 배경 도형은 재단선을 넘어 캔버스 전체를 덮어야 한다. 안 그러면 재단 오차로 흰 띠가 생긴다.
 */
export function validatePrintSpec(blueprint: TemplateBlueprint): PrintSpecViolation[] {
  const declaration = validateSpecDeclaration(blueprint)
  if (declaration.length) return declaration

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

/**
 * 이 포맷에 인쇄용 청사진이 있는가.
 *
 * 전에는 `format === 'business-card'`로 고정돼 있었다. A계열 인쇄 청사진이 생긴 지금
 * 그 상수는 거짓말이 되므로, 답을 카탈로그에서 읽는다.
 */
export function hasPrintSpecs(format: TemplateFormat): boolean {
  return formatPackCatalog.some(
    (blueprint) => blueprint.format === format && blueprint.output.medium === 'print',
  )
}

/**
 * 이 청사진의 안전 여백(논리 px) — 인쇄면 규격 mm에서, 화면이면 청사진이 선언한 px에서.
 *
 * 그전에는 `catalog.ts`의 `SAFE_AREA_INSET = 24`가 포맷·규격과 무관하게 전부에 적용됐다.
 * 명함 안전영역(3mm)과 포스터 게시 여백(15mm)이 5배 차이인데 하나의 상수로는 둘 다 틀린다.
 * 그리고 24가 어떤 mm 근거에서 나왔는지 코드 어디에도 없었다.
 */
export function safeMarginPx(blueprint: TemplateBlueprint): number {
  if (blueprint.output.medium === 'screen') return blueprint.output.safeMarginPx
  const spec = printSpecs[blueprint.output.printSpecId]
  return spec ? safeAreaInsetPx(blueprint, spec) : 0
}
