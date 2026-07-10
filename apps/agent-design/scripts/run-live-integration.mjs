import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { chromium } from 'playwright'
import { createDocumentFixture, firstComponent } from '../../../packages/canvas-core/dist/index.js'
import { startBridge } from '../../agent-design-bridge/dist/index.js'

const root = path.resolve(import.meta.dirname, '..')
const resultsDir = path.join(root, 'results')
const screenshotsDir = path.join(resultsDir, 'screenshots')
const port = 4183
const appUrl = `http://127.0.0.1:${port}`
const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const projectRoot = await mkdtemp(path.join(tmpdir(), 'agent-design-live-'))
const document = createDocumentFixture(1000)
const component = firstComponent(document)
const sourceFile = path.join(projectRoot, component.source.file)
const source = (label) => `export function Fixture1() { return <article data-agent-design-id="${component.id}" data-agent-design-name="Live card">${label}</article> }\n`
await mkdir(path.dirname(sourceFile), { recursive: true })
await writeFile(sourceFile, source('Initial source'))

const watcherErrors = []
const bridge = await startBridge({
  projectRoot,
  document,
  watchSources: true,
  watcherDebounceMs: 10,
  verifySource: () => ({ valid: true, checks: ['fresh-react-fixture'] }),
  onWatcherError: (error) => watcherErrors.push(error instanceof Error ? error.message : String(error)),
})
const server = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', String(port)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(appUrl)).ok) return } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('live canvas server did not become ready')
}

function p95(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0
}

let browser
try {
  await mkdir(screenshotsDir, { recursive: true })
  await waitForServer()
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const consoleErrors = []
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  const liveUrl = `${appUrl}/?bridge=${encodeURIComponent(bridge.url)}&token=${encodeURIComponent(bridge.session.token)}`
  await page.goto(liveUrl, { waitUntil: 'domcontentloaded' })
  await page.getByTestId('bridge-status').waitFor()
  await page.waitForFunction(() => document.querySelector('[data-testid="bridge-status"]')?.textContent?.startsWith('connected'))

  const agentLatencies = []
  const agentRoundTripLatencies = []
  for (let index = 0; index < 10; index += 1) {
    const snapshot = bridge.session.snapshot()
    const label = `Agent update ${index}`
    const requestStarted = performance.now()
    const response = await fetch(`${bridge.url}/transactions`, {
      method: 'POST',
      headers: { authorization: `Bearer ${bridge.session.token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        id: `integration-agent-${index}`,
        actor: index % 2 ? 'claude' : 'codex',
        baseRevision: snapshot.revision,
        beforeHash: snapshot.hash,
        operations: [{ id: `integration-op-${index}`, at: new Date().toISOString(), type: 'set-node-property', nodeId: component.id, scope: 'prop', key: 'label', value: label }],
      }),
    })
    if (!response.ok) throw new Error(`agent transaction failed: ${response.status}`)
    const acknowledged = performance.now()
    await page.waitForFunction(([id, value]) => document.querySelector(`[data-canvas-id="${id}"]`)?.textContent === value, [component.id, label])
    const visible = performance.now()
    agentLatencies.push(visible - acknowledged)
    agentRoundTripLatencies.push(visible - requestStarted)
  }

  const watcherLatencies = []
  for (let index = 0; index < 10; index += 1) {
    const label = `File update ${index}`
    const started = performance.now()
    await writeFile(sourceFile, source(label))
    await page.waitForFunction(([id, value]) => document.querySelector(`[data-canvas-id="${id}"]`)?.textContent === value, [component.id, label])
    watcherLatencies.push(performance.now() - started)
  }

  await page.screenshot({ path: path.join(screenshotsDir, 'terminal-live-canvas.png') })
  const finalSnapshot = bridge.session.snapshot()
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    runtime: 'Playwright installed system Chrome headless, 1440x900@1x',
    connection: await page.getByTestId('bridge-status').textContent(),
    agentAckToVisibleMs: { samples: agentLatencies, p95: p95(agentLatencies), target: 100 },
    agentRequestToVisibleMs: { samples: agentRoundTripLatencies, p95: p95(agentRoundTripLatencies) },
    fileEditToVisibleMs: { samples: watcherLatencies, p95: p95(watcherLatencies), target: 300 },
    final: {
      revision: finalSnapshot.revision,
      cursor: finalSnapshot.cursor,
      label: await page.locator(`[data-canvas-id="${component.id}"]`).textContent(),
      auditEntries: bridge.session.auditLog().length,
    },
    watcherErrors,
    consoleErrors,
  }
  await writeFile(path.join(resultsDir, 'live-sync-results.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
} finally {
  await browser?.close()
  server.kill()
  await bridge.close()
  await rm(projectRoot, { recursive: true, force: true })
}
