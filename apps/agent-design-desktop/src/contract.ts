import type { CanvasDocument, CanvasOperation } from '@askewly/canvas-core' with { 'resolution-mode': 'import' }

export const HOST_API_VERSION = 1 as const

export const HOST_IPC_CHANNELS = Object.freeze({
  getHostInfo: 'agent-design:host:get-info',
  getBridgeStatus: 'agent-design:bridge:get-status',
  copyTerminalCommand: 'agent-design:bridge:copy-terminal-command',
  bridgeStatusChanged: 'agent-design:bridge:status-changed',
  getCanvasSnapshot: 'agent-design:canvas:get-snapshot',
  applyCanvasOperation: 'agent-design:canvas:apply-operation',
  undoCanvas: 'agent-design:canvas:undo',
  canvasSnapshotChanged: 'agent-design:canvas:snapshot-changed',
  selectProject: 'agent-design:project:select',
  recentProjects: 'agent-design:project:recent',
  openRecentProject: 'agent-design:project:open-recent',
  openPreview: 'agent-design:preview:open',
  hidePreview: 'agent-design:preview:hide',
  catalogFiles: 'agent-design:os:catalog-files',
  revealProject: 'agent-design:os:reveal-project',
  openFile: 'agent-design:os:open-file',
  exportDiagnostics: 'agent-design:diagnostics:export',
  getCollaborationFeed: 'agent-design:collaboration:get-feed',
  collaborationFeedChanged: 'agent-design:collaboration:feed-changed',
})

export type TerminalActor = 'codex' | 'claude'
export type BridgeLifecycleState = 'idle' | 'starting' | 'ready' | 'backoff' | 'failed' | 'stopping'
export type RecoveryMode = 'fresh' | 'recovered' | 'read-only'

export type HostRequest = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  projectId?: string
  sessionId?: string
}>

export type HostInfo = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  appVersion: string
  platform: 'win32' | 'darwin' | 'linux'
  capabilities: readonly ['desktop-host']
}>

export type BridgeStatus = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  state: BridgeLifecycleState
  projectId: string | null
  restartCount: number
  cursor: number
  revision: number
  lastErrorCode: string | null
  recoveryMode: RecoveryMode | null
}>

export type TerminalCommandRequest = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  actor: TerminalActor
}>

export type TrustedProjectSummary = Readonly<{
  id: string
  displayName: string
  lastOpenedAt: string
}>

export type ProjectSelectionResult = Readonly<{
  canceled: boolean
  project: TrustedProjectSummary | null
}>

export type PreviewStatus = Readonly<{
  visible: boolean
  projectId: string | null
  state: 'idle' | 'loading' | 'ready' | 'error'
}>

export type TrustedFileSummary = Readonly<{ id: string; label: string }>

export type FileActionRequest = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  projectId: string
  fileId: string
}>

export type CanvasSnapshotReason = 'initial' | 'event' | 'transaction' | 'recovery'
export type CanvasSnapshot = Readonly<{
  document: CanvasDocument
  revision: number
  hash: string
  cursor: number
}>
export type CanvasMutationRequest = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  operation: CanvasOperation
}>

export type FeedActor = 'codex' | 'claude' | 'human' | 'watcher'
export type FeedEntryKind = 'operations' | 'source-patch' | 'undo'

export type CollaborationFeedEntry = Readonly<{
  transactionId: string
  actor: FeedActor
  kind: FeedEntryKind
  revision: number
  at: string
  changeCount: number
  nodeIds: readonly string[]
}>

export type ActorActivity = Readonly<{
  actor: FeedActor
  lastRevision: number
  lastActiveAt: string
}>

export type CollaborationFeed = Readonly<{
  entries: readonly CollaborationFeedEntry[]
  actors: readonly ActorActivity[]
  cursorRevision: number
}>

const REQUEST_KEYS = new Set(['apiVersion', 'projectId', 'sessionId'])
const OPAQUE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseOptionalId(value: unknown, name: string): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string' || !OPAQUE_ID.test(value)) {
    throw new TypeError(`${name} must be an opaque identifier`)
  }
  return value
}

export function parseHostRequest(value: unknown): HostRequest {
  if (!isRecord(value)) throw new TypeError('host request must be an object')
  if (Object.keys(value).some((key) => !REQUEST_KEYS.has(key))) {
    throw new TypeError('host request contains an unsupported field')
  }
  if (value.apiVersion !== HOST_API_VERSION) {
    throw new TypeError(`unsupported host API version: ${String(value.apiVersion)}`)
  }

  const projectId = parseOptionalId(value.projectId, 'projectId')
  const sessionId = parseOptionalId(value.sessionId, 'sessionId')
  return Object.freeze({
    apiVersion: HOST_API_VERSION,
    ...(projectId === undefined ? {} : { projectId }),
    ...(sessionId === undefined ? {} : { sessionId }),
  })
}

export function parseTerminalCommandRequest(value: unknown): TerminalCommandRequest {
  if (!isRecord(value)) throw new TypeError('terminal command request must be an object')
  if (Object.keys(value).some((key) => key !== 'apiVersion' && key !== 'actor')) {
    throw new TypeError('terminal command request contains an unsupported field')
  }
  if (value.apiVersion !== HOST_API_VERSION) throw new TypeError('unsupported host API version')
  if (value.actor !== 'codex' && value.actor !== 'claude') throw new TypeError('terminal actor must be codex or claude')
  return Object.freeze({ apiVersion: HOST_API_VERSION, actor: value.actor })
}

const BRIDGE_STATES = new Set<BridgeLifecycleState>(['idle', 'starting', 'ready', 'backoff', 'failed', 'stopping'])

export function parseBridgeStatus(value: unknown): BridgeStatus {
  if (!isRecord(value)) throw new TypeError('bridge status must be an object')
  const allowed = new Set(['apiVersion', 'state', 'projectId', 'restartCount', 'cursor', 'revision', 'lastErrorCode', 'recoveryMode'])
  if (Object.keys(value).some((key) => !allowed.has(key))) throw new TypeError('bridge status contains a secret or unsupported field')
  if (value.apiVersion !== HOST_API_VERSION || !BRIDGE_STATES.has(value.state as BridgeLifecycleState)) {
    throw new TypeError('invalid bridge status version or state')
  }
  if (value.projectId !== null && (typeof value.projectId !== 'string' || !OPAQUE_ID.test(value.projectId))) {
    throw new TypeError('invalid bridge projectId')
  }
  for (const field of ['restartCount', 'cursor', 'revision'] as const) {
    if (!Number.isSafeInteger(value[field]) || (value[field] as number) < 0) throw new TypeError(`invalid bridge ${field}`)
  }
  if (value.lastErrorCode !== null && (typeof value.lastErrorCode !== 'string' || !/^[A-Z0-9_:-]{1,128}$/.test(value.lastErrorCode))) {
    throw new TypeError('invalid bridge error code')
  }
  if (value.recoveryMode !== null && value.recoveryMode !== 'fresh' && value.recoveryMode !== 'recovered' && value.recoveryMode !== 'read-only') {
    throw new TypeError('invalid bridge recovery mode')
  }
  return Object.freeze(value as unknown as BridgeStatus)
}

export function parseTrustedProjectSummary(value: unknown): TrustedProjectSummary {
  if (!isRecord(value)) throw new TypeError('trusted project summary must be an object')
  if (Object.keys(value).some((key) => key !== 'id' && key !== 'displayName' && key !== 'lastOpenedAt')) {
    throw new TypeError('trusted project summary contains a path or unsupported field')
  }
  if (typeof value.id !== 'string' || !/^project:[a-f0-9]{24}$/.test(value.id)) throw new TypeError('invalid trusted project id')
  if (typeof value.displayName !== 'string' || value.displayName.length < 1 || value.displayName.length > 255) throw new TypeError('invalid project display name')
  if (typeof value.lastOpenedAt !== 'string' || Number.isNaN(Date.parse(value.lastOpenedAt))) throw new TypeError('invalid project timestamp')
  return Object.freeze(value as unknown as TrustedProjectSummary)
}

export function parseProjectSelectionResult(value: unknown): ProjectSelectionResult {
  if (!isRecord(value) || typeof value.canceled !== 'boolean') throw new TypeError('invalid project selection result')
  if (Object.keys(value).some((key) => key !== 'canceled' && key !== 'project')) throw new TypeError('project selection leaked an unsupported field')
  const project = value.project === null ? null : parseTrustedProjectSummary(value.project)
  if (value.canceled !== (project === null)) throw new TypeError('inconsistent project selection result')
  return Object.freeze({ canceled: value.canceled, project })
}

export function parsePreviewStatus(value: unknown): PreviewStatus {
  if (!isRecord(value) || typeof value.visible !== 'boolean') throw new TypeError('invalid preview status')
  if (Object.keys(value).some((key) => key !== 'visible' && key !== 'projectId' && key !== 'state')) throw new TypeError('preview status contains an unsupported field')
  if (value.projectId !== null && (typeof value.projectId !== 'string' || !/^project:[a-f0-9]{24}$/.test(value.projectId))) throw new TypeError('invalid preview project')
  if (value.state !== 'idle' && value.state !== 'loading' && value.state !== 'ready' && value.state !== 'error') throw new TypeError('invalid preview state')
  return Object.freeze(value as unknown as PreviewStatus)
}

export function parseTrustedFileSummary(value: unknown): TrustedFileSummary {
  if (!isRecord(value) || Object.keys(value).some((key) => key !== 'id' && key !== 'label')) throw new TypeError('invalid trusted file summary')
  if (typeof value.id !== 'string' || !/^file:[a-f0-9]{24}$/.test(value.id)) throw new TypeError('invalid trusted file id')
  if (typeof value.label !== 'string' || isAbsoluteLike(value.label) || value.label.includes('..')) throw new TypeError('invalid trusted file label')
  return Object.freeze(value as unknown as TrustedFileSummary)
}

function isAbsoluteLike(value: string): boolean {
  return /^[A-Za-z]:[\\/]/.test(value) || value.startsWith('/') || value.startsWith('\\\\')
}

export function parseFileActionRequest(value: unknown): FileActionRequest {
  if (!isRecord(value) || Object.keys(value).some((key) => key !== 'apiVersion' && key !== 'projectId' && key !== 'fileId')) throw new TypeError('invalid file action request')
  if (value.apiVersion !== HOST_API_VERSION) throw new TypeError('unsupported host API version')
  if (typeof value.projectId !== 'string' || !/^project:[a-f0-9]{24}$/.test(value.projectId)) throw new TypeError('invalid project id')
  if (typeof value.fileId !== 'string' || !/^file:[a-f0-9]{24}$/.test(value.fileId)) throw new TypeError('invalid file id')
  return Object.freeze(value as unknown as FileActionRequest)
}

export function parseCanvasSnapshot(value: unknown): CanvasSnapshot {
  if (!isRecord(value) || Object.keys(value).some((key) => !['document', 'revision', 'hash', 'cursor'].includes(key))) throw new TypeError('invalid canvas snapshot')
  if (!isRecord(value.document) || value.document.schemaVersion !== 1 || !isRecord(value.document.nodes)) throw new TypeError('invalid canvas document')
  if (!Number.isSafeInteger(value.revision) || (value.revision as number) < 0 || value.document.revision !== value.revision) throw new TypeError('invalid canvas revision')
  if (!Number.isSafeInteger(value.cursor) || (value.cursor as number) < 0) throw new TypeError('invalid canvas cursor')
  if (typeof value.hash !== 'string' || !/^[a-f0-9]{64}$/.test(value.hash)) throw new TypeError('invalid canvas hash')
  if (JSON.stringify(value).length > 20_000_000) throw new TypeError('canvas snapshot is too large')
  return structuredClone(value) as CanvasSnapshot
}

export function parseCanvasMutationRequest(value: unknown): CanvasMutationRequest {
  if (!isRecord(value) || Object.keys(value).some((key) => key !== 'apiVersion' && key !== 'operation')) throw new TypeError('invalid canvas mutation request')
  if (value.apiVersion !== HOST_API_VERSION || !isRecord(value.operation)) throw new TypeError('invalid canvas mutation version or operation')
  const operation = value.operation
  const types = new Set(['create-node', 'delete-node', 'update-node', 'transform-nodes', 'set-node-property', 'update-text', 'set-token-mode', 'reparent-node', 'reorder-node', 'select-nodes', 'set-viewport'])
  if (typeof operation.type !== 'string' || !types.has(operation.type)) throw new TypeError('unsupported canvas operation')
  if (typeof operation.id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(operation.id)) throw new TypeError('invalid canvas operation id')
  if (typeof operation.at !== 'string' || Number.isNaN(Date.parse(operation.at))) throw new TypeError('invalid canvas operation timestamp')
  if (JSON.stringify(operation).length > 1_000_000) throw new TypeError('canvas operation is too large')
  return Object.freeze({ apiVersion: HOST_API_VERSION, operation: structuredClone(operation) as unknown as CanvasOperation })
}

const FEED_ACTORS = new Set<FeedActor>(['codex', 'claude', 'human', 'watcher'])
const FEED_KINDS = new Set<FeedEntryKind>(['operations', 'source-patch', 'undo'])
const OPAQUE_NODE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/

function parseCollaborationFeedEntry(value: unknown): CollaborationFeedEntry {
  if (!isRecord(value)) throw new TypeError('collaboration feed entry must be an object')
  const allowed = new Set(['transactionId', 'actor', 'kind', 'revision', 'at', 'changeCount', 'nodeIds'])
  if (Object.keys(value).some((key) => !allowed.has(key))) throw new TypeError('collaboration feed entry contains an unsupported field')
  if (typeof value.transactionId !== 'string' || !OPAQUE_ID.test(value.transactionId)) throw new TypeError('invalid feed transactionId')
  if (typeof value.actor !== 'string' || !FEED_ACTORS.has(value.actor as FeedActor)) throw new TypeError('invalid feed actor')
  if (typeof value.kind !== 'string' || !FEED_KINDS.has(value.kind as FeedEntryKind)) throw new TypeError('invalid feed kind')
  if (!Number.isSafeInteger(value.revision) || (value.revision as number) < 0) throw new TypeError('invalid feed revision')
  if (typeof value.at !== 'string' || Number.isNaN(Date.parse(value.at))) throw new TypeError('invalid feed timestamp')
  if (!Number.isSafeInteger(value.changeCount) || (value.changeCount as number) < 0) throw new TypeError('invalid feed changeCount')
  if (!Array.isArray(value.nodeIds) || value.nodeIds.some((id) => typeof id !== 'string' || !OPAQUE_NODE_ID.test(id))) {
    throw new TypeError('invalid feed nodeIds')
  }
  return Object.freeze({ ...value, nodeIds: Object.freeze([...value.nodeIds]) }) as CollaborationFeedEntry
}

function parseActorActivity(value: unknown): ActorActivity {
  if (!isRecord(value)) throw new TypeError('actor activity must be an object')
  if (Object.keys(value).some((key) => key !== 'actor' && key !== 'lastRevision' && key !== 'lastActiveAt')) {
    throw new TypeError('actor activity contains an unsupported field')
  }
  if (typeof value.actor !== 'string' || !FEED_ACTORS.has(value.actor as FeedActor)) throw new TypeError('invalid actor activity actor')
  if (!Number.isSafeInteger(value.lastRevision) || (value.lastRevision as number) < 0) throw new TypeError('invalid actor activity revision')
  if (typeof value.lastActiveAt !== 'string' || Number.isNaN(Date.parse(value.lastActiveAt))) throw new TypeError('invalid actor activity timestamp')
  return Object.freeze(value as unknown as ActorActivity)
}

export function parseCollaborationFeed(value: unknown): CollaborationFeed {
  if (!isRecord(value) || Object.keys(value).some((key) => !['entries', 'actors', 'cursorRevision'].includes(key))) {
    throw new TypeError('invalid collaboration feed')
  }
  if (!Array.isArray(value.entries) || !Array.isArray(value.actors)) throw new TypeError('collaboration feed entries/actors must be arrays')
  if (!Number.isSafeInteger(value.cursorRevision) || (value.cursorRevision as number) < 0) throw new TypeError('invalid collaboration feed cursor')
  if (JSON.stringify(value).length > 5_000_000) throw new TypeError('collaboration feed is too large')
  return Object.freeze({
    entries: Object.freeze(value.entries.map(parseCollaborationFeedEntry)),
    actors: Object.freeze(value.actors.map(parseActorActivity)),
    cursorRevision: value.cursorRevision as number,
  })
}
