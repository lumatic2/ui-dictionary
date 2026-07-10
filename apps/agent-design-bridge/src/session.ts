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
import { applyOperation, invertOperation, type CanvasDocument, type CanvasOperation } from '@askewly/canvas-core'

export interface BridgeSessionOptions {
  projectRoot: string
  document: CanvasDocument
  token?: string
  maxEvents?: number
}

export interface UndoRequest {
  id: string
  actor: TransactionEnvelope['actor']
  baseRevision: number
  beforeHash: string
  at: string
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
  private committed: Array<{ transaction: TransactionEnvelope; before: CanvasDocument }> = []
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
    return this.commitInternal(transaction, true)
  }

  private commitInternal(transaction: TransactionEnvelope, recordForUndo: boolean): TransactionEvent {
    const before = structuredClone(this.document)
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
    if (recordForUndo) this.committed.push({ transaction: structuredClone(transaction), before })
    this.events.push(event)
    if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents)
    this.emitter.emit('event', structuredClone(event))
    return structuredClone(event)
  }

  undo(request: UndoRequest): TransactionEvent {
    const target = this.committed.at(-1)
    if (!target) throw new BridgeProtocolError('INVALID_TRANSACTION', 'nothing to undo', 409)
    if (request.baseRevision !== this.document.revision) {
      throw new BridgeProtocolError('REVISION_CONFLICT', `expected revision ${this.document.revision}, received ${request.baseRevision}`, 409)
    }
    const currentHash = documentHash(this.document)
    if (request.beforeHash !== currentHash) {
      throw new BridgeProtocolError('HASH_CONFLICT', `expected hash ${currentHash}, received ${request.beforeHash}`, 409)
    }
    const states: CanvasDocument[] = []
    let working = structuredClone(target.before)
    for (const operation of target.transaction.operations) {
      states.push(working)
      working = applyOperation(working, operation)
    }
    const operations: CanvasOperation[] = target.transaction.operations
      .map((operation, index) => ({ operation, before: states[index] }))
      .reverse()
      .map(({ operation, before }, index) => ({
        ...invertOperation(before, operation),
        id: `${request.id}:inverse:${index}`,
        at: request.at,
      }))
    this.committed.pop()
    return this.commitInternal(
      {
        id: request.id,
        actor: request.actor,
        baseRevision: request.baseRevision,
        beforeHash: request.beforeHash,
        operations,
      },
      false,
    )
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
