export const DESKTOP = 'apps/agent-design-desktop'

export const INSTALL_ORDER = Object.freeze([
  'packages/canvas-core',
  'packages/component-registry',
  'packages/agent-design-engine',
  'apps/agent-design',
  'apps/agent-design-bridge',
  'packages/agent-design-mcp',
  DESKTOP,
])

export const BUILD_ORDER = Object.freeze([...INSTALL_ORDER])
export const TEST_ORDER = Object.freeze([...INSTALL_ORDER])

export const MIN_NODE = Object.freeze([22, 12, 0])
export const MIN_NPM = Object.freeze([10, 0, 0])

export function assertDarwinPlatform(platform) {
  if (platform !== 'darwin') {
    throw new Error(`EQ0 Mac commands require macOS (darwin); found ${platform}`)
  }
}

export function versionParts(value, label) {
  const match = String(value).trim().match(/^v?(\d+)\.(\d+)\.(\d+)/)
  if (!match) throw new Error(`could not read ${label} version from ${JSON.stringify(value)}`)
  return match.slice(1).map(Number)
}

export function versionAtLeast(actual, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    if (actual[index] !== minimum[index]) return actual[index] > minimum[index]
  }
  return true
}

export function formatVersion(version) {
  return version.join('.')
}

function exactVersion(value, label) {
  const match = String(value).trim().match(/^v?(\d+\.\d+\.\d+)$/)
  if (!match) throw new Error(`could not read ${label} version from ${JSON.stringify(value)}`)
  return match[1]
}

export function validateElectronRuntime({ reportedVersion, pinnedVersion, architectureOutput }) {
  const actual = exactVersion(reportedVersion, 'Electron')
  const expected = exactVersion(pinnedVersion, 'pinned Electron')
  if (actual !== expected) {
    throw new Error(
      `Electron version mismatch: expected ${expected}, found ${actual}`,
    )
  }

  const architecture = String(architectureOutput ?? '').trim()
  if (!/\barm64\b/.test(architecture)) {
    throw new Error(`Electron runtime is not Apple Silicon arm64: ${architecture || '<empty>'}`)
  }

  return { version: actual, architecture: 'arm64' }
}
