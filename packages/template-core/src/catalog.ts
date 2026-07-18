import type { TemplateBlueprint, TemplateFormat, TemplateProject } from './types.js'
import { formatPackCatalog } from './blueprints/registry.js'

export function listBlueprints(filter: { format?: TemplateFormat; density?: TemplateBlueprint['density']; ratio?: number } = {}) {
  return formatPackCatalog.filter((item) => !filter.format || item.format === filter.format)
    .filter((item) => !filter.density || item.density === filter.density)
    .filter((item) => !filter.ratio || Math.abs(item.width / item.height - filter.ratio) < 0.001)
    .sort((a, b) => a.format.localeCompare(b.format) || a.id.localeCompare(b.id))
}

export function validateFormatIntegrity(project: TemplateProject): string[] {
  const errors: string[] = []
  const { format, content } = project.request
  if (format === 'business-card' && !content.contact?.trim()) errors.push('CONTACT_REQUIRED')
  if (format === 'product-poster' && !content.cta?.trim()) errors.push('CTA_REQUIRED')
  if (format === 'infographic') {
    if (!content.source?.trim()) errors.push('SOURCE_REQUIRED')
    if (!content.stat?.match(/\d/)) errors.push('NUMERIC_VALUE_REQUIRED')
    if (!content.unit?.trim()) errors.push('UNIT_REQUIRED')
  }
  for (const node of Object.values(project.scene.nodes)) if (node.parentId && (node.bounds.x < 24 || node.bounds.y < 24 || node.bounds.x + node.bounds.width > project.request.width - 24 || node.bounds.y + node.bounds.height > project.request.height - 24) && node.kind !== 'shape') errors.push(`SAFE_AREA:${node.id}`)
  return errors
}
