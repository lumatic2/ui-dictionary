import { compileTemplate } from './compiler.js'
import { formatPackCatalog } from './blueprints/registry.js'
import { resolveTokenSet } from './tokens.js'
import type {
  AssetManifestEntry,
  TemplateProject,
  TemplateRequest,
} from './types.js'

/**
 * 템플릿 시작점 — 청사진 하나를 골라 바로 편집 가능한 문서로 연다.
 *
 * 편집 표면(AskewlyDesign)은 "무엇을 채울지"를 아직 모르는 상태에서 캔버스를 열어야 한다.
 * 그래서 청사진별 기본 문구와 자리표시 소재를 여기서 공급한다 — 열고 나면 캔버스에서 고친다.
 *
 * 실패는 던진다. 빈 문서로 조용히 대체하면 편집 중이던 캔버스를 날리고도 이유를 못 남긴다.
 */

export type TemplateStarterErrorCode =
  | 'BLUEPRINT_NOT_FOUND'
  | 'TOKEN_SET_NOT_FOUND'
  | 'CONTENT_INCOMPLETE'

export class TemplateStarterError extends Error {
  constructor(
    readonly code: TemplateStarterErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'TemplateStarterError'
  }
}

/** 자리표시 소재 — 네트워크를 타지 않도록 data URI로 둔다. */
function placeholder(label: string, width: number, height: number): string {
  const fontSize = Math.round(Math.min(width, height) / 8)
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"`,
    ` width="${width}" height="${height}">`,
    `<rect width="${width}" height="${height}" fill="#d8d0c2"/>`,
    `<text x="50%" y="50%" fill="#6b6153" font-family="sans-serif" font-size="${fontSize}"`,
    ` text-anchor="middle" dominant-baseline="middle">${label}</text>`,
    '</svg>',
  ].join('')
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const starterAssets: AssetManifestEntry[] = [
  {
    id: 'starter-portrait',
    role: 'portrait',
    uri: placeholder('portrait', 800, 1000),
    mimeType: 'image/svg+xml',
    width: 800,
    height: 1000,
    provenance: { provider: 'local', source: 'starter placeholder' },
  },
  {
    id: 'starter-product',
    role: 'product',
    uri: placeholder('product', 1000, 800),
    mimeType: 'image/svg+xml',
    width: 1000,
    height: 800,
    provenance: { provider: 'local', source: 'starter placeholder' },
  },
]

/**
 * 청사진이 요구할 수 있는 모든 content 키의 기본 문구.
 *
 * 청사진마다 쓰는 키가 다르므로 합집합을 둔다 — 안 쓰는 키는 컴파일러가 무시한다.
 * 여기 키가 빠지면 갤러리에서 그 청사진을 여는 순간 `CONTENT_MISSING`으로 터진다.
 */
export const starterContent: Record<string, string> = {
  name: '이름을 입력하세요',
  role: '직함 · 소속',
  contact: 'hello@example.com',
  product: '제품 이름',
  headline: '한 줄로 말하는 약속',
  cta: '자세히 보기',
  title: '무엇을 보여줄 것인가',
  stat: '42',
  unit: '단위',
  explanation: '숫자가 무엇을 뜻하는지 한 문장으로 설명합니다.',
  source: '출처를 적으세요',
}

/** 반복 유닛 청사진의 기본 목록. */
export const starterLists: Record<string, Array<Record<string, string>>> = {
  comparisons: [
    { label: '첫 번째 항목', value: '32%' },
    { label: '두 번째 항목', value: '58%' },
    { label: '세 번째 항목', value: '74%' },
  ],
}

export interface TemplateStarterOptions {
  blueprintId: string
  tokenSetId?: string
  content?: Record<string, string>
  lists?: Record<string, Array<Record<string, string>>>
  assets?: AssetManifestEntry[]
}

export const DEFAULT_TOKEN_SET_ID = 'askewly.warm'

/**
 * 청사진 id로 편집 가능한 템플릿 프로젝트를 만든다.
 *
 * `project.scene`은 그대로 AskewlyDesign의 `CanvasDocument`다 — 변환 없이 캔버스에 얹는다.
 */
export function createTemplateProject(options: TemplateStarterOptions): TemplateProject {
  const blueprint = formatPackCatalog.find((candidate) => candidate.id === options.blueprintId)
  if (!blueprint) {
    throw new TemplateStarterError(
      'BLUEPRINT_NOT_FOUND',
      `청사진 '${options.blueprintId}'가 카탈로그에 없습니다. 사용 가능: ${formatPackCatalog.map((item) => item.id).join(', ')}`,
    )
  }

  const tokenSetId = options.tokenSetId ?? DEFAULT_TOKEN_SET_ID
  if (!resolveTokenSet(tokenSetId)) {
    throw new TemplateStarterError(
      'TOKEN_SET_NOT_FOUND',
      `토큰 세트 '${tokenSetId}'가 없습니다.`,
    )
  }

  const content = { ...starterContent, ...options.content }
  const missing = blueprint.slots
    .filter((slot) => slot.required && slot.contentKey)
    .map((slot) => slot.contentKey!)
    .filter((key) => !content[key]?.trim())

  if (missing.length) {
    throw new TemplateStarterError(
      'CONTENT_INCOMPLETE',
      `'${blueprint.id}'가 요구하는 항목이 비었습니다: ${missing.join(', ')}`,
    )
  }

  const request: TemplateRequest = {
    id: `starter-${blueprint.id}`,
    format: blueprint.format,
    width: blueprint.width,
    height: blueprint.height,
    tokenSetId,
    content,
    lists: { ...starterLists, ...options.lists },
  }

  return compileTemplate(request, options.assets ?? starterAssets, blueprint)
}
