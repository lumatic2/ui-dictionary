import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createDocumentFixture, firstComponent } from '@askewly/canvas-core'
import { documentHash, type TransactionEnvelope } from '@askewly/agent-design-engine'
import WebSocket from 'ws'
import { afterEach, describe, expect, it } from 'vitest'
import { startBridge, type RunningBridge } from './server.js'

const bridges: RunningBridge[] = []
const roots: string[] = []

afterEach(async () => {
  for (const bridge of bridges.splice(0)) await bridge.close()
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

async function bridge(): Promise<RunningBridge> {
  const projectRoot = mkdtempSync(join(tmpdir(), 'agent-design-server-'))
  roots.push(projectRoot)
  const running = await startBridge({ projectRoot, document: createDocumentFixture(1000), token: 'test-token' })
  bridges.push(running)
  return running
}

function nextMessage(socket: WebSocket): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    socket.once('message', (data) => resolve(JSON.parse(data.toString()) as Record<string, unknown>))
    socket.once('error', reject)
  })
}

describe('loopback bridge server', () => {
  it('protects snapshots and atomically accepts guarded transactions', async () => {
    const running = await bridge()
    expect((await fetch(`${running.url}/snapshot`)).status).toBe(401)
    const snapshotResponse = await fetch(`${running.url}/snapshot`, { headers: { authorization: 'Bearer test-token' } })
    const snapshot = (await snapshotResponse.json()) as ReturnType<RunningBridge['session']['snapshot']>
    const input: TransactionEnvelope = {
      id: 'tx-http',
      actor: 'claude',
      baseRevision: snapshot.revision,
      beforeHash: snapshot.hash,
      operations: [{ id: 'op-http', at: '2026-07-10T03:00:00.000Z', type: 'update-node', nodeId: firstComponent(snapshot.document).id, patch: { name: 'Live card' } }],
    }
    const response = await fetch(`${running.url}/transactions`, {
      method: 'POST',
      headers: { authorization: 'Bearer test-token', 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
    expect(response.status).toBe(200)
    expect(running.session.snapshot()).toMatchObject({ revision: 1, cursor: 1 })
    expect(documentHash(running.session.snapshot().document)).not.toBe(snapshot.hash)
  })

  it('replays event cursors and broadcasts new commits over WebSocket', async () => {
    const running = await bridge()
    const socket = new WebSocket(`${running.wsUrl}/events?token=test-token&cursor=0`)
    expect(await nextMessage(socket)).toMatchObject({ type: 'replay', payload: { mode: 'events', cursor: 0 } })
    const snapshot = running.session.snapshot()
    const eventMessage = nextMessage(socket)
    running.session.commit({
      id: 'tx-ws',
      actor: 'codex',
      baseRevision: snapshot.revision,
      beforeHash: snapshot.hash,
      operations: [{ id: 'op-ws', at: '2026-07-10T04:00:00.000Z', type: 'update-node', nodeId: firstComponent(snapshot.document).id, patch: { name: 'Broadcast' } }],
    })
    expect(await eventMessage).toMatchObject({ type: 'event', event: { cursor: 1, transactionId: 'tx-ws' } })
    socket.close()

    const reconnect = new WebSocket(`${running.wsUrl}/events?token=test-token&cursor=0`)
    expect(await nextMessage(reconnect)).toMatchObject({ type: 'replay', payload: { mode: 'events', events: [{ transactionId: 'tx-ws' }] } })
    reconnect.close()
  })

  it('serves context, verification, and guarded undo endpoints', async () => {
    const running = await bridge()
    const headers = { authorization: 'Bearer test-token', 'content-type': 'application/json' }
    const context = (await (await fetch(`${running.url}/context`, { headers })).json()) as { documentId: string; revision: number }
    expect(context).toMatchObject({ documentId: 'agent-design-fixture-1000', revision: 0 })
    const snapshot = running.session.snapshot()
    running.session.commit({
      id: 'tx-before-undo',
      actor: 'codex',
      baseRevision: snapshot.revision,
      beforeHash: snapshot.hash,
      operations: [{ id: 'op-before-undo', at: '2026-07-10T04:10:00.000Z', type: 'update-node', nodeId: firstComponent(snapshot.document).id, patch: { name: 'Undo me' } }],
    })
    const changed = running.session.snapshot()
    const verify = await fetch(`${running.url}/verify`, { method: 'POST', headers, body: JSON.stringify({ revision: changed.revision, hash: changed.hash }) })
    expect(verify.status).toBe(200)
    const undo = await fetch(`${running.url}/undo`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: 'tx-http-undo', actor: 'claude', baseRevision: changed.revision, beforeHash: changed.hash, at: '2026-07-10T04:11:00.000Z' }),
    })
    expect(undo.status).toBe(200)
    expect(running.session.snapshot().document.nodes[firstComponent(snapshot.document).id]?.name).toBe(firstComponent(snapshot.document).name)
  })

  it('allows browser preflight only from loopback origins', async () => {
    const running = await bridge()
    const local = await fetch(`${running.url}/snapshot`, { method: 'OPTIONS', headers: { origin: 'http://127.0.0.1:4183' } })
    expect(local.status).toBe(204)
    expect(local.headers.get('access-control-allow-origin')).toBe('http://127.0.0.1:4183')
    const foreign = await fetch(`${running.url}/snapshot`, { method: 'OPTIONS', headers: { origin: 'https://example.com' } })
    expect(foreign.status).toBe(403)
    expect(foreign.headers.get('access-control-allow-origin')).toBeNull()
  })
})
