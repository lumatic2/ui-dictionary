import { createRequire } from "node:module"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const siteRoot = path.join(root, "examples", "ui-vocabulary-site")
const require = createRequire(path.join(siteRoot, "package.json"))
const YAML = require("yaml")

const termsPath = path.join(root, "docs", "ui-vocabulary", "terms.yml")
const sourcesPath = path.join(root, "docs", "ui-vocabulary", "sources.md")
const outputPath = path.join(siteRoot, "src", "data", "terms.generated.ts")

const requiredFields = [
  "id",
  "status",
  "category",
  "ko",
  "en",
  "one_liner",
  "description",
  "visual_anatomy",
  "when_to_use",
  "anti_use",
  "prompt_phrases",
  "asset",
  "sources",
  "confidence",
]

const validKinds = new Set([
  "component",
  "block",
  "form-pattern",
  "visual-effect",
  "motion-pattern",
  "visual-treatment",
])

const validNavigationRoots = new Set(["Docs", "Plus", "Index"])

function parseSourceRegistry(sourcesText) {
  const registry = []
  const seen = new Set()
  const lines = sourcesText.split(/\r?\n/)
  let tier = null
  let tierLabel = null

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const tierMatch = line.match(/^### Tier ([A-Z])\b/)

    if (tierMatch) {
      tier = tierMatch[1]
      tierLabel = line.replace(/^###\s+/, "").trim()
      continue
    }

    const sourceMatch = line.match(/^- `([^`]+)`: (.+?)\s*$/)

    if (!sourceMatch) {
      continue
    }

    const [, id, label] = sourceMatch
    const url = lines[index + 1]?.trim()

    if (!tier || !tierLabel) {
      throw new Error(`${id} is listed before a source tier heading`)
    }
    if (!url?.startsWith("https://")) {
      throw new Error(`${id} needs an https URL on the next line`)
    }
    if (seen.has(id)) {
      throw new Error(`duplicate source id: ${id}`)
    }

    seen.add(id)
    registry.push({
      id,
      label: label.trim(),
      tier,
      tierLabel,
      url,
    })
  }

  if (registry.length === 0) {
    throw new Error("sources.md must register at least one source id")
  }

  return registry
}

function assertTerm(term, sourceIds) {
  for (const field of requiredFields) {
    if (!(field in term)) {
      throw new Error(`${term.id ?? "unknown"} is missing ${field}`)
    }
  }
  if (!term.ko?.name || !term.en?.name) {
    throw new Error(`${term.id} is missing ko/en name`)
  }
  if (term.kind && !validKinds.has(term.kind)) {
    throw new Error(`${term.id} has invalid kind: ${term.kind}`)
  }
  if (!Array.isArray(term.prompt_phrases) || term.prompt_phrases.length === 0) {
    throw new Error(`${term.id} needs prompt_phrases`)
  }
  if (!Array.isArray(term.visual_anatomy) || term.visual_anatomy.length === 0) {
    throw new Error(`${term.id} needs visual_anatomy`)
  }
  if (!Array.isArray(term.sources) || term.sources.length === 0) {
    throw new Error(`${term.id} needs sources`)
  }
  for (const source of term.sources) {
    if (!source?.source_id) {
      throw new Error(`${term.id} has a source without source_id`)
    }
    if (!sourceIds.has(source.source_id)) {
      throw new Error(`${term.id} has unknown source_id: ${source.source_id}`)
    }
  }
  if (term.navigation) {
    assertNavigation(term)
  }
}

function assertPath(termId, field, pathValue) {
  if (!Array.isArray(pathValue) || pathValue.length === 0) {
    throw new Error(`${termId} navigation.${field} must be a non-empty list`)
  }
  for (const segment of pathValue) {
    if (typeof segment !== "string" || segment.trim().length === 0) {
      throw new Error(`${termId} navigation.${field} contains an invalid path segment`)
    }
  }
  if (!validNavigationRoots.has(pathValue[0])) {
    throw new Error(`${termId} navigation.${field} must start with Docs, Plus, or Index`)
  }
}

function assertNavigation(term) {
  const navigation = term.navigation

  if (typeof navigation !== "object" || Array.isArray(navigation)) {
    throw new Error(`${term.id} navigation must be a mapping`)
  }
  if (!("canonical_path" in navigation)) {
    throw new Error(`${term.id} navigation.canonical_path is required when navigation is present`)
  }

  assertPath(term.id, "canonical_path", navigation.canonical_path)

  if ("also_appears_in" in navigation) {
    if (!Array.isArray(navigation.also_appears_in)) {
      throw new Error(`${term.id} navigation.also_appears_in must be a list of paths`)
    }
    for (const pathValue of navigation.also_appears_in) {
      assertPath(term.id, "also_appears_in", pathValue)
    }
  }
}

const yamlText = await readFile(termsPath, "utf8")
const sourcesText = await readFile(sourcesPath, "utf8")
const terms = YAML.parse(yamlText)
const sourceRegistry = parseSourceRegistry(sourcesText)
const sourceIds = new Set(sourceRegistry.map((source) => source.id))

if (!Array.isArray(terms)) {
  throw new Error("terms.yml must be a list")
}
if (sourceIds.size === 0) {
  throw new Error("sources.md must register at least one source id")
}

const ids = new Set()
for (const term of terms) {
  assertTerm(term, sourceIds)
  if (ids.has(term.id)) {
    throw new Error(`duplicate term id: ${term.id}`)
  }
  ids.add(term.id)
}

const normalizedTerms = terms.map((term) => ({
  kind: "component",
  ...term,
}))
const categories = [...new Set(terms.map((term) => term.category))]
const kinds = [...validKinds]
const generated = `/* Generated by scripts/build-ui-vocabulary-data.mjs. Do not edit directly. */

export type TermCategory = ${categories.map((category) => JSON.stringify(category)).join(" | ")}

export type TermKind = ${kinds.map((kind) => JSON.stringify(kind)).join(" | ")}

export type NavigationPath = [string, ...string[]]

export type TermNavigation = {
  canonical_path: NavigationPath
  also_appears_in?: NavigationPath[]
}

export type VocabularyTerm = {
  id: string
  status: "draft" | "reviewed" | "published"
  category: TermCategory
  kind: TermKind
  ko: { name: string; aliases: string[] }
  en: { name: string; aliases: string[] }
  one_liner: string
  description: string
  visual_anatomy: string[]
  when_to_use: string[]
  anti_use: string[]
  prompt_phrases: string[]
  asset: { kind: string; variant: string; props?: Record<string, unknown> }
  sources: { source_id: string; note?: string }[]
  confidence: "low" | "medium" | "high"
  navigation?: TermNavigation
  related?: { id: string; relation: "compare" | "alternative" | "use-with"; note: string }[]
}

export type SourceReference = {
  id: string
  label: string
  tier: string
  tierLabel: string
  url: string
}

export const terms = ${JSON.stringify(normalizedTerms, null, 2)} satisfies VocabularyTerm[]

export const categories = ${JSON.stringify(categories, null, 2)} satisfies TermCategory[]

export const kinds = ${JSON.stringify(kinds, null, 2)} satisfies TermKind[]

export const sourceRegistry = ${JSON.stringify(sourceRegistry, null, 2)} satisfies SourceReference[]
`

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, generated, "utf8")
console.log(`generated ${path.relative(root, outputPath)} (${terms.length} terms)`)
