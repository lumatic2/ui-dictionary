// Derives packages/component-registry/src/recipe-catalog.generated.ts from the
// recipes/*/*.md frontmatter SSOT (see docs/design-system/recipe-format.md).
// Run from packages/component-registry: `npm run build:catalog`.
// Follows the same pattern as packages/cli/scripts/build-data.mjs: read SSOT,
// fail loudly (exit != 0) on any missing/invalid recipe, write a generated file.
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(pkgRoot, '..', '..')
// Overridable for tests only, so the "fails loudly on bad frontmatter" case
// can point at a disposable temp fixture instead of the real recipes/ tree.
const recipesRoot = process.env.RECIPE_CATALOG_SOURCE_DIR
  ? path.resolve(process.env.RECIPE_CATALOG_SOURCE_DIR)
  : path.join(repoRoot, 'recipes')
const outFile = process.env.RECIPE_CATALOG_OUT_FILE
  ? path.resolve(process.env.RECIPE_CATALOG_OUT_FILE)
  : path.join(pkgRoot, 'src', 'recipe-catalog.generated.ts')

const require = createRequire(path.join(pkgRoot, 'package.json'))
const YAML = require('yaml')

// Human-readable category label per the 10 canonical pattern_group values
// (docs/design-system/pattern-taxonomy.md §3). No fallback: an unknown
// pattern_group is a frontmatter contract violation and must fail loudly.
const CATEGORY_BY_PATTERN_GROUP = {
  'application-ui': 'Application UI',
  commerce: 'Commerce',
  'data-display': 'Data Display',
  docs: 'Docs',
  feedback: 'Feedback',
  forms: 'Forms',
  layout: 'Layout',
  marketing: 'Marketing',
  navigation: 'Navigation',
  overlays: 'Overlays',
}

// Reasonable default canvas insertion size per pattern_group, in px.
// Recipes are compositions rather than parameterized primitives, so these are
// deliberately coarse constants rather than per-recipe measurements:
// - overlays: a popover/sheet-sized surface (360x480)
// - navigation: a bar-shaped strip (390x80 - mobile tab bar width x bar height)
// - the rest: a content block sized for its typical desktop context
// `layout` is the one group where a recipe can be a full mobile screen rather
// than a page section - if a layout recipe is mobile-only (surface_refs is
// exactly ['mobile-apps']) it gets a full mobile viewport (390x844) instead of
// the 800x600 desktop default.
const DESKTOP_SIZE_BY_PATTERN_GROUP = {
  'application-ui': { width: 480, height: 360 },
  commerce: { width: 480, height: 600 },
  'data-display': { width: 640, height: 400 },
  docs: { width: 800, height: 600 },
  feedback: { width: 400, height: 160 },
  forms: { width: 480, height: 400 },
  layout: { width: 800, height: 600 },
  marketing: { width: 960, height: 480 },
  navigation: { width: 390, height: 80 },
  overlays: { width: 360, height: 480 },
}
const MOBILE_FULL_SCREEN_SIZE = { width: 390, height: 844 }

function fail(message) {
  console.error(`build-recipe-catalog: ${message}`)
  process.exit(1)
}

function defaultSizeFor(patternGroup, surfaceRefs) {
  const isMobileOnly = Array.isArray(surfaceRefs) && surfaceRefs.length === 1 && surfaceRefs[0] === 'mobile-apps'
  if (patternGroup === 'layout' && isMobileOnly) return MOBILE_FULL_SCREEN_SIZE
  return DESKTOP_SIZE_BY_PATTERN_GROUP[patternGroup]
}

// Pulls the first sentence of the `## Intent` section body as the entry
// description (recipes have no dedicated summary/description frontmatter
// field per docs/design-system/recipe-format.md).
function extractDescription(body, recipePath) {
  const introMatch = body.match(/##\s*Intent\s*\n+([\s\S]*?)(?=\n##\s|$)/i)
  if (!introMatch) fail(`${recipePath}: missing required "## Intent" section`)
  const paragraph = introMatch[1]
    .trim()
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ')
    .trim()
  if (!paragraph) fail(`${recipePath}: "## Intent" section is empty`)
  const sentenceMatch = paragraph.match(/^.*?[.!?](?=\s|$)/)
  const description = (sentenceMatch ? sentenceMatch[0] : paragraph).trim()
  if (!description) fail(`${recipePath}: could not derive a description from "## Intent"`)
  return description
}

async function loadRecipeFiles() {
  const groups = await readdir(recipesRoot, { withFileTypes: true })
  const files = []
  for (const group of groups) {
    if (!group.isDirectory()) continue
    const entries = await readdir(path.join(recipesRoot, group.name))
    for (const file of entries) {
      if (!file.endsWith('.md')) continue
      files.push({ group: group.name, file, relPath: `recipes/${group.name}/${file}` })
    }
  }
  if (files.length === 0) fail('no recipes found under recipes/')
  // Sort by relative path so generator output is deterministic regardless of
  // filesystem readdir ordering.
  files.sort((a, b) => a.relPath.localeCompare(b.relPath))
  return files
}

function parseFrontmatter(raw, relPath) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) fail(`${relPath}: missing frontmatter block`)
  let frontmatter
  try {
    frontmatter = YAML.parse(match[1])
  } catch (error) {
    fail(`${relPath}: invalid frontmatter YAML (${error.message})`)
  }
  if (!frontmatter || typeof frontmatter !== 'object') fail(`${relPath}: frontmatter did not parse to an object`)
  return { frontmatter, body: match[2] }
}

const REQUIRED_FRONTMATTER_FIELDS = ['id', 'name', 'pattern_group', 'code_asset']

function validateFrontmatter(frontmatter, relPath) {
  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    const value = frontmatter[field]
    if (value === undefined || value === null || value === '') {
      fail(`${relPath}: missing required frontmatter field "${field}"`)
    }
  }
  if (!CATEGORY_BY_PATTERN_GROUP[frontmatter.pattern_group]) {
    fail(`${relPath}: unknown pattern_group "${frontmatter.pattern_group}"`)
  }
}

async function buildRecipeCatalog() {
  const files = await loadRecipeFiles()
  const entries = []
  const seenIds = new Set()

  for (const { group, file, relPath } of files) {
    const raw = await readFile(path.join(recipesRoot, group, file), 'utf8')
    const { frontmatter, body } = parseFrontmatter(raw, relPath)
    validateFrontmatter(frontmatter, relPath)

    const id = `recipe/${frontmatter.id}`
    if (seenIds.has(id)) fail(`${relPath}: duplicate recipe id "${frontmatter.id}"`)
    seenIds.add(id)

    const description = extractDescription(body, relPath)
    const termRefs = Array.isArray(frontmatter.term_refs) ? frontmatter.term_refs : []
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
    const keywords = [...new Set([...termRefs, ...tags])]

    entries.push({
      id,
      slug: frontmatter.id,
      name: frontmatter.name,
      collection: 'recipe',
      category: CATEGORY_BY_PATTERN_GROUP[frontmatter.pattern_group],
      description,
      defaultSize: defaultSizeFor(frontmatter.pattern_group, frontmatter.surface_refs),
      defaultProps: {},
      variants: {},
      keywords,
    })
  }

  return entries
}

function renderEntry(entry) {
  const lines = []
  lines.push('  {')
  lines.push(`    id: ${JSON.stringify(entry.id)},`)
  lines.push(`    slug: ${JSON.stringify(entry.slug)},`)
  lines.push(`    name: ${JSON.stringify(entry.name)},`)
  lines.push(`    collection: 'recipe',`)
  lines.push(`    category: ${JSON.stringify(entry.category)},`)
  lines.push(`    description: ${JSON.stringify(entry.description)},`)
  lines.push(`    defaultSize: { width: ${entry.defaultSize.width}, height: ${entry.defaultSize.height} },`)
  lines.push('    defaultProps: {},')
  lines.push('    variants: {},')
  lines.push(`    keywords: ${JSON.stringify(entry.keywords)},`)
  lines.push('  },')
  return lines.join('\n')
}

function renderFile(entries) {
  return [
    '// AUTO-GENERATED by packages/component-registry/scripts/build-recipe-catalog.mjs',
    '// Source of truth: recipes/*/*.md frontmatter. Do not edit by hand -',
    '// run `npm run build:catalog` from packages/component-registry to regenerate.',
    "import type { RegistryEntry } from './types.js'",
    '',
    'export const recipeCatalog: RegistryEntry[] = [',
    entries.map(renderEntry).join('\n'),
    ']',
    '',
  ].join('\n')
}

async function main() {
  const entries = await buildRecipeCatalog()
  const content = renderFile(entries)
  await writeFile(outFile, content)
  console.log(`recipe catalog generated: ${entries.length} entries -> ${path.relative(repoRoot, outFile)}`)
}

main().catch((error) => {
  console.error(error.stack || error.message)
  process.exit(1)
})
