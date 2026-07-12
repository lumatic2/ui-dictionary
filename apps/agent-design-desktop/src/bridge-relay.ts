import { EventEmitter } from 'node:events'
import type { CanvasOperation } from '@askewly/canvas-core' with { 'resolution-mode': 'import' }
import {
  parseCanvasSnapshot,
  parseCanvasMutationRequest,
  parseCollaborationFeed,
  type CanvasSnapshot,
  type CanvasSnapshotReason,
  type CollaborationFeed,
  type FeedActor,
  type FeedEntryKind,
} from './contract'

export interface BridgeRelayCredentials {
  bridgeUrl: string
  token: string
}

/** Sentinel `beforeFileHash` meaning "this file does not exist yet" — must match
 *  `NEW_FILE_HASH` in `apps/agent-design-bridge/src/session.ts` (kept as a local literal,
 *  same as this file's other bridge-shaped constants, since the bridge package builds as
 *  ESM and this desktop package builds as CommonJS). */
const NEW_FILE_HASH = 'new-file:absent'

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
    if (match?.[1]) ids.add(unescapePointerSegment(match[1]))
  }
  return [...ids].sort()
}

/** Derives an actor-attributed transaction feed from the bridge's existing `/audit` history — no new storage. */
function buildCollaborationFeed(rawEntries: unknown[]): CollaborationFeed {
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
  const actors = new Map<FeedActor, { actor: FeedActor; lastRevision: number; lastActiveAt: string }>()
  for (const entry of entries) {
    const existing = actors.get(entry.actor)
    if (!existing || entry.revision >= existing.lastRevision) {
      actors.set(entry.actor, { actor: entry.actor, lastRevision: entry.revision, lastActiveAt: entry.at })
    }
  }
  return parseCollaborationFeed({
    entries,
    actors: [...actors.values()].sort((a, b) => a.actor.localeCompare(b.actor)),
    cursorRevision: entries.at(-1)?.revision ?? 0,
  })
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
  private feed: CollaborationFeed | null = null
  private feedQueue = Promise.resolve()

  constructor(options: BridgeRelayOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? fetch
    this.socketFactory = options.socketFactory ?? ((url) => new WebSocket(url))
    this.reconnectDelayMs = options.reconnectDelayMs ?? 100
  }

  subscribe(listener: (snapshot: CanvasSnapshot, reason: CanvasSnapshotReason) => void): () => void {
    this.emitter.on('snapshot', listener)
    return () => this.emitter.off('snapshot', listener)
  }

  subscribeFeed(listener: (feed: CollaborationFeed) => void): () => void {
    this.emitter.on('feed', listener)
    return () => this.emitter.off('feed', listener)
  }

  currentFeed(): CollaborationFeed {
    if (!this.feed) throw new Error('collaboration feed is not ready')
    return structuredClone(this.feed)
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
    this.feed = null
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

  /** Creates a brand-new project source file (registry-node materialization) via the bridge's
   *  `/source-patches` route, using the `NEW_FILE_HASH` sentinel for "file does not exist yet". */
  async materializeSource(file: string, content: string): Promise<CanvasSnapshot> {
    const snapshot = this.currentSnapshot()
    const body = await this.request('/source-patches', {
      method: 'POST',
      body: JSON.stringify({
        transactionId: `human:materialize:${Date.now()}`,
        actor: 'human',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        file,
        beforeFileHash: NEW_FILE_HASH,
        content,
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
    const generation = this.generation
    void this.syncFeed(generation).catch(() => undefined)
    return this.currentSnapshot()
  }

  /** Re-fetches the bridge's full `/audit` history (never trimmed, unlike the WS replay ring buffer) so the
   *  collaboration feed survives reconnect without duplicate or missed entries. */
  private syncFeed(generation: number): Promise<void> {
    this.feedQueue = this.feedQueue.then(async () => {
      if (generation !== this.generation) return
      const body = (await this.request('/audit')) as { entries?: unknown }
      if (generation !== this.generation) return
      const rawEntries = Array.isArray(body.entries) ? body.entries : []
      this.feed = buildCollaborationFeed(rawEntries)
      this.emitter.emit('feed', structuredClone(this.feed))
    })
    return this.feedQueue
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
