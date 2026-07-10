import { describe, expect, it } from 'vitest'
import { createDocumentFixture } from './fixtures.js'
import type { CanvasOperation } from './operations.js'
import { canonicalStringify, contentSignature } from './operations.js'
import { loadSnapshot, MemoryDocumentStore, recoverSnapshot, saveSnapshot, serializeSnapshot } from './persistence.js'

const operations: CanvasOperation[] = [
  { id: 'persist-1', at: '2026-07-10T02:00:00.000Z', type: 'update-node', nodeId: 'node-00007', patch: { name: 'Saved Korean canvas' } },
  { id: 'persist-2', at: '2026-07-10T02:00:01.000Z', type: 'select-nodes', nodeIds: ['node-00007'] },
  { id: 'persist-3', at: '2026-07-10T02:00:02.000Z', type: 'set-viewport', pan: { x: -72, y: -24 }, zoom: 1.2 },
]

describe('canvas snapshot persistence', () => {
  it.each([1000, 5000] as const)('recovers a %i-node snapshot and operation history', (size) => {
    const base = createDocumentFixture(size)
    const recovered = recoverSnapshot(serializeSnapshot(base, operations))
    expect(recovered.log).toEqual(operations)
    expect(recovered.past).toHaveLength(operations.length)
    expect(recovered.present.selection).toEqual(['node-00007'])
    expect(recovered.present.viewport.zoom).toBe(1.2)
  })

  it('writes then reads atomically through the store contract', async () => {
    const store = new MemoryDocumentStore()
    const base = createDocumentFixture(1000)
    const bytes = await saveSnapshot(store, 'document', base, operations)
    const recovered = await loadSnapshot(store, 'document')
    expect(bytes).toBeGreaterThan(1000)
    expect(recovered).not.toBeNull()
    expect(canonicalStringify(recovered!.present)).toBe(canonicalStringify(recoverSnapshot(serializeSnapshot(base, operations)).present))
  })

  it('rejects checksum corruption', () => {
    const serialized = serializeSnapshot(createDocumentFixture(1000), operations)
    const envelope = JSON.parse(serialized) as { checksum: string }
    envelope.checksum = '00000000'
    expect(() => recoverSnapshot(JSON.stringify(envelope))).toThrow('checksum mismatch')
  })

  it('rejects unsupported snapshot formats', () => {
    const envelope = JSON.parse(serializeSnapshot(createDocumentFixture(1000), operations)) as { formatVersion: number }
    envelope.formatVersion = 2
    expect(() => recoverSnapshot(JSON.stringify(envelope))).toThrow('unsupported canvas snapshot format')
  })

  it('preserves content through undo after reload', () => {
    const base = createDocumentFixture(1000)
    const recovered = recoverSnapshot(serializeSnapshot(base, operations))
    expect(contentSignature(recovered.past[0])).toBe(contentSignature(base))
  })
})
