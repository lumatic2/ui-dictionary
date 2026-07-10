import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const installer = resolve(root, 'out', 'make', 'squirrel.windows', 'x64', 'AgentDesign-UnsignedDevelopment-Setup.exe')
const installRoot = resolve(process.env.LOCALAPPDATA, 'agent_design')
const updateExecutable = resolve(installRoot, 'Update.exe')
const installedExecutable = resolve(installRoot, 'app-0.1.0', 'AgentDesign.exe')
const resultsRoot = resolve(root, 'results', 'packaged')
const startMenu = resolve(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs')
const desktop = resolve(process.env.USERPROFILE, 'Desktop')

function invariant(value, message) {
  if (!value) throw new Error(message)
}

async function waitFor(check, message, timeoutMs = 30_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (await check()) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(message)
}

async function freePort() {
  const server = createServer()
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  await new Promise((resolve) => server.close(resolve))
  return port
}

async function matchingShortcuts(directory, prefix = '') {
  const results = []
  for (const entry of await readdir(directory, { withFileTypes: true }).catch(() => [])) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) results.push(...await matchingShortcuts(resolve(directory, entry.name), relative))
    else if (entry.isFile() && /agent.?design/i.test(entry.name) && entry.name.endsWith('.lnk')) results.push(relative)
  }
  return results
}

function uninstall() {
  if (!existsSync(updateExecutable)) return { status: 0, stderr: '' }
  return spawnSync(updateExecutable, ['--uninstall', '-s'], { encoding: 'utf8', timeout: 60_000, windowsHide: true })
}

invariant(!existsSync(installRoot), `refusing to overwrite pre-existing Agent Design install: ${installRoot}`)
let installed = false
try {
  const setup = spawnSync(installer, [], { encoding: 'utf8', timeout: 120_000, windowsHide: true })
  invariant(setup.status === 0, `Squirrel setup failed: ${setup.status}; ${setup.stderr}`)
  await waitFor(() => existsSync(installedExecutable) && existsSync(updateExecutable), 'installed executable did not appear')
  installed = true
  let shortcutsAfterInstall = []
  let desktopShortcutsAfterInstall = []
  await waitFor(async () => {
    shortcutsAfterInstall = await matchingShortcuts(startMenu)
    desktopShortcutsAfterInstall = await matchingShortcuts(desktop)
    return shortcutsAfterInstall.length === 1 && desktopShortcutsAfterInstall.length === 1
  }, 'expected Start Menu and desktop shortcuts after first-run hook', 10_000)

  const port = await freePort()
  const child = spawn(installedExecutable, [`--remote-debugging-port=${port}`], { stdio: 'ignore', windowsHide: true })
  let target
  await waitFor(async () => {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
      target = targets.find((candidate) => candidate.url === 'app://renderer/index.html')
      return Boolean(target?.webSocketDebuggerUrl)
    } catch { return false }
  }, 'installed application did not expose its renderer')

  const hostApiVerified = await new Promise((resolvePromise, reject) => {
    const socket = new WebSocket(target.webSocketDebuggerUrl)
    const timeout = setTimeout(() => reject(new Error('installed renderer inspection timed out')), 5_000)
    let id = 0
    const inspect = () => socket.send(JSON.stringify({ id: ++id, method: 'Runtime.evaluate', params: { expression: `Boolean(window.agentDesignHost?.getHostInfo) && typeof process === 'undefined' && typeof require === 'undefined'`, returnByValue: true } }))
    socket.addEventListener('open', inspect)
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data))
      if (!message.id || message.id !== id) return
      if (message.result?.result?.value !== true) {
        setTimeout(inspect, 100)
        return
      }
      socket.send(JSON.stringify({ id: 2, method: 'Runtime.evaluate', params: { expression: 'window.close()' } }))
      clearTimeout(timeout)
      socket.close()
      resolvePromise(true)
    })
  })
  invariant(hostApiVerified, 'installed renderer security/host contract failed')
  await waitFor(() => child.exitCode !== null, 'installed application did not exit cleanly', 10_000).catch(() => child.kill())

  const removal = uninstall()
  invariant(removal.status === 0, `Squirrel uninstall failed: ${removal.status}; ${removal.stderr}`)
  await waitFor(() => !existsSync(installedExecutable), 'Squirrel uninstall left the application payload', 30_000)
  const shortcutsAfterUninstall = [...await matchingShortcuts(startMenu), ...await matchingShortcuts(desktop)]
  invariant(shortcutsAfterUninstall.length === 0, `Squirrel uninstall left shortcuts: ${shortcutsAfterUninstall.join(', ')}`)
  const tombstoneFiles = []
  async function collect(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true }).catch(() => [])) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) await collect(resolve(directory, entry.name), relative)
      else tombstoneFiles.push(relative)
    }
  }
  await collect(installRoot)
  const allowedTombstones = new Set(['.dead', 'Update.exe', 'app-0.1.0/squirrel.exe', 'app-0.1.0/v8_context_snapshot.bin'])
  invariant(tombstoneFiles.every((file) => allowedTombstones.has(file)), `unexpected uninstall residue: ${tombstoneFiles.join(', ')}`)
  await rm(installRoot, { recursive: true, force: true })
  installed = false

  await mkdir(resultsRoot, { recursive: true })
  await writeFile(resolve(resultsRoot, 'installer-lifecycle.json'), `${JSON.stringify({
    schemaVersion: 1,
    classification: 'unsigned-development',
    scope: 'current Windows user (no Windows Sandbox elevation available)',
    installed: true,
    launched: true,
    rendererSecurityVerified: true,
    startMenuShortcutCreated: shortcutsAfterInstall[0],
    desktopShortcutCreated: desktopShortcutsAfterInstall[0],
    uninstalled: true,
    uninstallerRemovedApplicationPayload: true,
    squirrelTombstoneFiles: tombstoneFiles,
    harnessRemovedExpectedTombstone: true,
    installDirectoryRemoved: true,
    shortcutRemoved: true,
  }, null, 2)}\n`)
  console.log('installer lifecycle: PASS (install, launch, shortcut, uninstall, cleanup)')
} finally {
  if (installed) uninstall()
}
