import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { assertValidDocument } from '../../canvas-core/dist/index.js'
import { startBridge } from '../../../apps/agent-design-bridge/dist/index.js'

const root = path.resolve(import.meta.dirname, '../../..')
const resultsFile = path.join(root, 'apps', 'agent-design', 'results', 'dual-cli-roundtrip.json')
const previousReport = await readFile(resultsFile, 'utf8').then((value) => JSON.parse(value)).catch(() => null)
const projectRoot = await mkdtemp(path.join(tmpdir(), 'agent-design-roundtrip-'))
const adapter = path.resolve(import.meta.dirname, '../dist/cli.js')
const sourceFile = path.join(projectRoot, 'src', 'App.tsx')
const source = (label) => `export default function App() { return <main data-agent-design-id="hero" data-agent-design-name="Hero">${label}</main> }\n`
const createdAt = '2026-07-10T07:00:00.000Z'
const layout = { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] }
const document = assertValidDocument({
  schemaVersion: 1,
  id: 'fresh-react-agent-design',
  name: 'Fresh React Agent Design',
  revision: 0,
  rootIds: ['root'],
  nodes: {
    root: { id: 'root', kind: 'frame', name: 'Root', parentId: null, childIds: ['hero'], bounds: { x: 0, y: 0, width: 1280, height: 720 }, layout, visible: true, locked: false, tokenBindings: {}, source: null, clipContent: true },
    hero: { id: 'hero', kind: 'code-component', name: 'Hero', parentId: 'root', childIds: [], bounds: { x: 80, y: 80, width: 560, height: 320 }, layout, visible: true, locked: false, tokenBindings: {}, source: { file: 'src/App.tsx', exportName: 'App', startLine: 1, endLine: 1 }, props: { label: 'Initial' }, variants: {} },
  },
  selection: ['hero'],
  viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
  tokenSetId: 'askewly.default',
  metadata: { createdAt, updatedAt: createdAt, sourceRoot: '.' },
})
await mkdir(path.dirname(sourceFile), { recursive: true })
await writeFile(path.join(projectRoot, 'package.json'), JSON.stringify({ name: 'fresh-react-agent-design', private: true, scripts: { build: 'vite build' }, dependencies: { '@vitejs/plugin-react': '^6.0.2', react: '^19.2.7', 'react-dom': '^19.2.7', vite: '^8.1.0' } }, null, 2))
await writeFile(sourceFile, source('Initial'))

let bridge = await startBridge({ projectRoot, document, watchSources: true, watcherDebounceMs: 10, verifySource: () => ({ valid: true, checks: ['fresh-react-source'] }) })
const clients = []

function structured(result) {
  return result.structuredContent ?? {}
}

async function actorClient(actor) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [adapter],
    env: { ...process.env, AGENT_DESIGN_BRIDGE_URL: bridge.url, AGENT_DESIGN_SESSION_TOKEN: bridge.session.token, AGENT_DESIGN_ACTOR: actor },
    stderr: 'pipe',
  })
  const client = new Client({ name: `roundtrip-${actor}`, version: '0.1.0' })
  await client.connect(transport)
  clients.push(client)
  return client
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

async function waitForRevision(session, revision) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (session.snapshot().revision >= revision) return
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  throw new Error(`revision ${revision} was not observed`)
}

function configValue(value) {
  return JSON.stringify(value)
}

async function runCommand(command, args, cwd, timeoutMs = 120000) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: process.env, windowsHide: true, shell: false })
    child.stdin?.end()
    let stdout = ''
    let stderr = ''
    const timeout = setTimeout(() => child.kill(), timeoutMs)
    child.stdout?.on('data', (chunk) => { stdout += chunk.toString() })
    child.stderr?.on('data', (chunk) => { stderr += chunk.toString() })
    child.on('error', (error) => { clearTimeout(timeout); resolve({ command, exitCode: -1, stdout, stderr: `${stderr}${error.message}`, timedOut: false }) })
    child.on('close', (exitCode, signal) => { clearTimeout(timeout); resolve({ command, exitCode: exitCode ?? -1, stdout, stderr, timedOut: signal !== null }) })
  })
}

async function liveCliSmoke(name, revision) {
  const prompt = `Call the agent-design get_context MCP tool exactly once. Do not call mutation tools or shell tools. Then reply with the documentId and revision only. Expected revision is ${revision}.`
  if (name === 'codex') {
    const args = ['exec', '--json', '--ephemeral', '--ignore-user-config', '--skip-git-repo-check', '-s', 'read-only', '-C', projectRoot]
    for (const value of [
      'approval_policy="never"',
      `mcp_servers.agent-design.command=${configValue(process.execPath)}`,
      `mcp_servers.agent-design.args=[${configValue(adapter)}]`,
      `mcp_servers.agent-design.env.AGENT_DESIGN_BRIDGE_URL=${configValue(bridge.url)}`,
      `mcp_servers.agent-design.env.AGENT_DESIGN_SESSION_TOKEN=${configValue(bridge.session.token)}`,
      'mcp_servers.agent-design.env.AGENT_DESIGN_ACTOR="codex"',
    ]) args.push('-c', value)
    args.push(prompt)
    const codexScript = process.platform === 'win32'
      ? path.join(process.env.APPDATA, 'npm', 'node_modules', '@openai', 'codex', 'bin', 'codex.js')
      : 'codex'
    return process.platform === 'win32'
      ? runCommand(process.execPath, [codexScript, ...args], projectRoot)
      : runCommand(codexScript, args, projectRoot)
  }
  const configFile = path.join(projectRoot, 'claude-mcp.json')
  await writeFile(configFile, JSON.stringify({ mcpServers: { 'agent-design': { type: 'stdio', command: process.execPath, args: [adapter], env: { AGENT_DESIGN_BRIDGE_URL: bridge.url, AGENT_DESIGN_SESSION_TOKEN: bridge.session.token, AGENT_DESIGN_ACTOR: 'claude' } } } }))
  const claudeCommand = process.platform === 'win32' ? path.join(process.env.USERPROFILE, '.local', 'bin', 'claude.exe') : 'claude'
  return runCommand(claudeCommand, ['-p', '--output-format', 'json', '--strict-mcp-config', '--mcp-config', configFile, '--allowedTools=mcp__agent-design__get_context', '--disallowedTools=Bash,Edit,Write,NotebookEdit', prompt], projectRoot)
}

function summarizeCliSmoke(value, revision) {
  if (!value) return null
  if ('documentIdMatched' in value) return {
    ...value,
    contextEvidenceObserved: Boolean(value.toolCallObserved || (value.exitCode === 0 && value.documentIdMatched && value.revisionMatched)),
  }
  const combined = `${value.stdout ?? ''}\n${value.stderr ?? ''}`
  const documentIdMatched = combined.includes('fresh-react-agent-design')
  const revisionMatched = combined.includes(String(revision))
  return {
    exitCode: value.exitCode,
    timedOut: value.timedOut,
    toolCallObserved: combined.includes('get_context'),
    contextEvidenceObserved: combined.includes('get_context') || (value.exitCode === 0 && documentIdMatched && revisionMatched),
    documentIdMatched,
    revisionMatched,
    error: value.exitCode === 0 ? null : String(value.stderr ?? '').slice(0, 500),
  }
}

const evidence = {}
try {
  const codex = await actorClient('codex')
  const claude = await actorClient('claude')
  const tools = (await codex.listTools()).tools.map((tool) => tool.name).sort()
  const codexContext = structured(await codex.callTool({ name: 'get_context', arguments: {} }))
  const claudeStaleContext = structured(await claude.callTool({ name: 'get_context', arguments: {} }))
  const codexApplied = structured(await codex.callTool({ name: 'apply_operations', arguments: {
    transactionId: 'fresh-codex-layout', baseRevision: codexContext.revision, beforeHash: codexContext.hash,
    operations: [{ id: 'fresh-codex-op', at: new Date().toISOString(), type: 'set-node-property', nodeId: 'hero', scope: 'prop', key: 'label', value: 'Codex layout' }],
  } }))
  const stale = await claude.callTool({ name: 'apply_operations', arguments: {
    transactionId: 'fresh-claude-stale', baseRevision: claudeStaleContext.revision, beforeHash: claudeStaleContext.hash,
    operations: [{ id: 'fresh-claude-stale-op', at: new Date().toISOString(), type: 'set-node-property', nodeId: 'hero', scope: 'prop', key: 'label', value: 'Stale overwrite' }],
  } })
  const claudeContext = structured(await claude.callTool({ name: 'get_context', arguments: {} }))
  const fileContext = claudeContext.sourceFiles.find((item) => item.file === 'src/App.tsx')
  const claudePatched = structured(await claude.callTool({ name: 'apply_source_patch', arguments: {
    transactionId: 'fresh-claude-source', baseRevision: claudeContext.revision, beforeHash: claudeContext.hash,
    beforeFileHash: fileContext.hash, file: 'src/App.tsx', content: source('Claude source'),
  } }))
  const undoContext = structured(await codex.callTool({ name: 'get_context', arguments: {} }))
  const undone = structured(await codex.callTool({ name: 'undo', arguments: { transactionId: 'fresh-codex-undo', baseRevision: undoContext.revision, beforeHash: undoContext.hash } }))
  const beforeCrash = bridge.session.snapshot()
  const port = Number(new URL(bridge.url).port)
  const token = bridge.session.token
  await bridge.close()
  const downResult = await codex.callTool({ name: 'get_context', arguments: {} })
  bridge = await startBridge({ projectRoot, document: beforeCrash.document, port, token, watchSources: true, watcherDebounceMs: 10, verifySource: () => ({ valid: true, checks: ['fresh-react-source'] }) })
  const recoveredContext = structured(await claude.callTool({ name: 'get_context', arguments: {} }))
  await writeFile(sourceFile, source('Watcher recovery'))
  await waitForRevision(bridge.session, beforeCrash.revision + 1)
  const finalContext = structured(await codex.callTool({ name: 'get_context', arguments: {} }))
  const finalSource = await readFile(sourceFile, 'utf8')
  const liveSmokeEnabled = process.env.AGENT_DESIGN_LIVE_CLI_SMOKE === '1'
  const liveActors = new Set((process.env.AGENT_DESIGN_LIVE_CLI_ACTORS ?? 'codex,claude').split(',').map((value) => value.trim()))
  const actualCli = liveSmokeEnabled ? {
    codex: summarizeCliSmoke(liveActors.has('codex') ? await liveCliSmoke('codex', finalContext.revision) : previousReport?.actualCli?.codex, finalContext.revision),
    claude: summarizeCliSmoke(liveActors.has('claude') ? await liveCliSmoke('claude', finalContext.revision) : previousReport?.actualCli?.claude, finalContext.revision),
  } : { skipped: true }
  evidence.tools = tools
  evidence.codexApplied = {
    transactionId: codexApplied.event.transactionId,
    actor: codexApplied.event.actor,
    revision: codexApplied.event.revision,
    label: codexApplied.snapshot.document.nodes.hero.props.label,
  }
  evidence.staleConflict = { isError: stale.isError, code: JSON.stringify(stale.content).includes('REVISION_CONFLICT') ? 'REVISION_CONFLICT' : 'UNKNOWN' }
  evidence.claudePatched = {
    transactionId: claudePatched.event.transactionId,
    actor: claudePatched.event.actor,
    revision: claudePatched.event.revision,
    sourceFile: claudePatched.event.sourcePatch.file,
    label: claudePatched.snapshot.document.nodes.hero.props.label,
    exactChanges: claudePatched.audit.exactChanges.length,
  }
  evidence.undo = {
    transactionId: undone.event.transactionId,
    actor: undone.event.actor,
    revision: undone.event.revision,
    sourceFile: undone.event.sourcePatch.file,
  }
  evidence.crashRecovery = { downIsError: downResult.isError, beforeRevision: beforeCrash.revision, recoveredRevision: recoveredContext.revision }
  evidence.final = {
    revision: finalContext.revision,
    hash: finalContext.hash,
    sourceHash: sha256(finalSource),
    contextSourceHash: finalContext.sourceFiles.find((item) => item.file === 'src/App.tsx')?.hash,
    label: bridge.session.snapshot().document.nodes.hero.props.label,
    sourceContains: finalSource.includes('Watcher recovery'),
  }
  evidence.actualCli = actualCli
  evidence.auditEntriesAfterRestart = bridge.session.auditLog().length
} finally {
  for (const client of clients) await client.close().catch(() => undefined)
  await bridge.close().catch(() => undefined)
  await mkdir(path.dirname(resultsFile), { recursive: true })
  await writeFile(resultsFile, `${JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), ...evidence }, null, 2)}\n`)
  await rm(projectRoot, { recursive: true, force: true })
}
console.log(JSON.stringify(evidence, null, 2))
