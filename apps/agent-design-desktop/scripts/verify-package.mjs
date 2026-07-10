import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { extractFile, listPackage } from '@electron/asar'
import { FuseState, FuseV1Options, getCurrentFuseWire } from '@electron/fuses'

const root = resolve(import.meta.dirname, '..')
const packageRoot = resolve(root, 'out', 'Agent Design-win32-x64')
const resourcesRoot = resolve(packageRoot, 'resources')
const asarPath = resolve(resourcesRoot, 'app.asar')
const executablePath = resolve(packageRoot, 'AgentDesign.exe')
const makeRoot = resolve(root, 'out', 'make', 'squirrel.windows', 'x64')
const installerPath = resolve(makeRoot, 'AgentDesign-UnsignedDevelopment-Setup.exe')
const nupkgPath = resolve(makeRoot, 'agent_design-0.1.0-full.nupkg')
const releasesPath = resolve(makeRoot, 'RELEASES')
const resultsRoot = resolve(root, 'results', 'package')

function invariant(value, message) {
  if (!value) throw new Error(message)
}

async function requireFile(path) {
  const info = await stat(path)
  invariant(info.isFile() && info.size > 0, `missing or empty packaged file: ${path}`)
  return info
}

for (const path of [asarPath, executablePath, installerPath, nupkgPath, releasesPath]) {
  await requireFile(path)
}

const asarEntries = listPackage(asarPath).map((entry) => entry.replaceAll('\\', '/'))
for (const forbidden of ['/node_modules', '/src', '/test', '/scripts', '/staging', '/results', '/out']) {
  invariant(!asarEntries.some((entry) => entry === forbidden || entry.startsWith(`${forbidden}/`)), `forbidden ASAR entry: ${forbidden}`)
}
invariant(asarEntries.includes('/dist/main.js'), 'ASAR is missing the main process entry')
invariant(asarEntries.includes('/dist/preload.cjs'), 'ASAR is missing the preload entry')
invariant(!asarEntries.some((entry) => entry.endsWith('.map')), 'ASAR contains source maps')

const resourceManifestPath = resolve(resourcesRoot, 'resource-manifest.json')
const resourceManifest = JSON.parse(await readFile(resourceManifestPath, 'utf8'))
invariant(resourceManifest.classification === 'unsigned-development', 'resource classification must remain unsigned-development')
for (const resource of resourceManifest.resources) {
  const path = resolve(resourcesRoot, ...resource.path.split('/'))
  const bytes = await readFile(path)
  invariant(bytes.byteLength === resource.bytes, `resource size mismatch: ${resource.path}`)
  invariant(createHash('sha256').update(bytes).digest('hex') === resource.sha256, `resource hash mismatch: ${resource.path}`)
}
invariant(resourceManifest.resources.length === 5, 'unexpected packaged resource inventory')

const expectedFuses = new Map([
  [FuseV1Options.RunAsNode, FuseState.DISABLE],
  [FuseV1Options.EnableCookieEncryption, FuseState.ENABLE],
  [FuseV1Options.EnableNodeOptionsEnvironmentVariable, FuseState.DISABLE],
  [FuseV1Options.EnableNodeCliInspectArguments, FuseState.DISABLE],
  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation, FuseState.ENABLE],
  [FuseV1Options.OnlyLoadAppFromAsar, FuseState.ENABLE],
  [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot, FuseState.ENABLE],
  [FuseV1Options.GrantFileProtocolExtraPrivileges, FuseState.DISABLE],
  [FuseV1Options.WasmTrapHandlers, FuseState.ENABLE],
])
const fuses = await getCurrentFuseWire(executablePath)
invariant(fuses.version === '1', `unexpected fuse wire version: ${fuses.version}`)
for (const [option, state] of expectedFuses) {
  invariant(fuses[option] === state, `incorrect fuse ${FuseV1Options[option]}: ${fuses[option]}`)
}

const textBlobs = []
for (const entry of asarEntries.filter((entry) => /\.(?:js|cjs|json|html|css)$/.test(entry))) {
  textBlobs.push(extractFile(asarPath, entry.slice(1)).toString('utf8'))
}
for (const resource of resourceManifest.resources.filter((resource) => /\.(?:js|mjs|json|html|css)$/.test(resource.path))) {
  textBlobs.push(await readFile(resolve(resourcesRoot, ...resource.path.split('/')), 'utf8'))
}
const packagedText = textBlobs.join('\n')
for (const [name, pattern] of [
  ['development server URL', /https?:\/\/(?:localhost|127\.0\.0\.1):5173/i],
  ['source map directive', /sourceMappingURL\s*=/i],
  ['private key', /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/],
  ['embedded API key', /(?:sk-ant-|sk-proj-)[A-Za-z0-9_-]{16,}/],
  ['certificate password', /(?:certificate|cert|pfx)[_-]?password\s*[:=]\s*['"][^'"]+/i],
]) {
  invariant(!pattern.test(packagedText), `packaged payload contains ${name}`)
}

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
invariant(!packageJson.dependencies?.['electron-updater'], 'updater dependency is forbidden before signing')
const forgeConfig = await readFile(resolve(root, 'forge.config.cjs'), 'utf8')
invariant(/publishers:\s*\[\]/.test(forgeConfig), 'publishers must remain empty')
invariant(!/autoUpdater/.test(packagedText), 'packaged code must not enable auto update')

function signatureStatus(path) {
  const result = spawnSync('pwsh.exe', [
    '-NoProfile',
    '-Command',
    '(Get-AuthenticodeSignature -LiteralPath $env:AGENT_DESIGN_ARTIFACT).Status.ToString()',
  ], {
    encoding: 'utf8',
    env: { ...process.env, AGENT_DESIGN_ARTIFACT: path },
  })
  invariant(result.status === 0, `signature inspection failed: ${result.stderr}`)
  return result.stdout.trim()
}
invariant(signatureStatus(executablePath) === 'NotSigned', 'development executable unexpectedly has a signature')
invariant(signatureStatus(installerPath) === 'NotSigned', 'development installer unexpectedly has a signature')

await mkdir(resultsRoot, { recursive: true })
const packageRoots = [
  resolve(root, 'node_modules'),
  resolve(root, '..', 'agent-design', 'node_modules'),
  resolve(root, '..', 'agent-design-bridge', 'node_modules'),
  resolve(root, '..', '..', 'packages', 'agent-design-mcp', 'node_modules'),
]
async function packageComponent(name) {
  for (const packageRoot of packageRoots) {
    try {
      const manifest = JSON.parse(await readFile(resolve(packageRoot, ...name.split('/'), 'package.json'), 'utf8'))
      return {
        type: 'library',
        'bom-ref': `npm:${manifest.name}@${manifest.version}`,
        name: manifest.name,
        version: manifest.version,
        ...(typeof manifest.license === 'string' ? { licenses: [{ license: { id: manifest.license } }] } : {}),
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
  }
  throw new Error(`cannot resolve shipped package for SBOM: ${name}`)
}

const shippedPackageNames = [...new Set([
  'electron',
  'react',
  'react-dom',
  'scheduler',
  ...resourceManifest.bundledPackages,
])].sort()
const components = []
for (const name of shippedPackageNames) components.push(await packageComponent(name))
const sbom = {
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  version: 1,
  metadata: {
    tools: { components: [{ type: 'application', name: 'Agent Design package verifier', version: packageJson.version }] },
    component: { type: 'application', 'bom-ref': `${packageJson.name}@${packageJson.version}`, name: packageJson.name, version: packageJson.version },
  },
  components,
}
await writeFile(resolve(resultsRoot, 'sbom.cdx.json'), JSON.stringify(sbom, null, 2) + '\n')

const artifacts = []
for (const [name, path] of [
  ['portable-executable', executablePath],
  ['application-asar', asarPath],
  ['squirrel-installer', installerPath],
  ['squirrel-package', nupkgPath],
  ['squirrel-releases', releasesPath],
]) {
  const bytes = await readFile(path)
  artifacts.push({
    name,
    file: path.slice(root.length + 1).replaceAll('\\', '/'),
    bytes: bytes.byteLength,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  })
}

await writeFile(resolve(resultsRoot, 'artifact-manifest.json'), JSON.stringify({
  format: 'askewly.agent-design.desktop-artifacts',
  version: 1,
  platform: 'win32-x64',
  classification: 'unsigned-development',
  signed: false,
  updaterEnabled: false,
  publishersConfigured: false,
  fuseWire: Object.fromEntries([...expectedFuses].map(([option, state]) => [FuseV1Options[option], state === FuseState.ENABLE ? 'enabled' : 'disabled'])),
  artifacts,
}, null, 2) + '\n')

console.log(`package verification: PASS (${artifacts.length} artifacts, ${resourceManifest.resources.length} resources, ${expectedFuses.size} fuses)`)
