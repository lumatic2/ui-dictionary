export const HOST_API_VERSION = 1 as const

export const HOST_IPC_CHANNELS = Object.freeze({
  getHostInfo: 'agent-design:host:get-info',
})

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
