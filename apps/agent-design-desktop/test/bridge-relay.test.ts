import { describe, expect, it, vi } from 'vitest'
import { BridgeRelay } from '../src/bridge-relay'

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
      const body = url.endsWith('/snapshot') ? snapshot(0) : { snapshot: snapshot(1) }
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
    expect(requests[1]?.body).toContain('"actor":"human"')

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
})
