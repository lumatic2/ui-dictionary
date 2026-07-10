import { assertValidDocument, type CanvasDocument } from '@askewly/canvas-core'

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function attribute(attributes: string, name: string): string | undefined {
  return attributes.match(new RegExp(`\\b${escapeRegex(name)}=["']([^"']*)["']`))?.[1]
}

function staticText(body: string): string | undefined {
  if (/[{}]/.test(body)) return undefined
  const value = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return value || undefined
}

export function reconcileDocumentFromSource(document: CanvasDocument, file: string, content: string, at: string): CanvasDocument {
  const next = structuredClone(document)
  for (const node of Object.values(next.nodes)) {
    if (node.source?.file.replaceAll('\\', '/') !== file.replaceAll('\\', '/')) continue
    const id = escapeRegex(node.id)
    const element = content.match(new RegExp(`<([A-Za-z][\\w.]*)\\b([^>]*\\bdata-agent-design-id=["']${id}["'][^>]*)>([\\s\\S]*?)<\\/\\1>`, 'm'))
    if (!element) continue
    const attributes = element[2]
    const text = staticText(element[3])
    const name = attribute(attributes, 'data-agent-design-name')
    const label = attribute(attributes, 'data-agent-design-label') ?? text
    if (name) node.name = name
    if (node.kind === 'code-component' && label !== undefined) node.props.label = label
    if (node.kind === 'text' && text !== undefined) node.text = text
  }
  next.revision += 1
  next.metadata.updatedAt = at
  return assertValidDocument(next)
}
