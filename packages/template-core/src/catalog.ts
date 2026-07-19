import type { TemplateBlueprint, TemplateFormat, TemplateProject } from './types.js'
import { formatPackCatalog } from './blueprints/registry.js'
import { safeMarginPx } from './print-spec.js'

export function listBlueprints(filter: { format?: TemplateFormat; density?: TemplateBlueprint['density']; ratio?: number } = {}) {
  return formatPackCatalog.filter((item) => !filter.format || item.format === filter.format)
    .filter((item) => !filter.density || item.density === filter.density)
    .filter((item) => !filter.ratio || Math.abs(item.width / item.height - filter.ratio) < 0.001)
    .sort((a, b) => a.format.localeCompare(b.format) || a.id.localeCompare(b.id))
}

type Bounds = { x: number; y: number; width: number; height: number }

/**
 * 안전 여백 침범 검사 — 여백은 **청사진이 소유한다**.
 *
 * 그전에는 여기 `SAFE_AREA_INSET = 24`가 있었다. 포맷·규격과 무관한 단일 px 값이라
 * 명함 안전영역(3mm)과 포스터 게시 여백(15mm)이 5배 차이인 사실을 표현할 수 없었고,
 * 24가 어떤 mm 근거에서 나왔는지도 코드에 없었다(리서치 8.1).
 */
function violatesSafeArea(bounds: Bounds, blueprint: TemplateBlueprint): boolean {
  const inset = safeMarginPx(blueprint)
  return (
    bounds.x < inset ||
    bounds.y < inset ||
    bounds.x + bounds.width > blueprint.width - inset ||
    bounds.y + bounds.height > blueprint.height - inset
  )
}

/** 컴파일된 장면에 해당 이름의 슬롯 노드가 있는지 — 청사진별 요건을 가르는 데 쓴다. */
function hasSlotNamed(project: TemplateProject, slotId: string): boolean {
  return Object.values(project.scene.nodes).some((node) => node.name === slotId)
}

/**
 * 장면이 어느 청사진에서 나왔는지 — 노드 id는 `<청사진 id>:<슬롯 id>` 규약을 따른다.
 * 못 찾으면 조용히 넘어가지 않고 호출부가 청사진을 직접 넘기게 한다.
 */
function blueprintOf(project: TemplateProject): TemplateBlueprint | null {
  const rootId = Object.values(project.scene.nodes).find((node) => !node.parentId)?.id ?? ''
  const blueprintId = rootId.split(':')[0]
  return formatPackCatalog.find((item) => item.id === blueprintId) ?? null
}

export function validateFormatIntegrity(
  project: TemplateProject,
  blueprint: TemplateBlueprint | null = blueprintOf(project),
): string[] {
  const errors: string[] = []
  const { format, content } = project.request
  if (format === 'business-card' && !content.contact?.trim()) errors.push('CONTACT_REQUIRED')
  if (format === 'product-poster' && !content.cta?.trim()) errors.push('CTA_REQUIRED')
  if (format === 'infographic') {
    // 출처 표기는 구조와 무관하게 인포그래픽의 무결성 요건이다.
    if (!content.source?.trim()) errors.push('SOURCE_REQUIRED')

    // 수치 무결성은 단일 초점(big-stat) 구조에만 해당한다. 다중 병렬(비교·타임라인)
    // 청사진은 stat 슬롯이 없으므로 쓰지 않는 필드를 요구하지 않는다.
    if (hasSlotNamed(project, 'stat')) {
      if (!content.stat?.match(/\d/)) errors.push('NUMERIC_VALUE_REQUIRED')
      if (!content.unit?.trim()) errors.push('UNIT_REQUIRED')
    }
  }
  if (!blueprint) {
    // 여백 기준을 지어내지 않는다 — 청사진을 모르면 그 사실을 오류로 낸다.
    errors.push('BLUEPRINT_UNKNOWN')
    return errors
  }

  for (const node of Object.values(project.scene.nodes)) {
    // 배경 도형은 재단선까지 채우는 게 정상이므로 안전영역 검사에서 뺀다.
    if (!node.parentId || node.kind === 'shape') continue
    if (violatesSafeArea(node.bounds, blueprint)) {
      errors.push(`SAFE_AREA:${node.id}`)
    }
  }
  return errors
}
