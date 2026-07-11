import type { CanvasDocument, CanvasOperation, CodeComponentNode, NodeId } from '@askewly/canvas-core'

export interface MaterializeRegistryNodeOptions {
  /**
   * Relative (project-root-relative, forward-slash) file paths that already
   * exist in the target project. Used purely for deterministic collision
   * suffixing of the generated export/file name - this planner never reads
   * the filesystem itself.
   */
  existingFiles?: string[]
}

export interface MaterializeRegistryNodeResult {
  /** Project-root-relative path, e.g. `src/components/Button.tsx`. */
  filePath: string
  /** Full replacement content for `filePath`. */
  content: string
  /**
   * Canonical document operations to apply alongside the file write. Empty
   * by design - see the identity contract note on `planMaterializeRegistryNode`.
   */
  operations: CanvasOperation[]
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function baseExportName(node: CodeComponentNode): string {
  return node.source.exportName || node.name.replace(/\s+/g, '') || 'Component'
}

function resolveExportName(base: string, existingFiles: ReadonlySet<string>): string {
  const candidate = (suffix: number) => (suffix === 1 ? base : `${base}${suffix}`)
  let suffix = 1
  while (existingFiles.has(`src/components/${candidate(suffix)}.tsx`)) suffix += 1
  return candidate(suffix)
}

function labelFor(node: CodeComponentNode): string {
  const label = node.props.label
  return typeof label === 'string' && label.length > 0 ? label : node.name
}

function classNameFor(node: CodeComponentNode): string {
  const base = 'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium'
  const variantClasses = Object.entries(node.variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}-${value}`)
  return [base, ...variantClasses].join(' ')
}

function buildComponentSource(node: CodeComponentNode, exportName: string): string {
  const label = labelFor(node)
  const className = classNameFor(node)
  return [
    `export function ${exportName}() {`,
    '  return (',
    '    <div',
    `      data-agent-design-id="${escapeAttribute(node.id)}"`,
    `      data-agent-design-name="${escapeAttribute(node.name)}"`,
    `      data-agent-design-label="${escapeAttribute(label)}"`,
    `      className="${escapeAttribute(className)}"`,
    '    >',
    `      ${label}`,
    '    </div>',
    '  )',
    '}',
    '',
  ].join('\n')
}

/**
 * Materializes a `registry://` code-component node already present in
 * `document` into a real source file: `src/components/<ExportName>.tsx`,
 * carrying the same `data-agent-design-*` markers the bridge's cold-start
 * ingestion (`deriveDocumentFromProject` in apps/agent-design-bridge) scans
 * for, with `data-agent-design-id` set to the *canvas node's own id*.
 *
 * Identity contract: the node id chosen at insertion time (`createRegistryNode`
 * -> `nextNodeId`) becomes the marker id in the generated file. A cold
 * re-derive of the project therefore assigns that exact node id to the newly
 * discovered element - there is no separate "registry node" vs "scanned node"
 * identity to reconcile, so no duplicate node is ever produced. This planner
 * intentionally returns an empty `operations` array: canvas-core has no
 * operation that rewrites `CodeComponentNode.source` (`update-node`'s patch
 * is limited to name/bounds/visible/locked/tokenBindings; `set-node-property`
 * only touches props/variants - see packages/canvas-core/src/operations.ts).
 * The live in-memory session document therefore keeps `source.file =
 * "registry://<id>"` until the next cold re-derive, at which point the same
 * id resolves to the real file. This is a deliberate, minimal choice per the
 * plan's decision log rather than a gap: extending `update-node` to cover
 * `source` was out of scope (no test or DoD item calls for a live-session
 * source-field rewrite), and the cold re-derive path already yields the
 * correct, single node.
 */
export function planMaterializeRegistryNode(
  document: CanvasDocument,
  nodeId: NodeId,
  options: MaterializeRegistryNodeOptions = {},
): MaterializeRegistryNodeResult {
  const node = document.nodes[nodeId]
  if (!node) throw new Error(`planMaterializeRegistryNode: missing node ${nodeId}`)
  if (node.kind !== 'code-component') throw new Error(`planMaterializeRegistryNode: node ${nodeId} is not a code-component`)
  if (!node.source.file.startsWith('registry://')) {
    throw new Error(`planMaterializeRegistryNode: node ${nodeId} is already source-backed (${node.source.file})`)
  }

  const existingFiles = new Set((options.existingFiles ?? []).map((file) => file.replaceAll('\\', '/')))
  const exportName = resolveExportName(baseExportName(node), existingFiles)
  const filePath = `src/components/${exportName}.tsx`
  const content = buildComponentSource(node, exportName)

  return { filePath, content, operations: [] }
}
