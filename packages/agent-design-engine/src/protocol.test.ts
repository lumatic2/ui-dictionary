import { createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { describe, expect, it } from 'vitest'
import {
  applyTransaction,
  createSnapshot,
  documentHash,
  projectContext,
  type TransactionEnvelope,
} from './protocol.js'

function transaction(overrides: Partial<TransactionEnvelope> = {}): TransactionEnvelope {
  const document = createDocumentFixture(1000)
  const node = firstComponent(document)
  return {
    id: 'tx-1',
    actor: 'codex',
    baseRevision: document.revision,
    beforeHash: documentHash(document),
    operations: [{ id: 'op-1', at: '2026-07-10T01:00:00.000Z', type: 'update-node', nodeId: node.id, patch: { name: 'Agent card' } }],
    ...overrides,
  }
}

describe('agent design engine protocol', () => {
  it('projects selected context without sharing mutable document state', () => {
    const document = createDocumentFixture(1000)
    const context = projectContext(document)
    expect(context.revision).toBe(0)
    expect(context.selection).toEqual(document.selection)
    expect(context.hash).toBe(documentHash(document))
    context.selection.length = 0
    expect(document.selection).toHaveLength(1)
  })

  it('applies a revision and hash guarded operation batch', () => {
    const document = createDocumentFixture(1000)
    const input = transaction()
    const next = applyTransaction(document, input)
    const nodeId = (input.operations[0] as { nodeId: string }).nodeId
    expect(next.nodes[nodeId]?.name).toBe('Agent card')
    expect(next.revision).toBe(1)
    expect(document.nodes[nodeId]?.name).not.toBe('Agent card')
    expect(createSnapshot(next, 1).cursor).toBe(1)
  })

  const invalidCases: Array<[string, Partial<TransactionEnvelope>]> = [
    ['REVISION_CONFLICT', { baseRevision: 99 }],
    ['HASH_CONFLICT', { beforeHash: 'stale' }],
    ['INVALID_TRANSACTION', { operations: [] }],
  ]

  it.each(invalidCases)('rejects %s before mutation', (code, overrides) => {
    const document = createDocumentFixture(1000)
    expect(() => applyTransaction(document, transaction(overrides))).toThrowError(expect.objectContaining({ code }))
    expect(document.revision).toBe(0)
  })
})
