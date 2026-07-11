export interface LiveContextValue {
  documentId: string
  documentName: string
  revision: number
  hash: string
  selection: string[]
  selectedNodes: unknown[]
  sourceRoot: string
  sourceFiles: Array<{ file: string; hash: string | null }>
  lastActor?: string
  lastTransactionId?: string
  lastEventCursor?: number
}

export interface WebSocketLike {
  readonly readyState: number
  close(): void
  addEventListener(type: 'open' | 'close' | 'error', listener: () => void): void
  addEventListener(type: 'message', listener: (event: { data: unknown }) => void): void
}

export type WebSocketConstructorLike = new (url: string) => WebSocketLike

export interface LiveContextSubscriptionOptions {
  bridgeUrl: string
  token: string
  /** Reuses the same REST path the MCP server already falls back to; called after every (re)connect to seed the cache. */
  fetchContext: () => Promise<Record<string, unknown>>
  reconnectBaseDelayMs?: number
  reconnectMaxDelayMs?: number
  webSocketConstructor?: WebSocketConstructorLike
}

function resolveWebSocketConstructor(override?: WebSocketConstructorLike): WebSocketConstructorLike {
  const ctor = override ?? (globalThis as unknown as { WebSocket?: WebSocketConstructorLike }).WebSocket
  if (!ctor) throw new Error('global WebSocket is not available in this runtime')
  return ctor
}

function eventsUrl(bridgeUrl: string, token: string): string {
  const url = new URL(bridgeUrl)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = '/events'
  url.search = ''
  url.searchParams.set('token', token)
  return url.toString()
}

/**
 * Maintains a cached live view of the bridge's canvas context by subscribing to /events.
 * Falls back silently on any failure — callers should treat `snapshot()` as advisory and
 * only trust it while `isHealthy()` is true.
 */
export class LiveContextSubscription {
  private readonly webSocketConstructor: WebSocketConstructorLike
  private socket: WebSocketLike | null = null
  private cache: LiveContextValue | null = null
  private healthy = false
  private closed = false
  private reconnectAttempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly options: LiveContextSubscriptionOptions) {
    this.webSocketConstructor = resolveWebSocketConstructor(options.webSocketConstructor)
  }

  start(): void {
    if (this.closed) return
    this.connect()
  }

  stop(): void {
    this.closed = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.socket?.close()
    this.socket = null
    this.healthy = false
  }

  isHealthy(): boolean {
    return this.healthy
  }

  snapshot(): LiveContextValue | null {
    return this.cache
  }

  private connect(): void {
    let socket: WebSocketLike
    try {
      socket = new this.webSocketConstructor(eventsUrl(this.options.bridgeUrl, this.options.token))
    } catch {
      this.scheduleReconnect()
      return
    }
    this.socket = socket
    socket.addEventListener('open', () => {
      this.healthy = true
      this.reconnectAttempt = 0
      this.options.fetchContext().then((context) => this.seedFromContext(context)).catch(() => undefined)
    })
    socket.addEventListener('message', (event) => this.handleMessage(event.data))
    socket.addEventListener('close', () => this.handleDisconnect())
    socket.addEventListener('error', () => this.handleDisconnect())
  }

  private handleDisconnect(): void {
    this.socket = null
    this.healthy = false
    this.scheduleReconnect()
  }

  private scheduleReconnect(): void {
    if (this.closed || this.reconnectTimer) return
    const base = this.options.reconnectBaseDelayMs ?? 250
    const max = this.options.reconnectMaxDelayMs ?? 5_000
    const delay = Math.min(max, base * 2 ** this.reconnectAttempt)
    this.reconnectAttempt += 1
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  private seedFromContext(context: Record<string, unknown>): void {
    const incomingRevision = Number(context.revision ?? 0)
    if (this.cache && incomingRevision < this.cache.revision) return
    this.cache = {
      documentId: String(context.documentId ?? ''),
      documentName: String(context.documentName ?? ''),
      revision: incomingRevision,
      hash: String(context.hash ?? ''),
      selection: Array.isArray(context.selection) ? [...(context.selection as string[])] : [],
      selectedNodes: Array.isArray(context.selectedNodes) ? [...(context.selectedNodes as unknown[])] : [],
      sourceRoot: String(context.sourceRoot ?? ''),
      sourceFiles: Array.isArray(context.sourceFiles)
        ? [...(context.sourceFiles as Array<{ file: string; hash: string | null }>)]
        : (this.cache?.sourceFiles ?? []),
      lastActor: this.cache?.lastActor,
      lastTransactionId: this.cache?.lastTransactionId,
      lastEventCursor: this.cache?.lastEventCursor,
    }
  }

  private applyDocumentSnapshot(document: Record<string, unknown>, revision: number, hash: string): void {
    const selection = Array.isArray(document.selection) ? (document.selection as string[]) : []
    const nodes = (document.nodes ?? {}) as Record<string, unknown>
    const metadata = (document.metadata ?? {}) as Record<string, unknown>
    this.cache = {
      documentId: String(document.id ?? this.cache?.documentId ?? ''),
      documentName: String(document.name ?? this.cache?.documentName ?? ''),
      revision,
      hash,
      selection,
      selectedNodes: selection.map((id) => nodes[id]).filter((node) => node !== undefined),
      sourceRoot: String(metadata.sourceRoot ?? this.cache?.sourceRoot ?? ''),
      sourceFiles: this.cache?.sourceFiles ?? [],
      lastActor: this.cache?.lastActor,
      lastTransactionId: this.cache?.lastTransactionId,
      lastEventCursor: this.cache?.lastEventCursor,
    }
  }

  private handleMessage(raw: unknown): void {
    let payload: { type?: string; payload?: unknown; event?: Record<string, unknown>; snapshot?: Record<string, unknown> }
    try {
      payload = JSON.parse(String(raw)) as typeof payload
    } catch {
      return
    }
    if (payload.type === 'replay') {
      const replay = payload.payload as
        | { mode?: string; snapshot?: { document: Record<string, unknown>; revision: number; hash: string } }
        | undefined
      if (replay?.mode === 'snapshot' && replay.snapshot) {
        this.applyDocumentSnapshot(replay.snapshot.document, replay.snapshot.revision, replay.snapshot.hash)
      }
      return
    }
    if (payload.type === 'event' && payload.snapshot) {
      const snapshot = payload.snapshot as { document: Record<string, unknown>; revision: number; hash: string }
      this.applyDocumentSnapshot(snapshot.document, snapshot.revision, snapshot.hash)
      const event = payload.event
      if (event && this.cache) {
        this.cache = {
          ...this.cache,
          lastActor: typeof event.actor === 'string' ? event.actor : this.cache.lastActor,
          lastTransactionId: typeof event.transactionId === 'string' ? event.transactionId : this.cache.lastTransactionId,
          lastEventCursor: typeof event.cursor === 'number' ? event.cursor : this.cache.lastEventCursor,
        }
      }
    }
  }
}
