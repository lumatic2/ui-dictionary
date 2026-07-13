#!/usr/bin/env node

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { installSignalCleanup } from './eq0-signal.mjs'

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
// Every AskewlyDesign runtime package in INSTALL_ORDER currently exposes test.
const TEST_ORDER = [...INSTALL_ORDER]

const MIN_NODE = [22, 12, 0]
const MIN_NPM = [10, 0, 0]
const npmCommand = 'npm'
const ELECTRON_PACKAGE = join(ROOT, DESKTOP, 'node_modules', 'electron')
const ELECTRON_INSTALL = join(ELECTRON_PACKAGE, 'install.js')
const ELECTRON_BIN = join(ROOT, DESKTOP, 'node_modules', '.bin', 'electron')
const ELECTRON_RUNTIME = join(ELECTRON_PACKAGE, 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')

function assertDarwin() {
  if (process.platform !== 'darwin') {
    throw new Error(`EQ0 Mac commands require macOS (darwin); found ${process.platform}`)
  }
}

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
  assertDarwin()
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

function runProcess(command, args, options, label) {
  const result = spawnSync(command, args, options)
  if (result.error) throw new Error(`${label} could not start: ${result.error.message}`)
  if (result.status !== 0) throw new Error(`${label} failed with exit code ${result.status ?? 'unknown'}`)
  return result
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
  return existsSync(ELECTRON_RUNTIME)
}

function prepareDesktopRuntime() {
  if (!existsSync(ELECTRON_INSTALL)) {
    throw new Error(`Electron preparation script is missing at ${relative(ROOT, ELECTRON_INSTALL)}`)
  }
  runProcess(process.execPath, [ELECTRON_INSTALL], {
    cwd: join(ROOT, DESKTOP),
    stdio: 'inherit',
  }, 'prepare Electron runtime')
  if (!desktopRuntimePresent()) {
    throw new Error(`Electron preparation did not produce ${relative(ROOT, ELECTRON_RUNTIME)}`)
  }
  const versionResult = runProcess(ELECTRON_BIN, ['--version'], {
    cwd: join(ROOT, DESKTOP),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }, 'verify Electron runtime version')
  const version = String(versionResult.stdout || '').trim()
  if (!/^v?\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Electron --version returned no parseable version: ${version || '<empty>'}`)
  }
  const archResult = runProcess('file', [ELECTRON_RUNTIME], {
    cwd: join(ROOT, DESKTOP),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }, 'verify Electron runtime architecture')
  if (!/\barm64\b/.test(String(archResult.stdout || ''))) {
    throw new Error(`Electron runtime is not arm64: ${String(archResult.stdout || '').trim()}`)
  }
  console.log(`Electron runtime ready: version=${version} arch=arm64`)
}

function buildAll() {
  for (const relativePath of BUILD_ORDER) {
    runNpm(relativePath, ['run', 'build'], `build ${relativePath}`)
  }
}

function testAll() {
  for (const relativePath of TEST_ORDER) {
    runNpm(relativePath, ['run', 'test'], `test ${relativePath}`)
  }
}

function launchDesktop() {
  const desktopDir = join(ROOT, DESKTOP)
  if (!existsSync(ELECTRON_BIN)) {
    throw new Error(`Electron is missing at ${relative(ROOT, ELECTRON_BIN)}; run npm run bootstrap first`)
  }

  const child = spawn(ELECTRON_BIN, ['.'], { cwd: desktopDir, stdio: 'inherit' })
  installSignalCleanup({
    child,
    hostProcess: process,
    onError: (error) => {
      console.error(`AskewlyDesign launch failed: ${error.message}`)
      process.exitCode = 1
    },
    onExit: (code, signal) => {
      process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 143)
    },
  })
}

function usage() {
  console.error('Usage: node scripts/eq0-mac.mjs <bootstrap|build|dev|test>')
}

const mode = process.argv[2]
try {
  assertDarwin()
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
