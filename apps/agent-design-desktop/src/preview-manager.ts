import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { WebContentsView, protocol, session, type BrowserWindow, type Session } from 'electron'
import { TrustedProjectRegistry } from './project-registry'
import { PREVIEW_CSP, PREVIEW_WEB_PREFERENCES } from './preview-security'

export { PREVIEW_CSP, PREVIEW_WEB_PREFERENCES } from './preview-security'

export const PREVIEW_SCHEME = 'preview'
const TYPES: Readonly<Record<string, string>> = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
})

export function registerPreviewScheme(): void {
  protocol.registerSchemesAsPrivileged([{ scheme: PREVIEW_SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: false } }])
}

export async function configurePreviewSession(target: Session, registry: TrustedProjectRegistry): Promise<void> {
  target.setPermissionCheckHandler(() => false)
  target.setPermissionRequestHandler((_contents, _permission, callback) => callback(false))
  target.on('will-download', (event, item) => { event.preventDefault(); item.cancel() })
  target.webRequest.onBeforeRequest((details, callback) => {
    try {
      const url = new URL(details.url)
      callback({ cancel: url.protocol !== 'preview:' || !/^[a-f0-9]{24}$/.test(url.hostname) })
    } catch {
      callback({ cancel: true })
    }
  })
  target.webRequest.onHeadersReceived((details, callback) => callback({
    responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [PREVIEW_CSP] },
  }))
  await target.protocol.handle(PREVIEW_SCHEME, async (request) => {
    try {
      const url = new URL(request.url)
      if (!/^[a-f0-9]{24}$/.test(url.hostname)) return new Response('Not found', { status: 404 })
      const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html'
      const extension = extname(relativePath).toLowerCase()
      const contentType = TYPES[extension]
      if (!contentType) return new Response('Unsupported asset', { status: 415 })
      const file = await registry.resolveExisting(`project:${url.hostname}`, relativePath)
      return new Response(new Uint8Array(await readFile(file)), { headers: { 'Content-Type': contentType } })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  })
}

export interface PreviewStatus {
  visible: boolean
  projectId: string | null
  state: 'idle' | 'loading' | 'ready' | 'error'
}

export class PreviewManager {
  private readonly view: WebContentsView
  private readonly ready: Promise<void>
  private current: PreviewStatus = { visible: false, projectId: null, state: 'idle' }

  constructor(private readonly parent: BrowserWindow, private readonly registry: TrustedProjectRegistry) {
    const partition = `agent-design-preview:${randomUUID()}`
    const previewSession = session.fromPartition(partition, { cache: false })
    this.ready = configurePreviewSession(previewSession, registry)
    this.view = new WebContentsView({ webPreferences: { ...PREVIEW_WEB_PREFERENCES, partition } })
    this.view.setVisible(false)
    this.view.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
    this.view.webContents.on('will-navigate', (event, url) => {
      const expectedHost = this.current.projectId?.slice('project:'.length)
      try {
        const target = new URL(url)
        if (target.protocol !== 'preview:' || target.hostname !== expectedHost) event.preventDefault()
      } catch {
        event.preventDefault()
      }
    })
    this.view.webContents.on('will-attach-webview', (event) => event.preventDefault())
    this.view.webContents.on('did-finish-load', () => { this.current = { ...this.current, state: 'ready' } })
    this.view.webContents.on('did-fail-load', () => { this.current = { ...this.current, state: 'error' } })
    parent.contentView.addChildView(this.view)
    this.layout()
    parent.on('resize', () => this.layout())
    parent.on('closed', () => this.close())
  }

  status(): PreviewStatus {
    return { ...this.current }
  }

  async open(projectId: string): Promise<PreviewStatus> {
    await this.ready
    const hash = projectId.slice('project:'.length)
    if (!/^[a-f0-9]{24}$/.test(hash)) throw new Error('INVALID_PROJECT_ID')
    await this.registry.resolveExisting(projectId, 'index.html')
    this.current = { visible: true, projectId, state: 'loading' }
    this.view.setVisible(true)
    await this.view.webContents.loadURL(`preview://${hash}/index.html`)
    return this.status()
  }

  hide(): PreviewStatus {
    this.view.setVisible(false)
    this.current = { ...this.current, visible: false }
    return this.status()
  }

  close(): void {
    if (!this.view.webContents.isDestroyed()) this.view.webContents.close()
  }

  webContentsForTesting() {
    return this.view.webContents
  }

  private layout(): void {
    const [width = 1, height = 1] = this.parent.getContentSize()
    this.view.setBounds({ x: 24, y: 146, width: Math.max(1, width - 308), height: Math.max(1, height - 170) })
  }
}
