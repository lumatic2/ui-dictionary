import { createHash } from 'node:crypto'
import { createServer, type Server as HttpServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import type { Duplex } from 'node:stream'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LiveContextSubscription } from './liveContext.js'

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

function acceptKeyFor(key: string): string {
  return createHash('sha1').update(key + GUID).digest('base64')
}

function encodeTextFrame(payload: string): Buffer {
  const data = Buffer.from(payload, 'utf8')
  const len = data.length
  let header: Buffer
  if (len < 126) {
    header = Buffer.from([0x81, len])
  } else if (len < 65536) {
    header = Buffer.alloc(4)
    header[0] = 0x81
    header[1] = 126
    header.writeUInt16BE(len, 2)
  } else {
    header = Buffer.alloc(10)
    header[0] = 0x81
    header[1] = 127
    header.writeBigUInt64BE(BigInt(len), 2)
  }
  return Buffer.concat([header, data])
}

/** Minimal hand-rolled /events WS mock: accepts the RFC 6455 handshake and lets tests push text frames or drop the connection. */
class MockEventsServer {
  private readonly http: HttpServer
  private readonly sockets = new Set<Duplex>()
  connections: Duplex[] = []
  url = ''

  constructor() {
    this.http = createServer((_request, response) => {
      response.writeHead(404)
      response.end()
    })
    this.http.on('upgrade', (request, socket) => {
      const key = request.headers['sec-websocket-key']
      if (typeof key !== 'string') {
        socket.destroy()
        return
      }
      socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n'
        + 'Upgrade: websocket\r\n'
        + 'Connection: Upgrade\r\n'
        + `Sec-WebSocket-Accept: ${acceptKeyFor(key)}\r\n\r\n`,
      )
      this.sockets.add(socket)
      this.connections.push(socket)
      socket.on('close', () => this.sockets.delete(socket))
      socket.on('error', () => this.sockets.delete(socket))
    })
  }

  async start(): Promise<string> {
    await new Promise<void>((resolve) => this.http.listen(0, '127.0.0.1', resolve))
    const address = this.http.address() as AddressInfo
    this.url = `http://127.0.0.1:${address.port}`
    return this.url
  }

  send(socket: Duplex, payload: unknown): void {
    socket.write(encodeTextFrame(JSON.stringify(payload)))
  }

  dropAll(): void {
    for (const socket of this.sockets) socket.destroy()
    this.sockets.clear()
  }

  async close(): Promise<void> {
    this.dropAll()
    await new Promise<void>((resolve, reject) => this.http.close((error) => (error ? reject(error) : resolve())))
  }
}

const closers: Array<() => Promise<void> | void> = []

afterEach(async () => {
  for (const close of closers.splice(0)) await close()
})

function fixtureDocument(revision: number, selection: string[]) {
  return {
    id: 'doc-1',
    name: 'Fixture',
    revision,
    selection,
    nodes: Object.fromEntries(selection.map((id) => [id, { id, kind: 'frame' }])),
    metadata: { sourceRoot: '.' },
  }
}

describe('LiveContextSubscription', () => {
  it('reflects a pushed live event without polling REST', async () => {
    const mock = new MockEventsServer()
    const url = await mock.start()
    closers.push(() => mock.close())
    const fetchContext = vi.fn(async () => ({
      documentId: 'doc-1', documentName: 'Fixture', revision: 0, hash: 'hash-0', selection: [], selectedNodes: [], sourceRoot: '.', sourceFiles: [],
    }))
    const subscription = new LiveContextSubscription({ bridgeUrl: url, token: 'test-token', fetchContext })
    closers.push(() => subscription.stop())
    subscription.start()

    await vi.waitFor(() => expect(subscription.isHealthy()).toBe(true))
    const socket = mock.connections[0]
    mock.send(socket, { type: 'replay', payload: { mode: 'events', events: [], cursor: 0 } })
    await vi.waitFor(() => expect(fetchContext).toHaveBeenCalled())
    await vi.waitFor(() => expect(subscription.snapshot()?.revision).toBe(0))

    mock.send(socket, {
      type: 'event',
      event: { cursor: 1, actor: 'codex', transactionId: 'tx-1', revision: 1 },
      snapshot: { document: fixtureDocument(1, ['node-1']), revision: 1, hash: 'hash-1' },
    })

    await vi.waitFor(() => expect(subscription.snapshot()?.revision).toBe(1))
    const value = subscription.snapshot()
    expect(value?.selection).toEqual(['node-1'])
    expect(value?.hash).toBe('hash-1')
    expect(value?.lastActor).toBe('codex')
    expect(value?.lastTransactionId).toBe('tx-1')
    // Only the initial seed call — the update above came purely from the WS push, no extra REST hit.
    expect(fetchContext).toHaveBeenCalledTimes(1)
  })

  it('marks itself unhealthy when the connection drops, so callers fall back to REST', async () => {
    const mock = new MockEventsServer()
    const url = await mock.start()
    closers.push(() => mock.close())
    const fetchContext = vi.fn(async () => ({ documentId: 'doc-1', documentName: 'Fixture', revision: 0, hash: 'hash-0', selection: [], selectedNodes: [], sourceRoot: '.', sourceFiles: [] }))
    const subscription = new LiveContextSubscription({ bridgeUrl: url, token: 'test-token', fetchContext, reconnectBaseDelayMs: 1_000_000 })
    closers.push(() => subscription.stop())
    subscription.start()

    await vi.waitFor(() => expect(subscription.isHealthy()).toBe(true))
    mock.dropAll()
    await vi.waitFor(() => expect(subscription.isHealthy()).toBe(false))
  })

  it('resumes and refreshes the cache after reconnecting', async () => {
    const mock = new MockEventsServer()
    const url = await mock.start()
    closers.push(() => mock.close())
    let revision = 0
    const fetchContext = vi.fn(async () => ({
      documentId: 'doc-1', documentName: 'Fixture', revision, hash: `hash-${revision}`, selection: [], selectedNodes: [], sourceRoot: '.', sourceFiles: [],
    }))
    const subscription = new LiveContextSubscription({ bridgeUrl: url, token: 'test-token', fetchContext, reconnectBaseDelayMs: 20, reconnectMaxDelayMs: 40 })
    closers.push(() => subscription.stop())
    subscription.start()

    await vi.waitFor(() => expect(subscription.isHealthy()).toBe(true))
    await vi.waitFor(() => expect(fetchContext).toHaveBeenCalledTimes(1))

    revision = 2
    mock.dropAll()
    // The subscription must reconnect on its own (no manual start() call here) and re-seed from REST.
    await vi.waitFor(() => expect(fetchContext.mock.calls.length).toBeGreaterThanOrEqual(2), { timeout: 2000 })
    await vi.waitFor(() => expect(subscription.isHealthy()).toBe(true), { timeout: 2000 })
    await vi.waitFor(() => expect(subscription.snapshot()?.revision).toBe(2))
  })

  it('never overwrites a fresher live push with a stale REST seed', async () => {
    const mock = new MockEventsServer()
    const url = await mock.start()
    closers.push(() => mock.close())
    let resolveContext: (value: Record<string, unknown>) => void = () => undefined
    const fetchContext = vi.fn(() => new Promise<Record<string, unknown>>((resolve) => { resolveContext = resolve }))
    const subscription = new LiveContextSubscription({ bridgeUrl: url, token: 'test-token', fetchContext })
    closers.push(() => subscription.stop())
    subscription.start()

    await vi.waitFor(() => expect(subscription.isHealthy()).toBe(true))
    await vi.waitFor(() => expect(fetchContext).toHaveBeenCalledTimes(1))
    const socket = mock.connections[0]
    // A live push arrives before the (slow) initial REST seed resolves.
    mock.send(socket, {
      type: 'event',
      event: { cursor: 1, actor: 'claude', transactionId: 'tx-1', revision: 5 },
      snapshot: { document: fixtureDocument(5, ['node-5']), revision: 5, hash: 'hash-5' },
    })
    await vi.waitFor(() => expect(subscription.snapshot()?.revision).toBe(5))
    // The slow REST response for the earlier revision resolves after the push.
    resolveContext({ documentId: 'doc-1', documentName: 'Fixture', revision: 0, hash: 'hash-0', selection: [], selectedNodes: [], sourceRoot: '.', sourceFiles: [] })
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(subscription.snapshot()?.revision).toBe(5)
  })
})
