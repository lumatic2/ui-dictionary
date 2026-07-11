import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createDocumentFixture, planInsert, planInsertBounds } from '@askewly/canvas-core'
import { catalog, createRegistryNode, searchRegistry } from '@askewly/component-registry'
import { afterEach, describe, expect, it } from 'vitest'
import { startBridge, type RunningBridge } from './server.js'

const bridges: RunningBridge[] = []
const roots: string[] = []

afterEach(async () => {
  for (const bridge of bridges.splice(0)) await bridge.close()
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

async function bridge(): Promise<RunningBridge> {
  const projectRoot = mkdtempSync(join(tmpdir(), 'agent-design-registry-'))
  roots.push(projectRoot)
  const running = await startBridge({ projectRoot, document: createDocumentFixture(1000), token: 'test-token' })
  bridges.push(running)
  return running
}

describe('registry round-trip over the live bridge', () => {
  it('inserts a searched registry component through the agent channel and undoes it', async () => {
    const running = await bridge()
    const headers = { authorization: 'Bearer test-token', 'content-type': 'application/json' }

    const [button] = searchRegistry(catalog, 'button')
    expect(button).toMatchObject({ id: 'shadcn/button', collection: 'shadcn' })

    const snapshot = running.session.snapshot()
    const bounds = planInsertBounds(snapshot.document, null, button.defaultSize)
    const node = createRegistryNode(snapshot.document, button, null, bounds)
    const batch = planInsert(snapshot.document, node, '2026-07-12T03:30:00.000Z')

    const response = await fetch(`${running.url}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: 'tx-registry', actor: 'claude', baseRevision: snapshot.revision, beforeHash: snapshot.hash, operations: [batch] }),
    })
    expect(response.status).toBe(200)

    const after = running.session.snapshot()
    const inserted = after.document.nodes[node.id]
    expect(inserted).toMatchObject({ kind: 'code-component', name: 'Button', parentId: null })
    expect(inserted.kind === 'code-component' ? inserted.source.file : null).toBe('registry://shadcn/button')
    expect(after.document.selection).toEqual([node.id])
    expect(after.document.rootIds.at(-1)).toBe(node.id)

    const undo = await fetch(`${running.url}/undo`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: 'tx-registry-undo', actor: 'claude', baseRevision: after.revision, beforeHash: after.hash, at: '2026-07-12T03:31:00.000Z' }),
    })
    expect(undo.status).toBe(200)
    expect(running.session.snapshot().document.nodes[node.id]).toBeUndefined()
  })

  it('rejects a stale-revision registry insert without partial mutation', async () => {
    const running = await bridge()
    const headers = { authorization: 'Bearer test-token', 'content-type': 'application/json' }
    const snapshot = running.session.snapshot()
    const [card] = searchRegistry(catalog, 'card')
    const node = createRegistryNode(snapshot.document, card, null, planInsertBounds(snapshot.document, null, card.defaultSize))
    const batch = planInsert(snapshot.document, node, '2026-07-12T03:32:00.000Z')

    const stale = await fetch(`${running.url}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: 'tx-stale', actor: 'codex', baseRevision: snapshot.revision + 5, beforeHash: snapshot.hash, operations: [batch] }),
    })
    expect(stale.status).toBe(409)
    expect(running.session.snapshot().document.nodes[node.id]).toBeUndefined()
    expect(running.session.snapshot().revision).toBe(snapshot.revision)
  })
})
