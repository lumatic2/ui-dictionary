import { describe, expect, it, vi } from 'vitest'
import { NEW_FILE_HASH } from '@askewly/agent-design-bridge'
import { BridgeRelay } from '../src/bridge-relay'
import type { CollaborationFeed } from '../src/contract'

class FakeSocket extends EventTarget {
  close = vi.fn(() => this.dispatchEvent(new Event('close')))

  message(value: unknown) {
    this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(value) }))
  }
}

function snapshot(revision: number, cursor = revision) {
  return {
    document: {
      schemaVersion: 1,
      id: 'fixture',
      name: 'Fixture',
      revision,
      rootIds: [],
      nodes: {},
      selection: [],
      viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
      tokenSetId: 'askewly.default',
      metadata: { createdAt: '2026-07-11T01:00:00.000Z', updatedAt: '2026-07-11T01:00:00.000Z', sourceRoot: '.' },
    },
    revision,
    cursor,
    hash: String(revision).padStart(64, 'a'),
  }
}

describe('main-only bridge relay', () => {
  it('authenticates in main and relays initial, human, and terminal snapshots without returning credentials', async () => {
    const socket = new FakeSocket()
    const requests: Array<{ url: string; authorization: string | null; body?: string }> = []
    const fetchImpl = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      const headers = new Headers(init?.headers)
      requests.push({ url, authorization: headers.get('authorization'), ...(typeof init?.body === 'string' ? { body: init.body } : {}) })
      const body = url.endsWith('/snapshot') ? snapshot(0) : url.endsWith('/audit') ? { entries: [] } : { snapshot: snapshot(1) }
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as typeof fetch
    let socketUrl = ''
    const relay = new BridgeRelay({
      fetchImpl,
      socketFactory: (url) => { socketUrl = url; return socket },
      reconnectDelayMs: 60_000,
    })
    const observed: number[] = []
    relay.subscribe((value) => observed.push(value.revision))

    const token = 't'.repeat(32)
    await relay.connect({ bridgeUrl: 'http://127.0.0.1:4311', token })
    expect(relay.currentSnapshot()).toMatchObject({ revision: 0, cursor: 0 })
    expect(JSON.stringify(relay.currentSnapshot())).not.toContain(token)
    expect(socketUrl).toContain('ws://127.0.0.1:4311/events?token=')

    await relay.applyOperation({ id: 'human-select', at: '2026-07-11T01:00:01.000Z', type: 'select-nodes', nodeIds: [] })
    expect(relay.currentSnapshot().revision).toBe(1)
    expect(requests.every((request) => request.authorization === `Bearer ${token}`)).toBe(true)
    expect(requests.find((request) => request.url.endsWith('/transactions'))?.body).toContain('"actor":"human"')

    socket.message({ type: 'event', snapshot: snapshot(2) })
    expect(relay.currentSnapshot().revision).toBe(2)
    expect(observed).toEqual([0, 1, 2])
    relay.disconnect()
  })

  it('rejects non-loopback credentials and unsupported renderer operations', async () => {
    const relay = new BridgeRelay({ fetchImpl: vi.fn() as typeof fetch })
    await expect(relay.connect({ bridgeUrl: 'https://example.com', token: 't'.repeat(32) })).rejects.toThrow('invalid bridge relay credentials')
    await expect(relay.applyOperation({ id: 'shell', at: '2026-07-11T01:00:01.000Z', type: 'run-command', command: 'calc' })).rejects.toThrow('unsupported canvas operation')
  })

  it('relays an atomic batch operation (e.g. insert-palette node creation) and rejects a batch with a forbidden child', async () => {
    const socket = new FakeSocket()
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      const body = url.endsWith('/snapshot') ? snapshot(0) : url.endsWith('/audit') ? { entries: [] } : { snapshot: snapshot(1) }
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as typeof fetch
    const relay = new BridgeRelay({ fetchImpl, socketFactory: () => socket, reconnectDelayMs: 60_000 })
    await relay.connect({ bridgeUrl: 'http://127.0.0.1:4311', token: 't'.repeat(32) })

    await relay.applyOperation({
      id: 'batch-insert',
      at: '2026-07-11T01:00:01.000Z',
      type: 'batch',
      operations: [
        { id: 'create-1', at: '2026-07-11T01:00:01.000Z', type: 'create-node', node: { id: 'n1' }, parentId: null, index: 0 },
        { id: 'select-1', at: '2026-07-11T01:00:01.000Z', type: 'select-nodes', nodeIds: ['n1'] },
      ],
    })
    expect(relay.currentSnapshot().revision).toBe(1)

    await expect(
      relay.applyOperation({
        id: 'batch-bad',
        at: '2026-07-11T01:00:02.000Z',
        type: 'batch',
        operations: [{ id: 'shell', at: '2026-07-11T01:00:02.000Z', type: 'run-command', command: 'calc' }],
      }),
    ).rejects.toThrow('unsupported canvas operation')
    relay.disconnect()
  })

  it('derives an actor-attributed collaboration feed from /audit, ordered by revision', async () => {
    const socket = new FakeSocket()
    const auditEntries: unknown[] = [
      { transactionId: 'human:1', actor: 'human', kind: 'operations', revision: 1, committedAt: '2026-07-12T00:01:00.000Z', exactChanges: [{ path: '/nodes/node-a/locked', before: false, after: true }] },
    ]
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      const body = url.endsWith('/snapshot') ? snapshot(0) : url.endsWith('/audit') ? { entries: auditEntries } : { snapshot: snapshot(1) }
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as typeof fetch
    const relay = new BridgeRelay({ fetchImpl, socketFactory: () => socket, reconnectDelayMs: 60_000 })
    const feeds: CollaborationFeed[] = []
    const unsubscribe = relay.subscribeFeed((feed) => feeds.push(feed))

    expect(() => relay.currentFeed()).toThrow('collaboration feed is not ready')
    await relay.connect({ bridgeUrl: 'http://127.0.0.1:4311', token: 't'.repeat(32) })
    await vi.waitFor(() => expect(feeds).toHaveLength(1))
    expect(feeds[0]).toEqual({
      entries: [{ transactionId: 'human:1', actor: 'human', kind: 'operations', revision: 1, at: '2026-07-12T00:01:00.000Z', changeCount: 1, nodeIds: ['node-a'] }],
      actors: [{ actor: 'human', lastRevision: 1, lastActiveAt: '2026-07-12T00:01:00.000Z' }],
      cursorRevision: 1,
    })
    expect(relay.currentFeed()).toEqual(feeds[0])

    unsubscribe()
    auditEntries.push({ transactionId: 'codex:2', actor: 'codex', kind: 'operations', revision: 2, committedAt: '2026-07-12T00:02:00.000Z', exactChanges: [{ path: '/nodes/node-b/name', before: 'A', after: 'B' }] })
    socket.message({ type: 'event', snapshot: snapshot(1) })
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(feeds).toHaveLength(1)
    relay.disconnect()
  })

  it('keeps the collaboration feed cursor continuous after a reconnect without duplicating entries', async () => {
    const socket = new FakeSocket()
    const auditEntries: unknown[] = [
      { transactionId: 'human:1', actor: 'human', kind: 'operations', revision: 1, committedAt: '2026-07-12T00:01:00.000Z', exactChanges: [{ path: '/nodes/node-a/locked', before: false, after: true }] },
    ]
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      const body = url.endsWith('/snapshot') ? snapshot(0) : url.endsWith('/audit') ? { entries: auditEntries } : { snapshot: snapshot(1) }
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as typeof fetch
    const relay = new BridgeRelay({ fetchImpl, socketFactory: () => socket, reconnectDelayMs: 5 })
    const feeds: CollaborationFeed[] = []
    relay.subscribeFeed((feed) => feeds.push(feed))

    await relay.connect({ bridgeUrl: 'http://127.0.0.1:4311', token: 't'.repeat(32) })
    await vi.waitFor(() => expect(feeds).toHaveLength(1))

    // a second transaction lands on the bridge while the socket is dropped; the audit log (unlike the
    // bounded WS replay buffer) retains full history, so re-fetching it after reconnect is loss-free
    auditEntries.push({ transactionId: 'codex:2', actor: 'codex', kind: 'operations', revision: 2, committedAt: '2026-07-12T00:02:00.000Z', exactChanges: [{ path: '/nodes/node-b/name', before: 'A', after: 'B' }] })
    socket.dispatchEvent(new Event('close'))
    socket.message({ type: 'replay', payload: { mode: 'snapshot', snapshot: snapshot(1), reason: 'cursor-gap' } })
    await vi.waitFor(() => expect(feeds.length).toBeGreaterThanOrEqual(2))

    const latest = feeds.at(-1)!
    expect(latest.entries.map((entry) => entry.transactionId)).toEqual(['human:1', 'codex:2'])
    expect(latest.cursorRevision).toBe(2)
    expect(new Set(latest.entries.map((entry) => entry.transactionId)).size).toBe(latest.entries.length)
    relay.disconnect()
  })

  it('materializes a registry node by posting a NEW_FILE_HASH source patch to /source-patches', async () => {
    const socket = new FakeSocket()
    const requests: Array<{ url: string; body?: string }> = []
    const fetchImpl = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      requests.push({ url, ...(typeof init?.body === 'string' ? { body: init.body } : {}) })
      const body = url.endsWith('/snapshot') ? snapshot(0) : url.endsWith('/audit') ? { entries: [] } : { snapshot: snapshot(1) }
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as typeof fetch
    const relay = new BridgeRelay({ fetchImpl, socketFactory: () => socket, reconnectDelayMs: 60_000 })
    await relay.connect({ bridgeUrl: 'http://127.0.0.1:4311', token: 't'.repeat(32) })

    const result = await relay.materializeSource('src/components/Button.tsx', 'export function Button() { return null }\n')
    expect(result.revision).toBe(1)

    const request = requests.find((entry) => entry.url.endsWith('/source-patches'))
    if (!request?.body) throw new Error('source patch request missing')
    const payload = JSON.parse(request.body)
    expect(payload).toMatchObject({
      actor: 'human',
      baseRevision: 0,
      file: 'src/components/Button.tsx',
      beforeFileHash: NEW_FILE_HASH,
      content: 'export function Button() { return null }\n',
    })
    relay.disconnect()
  })
})
