const { app, BrowserWindow, session } = require('electron')
const { mkdtempSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')

const userData = mkdtempSync(path.join(tmpdir(), 'agent-design-electron-smoke-'))
app.setPath('userData', userData)
app.commandLine.appendSwitch('disable-gpu')
const { registerAppScheme } = require('../dist/protocol.js')
registerAppScheme()
app.enableSandbox()

app.whenReady().then(async () => {
  const { createMainWindowOptions } = require('../dist/security.js')
  const {
    configureSessionSecurity,
    configureWindowSecurity,
  } = require('../dist/security.js')
  const { installAppProtocol } = require('../dist/protocol.js')
  const { registerHostIpc } = require('../dist/ipc.js')
  configureSessionSecurity(session.defaultSession)
  await installAppProtocol(path.resolve(__dirname, '..', '..', 'agent-design', 'dist'))
  const disposeIpc = registerHostIpc('security-smoke')
  const window = new BrowserWindow({
    ...createMainWindowOptions(path.join(__dirname, '..', 'dist', 'preload.cjs')),
    show: false,
  })
  configureWindowSecurity(window)
  await window.loadURL('app://renderer/index.html')
  const result = await window.webContents.executeJavaScript(`(async () => {
    const hostInfo = await globalThis.agentDesignHost.getHostInfo({ apiVersion: 1, projectId: 'project:smoke' })
    const bridgeStatus = await globalThis.agentDesignHost.getBridgeStatus({ apiVersion: 1 })
    const recentProjects = await globalThis.agentDesignHost.recentProjects({ apiVersion: 1 })
    let authorityRejected = false
    try {
      await globalThis.agentDesignHost.getHostInfo({ apiVersion: 1, path: 'C:/secret' })
    } catch {
      authorityRejected = true
    }
    return {
      processType: typeof globalThis.process,
      requireType: typeof globalThis.require,
      moduleType: typeof globalThis.module,
      hostApiKeys: Object.keys(globalThis.agentDesignHost || {}).sort(),
      hostInfo,
      bridgeStatus,
      recentProjects,
      authorityRejected,
      permissionState: (await navigator.permissions.query({ name: 'geolocation' })).state,
      networkBlocked: await fetch('https://example.com').then(() => false, () => true),
      popupBlocked: window.open('https://example.com') === null
    }
  })()`)
  const expectedKeys = ['apiVersion', 'catalogFiles', 'copyTerminalCommand', 'exportDiagnostics', 'getBridgeStatus', 'getHostInfo', 'hidePreview', 'onBridgeStatus', 'openFile', 'openPreview', 'openRecentProject', 'recentProjects', 'revealProject', 'selectProject']
  const passed =
    result.processType === 'undefined' &&
    result.requireType === 'undefined' &&
    result.moduleType === 'undefined' &&
    JSON.stringify(result.hostApiKeys) === JSON.stringify(expectedKeys) &&
    result.hostInfo.apiVersion === 1 &&
    result.hostInfo.appVersion === 'security-smoke' &&
    result.bridgeStatus.state === 'idle' &&
    !/token|url|path/i.test(JSON.stringify(result.bridgeStatus)) &&
    Array.isArray(result.recentProjects) && result.recentProjects.length === 0 &&
    result.authorityRejected === true &&
    result.permissionState === 'denied' &&
    result.networkBlocked === true &&
    result.popupBlocked === true
  process.stdout.write(`${JSON.stringify({ passed, ...result })}\n`)
  disposeIpc()
  window.destroy()
  await session.defaultSession.clearCache().catch(() => {})
  app.once('will-quit', () => {
    try { rmSync(userData, { recursive: true, force: true }) } catch {}
  })
  app.quit()
  process.exitCode = passed ? 0 : 1
}).catch((error) => {
  console.error(error)
  app.exit(1)
})
