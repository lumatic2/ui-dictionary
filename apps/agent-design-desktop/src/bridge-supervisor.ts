import { EventEmitter } from 'node:events'
import type { CanvasDocument } from '@askewly/canvas-core' with { 'resolution-mode': 'import' }
import type { BridgeStatus } from './contract'
import { buildTerminalCommand, type TerminalActor } from './terminal-command'

export interface BridgeStartConfig {
  projectId: string
  projectRoot: string
  document: CanvasDocument
}

export interface BridgeProcess extends EventEmitter {
  readonly pid: number | undefined
  send(message: unknown): void
  kill(): boolean
}

export interface BridgeProcessFactory {
  spawn(config: BridgeStartConfig): BridgeProcess
}

interface BridgeCredentials {
  bridgeUrl: string
  token: string
}

interface SupervisorOptions {
  now?: () => number
  restartWindowMs?: number
  maxFailures?: number
  restartDelaysMs?: readonly number[]
  readyTimeoutMs?: number
  stopTimeoutMs?: number
}

type Schedule = ReturnType<typeof setTimeout>

export class BridgeSupervisor {
  private readonly emitter = new EventEmitter()
  private readonly now: () => number
  private readonly restartWindowMs: number
  private readonly maxFailures: number
  private readonly restartDelaysMs: readonly number[]
  private readonly readyTimeoutMs: number
  private readonly stopTimeoutMs: number
  private process: BridgeProcess | null = null
  private config: BridgeStartConfig | null = null
  private credentials: BridgeCredentials | null = null
  private failures: number[] = []
  private restartTimer: Schedule | null = null
  private readyTimer: Schedule | null = null
  private desired = false
  private generation = 0
  private current: BridgeStatus = Object.freeze({
    apiVersion: 1,
    state: 'idle',
    projectId: null,
    restartCount: 0,
    cursor: 0,
    revision: 0,
    lastErrorCode: null,
  })

  constructor(
    private readonly factory: BridgeProcessFactory,
    private readonly adapterPath: string,
    options: SupervisorOptions = {},
  ) {
    this.now = options.now ?? Date.now
    this.restartWindowMs = options.restartWindowMs ?? 60_000
    this.maxFailures = options.maxFailures ?? 3
    this.restartDelaysMs = options.restartDelaysMs ?? [250, 1_000, 4_000]
    this.readyTimeoutMs = options.readyTimeoutMs ?? 10_000
    this.stopTimeoutMs = options.stopTimeoutMs ?? 2_000
  }

  status(): BridgeStatus {
    return structuredClone(this.current)
  }

  subscribe(listener: (status: BridgeStatus) => void): () => void {
    this.emitter.on('status', listener)
    return () => this.emitter.off('status', listener)
  }

  start(config: BridgeStartConfig): void {
    if (this.desired || this.process || this.restartTimer) throw new Error('bridge supervisor is already active')
    this.desired = true
    this.config = structuredClone(config)
    this.credentials = null
    this.failures = []
    this.spawn()
  }

  requestHealth(): void {
    if (this.current.state !== 'ready' || !this.process) throw new Error('bridge is not ready')
    this.process.send({ type: 'health' })
  }

  terminalCommand(actor: TerminalActor): string {
    if (!this.credentials) throw new Error('bridge terminal bootstrap is not ready')
    return buildTerminalCommand(actor, {
      bridgeUrl: this.credentials.bridgeUrl,
      token: this.credentials.token,
      adapterPath: this.adapterPath,
    })
  }

  async stop(): Promise<void> {
    this.desired = false
    this.generation += 1
    this.clearTimers()
    this.credentials = null
    const child = this.process
    if (!child) {
      this.config = null
      this.publish({ state: 'idle', projectId: null, restartCount: 0, cursor: 0, revision: 0, lastErrorCode: null })
      return
    }

    this.publish({ state: 'stopping' })
    await new Promise<void>((resolve) => {
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
        resolve()
      }
      const timeout = setTimeout(() => {
        child.kill()
        finish()
      }, this.stopTimeoutMs)
      child.once('exit', finish)
      child.send({ type: 'stop' })
    })
    if (this.process === child) this.process = null
    this.config = null
    this.publish({ state: 'idle', projectId: null, restartCount: 0, cursor: 0, revision: 0, lastErrorCode: null })
  }

  private spawn(): void {
    const config = this.config
    if (!this.desired || !config) return
    const generation = ++this.generation
    const child = this.factory.spawn(structuredClone(config))
    this.process = child
    this.publish({
      state: 'starting',
      projectId: config.projectId,
      cursor: 0,
      revision: 0,
      lastErrorCode: null,
    })
    this.readyTimer = setTimeout(() => {
      if (this.generation !== generation || this.current.state !== 'starting') return
      this.current = Object.freeze({ ...this.current, lastErrorCode: 'BRIDGE_READY_TIMEOUT' })
      child.kill()
    }, this.readyTimeoutMs)

    child.on('message', (message: unknown) => {
      if (this.generation !== generation) return
      this.handleMessage(message)
    })
    child.on('fault', () => {
      if (this.generation !== generation) return
      this.current = Object.freeze({ ...this.current, lastErrorCode: 'BRIDGE_PROCESS_FATAL' })
    })
    child.once('exit', (code: number) => {
      if (this.generation !== generation) return
      this.handleExit(code)
    })
  }

  private handleMessage(message: unknown): void {
    if (typeof message !== 'object' || message === null) return
    const data = message as Record<string, unknown>
    if (data.type === 'ready') {
      if (
        typeof data.url !== 'string' ||
        !/^http:\/\/127\.0\.0\.1:\d+$/.test(data.url) ||
        typeof data.token !== 'string' ||
        data.token.length < 32
      ) {
        this.process?.kill()
        return
      }
      this.clearReadyTimer()
      this.credentials = { bridgeUrl: data.url, token: data.token }
      this.publish({
        state: 'ready',
        cursor: typeof data.cursor === 'number' ? data.cursor : 0,
        revision: typeof data.revision === 'number' ? data.revision : 0,
        lastErrorCode: null,
      })
      return
    }
    if (data.type === 'health' && this.current.state === 'ready') {
      this.publish({
        cursor: typeof data.cursor === 'number' ? data.cursor : this.current.cursor,
        revision: typeof data.revision === 'number' ? data.revision : this.current.revision,
      })
      return
    }
    if (data.type === 'watcher-error') this.publish({ lastErrorCode: 'SOURCE_WATCHER_ERROR' })
    if (data.type === 'fatal') {
      this.publish({ lastErrorCode: typeof data.code === 'string' ? data.code : 'BRIDGE_CHILD_FATAL' })
      this.process?.kill()
    }
  }

  private handleExit(code: number): void {
    this.clearReadyTimer()
    this.process = null
    this.credentials = null
    if (!this.desired || this.current.state === 'stopping') return

    const now = this.now()
    this.failures = this.failures.filter((failure) => now - failure < this.restartWindowMs)
    this.failures.push(now)
    const restartCount = this.failures.length
    if (restartCount >= this.maxFailures) {
      this.desired = false
      this.publish({ state: 'failed', restartCount, lastErrorCode: this.current.lastErrorCode ?? `BRIDGE_EXIT_${code}` })
      return
    }

    this.publish({ state: 'backoff', restartCount, lastErrorCode: this.current.lastErrorCode ?? `BRIDGE_EXIT_${code}` })
    const delay = this.restartDelaysMs[Math.min(restartCount - 1, this.restartDelaysMs.length - 1)] ?? 0
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null
      this.spawn()
    }, delay)
  }

  private publish(patch: Partial<Omit<BridgeStatus, 'apiVersion'>>): void {
    this.current = Object.freeze({ ...this.current, ...patch, apiVersion: 1 })
    this.emitter.emit('status', this.status())
  }

  private clearReadyTimer(): void {
    if (this.readyTimer) clearTimeout(this.readyTimer)
    this.readyTimer = null
  }

  private clearTimers(): void {
    this.clearReadyTimer()
    if (this.restartTimer) clearTimeout(this.restartTimer)
    this.restartTimer = null
  }
}
