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
const inboxPath = path.join(root, "docs", "ui-vocabulary", "inbox.yml")
const sourcesPath = path.join(root, "docs", "ui-vocabulary", "sources.md")

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

const validCategories = new Set(["input", "selection", "action", "structure", "feedback", "data-display"])
const validConfidence = new Set(["low", "medium", "high"])
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const terms = YAML.parse(await readFile(termsPath, "utf8"))
const candidates = YAML.parse(await readFile(inboxPath, "utf8")) ?? []
const sourcesText = await readFile(sourcesPath, "utf8")
const sourceIds = new Set([...sourcesText.matchAll(/- `([^`]+)`:/g)].map((match) => match[1]))

const errors = []
const warnings = []

if (!Array.isArray(terms)) {
  errors.push("terms.yml must be a list")
}
if (!Array.isArray(candidates)) {
  errors.push("inbox.yml must be a list")
}

const existing = Array.isArray(terms) ? terms : []
const inbox = Array.isArray(candidates) ? candidates : []
const existingIds = new Set(existing.map((term) => term.id))
const existingKoNames = new Map(existing.map((term) => [normalize(term.ko?.name), term.id]))
const existingEnNames = new Map(existing.map((term) => [normalize(term.en?.name), term.id]))
const existingAssetVariants = new Map(existing.map((term) => [term.asset?.variant, term.id]))
const seenCandidateIds = new Set()
const seenCandidateKoNames = new Map()
const seenCandidateEnNames = new Map()
const seenCandidateAssetVariants = new Map()

for (const [index, candidate] of inbox.entries()) {
  const label = candidate?.id ?? `candidate #${index + 1}`

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    errors.push(`${label}: candidate must be a mapping`)
    continue
  }

  const missing = requiredFields.filter((field) => !(field in candidate))
  if (missing.length) {
    errors.push(`${label}: missing fields ${missing.join(", ")}`)
  }

  if (!kebabCase.test(candidate.id ?? "")) {
    errors.push(`${label}: id must be kebab-case`)
  }
  if (seenCandidateIds.has(candidate.id)) {
    errors.push(`${label}: duplicate id inside inbox.yml`)
  }
  seenCandidateIds.add(candidate.id)

  checkCandidateDuplicate(seenCandidateKoNames, normalize(candidate.ko?.name), candidate.id, "Korean name", errors)
  checkCandidateDuplicate(seenCandidateEnNames, normalize(candidate.en?.name), candidate.id, "English name", errors)
  checkCandidateDuplicate(seenCandidateAssetVariants, candidate.asset?.variant, candidate.id, "asset.variant", warnings)

  if (existingIds.has(candidate.id)) {
    errors.push(`${label}: id already exists in terms.yml`)
  }
  if (!validCategories.has(candidate.category)) {
    errors.push(`${label}: invalid category ${candidate.category}`)
  }
  if (!validConfidence.has(candidate.confidence)) {
    errors.push(`${label}: invalid confidence ${candidate.confidence}`)
  }
  if (candidate.status !== "candidate") {
    warnings.push(`${label}: status should stay candidate until promotion`)
  }

  checkText(label, "ko.name", candidate.ko?.name, errors)
  checkText(label, "en.name", candidate.en?.name, errors)
  checkList(label, "ko.aliases", candidate.ko?.aliases, warnings)
  checkList(label, "en.aliases", candidate.en?.aliases, warnings)
  checkText(label, "one_liner", candidate.one_liner, errors)
  checkText(label, "description", candidate.description, errors)
  checkList(label, "visual_anatomy", candidate.visual_anatomy, errors)
  checkList(label, "when_to_use", candidate.when_to_use, errors)
  checkList(label, "anti_use", candidate.anti_use, errors)
  checkList(label, "prompt_phrases", candidate.prompt_phrases, errors)

  const duplicateKo = existingKoNames.get(normalize(candidate.ko?.name))
  if (duplicateKo) {
    errors.push(`${label}: Korean name duplicates existing term ${duplicateKo}`)
  }

  const duplicateEn = existingEnNames.get(normalize(candidate.en?.name))
  if (duplicateEn) {
    errors.push(`${label}: English name duplicates existing term ${duplicateEn}`)
  }

  const duplicateAsset = existingAssetVariants.get(candidate.asset?.variant)
  if (duplicateAsset) {
    warnings.push(`${label}: asset.variant already used by ${duplicateAsset}; confirm this is an intentional renderer mapping`)
  }

  if (!candidate.asset?.kind || !candidate.asset?.variant) {
    errors.push(`${label}: asset.kind and asset.variant are required`)
  }

  if (!Array.isArray(candidate.sources) || candidate.sources.length === 0) {
    errors.push(`${label}: sources must not be empty`)
  } else {
    for (const source of candidate.sources) {
      if (!source?.source_id) {
        errors.push(`${label}: every source needs source_id`)
        continue
      }
      if (!sourceIds.has(source.source_id)) {
        errors.push(`${label}: unknown source_id ${source.source_id}`)
      }
    }
  }

  const aliasOverlap = findAliasOverlap(candidate, existing)
  for (const overlap of aliasOverlap.slice(0, 5)) {
    warnings.push(`${label}: alias/name overlap with ${overlap.id} via "${overlap.value}"`)
  }

  if (!candidate.collector_notes) {
    warnings.push(`${label}: collector_notes is recommended for review context`)
  }
}

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`)
}

if (errors.length) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`)
  }
  process.exit(1)
}

console.log(`candidate inbox ok: ${inbox.length} candidates`)
console.log(`warnings: ${warnings.length}`)

function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase("ko-KR").replace(/\s+/g, " ")
}

function checkText(label, field, value, target) {
  if (typeof value !== "string" || !value.trim()) {
    target.push(`${label}: ${field} must be non-empty text`)
  }
}

function checkList(label, field, value, target) {
  if (!Array.isArray(value) || value.length === 0) {
    target.push(`${label}: ${field} must be a non-empty list`)
  }
}

function checkCandidateDuplicate(seen, value, id, field, target) {
  if (!value) {
    return
  }

  const existingId = seen.get(value)
  if (existingId) {
    target.push(`${id}: duplicate ${field} inside inbox.yml; already used by ${existingId}`)
    return
  }

  seen.set(value, id)
}

function findAliasOverlap(candidate, existingTerms) {
  const candidateValues = new Set([
    candidate.ko?.name,
    candidate.en?.name,
    ...(candidate.ko?.aliases ?? []),
    ...(candidate.en?.aliases ?? []),
  ].map(normalize).filter(Boolean))

  return existingTerms.flatMap((term) => {
    const termValues = [
      term.ko?.name,
      term.en?.name,
      ...(term.ko?.aliases ?? []),
      ...(term.en?.aliases ?? []),
    ]

    return termValues.flatMap((value) => {
      const normalized = normalize(value)
      return candidateValues.has(normalized) ? [{ id: term.id, value }] : []
    })
  })
}
