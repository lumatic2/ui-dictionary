import type { CanvasNode } from '@askewly/canvas-core'
import { blueprintOf } from './catalog.js'
import { printSheetGeometry, type PrintSheetGeometry } from './print-spec.js'
import { resolveTokenSet, type TokenSet } from './tokens.js'
import { wrapLines } from './text-fitting.js'

/**
 * 템플릿 내보내기 — JSON(왕복용 정본) / HTML / SVG.
 *
 * TH3 step-3에서 `apps/template-studio`에서 이관했다. 편집 표면이 AskewlyDesign 하나로
 * 모이면서, 내보내기는 표면이 아니라 코어가 소유해야 한다.
 */
import type { TemplateProject } from './types.js'

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const esc = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]!)

export class TemplateExportError extends Error {
  constructor(readonly code: 'TOKEN_SET_NOT_FOUND' | 'TOKEN_NOT_DEFINED', message: string) {
    super(message)
    this.name = 'TemplateExportError'
  }
}

/**
 * 내보내기 시점의 토큰 해석 — 화면과 **같은 값**을 써야 한다.
 *
 * 해석 실패는 검은색으로 때우지 않고 던진다. 색이 빠진 산출물이 조용히 나가면
 * 인쇄에 넘어간 뒤에야 발견된다.
 */
function exportTokens(project: TemplateProject): TokenSet {
  const set = resolveTokenSet(project.request.tokenSetId)
  if (!set) {
    throw new TemplateExportError(
      'TOKEN_SET_NOT_FOUND',
      `토큰 세트 '${project.request.tokenSetId}'가 없어 내보낼 수 없습니다.`,
    )
  }
  return set
}

function tokenValue(set: TokenSet, binding: string | undefined, nodeId: string): string | null {
  if (!binding) return null
  const definition = set.tokens[binding]
  if (!definition) {
    throw new TemplateExportError(
      'TOKEN_NOT_DEFINED',
      `'${nodeId}'가 참조하는 '${binding}'이 세트 '${set.id}'에 없습니다.`,
    )
  }
  return definition.value
}

/** 도형 채움 — 바인딩이 있으면 그것만이 값을 정한다(화면 규칙과 동일). */
function shapeFill(set: TokenSet, node: Extract<CanvasNode, { kind: 'shape' }>): string {
  return tokenValue(set, node.tokenBindings.fill, node.id) ?? node.fill
}

const style = (node: CanvasNode) =>
  [
    'position:absolute',
    `left:${node.bounds.x}px`,
    `top:${node.bounds.y}px`,
    `width:${node.bounds.width}px`,
    `height:${node.bounds.height}px`,
    'box-sizing:border-box',
    '',
  ].join(';')

/** root frame은 컨테이너가 대신하므로 자식 노드만 그린다. */
const paintableNodes = (project: TemplateProject) =>
  Object.values(project.scene.nodes).filter((node) => node.parentId)

const assetUris = (project: TemplateProject) =>
  new Map(project.assets.map((asset) => [asset.id, asset.uri]))

export function exportJson(project: TemplateProject) {
  return JSON.stringify(project, null, 2)
}

export function exportHtml(project: TemplateProject) {
  const assets = assetUris(project)
  const set = exportTokens(project)

  const body = paintableNodes(project)
    .map((node) => {
      if (node.kind === 'text') {
        const color = tokenValue(set, node.tokenBindings.color, node.id)
        const family = tokenValue(set, node.tokenBindings.fontFamily, node.id) ?? node.textStyle.fontFamily
        const type = [
          color ? `color:${color}` : '',
          // 글꼴 스택은 `Georgia, "Noto Serif KR", serif`처럼 따옴표를 품는다.
          // 이스케이프하지 않으면 style 속성이 그 자리에서 끊긴다.
          `font-family:${esc(family)}`,
          `font-size:${node.textStyle.fontSize}px`,
          `font-weight:${node.textStyle.fontWeight}`,
          `line-height:${node.textStyle.lineHeight}px`,
        ].filter(Boolean).join(';')
        return `<div style="${style(node)}${type}">${esc(node.text)}</div>`
      }
      if (node.kind === 'image') {
        const src = esc(assets.get(node.assetId) ?? '')
        return `<img alt="${esc(node.alt)}" src="${src}" style="${style(node)}object-fit:${node.fit}">`
      }
      if (node.kind === 'shape') {
        return `<div style="${style(node)}background:${esc(shapeFill(set, node))}"></div>`
      }
      return ''
    })
    .join('')

  const canvas = set.tokens['surface.canvas']?.value ?? 'transparent'
  const frame = `position:relative;width:${project.request.width}px;height:${project.request.height}px;overflow:hidden;background:${canvas}`
  return `<!doctype html><meta charset="utf-8"><main style="${frame}">${body}</main>`
}

export function exportSvg(project: TemplateProject) {
  const assets = assetUris(project)
  const set = exportTokens(project)
  // 인쇄용 청사진이면 지면이 재단 크기보다 크다. 화면용이면 geometry가 null이라
  // 예전과 똑같은 산출물이 나온다 — 인쇄 요건을 화면 산출물에 얹지 않는다.
  const blueprint = blueprintOf(project)
  const geometry = blueprint ? printSheetGeometry(blueprint) : null
  const bleedBox = geometry
    ? {
        x: -geometry.bleed,
        y: -geometry.bleed,
        width: project.request.width + geometry.bleed * 2,
        height: project.request.height + geometry.bleed * 2,
      }
    : { x: 0, y: 0, width: project.request.width, height: project.request.height }

  const body = paintableNodes(project)
    .map((node) => {
      if (node.kind === 'text') {
        // SVG text의 y는 baseline이므로 fontSize만큼 내려 top 기준과 맞춘다.
        const baseline = node.bounds.y + node.textStyle.fontSize
        const color = tokenValue(set, node.tokenBindings.color, node.id)
        const family = tokenValue(set, node.tokenBindings.fontFamily, node.id) ?? node.textStyle.fontFamily
        const attrs = [
          `x="${node.bounds.x}"`,
          `y="${baseline}"`,
          `font-size="${node.textStyle.fontSize}"`,
          `font-weight="${node.textStyle.fontWeight}"`,
          `font-family="${esc(family)}"`,
          color ? `fill="${esc(color)}"` : '',
        ].filter(Boolean).join(' ')
        // SVG `<text>`는 자동 줄바꿈이 없다. 화면과 같은 함수로 줄을 나눠 tspan으로 낸다 —
        // 그러지 않으면 한 줄로 뻗어 캔버스를 넘친다.
        const lines = wrapLines(node.text, node.textStyle.fontSize, node.bounds.width)
        const spans = lines
          .map((line, index) =>
            index === 0
              ? `<tspan x="${node.bounds.x}">${esc(line)}</tspan>`
              : `<tspan x="${node.bounds.x}" dy="${node.textStyle.lineHeight}">${esc(line)}</tspan>`,
          )
          .join('')
        return `<text ${attrs}>${spans}</text>`
      }
      if (node.kind === 'image') {
        const href = esc(assets.get(node.assetId) ?? '')
        return `<image href="${href}" x="${node.bounds.x}" y="${node.bounds.y}" width="${node.bounds.width}" height="${node.bounds.height}" preserveAspectRatio="xMidYMid slice"/>`
      }
      if (node.kind === 'shape') {
        // 캔버스를 덮으려는 배경은 재단선이 아니라 도련 끝까지 나가야 한다.
        // 재단 오차가 어느 쪽으로 나든 흰 띠가 생기지 않게 하는 게 도련의 목적이다.
        const bounds = coversCanvas(node.bounds, project) ? bleedBox : node.bounds
        return `<rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="${esc(shapeFill(set, node))}"/>`
      }
      return ''
    })
    .join('')

  const { width, height } = project.request
  const canvas = set.tokens['surface.canvas']?.value ?? 'transparent'
  const backdrop = `<rect x="${bleedBox.x}" y="${bleedBox.y}" width="${bleedBox.width}" height="${bleedBox.height}" fill="${esc(canvas)}"/>`
  const sheet = geometry
    ? { width: geometry.sheet.width, height: geometry.sheet.height, origin: -geometry.margin }
    : { width, height, origin: 0 }
  const viewBox = `${sheet.origin} ${sheet.origin} ${sheet.width} ${sheet.height}`
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sheet.width}" height="${sheet.height}" viewBox="${viewBox}">` +
    `${backdrop}${body}${cropMarks(geometry, width, height)}</svg>`
  )
}

/** 캔버스 전체를 덮으려는 도형인가 — 도련까지 확장할 대상을 가른다. */
function coversCanvas(
  bounds: { x: number; y: number; width: number; height: number },
  project: TemplateProject,
): boolean {
  const { width, height } = project.request
  return bounds.x <= 0 && bounds.y <= 0 && bounds.x + bounds.width >= width && bounds.y + bounds.height >= height
}

/**
 * 재단 표시(crop marks) — 네 모서리에 벡터 선 8개.
 *
 * CSS `@page`의 `marks`는 어느 브라우저도 지원하지 않는다(리서치 3.1~3.3). 그래서
 * 표시를 SVG에 직접 그린다. 외부 의존성이 없고 어떤 변환 도구를 거쳐도 살아남는다.
 *
 * 각 선은 재단선의 연장이며 도련 **바깥**에서 시작한다 — 도련 안에 그리면 작품과
 * 함께 인쇄된다.
 */
function cropMarks(geometry: PrintSheetGeometry | null, width: number, height: number): string {
  if (!geometry) return ''
  const { bleed, margin } = geometry
  const stroke = Math.max(1, Math.round(bleed / 12))
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000000" stroke-width="${stroke}"/>`

  return [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ]
    .map(([x, y]) => {
      const horizontal = x === 0 ? [-margin, -bleed] : [width + bleed, width + margin]
      const vertical = y === 0 ? [-margin, -bleed] : [height + bleed, height + margin]
      return line(horizontal[0]!, y, horizontal[1]!, y) + line(x, vertical[0]!, x, vertical[1]!)
    })
    .join('')
}
