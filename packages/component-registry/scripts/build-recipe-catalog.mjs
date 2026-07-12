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
const sourcesOutFile = process.env.RECIPE_SOURCES_OUT_FILE
  ? path.resolve(process.env.RECIPE_SOURCES_OUT_FILE)
  : path.join(pkgRoot, 'src', 'recipe-sources.generated.ts')

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

// --- Recipe source embedding ------------------------------------------------
//
// For each recipe, `code_asset` points at its real standalone implementation
// under examples/ui-vocabulary-site/src/components/. We embed that file's
// content verbatim (plus a header comment and injected identity markers) into
// recipe-sources.generated.ts so planMaterializeRegistryNode can write the
// real implementation instead of a generic skeleton for recipe nodes.
//
// Locating "the root JSX element of the main exported component" without a
// full JS/TS parser is done with a small brace/string-aware scanner:
//   1. Find every top-level `function Name(...)` declaration that is exported
//      (either directly via `export function`, or via a trailing
//      `export { Name, ... }` list - the shadcn/ui primitive files use this
//      style).
//   2. Take the LAST such exported function in source order. Several recipes
//      define a props-driven component first and a self-contained "...Demo"
//      wrapper after it (e.g. cart-drawer.tsx: CartDrawerBody then
//      CartDrawer); the last-declared export consistently picks the
//      self-contained, ready-to-render composition, which is what a
//      materialized canvas file wants.
//   3. Within that function's own body (excluding nested function/arrow
//      scopes, so e.g. a `.map((item) => { ... return ... })` callback's
//      return does not count), require EXACTLY ONE `return` that yields JSX
//      (`return (<Tag` or `return <Tag`). Zero or more than one is treated as
//      an unlocatable root and fails the build loudly, naming the recipe slug.

function skipString(source, i, quote) {
  i++
  const n = source.length
  while (i < n) {
    const ch = source[i]
    if (ch === '\\') { i += 2; continue }
    if (quote === '`' && ch === '$' && source[i + 1] === '{') {
      i = skipBalanced(source, i + 2, '{', '}')
      continue
    }
    if (ch === quote) return i
    i++
  }
  return i
}

// Scans forward from just past an opening delimiter (already consumed by the
// caller), tracking nested strings/comments/delimiters, and returns the index
// of the matching close delimiter.
function skipBalanced(source, i, open, close) {
  let depth = 1
  const n = source.length
  while (i < n) {
    const ch = source[i]
    if (ch === '"' || ch === "'" || ch === '`') { i = skipString(source, i, ch) + 1; continue }
    if (ch === '/' && source[i + 1] === '/') { const nl = source.indexOf('\n', i); i = nl === -1 ? n : nl + 1; continue }
    if (ch === '/' && source[i + 1] === '*') { const c = source.indexOf('*/', i + 2); i = c === -1 ? n : c + 2; continue }
    if (ch === open) { depth++; i++; continue }
    if (ch === close) { depth--; if (depth === 0) return i; i++; continue }
    i++
  }
  return i
}

function findBodyEnd(source, openBraceIndex) {
  return skipBalanced(source, openBraceIndex + 1, '{', '}')
}

// Collects indices of `return` keywords that (a) belong directly to the
// function body spanning [bodyStart, bodyEnd) - not to a nested function/arrow
// scope inside it - and (b) are immediately followed by JSX (`(` + `<` or a
// bare `<`).
function collectOwnJsxReturns(source, bodyStart, bodyEnd) {
  const hits = []
  let i = bodyStart
  while (i < bodyEnd) {
    const ch = source[i]
    if (ch === '"' || ch === "'" || ch === '`') { i = skipString(source, i, ch) + 1; continue }
    if (ch === '/' && source[i + 1] === '/') { const nl = source.indexOf('\n', i); i = nl === -1 ? bodyEnd : nl + 1; continue }
    if (ch === '/' && source[i + 1] === '*') { const c = source.indexOf('*/', i + 2); i = c === -1 ? bodyEnd : c + 2; continue }

    if (/^function\b/.test(source.slice(i, i + 9))) {
      const header = /^function\b[^{]*\{/.exec(source.slice(i, Math.min(i + 2000, bodyEnd)))
      if (header) {
        const braceIdx = i + header[0].length - 1
        i = findBodyEnd(source, braceIdx) + 1
        continue
      }
    }
    const arrowBlock = /^\s*=>\s*\{/.exec(source.slice(i, i + 20))
    if (arrowBlock) {
      const braceIdx = i + arrowBlock[0].length - 1
      i = findBodyEnd(source, braceIdx) + 1
      continue
    }

    if (/^return\b/.test(source.slice(i, i + 7))) {
      const after = source.slice(i + 6)
      if (/^\s*\(\s*[\r\n]*\s*</.test(after) || /^\s+</.test(after)) hits.push(i)
      i += 6
      continue
    }
    i++
  }
  return hits
}

// Finds every top-level `function Name(` declaration in the file, recording
// whether it is exported directly (`export function`) and the index of the
// function body's opening brace.
function findFunctionDeclarations(source) {
  const results = []
  const declRe = /(?:^|\n)(export\s+)?function\s+([A-Za-z0-9_]+)\s*\(/g
  let m
  while ((m = declRe.exec(source))) {
    const parenOpenIdx = m.index + m[0].length - 1
    const parenCloseIdx = skipBalanced(source, parenOpenIdx + 1, '(', ')')
    const bodyOpenIdx = source.indexOf('{', parenCloseIdx + 1)
    results.push({ name: m[2], isDirectExport: Boolean(m[1]), bodyOpenIdx })
  }
  return results
}

// Names appearing in any trailing `export { A, B as C, ... }` statement.
function findTrailingExportListNames(source) {
  const names = new Set()
  const re = /export\s*\{([^}]*)\}/g
  let m
  while ((m = re.exec(source))) {
    for (const part of m[1].split(',')) {
      const trimmed = part.trim()
      if (!trimmed) continue
      names.add(trimmed.split(/\s+as\s+/)[0].trim())
    }
  }
  return names
}

// Given a recipe's raw code_asset source, locates the root JSX element of the
// last exported top-level function and splices in the three
// data-agent-design-* marker placeholders right after its opening tag name.
// Fails loudly (throws, caller turns this into a process.exit(1)) if it
// cannot find exactly one exported function with exactly one own JSX return.
function embedIdentityMarkers(source, relPath) {
  const fns = findFunctionDeclarations(source)
  const exportListNames = findTrailingExportListNames(source)
  const exported = fns.filter((f) => f.isDirectExport || exportListNames.has(f.name))
  if (exported.length === 0) throw new Error(`${relPath}: no exported top-level function found`)

  const last = exported[exported.length - 1]
  const bodyEnd = findBodyEnd(source, last.bodyOpenIdx)
  const hits = collectOwnJsxReturns(source, last.bodyOpenIdx + 1, bodyEnd)
  if (hits.length !== 1) {
    throw new Error(
      `${relPath}: cannot confidently locate the root JSX element of exported function "${last.name}" ` +
        `(expected exactly 1 own JSX return, found ${hits.length})`,
    )
  }

  const returnIdx = hits[0]
  const ltIndex = source.indexOf('<', returnIdx + 6)
  const tagMatch = ltIndex === -1 ? null : /^<([A-Za-z][A-Za-z0-9.]*)/.exec(source.slice(ltIndex))
  if (!tagMatch) throw new Error(`${relPath}: could not locate an opening JSX tag for exported function "${last.name}"`)

  const insertionIdx = ltIndex + tagMatch[0].length
  const markers =
    '\n      data-agent-design-id="__AD_NODE_ID__"' +
    '\n      data-agent-design-name="__AD_NODE_NAME__"' +
    '\n      data-agent-design-label="__AD_NODE_LABEL__"'
  const source_ = source.slice(0, insertionIdx) + markers + source.slice(insertionIdx)
  return { exportName: last.name, source: source_ }
}

function buildRecipeSourceEntry(frontmatter, relPath) {
  const codeAssetPath = path.join(repoRoot, frontmatter.code_asset)
  return readFile(codeAssetPath, 'utf8').then((raw) => {
    let embedded
    try {
      embedded = embedIdentityMarkers(raw, frontmatter.code_asset)
    } catch (error) {
      fail(`${relPath}: ${error.message}`)
    }
    const header = [
      '// Materialized from the Askewly recipe catalog',
      `// (source recipe: ${relPath}, code_asset: ${frontmatter.code_asset}).`,
      '// This file may require the project to provide its own imports',
      '// (shadcn/ui primitives, lucide-react, etc.) to compile.',
      '',
      '',
    ].join('\n')
    return { slug: frontmatter.id, exportName: embedded.exportName, source: header + embedded.source }
  })
}

function renderSourcesFile(entries) {
  const lines = []
  lines.push('// AUTO-GENERATED by packages/component-registry/scripts/build-recipe-catalog.mjs')
  lines.push('// Source of truth: recipes/*/*.md `code_asset` files. Do not edit by hand -')
  lines.push('// run `npm run build:catalog` from packages/component-registry to regenerate.')
  lines.push('//')
  lines.push('// Each entry embeds a recipe\'s real standalone implementation source with')
  lines.push('// __AD_NODE_ID__/__AD_NODE_NAME__/__AD_NODE_LABEL__ placeholders spliced into')
  lines.push('// the root JSX element of its main exported component, for')
  lines.push('// planMaterializeRegistryNode (src/materialize.ts) to fill in at materialize time.')
  lines.push('export interface RecipeSourceEntry {')
  lines.push('  /** The exported identifier materialize.ts renames on file-name collision. */')
  lines.push('  exportName: string')
  lines.push('  /** Full .tsx source with __AD_NODE_ID__/__AD_NODE_NAME__/__AD_NODE_LABEL__ placeholders. */')
  lines.push('  source: string')
  lines.push('}')
  lines.push('')
  lines.push('export const recipeSources: Record<string, RecipeSourceEntry> = {')
  for (const entry of entries) {
    lines.push(`  ${JSON.stringify(entry.slug)}: {`)
    lines.push(`    exportName: ${JSON.stringify(entry.exportName)},`)
    lines.push(`    source: ${JSON.stringify(entry.source)},`)
    lines.push('  },')
  }
  lines.push('}')
  lines.push('')
  return lines.join('\n')
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
  const sourceEntries = []
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

    sourceEntries.push(await buildRecipeSourceEntry(frontmatter, relPath))
  }

  return { entries, sourceEntries }
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
  const { entries, sourceEntries } = await buildRecipeCatalog()
  const content = renderFile(entries)
  await writeFile(outFile, content)
  console.log(`recipe catalog generated: ${entries.length} entries -> ${path.relative(repoRoot, outFile)}`)

  const sourcesContent = renderSourcesFile(sourceEntries)
  await writeFile(sourcesOutFile, sourcesContent)
  console.log(`recipe sources generated: ${sourceEntries.length} entries -> ${path.relative(repoRoot, sourcesOutFile)}`)
}

main().catch((error) => {
  console.error(error.stack || error.message)
  process.exit(1)
})
