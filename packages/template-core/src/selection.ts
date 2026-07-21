import { formatPackCatalog } from './blueprints/registry.js'
import type { TemplateBlueprint, TemplateRequest } from './types.js'

export class BlueprintSelectionError extends Error {
  constructor(public readonly code: 'UNSUPPORTED_FORMAT' | 'NO_COMPATIBLE_BLUEPRINT', message: string) { super(message) }
}

export function selectBlueprint(request: TemplateRequest, registry: TemplateBlueprint[] = formatPackCatalog): TemplateBlueprint {
  const formatCandidates = registry.filter((blueprint) => blueprint.format === request.format)
  if (formatCandidates.length === 0) throw new BlueprintSelectionError('UNSUPPORTED_FORMAT', `no blueprint pack for ${request.format}`)
  const candidates = formatCandidates.filter((blueprint) => blueprint.width === request.width && blueprint.height === request.height)
    .filter((blueprint) => blueprint.slots.every((slot) => !slot.required || slot.kind === 'shape' || slot.kind === 'image' || Boolean(slot.contentKey && request.content[slot.contentKey]?.trim())))
    .sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id))
  if (candidates.length === 0) throw new BlueprintSelectionError('NO_COMPATIBLE_BLUEPRINT', `no ${request.format} blueprint matches size and required content`)
  return candidates[0]
}
