import type { TemplateBlueprint, TemplateFormat, TemplateProject } from './types.js'
import { formatPackCatalog } from './blueprints/registry.js'

export function listBlueprints(filter: { format?: TemplateFormat; density?: TemplateBlueprint['density']; ratio?: number } = {}) {
  return formatPackCatalog.filter((item) => !filter.format || item.format === filter.format)
    .filter((item) => !filter.density || item.density === filter.density)
    .filter((item) => !filter.ratio || Math.abs(item.width / item.height - filter.ratio) < 0.001)
    .sort((a, b) => a.format.localeCompare(b.format) || a.id.localeCompare(b.id))
}

/** 재단선에서 안쪽으로 확보하는 여백(px). 필수 콘텐츠는 이 안에 들어와야 한다. */
const SAFE_AREA_INSET = 24

type Bounds = { x: number; y: number; width: number; height: number }

function violatesSafeArea(bounds: Bounds, canvasWidth: number, canvasHeight: number): boolean {
  return (
    bounds.x < SAFE_AREA_INSET ||
    bounds.y < SAFE_AREA_INSET ||
    bounds.x + bounds.width > canvasWidth - SAFE_AREA_INSET ||
    bounds.y + bounds.height > canvasHeight - SAFE_AREA_INSET
  )
}

/** 컴파일된 장면에 해당 이름의 슬롯 노드가 있는지 — 청사진별 요건을 가르는 데 쓴다. */
function hasSlotNamed(project: TemplateProject, slotId: string): boolean {
  return Object.values(project.scene.nodes).some((node) => node.name === slotId)
}

export function validateFormatIntegrity(project: TemplateProject): string[] {
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
  for (const node of Object.values(project.scene.nodes)) {
    // 배경 도형은 재단선까지 채우는 게 정상이므로 안전영역 검사에서 뺀다.
    if (!node.parentId || node.kind === 'shape') continue
    if (violatesSafeArea(node.bounds, project.request.width, project.request.height)) {
      errors.push(`SAFE_AREA:${node.id}`)
    }
  }
  return errors
}
