import type { CanvasDocument } from '@askewly/canvas-core'

export const templateFormats = ['business-card', 'product-poster', 'infographic'] as const
export type TemplateFormat = typeof templateFormats[number]

export interface TemplateRequest {
  id: string
  format: TemplateFormat
  width: number
  height: number
  tokenSetId: string
  content: Record<string, string>
  /**
   * 반복 유닛용 목록 데이터. `content`는 평평한 key→값이라 "비교 카드 N개"·"타임라인 N단계"
   * 같은 반복 구조를 담지 못한다. 청사진의 `repeatGroups[].listKey`가 여기를 가리킨다.
   */
  lists?: Record<string, Array<Record<string, string>>>
}

export interface AssetManifestEntry {
  id: string
  uri: string
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml'
  width: number
  height: number
  provenance: { provider: 'local' | 'stock' | 'generated'; source: string }
  role?: string
}

export type TemplateSlotKind = 'text' | 'image' | 'shape'

export interface TemplateSlot {
  id: string
  kind: TemplateSlotKind
  contentKey?: string
  assetRole?: string
  required: boolean
  bounds: { x: number; y: number; width: number; height: number }
  tokenBindings: Record<string, string>
  maxChars?: number
  /** 허용 줄 수. 미선언이면 슬롯 높이가 허용하는 만큼 — 헤드라인처럼 줄 수를 통제할 때 쓴다. */
  maxLines?: number
  shape?: 'rectangle' | 'ellipse' | 'line'
}

/**
 * 반복 유닛 그룹 — 같은 구조의 슬롯 묶음을 목록 길이만큼 되풀이한다.
 *
 * 단일 초점(big-stat)과 다중 병렬(비교·타임라인)은 슬롯 **개수와 반복 구조** 자체가
 * 다르므로 좌표 변형으로 흉내낼 수 없다. 이 타입이 그 구조 차이를 표현한다.
 */
export interface TemplateRepeatGroup {
  id: string
  /** `TemplateRequest.lists`의 키. */
  listKey: string
  /** 유닛 전체가 배치될 영역(캔버스 절대 좌표). */
  bounds: { x: number; y: number; width: number; height: number }
  /** 유닛을 늘어놓는 축. */
  axis: 'horizontal' | 'vertical'
  /** 유닛 사이 간격(px). */
  gap: number
  minUnits: number
  maxUnits: number
  /** 유닛 하나의 내부 슬롯. `bounds`는 유닛 로컬 좌표이며 컴파일 시 절대 좌표로 옮겨진다. */
  unitSlots: TemplateSlot[]
}

/**
 * 이 청사진이 무엇을 위한 판인가 — **모든 청사진이 선언해야 한다.**
 *
 * 침묵을 허용하지 않는 이유: 인쇄용인지 화면용인지 코드가 모르면 도련·안전영역을
 * 어디서 가져와야 할지도 모른다. 그전에는 포맷 무관 px 상수 하나로 전부 처리했다.
 */
export type BlueprintOutput =
  /** 인쇄용 — 규격(mm)이 정본이고 논리 px가 거기서 파생된다. */
  | { medium: 'print'; printSpecId: string }
  /**
   * 화면용 — mm 규격이 없다. 안전 여백은 청사진이 px로 직접 선언한다.
   * `reason`은 왜 인쇄 규격을 따르지 않는지를 남긴다(예: 소셜 비율).
   */
  | { medium: 'screen'; reason: string; safeMarginPx: number }

export interface TemplateBlueprint {
  id: string
  format: TemplateFormat
  /** 인쇄용인가 화면용인가. 선언하지 않는 청사진은 없다. */
  output: BlueprintOutput
  width: number
  height: number
  density: 'compact' | 'balanced' | 'airy'
  priority: number
  /** 그리드 열 수. 같은 포맷의 두 청사진을 구조적으로 가르는 축 중 하나다. */
  gridColumns: number
  slots: TemplateSlot[]
  repeatGroups?: TemplateRepeatGroup[]
}

export interface TemplateProject {
  schemaVersion: 1
  request: TemplateRequest
  assets: AssetManifestEntry[]
  scene: CanvasDocument
}

export interface TemplateValidationResult {
  valid: boolean
  errors: Array<{ code: string; message: string }>
}
