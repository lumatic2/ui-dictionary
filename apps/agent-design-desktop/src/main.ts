import { app, BrowserWindow, session } from 'electron'
import { join, resolve } from 'node:path'
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
  registerHostIpc(app.getVersion())
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
