import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const require = createRequire(import.meta.url)
const root = resolve(import.meta.dirname, '..')
const env = { ...process.env }
delete env.ELECTRON_RUN_AS_NODE
const result = spawnSync(require('electron'), [resolve(root, 'scripts/preview-security-smoke.cjs')], { cwd: root, encoding: 'utf8', env })
process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
if (result.status !== 0 || !result.stdout.includes('"passed":true')) throw new Error(`preview security smoke failed: ${result.status}`)
