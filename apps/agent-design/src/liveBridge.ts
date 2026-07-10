import type { CanvasDocument, CanvasOperation } from '@askewly/canvas-core'

export interface LiveSnapshot {
  document: CanvasDocument
  revision: number
  hash: string
  cursor: number
}

export interface LiveBridgeConfig {
  url: string
  token: string
}

export interface LiveBridgeCallbacks {
  onSnapshot: (snapshot: LiveSnapshot, meta: { reason: 'initial' | 'event' | 'transaction' | 'recovery'; receivedAt: number }) => void
  onStatus: (status: 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error') => void
  onError?: (error: unknown) => void
}

export function liveBridgeConfig(location: Pick<Location, 'search'> = window.location): LiveBridgeConfig | null {
  const query = new URLSearchParams(location.search)
  const url = query.get('bridge')
  const token = query.get('token')
  return url && token ? { url: url.replace(/\/$/, ''), token } : null
}

export class LiveBridgeClient {
  private snapshot: LiveSnapshot | null = null
  private socket: WebSocket | null = null
  private stopped = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private refreshQueue = Promise.resolve()

  constructor(private readonly config: LiveBridgeConfig, private readonly callbacks: LiveBridgeCallbacks) {}

  async connect(): Promise<void> {
    this.stopped = false
    this.callbacks.onStatus('connecting')
    try {
      await this.refresh('initial', performance.now())
      this.openSocket()
    } catch (error) {
      this.callbacks.onStatus('error')
      this.callbacks.onError?.(error)
      throw error
    }
  }

  private headers(): HeadersInit {
    return { authorization: `Bearer ${this.config.token}`, 'content-type': 'application/json' }
  }

  private async request(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
    const response = await fetch(`${this.config.url}${path}`, { ...init, headers: { ...this.headers(), ...init?.headers } })
    const body = (await response.json()) as Record<string, unknown>
    if (!response.ok) throw new Error((body.error as { message?: string } | undefined)?.message ?? `bridge returned ${response.status}`)
    return body
  }

  private accept(snapshot: LiveSnapshot, reason: Parameters<LiveBridgeCallbacks['onSnapshot']>[1]['reason'], receivedAt: number): void {
    if (this.snapshot && snapshot.revision < this.snapshot.revision) return
    this.snapshot = structuredClone(snapshot)
    this.callbacks.onSnapshot(structuredClone(snapshot), { reason, receivedAt })
  }

  private refresh(reason: 'initial' | 'event' | 'recovery', receivedAt: number): Promise<void> {
    this.refreshQueue = this.refreshQueue.then(async () => {
      const snapshot = await this.request('/snapshot') as unknown as LiveSnapshot
      this.accept(snapshot, reason, receivedAt)
    })
    return this.refreshQueue
  }

  private openSocket(): void {
    if (this.stopped) return
    const wsUrl = this.config.url.replace(/^http/, 'ws')
    const socket = new WebSocket(`${wsUrl}/events?token=${encodeURIComponent(this.config.token)}&cursor=${this.snapshot?.cursor ?? 0}`)
    this.socket = socket
    socket.addEventListener('open', () => this.callbacks.onStatus('connected'))
    socket.addEventListener('message', (message) => {
      const receivedAt = performance.now()
      const value = JSON.parse(String(message.data)) as { type: string; payload?: { mode: string; snapshot?: LiveSnapshot; events?: unknown[] }; event?: unknown; snapshot?: LiveSnapshot }
      if (value.type === 'replay' && value.payload?.mode === 'snapshot' && value.payload.snapshot) {
        this.accept(value.payload.snapshot, 'recovery', receivedAt)
      } else if (value.type === 'event' && value.snapshot) {
        this.accept(value.snapshot, 'event', receivedAt)
      } else if (value.type === 'event' || (value.type === 'replay' && (value.payload?.events?.length ?? 0) > 0)) {
        void this.refresh(value.type === 'event' ? 'event' : 'recovery', receivedAt).catch((error) => this.callbacks.onError?.(error))
      }
    })
    socket.addEventListener('close', () => {
      if (this.stopped) return
      this.callbacks.onStatus('reconnecting')
      this.reconnectTimer = setTimeout(() => this.openSocket(), 100)
    })
    socket.addEventListener('error', (error) => this.callbacks.onError?.(error))
  }

  async applyOperation(operation: CanvasOperation): Promise<void> {
    if (!this.snapshot) throw new Error('bridge snapshot is not ready')
    const started = performance.now()
    const body = await this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        id: `human:${operation.id}`,
        actor: 'human',
        baseRevision: this.snapshot.revision,
        beforeHash: this.snapshot.hash,
        operations: [operation],
      }),
    })
    this.accept(body.snapshot as unknown as LiveSnapshot, 'transaction', started)
  }

  async undo(): Promise<void> {
    if (!this.snapshot) throw new Error('bridge snapshot is not ready')
    const started = performance.now()
    const body = await this.request('/undo', {
      method: 'POST',
      body: JSON.stringify({ id: `human:undo:${Date.now()}`, actor: 'human', baseRevision: this.snapshot.revision, beforeHash: this.snapshot.hash, at: new Date().toISOString() }),
    })
    this.accept(body.snapshot as unknown as LiveSnapshot, 'transaction', started)
  }

  disconnect(): void {
    this.stopped = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.reconnectTimer = null
    this.socket?.close()
    this.socket = null
    this.callbacks.onStatus('disconnected')
  }
}
