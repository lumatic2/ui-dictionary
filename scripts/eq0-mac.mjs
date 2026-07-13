#!/usr/bin/env node

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const DESKTOP = 'apps/agent-design-desktop'

// Keep this graph explicit. Each entry has its own package.json and lockfile;
// this is orchestration, not a root workspace migration.
const INSTALL_ORDER = [
  'packages/canvas-core',
  'packages/component-registry',
  'packages/agent-design-engine',
  'apps/agent-design',
  'apps/agent-design-bridge',
  'packages/agent-design-mcp',
  DESKTOP,
]

const BUILD_ORDER = [...INSTALL_ORDER]
const TEST_ORDER = [
  'packages/canvas-core',
  'apps/agent-design',
  'apps/agent-design-bridge',
  DESKTOP,
]

const MIN_NODE = [22, 12, 0]
const MIN_NPM = [10, 0, 0]
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function versionParts(value, label) {
  const match = String(value).trim().match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) throw new Error(`could not read ${label} version from ${JSON.stringify(value)}`)
  return match.slice(1).map(Number)
}

function versionAtLeast(actual, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    if (actual[index] !== minimum[index]) return actual[index] > minimum[index]
  }
  return true
}

function formatVersion(version) {
  return version.join('.')
}

function checkPrerequisites() {
  const nodeVersion = versionParts(process.versions.node, 'Node')
  if (!versionAtLeast(nodeVersion, MIN_NODE)) {
    throw new Error(`Node ${formatVersion(MIN_NODE)} or newer is required; found ${formatVersion(nodeVersion)}`)
  }

  const npm = spawnSync(npmCommand, ['--version'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (npm.error || npm.status !== 0) {
    throw new Error('npm is required but could not be executed; install npm 10 or newer and retry')
  }
  const npmVersion = versionParts(npm.stdout, 'npm')
  if (!versionAtLeast(npmVersion, MIN_NPM)) {
    throw new Error(`npm ${formatVersion(MIN_NPM)} or newer is required; found ${formatVersion(npmVersion)}`)
  }
}

function assertPackage(relativePath) {
  const packageDir = join(ROOT, relativePath)
  if (!existsSync(join(packageDir, 'package.json')) || !existsSync(join(packageDir, 'package-lock.json'))) {
    throw new Error(`expected package.json and package-lock.json in ${relativePath}`)
  }
  return packageDir
}

function runNpm(relativePath, args, label) {
  assertPackage(relativePath)
  const result = spawnSync(npmCommand, ['--prefix', relativePath, ...args], {
    cwd: ROOT,
    stdio: 'inherit',
  })
  if (result.error) throw new Error(`${label} could not start: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`${label} failed with exit code ${result.status ?? 'unknown'}`)
}

function installAll() {
  for (const relativePath of INSTALL_ORDER) {
    runNpm(relativePath, ['ci', '--ignore-scripts'], `install ${relativePath}`)
  }
  prepareDesktopRuntime()
}

function missingDependencies() {
  return INSTALL_ORDER.filter((relativePath) => !existsSync(join(ROOT, relativePath, 'node_modules')))
}

function ensureDependencies() {
  const missing = missingDependencies()
  if (missing.length > 0) {
    console.log(`Missing package dependencies: ${missing.join(', ')}`)
    console.log('Running the fixed package-local npm ci sequence...')
    installAll()
    return
  }
  if (!desktopRuntimePresent()) prepareDesktopRuntime()
}

function desktopRuntimePresent() {
  const runtime = process.platform === 'darwin'
    ? join(ROOT, DESKTOP, 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')
    : join(ROOT, DESKTOP, 'node_modules', 'electron', 'dist', process.platform === 'win32' ? 'electron.exe' : 'electron')
  return existsSync(runtime)
}

function prepareDesktopRuntime() {
  runNpm(DESKTOP, ['--ignore-scripts', 'exec', '--', 'electron', '--version'], 'prepare Electron runtime')
}

function buildAll() {
  for (const relativePath of BUILD_ORDER) {
    runNpm(relativePath, ['--ignore-scripts', 'run', 'build'], `build ${relativePath}`)
  }
}

function testAll() {
  for (const relativePath of TEST_ORDER) {
    runNpm(relativePath, ['--ignore-scripts', 'run', 'test'], `test ${relativePath}`)
  }
}

function launchDesktop() {
  const desktopDir = join(ROOT, DESKTOP)
  const electron = join(desktopDir, 'node_modules', '.bin', process.platform === 'win32' ? 'electron.cmd' : 'electron')
  if (!existsSync(electron)) {
    throw new Error(`Electron is missing at ${relative(ROOT, electron)}; run npm run bootstrap first`)
  }

  const child = spawn(electron, ['.'], { cwd: desktopDir, stdio: 'inherit' })
  let finished = false
  const finish = (code) => {
    if (finished) return
    finished = true
    process.exitCode = code
  }
  const forward = (signal) => {
    if (!child.killed) child.kill(signal)
  }
  process.once('SIGINT', () => forward('SIGINT'))
  process.once('SIGTERM', () => forward('SIGTERM'))
  child.on('error', (error) => {
    console.error(`AskewlyDesign launch failed: ${error.message}`)
    finish(1)
  })
  child.on('exit', (code, signal) => {
    const exitCode = code ?? (signal === 'SIGINT' ? 130 : 143)
    finish(exitCode)
  })
}

function usage() {
  console.error('Usage: node scripts/eq0-mac.mjs <bootstrap|build|dev|test>')
}

const mode = process.argv[2]
try {
  if (!['bootstrap', 'build', 'dev', 'test'].includes(mode)) {
    usage()
    process.exitCode = 2
  } else {
    checkPrerequisites()
    if (mode === 'bootstrap') {
      installAll()
      buildAll()
    } else if (mode === 'build') {
      ensureDependencies()
      buildAll()
    } else if (mode === 'test') {
      ensureDependencies()
      buildAll()
      testAll()
    } else {
      ensureDependencies()
      buildAll()
      launchDesktop()
    }
  }
} catch (error) {
  console.error(`EQ0 Mac command failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
