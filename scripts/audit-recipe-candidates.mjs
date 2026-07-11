import { createRequire } from "node:module"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const siteRoot = path.join(root, "examples", "ui-vocabulary-site")
const require = createRequire(path.join(siteRoot, "package.json"))
const YAML = require("yaml")

const strictDuplicates = process.argv.includes("--strict-duplicates")
const inputFlagIndex = process.argv.indexOf("--input")
const inputPath = inputFlagIndex !== -1 && process.argv[inputFlagIndex + 1]
  ? path.resolve(process.argv[inputFlagIndex + 1])
  : path.join(root, "docs", "research", "loop", "inbox.yml")

const recipesRoot = path.join(root, "recipes")
const termsPath = path.join(root, "docs", "ui-vocabulary", "terms.yml")

const validPatternGroups = new Set([
  "marketing",
  "application-ui",
  "commerce",
  "docs",
  "data-display",
  "forms",
  "navigation",
  "overlays",
  "feedback",
  "layout",
])
const validSurfaces = new Set([
  "websites",
  "mobile-apps",
  "saas-dashboards",
  "commerce",
  "documentation",
  "internal-tools",
  "components-primitives",
])
const validArtifacts = new Set(["recipe", "term", "alias", "related"])
const validTiers = new Set([0, 1, 2, 3])
const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const dateFormat = /^\d{4}-\d{2}-\d{2}$/

const requiredCandidateFields = [
  "id",
  "name",
  "pattern_group",
  "proposed_artifact",
  "source",
  "summary",
  "anatomy",
  "transferable",
  "non_transferable",
  "dedup_hints",
]

const errors = []
const warnings = []

let doc
try {
  doc = YAML.parse(await readFile(inputPath, "utf8"))
} catch (error) {
  console.error(`ERROR: failed to read/parse input ${inputPath}: ${error.message}`)
  process.exit(1)
}

if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
  errors.push("input document must be a mapping with batch/surface/candidates")
  reportAndExit()
}

if (typeof doc.batch !== "string" || !doc.batch.trim()) {
  errors.push("top-level: batch must be a non-empty string")
}
if (!validSurfaces.has(doc.surface)) {
  errors.push(`top-level: surface must be one of ${[...validSurfaces].join(", ")} (got ${doc.surface})`)
}
if (!Array.isArray(doc.candidates)) {
  errors.push("top-level: candidates must be a list")
}

const candidates = Array.isArray(doc.candidates) ? doc.candidates : []

// Load existing recipes (id + title from frontmatter)
const existingRecipes = await loadExistingRecipes(recipesRoot)

// Load existing terms
const termsRaw = YAML.parse(await readFile(termsPath, "utf8"))
const existingTerms = Array.isArray(termsRaw) ? termsRaw : []

const seenIds = new Set()
const intraBatchEntries = []

for (const [index, candidate] of candidates.entries()) {
  const label = candidate?.id ?? `candidate #${index + 1}`

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    errors.push(`${label}: candidate must be a mapping`)
    continue
  }

  // schema: required fields
  const missing = requiredCandidateFields.filter((field) => !(field in candidate))
  if (missing.length) {
    errors.push(`${label}: missing fields ${missing.join(", ")}`)
  }

  if (!kebabCase.test(candidate.id ?? "")) {
    errors.push(`${label}: id must be kebab-case`)
  }
  if (seenIds.has(candidate.id)) {
    errors.push(`${label}: duplicate id inside inbox`)
  }
  seenIds.add(candidate.id)

  checkText(label, "name", candidate.name, errors)
  checkText(label, "summary", candidate.summary, errors)

  if (!validPatternGroups.has(candidate.pattern_group)) {
    errors.push(`${label}: invalid pattern_group ${candidate.pattern_group}`)
  }
  if (!validArtifacts.has(candidate.proposed_artifact)) {
    errors.push(`${label}: invalid proposed_artifact ${candidate.proposed_artifact}`)
  }

  checkList(label, "anatomy", candidate.anatomy, errors)
  checkTextOrList(label, "transferable", candidate.transferable, errors)
  checkTextOrList(label, "non_transferable", candidate.non_transferable, errors)
  // dedup_hints는 비어 있어도 된다(근접 기존 항목이 없는 후보) — 형태만 검사
  if (candidate.dedup_hints !== undefined && !Array.isArray(candidate.dedup_hints)) {
    warnings.push(`${label}: dedup_hints must be a list when present`)
  }

  // source
  const source = candidate.source
  if (!source || typeof source !== "object") {
    errors.push(`${label}: source must be a mapping with tier/url/accessed`)
  } else {
    if (!validTiers.has(source.tier)) {
      errors.push(`${label}: source.tier must be one of 0,1,2,3 (got ${source.tier})`)
    }
    if (typeof source.url !== "string" || !/^https?:\/\//.test(source.url)) {
      errors.push(`${label}: source.url must be an http(s) URL`)
    }
    if (typeof source.accessed !== "string" || !dateFormat.test(source.accessed)) {
      errors.push(`${label}: source.accessed must be YYYY-MM-DD`)
    }
  }

  // duplicate risk vs existing recipes
  const recipeExactMatches = findExactMatches(candidate, existingRecipes)
  for (const match of recipeExactMatches) {
    errors.push(`${label}: exact overlap with existing recipe ${match.id} (${match.reason})`)
  }

  // duplicate risk vs existing terms
  const termExactMatches = findExactMatches(candidate, existingTerms.map(termToComparable))
  for (const match of termExactMatches) {
    errors.push(`${label}: exact overlap with existing term ${match.id} (${match.reason})`)
  }

  // near-match duplicate risk (recipes + terms)
  const allExisting = [...existingRecipes, ...existingTerms.map(termToComparable)]
  const risks = findDuplicateRisks(candidate, allExisting)
  for (const risk of risks.slice(0, 5)) {
    const message = `${label}: duplicate-risk with ${risk.id} (${risk.reason})`
    if (strictDuplicates) {
      errors.push(message)
    } else {
      warnings.push(message)
    }
  }

  intraBatchEntries.push({ id: candidate.id, ...comparableFromCandidate(candidate) })
}

// intra-batch duplicates: compare every candidate to every other candidate in this batch
for (let i = 0; i < intraBatchEntries.length; i += 1) {
  for (let j = i + 1; j < intraBatchEntries.length; j += 1) {
    const left = intraBatchEntries[i]
    const right = intraBatchEntries[j]
    if (!left.id || !right.id) continue

    const exact = phrasesOverlapExactly(left.phrases, right.phrases)
    if (exact) {
      errors.push(`${left.id}: exact overlap with intra-batch candidate ${right.id} (${exact})`)
      continue
    }

    const score = bestJaccard(left.tokenSets, right.tokenSets)
    if (score?.score >= 0.6) {
      const message = `${left.id}: duplicate-risk with intra-batch candidate ${right.id} (token similarity ${score.score.toFixed(2)} via "${score.candidate}" ~= "${score.existing}")`
      if (strictDuplicates) {
        errors.push(message)
      } else {
        warnings.push(message)
      }
    }
  }
}

reportAndExit()

function reportAndExit() {
  for (const warning of warnings) {
    console.warn(`WARN: ${warning}`)
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(`ERROR: ${error}`)
    }
    console.log(`candidates checked: ${candidates.length}`)
    console.log(`errors: ${errors.length}`)
    console.log(`warnings: ${warnings.length}`)
    process.exit(1)
  }

  console.log(`recipe candidate inbox ok: ${candidates.length} candidates`)
  console.log(`warnings: ${warnings.length}`)
  process.exit(0)
}

async function loadExistingRecipes(dir) {
  const groups = await readdir(dir, { withFileTypes: true })
  const results = []

  for (const group of groups) {
    if (!group.isDirectory()) continue
    const groupPath = path.join(dir, group.name)
    const files = await readdir(groupPath, { withFileTypes: true })

    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith(".md")) continue
      const content = await readFile(path.join(groupPath, file.name), "utf8")
      const frontmatter = parseFrontmatter(content)
      if (!frontmatter) continue

      results.push({
        id: frontmatter.id,
        name: frontmatter.name,
        aliases: [],
      })
    }
  }

  return results
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  try {
    return YAML.parse(match[1])
  } catch {
    return null
  }
}

function termToComparable(term) {
  return {
    id: term.id,
    name: term.en?.name ?? term.ko?.name,
    aliases: [...(term.en?.aliases ?? []), ...(term.ko?.aliases ?? [])],
  }
}

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

// inbox 스키마(reference-loop.md)는 transferable/non_transferable을 문자열로 정의한다. 리스트도 허용.
function checkTextOrList(label, field, value, target) {
  const okText = typeof value === "string" && value.trim().length > 0
  const okList = Array.isArray(value) && value.length > 0
  if (!okText && !okList) {
    target.push(`${label}: ${field} must be non-empty text or list`)
  }
}

function comparablePhrases(entity) {
  const values = [
    entity.id,
    entity.id?.replace(/-/g, " "),
    entity.name,
    ...(entity.aliases ?? []),
  ]
  return values.map(normalize).filter((phrase) => phrase.length >= 3)
}

function comparableFromCandidate(candidate) {
  // dedup_hints는 기존 항목을 가리키는 포인터라 후보 자신의 이름이 아니다 — 비교 문구에 넣으면
  // 자기 힌트와의 허위 매칭, 힌트를 공유한 후보끼리의 허위 intra-batch overlap이 생긴다.
  const phrases = comparablePhrases({
    id: candidate.id,
    name: candidate.name,
  })
  const tokenSets = phrases
    .map((phrase) => ({ phrase, tokens: tokenizeComparable(phrase) }))
    .filter((entry) => entry.tokens.length > 0)
  return { phrases, tokenSets }
}

function tokenizeComparable(value) {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "for",
    "of",
    "or",
    "the",
    "to",
    "ui",
    "banner",
    "button",
    "card",
    "field",
    "menu",
    "panel",
    "prompt",
    "screen",
    "sheet",
    "state",
    "view",
  ])

  return [...new Set(
    normalize(value)
      .replace(/[^a-z0-9가-힣]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 3 && !stopWords.has(token)),
  )]
}

function jaccard(leftTokens, rightTokens) {
  const left = new Set(leftTokens)
  const right = new Set(rightTokens)
  const intersection = [...left].filter((token) => right.has(token)).length
  const union = new Set([...left, ...right]).size
  return union ? intersection / union : 0
}

function phrasesOverlapExactly(candidatePhrases, existingPhrases) {
  for (const phrase of candidatePhrases) {
    if (existingPhrases.includes(phrase)) {
      return `name/id match "${phrase}"`
    }
  }
  return null
}

function findExactMatches(candidate, existingEntities) {
  const candidateId = normalize(candidate.id)
  const candidateName = normalize(candidate.name)
  const matches = []

  for (const entity of existingEntities) {
    if (!entity.id && !entity.name) continue
    const entityId = normalize(entity.id)
    const entityName = normalize(entity.name)
    const entityAliases = (entity.aliases ?? []).map(normalize)

    if (candidateId && entityId && candidateId === entityId) {
      matches.push({ id: entity.id, reason: `id "${candidate.id}" matches` })
      continue
    }
    if (candidateName && entityName && candidateName === entityName) {
      matches.push({ id: entity.id, reason: `name "${candidate.name}" matches` })
      continue
    }
    if (candidateName && entityAliases.includes(candidateName)) {
      matches.push({ id: entity.id, reason: `name "${candidate.name}" matches alias` })
    }
  }

  return matches
}

function findDuplicateRisks(candidate, existingEntities) {
  // dedup_hints 제외 — 힌트는 기존 항목 포인터라 넣으면 힌트 대상과의 동어반복 매칭만 생긴다
  const candidatePhrases = comparablePhrases({
    id: candidate.id,
    name: candidate.name,
  })
  const candidateTokenSets = candidatePhrases
    .map((phrase) => ({ phrase, tokens: tokenizeComparable(phrase) }))
    .filter((entry) => entry.tokens.length > 0)

  const risks = []

  for (const entity of existingEntities) {
    const existingPhrases = comparablePhrases(entity)
    const existingTokenSets = existingPhrases
      .map((phrase) => ({ phrase, tokens: tokenizeComparable(phrase) }))
      .filter((entry) => entry.tokens.length > 0)

    const substringMatch = findSubstringMatch(candidatePhrases, existingPhrases)
    if (substringMatch) {
      risks.push({
        id: entity.id,
        score: 0.9,
        reason: `name/id substring "${substringMatch.candidate}" ~= "${substringMatch.existing}"`,
      })
      continue
    }

    const tokenMatch = bestJaccard(candidateTokenSets, existingTokenSets)
    if (tokenMatch?.score >= 0.6) {
      risks.push({
        id: entity.id,
        score: tokenMatch.score,
        reason: `token similarity ${tokenMatch.score.toFixed(2)} via "${tokenMatch.candidate}" ~= "${tokenMatch.existing}"`,
      })
    }
  }

  return risks.sort((left, right) => right.score - left.score || String(left.id).localeCompare(String(right.id)))
}

function findSubstringMatch(candidatePhrases, existingPhrases) {
  const genericPhrases = new Set([
    "banner",
    "button",
    "card",
    "field",
    "menu",
    "panel",
    "prompt",
    "screen",
    "sheet",
    "state",
    "view",
  ])

  for (const candidatePhrase of candidatePhrases) {
    for (const existingPhrase of existingPhrases) {
      if (candidatePhrase === existingPhrase) continue
      if (genericPhrases.has(candidatePhrase) || genericPhrases.has(existingPhrase)) continue
      if (candidatePhrase.length < 6 || existingPhrase.length < 6) continue
      if (candidatePhrase.includes(existingPhrase) || existingPhrase.includes(candidatePhrase)) {
        return { candidate: candidatePhrase, existing: existingPhrase }
      }
    }
  }

  return null
}

function bestJaccard(candidateEntries, existingEntries) {
  let best = null

  for (const candidateEntry of candidateEntries) {
    for (const existingEntry of existingEntries) {
      const score = jaccard(candidateEntry.tokens, existingEntry.tokens)
      if (!best || score > best.score) {
        best = { score, candidate: candidateEntry.phrase, existing: existingEntry.phrase }
      }
    }
  }

  return best
}
