import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { desktopHost, type DesktopBridgeStatus, type PreviewStatus, type TrustedFileSummary, type TrustedProjectSummary } from './desktopHost'
import { PropertyInspector } from './PropertyInspector'
import type { EditorPlaneFailure } from './editorPlaneRuntime'
import { LiveBridgeClient, liveBridgeConfig } from './liveBridge'

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
  const [connection, setConnection] = useState<'offline' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error'>('offline')
  const [liveLatency, setLiveLatency] = useState<number | null>(null)
  const [desktopBridge, setDesktopBridge] = useState<DesktopBridgeStatus | null>(null)
  const [terminalCopy, setTerminalCopy] = useState<'idle' | 'codex' | 'claude' | 'error'>('idle')
  const [recentProjects, setRecentProjects] = useState<TrustedProjectSummary[]>([])
  const [activeProject, setActiveProject] = useState<TrustedProjectSummary | null>(null)
  const [preview, setPreview] = useState<PreviewStatus | null>(null)
  const [projectFiles, setProjectFiles] = useState<TrustedFileSummary[]>([])
  const liveConfig = useMemo(() => liveBridgeConfig(), [])
  const liveClient = useRef<LiveBridgeClient | null>(null)
  const pendingPaint = useRef<{ revision: number; started: number } | null>(null)
  const storageKey = `agent-design:${baseDocument.id}`

  useEffect(() => {
    setHistory(createHistory(baseDocument))
    setStatus('unsaved')
  }, [baseDocument])

  useEffect(() => {
    if (!liveConfig) return
    const client = new LiveBridgeClient(liveConfig, {
      onStatus: setConnection,
      onError: (error) => setStatus(error instanceof Error ? error.message : 'bridge error'),
      onSnapshot: (snapshot, meta) => {
        pendingPaint.current = { revision: snapshot.revision, started: meta.receivedAt }
        setHistory(createHistory(snapshot.document))
        setStatus(`${meta.reason} revision ${snapshot.revision}`)
      },
    })
    liveClient.current = client
    void client.connect()
    return () => { client.disconnect(); liveClient.current = null }
  }, [liveConfig])

  useEffect(() => {
    const host = desktopHost()
    if (!host) return
    let active = true
    void host.getBridgeStatus({ apiVersion: 1 }).then(
      (next) => { if (active) setDesktopBridge(next) },
      () => { if (active) setDesktopBridge({ apiVersion: 1, state: 'failed', projectId: null, restartCount: 0, cursor: 0, revision: 0, lastErrorCode: 'HOST_STATUS_ERROR', recoveryMode: null }) },
    )
    void host.recentProjects({ apiVersion: 1 }).then((projects) => {
      if (active) {
        setRecentProjects(projects)
        setActiveProject((current) => current ?? projects[0] ?? null)
      }
    }, () => undefined)
    const unsubscribe = host.onBridgeStatus((next) => { if (active) setDesktopBridge(next) })
    return () => { active = false; unsubscribe() }
  }, [])

  useEffect(() => {
    const host = desktopHost()
    if (!host || !activeProject) { setProjectFiles([]); return }
    let active = true
    void host.catalogFiles({ apiVersion: 1, projectId: activeProject.id }).then((files) => { if (active) setProjectFiles(files) }, () => { if (active) setProjectFiles([]) })
    return () => { active = false }
  }, [activeProject])

  const copyTerminalCommand = useCallback(async (actor: 'codex' | 'claude') => {
    const host = desktopHost()
    if (!host) return
    try {
      await host.copyTerminalCommand({ apiVersion: 1, actor })
      setTerminalCopy(actor)
    } catch {
      setTerminalCopy('error')
    }
  }, [])

  const selectProject = useCallback(async () => {
    const host = desktopHost()
    if (!host) return
    const result = await host.selectProject({ apiVersion: 1 })
    if (!result.canceled && result.project) {
      setActiveProject(result.project)
      setRecentProjects((current) => [result.project!, ...current.filter((project) => project.id !== result.project?.id)])
    }
  }, [])

  const openRecentProject = useCallback(async (projectId: string) => {
    const host = desktopHost()
    if (!host || !projectId) return
    setActiveProject(await host.openRecentProject({ apiVersion: 1, projectId }))
  }, [])

  const togglePreview = useCallback(async () => {
    const host = desktopHost()
    if (!host || !activeProject) return
    setPreview(preview?.visible
      ? await host.hidePreview({ apiVersion: 1 })
      : await host.openPreview({ apiVersion: 1, projectId: activeProject.id }))
  }, [activeProject, preview?.visible])

  useEffect(() => {
    const pending = pendingPaint.current
    if (!pending || pending.revision !== history.present.revision) return
    const frame = requestAnimationFrame(() => {
      setLiveLatency(performance.now() - pending.started)
      pendingPaint.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [history.present.revision])

  const applyDemo = useCallback(() => {
    setHistory((current) => demoOperations().reduce(commitOperation, current))
    setStatus('changed')
  }, [])

  const commit = useCallback((operation: CanvasOperation) => {
    if (liveClient.current) {
      void liveClient.current.applyOperation(operation).catch((error) => setStatus(error instanceof Error ? error.message : 'bridge mutation failed'))
      return
    }
    setHistory((current) => commitOperation(current, operation))
    setStatus('changed')
  }, [])

  const undoCurrent = useCallback(() => {
    if (liveClient.current) {
      void liveClient.current.undo().catch((error) => setStatus(error instanceof Error ? error.message : 'bridge undo failed'))
      return
    }
    setHistory(undo)
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

  const runPointerTrace = useCallback(async (frames = 60) => {
    const overlay = document.querySelector<HTMLElement>('[data-testid="manipulation-selection"]')
    const viewport = document.querySelector<HTMLElement>('[data-testid="canvas-viewport"]')
    if (!overlay || !viewport) throw new Error('selection overlay is not ready')
    const pointerId = 700 + Math.floor(Math.random() * 100)
    const beforeRevision = Number(document.querySelector('[data-testid="document-revision"]')?.textContent)
    overlay.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId, isPrimary: true, clientX: 120, clientY: 120, buttons: 1 }))
    await nextFrame()
    const latencies: number[] = []
    for (let index = 0; index < frames; index += 1) {
      const started = performance.now()
      viewport.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId, isPrimary: true, clientX: 120 + index + 1, clientY: 120 + (index % 8), buttons: 1 }))
      const painted = await nextFrame()
      latencies.push(painted - started)
    }
    viewport.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId, isPrimary: true, clientX: 120 + frames, clientY: 120 + (frames % 8) }))
    await nextFrame()
    await nextFrame()
    const afterRevision = Number(document.querySelector('[data-testid="document-revision"]')?.textContent)
    return {
      frames,
      averageLatencyMs: latencies.reduce((sum, value) => sum + value, 0) / latencies.length,
      p95LatencyMs: percentile(latencies, 0.95),
      overBudgetRatio: latencies.filter((value) => value > 16.67).length / latencies.length,
      revisionDelta: afterRevision - beforeRevision,
    }
  }, [])

  useEffect(() => {
    window.__agentDesignBenchmark = {
      runTrace,
      runPointerTrace,
      inspect: (nodeId?: string) => ({
        revision: history.present.revision,
        selection: [...history.present.selection],
        historyLength: history.log.length,
        tokenSetId: history.present.tokenSetId,
        node: nodeId ? structuredClone(history.present.nodes[nodeId]) : null,
      }),
    }
    return () => { delete window.__agentDesignBenchmark }
  }, [history.log.length, history.present, runPointerTrace, runTrace])

  return <main className="app-shell">
    <header className="app-header">
      <div>
        <p className="eyebrow">Agent Design / AUC3</p>
        <h1>Terminal Agent Live Canvas</h1>
        <p>Codex and Claude share one revisioned canvas and React source.</p>
      </div>
      <div className="header-controls">
        {desktopBridge && <div className="project-controls">
          <button type="button" onClick={() => void selectProject()}>Open project</button>
          <select aria-label="Recent projects" value={activeProject?.id ?? ''} onChange={(event) => void openRecentProject(event.target.value)}>
            <option value="">{activeProject?.displayName ?? 'Recent projects'}</option>
            {recentProjects.map((project) => <option key={project.id} value={project.id}>{project.displayName}</option>)}
          </select>
          <button type="button" disabled={!activeProject} onClick={() => void togglePreview()}>{preview?.visible ? 'Hide preview' : 'Preview'}</button>
          <button type="button" disabled={!activeProject} onClick={() => activeProject && void desktopHost()?.revealProject({ apiVersion: 1, projectId: activeProject.id })}>Explorer</button>
          <select aria-label="Project files" defaultValue="" onChange={(event) => {
            const fileId = event.target.value
            if (activeProject && fileId) void desktopHost()?.openFile({ apiVersion: 1, projectId: activeProject.id, fileId })
            event.target.value = ''
          }}>
            <option value="">Open file</option>
            {projectFiles.map((file) => <option key={file.id} value={file.id}>{file.label}</option>)}
          </select>
          <button type="button" onClick={() => void desktopHost()?.exportDiagnostics({ apiVersion: 1 })}>Diagnostics</button>
        </div>}
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
      <button type="button" data-testid="undo" disabled={!liveConfig && !history.past.length} onClick={undoCurrent}>Undo</button>
      <button type="button" data-testid="redo" disabled={!history.future.length} onClick={() => setHistory(redo)}>Redo</button>
      <button type="button" data-testid="save-document" onClick={() => void save()}>Save</button>
      <button type="button" data-testid="reload-document" onClick={() => void reload()}>Reload</button>
      <output data-testid="persistence-status">{status}</output>
      <output className={`connection-status status-${connection}`} data-testid="bridge-status">{connection}{liveLatency === null ? '' : ` · ${liveLatency.toFixed(1)}ms`}</output>
      {desktopBridge && <div className="desktop-bridge-controls">
        <output className={`connection-status status-${desktopBridge.state}`} data-testid="desktop-bridge-status">
          desktop {desktopBridge.state}{desktopBridge.recoveryMode ? ` · ${desktopBridge.recoveryMode}` : ''} · restart {desktopBridge.restartCount}
        </output>
        <button type="button" disabled={desktopBridge.state !== 'ready'} onClick={() => void copyTerminalCommand('codex')}>Copy Codex</button>
        <button type="button" disabled={desktopBridge.state !== 'ready'} onClick={() => void copyTerminalCommand('claude')}>Copy Claude</button>
        <output aria-live="polite" data-testid="terminal-copy-status">{terminalCopy === 'idle' ? '' : terminalCopy === 'error' ? 'copy failed' : `${terminalCopy} copied`}</output>
      </div>}
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
      runPointerTrace: (frames?: number) => Promise<{ frames: number; averageLatencyMs: number; p95LatencyMs: number; overBudgetRatio: number; revisionDelta: number }>
      inspect: (nodeId?: string) => { revision: number; selection: string[]; historyLength: number; tokenSetId: string; node: unknown }
    }
  }
}
