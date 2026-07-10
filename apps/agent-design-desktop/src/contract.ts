export const HOST_API_VERSION = 1 as const

export const HOST_IPC_CHANNELS = Object.freeze({
  getHostInfo: 'agent-design:host:get-info',
  getBridgeStatus: 'agent-design:bridge:get-status',
  copyTerminalCommand: 'agent-design:bridge:copy-terminal-command',
  bridgeStatusChanged: 'agent-design:bridge:status-changed',
})

export type TerminalActor = 'codex' | 'claude'
export type BridgeLifecycleState = 'idle' | 'starting' | 'ready' | 'backoff' | 'failed' | 'stopping'

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
}>

export type TerminalCommandRequest = Readonly<{
  apiVersion: typeof HOST_API_VERSION
  actor: TerminalActor
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
  const allowed = new Set(['apiVersion', 'state', 'projectId', 'restartCount', 'cursor', 'revision', 'lastErrorCode'])
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
  return Object.freeze(value as unknown as BridgeStatus)
}
