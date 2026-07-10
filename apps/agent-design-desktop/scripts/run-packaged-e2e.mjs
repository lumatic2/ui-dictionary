import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createServer } from 'node:net'
import { basename, join, resolve } from 'node:path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const root = resolve(import.meta.dirname, '..')
const executablePath = resolve(root, 'out', 'Agent Design-win32-x64', 'AgentDesign.exe')
const resultsRoot = resolve(root, 'results', 'packaged')
const temporaryRoot = await mkdtemp(join(tmpdir(), 'agent-design-packaged-e2e-'))

function invariant(value, message) {
  if (!value) throw new Error(message)
}

function stage(message) {
  console.log(`[packaged-e2e] ${message}`)
}

function p95(values) {
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0
}

async function seedTrustedProject(projectRoot, userData) {
  const canonicalRoot = await realpath(projectRoot)
  const identity = await stat(canonicalRoot, { bigint: true })
  const normalized = process.platform === 'win32' ? canonicalRoot.toLocaleLowerCase('en-US') : canonicalRoot
  const id = `project:${createHash('sha256').update(normalized).digest('hex').slice(0, 24)}`
  const timestamp = '2026-07-11T01:30:00.000Z'
  await mkdir(join(userData, 'projects', id.slice('project:'.length)), { recursive: true })
  await writeFile(join(userData, 'trusted-projects.json'), JSON.stringify({
    format: 'askewly.trusted-projects',
    version: 1,
    projects: [{
      id,
      displayName: basename(canonicalRoot),
      canonicalRoot,
      device: identity.dev.toString(),
      inode: identity.ino.toString(),
      trustedAt: timestamp,
      lastOpenedAt: timestamp,
    }],
  }))
  return id
}

async function freePort() {
  const server = createServer()
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  await new Promise((resolve) => server.close(resolve))
  return port
}

class CdpPage {
  constructor(url, consoleErrors) {
    this.url = url
    this.consoleErrors = consoleErrors
    this.nextId = 1
    this.pending = new Map()
  }

  async connect() {
    this.socket = new WebSocket(this.url)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('CDP page connection timed out')), 5_000)
      this.socket.addEventListener('open', () => { clearTimeout(timeout); resolve() }, { once: true })
      this.socket.addEventListener('error', () => { clearTimeout(timeout); reject(new Error('CDP page connection failed')) }, { once: true })
    })
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (message.id !== undefined) {
        const pending = this.pending.get(message.id)
        if (pending) {
          this.pending.delete(message.id)
          message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result)
        }
      } else if (message.method === 'Runtime.consoleAPICalled' && message.params?.type === 'error') {
        this.consoleErrors.push(message.params.args?.map((arg) => arg.value ?? arg.description ?? '').join(' ') ?? 'console error')
      } else if (message.method === 'Runtime.exceptionThrown') {
        this.consoleErrors.push(message.params?.exceptionDetails?.exception?.description ?? message.params?.exceptionDetails?.text ?? 'renderer exception')
      }
    })
    await this.send('Runtime.enable')
    await this.send('Page.enable')
    return this
  }

  send(method, params = {}) {
    const id = this.nextId++
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP command timed out: ${method}`)) }, 10_000)
      this.pending.set(id, {
        resolve: (value) => { clearTimeout(timeout); resolve(value) },
        reject: (error) => { clearTimeout(timeout); reject(error) },
      })
    })
    this.socket.send(JSON.stringify({ id, method, params }))
    return promise
  }

  async evaluate(fn, arg) {
    const expression = typeof fn === 'function'
      ? `(${fn.toString()})(${arg === undefined ? '' : JSON.stringify(arg)})`
      : String(fn)
    const result = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
    return result.result?.value
  }

  async waitForFunction(fn, arg, timeoutMs = 30_000) {
    const started = Date.now()
    while (Date.now() - started < timeoutMs) {
      if (await this.evaluate(fn, arg)) return
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    throw new Error(`renderer condition timed out: ${fn.toString().slice(0, 160)}`)
  }

  locator(selector) { return new CdpLocator(this, `document.querySelector(${JSON.stringify(selector)})`) }
  getByTestId(id) { return this.locator(`[data-testid="${id}"]`) }
  getByRole(role, options) {
    invariant(role === 'button' && typeof options?.name === 'string', 'CDP role locator supports named buttons only')
    return new CdpLocator(this, `Array.from(document.querySelectorAll('button')).find((element) => element.textContent?.trim() === ${JSON.stringify(options.name)})`)
  }

  async screenshot({ path }) {
    const result = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    const bytes = Buffer.from(result.data, 'base64')
    await writeFile(path, bytes)
    return bytes
  }

  close() { this.socket?.close() }
}

class CdpLocator {
  constructor(page, getter) { this.page = page; this.getter = getter }
  async waitFor() { await this.page.waitForFunction(`Boolean(${this.getter})`) }
  async textContent() { return this.page.evaluate(`(${this.getter})?.textContent ?? null`) }
  async getAttribute(name) { return this.page.evaluate(`(${this.getter})?.getAttribute(${JSON.stringify(name)}) ?? null`) }
  async click() { await this.page.evaluate(`(()=>{const element=${this.getter};if(!element)throw new Error('locator missing');element.click()})()`) }
  async focus() { await this.page.evaluate(`(${this.getter})?.focus()`) }
  async fill(value) {
    await this.page.evaluate(([next, getterSource]) => {
      const element = document.querySelector(getterSource)
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) throw new Error('locator is not an input')
      const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, next)
      element.dispatchEvent(new Event('input', { bubbles: true }))
    }, [value, this.getter.match(/^document\.querySelector\((.+)\)$/) ? JSON.parse(this.getter.match(/^document\.querySelector\((.+)\)$/)[1]) : ''])
  }
  async press(key) {
    await this.page.evaluate(([selector, pressed]) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error('locator missing')
      element.focus()
      element.dispatchEvent(new KeyboardEvent('keydown', { key: pressed, bubbles: true }))
      element.dispatchEvent(new KeyboardEvent('keyup', { key: pressed, bubbles: true }))
      if (pressed === 'Tab') element.blur()
    }, [JSON.parse(this.getter.match(/^document\.querySelector\((.+)\)$/)[1]), key])
  }
  async selectOption(value) {
    await this.page.evaluate(([selector, next]) => {
      const element = document.querySelector(selector)
      if (!(element instanceof HTMLSelectElement)) throw new Error('locator is not a select')
      element.value = next
      element.dispatchEvent(new Event('change', { bubbles: true }))
    }, [JSON.parse(this.getter.match(/^document\.querySelector\((.+)\)$/)[1]), value])
  }
  async screenshot({ path }) {
    const rect = await this.page.evaluate((selector) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error('locator missing')
      const box = element.getBoundingClientRect()
      return { x: box.x, y: box.y, width: box.width, height: box.height }
    }, JSON.parse(this.getter.match(/^document\.querySelector\((.+)\)$/)[1]))
    const result = await this.page.send('Page.captureScreenshot', { format: 'png', clip: { ...rect, scale: 1 }, captureBeyondViewport: true })
    const bytes = Buffer.from(result.data, 'base64')
    await writeFile(path, bytes)
    return bytes
  }
}

async function launch(userData) {
  const port = await freePort()
  const child = spawn(executablePath, [
    `--user-data-dir=${userData}`,
    `--remote-debugging-port=${port}`,
    '--enable-unsafe-webgpu',
    '--enable-features=Vulkan,UseSkiaRenderer',
  ], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
  let diagnostics = ''
  child.stdout.on('data', (chunk) => { diagnostics = `${diagnostics}${chunk}`.slice(-8_000) })
  child.stderr.on('data', (chunk) => { diagnostics = `${diagnostics}${chunk}`.slice(-8_000) })
  const consoleErrors = []
  let target
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      target = targets.find((candidate) => candidate.url === 'app://renderer/index.html')
      if (target?.webSocketDebuggerUrl) break
    } catch {
      if (child.exitCode !== null) throw new Error(`packaged app exited before CDP became ready: ${child.exitCode}\n${diagnostics}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  invariant(target?.webSocketDebuggerUrl, `packaged app CDP target did not become ready\n${diagnostics}`)
  const page = await new CdpPage(target.webSocketDebuggerUrl, consoleErrors).connect()
  const firstWindow = async () => page
  const close = async () => {
    await page.evaluate(() => window.close()).catch(() => undefined)
    page.close()
    if (child.exitCode === null) {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => { child.kill(); resolve() }, 3_000)
        child.once('exit', () => { clearTimeout(timeout); resolve() })
      })
    }
  }
  return { firstWindow, close, process: () => child, consoleErrors }
}

async function waitForReady(page) {
  await page.getByTestId('desktop-bridge-status').waitFor({ state: 'visible' })
  await page.waitForFunction(() => document.querySelector('[data-testid="desktop-bridge-status"]')?.textContent?.includes('desktop ready'))
  await page.waitForFunction(() => document.querySelector('[data-testid="bridge-status"]')?.textContent?.startsWith('connected'))
}

async function clipboardText() {
  const result = spawnSync('pwsh.exe', ['-NoProfile', '-Command', 'Get-Clipboard -Raw'], { encoding: 'utf8' })
  invariant(result.status === 0, `clipboard inspection failed: ${result.stderr}`)
  return result.stdout.trim()
}

function claudeConfig(command) {
  const match = command.match(/--mcp-config '([\s\S]+)'$/)
  invariant(match, 'Claude bootstrap command does not contain inline MCP config')
  return JSON.parse(match[1].replaceAll("''", "'"))
}

class McpStdioClient {
  constructor(config, actor) {
    this.nextId = 1
    this.pending = new Map()
    this.stderr = ''
    this.child = spawn(config.command, config.args, {
      cwd: root,
      env: { ...process.env, ...config.env, AGENT_DESIGN_ACTOR: actor },
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    })
    let buffered = ''
    this.child.stdout.setEncoding('utf8')
    this.child.stdout.on('data', (chunk) => {
      buffered += chunk
      for (;;) {
        const newline = buffered.indexOf('\n')
        if (newline < 0) break
        const line = buffered.slice(0, newline).trim()
        buffered = buffered.slice(newline + 1)
        if (!line) continue
        const message = JSON.parse(line)
        if (message.id !== undefined) {
          const pending = this.pending.get(message.id)
          if (pending) {
            this.pending.delete(message.id)
            message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result)
          }
        }
      }
    })
    this.child.stderr.setEncoding('utf8')
    this.child.stderr.on('data', (chunk) => { this.stderr += chunk })
  }

  request(method, params) {
    const id = this.nextId++
    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error(`MCP request timed out: ${method}; ${this.stderr}`)) }, 10_000)
      this.pending.set(id, {
        resolve: (value) => { clearTimeout(timeout); resolve(value) },
        reject: (error) => { clearTimeout(timeout); reject(error) },
      })
    })
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`)
    return promise
  }

  notify(method, params = {}) {
    this.child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`)
  }

  async initialize() {
    await this.request('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'agent-design-packaged-e2e', version: '1.0.0' } })
    this.notify('notifications/initialized')
  }

  async tool(name, args) {
    const result = await this.request('tools/call', { name, arguments: args })
    if (result.isError) throw new Error(result.content?.[0]?.text ?? `${name} failed`)
    return result.structuredContent ?? JSON.parse(result.content[0].text)
  }

  async close() {
    this.child.stdin.end()
    await new Promise((resolve) => {
      const timeout = setTimeout(() => { this.child.kill(); resolve() }, 2_000)
      this.child.once('exit', () => { clearTimeout(timeout); resolve() })
    })
  }
}

async function applyAgentLabel(config, actor, label, transactionId) {
  const client = new McpStdioClient(config, actor)
  try {
    await client.initialize()
    const context = await client.tool('get_context', {})
    const result = await client.tool('apply_operations', {
      transactionId,
      baseRevision: context.revision,
      beforeHash: context.hash,
      operations: [{ id: `${transactionId}:label`, at: new Date().toISOString(), type: 'set-node-property', nodeId: 'project-app', scope: 'prop', key: 'label', value: label }],
    })
    return { revision: result.snapshot.revision, cursor: result.snapshot.cursor }
  } finally {
    await client.close()
  }
}

async function childUtilityPid(mainPid) {
  const command = [
    `$main=${mainPid}`,
    "$candidate=Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $main -and $_.CommandLine -match '--type=utility' -and $_.CommandLine -match 'NodeService' } | Select-Object -First 1",
    "if($candidate){$candidate.ProcessId}",
  ].join('; ')
  const result = spawnSync('pwsh.exe', ['-NoProfile', '-Command', command], { encoding: 'utf8' })
  invariant(result.status === 0, `utility process inspection failed: ${result.stderr}`)
  const pid = Number(result.stdout.trim())
  invariant(Number.isSafeInteger(pid) && pid > 0, 'packaged bridge utility process was not found')
  return pid
}

async function processStillRunning(executable) {
  const command = "@(Get-CimInstance Win32_Process | Where-Object { $_.ExecutablePath -eq $env:AGENT_DESIGN_EXECUTABLE }).Count"
  const result = spawnSync('pwsh.exe', ['-NoProfile', '-Command', command], { encoding: 'utf8', env: { ...process.env, AGENT_DESIGN_EXECUTABLE: executable } })
  return Number(result.stdout.trim()) > 0
}

const projectRoot = join(temporaryRoot, 'fresh-react-project')
const userData = join(temporaryRoot, 'user-data')
const sourceFile = join(projectRoot, 'src', 'App.tsx')
const source = (label) => `export function App() { return <article data-agent-design-id="project-app" data-agent-design-name="App" data-agent-design-label="${label}">${label}</article> }\n`
await mkdir(join(projectRoot, 'src'), { recursive: true })
await writeFile(sourceFile, source('Initial React source'))
await writeFile(join(projectRoot, 'index.html'), '<!doctype html><main>Agent Design preview fixture</main>')
const projectId = await seedTrustedProject(projectRoot, userData)
await mkdir(resultsRoot, { recursive: true })

let app
let restartApp
let benchmarkApp
const consoleErrors = []
const consoleErrorsByPhase = {}
try {
  stage('launching trusted-project package')
  app = await launch(userData)
  const page = await app.firstWindow()
  await waitForReady(page)
  stage('trusted project and main relay ready')
  const rendererUrl = await page.evaluate(() => location.href)
  invariant(rendererUrl === 'app://renderer/index.html', `unexpected packaged renderer URL: ${rendererUrl}`)
  const authority = await page.evaluate(() => ({
    processType: typeof process,
    requireType: typeof require,
    hostKeys: Object.keys(window.agentDesignHost ?? {}).sort(),
  }))
  invariant(authority.processType === 'undefined' && authority.requireType === 'undefined', 'packaged renderer gained Node authority')
  invariant(!JSON.stringify(authority).match(/token|bridgeUrl/i), 'renderer host API exposes connection credentials')
  await page.locator('[data-canvas-id="project-app"]').waitFor()

  await page.getByRole('button', { name: 'Copy Codex' }).click()
  const codexCommand = await clipboardText()
  invariant(codexCommand.startsWith('codex ') && codexCommand.includes('mcp_servers.agent-design'), 'Codex bootstrap command is invalid')
  await page.getByRole('button', { name: 'Copy Claude' }).click()
  const claudeCommand = await clipboardText()
  const inline = claudeConfig(claudeCommand)
  const adapter = inline.mcpServers?.['agent-design']
  invariant(adapter?.command === 'node' && adapter.args?.[0]?.endsWith('resources\\mcp\\cli.mjs'), 'packaged MCP adapter path is invalid')
  stage('terminal bootstrap commands verified')

  const codex = await applyAgentLabel(adapter, 'codex', 'Codex packaged update', 'packaged-codex-1')
  await page.waitForFunction(() => document.querySelector('[data-canvas-id="project-app"]')?.textContent === 'Codex packaged update')
  const claude = await applyAgentLabel(adapter, 'claude', 'Claude packaged update', 'packaged-claude-1')
  await page.waitForFunction(() => document.querySelector('[data-canvas-id="project-app"]')?.textContent === 'Claude packaged update')
  stage('Codex and Claude packaged MCP updates visible')

  await page.locator('[data-canvas-id="project-app"]').click()
  await page.getByTestId('property-prop-label').waitFor()
  await page.getByTestId('property-prop-label').fill('Human packaged update')
  await page.getByTestId('property-prop-label').press('Tab')
  await page.waitForFunction(() => document.querySelector('[data-canvas-id="project-app"]')?.textContent === 'Human packaged update')
  stage('human property edit visible')

  const watcherStarted = performance.now()
  await writeFile(sourceFile, source('Watcher packaged update'))
  await page.waitForFunction(() => document.querySelector('[data-canvas-id="project-app"]')?.textContent === 'Watcher packaged update')
  const watcherVisibleMs = performance.now() - watcherStarted
  stage(`source watcher update visible in ${watcherVisibleMs.toFixed(1)}ms`)
  const beforeRestart = await page.getByTestId('canvas-viewport').screenshot({ path: join(resultsRoot, 'before-restart.png') })
  const revisionBeforeCrash = Number(await page.getByTestId('document-revision').textContent())

  const utilityPid = await childUtilityPid(app.process().pid)
  stage(`terminating supervised bridge utility pid ${utilityPid}`)
  process.kill(utilityPid)
  await page.waitForFunction(() => document.querySelector('[data-testid="desktop-bridge-status"]')?.textContent?.includes('desktop ready · recovered'))
  await page.waitForFunction((revision) => Number(document.querySelector('[data-testid="document-revision"]')?.textContent) === revision, revisionBeforeCrash)
  const revisionAfterCrashRecovery = Number(await page.getByTestId('document-revision').textContent())
  stage('bridge crash recovery restored revision')
  consoleErrorsByPhase.trustedProject = [...app.consoleErrors]
  consoleErrors.push(...app.consoleErrors)
  await app.close()
  app = null

  stage('launching offline restart recovery')
  restartApp = await launch(userData)
  const restartPage = await restartApp.firstWindow()
  await waitForReady(restartPage)
  await restartPage.waitForFunction((revision) => Number(document.querySelector('[data-testid="document-revision"]')?.textContent) === revision, revisionBeforeCrash)
  const afterRestart = await restartPage.getByTestId('canvas-viewport').screenshot({ path: join(resultsRoot, 'after-restart.png') })
  const beforePng = PNG.sync.read(beforeRestart)
  const afterPng = PNG.sync.read(afterRestart)
  const diff = new PNG({ width: beforePng.width, height: beforePng.height })
  const differentPixels = pixelmatch(beforePng.data, afterPng.data, diff.data, beforePng.width, beforePng.height, { threshold: 0.1, includeAA: false })
  await writeFile(join(resultsRoot, 'restart-diff.png'), PNG.sync.write(diff))
  stage(`restart drift measured at ${differentPixels} pixels`)
  consoleErrorsByPhase.restart = [...restartApp.consoleErrors]
  consoleErrors.push(...restartApp.consoleErrors)
  await restartApp.close()
  restartApp = null

  stage('launching packaged 5k benchmark')
  const benchmarkUserData = join(temporaryRoot, 'benchmark-user-data')
  benchmarkApp = await launch(benchmarkUserData)
  const benchmarkPage = await benchmarkApp.firstWindow()
  await benchmarkPage.waitForFunction(() => typeof window.__agentDesignBenchmark?.runPointerTrace === 'function')
  await benchmarkPage.getByTestId('fixture-size').selectOption('5000')
  await benchmarkPage.waitForFunction(() => document.querySelectorAll('[data-canvas-id]').length === 5000)
  const gpuState = await benchmarkPage.getByTestId('editor-plane').getAttribute('data-editor-plane')
  const traces = []
  for (let run = 0; run < 3; run += 1) traces.push(await benchmarkPage.evaluate(() => window.__agentDesignBenchmark.runPointerTrace(60)))
  const viewport = benchmarkPage.getByTestId('canvas-viewport')
  await viewport.focus()
  await viewport.press('Escape')
  await viewport.press('ArrowRight')
  await benchmarkPage.waitForFunction(() => document.activeElement?.getAttribute('data-canvas-id') === 'node-00000')
  const firstFocus = await benchmarkPage.evaluate(() => document.activeElement?.getAttribute('data-canvas-id'))
  await viewport.press('ArrowRight')
  await benchmarkPage.waitForFunction(() => document.activeElement?.getAttribute('data-canvas-id') === 'node-00001')
  const secondFocus = await benchmarkPage.evaluate(() => document.activeElement?.getAttribute('data-canvas-id'))
  await benchmarkPage.getByTestId('editor-plane-mode').selectOption('forced-fallback')
  await benchmarkPage.waitForFunction(() => document.querySelector('[data-testid="editor-plane"]')?.getAttribute('data-editor-plane') === 'dom')
  const fallbackTrace = await benchmarkPage.evaluate(() => window.__agentDesignBenchmark.runPointerTrace(20))
  await benchmarkPage.screenshot({ path: join(resultsRoot, 'packaged-5k.png') })
  stage(`packaged 5k traces complete: ${traces.map((trace) => trace.p95LatencyMs.toFixed(2)).join(', ')}ms`)
  consoleErrorsByPhase.benchmark = [...benchmarkApp.consoleErrors]
  consoleErrors.push(...benchmarkApp.consoleErrors)
  await benchmarkApp.close()
  benchmarkApp = null

  await new Promise((resolve) => setTimeout(resolve, 500))
  const instrumentationExceptions = consoleErrors.filter((error) => (
    error === 'Electron sandboxed_renderer.bundle.js script failed to run' ||
    error.includes("Cannot destructure property 'preloadScripts' of 'binding.startupData' as it is null")
  ))
  const applicationConsoleErrors = consoleErrors.filter((error) => !instrumentationExceptions.includes(error))
  const report = {
    schemaVersion: 1,
    classification: 'unsigned-development',
    runtime: 'Electron packaged Windows x64 application',
    project: { trustedProjectIdRedacted: createHash('sha256').update(projectId).digest('hex').slice(0, 12), importedSource: 'src/App.tsx' },
    security: { rendererNodeAuthority: false, rendererCredentialSurface: false, appProtocol: true, preloadApiVerified: authority.hostKeys.includes('getCanvasSnapshot') },
    terminalAdapters: { codex, claude, packagedAdapter: true, commandCredentialsRedacted: true },
    roundTrip: { humanEdit: true, watcherEdit: true, watcherVisibleMs, finalLabel: 'Watcher packaged update' },
    recovery: { revisionBeforeCrash, revisionAfterCrashRecovery, restartRevision: revisionBeforeCrash, differentPixels, totalPixels: beforePng.width * beforePng.height },
    performance: { gpuState, traces, p95WorstMs: Math.max(...traces.map((trace) => trace.p95LatencyMs)), targetMs: 16, fallbackState: 'dom', fallbackTrace },
    accessibility: { firstFocus, secondFocus },
    processCleanup: { packagedExecutableStillRunning: await processStillRunning(executablePath) },
    consoleErrors: applicationConsoleErrors,
    consoleErrorsByPhase,
    instrumentation: {
      knownElectronSandboxStartupExceptions: instrumentationExceptions.length,
      classification: 'CDP-observed Electron 43 sandbox startup telemetry; preload host API verified operational',
    },
  }
  await writeFile(join(resultsRoot, 'packaged-e2e.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`packaged E2E: PASS (agent revisions ${codex.revision}/${claude.revision}; watcher ${watcherVisibleMs.toFixed(1)}ms; 5k p95 ${report.performance.p95WorstMs.toFixed(2)}ms)`)
} finally {
  await benchmarkApp?.close().catch(() => undefined)
  await restartApp?.close().catch(() => undefined)
  await app?.close().catch(() => undefined)
  await rm(temporaryRoot, { recursive: true, force: true })
}
