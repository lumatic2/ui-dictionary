// audit-vocabulary-reach.mjs — 용어 사전이 에이전트에게 실제로 닿는가를 계수한다.
//
// 판정 기준은 **배포본**이다: `examples/ui-vocabulary-site/public/llms/**` 에 실려야 해소된 것이고,
// 레포에 원본이 있다는 사실은 해소가 아니다. 에이전트가 겪는 것은 배포본뿐이다.
//
// 사용: node scripts/audit-vocabulary-reach.mjs [--json]
// 종료 코드: 0 (계수 성공) / 1 (계수 자체가 실패 — 원본 누락 등)

import { createRequire } from "node:module"
import { readFile, readdir, access } from "node:fs/promises"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const siteRoot = path.join(root, "examples", "ui-vocabulary-site")
const require = createRequire(path.join(siteRoot, "package.json"))
const YAML = require("yaml")

const publishedRoot = path.join(siteRoot, "public", "llms")
const publishedVocabDir = path.join(publishedRoot, "docs", "ui-vocabulary")
const publishedProtocol = path.join(publishedRoot, "docs", "design-system", "entry-protocol.md")
const termsPath = path.join(root, "docs", "ui-vocabulary", "terms.yml")
const recipesRoot = path.join(root, "recipes")
const registryPath = path.join(siteRoot, "public", "r", "registry.json")

const asJson = process.argv.includes("--json")

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function listRecipes() {
  const groups = await readdir(recipesRoot, { withFileTypes: true })
  const files = []
  for (const g of groups) {
    if (!g.isDirectory()) continue
    for (const f of await readdir(path.join(recipesRoot, g.name))) {
      if (f.endsWith(".md")) files.push(path.join(recipesRoot, g.name, f))
    }
  }
  return files
}

// 배포본에서 용어 id 를 해소할 수 있는가.
// 지금은 terms 데이터가 배포되지 않았으므로 해소 가능한 집합은 비어 있다.
// VL2 가 샤드를 배포하면 이 함수가 샤드에서 id 를 읽어 채운다.
async function publishedTermIds() {
  if (!(await exists(publishedVocabDir))) return { ids: new Set(), sources: [] }
  // VL2 가 샤드를 하위 디렉터리(`vocabulary/`)로 낸다 — 최상위만 보면 배포된 사전을 못 본다.
  const entries = await readdir(publishedVocabDir, { withFileTypes: true })
  const files = []
  for (const e of entries) {
    if (e.isFile()) files.push(e.name)
    else if (e.isDirectory()) {
      for (const inner of await readdir(path.join(publishedVocabDir, e.name))) {
        files.push(path.join(e.name, inner))
      }
    }
  }
  const ids = new Set()
  const sources = []
  for (const f of files) {
    if (!f.endsWith(".yml") && !f.endsWith(".yaml")) continue
    const raw = await readFile(path.join(publishedVocabDir, f), "utf8")
    let doc
    try {
      doc = YAML.parse(raw)
    } catch {
      continue
    }
    // 용어 목록으로 볼 수 있는 형태만 수확한다 — groups.yml 같은 축 데이터는 용어가 아니다.
    const list = Array.isArray(doc) ? doc : Array.isArray(doc?.terms) ? doc.terms : null
    if (!list) continue
    let harvested = 0
    for (const item of list) {
      if (item && typeof item.id === "string" && (item.one_liner || item.description || item.when_to_use)) {
        ids.add(item.id)
        harvested += 1
      }
    }
    if (harvested > 0) sources.push({ file: f, terms: harvested })
  }
  return { ids, sources }
}

async function main() {
  if (!(await exists(termsPath))) {
    console.error(`FAIL: 용어 원본이 없다 — ${termsPath}`)
    process.exit(1)
  }

  const terms = YAML.parse(await readFile(termsPath, "utf8"))
  if (!Array.isArray(terms) || terms.length === 0) {
    console.error("FAIL: terms.yml 을 목록으로 읽지 못했다")
    process.exit(1)
  }
  const termIds = new Set(terms.map((t) => t.id))

  const { ids: publishedIds, sources: publishedSources } = await publishedTermIds()

  // 레시피 → 용어 참조 수집
  const recipeFiles = await listRecipes()
  const refsByRecipe = new Map()
  const allRefs = new Set()
  for (const file of recipeFiles) {
    const text = await readFile(file, "utf8")
    const m = text.match(/^term_refs:\s*\[(.*?)\]\s*$/m)
    if (!m) continue
    const refs = m[1]
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
    if (refs.length === 0) continue
    refsByRecipe.set(path.relative(root, file), refs)
    refs.forEach((r) => allRefs.add(r))
  }

  // 끊긴 참조 = 배포본에서 해소 불가능한 참조. 로컬 존재는 해소가 아니다.
  const broken = []
  for (const [recipe, refs] of refsByRecipe) {
    for (const ref of refs) {
      if (publishedIds.has(ref)) continue
      broken.push({
        recipe,
        term: ref,
        reason: termIds.has(ref) ? "로컬에만 존재 — 미배포" : "용어 원본에도 없음",
      })
    }
  }

  // 코드 자산 커버리지
  let registryNames = []
  if (await exists(registryPath)) {
    const reg = JSON.parse(await readFile(registryPath, "utf8"))
    registryNames = (reg.items ?? []).map((i) => i.name)
  }

  // 프로토콜의 용어 언급
  let protocolMentions = null
  if (await exists(publishedProtocol)) {
    const text = await readFile(publishedProtocol, "utf8")
    protocolMentions = (text.match(/\b(term|terms|vocabulary|dictionary)\b/gi) ?? []).length
  }

  const covered = new Set([...allRefs].filter((r) => termIds.has(r)))
  const report = {
    terms_total: termIds.size,
    terms_published: publishedIds.size,
    published_sources: publishedSources,
    recipes_total: recipeFiles.length,
    recipes_with_refs: refsByRecipe.size,
    term_refs_distinct: allRefs.size,
    term_refs_broken: broken.length,
    coverage_by_recipe_pct: Number(((covered.size / termIds.size) * 100).toFixed(1)),
    terms_without_asset: termIds.size - covered.size,
    code_assets: registryNames.length,
    protocol_term_mentions: protocolMentions,
  }

  if (asJson) {
    console.log(JSON.stringify({ ...report, broken }, null, 2))
    return
  }

  console.log("용어 도달 계수 (기준: 배포본)")
  console.log("---")
  console.log(`용어 원본            ${report.terms_total}`)
  console.log(`배포된 용어          ${report.terms_published}${report.terms_published === 0 ? "  ← 사전이 에이전트 경로에 없다" : ""}`)
  console.log(`레시피               ${report.recipes_total} (참조 보유 ${report.recipes_with_refs})`)
  console.log(`distinct term_refs   ${report.term_refs_distinct}`)
  console.log(`끊긴 term_refs       ${report.term_refs_broken}${report.term_refs_broken > 0 ? "  ← 배포된 계약 안의 죽은 이름" : ""}`)
  console.log(`용어 커버리지        ${report.coverage_by_recipe_pct}%  (자산 없는 용어 ${report.terms_without_asset})`)
  console.log(`코드 자산            ${report.code_assets}`)
  console.log(`프로토콜 용어 언급   ${report.protocol_term_mentions === null ? "배포본 없음" : report.protocol_term_mentions}`)

  if (broken.length > 0) {
    const byReason = broken.reduce((acc, b) => {
      acc[b.reason] = (acc[b.reason] ?? 0) + 1
      return acc
    }, {})
    console.log("---")
    console.log("끊긴 참조 사유별:")
    for (const [reason, n] of Object.entries(byReason)) console.log(`  ${reason}: ${n}`)
    console.log("전수는 --json 으로.")
  }

  // --strict (VL3): 계수에 그치지 않고 **무결성 게이트**로 쓴다. 하나라도 깨지면 exit 1.
  //   ① 배포본 기준 끊긴 term_refs 0  ② 샤드가 원본과 일치  ③ 매핑 양방향 일치·죽은 참조 0
  // ②③ 은 각 생성기의 --check 를 그대로 호출한다 — 같은 규칙을 두 곳에 적으면 갈라진다.
  if (process.argv.includes("--strict")) {
    console.log("---")
    const failures = []
    if (report.term_refs_broken > 0) failures.push(`끊긴 term_refs ${report.term_refs_broken}건`)
    if (report.terms_published !== report.terms_total) {
      failures.push(`배포된 용어 ${report.terms_published} ≠ 원본 ${report.terms_total}`)
    }
    for (const script of ["generate-vocabulary-shards.mjs", "generate-term-asset-map.mjs"]) {
      try {
        execFileSync(process.execPath, [path.join(root, "scripts", script), "--check"], { stdio: "pipe" })
      } catch (err) {
        failures.push(`${script} --check 실패: ${String(err.stderr ?? err.message).trim().split("\n")[0]}`)
      }
    }
    if (failures.length > 0) {
      console.error("무결성 FAIL:")
      for (const f of failures) console.error(`  - ${f}`)
      process.exit(1)
    }
    console.log("무결성 PASS — 끊긴 참조 0 · 샤드 일치 · 매핑 양방향 일치")
  }
}

main().catch((err) => {
  console.error("FAIL:", err.message)
  process.exit(1)
})
