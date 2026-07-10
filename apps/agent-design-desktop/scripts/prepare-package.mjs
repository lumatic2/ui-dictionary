import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { basename, relative, resolve } from 'node:path'
import { build } from 'esbuild'
import pngToIco from 'png-to-ico'

const appRoot = resolve(import.meta.dirname, '..')
const repoRoot = resolve(appRoot, '..', '..')
const staging = resolve(appRoot, 'staging')

await rm(staging, { recursive: true, force: true })
await Promise.all([
  mkdir(resolve(staging, 'renderer'), { recursive: true }),
  mkdir(resolve(staging, 'bridge'), { recursive: true }),
  mkdir(resolve(staging, 'mcp'), { recursive: true }),
  mkdir(resolve(staging, 'icons'), { recursive: true }),
])

await cp(resolve(repoRoot, 'apps', 'agent-design', 'dist'), resolve(staging, 'renderer'), { recursive: true })

const common = {
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: false,
  minify: false,
  legalComments: 'none',
  metafile: true,
  logLevel: 'info',
}

const bridge = await build({
  ...common,
  entryPoints: [resolve(repoRoot, 'apps', 'agent-design-bridge', 'src', 'desktop-child.ts')],
  outfile: resolve(staging, 'bridge', 'desktop-child.mjs'),
})
const mcp = await build({
  ...common,
  entryPoints: [resolve(repoRoot, 'packages', 'agent-design-mcp', 'src', 'cli.ts')],
  outfile: resolve(staging, 'mcp', 'cli.mjs'),
})

const iconSource = resolve(repoRoot, 'assets', 'app-icon-concepts', 'generated', 'askewly-favicon-purple-white-concept.png')
await writeFile(resolve(staging, 'icons', 'agent-design.ico'), await pngToIco(iconSource))

async function files(root) {
  const output = []
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = resolve(root, entry.name)
    if (entry.isDirectory()) output.push(...await files(path))
    else if (entry.isFile()) output.push(path)
  }
  return output
}

const stagedFiles = (await files(staging)).filter((path) => (
  basename(path) !== 'resource-manifest.json' && !path.startsWith(resolve(staging, 'icons'))
))
const resources = []
for (const path of stagedFiles.sort()) {
  const bytes = await readFile(path)
  resources.push({
    path: relative(staging, path).replaceAll('\\', '/'),
    bytes: bytes.byteLength,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  })
}

const bundledPackages = [...new Set([
  ...Object.keys(bridge.metafile?.inputs ?? {}),
  ...Object.keys(mcp.metafile?.inputs ?? {}),
].flatMap((input) => {
  const match = input.replaceAll('\\', '/').match(/node_modules\/(?:@[^/]+\/)?[^/]+/)
  return match ? [match[0].slice('node_modules/'.length)] : []
}))].sort()

await writeFile(resolve(staging, 'resource-manifest.json'), JSON.stringify({
  format: 'askewly.agent-design.resources',
  version: 1,
  classification: 'unsigned-development',
  resources,
  bundledPackages,
}, null, 2))

console.log(`prepared ${resources.length} packaged resources; bundled packages=${bundledPackages.length}`)
