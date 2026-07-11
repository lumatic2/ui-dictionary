import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { assertValidDocument, type CanvasDocument, type CanvasNode, type CodeComponentNode, type NodeId } from '@askewly/canvas-core'

/**
 * Cold-start ingestion: scans a project root for data-agent-design-* marked
 * JSX elements across multiple files and derives a canonical CanvasDocument
 * from scratch (one code-component node per marked element).
 *
 * This does NOT exist anywhere else in the codebase today - see the RT Step 1
 * audit report. `reconcileDocumentFromSource` (packages/agent-design-engine)
 * only *updates* nodes a document already knows about; it cannot discover new
 * ones. `initialDocument` (apps/agent-design-desktop/src/project-controller.ts)
 * hardcodes exactly one node bound to src/App.tsx and never scans markers.
 * This module fills the "marker scan -> canonical document" gap at the
 * bridge-owned seam, scoped to apps/agent-design-bridge only.
 */

const SCANNED_EXTENSIONS = new Set(['.tsx', '.jsx'])
const IGNORED_DIRECTORIES = new Set(['node_modules', 'dist', 'out', 'build'])

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

interface MarkerMatch {
  id: string
  attributes: string
  body: string
  start: number
  end: number
}

const MARKER_ELEMENT = /<([A-Za-z][\w.]*)\b([^>]*\bdata-agent-design-id=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/\1>/g

function scanMarkers(content: string): MarkerMatch[] {
  const matches: MarkerMatch[] = []
  for (const match of content.matchAll(MARKER_ELEMENT)) {
    const start = match.index ?? 0
    matches.push({ id: match[3], attributes: match[2], body: match[4], start, end: start + match[0].length })
  }
  return matches
}

/** Finds the export whose declaration precedes the marked element - the marker's owning component. */
function exportNameFor(content: string, elementStart: number, file: string): string {
  const before = content.slice(0, elementStart)
  const pattern = /export\s+(?:default\s+)?function\s+([A-Za-z_$][\w$]*)|export\s+const\s+([A-Za-z_$][\w$]*)\s*[=:]/g
  let last: RegExpExecArray | null = null
  for (const match of before.matchAll(pattern)) last = match
  const name = last?.[1] ?? last?.[2]
  if (!name) throw new Error(`marker-ingest: no export found before marked element in ${file}`)
  return name
}

function lineOf(content: string, offset: number): number {
  return content.slice(0, offset).split('\n').length
}

function listMarkedFiles(root: string): string[] {
  const results: string[] = []
  const walk = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    for (const entry of entries) {
      if (entry.name.startsWith('.') || IGNORED_DIRECTORIES.has(entry.name)) continue
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (SCANNED_EXTENSIONS.has(extname(entry.name))) results.push(full)
    }
  }
  walk(root)
  return results
}

export interface DeriveDocumentOptions {
  documentId: string
  documentName: string
  sourceRoot?: string
  at?: string
}

const GRID_COLUMNS = 3
const NODE_WIDTH = 320
const NODE_HEIGHT = 180
const NODE_GAP = 32

/**
 * Scans `projectRoot` for data-agent-design-id marked JSX elements across all
 * .tsx/.jsx files and derives a canonical CanvasDocument. Deterministic: the
 * same project content always yields a structurally identical document.
 * Unmarked files and unmarked elements never produce nodes.
 */
export function deriveDocumentFromProject(projectRoot: string, options: DeriveDocumentOptions): CanvasDocument {
  const at = options.at ?? '2026-07-12T00:00:00.000Z'
  const rootId = 'ingested-root'
  const nodes: Record<NodeId, CanvasNode> = {
    [rootId]: {
      id: rootId,
      kind: 'frame',
      name: options.documentName,
      parentId: null,
      childIds: [],
      bounds: { x: 0, y: 0, width: 1440, height: 900 },
      layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
      visible: true,
      locked: false,
      tokenBindings: { background: 'surface.canvas' },
      source: null,
      clipContent: true,
    },
  }
  const rootChildIds: NodeId[] = []
  const seenIds = new Set<string>()
  let ordinal = 0

  for (const file of listMarkedFiles(projectRoot)) {
    const content = readFileSync(file, 'utf8')
    const relativeFile = relative(projectRoot, file).replaceAll('\\', '/')
    for (const marker of scanMarkers(content)) {
      if (seenIds.has(marker.id)) {
        throw new Error(`marker-ingest: duplicate data-agent-design-id "${marker.id}" (also seen earlier); ids must be unique across the project`)
      }
      seenIds.add(marker.id)
      const name = attribute(marker.attributes, 'data-agent-design-name') ?? marker.id
      const label = attribute(marker.attributes, 'data-agent-design-label') ?? staticText(marker.body) ?? name
      const exportName = exportNameFor(content, marker.start, relativeFile)
      const startLine = lineOf(content, marker.start)
      const endLine = lineOf(content, marker.end)
      const column = ordinal % GRID_COLUMNS
      const row = Math.floor(ordinal / GRID_COLUMNS)
      const node: CodeComponentNode = {
        id: marker.id,
        kind: 'code-component',
        name,
        parentId: rootId,
        childIds: [],
        bounds: {
          x: 24 + column * (NODE_WIDTH + NODE_GAP),
          y: 24 + row * (NODE_HEIGHT + NODE_GAP),
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        },
        layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [16, 16, 16, 16] },
        visible: true,
        locked: false,
        tokenBindings: { background: 'surface.raised' },
        source: { file: relativeFile, exportName, startLine, endLine },
        props: { label },
        variants: {},
      }
      nodes[node.id] = node
      rootChildIds.push(node.id)
      ordinal += 1
    }
  }

  nodes[rootId] = { ...nodes[rootId], childIds: rootChildIds }

  return assertValidDocument({
    schemaVersion: 1,
    id: options.documentId,
    name: options.documentName,
    revision: 0,
    rootIds: [rootId],
    nodes,
    selection: [rootId],
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    tokenSetId: 'askewly.default',
    metadata: { createdAt: at, updatedAt: at, sourceRoot: options.sourceRoot ?? '.' },
  })
}
