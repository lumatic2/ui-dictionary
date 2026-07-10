import { randomBytes } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { isAbsolute, relative, resolve } from 'node:path'
import {
  applyTransaction,
  BridgeProtocolError,
  createSnapshot,
  documentHash,
  type CanvasSnapshot,
  type ReplayResult,
  type TransactionEnvelope,
  type TransactionEvent,
} from '@askewly/agent-design-engine'
import type { CanvasDocument } from '@askewly/canvas-core'

export interface BridgeSessionOptions {
  projectRoot: string
  document: CanvasDocument
  token?: string
  maxEvents?: number
}

export function isLoopbackAddress(address: string | undefined): boolean {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

export function resolveProjectPath(projectRoot: string, candidate: string): string {
  const root = resolve(projectRoot)
  const target = resolve(root, candidate)
  const pathFromRoot = relative(root, target)
  if (pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot)) {
    throw new BridgeProtocolError('PROJECT_SCOPE_VIOLATION', `path escapes project root: ${candidate}`, 403)
  }
  return target
}

export class BridgeSession {
  readonly projectRoot: string
  readonly token: string
  readonly maxEvents: number
  private document: CanvasDocument
  private events: TransactionEvent[] = []
  private cursor = 0
  private readonly emitter = new EventEmitter()

  constructor(options: BridgeSessionOptions) {
    this.projectRoot = resolve(options.projectRoot)
    this.document = structuredClone(options.document)
    this.token = options.token ?? randomBytes(32).toString('base64url')
    this.maxEvents = options.maxEvents ?? 256
  }

  authorize(token: string | undefined, remoteAddress: string | undefined): void {
    if (!isLoopbackAddress(remoteAddress)) {
      throw new BridgeProtocolError('LOOPBACK_REQUIRED', 'bridge accepts loopback clients only', 403)
    }
    if (!token || token !== this.token) {
      throw new BridgeProtocolError('AUTH_REQUIRED', 'valid session token required', 401)
    }
  }

  snapshot(): CanvasSnapshot {
    return createSnapshot(this.document, this.cursor)
  }

  commit(transaction: TransactionEnvelope): TransactionEvent {
    const beforeHash = documentHash(this.document)
    const next = applyTransaction(this.document, transaction)
    const event: TransactionEvent = {
      cursor: ++this.cursor,
      type: 'transaction-committed',
      transactionId: transaction.id,
      actor: transaction.actor,
      revision: next.revision,
      beforeHash,
      afterHash: documentHash(next),
      operations: structuredClone(transaction.operations),
    }
    this.document = next
    this.events.push(event)
    if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents)
    this.emitter.emit('event', structuredClone(event))
    return structuredClone(event)
  }

  replay(afterCursor: number): ReplayResult {
    const earliestCursor = this.events[0]?.cursor ?? this.cursor + 1
    if (afterCursor < earliestCursor - 1) {
      return { mode: 'snapshot', snapshot: this.snapshot(), reason: 'cursor-gap' }
    }
    return {
      mode: 'events',
      events: this.events.filter((event) => event.cursor > afterCursor).map((event) => structuredClone(event)),
      cursor: this.cursor,
    }
  }

  subscribe(listener: (event: TransactionEvent) => void): () => void {
    this.emitter.on('event', listener)
    return () => this.emitter.off('event', listener)
  }
}
