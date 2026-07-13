import assert from 'node:assert/strict'
import test from 'node:test'

import {
  BUILD_ORDER,
  INSTALL_ORDER,
  TEST_ORDER,
  assertDarwinPlatform,
  validateElectronRuntime,
} from './eq0-contract.mjs'

const EXPECTED_ORDER = [
  'packages/canvas-core',
  'packages/component-registry',
  'packages/agent-design-engine',
  'apps/agent-design',
  'apps/agent-design-bridge',
  'packages/agent-design-mcp',
  'apps/agent-design-desktop',
]

test('rejects non-Darwin hosts', () => {
  assert.throws(() => assertDarwinPlatform('win32'), /require macOS \(darwin\)/)
})

test('rejects an Electron version mismatch', () => {
  assert.throws(
    () => validateElectronRuntime({
      reportedVersion: 'v43.1.1',
      pinnedVersion: '43.1.0',
      architectureOutput: 'Mach-O 64-bit executable arm64',
    }),
    /Electron version mismatch: expected 43\.1\.0, found 43\.1\.1/,
  )
})

test('rejects a non-arm64 Electron runtime', () => {
  assert.throws(
    () => validateElectronRuntime({
      reportedVersion: 'v43.1.0',
      pinnedVersion: '43.1.0',
      architectureOutput: 'Mach-O 64-bit executable x86_64',
    }),
    /not Apple Silicon arm64/,
  )
})

test('keeps install, build, and test package order aligned', () => {
  assert.deepEqual(INSTALL_ORDER, EXPECTED_ORDER)
  assert.deepEqual(BUILD_ORDER, EXPECTED_ORDER)
  assert.deepEqual(TEST_ORDER, EXPECTED_ORDER)
})
