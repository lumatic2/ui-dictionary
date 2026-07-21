// generate-term-asset-map.mjs — 용어 ↔ 레시피 ↔ 코드 자산 3자 매핑.
//
// 왜 생성하나: 세 원본(terms.yml · recipes/*/*.md 의 term_refs · r/registry.json)이 각자 갱신된다.
// 손으로 관리하는 네 번째 목록을 두면 반드시 드리프트한다. 그래서 매핑은 **파생물**이다.
//
// 이 매핑이 답하는 질문: "이 용어를 고르면 무엇으로 만들 수 있나" — 레시피가 있나, 코드 자산이
// 있나, 아니면 아무것도 없어 폴백 규약(no-asset-fallback.md)으로 가야 하나.
//
// 사용: node scripts/generate-term-asset-map.mjs [--check]
// 종료 코드: 0 정상 / 1 원본 불일치·무결성 위반

import { createRequire } from "node:module"
import { readFile, writeFile, readdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const siteRoot = path.join(root, "examples", "ui-vocabulary-site")
const require = createRequire(path.join(siteRoot, "package.json"))
const YAML = require("yaml")

const termsPath = path.join(root, "docs", "ui-vocabulary", "terms.yml")
const recipesRoot = path.join(root, "recipes")
const registryPath = path.join(siteRoot, "public", "r", "registry.json")
const outPath = path.join(root, "docs", "ui-vocabulary", "term-asset-map.json")

const checkOnly = process.argv.includes("--check")

function fail(msg) {
  console.error(`FAIL: ${msg}`)
  process.exit(1)
}

const terms = YAML.parse(await readFile(termsPath, "utf8"))
if (!Array.isArray(terms) || terms.length === 0) fail(`용어 원본을 목록으로 읽지 못했다 — ${termsPath}`)
const termIds = new Set(terms.map((t) => t.id))

// 레시피 수집
const recipeFiles = []
for (const g of await readdir(recipesRoot, { withFileTypes: true })) {
  if (!g.isDirectory()) continue
  for (const f of await readdir(path.join(recipesRoot, g.name))) {
    if (f.endsWith(".md")) recipeFiles.push(path.join(g.name, f))
  }
}

const recipes = []
for (const rel of recipeFiles.sort()) {
  const text = await readFile(path.join(recipesRoot, rel), "utf8")
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fm) fail(`레시피에 frontmatter 가 없다 — recipes/${rel}`)
  const idLine = fm[1].split(/\r?\n/).find((l) => /^id:\s*/.test(l))
  const refsLine = fm[1].split(/\r?\n/).find((l) => /^term_refs:\s*/.test(l))
  const codeLine = fm[1].split(/\r?\n/).find((l) => /^code_asset:\s*/.test(l))
  const refs = refsLine
    ? (refsLine.match(/\[(.*?)\]/)?.[1] ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : []
  recipes.push({
    id: idLine ? idLine.replace(/^id:\s*/, "").trim() : path.basename(rel, ".md"),
    path: `recipes/${rel.split(path.sep).join("/")}`,
    term_refs: refs,
    has_code_asset: Boolean(codeLine),
  })
}

// 없는 용어를 가리키는 참조는 매핑이 거짓말을 하게 만든다 — 조용히 빈 값으로 넘어가지 않는다.
const danglingRefs = recipes.flatMap((r) =>
  r.term_refs.filter((t) => !termIds.has(t)).map((t) => `${r.path} → ${t}`),
)
if (danglingRefs.length > 0) {
  fail(`용어 원본에 없는 term_refs ${danglingRefs.length}건: ${danglingRefs.slice(0, 5).join(", ")}`)
}

// 코드 자산
const registry = existsSync(registryPath) ? JSON.parse(await readFile(registryPath, "utf8")) : { items: [] }
const assetByName = new Map(registry.items.map((i) => [i.name, i]))

// 레시피 ↔ 코드 자산 대응 (llms 생성기와 같은 규칙: 정확 일치 또는 유일한 접두 일치)
const assetNames = [...assetByName.keys()]
const assetForRecipe = (recipeId) => {
  if (assetByName.has(recipeId)) return recipeId
  const hits = assetNames.filter((n) => recipeId.startsWith(n) || n.startsWith(recipeId))
  return hits.length === 1 ? hits[0] : null
}

// 용어별 역인덱스
const map = {}
for (const t of terms) {
  map[t.id] = { group: t.group, recipes: [], code_assets: [] }
}
for (const r of recipes) {
  const asset = assetForRecipe(r.id)
  for (const term of r.term_refs) {
    map[term].recipes.push(r.path)
    if (asset && !map[term].code_assets.includes(asset)) map[term].code_assets.push(asset)
  }
}

// 양방향 일치: 레시피→용어 집합과 용어→레시피 집합이 같아야 한다.
const forward = new Set(recipes.flatMap((r) => r.term_refs.map((t) => `${r.path}|${t}`)))
const backward = new Set(
  Object.entries(map).flatMap(([term, v]) => v.recipes.map((p) => `${p}|${term}`)),
)
const onlyForward = [...forward].filter((x) => !backward.has(x))
const onlyBackward = [...backward].filter((x) => !forward.has(x))
if (onlyForward.length > 0 || onlyBackward.length > 0) {
  fail(`양방향 불일치 — 레시피쪽만 ${onlyForward.length}건, 용어쪽만 ${onlyBackward.length}건`)
}

const withRecipe = Object.values(map).filter((v) => v.recipes.length > 0).length
const withAsset = Object.values(map).filter((v) => v.code_assets.length > 0).length
const withNothing = Object.values(map).filter((v) => v.recipes.length === 0 && v.code_assets.length === 0).length

const summary = {
  terms: terms.length,
  recipes: recipes.length,
  code_assets: registry.items.length,
  terms_with_recipe: withRecipe,
  terms_with_code_asset: withAsset,
  terms_with_nothing: withNothing,
  coverage_pct: Number(((withRecipe / terms.length) * 100).toFixed(1)),
}

if (checkOnly) {
  console.log(`검사 통과: 용어 ${summary.terms} / 레시피 ${summary.recipes} / 코드 자산 ${summary.code_assets}`)
  console.log(`자산 있는 용어 ${summary.terms_with_recipe} (${summary.coverage_pct}%) · 아무것도 없는 용어 ${summary.terms_with_nothing}`)
  process.exit(0)
}

await writeFile(outPath, `${JSON.stringify({ generated_from: ["docs/ui-vocabulary/terms.yml", "recipes/**/*.md", "public/r/registry.json"], summary, terms: map }, null, 2)}\n`, "utf8")

console.log(`용어-자산 매핑 → ${path.relative(root, outPath)}`)
console.log(`  용어 ${summary.terms} · 레시피 ${summary.recipes} · 코드 자산 ${summary.code_assets}`)
console.log(`  레시피가 있는 용어 ${summary.terms_with_recipe} (${summary.coverage_pct}%)`)
console.log(`  코드 자산까지 있는 용어 ${summary.terms_with_code_asset}`)
console.log(`  아무 자산도 없는 용어 ${summary.terms_with_nothing} ← 폴백 규약 대상`)
