import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyOperation,
  commitOperation,
  createDocumentFixture,
  createHistory,
  loadSnapshot,
  redo,
  saveSnapshot,
  undo,
  type CanvasHistory,
  type CanvasOperation,
} from '@askewly/canvas-core'
import { BrowserDocumentStore } from './browserStore'
import { CanvasSurface } from './CanvasSurface'
import { PropertyInspector } from './PropertyInspector'
import type { EditorPlaneFailure } from './editorPlaneRuntime'

const store = new BrowserDocumentStore()
const nextFrame = () => new Promise<number>((resolve) => requestAnimationFrame(resolve))

function demoOperations(): CanvasOperation[] {
  return [
    { id: 'demo-update', at: '2026-07-10T03:00:00.000Z', type: 'update-node', nodeId: 'node-00007', patch: { name: 'Persisted Korean canvas', bounds: { x: 320, y: 168, width: 240, height: 72 } } },
    { id: 'demo-select', at: '2026-07-10T03:00:01.000Z', type: 'select-nodes', nodeIds: ['node-00007'] },
    { id: 'demo-viewport', at: '2026-07-10T03:00:02.000Z', type: 'set-viewport', pan: { x: -48, y: -24 }, zoom: 1.1 },
  ]
}

function percentile(values: number[], ratio: number) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * ratio))] ?? 0
}

export function App() {
  const [size, setSize] = useState<1000 | 5000>(1000)
  const [failure, setFailure] = useState<EditorPlaneFailure | null>(null)
  const baseDocument = useMemo(() => createDocumentFixture(size), [size])
  const [history, setHistory] = useState<CanvasHistory>(() => createHistory(baseDocument))
  const [status, setStatus] = useState('unsaved')
  const storageKey = `agent-design:${baseDocument.id}`

  useEffect(() => {
    setHistory(createHistory(baseDocument))
    setStatus('unsaved')
  }, [baseDocument])

  const applyDemo = useCallback(() => {
    setHistory((current) => demoOperations().reduce(commitOperation, current))
    setStatus('changed')
  }, [])

  const commit = useCallback((operation: CanvasOperation) => {
    setHistory((current) => commitOperation(current, operation))
    setStatus('changed')
  }, [])

  const save = useCallback(async () => {
    const bytes = await saveSnapshot(store, storageKey, baseDocument, history.log)
    setStatus(`saved ${bytes} bytes`)
  }, [baseDocument, history.log, storageKey])

  const reload = useCallback(async () => {
    const recovered = await loadSnapshot(store, storageKey)
    if (!recovered) { setStatus('no saved document'); return }
    setHistory(recovered)
    setStatus(`reloaded revision ${recovered.present.revision}`)
  }, [storageKey])

  const runTrace = useCallback(async (frames = 90) => {
    const intervals: number[] = []
    let previous = await nextFrame()
    for (let index = 0; index < frames; index += 1) {
      setHistory((current) => ({
        ...current,
        present: applyOperation(current.present, index % 2 === 0
          ? { id: `trace-view-${index}`, at: '2026-07-10T04:00:00.000Z', type: 'set-viewport', pan: { x: -index * 1.5, y: -index * 0.7 }, zoom: 0.9 + (index % 20) * 0.005 }
          : { id: `trace-select-${index}`, at: '2026-07-10T04:00:00.000Z', type: 'select-nodes', nodeIds: [`node-${String((index % 99) + 1).padStart(5, '0')}`] }),
      }))
      const now = await nextFrame()
      intervals.push(now - previous)
      previous = now
    }
    return {
      frames,
      averageFrameMs: intervals.reduce((sum, value) => sum + value, 0) / intervals.length,
      p95FrameMs: percentile(intervals, 0.95),
      droppedFrameRatio: intervals.filter((value) => value > 20).length / intervals.length,
    }
  }, [])

  useEffect(() => {
    window.__agentDesignBenchmark = { runTrace }
    return () => { delete window.__agentDesignBenchmark }
  }, [runTrace])

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
    <nav className="document-actions" aria-label="Document actions">
      <button type="button" data-testid="apply-demo" onClick={applyDemo}>Apply operation</button>
      <button type="button" data-testid="undo" disabled={!history.past.length} onClick={() => setHistory(undo)}>Undo</button>
      <button type="button" data-testid="redo" disabled={!history.future.length} onClick={() => setHistory(redo)}>Redo</button>
      <button type="button" data-testid="save-document" onClick={() => void save()}>Save</button>
      <button type="button" data-testid="reload-document" onClick={() => void reload()}>Reload</button>
      <output data-testid="persistence-status">{status}</output>
    </nav>
    <section className="app-body">
      <CanvasSurface document={history.present} editorPlaneFailure={failure} onOperation={commit} />
      <PropertyInspector document={history.present} onOperation={commit} />
    </section>
  </main>
}

declare global {
  interface Window {
    __agentDesignBenchmark?: {
      runTrace: (frames?: number) => Promise<{ frames: number; averageFrameMs: number; p95FrameMs: number; droppedFrameRatio: number }>
    }
  }
}
