#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import {
  BUILD_ORDER,
  DESKTOP,
  INSTALL_ORDER,
  MIN_NODE,
  MIN_NPM,
  TEST_ORDER,
  assertDarwinPlatform,
  formatVersion,
  validateElectronRuntime,
  versionAtLeast,
  versionParts,
} from './eq0-contract.mjs'
import { installSignalCleanup } from './eq0-signal.mjs'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const npmCommand = 'npm'
const DESKTOP_PACKAGE = join(ROOT, DESKTOP, 'package.json')
const ELECTRON_PACKAGE = join(ROOT, DESKTOP, 'node_modules', 'electron')
const ELECTRON_INSTALL = join(ELECTRON_PACKAGE, 'install.js')
const ELECTRON_RUNTIME = join(ELECTRON_PACKAGE, 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')

function assertDarwin() {
  assertDarwinPlatform(process.platform)
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
  ensureDesktopRuntime()
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
  ensureDesktopRuntime()
}

function desktopRuntimePresent() {
  return existsSync(ELECTRON_RUNTIME)
}

function readPinnedElectronVersion() {
  const desktopPackage = JSON.parse(readFileSync(DESKTOP_PACKAGE, 'utf8'))
  const pinnedVersion = desktopPackage.dependencies?.electron ?? desktopPackage.devDependencies?.electron
  if (typeof pinnedVersion !== 'string') {
    throw new Error(`Electron version is not pinned in ${relative(ROOT, DESKTOP_PACKAGE)}`)
  }
  return pinnedVersion
}

function validateDesktopRuntime() {
  if (!desktopRuntimePresent()) {
    throw new Error(`Electron runtime is missing at ${relative(ROOT, ELECTRON_RUNTIME)}`)
  }

  const versionResult = runProcess(ELECTRON_RUNTIME, ['--version'], {
    cwd: join(ROOT, DESKTOP),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }, 'verify Electron runtime version')
  const archResult = runProcess('file', [ELECTRON_RUNTIME], {
    cwd: join(ROOT, DESKTOP),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }, 'verify Electron runtime architecture')
  const runtime = validateElectronRuntime({
    reportedVersion: versionResult.stdout,
    pinnedVersion: readPinnedElectronVersion(),
    architectureOutput: archResult.stdout,
  })
  console.log(`Electron runtime ready: version=v${runtime.version} arch=${runtime.architecture}`)
  return runtime
}

function ensureDesktopRuntime() {
  if (!desktopRuntimePresent()) return prepareDesktopRuntime()
  return validateDesktopRuntime()
}

function prepareDesktopRuntime() {
  if (desktopRuntimePresent()) return validateDesktopRuntime()
  if (!existsSync(ELECTRON_INSTALL)) {
    throw new Error(`Electron preparation script is missing at ${relative(ROOT, ELECTRON_INSTALL)}`)
  }
  runProcess(process.execPath, [ELECTRON_INSTALL], {
    cwd: join(ROOT, DESKTOP),
    stdio: 'inherit',
  }, 'prepare Electron runtime')
  return validateDesktopRuntime()
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
  if (!desktopRuntimePresent()) {
    throw new Error(`Electron runtime is missing at ${relative(ROOT, ELECTRON_RUNTIME)}; run npm run bootstrap first`)
  }

  // detached makes Electron the leader of an isolated POSIX process group.
  const child = spawn(ELECTRON_RUNTIME, ['.'], {
    cwd: desktopDir,
    detached: true,
    stdio: 'inherit',
  })
  installSignalCleanup({
    child,
    hostProcess: process,
    processGroupId: child.pid,
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
