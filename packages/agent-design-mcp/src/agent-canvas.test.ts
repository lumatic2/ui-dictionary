import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'

const closers: Array<() => Promise<void>> = []

afterEach(async () => {
  for (const close of closers.splice(0)) await close()
})

const EXPECTED_TOKEN = 'expected-token'

async function mockBridge(): Promise<string> {
  let revision = 0
  let hash = 'hash-0'
  const server = createServer(async (request, response) => {
    const auth = request.headers.authorization
    if (auth !== `Bearer ${EXPECTED_TOKEN}`) {
      response.writeHead(401, { 'content-type': 'application/json' })
      response.end(JSON.stringify({ error: { code: 'AUTH_REQUIRED', message: 'valid session token required' } }))
      return
    }
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(Buffer.from(chunk))
    const input = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) as Record<string, unknown> : {}
    let body: Record<string, unknown>
    let status = 200
    if (request.url === '/context') {
      body = { documentId: 'fixture', revision, hash, selection: [], selectedNodes: [], sourceRoot: '.', sourceFiles: [] }
    } else if (request.url === '/snapshot') {
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
    } else if (request.url === '/transactions') {
      if (input.baseRevision !== revision) {
        status = 409
        body = { error: { code: 'REVISION_CONFLICT', message: `expected revision ${revision}, received ${input.baseRevision}` } }
      } else {
        revision += 1
        hash = `hash-${revision}`
        body = { event: { transactionId: input.id, actor: input.actor, revision }, snapshot: { revision, hash } }
      }
    } else if (request.url === '/undo') {
      revision += 1
      hash = `hash-${revision}`
      body = { event: { transactionId: input.id, actor: input.actor, revision }, snapshot: { revision, hash } }
    } else if (request.url === '/verify') {
      const valid = input.revision === revision && input.hash === hash
      status = valid ? 200 : 409
      body = { valid, revision, hash }
    } else {
      status = 404
      body = { error: { code: 'NOT_FOUND', message: 'route not found' } }
    }
    response.writeHead(status, { 'content-type': 'application/json' })
    response.end(JSON.stringify(body))
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  closers.push(() => new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))))
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}

interface CliResult {
  code: number | null
  stdout: string
  stderr: string
}

async function runCli(args: string[], env: Record<string, string>, stdin?: string): Promise<CliResult> {
  const bin = fileURLToPath(new URL('../dist/agent-canvas.js', import.meta.url))
  return new Promise<CliResult>((resolve, reject) => {
    const child = spawn(process.execPath, [bin, ...args], { env: { ...process.env, ...env } })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => { stdout += String(chunk) })
    child.stderr.on('data', (chunk) => { stderr += String(chunk) })
    child.on('error', reject)
    child.on('close', (code) => resolve({ code, stdout, stderr }))
    if (stdin !== undefined) child.stdin.write(stdin)
    child.stdin.end()
  })
}

function baseEnv(url: string, token = EXPECTED_TOKEN): Record<string, string> {
  return { AGENT_DESIGN_BRIDGE_URL: url, AGENT_DESIGN_SESSION_TOKEN: token, AGENT_DESIGN_ACTOR: 'claude' }
}

describe('agent-canvas CLI', () => {
  it('context: prints JSON context on stdout with exit 0', async () => {
    const url = await mockBridge()
    const result = await runCli(['context'], baseEnv(url))
    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout)).toMatchObject({ documentId: 'fixture', revision: 0, hash: 'hash-0' })
    expect(result.stderr).toBe('')
  })

  it('apply: reads operations JSON from stdin and applies them', async () => {
    const url = await mockBridge()
    const payload = JSON.stringify({
      transactionId: 'tx-1',
      baseRevision: 0,
      beforeHash: 'hash-0',
      operations: [{ id: 'op-1', at: '2026-07-12T00:00:00.000Z', type: 'select-nodes', nodeIds: [] }],
    })
    const result = await runCli(['apply'], baseEnv(url), payload)
    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout)).toMatchObject({ event: { transactionId: 'tx-1', revision: 1 } })
  })

  it('apply: reads operations JSON from --file', async () => {
    const url = await mockBridge()
    const { writeFile, mkdtemp } = await import('node:fs/promises')
    const { tmpdir } = await import('node:os')
    const { join } = await import('node:path')
    const dir = await mkdtemp(join(tmpdir(), 'agent-canvas-'))
    const file = join(dir, 'op.json')
    await writeFile(file, JSON.stringify({
      transactionId: 'tx-file',
      baseRevision: 0,
      beforeHash: 'hash-0',
      operations: [{ id: 'op-1', at: '2026-07-12T00:00:00.000Z', type: 'select-nodes', nodeIds: [] }],
    }), 'utf8')
    const result = await runCli(['apply', '--file', file], baseEnv(url))
    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout)).toMatchObject({ event: { transactionId: 'tx-file', revision: 1 } })
  })

  it('undo: applies an undo request', async () => {
    const url = await mockBridge()
    const payload = JSON.stringify({ transactionId: 'undo-1', baseRevision: 0, beforeHash: 'hash-0' })
    const result = await runCli(['undo'], baseEnv(url), payload)
    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout)).toMatchObject({ event: { transactionId: 'undo-1', revision: 1 } })
  })

  it('verify: verifies current revision/hash', async () => {
    const url = await mockBridge()
    const payload = JSON.stringify({ revision: 0, hash: 'hash-0' })
    const result = await runCli(['verify'], baseEnv(url), payload)
    expect(result.code).toBe(0)
    expect(JSON.parse(result.stdout)).toMatchObject({ valid: true })
  })

  it('components: prints the curated catalog plus project-derived entries on stdout with exit 0', async () => {
    const url = await mockBridge()
    const result = await runCli(['components'], baseEnv(url))
    expect(result.code).toBe(0)
    const { components } = JSON.parse(result.stdout) as { components: Array<Record<string, unknown>> }
    const staticEntries = components.filter((entry) => entry.collection !== 'project')
    expect(staticEntries.length).toBeGreaterThanOrEqual(16)
    expect(components.some((entry) => entry.collection === 'project' && entry.name === 'CustomWidget')).toBe(true)
    expect(result.stderr).toBe('')
  })

  it('components: --query narrows the results', async () => {
    const url = await mockBridge()
    const result = await runCli(['components', '--query', 'button'], baseEnv(url))
    expect(result.code).toBe(0)
    const { components } = JSON.parse(result.stdout) as { components: Array<Record<string, unknown>> }
    expect(components.length).toBeGreaterThan(0)
    expect(components.every((entry) => (entry.keywords as string[] ?? []).join(' ').toLowerCase().includes('button')
      || String(entry.name).toLowerCase().includes('button')
      || String(entry.category).toLowerCase().includes('button')
      || String(entry.collection).toLowerCase().includes('button'))).toBe(true)
  })

  it('components: connection refused exits with the connection failure code', async () => {
    const probe = createServer()
    await new Promise<void>((resolve) => probe.listen(0, '127.0.0.1', resolve))
    const port = (probe.address() as AddressInfo).port
    await new Promise<void>((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())))
    const result = await runCli(['components'], baseEnv(`http://127.0.0.1:${port}`))
    expect(result.code).toBe(4)
    expect(JSON.parse(result.stderr)).toMatchObject({ error: { code: 'CONNECTION_FAILED' } })
  })

  it('bad token: exits with the auth failure code', async () => {
    const url = await mockBridge()
    const result = await runCli(['context'], baseEnv(url, 'wrong-token'))
    expect(result.code).toBe(2)
    expect(result.stdout).toBe('')
    expect(JSON.parse(result.stderr)).toMatchObject({ error: { code: 'AUTH_REQUIRED' } })
  })

  it('revision conflict: exits with the conflict code', async () => {
    const url = await mockBridge()
    const payload = JSON.stringify({
      transactionId: 'tx-conflict',
      baseRevision: 99,
      beforeHash: 'hash-0',
      operations: [{ id: 'op-1', at: '2026-07-12T00:00:00.000Z', type: 'select-nodes', nodeIds: [] }],
    })
    const result = await runCli(['apply'], baseEnv(url), payload)
    expect(result.code).toBe(3)
    expect(JSON.parse(result.stderr)).toMatchObject({ error: { code: 'REVISION_CONFLICT' } })
  })

  it('connection refused: exits with the connection failure code', async () => {
    // Nothing listens on this port after we close the probe server.
    const probe = createServer()
    await new Promise<void>((resolve) => probe.listen(0, '127.0.0.1', resolve))
    const port = (probe.address() as AddressInfo).port
    await new Promise<void>((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())))
    const result = await runCli(['context'], baseEnv(`http://127.0.0.1:${port}`))
    expect(result.code).toBe(4)
    expect(JSON.parse(result.stderr)).toMatchObject({ error: { code: 'CONNECTION_FAILED' } })
  })

  it('unknown subcommand: exits with the usage code', async () => {
    const url = await mockBridge()
    const result = await runCli(['bogus'], baseEnv(url))
    expect(result.code).toBe(1)
    expect(JSON.parse(result.stderr)).toMatchObject({ error: { code: 'USAGE' } })
  })

  it('never logs the session token', async () => {
    const url = await mockBridge()
    const result = await runCli(['context'], baseEnv(url, 'wrong-token'))
    expect(result.stdout).not.toContain('wrong-token')
    expect(result.stderr).not.toContain('wrong-token')
  })
})
