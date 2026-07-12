import { MessageChannelMain, utilityProcess, type UtilityProcess } from 'electron'
import { EventEmitter } from 'node:events'
import type { BridgeProcess, BridgeProcessFactory, BridgeStartConfig } from './bridge-supervisor'

function utilityEnvironment(): Record<string, string> {
  const allowed = ['NODE_ENV', 'PATH', 'SystemRoot', 'WINDIR', 'TEMP', 'TMP'] as const
  return Object.fromEntries(
    allowed.flatMap((key) => (typeof process.env[key] === 'string' ? [[key, process.env[key]]] : [])),
  )
}

class ElectronBridgeProcess extends EventEmitter implements BridgeProcess {
  private readonly port

  constructor(private readonly child: UtilityProcess, config: BridgeStartConfig) {
    super()
    const { port1, port2 } = new MessageChannelMain()
    this.port = port2
    port2.on('message', (event) => this.emit('message', event.data))
    port2.start()

    child.on('spawn', () => {
      child.postMessage({ type: 'attach' }, [port1])
      port2.postMessage({ type: 'start', ...structuredClone(config) })
      this.emit('spawn')
    })
    child.on('error', (type, location, report) => this.emit('fault', { type, location, report }))
    child.stdout?.on('data', (chunk: Buffer | string) => this.emit('diagnostic', { stream: 'stdout', bytes: Buffer.byteLength(chunk) }))
    child.stderr?.on('data', (chunk: Buffer | string) => this.emit('diagnostic', { stream: 'stderr', bytes: Buffer.byteLength(chunk) }))
    child.on('exit', (code) => {
      port2.close()
      this.emit('exit', code)
    })
  }

  get pid(): number | undefined {
    return this.child.pid
  }

  send(message: unknown): void {
    this.port.postMessage(message)
  }

  kill(): boolean {
    return this.child.kill()
  }
}

export class ElectronBridgeProcessFactory implements BridgeProcessFactory {
  constructor(private readonly childEntry: string) {}

  spawn(config: BridgeStartConfig): BridgeProcess {
    const child = utilityProcess.fork(this.childEntry, [], {
      cwd: config.projectRoot,
      env: utilityEnvironment(),
      stdio: 'pipe',
      serviceName: 'AskewlyDesign Bridge',
      allowLoadingUnsignedLibraries: false,
      respondToAuthRequestsFromMainProcess: false,
    })
    return new ElectronBridgeProcess(child, config)
  }
}
