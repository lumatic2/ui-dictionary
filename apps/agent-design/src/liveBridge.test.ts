import { createDocumentFixture } from '@askewly/canvas-core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LiveBridgeClient, liveBridgeConfig, type LiveSnapshot } from './liveBridge'

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
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(snapshots.shift()), { status: 200, headers: { 'content-type': 'application/json' } })))
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

  it('accepts a cursor-gap recovery snapshot without a second fetch', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(snapshot(1, 1)), { status: 200, headers: { 'content-type': 'application/json' } })))
    vi.stubGlobal('WebSocket', FakeWebSocket)
    const received: number[] = []
    const client = new LiveBridgeClient({ url: 'http://127.0.0.1:4040', token: 'session' }, {
      onSnapshot: (value) => received.push(value.revision),
      onStatus: () => undefined,
    })
    await client.connect()
    FakeWebSocket.instances[0]?.emit('message', new MessageEvent('message', { data: JSON.stringify({ type: 'replay', payload: { mode: 'snapshot', snapshot: snapshot(3, 3), reason: 'cursor-gap' } }) }))
    expect(received).toEqual([1, 3])
    expect(fetch).toHaveBeenCalledTimes(1)
    client.disconnect()
  })
})
