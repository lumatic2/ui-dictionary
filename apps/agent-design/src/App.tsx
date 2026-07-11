import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  applyOperation,
  commitOperation,
  createDocumentFixture,
  createHistory,
  documentContentBounds,
  fitViewport,
  loadSnapshot,
  planDeleteSelection,
  planDuplicateSelection,
  planGroupSelection,
  planUngroup,
  redo,
  saveSnapshot,
  selectionBounds,
  undo,
  type CanvasHistory,
  type CanvasOperation,
} from '@askewly/canvas-core'
import { BrowserDocumentStore } from './browserStore'
import { CanvasSurface } from './CanvasSurface'
import { desktopHost, type DesktopBridgeStatus, type DesktopCanvasSnapshot, type DesktopCanvasSnapshotReason, type PreviewStatus, type TrustedFileSummary, type TrustedProjectSummary } from './desktopHost'
import { ArrangementToolbar } from './ArrangementToolbar'
import { InsertPalette } from './InsertPalette'
import { LayersPanel } from './LayersPanel'
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
  const [projectState, setProjectState] = useState<'loading' | 'ready' | 'opening' | 'error'>('loading')
  const [projectError, setProjectError] = useState('')
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [insertOpen, setInsertOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const stageRef = useRef<HTMLElement>(null)
  const liveConfig = useMemo(() => desktopHost() ? null : liveBridgeConfig(), [])
  const liveClient = useRef<LiveBridgeClient | null>(null)
  const pendingPaint = useRef<{ revision: number; started: number } | null>(null)
  const storageKey = `agent-design:${baseDocument.id}`

  const acceptDesktopSnapshot = useCallback((snapshot: DesktopCanvasSnapshot, reason: DesktopCanvasSnapshotReason, receivedAt = performance.now()) => {
    pendingPaint.current = { revision: snapshot.revision, started: receivedAt }
    setHistory(createHistory(snapshot.document))
    setStatus(`${reason} revision ${snapshot.revision}`)
    setConnection('connected')
  }, [])

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
        setProjectState('ready')
      }
    }, () => { if (active) { setProjectState('error'); setProjectError('Recent projects could not be loaded.') } })
    const unsubscribe = host.onBridgeStatus((next) => { if (active) setDesktopBridge(next) })
    const unsubscribeCanvas = host.onCanvasSnapshot((snapshot, reason) => {
      if (active) acceptDesktopSnapshot(snapshot, reason)
    })
    return () => { active = false; unsubscribe(); unsubscribeCanvas() }
  }, [acceptDesktopSnapshot])

  useEffect(() => {
    const host = desktopHost()
    if (!host || desktopBridge?.state !== 'ready') return
    let active = true
    setConnection('connecting')
    void host.getCanvasSnapshot({ apiVersion: 1 }).then(
      (snapshot) => { if (active) acceptDesktopSnapshot(snapshot, desktopBridge.recoveryMode === 'recovered' ? 'recovery' : 'initial') },
      () => { if (active) setConnection('reconnecting') },
    )
    return () => { active = false }
  }, [acceptDesktopSnapshot, desktopBridge?.recoveryMode, desktopBridge?.state])

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
    setProjectState('opening')
    setProjectError('')
    try {
      const result = await host.selectProject({ apiVersion: 1 })
      if (!result.canceled && result.project) {
        setActiveProject(result.project)
        setRecentProjects((current) => [result.project!, ...current.filter((project) => project.id !== result.project?.id)])
      }
      setProjectState('ready')
    } catch {
      setProjectState('error')
      setProjectError('This folder could not be opened. Check access and try again.')
    }
  }, [])

  const openRecentProject = useCallback(async (projectId: string) => {
    const host = desktopHost()
    if (!host || !projectId) return
    setProjectState('opening')
    try {
      setActiveProject(await host.openRecentProject({ apiVersion: 1, projectId }))
      setProjectState('ready')
    } catch {
      setProjectState('error')
      setProjectError('The recent project is no longer available.')
    }
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
    const host = desktopHost()
    if (host && desktopBridge?.state === 'ready') {
      const started = performance.now()
      void host.applyCanvasOperation({ apiVersion: 1, operation }).then(
        (snapshot) => acceptDesktopSnapshot(snapshot, 'transaction', started),
        (error: unknown) => setStatus(error instanceof Error ? error.message : 'desktop bridge mutation failed'),
      )
      return
    }
    if (liveClient.current) {
      void liveClient.current.applyOperation(operation).catch((error) => setStatus(error instanceof Error ? error.message : 'bridge mutation failed'))
      return
    }
    setHistory((current) => commitOperation(current, operation))
    setStatus('changed')
  }, [acceptDesktopSnapshot, desktopBridge?.state])

  const fitTo = useCallback((bounds: { x: number; y: number; width: number; height: number } | null) => {
    if (!bounds || !(bounds.width > 0 && bounds.height > 0)) return
    const rect = stageRef.current?.getBoundingClientRect()
    const size = rect && rect.width > 0 && rect.height > 0 ? { width: rect.width, height: rect.height } : { width: 960, height: 640 }
    commit({ id: `fit-${performance.now()}`, at: new Date().toISOString(), type: 'set-viewport', ...fitViewport(bounds, size) })
  }, [commit])

  const resetZoom = useCallback(() => {
    commit({ id: `zoom-reset-${performance.now()}`, at: new Date().toISOString(), type: 'set-viewport', pan: history.present.viewport.pan, zoom: 1 })
  }, [commit, history.present.viewport.pan])

  useEffect(() => {
    const isEditable = (target: EventTarget | null) =>
      target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    const onKey = (event: KeyboardEvent) => {
      if (event.isComposing) return
      if (event.key === 'Escape' && shortcutsOpen) { setShortcutsOpen(false); return }
      if (isEditable(event.target)) return
      const present = history.present
      const at = new Date().toISOString()
      const dispatch = (plan: () => CanvasOperation) => { try { commit(plan()) } catch { /* planner rejected the selection */ } }
      if ((event.key === 'Delete' || event.key === 'Backspace') && present.selection.length) {
        event.preventDefault()
        dispatch(() => planDeleteSelection(present, at))
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        if (present.selection.length) dispatch(() => planDuplicateSelection(present, at))
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'g') {
        event.preventDefault()
        dispatch(() => event.shiftKey ? planUngroup(present, at) : planGroupSelection(present, at))
      } else if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault()
        resetZoom()
      } else if (event.shiftKey && event.code === 'Digit1') {
        event.preventDefault()
        fitTo(documentContentBounds(present))
      } else if (event.shiftKey && event.code === 'Digit2') {
        event.preventDefault()
        fitTo(selectionBounds(present))
      } else if (event.key === '?') {
        setShortcutsOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commit, fitTo, history.present, resetZoom, shortcutsOpen])

  const undoCurrent = useCallback(() => {
    const host = desktopHost()
    if (host && desktopBridge?.state === 'ready') {
      const started = performance.now()
      void host.undoCanvas({ apiVersion: 1 }).then(
        (snapshot) => acceptDesktopSnapshot(snapshot, 'transaction', started),
        (error: unknown) => setStatus(error instanceof Error ? error.message : 'desktop bridge undo failed'),
      )
      return
    }
    if (liveClient.current) {
      void liveClient.current.undo().catch((error) => setStatus(error instanceof Error ? error.message : 'bridge undo failed'))
      return
    }
    setHistory(undo)
  }, [acceptDesktopSnapshot, desktopBridge?.state])

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
    <header className="app-header" aria-label="Application title bar">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">A</span>
        <div>
          <h1>Agent Design</h1>
          <p>{activeProject?.displayName ?? 'Untitled workspace'}</p>
        </div>
      </div>
      <div className="header-controls">
        <span className={`workspace-health status-${desktopBridge?.state ?? connection}`}>
          <span className="health-dot" aria-hidden="true" />
          {desktopBridge?.state === 'ready' || connection === 'connected' ? 'Ready' : desktopBridge?.state ?? connection}
        </span>
        {desktopBridge && activeProject && <button className="primary-action" type="button" onClick={() => void selectProject()}>Open project</button>}
      </div>
    </header>
    <nav className="document-actions" aria-label="Workspace toolbar">
      <button type="button" aria-label="Toggle workspace navigation" aria-pressed={leftPanelOpen} onClick={() => setLeftPanelOpen((value) => !value)}>Sidebar</button>
      <button type="button" data-testid="toggle-insert" aria-pressed={insertOpen} onClick={() => setInsertOpen((value) => !value)}>Insert</button>
      <button type="button" data-testid="apply-demo" onClick={applyDemo}>Apply operation</button>
      <button type="button" data-testid="undo" disabled={!liveConfig && !history.past.length} onClick={undoCurrent}>Undo</button>
      <button type="button" data-testid="redo" disabled={!history.future.length} onClick={() => setHistory(redo)}>Redo</button>
      <button type="button" data-testid="save-document" onClick={() => void save()}>Save</button>
      <button type="button" data-testid="reload-document" onClick={() => void reload()}>Reload</button>
      <button type="button" aria-label="Zoom out" onClick={() => commit({ id: `zoom-out-${performance.now()}`, at: new Date().toISOString(), type: 'set-viewport', pan: history.present.viewport.pan, zoom: Math.max(0.25, history.present.viewport.zoom - 0.1) })}>−</button>
      <output className="zoom-value" aria-label="Canvas zoom">{Math.round(history.present.viewport.zoom * 100)}%</output>
      <button type="button" aria-label="Zoom in" onClick={() => commit({ id: `zoom-in-${performance.now()}`, at: new Date().toISOString(), type: 'set-viewport', pan: history.present.viewport.pan, zoom: Math.min(4, history.present.viewport.zoom + 0.1) })}>+</button>
      <button type="button" aria-label="Zoom to 100 percent" onClick={resetZoom}>1:1</button>
      <button type="button" aria-label="Fit canvas" onClick={() => fitTo(documentContentBounds(history.present))}>Fit</button>
      <button type="button" aria-label="Fit selection" disabled={!history.present.selection.length} onClick={() => fitTo(selectionBounds(history.present))}>Fit sel</button>
      <ArrangementToolbar document={history.present} onOperation={commit} />
      <span className="toolbar-spacer" />
      {desktopBridge && <>
        <button type="button" disabled={!activeProject} onClick={() => void togglePreview()}>{preview?.visible ? 'Hide preview' : 'Preview'}</button>
        <button type="button" disabled={!activeProject} onClick={() => activeProject && void desktopHost()?.revealProject({ apiVersion: 1, projectId: activeProject.id })}>Explorer</button>
      </>}
      <button type="button" aria-haspopup="dialog" data-testid="open-shortcuts" onClick={() => setShortcutsOpen(true)}>Shortcuts</button>
      <button type="button" aria-label="Toggle properties" aria-pressed={rightPanelOpen} onClick={() => setRightPanelOpen((value) => !value)}>Properties</button>
    </nav>
    {shortcutsOpen && <div role="dialog" aria-label="Keyboard shortcuts" className="shortcuts-dialog" data-testid="shortcuts-dialog">
      <h2>Keyboard shortcuts</h2>
      <dl>
        <div><dt>Delete / Backspace</dt><dd>Delete selection (toolbar: Delete)</dd></div>
        <div><dt>Ctrl+D</dt><dd>Duplicate selection (toolbar: Duplicate)</dd></div>
        <div><dt>Ctrl+G / Ctrl+Shift+G</dt><dd>Group / Ungroup (toolbar: Group, Ungroup)</dd></div>
        <div><dt>Ctrl+0</dt><dd>Zoom to 100% (toolbar: 1:1)</dd></div>
        <div><dt>Shift+1 / Shift+2</dt><dd>Fit canvas / Fit selection (toolbar: Fit, Fit sel)</dd></div>
        <div><dt>Ctrl+Wheel</dt><dd>Zoom around cursor (toolbar: − / +)</dd></div>
        <div><dt>Space+Drag</dt><dd>Pan the canvas</dd></div>
        <div><dt>← / →</dt><dd>Traverse sibling layers on the canvas</dd></div>
        <div><dt>Alt+↑ / Alt+↓</dt><dd>Reorder the selected layer</dd></div>
        <div><dt>F2 / Double-click</dt><dd>Rename in the Layers panel</dd></div>
        <div><dt>Escape</dt><dd>Clear selection or cancel a gesture</dd></div>
      </dl>
      <button type="button" onClick={() => setShortcutsOpen(false)}>Close</button>
    </div>}
    {desktopHost() && !activeProject ? <section className="project-entry" aria-label="Open a project">
      <div className="entry-copy">
        <span className="entry-mark" aria-hidden="true">A</span>
        <p className="eyebrow">Agent Design workspace</p>
        <h2>Turn your React project into a visual canvas.</h2>
        <p>Open a trusted local folder. Your source, canvas, and terminal agents will share one revisioned workspace.</p>
        <button className="primary-action entry-action" type="button" disabled={projectState === 'opening'} onClick={() => void selectProject()}>{projectState === 'opening' ? 'Opening…' : 'Open project'}</button>
        {projectState === 'loading' && <p role="status">Loading recent projects…</p>}
        {projectState === 'error' && <p className="entry-error" role="alert">{projectError} <button type="button" onClick={() => void selectProject()}>Try again</button></p>}
      </div>
      {recentProjects.length > 0 && <div className="recent-projects"><h3>Recent projects</h3>{recentProjects.map((project) => <button type="button" key={project.id} onClick={() => void openRecentProject(project.id)}><strong>{project.displayName}</strong><span>Open workspace</span></button>)}</div>}
    </section> : <section className={`app-body${leftPanelOpen ? '' : ' left-collapsed'}${rightPanelOpen ? '' : ' right-collapsed'}`}>
      {leftPanelOpen && <aside className="workspace-rail" aria-label="Workspace navigation">
        <div className="rail-section">
          <p className="rail-label">Workspace</p>
          <button type="button" className="rail-item active" aria-current="page">Canvas</button>
          <button type="button" className="rail-item" disabled>Assets <span>Soon</span></button>
        </div>
        <div className="rail-section layers-rail">
          <p className="rail-label">Layers</p>
          <LayersPanel document={history.present} onOperation={commit} />
        </div>
        {desktopBridge && <div className="rail-section project-rail">
          <p className="rail-label">Project</p>
          <select aria-label="Recent projects" value={activeProject?.id ?? ''} onChange={(event) => void openRecentProject(event.target.value)}>
            <option value="">{activeProject?.displayName ?? 'Recent projects'}</option>
            {recentProjects.map((project) => <option key={project.id} value={project.id}>{project.displayName}</option>)}
          </select>
          <select aria-label="Project files" defaultValue="" onChange={(event) => {
            const fileId = event.target.value
            if (activeProject && fileId) void desktopHost()?.openFile({ apiVersion: 1, projectId: activeProject.id, fileId })
            event.target.value = ''
          }}>
            <option value="">Open file</option>
            {projectFiles.map((file) => <option key={file.id} value={file.id}>{file.label}</option>)}
          </select>
        </div>}
        <details className="diagnostics-panel">
          <summary>Development</summary>
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
          {desktopBridge && <button type="button" onClick={() => void desktopHost()?.exportDiagnostics({ apiVersion: 1 })}>Diagnostics</button>}
        </details>
      </aside>}
      <section className="canvas-stage" aria-label="Design canvas" ref={stageRef}>
        {insertOpen && <InsertPalette document={history.present} onOperation={commit} />}
        <CanvasSurface document={history.present} editorPlaneFailure={failure} onOperation={commit} />
      </section>
      {rightPanelOpen && <PropertyInspector document={history.present} onOperation={commit} />}
    </section>}
    <footer className="workspace-status" aria-label="Workspace status">
      <output data-testid="persistence-status">{status}</output>
      <span>Revision {history.present.revision}</span>
      <span>{Object.keys(history.present.nodes).length.toLocaleString()} nodes</span>
      <output className={`connection-status status-${connection}`} data-testid="bridge-status">{connection}{liveLatency === null ? '' : ` · ${liveLatency.toFixed(1)}ms`}</output>
      {desktopBridge && <div className="desktop-bridge-controls">
        <output className={`connection-status status-${desktopBridge.state}`} data-testid="desktop-bridge-status">
          desktop {desktopBridge.state}{desktopBridge.recoveryMode ? ` · ${desktopBridge.recoveryMode}` : ''} · restart {desktopBridge.restartCount}
        </output>
        <button type="button" disabled={desktopBridge.state !== 'ready'} onClick={() => void copyTerminalCommand('codex')}>Copy Codex</button>
        <button type="button" disabled={desktopBridge.state !== 'ready'} onClick={() => void copyTerminalCommand('claude')}>Copy Claude</button>
        <output aria-live="polite" data-testid="terminal-copy-status">{terminalCopy === 'idle' ? '' : terminalCopy === 'error' ? 'copy failed' : `${terminalCopy} copied`}</output>
      </div>}
    </footer>
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
