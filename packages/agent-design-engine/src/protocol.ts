import { createHash } from 'node:crypto'
import {
  canonicalStringify,
  replayOperations,
  type CanvasDocument,
  type CanvasOperation,
  type NodeId,
} from '@askewly/canvas-core'

export type AgentActor = 'codex' | 'claude' | 'human' | 'watcher'

export interface TransactionEnvelope {
  id: string
  actor: AgentActor
  baseRevision: number
  beforeHash: string
  operations: CanvasOperation[]
}

export interface TransactionEvent {
  cursor: number
  type: 'transaction-committed'
  transactionId: string
  actor: AgentActor
  revision: number
  beforeHash: string
  afterHash: string
  operations: CanvasOperation[]
}

export interface CanvasSnapshot {
  document: CanvasDocument
  revision: number
  hash: string
  cursor: number
}

export interface AgentContext {
  documentId: string
  documentName: string
  revision: number
  hash: string
  selection: NodeId[]
  selectedNodes: CanvasDocument['nodes'][NodeId][]
  sourceRoot: string
}

export type ReplayResult =
  | { mode: 'events'; events: TransactionEvent[]; cursor: number }
  | { mode: 'snapshot'; snapshot: CanvasSnapshot; reason: 'cursor-gap' }

export type BridgeErrorCode =
  | 'AUTH_REQUIRED'
  | 'LOOPBACK_REQUIRED'
  | 'PROJECT_SCOPE_VIOLATION'
  | 'INVALID_TRANSACTION'
  | 'REVISION_CONFLICT'
  | 'HASH_CONFLICT'

export class BridgeProtocolError extends Error {
  constructor(
    public readonly code: BridgeErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'BridgeProtocolError'
  }
}

export function documentHash(document: CanvasDocument): string {
  return createHash('sha256').update(canonicalStringify(document)).digest('hex')
}

export function createSnapshot(document: CanvasDocument, cursor: number): CanvasSnapshot {
  const copy = structuredClone(document)
  return { document: copy, revision: copy.revision, hash: documentHash(copy), cursor }
}

export function projectContext(document: CanvasDocument): AgentContext {
  return {
    documentId: document.id,
    documentName: document.name,
    revision: document.revision,
    hash: documentHash(document),
    selection: [...document.selection],
    selectedNodes: document.selection.map((id) => structuredClone(document.nodes[id])).filter(Boolean),
    sourceRoot: document.metadata.sourceRoot,
  }
}

export function applyTransaction(document: CanvasDocument, transaction: TransactionEnvelope): CanvasDocument {
  if (!transaction.id.trim()) throw new BridgeProtocolError('INVALID_TRANSACTION', 'transaction id is required', 400)
  if (!transaction.operations.length) throw new BridgeProtocolError('INVALID_TRANSACTION', 'transaction requires at least one operation', 400)
  if (transaction.baseRevision !== document.revision) {
    throw new BridgeProtocolError(
      'REVISION_CONFLICT',
      `expected revision ${document.revision}, received ${transaction.baseRevision}`,
      409,
    )
  }
  const currentHash = documentHash(document)
  if (transaction.beforeHash !== currentHash) {
    throw new BridgeProtocolError('HASH_CONFLICT', `expected hash ${currentHash}, received ${transaction.beforeHash}`, 409)
  }
  try {
    return replayOperations(document, transaction.operations)
  } catch (error) {
    throw new BridgeProtocolError(
      'INVALID_TRANSACTION',
      error instanceof Error ? error.message : 'invalid transaction',
      400,
    )
  }
}
