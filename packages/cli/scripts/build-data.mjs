// Bundles the repo SSOT (terms.yml, askewly.tokens.json, recipes/*.md, generated
// tokens.css) into packages/cli/data/*.json so the published package works offline.
// Run from packages/cli: `npm run build:data`. Fails (exit != 0) on missing sources.
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgRoot = path.resolve(__dirname, "..")
const repoRoot = path.resolve(pkgRoot, "..", "..")
const dataDir = path.join(pkgRoot, "data")

const require = createRequire(path.join(pkgRoot, "package.json"))
const YAML = require("yaml")

const TERM_FIELDS = [
  "id",
  "status",
  "category",
  "group",
  "kind",
  "ko",
  "en",
  "aliases",
  "one_liner",
  "description",
  "visual_anatomy",
  "when_to_use",
  "anti_use",
  "prompt_phrases",
  "related",
]

async function buildTerms() {
  const raw = await readFile(path.join(repoRoot, "docs", "ui-vocabulary", "terms.yml"), "utf8")
  const parsed = YAML.parse(raw)
  const list = Array.isArray(parsed) ? parsed : parsed.terms
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("terms.yml parsed to an empty list")
  }
  return list.map((term) => {
    const out = {}
    for (const field of TERM_FIELDS) {
      if (term[field] !== undefined) out[field] = term[field]
    }
    return out
  })
}

async function buildRecipes() {
  const recipesRoot = path.join(repoRoot, "recipes")
  const groups = await readdir(recipesRoot, { withFileTypes: true })
  const recipes = []
  for (const group of groups) {
    if (!group.isDirectory()) continue
    const files = await readdir(path.join(recipesRoot, group.name))
    for (const file of files) {
      if (!file.endsWith(".md")) continue
      const raw = await readFile(path.join(recipesRoot, group.name, file), "utf8")
      const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
      if (!match) {
        throw new Error(`recipe without frontmatter: ${group.name}/${file}`)
      }
      const frontmatter = YAML.parse(match[1])
      recipes.push({
        ...frontmatter,
        source_path: `recipes/${group.name}/${file}`,
        body: match[2].trim(),
      })
    }
  }
  if (recipes.length === 0) {
    throw new Error("no recipes found under recipes/")
  }
  return recipes
}

async function main() {
  await mkdir(dataDir, { recursive: true })

  const terms = await buildTerms()
  const tokens = JSON.parse(await readFile(path.join(repoRoot, "tokens", "askewly.tokens.json"), "utf8"))
  const tokensCss = await readFile(
    path.join(repoRoot, "examples", "ui-vocabulary-site", "src", "tokens.css"),
    "utf8"
  )
  const recipes = await buildRecipes()

  await writeFile(path.join(dataDir, "terms.json"), JSON.stringify(terms))
  await writeFile(path.join(dataDir, "tokens.json"), JSON.stringify(tokens))
  await writeFile(path.join(dataDir, "tokens.css"), tokensCss)
  await writeFile(path.join(dataDir, "recipes.json"), JSON.stringify(recipes))

  console.log(`data bundled: terms=${terms.length} recipes=${recipes.length}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
