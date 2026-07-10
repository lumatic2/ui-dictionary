import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { URL } from 'node:url'
import { BridgeProtocolError, projectContext, type TransactionEnvelope } from '@askewly/agent-design-engine'
import type { CanvasDocument } from '@askewly/canvas-core'
import { WebSocketServer, WebSocket } from 'ws'
import { BridgeSession } from './session.js'

export interface StartBridgeOptions {
  projectRoot: string
  document: CanvasDocument
  port?: number
  token?: string
  maxEvents?: number
}

export interface RunningBridge {
  session: BridgeSession
  url: string
  wsUrl: string
  close(): Promise<void>
}

function bearer(request: IncomingMessage): string | undefined {
  const value = request.headers.authorization
  return value?.startsWith('Bearer ') ? value.slice(7) : undefined
}

function json(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

function failure(response: ServerResponse, error: unknown): void {
  if (error instanceof BridgeProtocolError) {
    json(response, error.status, { error: { code: error.code, message: error.message } })
    return
  }
  json(response, 500, { error: { code: 'INTERNAL_ERROR', message: 'bridge request failed' } })
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let length = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    length += buffer.length
    if (length > 1_000_000) throw new BridgeProtocolError('INVALID_TRANSACTION', 'request body too large', 413)
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new BridgeProtocolError('INVALID_TRANSACTION', 'request body must be valid JSON', 400)
  }
}

export async function startBridge(options: StartBridgeOptions): Promise<RunningBridge> {
  const session = new BridgeSession(options)
  const sockets = new Set<WebSocket>()
  const server = createServer(async (request, response) => {
    try {
      session.authorize(bearer(request), request.socket.remoteAddress)
      if (request.method === 'GET' && request.url === '/snapshot') {
        json(response, 200, session.snapshot())
        return
      }
      if (request.method === 'GET' && request.url === '/context') {
        json(response, 200, { ...projectContext(session.snapshot().document), sourceFiles: session.sourceFiles() })
        return
      }
      if (request.method === 'POST' && request.url === '/transactions') {
        const event = session.commit((await readJson(request)) as TransactionEnvelope)
        json(response, 200, { event, snapshot: session.snapshot() })
        return
      }
      if (request.method === 'POST' && request.url === '/verify') {
        const input = (await readJson(request)) as { revision?: number; hash?: string }
        const snapshot = session.snapshot()
        const valid = (input.revision === undefined || input.revision === snapshot.revision) && (input.hash === undefined || input.hash === snapshot.hash)
        json(response, valid ? 200 : 409, { valid, revision: snapshot.revision, hash: snapshot.hash })
        return
      }
      if (request.method === 'POST' && request.url === '/undo') {
        const event = session.undo((await readJson(request)) as Parameters<BridgeSession['undo']>[0])
        json(response, 200, { event, snapshot: session.snapshot() })
        return
      }
      if (request.method === 'POST' && request.url === '/source-patches') {
        const event = session.applySourcePatch((await readJson(request)) as Parameters<BridgeSession['applySourcePatch']>[0])
        json(response, 200, { event, snapshot: session.snapshot(), audit: session.auditLog().at(-1) })
        return
      }
      if (request.method === 'GET' && request.url === '/audit') {
        json(response, 200, { entries: session.auditLog() })
        return
      }
      json(response, 404, { error: { code: 'NOT_FOUND', message: 'route not found' } })
    } catch (error) {
      failure(response, error)
    }
  })
  const websocket = new WebSocketServer({ noServer: true })
  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1')
      if (url.pathname !== '/events') throw new BridgeProtocolError('AUTH_REQUIRED', 'invalid event route', 401)
      session.authorize(url.searchParams.get('token') ?? undefined, request.socket.remoteAddress)
      websocket.handleUpgrade(request, socket, head, (client) => websocket.emit('connection', client, request))
    } catch {
      socket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n')
      socket.destroy()
    }
  })
  websocket.on('connection', (client, request) => {
    sockets.add(client)
    const url = new URL(request.url ?? '/', 'http://127.0.0.1')
    const cursor = Number.parseInt(url.searchParams.get('cursor') ?? '0', 10)
    client.send(JSON.stringify({ type: 'replay', payload: session.replay(Number.isFinite(cursor) ? cursor : 0) }))
    client.on('close', () => sockets.delete(client))
  })
  const unsubscribe = session.subscribe((event) => {
    const message = JSON.stringify({ type: 'event', event })
    for (const client of sockets) if (client.readyState === WebSocket.OPEN) client.send(message)
  })
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(options.port ?? 0, '127.0.0.1', () => resolve())
  })
  const address = server.address() as AddressInfo
  const url = `http://127.0.0.1:${address.port}`
  return {
    session,
    url,
    wsUrl: `ws://127.0.0.1:${address.port}`,
    close: async () => {
      unsubscribe()
      for (const client of sockets) client.close()
      await new Promise<void>((resolve, reject) => websocket.close(() => server.close((error) => (error ? reject(error) : resolve()))))
    },
  }
}
