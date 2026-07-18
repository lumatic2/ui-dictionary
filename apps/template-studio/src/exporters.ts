import type { CanvasNode } from '@askewly/canvas-core'
import type { TemplateProject } from '@askewly/template-core'

const esc = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
const style = (node: CanvasNode) => `position:absolute;left:${node.bounds.x}px;top:${node.bounds.y}px;width:${node.bounds.width}px;height:${node.bounds.height}px;box-sizing:border-box;`
export function exportJson(project: TemplateProject) { return JSON.stringify(project, null, 2) }
export function exportHtml(project: TemplateProject) {
  const assets = new Map(project.assets.map((asset) => [asset.id, asset.uri]))
  const body = Object.values(project.scene.nodes).filter((node) => node.parentId).map((node) => node.kind === 'text' ? `<div style="${style(node)}">${esc(node.text)}</div>` : node.kind === 'image' ? `<img alt="${esc(node.alt)}" src="${esc(assets.get(node.assetId) ?? '')}" style="${style(node)}object-fit:${node.fit}">` : node.kind === 'shape' ? `<div style="${style(node)}background:${esc(node.fill)}"></div>` : '').join('')
  return `<!doctype html><meta charset="utf-8"><main style="position:relative;width:${project.request.width}px;height:${project.request.height}px;overflow:hidden">${body}</main>`
}
export function exportSvg(project: TemplateProject) {
  const assets = new Map(project.assets.map((asset) => [asset.id, asset.uri]))
  const body = Object.values(project.scene.nodes).filter((node) => node.parentId).map((node) => node.kind === 'text' ? `<text x="${node.bounds.x}" y="${node.bounds.y + node.textStyle.fontSize}" font-size="${node.textStyle.fontSize}">${esc(node.text)}</text>` : node.kind === 'image' ? `<image href="${esc(assets.get(node.assetId) ?? '')}" x="${node.bounds.x}" y="${node.bounds.y}" width="${node.bounds.width}" height="${node.bounds.height}" preserveAspectRatio="xMidYMid slice"/>` : node.kind === 'shape' ? `<rect x="${node.bounds.x}" y="${node.bounds.y}" width="${node.bounds.width}" height="${node.bounds.height}" fill="${esc(node.fill)}"/>` : '').join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${project.request.width}" height="${project.request.height}" viewBox="0 0 ${project.request.width} ${project.request.height}">${body}</svg>`
}
