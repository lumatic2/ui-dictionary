import { useMemo, useState } from 'react'
import { createDocumentFixture, type CanvasDocument } from '@askewly/canvas-core'
import { CanvasSurface } from './CanvasSurface'
import type { EditorPlaneFailure } from './editorPlaneRuntime'

export function App() {
  const [size, setSize] = useState<1000 | 5000>(1000)
  const [failure, setFailure] = useState<EditorPlaneFailure | null>(null)
  const document = useMemo<CanvasDocument>(() => createDocumentFixture(size), [size])

  return <main className="app-shell">
    <header className="app-header">
      <div>
        <p className="eyebrow">Agent Design / AUC1</p>
        <h1>Canonical Canvas Foundation</h1>
        <p>Semantic DOM content with a renderer-independent document.</p>
      </div>
      <div className="header-controls">
        <label>Nodes
          <select value={size} onChange={(event) => setSize(Number(event.target.value) as 1000 | 5000)} data-testid="fixture-size">
            <option value={1000}>1,000</option>
            <option value={5000}>5,000</option>
          </select>
        </label>
        <label>Editor plane
          <select value={failure ?? 'auto'} onChange={(event) => setFailure(event.target.value === 'auto' ? null : event.target.value as EditorPlaneFailure)} data-testid="editor-plane-mode">
            <option value="auto">WebGPU auto</option>
            <option value="forced-fallback">DOM fallback</option>
            <option value="validation-error">Validation failure</option>
            <option value="device-lost">Device loss</option>
          </select>
        </label>
      </div>
    </header>
    <section className="app-body">
      <CanvasSurface document={document} editorPlaneFailure={failure} />
      <aside className="inspector">
        <h2>Document</h2>
        <dl>
          <div><dt>Schema</dt><dd>v{document.schemaVersion}</dd></div>
          <div><dt>Revision</dt><dd>{document.revision}</dd></div>
          <div><dt>Nodes</dt><dd>{Object.keys(document.nodes).length.toLocaleString()}</dd></div>
          <div><dt>Selection</dt><dd>{document.selection[0]}</dd></div>
        </dl>
      </aside>
    </section>
  </main>
}
