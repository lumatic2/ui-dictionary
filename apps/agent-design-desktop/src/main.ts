import { app, BrowserWindow, clipboard, dialog, session, shell } from 'electron'
import { open, rename, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { BridgeSupervisor } from './bridge-supervisor'
import { BridgeRelay } from './bridge-relay'
import { ElectronBridgeProcessFactory } from './electron-bridge-process'
import { HOST_IPC_CHANNELS } from './contract'
import { createDiagnosticBundle } from './diagnostics'
import { registerHostIpc } from './ipc'
import { GuardedOsActions } from './os-actions'
import { PreviewManager, registerPreviewScheme } from './preview-manager'
import { ProjectController } from './project-controller'
import { TrustedProjectRegistry } from './project-registry'
import { installAppProtocol, registerAppScheme } from './protocol'
import { squirrelStartupPlan } from './squirrel-startup'
import {
  APP_ORIGIN,
  configureSessionSecurity,
  configureWindowSecurity,
  createMainWindowOptions,
} from './security'

const squirrel = squirrelStartupPlan(process.argv, process.execPath)
if (squirrel) {
  if (!squirrel.updateExecutable) app.quit()
  else {
    const update = spawn(squirrel.updateExecutable, [...squirrel.args], { detached: true, stdio: 'ignore', windowsHide: true })
    update.once('error', (error) => { console.error('Squirrel startup action failed', error); app.quit() })
    update.once('close', () => app.quit())
  }
} else {
  registerAppScheme()
  registerPreviewScheme()
  app.enableSandbox()
}

async function writeDiagnosticExport(path: string, content: string): Promise<void> {
  const temporary = `${path}.tmp-${process.pid}-${Date.now()}`
  const handle = await open(temporary, 'wx')
  try {
    await handle.writeFile(content, 'utf8')
    await handle.sync()
  } finally {
    await handle.close()
  }
  try {
    await rename(temporary, path)
  } catch (error) {
    await rm(temporary, { force: true })
    throw error
  }
}

function bridgeChildEntry(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'bridge', 'desktop-child.mjs')
    : resolve(__dirname, '..', '..', 'agent-design-bridge', 'dist', 'desktop-child.js')
}

function adapterEntry(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'mcp', 'cli.mjs')
    : resolve(__dirname, '..', '..', '..', 'packages', 'agent-design-mcp', 'dist', 'cli.js')
}

function rendererRoot(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'renderer')
    : resolve(__dirname, '..', '..', 'agent-design', 'dist')
}

async function createMainWindow(setup?: (window: BrowserWindow) => void): Promise<BrowserWindow> {
  // Factory output is locked and runtime-verified; the legacy scanner cannot follow it.
  const window = new BrowserWindow(createMainWindowOptions(join(__dirname, 'preload.cjs'))) // eng-disable CONTEXT_ISOLATION_JS_CHECK
  configureWindowSecurity(window)
  setup?.(window)
  window.once('ready-to-show', () => window.show())
  await window.loadURL(`${APP_ORIGIN}/index.html`)
  return window
}

app.whenReady().then(async () => {
  if (squirrel) return
  configureSessionSecurity(session.defaultSession)
  await installAppProtocol(rendererRoot())
  const supervisor = new BridgeSupervisor(new ElectronBridgeProcessFactory(bridgeChildEntry()), adapterEntry())
  const relay = new BridgeRelay()
  const registry = new TrustedProjectRegistry(app.getPath('userData'))
  await registry.initialize()
  const projects = new ProjectController(registry, supervisor)
  const osActions = new GuardedOsActions(registry, (path) => shell.openPath(path))
  let preview: PreviewManager | null = null
  registerHostIpc(app.getVersion(), {
    bridgeStatus: () => supervisor.status(),
    copyTerminalCommand: (actor) => clipboard.writeText(supervisor.terminalCommand(actor)),
    canvasSnapshot: () => relay.currentSnapshot(),
    applyCanvasOperation: (operation) => relay.applyOperation(operation),
    undoCanvas: () => relay.undo(),
    collaborationFeed: () => relay.currentFeed(),
    selectProject: async () => {
      const parent = BrowserWindow.getFocusedWindow()
      const options: Electron.OpenDialogOptions = { title: 'Trust a React project', properties: ['openDirectory', 'dontAddToRecent'] }
      const result = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options)
      const selected = result.filePaths[0]
      if (result.canceled || !selected) return { canceled: true, project: null }
      return { canceled: false, project: await projects.trustAndOpen(selected) }
    },
    recentProjects: () => projects.recent(),
    openRecentProject: (projectId) => projects.openRecent(projectId),
    openPreview: (projectId) => {
      if (!preview) throw new Error('preview is not ready')
      return preview.open(projectId)
    },
    hidePreview: () => preview?.hide() ?? { visible: false, projectId: null, state: 'idle' },
    catalogFiles: (projectId) => osActions.catalogFiles(projectId),
    revealProject: (projectId) => osActions.revealProject(projectId),
    openFile: (projectId, fileId) => osActions.openFile(projectId, fileId),
    exportDiagnostics: async () => {
      const parent = BrowserWindow.getFocusedWindow()
      const options: Electron.SaveDialogOptions = { title: 'Export redacted diagnostics', defaultPath: `agent-design-diagnostics-${new Date().toISOString().slice(0, 10)}.json` }
      const result = parent ? await dialog.showSaveDialog(parent, options) : await dialog.showSaveDialog(options)
      if (result.canceled || !result.filePath) return false
      const trustedProjectCount = (await projects.recent()).length
      await writeDiagnosticExport(result.filePath, createDiagnosticBundle({
        appVersion: app.getVersion(),
        electronVersion: process.versions.electron,
        platform: process.platform,
        arch: process.arch,
        bridge: supervisor.status(),
        trustedProjectCount,
      }))
      return true
    },
  })
  relay.subscribe((snapshot, reason) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(HOST_IPC_CHANNELS.canvasSnapshotChanged, snapshot, reason)
    }
  })
  relay.subscribeFeed((feed) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(HOST_IPC_CHANNELS.collaborationFeedChanged, feed)
    }
  })
  let relayedProjectId: string | null = null
  supervisor.subscribe((status) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(HOST_IPC_CHANNELS.bridgeStatusChanged, status)
    }
    if (status.state === 'ready' && status.projectId && relayedProjectId !== status.projectId) {
      relayedProjectId = status.projectId
      void relay.connect(supervisor.mainConnection()).catch((error: unknown) => {
        relayedProjectId = null
        console.error('Canvas relay failed to connect', error)
      })
    } else if (status.state !== 'ready' && relayedProjectId !== null) {
      relay.disconnect()
      relayedProjectId = null
    }
  })
  let shutdownStarted = false
  app.on('before-quit', (event) => {
    if (shutdownStarted) return
    event.preventDefault()
    shutdownStarted = true
    relay.disconnect()
    void supervisor.stop().finally(() => app.quit())
  })
  const [recent] = await projects.recent()
  if (recent) await projects.openRecent(recent.id).catch((error: unknown) => console.error('Recent project recovery failed', error))
  await createMainWindow((window) => { preview = new PreviewManager(window, registry) })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) void createMainWindow((window) => { preview = new PreviewManager(window, registry) })
  })
}).catch((error: unknown) => {
  console.error('AskewlyDesign desktop failed to start', error)
  app.exit(1)
})

app.on('window-all-closed', () => {
  if (!squirrel && process.platform !== 'darwin') app.quit()
})
