const { app } = require('electron')
const { mkdtempSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')

const root = mkdtempSync(path.join(tmpdir(), 'agent-design-supervisor-'))
app.setPath('userData', path.join(root, 'user-data'))

const document = {
  schemaVersion: 1,
  id: 'desktop-supervisor-smoke',
  name: 'Desktop supervisor smoke',
  revision: 0,
  rootIds: ['root'],
  nodes: {
    root: {
      id: 'root',
      kind: 'frame',
      name: 'Root',
      parentId: null,
      childIds: [],
      bounds: { x: 0, y: 0, width: 800, height: 600 },
      layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] },
      visible: true,
      locked: false,
      tokenBindings: {},
      source: null,
      clipContent: true,
    },
  },
  selection: ['root'],
  viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
  tokenSetId: 'askewly.default',
  metadata: { createdAt: '2026-07-11T00:00:00.000Z', updatedAt: '2026-07-11T00:00:00.000Z', sourceRoot: '.' },
}

function waitForState(supervisor, target, timeoutMs = 10000) {
  if (supervisor.status().state === target) return Promise.resolve(supervisor.status())
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { unsubscribe(); reject(new Error(`timed out waiting for ${target}`)) }, timeoutMs)
    const unsubscribe = supervisor.subscribe((status) => {
      if (status.state === 'failed') { clearTimeout(timeout); unsubscribe(); reject(new Error(status.lastErrorCode || 'bridge failed')) }
      if (status.state === target) { clearTimeout(timeout); unsubscribe(); resolve(status) }
    })
  })
}

app.whenReady().then(async () => {
  const { BridgeSupervisor } = require('../dist/bridge-supervisor.js')
  const { ElectronBridgeProcessFactory } = require('../dist/electron-bridge-process.js')
  const childEntry = path.resolve(__dirname, '..', '..', 'agent-design-bridge', 'dist', 'desktop-child.js')
  const adapterPath = path.resolve(__dirname, '..', '..', '..', 'packages', 'agent-design-mcp', 'dist', 'cli.js')
  const supervisor = new BridgeSupervisor(new ElectronBridgeProcessFactory(childEntry), adapterPath, {
    restartDelaysMs: [10],
    readyTimeoutMs: 10000,
    stopTimeoutMs: 2000,
  })
  supervisor.start({ projectId: 'project:smoke', projectRoot: root, recoveryRoot: path.join(root, 'recovery'), document })
  const ready = await waitForState(supervisor, 'ready')
  const connection = supervisor.mainConnection()
  const headers = { authorization: `Bearer ${connection.token}`, 'content-type': 'application/json' }
  const snapshot = await (await fetch(`${connection.bridgeUrl}/snapshot`, { headers })).json()
  const transaction = await fetch(`${connection.bridgeUrl}/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 'desktop-recovery-smoke',
      actor: 'codex',
      baseRevision: snapshot.revision,
      beforeHash: snapshot.hash,
      operations: [{ id: 'desktop-recovery-op', at: '2026-07-11T01:00:00.000Z', type: 'update-node', nodeId: 'root', patch: { name: 'Recovered root' } }],
    }),
  })
  if (!transaction.ok) throw new Error(`bridge transaction failed: ${transaction.status}`)
  supervisor.requestHealth()
  const codex = supervisor.terminalCommand('codex')
  const claude = supervisor.terminalCommand('claude')
  const redacted = !/token|127\.0\.0\.1|cli\.js/i.test(JSON.stringify(ready))
  await supervisor.stop()
  const recoveredSupervisor = new BridgeSupervisor(new ElectronBridgeProcessFactory(childEntry), adapterPath, {
    restartDelaysMs: [10], readyTimeoutMs: 10000, stopTimeoutMs: 2000,
  })
  recoveredSupervisor.start({ projectId: 'project:smoke', projectRoot: root, recoveryRoot: path.join(root, 'recovery'), document })
  const recovered = await waitForState(recoveredSupervisor, 'ready')
  await recoveredSupervisor.stop()
  const passed = redacted && supervisor.status().state === 'idle' && recovered.recoveryMode === 'recovered' && recovered.revision === 1 && recovered.cursor === 1 && codex.includes('codex -c') && claude.includes('--strict-mcp-config')
  process.stdout.write(`${JSON.stringify({ passed, ready, recovered, stopped: recoveredSupervisor.status(), commands: { codex: codex.startsWith('codex -c'), claude: claude.startsWith('claude --strict-mcp-config') } })}\n`)
  app.once('will-quit', () => { try { rmSync(root, { recursive: true, force: true }) } catch {} })
  app.quit()
  process.exitCode = passed ? 0 : 1
}).catch((error) => {
  console.error(error)
  app.exit(1)
})
