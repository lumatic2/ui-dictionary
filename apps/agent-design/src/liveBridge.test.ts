import { createDocumentFixture } from '@askewly/canvas-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LiveBridgeClient, liveBridgeConfig, type CollaborationFeed, type LiveSnapshot } from './liveBridge'

class FakeWebSocket {
  static instances: FakeWebSocket[] = []
  listeners = new Map<string, Array<(event: Event | MessageEvent) => void>>()
  constructor(public readonly url: string) { FakeWebSocket.instances.push(this) }
  addEventListener(type: string, listener: (event: Event | MessageEvent) => void) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener])
  }
  emit(type: string, event: Event | MessageEvent = new Event(type)) {
    for (const listener of this.listeners.get(type) ?? []) listener(event)
  }
  close() { this.emit('close') }
}

function snapshot(revision: number, cursor: number): LiveSnapshot {
  const document = createDocumentFixture(1000)
  document.revision = revision
  return { document, revision, cursor, hash: `hash-${revision}` }
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
}

afterEach(() => {
  vi.unstubAllGlobals()
  FakeWebSocket.instances = []
})

describe('live canvas bridge client', () => {
  it('reads explicit query configuration only', () => {
    expect(liveBridgeConfig({ search: '?bridge=http%3A%2F%2F127.0.0.1%3A4040&token=session' } as Location)).toEqual({ url: 'http://127.0.0.1:4040', token: 'session' })
    expect(liveBridgeConfig({ search: '' } as Location)).toBeNull()
  })

  it('loads a snapshot and refreshes committed WebSocket events', async () => {
    const snapshots = [snapshot(0, 0), snapshot(1, 1)]
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/audit')) return jsonResponse({ entries: [] })
      return jsonResponse(snapshots.shift())
    }))
    vi.stubGlobal('WebSocket', FakeWebSocket)
    const received: Array<{ revision: number; reason: string }> = []
    const statuses: string[] = []
    const client = new LiveBridgeClient({ url: 'http://127.0.0.1:4040', token: 'session' }, {
      onSnapshot: (value, meta) => received.push({ revision: value.revision, reason: meta.reason }),
      onStatus: (status) => statuses.push(status),
    })
    await client.connect()
    const socket = FakeWebSocket.instances[0]
    expect(socket?.url).toContain('/events?token=session&cursor=0')
    socket?.emit('open')
    socket?.emit('message', new MessageEvent('message', { data: JSON.stringify({ type: 'event', event: { cursor: 1 }, snapshot: snapshots.shift() }) }))
    await vi.waitFor(() => expect(received).toEqual([{ revision: 0, reason: 'initial' }, { revision: 1, reason: 'event' }]))
    expect(statuses).toEqual(['connecting', 'connected'])
    client.disconnect()
  })

  it('accepts a cursor-gap recovery snapshot without a second snapshot fetch', async () => {
    let snapshotCalls = 0
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/audit')) return jsonResponse({ entries: [] })
      snapshotCalls += 1
      return jsonResponse(snapshot(1, 1))
    }))
    vi.stubGlobal('WebSocket', FakeWebSocket)
    const received: number[] = []
    const client = new LiveBridgeClient({ url: 'http://127.0.0.1:4040', token: 'session' }, {
      onSnapshot: (value) => received.push(value.revision),
      onStatus: () => undefined,
    })
    await client.connect()
    FakeWebSocket.instances[0]?.emit('message', new MessageEvent('message', { data: JSON.stringify({ type: 'replay', payload: { mode: 'snapshot', snapshot: snapshot(3, 3), reason: 'cursor-gap' } }) }))
    expect(received).toEqual([1, 3])
    expect(snapshotCalls).toBe(1)
    client.disconnect()
  })
})

describe('live collaboration feed', () => {
  function auditEntry(overrides: Partial<{ transactionId: string; actor: string; kind: string; revision: number; committedAt: string; exactChanges: Array<{ path: string; before?: unknown; after?: unknown }> }>) {
    return {
      transactionId: 'human:1',
      actor: 'human',
      kind: 'operations',
      revision: 1,
      committedAt: '2026-07-12T00:01:00.000Z',
      exactChanges: [{ path: '/nodes/node-a/locked', before: false, after: true }],
      ...overrides,
    }
  }

  it('derives an actor-attributed feed ordered by revision with node ids and per-actor activity', async () => {
    const auditEntries = [
      auditEntry({ transactionId: 'claude:3', actor: 'claude', kind: 'source-patch', revision: 3, committedAt: '2026-07-12T00:03:00.000Z', exactChanges: [] }),
      auditEntry({ transactionId: 'human:1', actor: 'human', revision: 1, committedAt: '2026-07-12T00:01:00.000Z', exactChanges: [{ path: '/nodes/node-a/locked', before: false, after: true }, { path: '/revision', before: 0, after: 1 }] }),
      auditEntry({ transactionId: 'codex:2', actor: 'codex', revision: 2, committedAt: '2026-07-12T00:02:00.000Z', exactChanges: [{ path: '/nodes/node-b/name', before: 'A', after: 'B' }] }),
    ]
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/audit')) return jsonResponse({ entries: auditEntries })
      return jsonResponse(snapshot(0, 0))
    }))
    vi.stubGlobal('WebSocket', FakeWebSocket)
    const feeds: CollaborationFeed[] = []
    const client = new LiveBridgeClient({ url: 'http://127.0.0.1:4040', token: 'session' }, {
      onSnapshot: () => undefined,
      onStatus: () => undefined,
      onCollaborationFeed: (feed) => feeds.push(feed),
    })
    await client.connect()
    await vi.waitFor(() => expect(feeds).toHaveLength(1))
    expect(feeds[0]).toEqual({
      entries: [
        { transactionId: 'human:1', actor: 'human', kind: 'operations', revision: 1, at: '2026-07-12T00:01:00.000Z', changeCount: 2, nodeIds: ['node-a'] },
        { transactionId: 'codex:2', actor: 'codex', kind: 'operations', revision: 2, at: '2026-07-12T00:02:00.000Z', changeCount: 1, nodeIds: ['node-b'] },
        { transactionId: 'claude:3', actor: 'claude', kind: 'source-patch', revision: 3, at: '2026-07-12T00:03:00.000Z', changeCount: 0, nodeIds: [] },
      ],
      actors: [
        { actor: 'claude', lastRevision: 3, lastActiveAt: '2026-07-12T00:03:00.000Z' },
        { actor: 'codex', lastRevision: 2, lastActiveAt: '2026-07-12T00:02:00.000Z' },
        { actor: 'human', lastRevision: 1, lastActiveAt: '2026-07-12T00:01:00.000Z' },
      ],
      cursorRevision: 3,
    })
    expect(client.getCollaborationFeed()).toEqual(feeds[0])
    client.disconnect()
  })

  it('keeps the feed cursor continuous across reconnect without duplicate entries', async () => {
    let auditEntries = [auditEntry({})]
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/audit')) return jsonResponse({ entries: auditEntries })
      return jsonResponse(snapshot(0, 0))
    }))
    vi.stubGlobal('WebSocket', FakeWebSocket)
    const feeds: CollaborationFeed[] = []
    const client = new LiveBridgeClient({ url: 'http://127.0.0.1:4040', token: 'session' }, {
      onSnapshot: () => undefined,
      onStatus: () => undefined,
      onCollaborationFeed: (feed) => feeds.push(feed),
    })
    await client.connect()
    await vi.waitFor(() => expect(feeds).toHaveLength(1))

    // socket drops and a second transaction commits on the bridge before it reconnects; the audit log
    // (unlike the bounded WS replay buffer) retains full history, so the re-fetch after reconnect is loss-free
    auditEntries = [...auditEntries, auditEntry({ transactionId: 'codex:2', actor: 'codex', revision: 2, committedAt: '2026-07-12T00:02:00.000Z', exactChanges: [{ path: '/nodes/node-b/name', before: 'A', after: 'B' }] })]
    const socket = FakeWebSocket.instances[0]
    socket?.emit('close')
    await vi.waitFor(() => expect(FakeWebSocket.instances.length).toBeGreaterThanOrEqual(2))
    FakeWebSocket.instances.at(-1)?.emit('message', new MessageEvent('message', { data: JSON.stringify({ type: 'replay', payload: { mode: 'events', events: [{ cursor: 2 }] } }) }))

    await vi.waitFor(() => expect(feeds.length).toBeGreaterThanOrEqual(2))
    const latest = feeds.at(-1)!
    expect(latest.entries.map((entry) => entry.transactionId)).toEqual(['human:1', 'codex:2'])
    expect(latest.cursorRevision).toBe(2)
    expect(new Set(latest.entries.map((entry) => entry.transactionId)).size).toBe(latest.entries.length)
    client.disconnect()
  })

  it('stops pushing feed updates once disconnected', async () => {
    const auditEntries = [auditEntry({})]
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.endsWith('/audit')) return jsonResponse({ entries: auditEntries })
      return jsonResponse(snapshot(0, 0))
    })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('WebSocket', FakeWebSocket)
    const feeds: CollaborationFeed[] = []
    const client = new LiveBridgeClient({ url: 'http://127.0.0.1:4040', token: 'session' }, {
      onSnapshot: () => undefined,
      onStatus: () => undefined,
      onCollaborationFeed: (feed) => feeds.push(feed),
    })
    await client.connect()
    await vi.waitFor(() => expect(feeds).toHaveLength(1))
    client.disconnect()
    const callsAtDisconnect = fetchMock.mock.calls.length
    FakeWebSocket.instances[0]?.emit('message', new MessageEvent('message', { data: JSON.stringify({ type: 'event', event: { cursor: 2 }, snapshot: snapshot(1, 1) }) }))
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(feeds).toHaveLength(1)
    expect(fetchMock.mock.calls.length).toBe(callsAtDisconnect)
  })
})
