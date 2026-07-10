import { app, BrowserWindow, clipboard, dialog, session } from 'electron'
import { join, resolve } from 'node:path'
import { BridgeSupervisor } from './bridge-supervisor'
import { ElectronBridgeProcessFactory } from './electron-bridge-process'
import { HOST_IPC_CHANNELS } from './contract'
import { registerHostIpc } from './ipc'
import { ProjectController } from './project-controller'
import { TrustedProjectRegistry } from './project-registry'
import { installAppProtocol, registerAppScheme } from './protocol'
import {
  APP_ORIGIN,
  configureSessionSecurity,
  configureWindowSecurity,
  createMainWindowOptions,
} from './security'

registerAppScheme()
app.enableSandbox()

function bridgeChildEntry(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'bridge', 'desktop-child.js')
    : resolve(__dirname, '..', '..', 'agent-design-bridge', 'dist', 'desktop-child.js')
}

function adapterEntry(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'mcp', 'cli.js')
    : resolve(__dirname, '..', '..', '..', 'packages', 'agent-design-mcp', 'dist', 'cli.js')
}

function rendererRoot(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'renderer')
    : resolve(__dirname, '..', '..', 'agent-design', 'dist')
}

async function createMainWindow(): Promise<BrowserWindow> {
  // Factory output is locked and runtime-verified; the legacy scanner cannot follow it.
  const window = new BrowserWindow(createMainWindowOptions(join(__dirname, 'preload.cjs'))) // eng-disable CONTEXT_ISOLATION_JS_CHECK
  configureWindowSecurity(window)
  window.once('ready-to-show', () => window.show())
  await window.loadURL(`${APP_ORIGIN}/index.html`)
  return window
}

app.whenReady().then(async () => {
  configureSessionSecurity(session.defaultSession)
  await installAppProtocol(rendererRoot())
  const supervisor = new BridgeSupervisor(new ElectronBridgeProcessFactory(bridgeChildEntry()), adapterEntry())
  const registry = new TrustedProjectRegistry(app.getPath('userData'))
  await registry.initialize()
  const projects = new ProjectController(registry, supervisor)
  registerHostIpc(app.getVersion(), {
    bridgeStatus: () => supervisor.status(),
    copyTerminalCommand: (actor) => clipboard.writeText(supervisor.terminalCommand(actor)),
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
  })
  supervisor.subscribe((status) => {
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(HOST_IPC_CHANNELS.bridgeStatusChanged, status)
    }
  })
  let shutdownStarted = false
  app.on('before-quit', (event) => {
    if (shutdownStarted) return
    event.preventDefault()
    shutdownStarted = true
    void supervisor.stop().finally(() => app.quit())
  })
  const [recent] = await projects.recent()
  if (recent) await projects.openRecent(recent.id).catch((error: unknown) => console.error('Recent project recovery failed', error))
  await createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) void createMainWindow()
  })
}).catch((error: unknown) => {
  console.error('Agent Design desktop failed to start', error)
  app.exit(1)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
