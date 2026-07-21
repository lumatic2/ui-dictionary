import { validateDocument } from '@askewly/canvas-core'
import type { TemplateProject, TemplateValidationResult } from './types.js'

const requiredContent: Record<string, string[]> = {
  'business-card': ['name', 'role', 'contact'],
  'product-poster': ['product', 'headline', 'cta'],
  infographic: ['title', 'source'],
}

/**
 * 형태 검사 — 필드를 읽기 **전에** 읽을 수 있는 모양인지 본다.
 *
 * 그전에는 형태가 깨진 입력이 `TypeError: Cannot read properties of undefined`로 터졌다.
 * 차단은 됐지만 **어디가 잘못됐는지 알 수 없다** — JSON 재가져오기 화면이 스택 트레이스를
 * 사용자에게 보여주는 셈이었다. 이제 무엇이 없는지 코드로 말한다.
 */
function shapeErrors(value: unknown): TemplateValidationResult['errors'] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [{ code: 'NOT_A_TEMPLATE_PROJECT', message: `템플릿 프로젝트가 객체가 아닙니다(${value === null ? 'null' : typeof value}).` }]
  }

  const candidate = value as Partial<TemplateProject>
  const errors: TemplateValidationResult['errors'] = []
  const isObject = (field: unknown) => field !== null && typeof field === 'object' && !Array.isArray(field)

  if (!isObject(candidate.request)) errors.push({ code: 'MISSING_REQUEST', message: 'request 필드가 없거나 객체가 아닙니다.' })
  else if (!isObject((candidate.request as { content?: unknown }).content)) {
    errors.push({ code: 'MISSING_REQUEST_CONTENT', message: 'request.content가 없거나 객체가 아닙니다.' })
  }
  if (!Array.isArray(candidate.assets)) errors.push({ code: 'MISSING_ASSETS', message: 'assets 필드가 없거나 배열이 아닙니다.' })
  if (!isObject(candidate.scene)) errors.push({ code: 'MISSING_SCENE', message: 'scene 필드가 없거나 객체가 아닙니다.' })
  else if (!isObject((candidate.scene as { nodes?: unknown }).nodes)) {
    errors.push({ code: 'MISSING_SCENE_NODES', message: 'scene.nodes가 없거나 객체가 아닙니다.' })
  }
  return errors
}

export function validateTemplateProject(project: TemplateProject): TemplateValidationResult {
  // 형태가 깨졌으면 여기서 끝낸다 — 그 뒤 검사는 전부 필드 접근이라 TypeError가 된다.
  const shape = shapeErrors(project)
  if (shape.length) return { valid: false, errors: shape }

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
