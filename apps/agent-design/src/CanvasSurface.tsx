import { useMemo } from 'react'
import type { CanvasDocument, CanvasNode } from '@askewly/canvas-core'

interface Props {
  document: CanvasDocument
}

function sourceRef(node: CanvasNode) {
  return node.source ? `${node.source.file}:${node.source.startLine}` : undefined
}

function nodeStyle(node: CanvasNode): React.CSSProperties {
  const hue = Number.parseInt(node.id.slice(-3), 10) * 37 % 360
  return {
    left: node.bounds.x,
    top: node.bounds.y,
    width: node.bounds.width,
    height: node.bounds.height,
    background: `hsl(${hue} 36% 94%)`,
  }
}

function CanvasNodeElement({ node }: { node: CanvasNode }) {
  const shared = {
    'data-canvas-id': node.id,
    'data-parent-id': node.parentId ?? '',
    'data-source-ref': sourceRef(node),
    'data-node-kind': node.kind,
    'aria-label': node.name,
    className: `canvas-node node-${node.kind}`,
    style: nodeStyle(node),
  }
  if (node.kind === 'text') {
    return <span {...shared} role="textbox" tabIndex={0} contentEditable suppressContentEditableWarning>{node.text}</span>
  }
  if (node.kind === 'instance') {
    return <button {...shared} type="button">{String(node.overrides.label ?? node.name)}</button>
  }
  if (node.kind === 'code-component') {
    return <article {...shared} role="group" tabIndex={0}>{String(node.props.label ?? node.name)}</article>
  }
  if (node.kind === 'frame') {
    return <section {...shared} role="group" data-layout-mode={node.layout.mode}>{node.name}</section>
  }
  return <div {...shared} role="group" data-layout-mode={node.layout.mode}>{node.name}</div>
}

export function CanvasSurface({ document }: Props) {
  const orderedNodes = useMemo(() => Object.values(document.nodes), [document.nodes])
  const selected = document.nodes[document.selection[0]]
  const transform = `translate(${document.viewport.pan.x}px, ${document.viewport.pan.y}px) scale(${document.viewport.zoom})`

  return <div className="canvas-viewport" data-testid="canvas-viewport">
    <div className="canvas-content" data-testid="canvas-content" style={{ transform }}>
      {orderedNodes.map((node) => <CanvasNodeElement key={node.id} node={node} />)}
    </div>
    {selected ? <div
      className="dom-editor-selection"
      data-testid="editor-selection"
      data-selected-id={selected.id}
      style={{ left: selected.bounds.x, top: selected.bounds.y, width: selected.bounds.width, height: selected.bounds.height }}
    /> : null}
  </div>
}
