/**
 * 슬라이드 규격 계약 — 확정 사실만으로 선다.
 *
 * 근거: `research/2026-07-22-design-output-gates-slide-spec.md`
 *
 * 이 파일이 `print-spec.ts`와 다른 점은 **근거의 두께가 항목마다 다르다는 것**이다.
 * 캔버스 치수와 WCAG 대비는 공식 문서로 확정되지만, 슬라이드 "규칙"으로 통용되는
 * 것 대부분(안전영역 90/93%, 본문 24/30pt, 6×6)은 1차 출처가 없거나 아예 다른
 * 도메인(방송 표준)에서 차용됐다.
 *
 * 그래서 검증이 **두 함수로 갈라져 있다**: `validateSlideDeclaration`(확정 사실, 기본 on)과
 * `checkSlideHeuristics`(통설·유추, 기본 off). 하나로 합치면 통설이 확정 사실인 척
 * 슬며시 켜진다 — 리서치가 지목한 이 계약의 가장 큰 위험이다.
 *
 * 그리고 `print-spec.ts`와 같은 점: **비율 일치가 규격 일치를 보증하지 않는다.**
 * 명함이 90×50과 85×55로 갈리듯, "16:9 슬라이드"도 13.333in와 10in로 갈린다.
 */

/**
 * 값의 근거가 얼마나 두꺼운가.
 *
 * - `confirmed` — 1차 출처(표준 문서·공식 벤더 문서)로 확인
 * - `inferred`  — 다른 도메인의 표준을 유추 적용했거나 2차 출처만 있음
 * - `folklore`  — 널리 쓰이지만 1차 실증이 없는 관행
 */
export type EvidenceGrade = 'confirmed' | 'inferred' | 'folklore'

export type SlideTool = 'powerpoint' | 'google-slides' | 'keynote'

export interface SlidePreset {
  id: string
  label: string
  tool: SlideTool
  /** 도구 네이티브 단위의 캔버스 크기. PowerPoint·Google Slides는 in, Keynote는 px. */
  canvas: { width: number; height: number; unit: 'in' | 'px' }
  /** 표기용 비율 이름. 실제 검증은 이 문자열이 아니라 canvas 값으로 한다. */
  aspectLabel: '16:9' | '4:3'
  evidenceGrade: EvidenceGrade
  /** 근거 출처 — 리서치가 1차 인용한 문서. */
  source: string
}

/**
 * 캔버스 프리셋 레지스트리.
 *
 * **어느 것도 코드가 자동 선택하지 않는다.** 세 도구·다섯 프리셋의 절대 치수가 서로
 * 달라서(16:9 안에서도 1.333배 차이) 암묵 기본값을 두면 틀린 캔버스로 만들고도
 * 통과한다. 청사진이 자기 프리셋을 **선언**하고 이 표는 그 선언을 검증한다 —
 * `print-spec.ts`의 "선언이 정본" 패턴과 같다.
 *
 * 등재 순서상 첫 항목이 PowerPoint Widescreen인 것은 그것이 그 도구의 명시적
 * 기본값(2013~)이라 문서 예시에 먼저 쓰기 때문이지, 코드가 고르는 값이어서가 아니다.
 */
export const slidePresets: Record<string, SlidePreset> = {
  // 출처: Microsoft Support, "Change the size of your PowerPoint slides"
  // https://support.microsoft.com/en-us/office/change-the-size-of-your-powerpoint-slides-040a811c-be43-40b9-8d04-0de5ed79987e (접속 2026-07-22, 1차)
  'pptx-widescreen-16-9': {
    id: 'pptx-widescreen-16-9',
    label: 'PowerPoint Widescreen 13.333×7.5in (2013~ 기본값)',
    tool: 'powerpoint',
    canvas: { width: 13.333, height: 7.5, unit: 'in' },
    aspectLabel: '16:9',
    evidenceGrade: 'confirmed',
    source: 'Microsoft Support — Change the size of your PowerPoint slides (2026-07-22)',
  },
  // 같은 공식 페이지의 **별도** 프리셋. 비율은 Widescreen과 같고 절대 치수가 다르다.
  'pptx-onscreen-16-9': {
    id: 'pptx-onscreen-16-9',
    label: 'PowerPoint On-screen Show (16:9) 10×5.625in',
    tool: 'powerpoint',
    canvas: { width: 10, height: 5.625, unit: 'in' },
    aspectLabel: '16:9',
    evidenceGrade: 'confirmed',
    source: 'Microsoft Support — Change the size of your PowerPoint slides (2026-07-22)',
  },
  'pptx-standard-4-3': {
    id: 'pptx-standard-4-3',
    label: 'PowerPoint Standard 4:3 10×7.5in (2010 이전 기본값)',
    tool: 'powerpoint',
    canvas: { width: 10, height: 7.5, unit: 'in' },
    aspectLabel: '4:3',
    evidenceGrade: 'confirmed',
    source: 'Microsoft Support — Change the size of your PowerPoint slides (2026-07-22)',
  },
  // 공식 페이지는 프리셋 **이름만** 밝히고 수치를 쓰지 않는다. 960×540px·10×5.625in은
  // 2차 출처(plusai)에서만 확인돼 confirmed 로 올리지 않는다.
  'gslides-default-16-9': {
    id: 'gslides-default-16-9',
    label: 'Google Slides 기본 16:9 960×540px (10×5.625in)',
    tool: 'google-slides',
    canvas: { width: 960, height: 540, unit: 'px' },
    aspectLabel: '16:9',
    evidenceGrade: 'inferred',
    source: 'Google Docs Editors Help(프리셋 이름) + plusai(수치, 2차) (2026-07-22)',
  },
  // Apple 공식 문서에서 기본값을 명시한 1차 출처를 찾지 못했다 — 다수 2차 출처 일치.
  'keynote-16-9': {
    id: 'keynote-16-9',
    label: 'Keynote 16:9 1920×1080px',
    tool: 'keynote',
    canvas: { width: 1920, height: 1080, unit: 'px' },
    aspectLabel: '16:9',
    evidenceGrade: 'inferred',
    source: 'Indezine · aspectratiocalculator (2차 다수 일치, Apple 1차 확인 실패) (2026-07-22)',
  },
}

/** 종횡비 대조 허용 오차. 13.333 같은 반올림 치수를 흡수할 만큼만 둔다. */
const SLIDE_RATIO_TOLERANCE = 0.01

export function presetAspectRatio(preset: SlidePreset): number {
  return preset.canvas.width / preset.canvas.height
}

export interface SlideDeclaration {
  /** 청사진이 선언한 프리셋 id. */
  presetId: string
  /** 실제 캔버스 크기(단위 무관 — 비율만 본다). */
  width: number
  height: number
}

export type SlideSpecViolation =
  | { code: 'SLIDE_PRESET_NOT_FOUND'; presetId: string; message: string }
  | { code: 'SLIDE_RATIO_MISMATCH'; presetId: string; message: string }

/**
 * 선언한 프리셋과 실제 치수가 맞는가.
 *
 * 절대 치수를 강제하지 않고 비율만 보는 이유: 같은 프리셋을 2배 해상도로 내보내는 것은
 * 정상이고(1280×720 ↔ 1920×1080), 그것까지 위반으로 잡으면 규칙이 실무를 이긴다.
 * 잡아야 할 것은 **16:9라고 선언하고 4:3으로 만든 것**이다.
 */
export function validateSlideDeclaration(declaration: SlideDeclaration): SlideSpecViolation[] {
  const preset = slidePresets[declaration.presetId]
  if (!preset) {
    return [{
      code: 'SLIDE_PRESET_NOT_FOUND',
      presetId: declaration.presetId,
      message: `선언한 슬라이드 프리셋 '${declaration.presetId}'가 레지스트리에 없습니다.`,
    }]
  }

  const declared = presetAspectRatio(preset)
  const actual = declaration.width / declaration.height
  if (Math.abs(declared - actual) >= SLIDE_RATIO_TOLERANCE) {
    return [{
      code: 'SLIDE_RATIO_MISMATCH',
      presetId: preset.id,
      message:
        `비율 ${actual.toFixed(3)}이 선언 프리셋 ${preset.id}의 ` +
        `${declared.toFixed(3)}과 다릅니다(허용 ${SLIDE_RATIO_TOLERANCE}).`,
    }]
  }
  return []
}

/* ------------------------------------------------------------------------- *
 * 대비 — WCAG 값을 그대로 쓴다
 *
 * 인쇄물과 달리 슬라이드는 화면 표시와 최종 매체가 물리적으로 다르지 않다(둘 다
 * 발광형 디스플레이 또는 투사). 그래서 별도 규격을 발명하지 않는다 — Microsoft
 * 자신이 PowerPoint 접근성 가이드에서 WCAG 값을 그대로 채택한다.
 *
 * 출처: W3C Understanding SC 1.4.3 (접속 2026-07-22, 1차)
 *       Microsoft Support — Make your PowerPoint presentations accessible (접속 2026-07-22, 1차)
 *
 * ⚠ "프로젝터는 어두워 보이니 대비를 더 확보하라"는 방향은 실무적으로 합리적이지만
 * 정량 보정 계수의 출처를 찾지 못했다. 그래서 **코드화하지 않았다** — 임계값을 지어내면
 * 근거 없는 숫자가 근거 있는 검사기 안에서 돈다.
 * ------------------------------------------------------------------------- */

/** WCAG AA — 일반 텍스트. */
export const WCAG_AA_NORMAL = 4.5
/** WCAG AA — 큰 텍스트(18pt 이상, 또는 14pt 이상 bold). */
export const WCAG_AA_LARGE = 3

function parseHex(color: string): [number, number, number] {
  const hex = color.trim().replace(/^#/, '')
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`색을 읽을 수 없습니다: ${color}`)
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

/**
 * 상대 휘도 — WCAG 2.1 공식 그대로.
 *
 * 감마 보정(sRGB → linear)이 이 계산의 핵심이다. 채널값을 그냥 평균 내면
 * 사람 눈이 보는 밝기와 어긋나 대비값이 통째로 틀린다.
 */
function relativeLuminance(color: string): number {
  const [r, g, b] = parseHex(color).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** 두 색의 대비비. 순서는 무관하다(밝은 쪽이 분자로 간다). */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  const [light, dark] = a >= b ? [a, b] : [b, a]
  return (light + 0.05) / (dark + 0.05)
}

export interface TextSizing {
  /** 글자 크기(pt). */
  fontSizePt: number
  bold?: boolean
}

/** 이 크기의 텍스트에 적용되는 WCAG AA 임계값. */
export function wcagThresholdFor(text: TextSizing): number {
  const isLarge = text.fontSizePt >= 18 || (text.bold === true && text.fontSizePt >= 14)
  return isLarge ? WCAG_AA_LARGE : WCAG_AA_NORMAL
}

export function meetsWcagContrast(
  foreground: string,
  background: string,
  text: TextSizing,
): boolean {
  return contrastRatio(foreground, background) >= wcagThresholdFor(text)
}
