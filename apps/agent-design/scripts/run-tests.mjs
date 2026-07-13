import { readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const vitest = fileURLToPath(new URL('../node_modules/vitest/vitest.mjs', import.meta.url))
const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url))
const nodeOptions = [process.env.NODE_OPTIONS, '--no-experimental-webstorage']
  .filter(Boolean)
  .join(' ')

function discoverTestFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return discoverTestFiles(path)
      return /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : []
    })
    .sort((left, right) => left < right ? -1 : left > right ? 1 : 0)
}

function runVitest(args) {
  const result = spawnSync(
    process.execPath,
    [vitest, 'run', '--maxWorkers=1', '--minWorkers=1', ...args],
    {
      env: { ...process.env, NODE_OPTIONS: nodeOptions },
      stdio: 'inherit',
    },
  )
  if (result.error) {
    console.error(result.error)
    return 1
  }
  return result.status ?? 1
}

const explicitArgs = process.argv.slice(2)
const invocations = explicitArgs.length
  ? [explicitArgs]
  : discoverTestFiles(sourceRoot).map((file) => [file])

let exitCode = 0
for (const args of invocations) {
  exitCode = runVitest(args)
  if (exitCode !== 0) break
}

process.exitCode = exitCode
