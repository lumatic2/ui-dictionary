import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { resolveAppAsset } from '../src/asset-path'

const roots: string[] = []

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

async function fixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'agent-design-desktop-'))
  roots.push(root)
  await mkdir(join(root, 'assets'))
  await writeFile(join(root, 'index.html'), '<main>Agent Design</main>')
  await writeFile(join(root, 'assets', 'app.js'), 'export {}')
  return root
}

describe('app protocol asset containment', () => {
  it('resolves root and nested renderer assets', async () => {
    const root = await fixture()
    await expect(resolveAppAsset(root, '/')).resolves.toBe(join(root, 'index.html'))
    await expect(resolveAppAsset(root, '/assets/app.js')).resolves.toBe(join(root, 'assets', 'app.js'))
  })

  it('rejects traversal outside the renderer build', async () => {
    const root = await fixture()
    await expect(resolveAppAsset(root, '/../outside.txt')).rejects.toThrow()
    await expect(resolveAppAsset(root, '/%2e%2e/outside.txt')).rejects.toThrow()
  })
})
