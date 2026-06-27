import { createRequire } from "node:module"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const siteRoot = path.join(root, "examples", "ui-vocabulary-site")
const require = createRequire(path.join(siteRoot, "package.json"))
const YAML = require("yaml")

const termsPath = path.join(root, "docs", "ui-vocabulary", "terms.yml")
const rendererPath = path.join(siteRoot, "src", "components", "term-visual.tsx")
const strict = process.argv.includes("--strict")

const terms = YAML.parse(await readFile(termsPath, "utf8"))
const rendererText = await readFile(rendererPath, "utf8")

if (!Array.isArray(terms)) {
  throw new Error("terms.yml must be a list")
}

const genericRendererVariants = new Map()

const lowSpecificityPatterns = [
  "generic line skeleton",
  "same renderer as unrelated term",
  "effect name appears only as text",
  "page/block visual lacks domain labels",
  "visual anatomy not visible in mini mock",
]

const variantTerms = new Map()
for (const term of terms) {
  const variant = term.asset?.variant
  if (!variant) {
    continue
  }
  if (!variantTerms.has(variant)) {
    variantTerms.set(variant, [])
  }
  variantTerms.get(variant).push(term)
}

const handledVariants = findHandledVariants(rendererText)
const fallbackTerms = []
const genericTerms = []
const sharedVariants = []

for (const [variant, mappedTerms] of variantTerms) {
  if (!handledVariants.has(variant)) {
    fallbackTerms.push({ variant, terms: mappedTerms })
  }

  if (genericRendererVariants.has(variant)) {
    genericTerms.push({
      variant,
      reason: genericRendererVariants.get(variant),
      terms: mappedTerms,
    })
  }

  if (mappedTerms.length > 1) {
    sharedVariants.push({ variant, terms: mappedTerms })
  }
}

const report = [
  `visual audit: ${terms.length} terms, ${variantTerms.size} variants`,
  `fallback variants: ${fallbackTerms.length}`,
  `generic renderer variants: ${genericTerms.length}`,
  `shared variants: ${sharedVariants.length}`,
  "",
]

if (fallbackTerms.length) {
  report.push("Fallback variants:")
  for (const item of fallbackTerms) {
    report.push(`- ${item.variant}: ${item.terms.map(formatTerm).join(", ")}`)
  }
  report.push("")
}

if (genericTerms.length) {
  report.push("Generic renderer variants:")
  for (const item of genericTerms) {
    report.push(`- ${item.variant}: ${item.reason}; ${item.terms.map(formatTerm).join(", ")}`)
  }
  report.push("")
}

if (sharedVariants.length) {
  report.push("Shared variants to manually confirm:")
  for (const item of sharedVariants) {
    report.push(`- ${item.variant}: ${item.terms.map(formatTerm).join(", ")}`)
  }
  report.push("")
}

report.push("Manual visual review checklist:")
for (const pattern of lowSpecificityPatterns) {
  report.push(`- ${pattern}`)
}

console.log(report.join("\n"))

if (strict && (fallbackTerms.length || genericTerms.length)) {
  process.exitCode = 1
}

function findHandledVariants(text) {
  const variants = new Set()
  for (const match of text.matchAll(/variant === "([^"]+)"/g)) {
    variants.add(match[1])
  }
  for (const match of text.matchAll(/"([a-z0-9]+(?:-[a-z0-9]+)+)"/g)) {
    variants.add(match[1])
  }

  return variants
}

function formatTerm(term) {
  return `${term.id} (${term.ko?.name ?? "unnamed"} / ${term.en?.name ?? "unnamed"})`
}
