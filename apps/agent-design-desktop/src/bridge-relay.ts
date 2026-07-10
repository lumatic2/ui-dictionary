import { EventEmitter } from 'node:events'
import type { CanvasOperation } from '@askewly/canvas-core' with { 'resolution-mode': 'import' }
import { parseCanvasSnapshot, parseCanvasMutationRequest, type CanvasSnapshot, type CanvasSnapshotReason } from './contract'

export interface BridgeRelayCredentials {
  bridgeUrl: string
  token: string
}

interface RelaySocket {
  addEventListener(type: 'open' | 'message' | 'close' | 'error', listener: (event: Event) => void): void
  close(): void
}

interface BridgeRelayOptions {
  fetchImpl?: typeof fetch
  socketFactory?: (url: string) => RelaySocket
  reconnectDelayMs?: number
}

export class BridgeRelay {
  private readonly emitter = new EventEmitter()
  private readonly fetchImpl: typeof fetch
  private readonly socketFactory: (url: string) => RelaySocket
  private readonly reconnectDelayMs: number
  private credentials: BridgeRelayCredentials | null = null
  private snapshot: CanvasSnapshot | null = null
  private socket: RelaySocket | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private generation = 0

  constructor(options: BridgeRelayOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? fetch
    this.socketFactory = options.socketFactory ?? ((url) => new WebSocket(url))
    this.reconnectDelayMs = options.reconnectDelayMs ?? 100
  }

  subscribe(listener: (snapshot: CanvasSnapshot, reason: CanvasSnapshotReason) => void): () => void {
    this.emitter.on('snapshot', listener)
    return () => this.emitter.off('snapshot', listener)
  }

  async connect(credentials: BridgeRelayCredentials): Promise<void> {
    if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(credentials.bridgeUrl) || credentials.token.length < 32) {
      throw new Error('invalid bridge relay credentials')
    }
    this.disconnect()
    const generation = ++this.generation
    this.credentials = { ...credentials }
    await this.refresh('initial', generation)
    if (generation === this.generation) this.openSocket(generation)
  }

  disconnect(): void {
    this.generation += 1
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    this.socket?.close()
    this.socket = null
    this.credentials = null
    this.snapshot = null
  }

  currentSnapshot(): CanvasSnapshot {
    if (!this.snapshot) throw new Error('canvas relay is not ready')
    return structuredClone(this.snapshot)
  }

  async applyOperation(rawOperation: unknown): Promise<CanvasSnapshot> {
    const operation = parseCanvasMutationRequest({ apiVersion: 1, operation: rawOperation }).operation as CanvasOperation
    const snapshot = this.currentSnapshot()
    const body = await this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        id: `human:${operation.id}`,
        actor: 'human',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        operations: [operation],
      }),
    })
    return this.accept((body as { snapshot?: unknown }).snapshot, 'transaction')
  }

  async undo(): Promise<CanvasSnapshot> {
    const snapshot = this.currentSnapshot()
    const body = await this.request('/undo', {
      method: 'POST',
      body: JSON.stringify({
        id: `human:undo:${Date.now()}`,
        actor: 'human',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        at: new Date().toISOString(),
      }),
    })
    return this.accept((body as { snapshot?: unknown }).snapshot, 'transaction')
  }

  private headers(): HeadersInit {
    if (!this.credentials) throw new Error('canvas relay is not connected')
    return { authorization: `Bearer ${this.credentials.token}`, 'content-type': 'application/json' }
  }

  private async request(path: string, init?: RequestInit): Promise<unknown> {
    if (!this.credentials) throw new Error('canvas relay is not connected')
    const response = await this.fetchImpl(`${this.credentials.bridgeUrl}${path}`, { ...init, headers: { ...this.headers(), ...init?.headers } })
    const body = await response.json() as unknown
    if (!response.ok) {
      const message = typeof body === 'object' && body !== null && 'error' in body
        ? (body as { error?: { message?: unknown } }).error?.message
        : undefined
      throw new Error(typeof message === 'string' ? message : `bridge returned ${response.status}`)
    }
    return body
  }

  private accept(rawSnapshot: unknown, reason: CanvasSnapshotReason): CanvasSnapshot {
    const snapshot = parseCanvasSnapshot(rawSnapshot)
    if (this.snapshot && snapshot.revision < this.snapshot.revision) return this.currentSnapshot()
    this.snapshot = structuredClone(snapshot)
    this.emitter.emit('snapshot', this.currentSnapshot(), reason)
    return this.currentSnapshot()
  }

  private async refresh(reason: CanvasSnapshotReason, generation: number): Promise<void> {
    const snapshot = await this.request('/snapshot')
    if (generation === this.generation) this.accept(snapshot, reason)
  }

  private openSocket(generation: number): void {
    const credentials = this.credentials
    if (!credentials || generation !== this.generation) return
    const cursor = this.snapshot?.cursor ?? 0
    const url = `${credentials.bridgeUrl.replace(/^http/, 'ws')}/events?token=${encodeURIComponent(credentials.token)}&cursor=${cursor}`
    const socket = this.socketFactory(url)
    this.socket = socket
    socket.addEventListener('message', (event) => {
      if (generation !== this.generation) return
      try {
        const value = JSON.parse(String((event as MessageEvent).data)) as { type?: string; snapshot?: unknown; payload?: { mode?: string; snapshot?: unknown; events?: unknown[] } }
        if (value.type === 'event' && value.snapshot) this.accept(value.snapshot, 'event')
        else if (value.type === 'replay' && value.payload?.mode === 'snapshot' && value.payload.snapshot) this.accept(value.payload.snapshot, 'recovery')
        else if (value.type === 'event' || (value.type === 'replay' && (value.payload?.events?.length ?? 0) > 0)) {
          void this.refresh(value.type === 'event' ? 'event' : 'recovery', generation)
        }
      } catch {
        socket.close()
      }
    })
    socket.addEventListener('close', () => {
      if (generation !== this.generation) return
      this.reconnectTimer = setTimeout(() => this.openSocket(generation), this.reconnectDelayMs)
    })
    socket.addEventListener('error', () => socket.close())
  }
}
