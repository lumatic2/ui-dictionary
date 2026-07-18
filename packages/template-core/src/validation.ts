import { validateDocument } from '@askewly/canvas-core'
import type { TemplateProject, TemplateValidationResult } from './types.js'

const requiredContent: Record<string, string[]> = {
  'business-card': ['name', 'role', 'contact'],
  'product-poster': ['product', 'headline', 'cta'],
  infographic: ['title', 'source'],
}

export function validateTemplateProject(project: TemplateProject): TemplateValidationResult {
  const errors: TemplateValidationResult['errors'] = []
  const sceneResult = validateDocument(project.scene)
  for (const message of sceneResult.errors) errors.push({ code: 'INVALID_SCENE', message })
  if (project.request.width <= 0 || project.request.height <= 0) errors.push({ code: 'INVALID_SIZE', message: 'canvas size must be positive' })
  for (const key of requiredContent[project.request.format] ?? []) {
    if (!project.request.content[key]?.trim()) errors.push({ code: 'MISSING_CONTENT', message: `${key} is required for ${project.request.format}` })
  }

  const assetIds = new Set(project.assets.map((asset) => asset.id))
  const nodes = Object.values(project.scene.nodes)
  for (const node of nodes) if (node.kind === 'image' && !assetIds.has(node.assetId)) errors.push({ code: 'BROKEN_ASSET_REFERENCE', message: `${node.id} references ${node.assetId}` })
  const hasText = nodes.some((node) => node.kind === 'text')
  const hasVisualPrimitive = nodes.some((node) => node.kind === 'image' || node.kind === 'shape')
  const hasStructure = nodes.some((node) => (node.kind === 'frame' || node.kind === 'group') && node.childIds.length > 0)
  const hasTokens = nodes.some((node) => Object.keys(node.tokenBindings).length > 0)
  if (!(hasText && hasVisualPrimitive && hasStructure && hasTokens)) {
    errors.push({ code: 'FLAT_ARTWORK_NOT_EDITABLE', message: 'template must preserve editable text, visual primitives, structure, and token bindings' })
  }
  return { valid: errors.length === 0, errors }
}

export function assertValidTemplateProject(project: TemplateProject): TemplateProject {
  const result = validateTemplateProject(project)
  if (!result.valid) throw new Error(result.errors.map((error) => `${error.code}: ${error.message}`).join('\n'))
  return project
}
