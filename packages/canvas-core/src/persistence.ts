import { canonicalStringify, historyFromOperations, type CanvasHistory, type CanvasOperation } from './operations.js'
import type { CanvasDocument } from './types.js'
import { assertValidDocument } from './validation.js'

export interface SnapshotEnvelope {
  format: 'askewly.canvas.snapshot'
  formatVersion: 1
  baseDocument: CanvasDocument
  operations: CanvasOperation[]
  checksum: string
}

export interface DocumentStore {
  read(key: string): Promise<string | null>
  write(key: string, value: string): Promise<void>
}

function checksum(value: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

function snapshotPayload(baseDocument: CanvasDocument, operations: CanvasOperation[]) {
  return canonicalStringify({ baseDocument, operations })
}

export function serializeSnapshot(baseDocument: CanvasDocument, operations: CanvasOperation[]): string {
  assertValidDocument(baseDocument)
  const payload = snapshotPayload(baseDocument, operations)
  const envelope: SnapshotEnvelope = {
    format: 'askewly.canvas.snapshot',
    formatVersion: 1,
    baseDocument: structuredClone(baseDocument),
    operations: structuredClone(operations),
    checksum: checksum(payload),
  }
  return JSON.stringify(envelope)
}

export function recoverSnapshot(serialized: string): CanvasHistory {
  const value = JSON.parse(serialized) as Partial<SnapshotEnvelope>
  if (value.format !== 'askewly.canvas.snapshot' || value.formatVersion !== 1) throw new Error('unsupported canvas snapshot format')
  if (!value.baseDocument || !Array.isArray(value.operations) || !value.checksum) throw new Error('incomplete canvas snapshot')
  const payload = snapshotPayload(value.baseDocument, value.operations)
  if (checksum(payload) !== value.checksum) throw new Error('canvas snapshot checksum mismatch')
  assertValidDocument(value.baseDocument)
  return historyFromOperations(value.baseDocument, value.operations)
}

export async function saveSnapshot(store: DocumentStore, key: string, baseDocument: CanvasDocument, operations: CanvasOperation[]) {
  const serialized = serializeSnapshot(baseDocument, operations)
  await store.write(key, serialized)
  return serialized.length
}

export async function loadSnapshot(store: DocumentStore, key: string): Promise<CanvasHistory | null> {
  const serialized = await store.read(key)
  return serialized === null ? null : recoverSnapshot(serialized)
}

export class MemoryDocumentStore implements DocumentStore {
  #values = new Map<string, string>()

  async read(key: string) { return this.#values.get(key) ?? null }
  async write(key: string, value: string) { this.#values.set(key, value) }
}
