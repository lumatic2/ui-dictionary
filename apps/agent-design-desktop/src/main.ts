import { app, BrowserWindow, clipboard, session } from 'electron'
import { join, resolve } from 'node:path'
import { BridgeSupervisor } from './bridge-supervisor'
import { ElectronBridgeProcessFactory } from './electron-bridge-process'
import { HOST_IPC_CHANNELS } from './contract'
import { registerHostIpc } from './ipc'
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
  registerHostIpc(app.getVersion(), {
    bridgeStatus: () => supervisor.status(),
    copyTerminalCommand: (actor) => clipboard.writeText(supervisor.terminalCommand(actor)),
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
