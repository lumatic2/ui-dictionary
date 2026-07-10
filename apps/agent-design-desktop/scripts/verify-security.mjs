import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)
const root = resolve(import.meta.dirname, '..')
const source = ['src/main.ts', 'src/preload.ts', 'src/security.ts', 'src/ipc.ts']
  .map((file) => readFileSync(resolve(root, file), 'utf8'))
  .join('\n')

const forbidden = [
  /nodeIntegration\s*:\s*true/,
  /sandbox\s*:\s*false/,
  /webSecurity\s*:\s*false/,
  /allowRunningInsecureContent\s*:\s*true/,
  /enableRemoteModule\s*:\s*true/,
  /loadURL\(\s*['"]https?:/,
]
for (const pattern of forbidden) {
  if (pattern.test(source)) throw new Error(`forbidden Electron setting: ${pattern}`)
}

for (const required of [
  'app://renderer',
  'contextIsolation: true',
  'nodeIntegration: false',
  'sandbox: true',
  'setPermissionRequestHandler',
  'setWindowOpenHandler',
  'will-navigate',
  'isTrustedIpcSender',
  "default-src 'none'",
]) {
  if (!source.includes(required)) throw new Error(`missing security control: ${required}`)
}

const electronPath = require('electron')
const runtime = spawnSync(electronPath, [resolve(root, 'scripts/runtime-security-smoke.cjs')], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, ELECTRON_ENABLE_LOGGING: '0' },
})
process.stdout.write(runtime.stdout)
process.stderr.write(runtime.stderr)
if (runtime.status !== 0) throw new Error(`Electron runtime security smoke failed: ${runtime.status}`)
if (`${runtime.stdout}\n${runtime.stderr}`.includes('Electron Security Warning')) {
  throw new Error('Electron emitted a renderer security warning')
}

const electronegativity = spawnSync(
  process.execPath,
  [resolve(root, 'node_modules/@doyensec/electronegativity/dist/index.js'), '-i', root, '-s', 'HIGH', '-v', 'false'],
  { cwd: root, encoding: 'utf8' },
)
process.stdout.write(electronegativity.stdout)
process.stderr.write(electronegativity.stderr)
if (electronegativity.status !== 0) {
  throw new Error(`Electronegativity failed: ${electronegativity.status}`)
}
if (/\bHIGH\b|\bCRITICAL\b/.test(electronegativity.stdout)) {
  throw new Error('Electronegativity reported a high-severity finding')
}

console.log('security verification: PASS')
