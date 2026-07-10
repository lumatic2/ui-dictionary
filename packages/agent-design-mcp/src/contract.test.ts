import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { afterEach, describe, expect, it } from 'vitest'

const closers: Array<() => Promise<void>> = []

afterEach(async () => {
  for (const close of closers.splice(0)) await close()
})

async function mockBridge() {
  let revision = 0
  let hash = 'hash-0'
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(Buffer.from(chunk))
    const input = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) as Record<string, unknown> : {}
    let body: Record<string, unknown>
    if (request.url === '/context') body = { documentId: 'fixture', revision, hash, selection: ['node-1'], selectedNodes: [], sourceRoot: '.' }
    else if (request.url === '/transactions') {
      revision += 1
      hash = `hash-${revision}`
      body = { event: { transactionId: input.id, actor: input.actor, revision }, snapshot: { revision, hash } }
    } else if (request.url === '/source-patches') {
      revision += 1
      hash = `hash-${revision}`
      body = { event: { transactionId: input.transactionId, actor: input.actor, revision, sourcePatch: { file: input.file, beforeFileHash: input.beforeFileHash } }, snapshot: { revision, hash } }
    } else if (request.url === '/verify') body = { valid: input.revision === revision && input.hash === hash, revision, hash }
    else if (request.url === '/undo') {
      revision += 1
      hash = `hash-${revision}`
      body = { event: { transactionId: input.id, actor: input.actor, revision }, snapshot: { revision, hash } }
    } else {
      response.writeHead(501, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ error: { code: 'NOT_IMPLEMENTED', message: 'source patch pending' } }))
      return
    }
    response.writeHead(200, { 'content-type': 'application/json' })
    response.end(JSON.stringify(body))
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  closers.push(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())))
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}

describe('Agent Design MCP stdio contract', () => {
  it.each(['codex', 'claude'] as const)('serves the same five tools and roundtrip semantics for %s', async (actor) => {
    const url = await mockBridge()
    const cli = fileURLToPath(new URL('../dist/cli.js', import.meta.url))
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [cli],
      env: { ...process.env, AGENT_DESIGN_BRIDGE_URL: url, AGENT_DESIGN_SESSION_TOKEN: 'test', AGENT_DESIGN_ACTOR: actor },
      stderr: 'pipe',
    })
    const client = new Client({ name: `test-${actor}`, version: '0.1.0' })
    await client.connect(transport)
    const tools = await client.listTools()
    expect(tools.tools.map((tool) => tool.name).sort()).toEqual(['apply_operations', 'apply_source_patch', 'get_context', 'undo', 'verify'])
    const context = await client.callTool({ name: 'get_context', arguments: {} })
    expect(context.structuredContent).toMatchObject({ revision: 0, hash: 'hash-0' })
    const applied = await client.callTool({ name: 'apply_operations', arguments: {
      transactionId: `tx-${actor}`,
      baseRevision: 0,
      beforeHash: 'hash-0',
      operations: [{ id: 'op-1', at: '2026-07-10T05:00:00.000Z', type: 'select-nodes', nodeIds: [] }],
    } })
    expect(applied.structuredContent).toMatchObject({ event: { actor, revision: 1 }, snapshot: { hash: 'hash-1' } })
    const verified = await client.callTool({ name: 'verify', arguments: { revision: 1, hash: 'hash-1' } })
    expect(verified.structuredContent).toMatchObject({ valid: true })
    const patched = await client.callTool({ name: 'apply_source_patch', arguments: {
      transactionId: `patch-${actor}`,
      baseRevision: 1,
      beforeHash: 'hash-1',
      beforeFileHash: 'file-hash-0',
      file: 'src/App.tsx',
      content: 'export default function App() {}\n',
    } })
    expect(patched.structuredContent).toMatchObject({ event: { actor, revision: 2, sourcePatch: { file: 'src/App.tsx', beforeFileHash: 'file-hash-0' } } })
    const undone = await client.callTool({ name: 'undo', arguments: { transactionId: `undo-${actor}`, baseRevision: 2, beforeHash: 'hash-2' } })
    expect(undone.structuredContent).toMatchObject({ event: { actor, revision: 3 } })
    await client.close()
  })
})
