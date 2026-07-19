import type { CanvasNode } from '@askewly/canvas-core'
import type { TemplateProject } from '@askewly/template-core'

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const esc = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]!)

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

  const body = paintableNodes(project)
    .map((node) => {
      if (node.kind === 'text') {
        return `<div style="${style(node)}">${esc(node.text)}</div>`
      }
      if (node.kind === 'image') {
        const src = esc(assets.get(node.assetId) ?? '')
        return `<img alt="${esc(node.alt)}" src="${src}" style="${style(node)}object-fit:${node.fit}">`
      }
      if (node.kind === 'shape') {
        return `<div style="${style(node)}background:${esc(node.fill)}"></div>`
      }
      return ''
    })
    .join('')

  const frame = `position:relative;width:${project.request.width}px;height:${project.request.height}px;overflow:hidden`
  return `<!doctype html><meta charset="utf-8"><main style="${frame}">${body}</main>`
}

export function exportSvg(project: TemplateProject) {
  const assets = assetUris(project)

  const body = paintableNodes(project)
    .map((node) => {
      if (node.kind === 'text') {
        // SVG text의 y는 baseline이므로 fontSize만큼 내려 top 기준과 맞춘다.
        const baseline = node.bounds.y + node.textStyle.fontSize
        return `<text x="${node.bounds.x}" y="${baseline}" font-size="${node.textStyle.fontSize}">${esc(node.text)}</text>`
      }
      if (node.kind === 'image') {
        const href = esc(assets.get(node.assetId) ?? '')
        return `<image href="${href}" x="${node.bounds.x}" y="${node.bounds.y}" width="${node.bounds.width}" height="${node.bounds.height}" preserveAspectRatio="xMidYMid slice"/>`
      }
      if (node.kind === 'shape') {
        return `<rect x="${node.bounds.x}" y="${node.bounds.y}" width="${node.bounds.width}" height="${node.bounds.height}" fill="${esc(node.fill)}"/>`
      }
      return ''
    })
    .join('')

  const { width, height } = project.request
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`
}
