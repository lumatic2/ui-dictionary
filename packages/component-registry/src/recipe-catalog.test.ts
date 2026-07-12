import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { recipeCatalog } from './recipe-catalog.generated.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(__dirname, '..')
const generatorScript = path.join(pkgRoot, 'scripts', 'build-recipe-catalog.mjs')

describe('recipeCatalog (generated)', () => {
  it('has 35 entries, one per recipes/*/*.md', () => {
    expect(recipeCatalog).toHaveLength(35)
  })

  it('has unique ids all prefixed with "recipe/"', () => {
    const ids = recipeCatalog.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id.startsWith('recipe/')).toBe(true)
  })

  it('is tagged with the "recipe" collection and has a positive default size', () => {
    for (const entry of recipeCatalog) {
      expect(entry.collection).toBe('recipe')
      expect(entry.defaultSize.width).toBeGreaterThan(0)
      expect(entry.defaultSize.height).toBeGreaterThan(0)
      expect(entry.defaultProps).toEqual({})
      expect(entry.variants).toEqual({})
    }
  })
})

describe('build-recipe-catalog.mjs generator', () => {
  it('exits non-zero with a clear error on a recipe with missing frontmatter', () => {
    const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'recipe-catalog-fixture-'))
    const outFile = path.join(fixtureRoot, 'out.generated.ts')
    try {
      const groupDir = path.join(fixtureRoot, 'forms')
      mkdirSync(groupDir, { recursive: true })
      // Missing pattern_group/code_asset - an invalid recipe.
      writeFileSync(
        path.join(groupDir, 'broken.md'),
        ['---', 'id: broken', 'name: "Broken"', '---', '', '## Intent', '', 'Broken fixture.', ''].join('\n'),
      )

      const result = spawnSync(process.execPath, [generatorScript], {
        cwd: pkgRoot,
        env: {
          ...process.env,
          RECIPE_CATALOG_SOURCE_DIR: fixtureRoot,
          RECIPE_CATALOG_OUT_FILE: outFile,
        },
        encoding: 'utf8',
      })

      expect(result.status).not.toBe(0)
      expect(result.stderr).toMatch(/missing required frontmatter field/)
    } finally {
      rmSync(fixtureRoot, { recursive: true, force: true })
    }
  })
})
