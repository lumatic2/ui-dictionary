import { protocol } from 'electron'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { resolveAppAsset } from './asset-path'

export const APP_SCHEME = 'app'

const CONTENT_TYPES: Readonly<Record<string, string>> = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
})

export function registerAppScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: APP_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: false,
      },
    },
  ])
}

export async function installAppProtocol(rendererRoot: string): Promise<void> {
  await protocol.handle(APP_SCHEME, async (request) => {
    try {
      const url = new URL(request.url)
      if (url.hostname !== 'renderer') return new Response('Not found', { status: 404 })
      const asset = await resolveAppAsset(rendererRoot, url.pathname)
      const body = new Uint8Array(await readFile(asset))
      return new Response(body, {
        headers: { 'Content-Type': CONTENT_TYPES[extname(asset).toLowerCase()] ?? 'application/octet-stream' },
      })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  })
}
