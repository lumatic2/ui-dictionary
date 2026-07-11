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
  onCollaborationFeed?: (feed: CollaborationFeed) => void
}

export type FeedActor = 'codex' | 'claude' | 'human' | 'watcher'
export type FeedEntryKind = 'operations' | 'source-patch' | 'undo'

export interface CollaborationFeedEntry {
  transactionId: string
  actor: FeedActor
  kind: FeedEntryKind
  revision: number
  at: string
  changeCount: number
  nodeIds: string[]
}

export interface ActorActivity {
  actor: FeedActor
  lastRevision: number
  lastActiveAt: string
}

export interface CollaborationFeed {
  entries: CollaborationFeedEntry[]
  actors: ActorActivity[]
  cursorRevision: number
}

interface RawAuditEntry {
  transactionId: string
  actor: FeedActor
  kind: FeedEntryKind
  revision: number
  committedAt: string
  exactChanges: Array<{ path: string }>
}

const FEED_ACTORS = new Set<FeedActor>(['codex', 'claude', 'human', 'watcher'])
const FEED_KINDS = new Set<FeedEntryKind>(['operations', 'source-patch', 'undo'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseRawAuditEntry(value: unknown): RawAuditEntry | null {
  if (!isRecord(value)) return null
  if (typeof value.transactionId !== 'string' || typeof value.committedAt !== 'string' || !Number.isFinite(value.revision)) return null
  if (typeof value.actor !== 'string' || !FEED_ACTORS.has(value.actor as FeedActor)) return null
  if (typeof value.kind !== 'string' || !FEED_KINDS.has(value.kind as FeedEntryKind)) return null
  const rawChanges = Array.isArray(value.exactChanges) ? value.exactChanges : []
  const exactChanges = rawChanges.filter((change): change is { path: string } => isRecord(change) && typeof change.path === 'string')
  return {
    transactionId: value.transactionId,
    actor: value.actor as FeedActor,
    kind: value.kind as FeedEntryKind,
    revision: value.revision as number,
    committedAt: value.committedAt,
    exactChanges,
  }
}

function unescapePointerSegment(segment: string): string {
  return segment.replaceAll('~1', '/').replaceAll('~0', '~')
}

function nodeIdsFromChanges(changes: Array<{ path: string }>): string[] {
  const ids = new Set<string>()
  for (const change of changes) {
    const match = /^\/nodes\/([^/]+)/.exec(change.path)
    if (match) ids.add(unescapePointerSegment(match[1]))
  }
  return [...ids].sort()
}

/** Derives an actor-attributed transaction feed from the bridge's existing `/audit` history — no new storage. */
export function buildCollaborationFeed(rawEntries: unknown[]): CollaborationFeed {
  const entries = rawEntries
    .map(parseRawAuditEntry)
    .filter((entry): entry is RawAuditEntry => entry !== null)
    .sort((a, b) => a.revision - b.revision)
    .map((entry) => ({
      transactionId: entry.transactionId,
      actor: entry.actor,
      kind: entry.kind,
      revision: entry.revision,
      at: entry.committedAt,
      changeCount: entry.exactChanges.length,
      nodeIds: nodeIdsFromChanges(entry.exactChanges),
    }))
  const actors = new Map<FeedActor, ActorActivity>()
  for (const entry of entries) {
    const existing = actors.get(entry.actor)
    if (!existing || entry.revision >= existing.lastRevision) {
      actors.set(entry.actor, { actor: entry.actor, lastRevision: entry.revision, lastActiveAt: entry.at })
    }
  }
  return {
    entries,
    actors: [...actors.values()].sort((a, b) => a.actor.localeCompare(b.actor)),
    cursorRevision: entries.at(-1)?.revision ?? 0,
  }
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
  private feed: CollaborationFeed = { entries: [], actors: [], cursorRevision: 0 }
  private feedQueue = Promise.resolve()

  constructor(private readonly config: LiveBridgeConfig, private readonly callbacks: LiveBridgeCallbacks) {}

  /** Cached copy of the last collaboration feed pushed to `onCollaborationFeed`. */
  getCollaborationFeed(): CollaborationFeed {
    return structuredClone(this.feed)
  }

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
    void this.syncFeed().catch((error) => this.callbacks.onError?.(error))
  }

  /** Re-fetches the bridge's full `/audit` history (never trimmed, unlike the WS replay ring buffer) so the
   *  collaboration feed survives reconnect without duplicate or missed entries. */
  private syncFeed(): Promise<void> {
    this.feedQueue = this.feedQueue.then(async () => {
      if (this.stopped) return
      const body = await this.request('/audit')
      if (this.stopped) return
      const rawEntries = Array.isArray(body.entries) ? body.entries : []
      this.feed = buildCollaborationFeed(rawEntries)
      this.callbacks.onCollaborationFeed?.(structuredClone(this.feed))
    })
    return this.feedQueue
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
