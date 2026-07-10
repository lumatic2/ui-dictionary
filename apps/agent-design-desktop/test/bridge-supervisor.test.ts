import { EventEmitter } from 'node:events'
import { describe, expect, it } from 'vitest'
import { BridgeSupervisor, type BridgeProcess, type BridgeProcessFactory, type BridgeStartConfig } from '../src/bridge-supervisor'

class FakeProcess extends EventEmitter implements BridgeProcess {
  readonly pid = 4242
  readonly sent: unknown[] = []
  killed = false

  send(message: unknown): void {
    this.sent.push(message)
    if ((message as { type?: string }).type === 'stop') queueMicrotask(() => this.emit('exit', 0))
  }

  kill(): boolean {
    this.killed = true
    queueMicrotask(() => this.emit('exit', 1))
    return true
  }
}

class FakeFactory implements BridgeProcessFactory {
  readonly children: FakeProcess[] = []
  readonly configs: BridgeStartConfig[] = []

  spawn(config: BridgeStartConfig): BridgeProcess {
    this.configs.push(config)
    const child = new FakeProcess()
    this.children.push(child)
    return child
  }
}

const document = {
  schemaVersion: 1,
  id: 'fixture',
  name: 'Fixture',
  revision: 0,
  rootIds: [],
  nodes: {},
  selection: [],
  viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
  tokenSetId: 'askewly.default',
  metadata: { createdAt: '2026-07-11T00:00:00.000Z', updatedAt: '2026-07-11T00:00:00.000Z', sourceRoot: '.' },
} as BridgeStartConfig['document']

const config: BridgeStartConfig = { projectId: 'project:fixture', projectRoot: 'C:\\fixture', recoveryRoot: 'C:\\recovery', document }
const ready = {
  type: 'ready',
  projectId: 'project:fixture',
  url: 'http://127.0.0.1:43210',
  wsUrl: 'ws://127.0.0.1:43210',
  token: 'a'.repeat(43),
  cursor: 2,
  revision: 2,
  recoveryMode: 'fresh',
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 2))

describe('bridge supervisor', () => {
  it('publishes redacted ready/health state and stops gracefully', async () => {
    const factory = new FakeFactory()
    const supervisor = new BridgeSupervisor(factory, 'C:\\adapter\\cli.js', { restartDelaysMs: [0], stopTimeoutMs: 20 })
    supervisor.start(config)
    expect(supervisor.status().state).toBe('starting')
    factory.children[0]?.emit('message', ready)
    expect(supervisor.status()).toMatchObject({ state: 'ready', projectId: 'project:fixture', cursor: 2, revision: 2 })
    expect(JSON.stringify(supervisor.status())).not.toMatch(/token|43210|adapter/i)
    supervisor.requestHealth()
    expect(factory.children[0]?.sent).toContainEqual({ type: 'health' })
    factory.children[0]?.emit('message', { type: 'health', ready: true, cursor: 4, revision: 3 })
    expect(supervisor.status()).toMatchObject({ cursor: 4, revision: 3 })
    await supervisor.stop()
    expect(supervisor.status().state).toBe('idle')
    expect(factory.children[0]?.sent).toContainEqual({ type: 'stop' })
  })

  it('opens the circuit after three exits inside sixty seconds', async () => {
    let now = 1_000
    const factory = new FakeFactory()
    const supervisor = new BridgeSupervisor(factory, 'C:\\adapter\\cli.js', {
      now: () => now,
      restartWindowMs: 60_000,
      maxFailures: 3,
      restartDelaysMs: [0],
      readyTimeoutMs: 100,
    })
    supervisor.start(config)
    for (let index = 0; index < 3; index += 1) {
      const child = factory.children[index]
      if (!child) throw new Error(`missing child ${index}`)
      child.emit('message', ready)
      child.emit('exit', 17)
      now += 10_000
      await tick()
    }
    expect(factory.children).toHaveLength(3)
    expect(supervisor.status()).toMatchObject({ state: 'failed', restartCount: 3, lastErrorCode: 'BRIDGE_EXIT_17' })
  })

  it('records a fatal child signal before restarting', async () => {
    const factory = new FakeFactory()
    const supervisor = new BridgeSupervisor(factory, 'C:\\adapter\\cli.js', { restartDelaysMs: [0], readyTimeoutMs: 100 })
    supervisor.start(config)
    const child = factory.children[0]
    if (!child) throw new Error('missing child')
    child.emit('fault', { type: 'FatalError' })
    child.emit('exit', 1)
    expect(supervisor.status()).toMatchObject({ state: 'backoff', restartCount: 1, lastErrorCode: 'BRIDGE_PROCESS_FATAL' })
    await tick()
    expect(factory.children).toHaveLength(2)
    await supervisor.stop()
  })

  it('kills a child that never completes the ready handshake', async () => {
    const factory = new FakeFactory()
    const supervisor = new BridgeSupervisor(factory, 'C:\\adapter\\cli.js', { restartDelaysMs: [50], readyTimeoutMs: 2 })
    supervisor.start(config)
    await new Promise((resolve) => setTimeout(resolve, 8))
    expect(factory.children[0]?.killed).toBe(true)
    expect(supervisor.status()).toMatchObject({ state: 'backoff', restartCount: 1, lastErrorCode: 'BRIDGE_READY_TIMEOUT' })
    await supervisor.stop()
  })
})
