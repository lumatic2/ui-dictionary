const { app, MessageChannelMain, utilityProcess } = require('electron')
const { mkdtempSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')

const root = mkdtempSync(path.join(tmpdir(), 'agent-design-packaged-child-'))
const entry = process.env.AGENT_DESIGN_CHILD_ENTRY || path.resolve(__dirname, '..', 'out', 'AskewlyDesign-win32-x64', 'resources', 'bridge', 'desktop-child.mjs')
const document = {
  schemaVersion: 1, id: 'packaged-child-smoke', name: 'Smoke', revision: 0, rootIds: ['root'],
  nodes: { root: { id: 'root', kind: 'frame', name: 'Root', parentId: null, childIds: [], bounds: { x: 0, y: 0, width: 800, height: 600 }, layout: { mode: 'absolute', horizontal: 'fixed', vertical: 'fixed', gap: 0, padding: [0, 0, 0, 0] }, visible: true, locked: false, tokenBindings: {}, source: null, clipContent: true } },
  selection: ['root'], viewport: { pan: { x: 0, y: 0 }, zoom: 1 }, tokenSetId: 'askewly.default',
  metadata: { createdAt: '2026-07-11T00:00:00.000Z', updatedAt: '2026-07-11T00:00:00.000Z', sourceRoot: '.' },
}

app.whenReady().then(async () => {
  const child = utilityProcess.fork(entry, [], { cwd: root, env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP }, stdio: 'pipe' })
  let stdout = ''
  let stderr = ''
  child.stdout.on('data', (chunk) => { stdout += chunk })
  child.stderr.on('data', (chunk) => { stderr += chunk })
  const result = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { child.kill(); reject(new Error(`timeout\nstdout=${stdout}\nstderr=${stderr}`)) }, 10_000)
    child.on('spawn', () => {
      const { port1, port2 } = new MessageChannelMain()
      port2.on('message', (event) => {
        if (event.data?.type === 'ready') {
          clearTimeout(timeout)
          resolve({ type: 'ready', revision: event.data.revision, recoveryMode: event.data.recoveryMode })
        } else if (event.data?.type === 'fatal') {
          clearTimeout(timeout)
          reject(new Error(`fatal=${JSON.stringify(event.data)}\nstdout=${stdout}\nstderr=${stderr}`))
        }
      })
      port2.start()
      child.postMessage({ type: 'attach' }, [port1])
      port2.postMessage({ type: 'start', projectId: 'project:packaged-smoke', projectRoot: root, recoveryRoot: path.join(root, 'recovery'), document })
    })
    child.on('exit', (code) => {
      clearTimeout(timeout)
      reject(new Error(`exit=${code}\nstdout=${stdout}\nstderr=${stderr}`))
    })
  })
  child.kill()
  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 1_000)
    child.once('exit', () => { clearTimeout(timeout); resolve() })
  })
  console.log(JSON.stringify({ passed: true, result }))
  rmSync(root, { recursive: true, force: true })
  app.quit()
}).catch((error) => {
  console.error(error)
  rmSync(root, { recursive: true, force: true })
  app.exit(1)
})
