import { isAbsolute } from 'node:path'
import type { CanvasDocument } from '@askewly/canvas-core'
import { startBridge, type RunningBridge } from './server.js'

interface PortMessageEvent {
  data: unknown
  ports?: UtilityMessagePort[]
}

interface UtilityMessagePort {
  on(event: 'message', listener: (event: PortMessageEvent) => void): this
  postMessage(message: unknown): void
  start(): void
  close(): void
}

interface UtilityParentPort {
  once(event: 'message', listener: (event: PortMessageEvent) => void): this
}

type DesktopBridgeStart = Readonly<{
  type: 'start'
  projectId: string
  projectRoot: string
  document: CanvasDocument
}>

const parentPort = (process as NodeJS.Process & { parentPort?: UtilityParentPort | null }).parentPort
if (!parentPort) throw new Error('desktop bridge child requires Electron utilityProcess parentPort')

let controlPort: UtilityMessagePort | null = null
let running: RunningBridge | null = null
let stopping = false

function post(message: unknown): void {
  controlPort?.postMessage(message)
}

function parseStart(value: unknown): DesktopBridgeStart {
  if (typeof value !== 'object' || value === null) throw new TypeError('bridge start message must be an object')
  const input = value as Partial<DesktopBridgeStart>
  if (input.type !== 'start') throw new TypeError('bridge child expected start message')
  if (typeof input.projectId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(input.projectId)) {
    throw new TypeError('bridge child requires an opaque projectId')
  }
  if (typeof input.projectRoot !== 'string' || !isAbsolute(input.projectRoot)) {
    throw new TypeError('bridge child requires an absolute project root')
  }
  if (typeof input.document !== 'object' || input.document === null) {
    throw new TypeError('bridge child requires a canvas document')
  }
  return input as DesktopBridgeStart
}

async function start(input: DesktopBridgeStart): Promise<void> {
  if (running || stopping) throw new Error('bridge child is already started')
  running = await startBridge({
    projectRoot: input.projectRoot,
    document: input.document,
    watchSources: true,
    onWatcherError: () => post({ type: 'watcher-error', code: 'SOURCE_WATCHER_ERROR' }),
  })
  const snapshot = running.session.snapshot()
  post({
    type: 'ready',
    projectId: input.projectId,
    url: running.url,
    wsUrl: running.wsUrl,
    token: running.session.token,
    cursor: snapshot.cursor,
    revision: snapshot.revision,
  })
}

async function stop(exitCode = 0): Promise<void> {
  if (stopping) return
  stopping = true
  await running?.close()
  running = null
  post({ type: 'stopped' })
  controlPort?.close()
  process.exit(exitCode)
}

async function handle(message: unknown): Promise<void> {
  if (typeof message !== 'object' || message === null) throw new TypeError('bridge control message must be an object')
  const type = (message as { type?: unknown }).type
  if (type === 'start') {
    await start(parseStart(message))
    return
  }
  if (type === 'health') {
    const snapshot = running?.session.snapshot()
    post({ type: 'health', ready: Boolean(running), cursor: snapshot?.cursor ?? 0, revision: snapshot?.revision ?? 0 })
    return
  }
  if (type === 'stop') {
    await stop()
    return
  }
  throw new TypeError(`unsupported bridge control message: ${String(type)}`)
}

parentPort.once('message', (event) => {
  const [port] = event.ports ?? []
  if (!port) throw new Error('desktop bridge child requires a transferred control port')
  controlPort = port
  port.on('message', (message) => {
    void handle(message.data).catch((error: unknown) => {
      post({ type: 'fatal', code: 'BRIDGE_CHILD_PROTOCOL_ERROR', message: error instanceof Error ? error.message : 'bridge child failed' })
      void stop(1)
    })
  })
  port.start()
  post({ type: 'attached' })
})

process.on('SIGTERM', () => void stop())
process.on('SIGINT', () => void stop())
