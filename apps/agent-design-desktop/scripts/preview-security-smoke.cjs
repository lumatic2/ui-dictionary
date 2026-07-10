const { app, BrowserWindow } = require('electron')
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')

const root = mkdtempSync(path.join(tmpdir(), 'agent-design-preview-smoke-'))
const project = path.join(root, 'project')
mkdirSync(project)
writeFileSync(path.join(project, 'index.html'), '<!doctype html><meta charset="utf-8"><main id="preview">Hostile preview</main><script type="module" src="/app.js"></script>')
writeFileSync(path.join(project, 'app.js'), 'globalThis.previewScriptLoaded = true')
app.setPath('userData', path.join(root, 'user-data'))
app.commandLine.appendSwitch('disable-gpu')
const { registerPreviewScheme } = require('../dist/preview-manager.js')
registerPreviewScheme()
app.enableSandbox()

app.whenReady().then(async () => {
  const { TrustedProjectRegistry } = require('../dist/project-registry.js')
  const { PreviewManager } = require('../dist/preview-manager.js')
  const registry = new TrustedProjectRegistry(path.join(root, 'registry'))
  const trusted = await registry.trust(project)
  const parent = new BrowserWindow({ width: 1000, height: 700, show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } })
  const preview = new PreviewManager(parent, registry)
  const status = await preview.open(trusted.id)
  const contents = preview.webContentsForTesting()
  const result = await contents.executeJavaScript(`(async () => {
    const beforeNavigation = location.href
    const anchor = document.createElement('a')
    anchor.href = 'https://example.com/escape'
    document.body.append(anchor)
    anchor.click()
    await new Promise((resolve) => setTimeout(resolve, 50))
    return {
      processType: typeof globalThis.process,
      requireType: typeof globalThis.require,
      hostApiType: typeof globalThis.agentDesignHost,
      scriptLoaded: globalThis.previewScriptLoaded === true,
      permissionState: (await navigator.permissions.query({ name: 'geolocation' })).state,
      networkBlocked: await fetch('https://example.com').then(() => false, () => true),
      fileBlocked: await fetch('file:///C:/Windows/win.ini').then(() => false, () => true),
      popupBlocked: window.open('shell:AppsFolder') === null,
      navigationBlocked: location.href === beforeNavigation,
      protocol: location.protocol
    }
  })()`)
  const preferences = contents.getLastWebPreferences()
  const passed =
    status.state === 'ready' && result.processType === 'undefined' && result.requireType === 'undefined' &&
    result.hostApiType === 'undefined' && result.scriptLoaded && result.permissionState === 'denied' &&
    result.networkBlocked && result.fileBlocked && result.popupBlocked && result.navigationBlocked && result.protocol === 'preview:' &&
    preferences.sandbox === true && preferences.contextIsolation === true && preferences.nodeIntegration === false &&
    contents.session.isPersistent() === false
  process.stdout.write(`${JSON.stringify({ passed, status, result, preferences: { sandbox: preferences.sandbox, contextIsolation: preferences.contextIsolation, nodeIntegration: preferences.nodeIntegration, ephemeralPartition: !contents.session.isPersistent() } })}\n`)
  preview.close()
  parent.destroy()
  app.once('will-quit', () => { try { rmSync(root, { recursive: true, force: true }) } catch {} })
  app.quit()
  process.exitCode = passed ? 0 : 1
}).catch((error) => {
  console.error(error)
  app.exit(1)
})
