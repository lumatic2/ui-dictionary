import { createHash, randomBytes } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import {
  applyTransaction,
  BridgeProtocolError,
  createSnapshot,
  documentHash,
  exactChanges,
  reconcileDocumentFromSource,
  unifiedDiff,
  type CanvasSnapshot,
  type ReplayResult,
  type TransactionAuditEntry,
  type TransactionEnvelope,
  type TransactionEvent,
} from '@askewly/agent-design-engine'
import { applyOperation, invertOperation, type CanvasDocument, type CanvasOperation } from '@askewly/canvas-core'

export interface BridgeSessionOptions {
  projectRoot: string
  document: CanvasDocument
  token?: string
  maxEvents?: number
  verifySource?: (file: string, stagedFile: string, content: string) => { valid: boolean; checks: string[] }
  auditSink?: (entry: TransactionAuditEntry) => void
  persistenceSink?: (state: { snapshot: CanvasSnapshot; audits: TransactionAuditEntry[] }) => void
  initialCursor?: number
  initialAudits?: TransactionAuditEntry[]
  readOnly?: boolean
}

export interface UndoRequest {
  id: string
  actor: TransactionEnvelope['actor']
  baseRevision: number
  beforeHash: string
  at: string
}

export interface SourcePatchRequest {
  transactionId: string
  actor: TransactionEnvelope['actor']
  baseRevision: number
  beforeHash: string
  file: string
  beforeFileHash: string
  content: string
  at: string
}

type UndoRecord =
  | { kind: 'operations'; transaction: TransactionEnvelope; before: CanvasDocument }
  | { kind: 'source-patch'; request: SourcePatchRequest; beforeDocument: CanvasDocument; beforeContent: string; afterFileHash: string }

/**
 * Sentinel `beforeFileHash` a caller passes to `applySourcePatch` to request
 * creating a file that does not exist yet, rather than patching one that
 * does. RT Step 3: registry materialization needs to write a brand-new
 * `src/components/<Export>.tsx` file, and the pre-existing source-patch
 * channel only ever accepted patches to files already tracked in
 * `allowedSourceFiles` (nodes the document already references) - there was
 * no way to create a file through it at all. This sentinel is the minimal
 * extension: it does not widen the trust boundary (the target path is still
 * resolved through `resolveProjectPath`, still confined to the project
 * root), it just allows the "before" state to legitimately be "absent"
 * instead of requiring a real on-disk hash.
 */
export const NEW_FILE_HASH = 'new-file:absent'

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
  private committed: UndoRecord[] = []
  private audits: TransactionAuditEntry[] = []
  private transactionIds = new Set<string>()
  private cursor = 0
  private readonly emitter = new EventEmitter()
  private readonly verifySource: NonNullable<BridgeSessionOptions['verifySource']>
  private readonly auditSink: NonNullable<BridgeSessionOptions['auditSink']>
  private readonly persistenceSink: NonNullable<BridgeSessionOptions['persistenceSink']>
  private readonly readOnly: boolean
  private readonly allowedSourceFiles: Set<string>

  constructor(options: BridgeSessionOptions) {
    this.projectRoot = resolve(options.projectRoot)
    this.document = structuredClone(options.document)
    this.token = options.token ?? randomBytes(32).toString('base64url')
    this.maxEvents = options.maxEvents ?? 256
    this.verifySource = options.verifySource ?? ((_file, _stagedFile, content) => ({ valid: content.length > 0, checks: ['non-empty-source'] }))
    this.auditSink = options.auditSink ?? (() => undefined)
    this.persistenceSink = options.persistenceSink ?? (() => undefined)
    this.readOnly = options.readOnly ?? false
    this.cursor = options.initialCursor ?? 0
    this.audits = structuredClone(options.initialAudits ?? [])
    for (const audit of this.audits) this.transactionIds.add(audit.transactionId)
    this.allowedSourceFiles = new Set(
      Object.values(this.document.nodes)
        .map((node) => node.source?.file)
        .filter((file): file is string => Boolean(file))
        .map((file) => resolve(this.projectRoot, file)),
    )
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

  sourceFiles(): Array<{ file: string; hash: string | null }> {
    return [...this.allowedSourceFiles]
      .sort()
      .map((file) => ({ file: relative(this.projectRoot, file).replaceAll('\\', '/'), hash: existsSync(file) ? sourceHash(readFileSync(file, 'utf8')) : null }))
  }

  commit(transaction: TransactionEnvelope): TransactionEvent {
    this.assertWritable()
    return this.commitInternal(transaction, true)
  }

  private commitInternal(transaction: TransactionEnvelope, recordForUndo: boolean): TransactionEvent {
    if (this.transactionIds.has(transaction.id)) throw new BridgeProtocolError('INVALID_TRANSACTION', `duplicate transaction id: ${transaction.id}`, 409)
    const before = structuredClone(this.document)
    const beforeHash = documentHash(this.document)
    const next = applyTransaction(this.document, transaction)
    const event: TransactionEvent = {
      cursor: this.cursor + 1,
      type: 'transaction-committed',
      transactionId: transaction.id,
      actor: transaction.actor,
      revision: next.revision,
      beforeHash,
      afterHash: documentHash(next),
      operations: structuredClone(transaction.operations),
    }
    const audit: TransactionAuditEntry = {
      transactionId: transaction.id,
      actor: transaction.actor,
      kind: recordForUndo ? 'operations' : 'undo',
      revision: next.revision,
      beforeHash,
      afterHash: event.afterHash,
      exactChanges: exactChanges(before, next),
      verification: { valid: true, checks: ['canvas-core-validation'] },
      committedAt: transaction.operations.at(-1)?.at ?? new Date().toISOString(),
    }
    this.auditSink(structuredClone(audit))
    this.persist(next, audit)
    this.document = next
    this.cursor += 1
    if (recordForUndo) this.committed.push({ kind: 'operations', transaction: structuredClone(transaction), before })
    this.transactionIds.add(transaction.id)
    this.audits.push(audit)
    this.events.push(event)
    if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents)
    this.emitter.emit('event', structuredClone(event))
    return structuredClone(event)
  }

  undo(request: UndoRequest): TransactionEvent {
    this.assertWritable()
    const target = this.committed.at(-1)
    if (!target) throw new BridgeProtocolError('INVALID_TRANSACTION', 'nothing to undo', 409)
    if (request.baseRevision !== this.document.revision) {
      throw new BridgeProtocolError('REVISION_CONFLICT', `expected revision ${this.document.revision}, received ${request.baseRevision}`, 409)
    }
    const currentHash = documentHash(this.document)
    if (request.beforeHash !== currentHash) {
      throw new BridgeProtocolError('HASH_CONFLICT', `expected hash ${currentHash}, received ${request.beforeHash}`, 409)
    }
    if (target.kind === 'source-patch') return this.undoSourcePatch(target, request)
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
    const event = this.commitInternal(
      {
        id: request.id,
        actor: request.actor,
        baseRevision: request.baseRevision,
        beforeHash: request.beforeHash,
        operations,
      },
      false,
    )
    this.committed.pop()
    return event
  }

  private assertSourceGuard(request: Pick<SourcePatchRequest, 'baseRevision' | 'beforeHash'>): void {
    if (request.baseRevision !== this.document.revision) {
      throw new BridgeProtocolError('REVISION_CONFLICT', `expected revision ${this.document.revision}, received ${request.baseRevision}`, 409)
    }
    const currentHash = documentHash(this.document)
    if (request.beforeHash !== currentHash) {
      throw new BridgeProtocolError('HASH_CONFLICT', `expected hash ${currentHash}, received ${request.beforeHash}`, 409)
    }
  }

  private sourceFile(requested: string): string {
    const file = resolveProjectPath(this.projectRoot, requested)
    if (!this.allowedSourceFiles.has(file)) {
      throw new BridgeProtocolError('PROJECT_SCOPE_VIOLATION', `source file is not registered by the canvas document: ${requested}`, 403)
    }
    if (!existsSync(file)) throw new BridgeProtocolError('INVALID_TRANSACTION', `source file does not exist: ${requested}`, 400)
    return file
  }

  /** Resolves (and confines to the project root) a path for a patch that creates a new file. */
  private newSourceFile(requested: string): string {
    const file = resolveProjectPath(this.projectRoot, requested)
    if (existsSync(file)) throw new BridgeProtocolError('INVALID_TRANSACTION', `source file already exists: ${requested}`, 400)
    return file
  }

  applySourcePatch(request: SourcePatchRequest): TransactionEvent {
    this.assertWritable()
    if (this.transactionIds.has(request.transactionId)) throw new BridgeProtocolError('INVALID_TRANSACTION', `duplicate transaction id: ${request.transactionId}`, 409)
    this.assertSourceGuard(request)
    const isNewFile = request.beforeFileHash === NEW_FILE_HASH
    const file = isNewFile ? this.newSourceFile(request.file) : this.sourceFile(request.file)
    const beforeContent = isNewFile ? '' : readFileSync(file, 'utf8')
    const currentFileHash = isNewFile ? NEW_FILE_HASH : sourceHash(beforeContent)
    if (request.beforeFileHash !== currentFileHash) {
      throw new BridgeProtocolError('HASH_CONFLICT', `expected file hash ${currentFileHash}, received ${request.beforeFileHash}`, 409)
    }
    if (request.content === beforeContent) throw new BridgeProtocolError('INVALID_TRANSACTION', 'source patch does not change the file', 400)
    // Transaction ids may contain characters Windows forbids in file names (':' etc.) -
    // sanitize before embedding them in the staging/backup paths.
    const stagingId = request.transactionId.replace(/[^A-Za-z0-9._-]/g, '-')
    const stagedFile = `${file}.agent-design-${stagingId}.tmp`
    const backupFile = `${file}.agent-design-${stagingId}.bak`
    if (isNewFile) mkdirSync(dirname(file), { recursive: true })
    writeFileSync(stagedFile, request.content, { encoding: 'utf8', flag: 'wx' })
    try {
      const verification = this.verifySource(file, stagedFile, request.content)
      if (!verification.valid) throw new BridgeProtocolError('INVALID_TRANSACTION', `source verification failed: ${verification.checks.join(', ')}`, 400)
      const beforeDocument = structuredClone(this.document)
      const next = reconcileDocumentFromSource(this.document, request.file, request.content, request.at)
      const afterHash = documentHash(next)
      const afterFileHash = sourceHash(request.content)
      const event: TransactionEvent = {
        cursor: this.cursor + 1,
        type: 'transaction-committed',
        transactionId: request.transactionId,
        actor: request.actor,
        revision: next.revision,
        beforeHash: request.beforeHash,
        afterHash,
        operations: [],
        sourcePatch: { file: request.file, beforeFileHash: currentFileHash, afterFileHash },
      }
      const audit: TransactionAuditEntry = {
        transactionId: request.transactionId,
        actor: request.actor,
        kind: 'source-patch',
        revision: next.revision,
        beforeHash: request.beforeHash,
        afterHash,
        exactChanges: exactChanges(beforeDocument, next),
        sourceDiff: unifiedDiff(request.file, beforeContent, request.content),
        sourceFile: request.file,
        verification,
        committedAt: request.at,
      }
      if (isNewFile) {
        renameSync(stagedFile, file)
        this.auditSink(structuredClone(audit))
        this.persist(next, audit)
      } else {
        renameSync(file, backupFile)
        try {
          renameSync(stagedFile, file)
          this.auditSink(structuredClone(audit))
          this.persist(next, audit)
        } catch (error) {
          if (existsSync(file)) rmSync(file, { force: true })
          renameSync(backupFile, file)
          throw error
        }
        rmSync(backupFile, { force: true })
      }
      this.document = next
      this.cursor += 1
      this.transactionIds.add(request.transactionId)
      if (isNewFile) this.allowedSourceFiles.add(file)
      this.committed.push({ kind: 'source-patch', request: structuredClone(request), beforeDocument, beforeContent, afterFileHash })
      this.audits.push(audit)
      this.events.push(event)
      if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents)
      this.emitter.emit('event', structuredClone(event))
      return structuredClone(event)
    } finally {
      if (existsSync(stagedFile)) rmSync(stagedFile, { force: true })
      if (existsSync(backupFile) && existsSync(file)) rmSync(backupFile, { force: true })
    }
  }

  reconcileExternalSource(request: { transactionId: string; file: string; beforeContent: string; content: string; at: string }): TransactionEvent {
    this.assertWritable()
    if (this.transactionIds.has(request.transactionId)) throw new BridgeProtocolError('INVALID_TRANSACTION', `duplicate transaction id: ${request.transactionId}`, 409)
    const file = this.sourceFile(request.file)
    const currentContent = readFileSync(file, 'utf8')
    if (currentContent !== request.content) throw new BridgeProtocolError('HASH_CONFLICT', 'source changed again before watcher reconciliation', 409)
    if (request.beforeContent === request.content) throw new BridgeProtocolError('INVALID_TRANSACTION', 'watcher edit does not change source', 400)
    const verification = this.verifySource(file, file, request.content)
    if (!verification.valid) {
      writeFileSync(file, request.beforeContent, 'utf8')
      throw new BridgeProtocolError('INVALID_TRANSACTION', `source verification failed: ${verification.checks.join(', ')}`, 400)
    }
    const beforeDocument = structuredClone(this.document)
    const beforeHash = documentHash(beforeDocument)
    const next = reconcileDocumentFromSource(this.document, request.file, request.content, request.at)
    const afterHash = documentHash(next)
    const beforeFileHash = sourceHash(request.beforeContent)
    const afterFileHash = sourceHash(request.content)
    const event: TransactionEvent = {
      cursor: this.cursor + 1,
      type: 'transaction-committed',
      transactionId: request.transactionId,
      actor: 'watcher',
      revision: next.revision,
      beforeHash,
      afterHash,
      operations: [],
      sourcePatch: { file: request.file, beforeFileHash, afterFileHash },
    }
    const audit: TransactionAuditEntry = {
      transactionId: request.transactionId,
      actor: 'watcher',
      kind: 'source-patch',
      revision: next.revision,
      beforeHash,
      afterHash,
      exactChanges: exactChanges(beforeDocument, next),
      sourceDiff: unifiedDiff(request.file, request.beforeContent, request.content),
      sourceFile: request.file,
      verification,
      committedAt: request.at,
    }
    try {
      this.auditSink(structuredClone(audit))
      this.persist(next, audit)
    } catch (error) {
      writeFileSync(file, request.beforeContent, 'utf8')
      throw error
    }
    this.document = next
    this.cursor += 1
    this.transactionIds.add(request.transactionId)
    this.committed.push({
      kind: 'source-patch',
      request: {
        transactionId: request.transactionId,
        actor: 'watcher',
        baseRevision: beforeDocument.revision,
        beforeHash,
        file: request.file,
        beforeFileHash,
        content: request.content,
        at: request.at,
      },
      beforeDocument,
      beforeContent: request.beforeContent,
      afterFileHash,
    })
    this.audits.push(audit)
    this.events.push(event)
    if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents)
    this.emitter.emit('event', structuredClone(event))
    return structuredClone(event)
  }

  private undoSourcePatch(target: Extract<UndoRecord, { kind: 'source-patch' }>, request: UndoRequest): TransactionEvent {
    if (this.transactionIds.has(request.id)) throw new BridgeProtocolError('INVALID_TRANSACTION', `duplicate transaction id: ${request.id}`, 409)
    // A materialization patch (RT Step 3) had no file before it - its
    // `beforeFileHash` is the NEW_FILE_HASH sentinel. Undoing it must delete
    // the file it created, not overwrite it with `beforeContent` (which is
    // just '', the empty placeholder used for the initial hash check) - that
    // would leave an empty ghost file on disk instead of restoring the
    // pre-materialization "file does not exist" state.
    const isFileCreation = target.request.beforeFileHash === NEW_FILE_HASH
    const file = this.sourceFile(target.request.file)
    const currentContent = readFileSync(file, 'utf8')
    if (sourceHash(currentContent) !== target.afterFileHash) throw new BridgeProtocolError('HASH_CONFLICT', 'source changed after the transaction; refusing undo', 409)
    const next = structuredClone(this.document)
    next.revision += 1
    next.metadata.updatedAt = request.at
    const afterHash = documentHash(next)
    const restoredFileHash = isFileCreation ? NEW_FILE_HASH : sourceHash(target.beforeContent)
    const audit: TransactionAuditEntry = {
      transactionId: request.id,
      actor: request.actor,
      kind: 'undo',
      revision: next.revision,
      beforeHash: request.beforeHash,
      afterHash,
      exactChanges: exactChanges(this.document, next),
      sourceDiff: unifiedDiff(target.request.file, currentContent, isFileCreation ? '' : target.beforeContent),
      sourceFile: target.request.file,
      verification: { valid: true, checks: ['source-hash-guard'] },
      committedAt: request.at,
    }
    if (isFileCreation) rmSync(file, { force: true })
    else writeFileSync(file, target.beforeContent, 'utf8')
    try {
      this.auditSink(structuredClone(audit))
      this.persist(next, audit)
    } catch (error) {
      writeFileSync(file, currentContent, 'utf8')
      throw error
    }
    const event: TransactionEvent = {
      cursor: ++this.cursor,
      type: 'transaction-committed',
      transactionId: request.id,
      actor: request.actor,
      revision: next.revision,
      beforeHash: request.beforeHash,
      afterHash,
      operations: [],
      sourcePatch: { file: target.request.file, beforeFileHash: target.afterFileHash, afterFileHash: restoredFileHash },
    }
    this.document = next
    this.committed.pop()
    if (isFileCreation) this.allowedSourceFiles.delete(file)
    this.transactionIds.add(request.id)
    this.audits.push(audit)
    this.events.push(event)
    if (this.events.length > this.maxEvents) this.events.splice(0, this.events.length - this.maxEvents)
    this.emitter.emit('event', structuredClone(event))
    return structuredClone(event)
  }

  auditLog(): TransactionAuditEntry[] {
    return structuredClone(this.audits)
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

  private assertWritable(): void {
    if (this.readOnly) throw new BridgeProtocolError('INVALID_TRANSACTION', 'recovered session is read-only', 423)
  }

  private persist(next: CanvasDocument, audit: TransactionAuditEntry): void {
    this.persistenceSink({
      snapshot: createSnapshot(next, this.cursor + 1),
      audits: [...this.audits, structuredClone(audit)],
    })
  }
}

export function sourceHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}
