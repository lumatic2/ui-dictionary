import { createHash } from 'node:crypto'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import type { Duplex } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { afterEach, describe, expect, it } from 'vitest'

const closers: Array<() => Promise<void>> = []

afterEach(async () => {
  for (const close of closers.splice(0)) await close()
})

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

function encodeTextFrame(payload: string): Buffer {
  const data = Buffer.from(payload, 'utf8')
  const header = data.length < 126 ? Buffer.from([0x81, data.length]) : Buffer.alloc(4)
  if (data.length >= 126) {
    header[0] = 0x81
    header[1] = 126
    header.writeUInt16BE(data.length, 2)
  }
  return Buffer.concat([header, data])
}

interface MockBridge {
  url: string
  contextHits: () => number
  /** Pushes a live /events frame to every connected WS client, mirroring the real bridge's `{type:'event', event, snapshot}` push. */
  pushEvent: (event: Record<string, unknown>, snapshot: Record<string, unknown>) => void
}

async function mockBridge(): Promise<MockBridge> {
  let revision = 0
  let hash = 'hash-0'
  let contextHits = 0
  const sockets = new Set<Duplex>()
  const server = createServer(async (request, response) => {
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(Buffer.from(chunk))
    const input = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) as Record<string, unknown> : {}
    let body: Record<string, unknown>
    if (request.url?.startsWith('/context')) {
      contextHits += 1
      body = { documentId: 'fixture', revision, hash, selection: ['node-1'], selectedNodes: [], sourceRoot: '.', sourceFiles: [] }
    }
    else if (request.url?.startsWith('/snapshot')) {
      body = {
        document: {
          id: 'fixture',
          name: 'Fixture',
          revision,
          selection: [],
          nodes: {
            'proj-1': {
              id: 'proj-1',
              kind: 'code-component',
              name: 'CustomWidget',
              parentId: null,
              childIds: [],
              bounds: { x: 0, y: 0, width: 200, height: 80 },
              layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
              visible: true,
              locked: false,
              tokenBindings: {},
              source: { file: 'src/CustomWidget.tsx', exportName: 'CustomWidget', startLine: 1, endLine: 10 },
              props: {},
              variants: {},
            },
          },
          metadata: { sourceRoot: '.' },
        },
        revision,
        hash,
      }
    }
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
  server.on('upgrade', (request, socket) => {
    const key = request.headers['sec-websocket-key']
    if (typeof key !== 'string') { socket.destroy(); return }
    const accept = createHash('sha1').update(key + WS_GUID).digest('base64')
    socket.write(
      'HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
      + `Sec-WebSocket-Accept: ${accept}\r\n\r\n`,
    )
    socket.write(encodeTextFrame(JSON.stringify({ type: 'replay', payload: { mode: 'events', events: [], cursor: 0 } })))
    sockets.add(socket)
    socket.on('close', () => sockets.delete(socket))
    socket.on('error', () => sockets.delete(socket))
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  closers.push(() => new Promise<void>((resolve, reject) => {
    for (const socket of sockets) socket.destroy()
    server.close((error) => error ? reject(error) : resolve())
  }))
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  return {
    url,
    contextHits: () => contextHits,
    pushEvent: (event, snapshot) => {
      const frame = encodeTextFrame(JSON.stringify({ type: 'event', event, snapshot }))
      for (const socket of sockets) socket.write(frame)
    },
  }
}

describe('AskewlyDesign MCP stdio contract', () => {
  it.each(['codex', 'claude'] as const)('serves the same six tools and roundtrip semantics for %s', async (actor) => {
    const { url } = await mockBridge()
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
    expect(tools.tools.map((tool) => tool.name).sort()).toEqual(['apply_operations', 'apply_source_patch', 'get_context', 'list_components', 'undo', 'verify'])
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

  it('reflects a live /events push in get_context without an extra REST round trip', async () => {
    const { url, contextHits, pushEvent } = await mockBridge()
    const cli = fileURLToPath(new URL('../dist/cli.js', import.meta.url))
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [cli],
      env: { ...process.env, AGENT_DESIGN_BRIDGE_URL: url, AGENT_DESIGN_SESSION_TOKEN: 'test', AGENT_DESIGN_ACTOR: 'claude' },
      stderr: 'pipe',
    })
    const client = new Client({ name: 'test-live', version: '0.1.0' })
    await client.connect(transport)

    // Give the server's internal WS subscription time to open and seed once via REST.
    await new Promise((resolve) => setTimeout(resolve, 300))
    const hitsAfterSeed = contextHits()
    expect(hitsAfterSeed).toBeGreaterThanOrEqual(1)

    pushEvent(
      { cursor: 1, actor: 'codex', transactionId: 'tx-live-1', revision: 7 },
      { document: { id: 'fixture', name: 'Fixture', revision: 7, selection: ['node-live'], nodes: { 'node-live': { id: 'node-live', kind: 'frame' } }, metadata: { sourceRoot: '.' } }, revision: 7, hash: 'hash-live-7' },
    )
    await new Promise((resolve) => setTimeout(resolve, 200))

    const context = await client.callTool({ name: 'get_context', arguments: {} })
    expect(context.structuredContent).toMatchObject({ revision: 7, hash: 'hash-live-7', selection: ['node-live'] })
    // The live push, not another REST call, should have produced this value.
    expect(contextHits()).toBe(hitsAfterSeed)

    await client.close()
  })

  it('list_components returns the curated catalog plus project-derived entries, and honors search', async () => {
    const { url } = await mockBridge()
    const cli = fileURLToPath(new URL('../dist/cli.js', import.meta.url))
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [cli],
      env: { ...process.env, AGENT_DESIGN_BRIDGE_URL: url, AGENT_DESIGN_SESSION_TOKEN: 'test', AGENT_DESIGN_ACTOR: 'claude' },
      stderr: 'pipe',
    })
    const client = new Client({ name: 'test-list-components', version: '0.1.0' })
    await client.connect(transport)

    const all = await client.callTool({ name: 'list_components', arguments: {} })
    const components = (all.structuredContent as { components: Array<Record<string, unknown>> }).components
    const staticEntries = components.filter((entry) => entry.collection !== 'project')
    expect(staticEntries.length).toBeGreaterThanOrEqual(16)
    const projectEntry = components.find((entry) => entry.collection === 'project' && entry.name === 'CustomWidget')
    expect(projectEntry).toBeDefined()

    const filtered = await client.callTool({ name: 'list_components', arguments: { query: 'button' } })
    const filteredComponents = (filtered.structuredContent as { components: Array<Record<string, unknown>> }).components
    expect(filteredComponents.length).toBeGreaterThan(0)
    expect(filteredComponents.length).toBeLessThan(components.length)
    expect(filteredComponents.some((entry) => entry.name === 'Button')).toBe(true)

    await client.close()
  })
})
