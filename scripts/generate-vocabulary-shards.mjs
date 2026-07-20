// generate-vocabulary-shards.mjs — 용어 사전을 에이전트가 감당할 수 있는 형태로 쪼갠다.
//
// 왜 쪼개나: 원본 `terms.yml` 은 680KB 다. 통째로 fetch 하면 컨텍스트의 상당량을 사전으로 채우고
// 정작 구현할 여력을 잃는다. 그래서 **경량 인덱스 + 그룹별 샤드** 두 층으로 낸다.
//
// 조회 경로 (3 fetch 이내):
//   1) index.md  — 어떤 용어가 있고 어느 그룹에 사는지 (이름만, 정의 없음)
//   2) <group>.yml — 그 그룹 용어들의 본문 전체
//   3) (필요시) 레시피·코드 자산
//
// 손으로 편집하지 마라 — 정본은 `docs/ui-vocabulary/terms.yml` 이고 이 산출물은 파생물이다.
// 사용: node scripts/generate-vocabulary-shards.mjs [--check]
//   --check 는 쓰지 않고 검사만 한다(CI·회귀 확인용).

import { createRequire } from "node:module"
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const siteRoot = path.join(root, "examples", "ui-vocabulary-site")
const require = createRequire(path.join(siteRoot, "package.json"))
const YAML = require("yaml")

const termsPath = path.join(root, "docs", "ui-vocabulary", "terms.yml")
const groupsPath = path.join(root, "docs", "ui-vocabulary", "groups.yml")
const outDir = path.join(siteRoot, "public", "llms", "docs", "ui-vocabulary", "vocabulary")

// 샤드 하나가 이 크기를 넘으면 조회 비용이 다시 커진다. 넘으면 조용히 넘어가지 않고 거부한다.
const SHARD_MAX_BYTES = 40 * 1024

const checkOnly = process.argv.includes("--check")

function fail(msg) {
  console.error(`FAIL: ${msg}`)
  process.exit(1)
}

const terms = YAML.parse(await readFile(termsPath, "utf8"))
const groups = YAML.parse(await readFile(groupsPath, "utf8"))

if (!Array.isArray(terms) || terms.length === 0) fail(`용어 원본을 목록으로 읽지 못했다 — ${termsPath}`)
if (!Array.isArray(groups) || groups.length === 0) fail(`그룹 정의를 목록으로 읽지 못했다 — ${groupsPath}`)

const groupById = new Map(groups.map((g) => [g.id, g]))

// 그룹 없는 용어는 샤드에 자리가 없다. 조용히 누락하면 사전에서 용어가 사라진다 — 명시 에러로 거부한다.
const orphans = terms.filter((t) => !t.group)
if (orphans.length > 0) {
  fail(`group 이 없는 용어 ${orphans.length}건 — 샤드에 담을 자리가 없다: ${orphans.map((t) => t.id).slice(0, 5).join(", ")}`)
}
const unknownGroup = terms.filter((t) => !groupById.has(t.group))
if (unknownGroup.length > 0) {
  fail(`groups.yml 에 없는 group 을 가리키는 용어 ${unknownGroup.length}건: ${unknownGroup.map((t) => `${t.id}→${t.group}`).slice(0, 5).join(", ")}`)
}
const dupes = terms.map((t) => t.id).filter((id, i, arr) => arr.indexOf(id) !== i)
if (dupes.length > 0) fail(`중복 id ${dupes.length}건: ${[...new Set(dupes)].slice(0, 5).join(", ")}`)

// 그룹별로 모은다.
const byGroup = new Map()
for (const t of terms) {
  if (!byGroup.has(t.group)) byGroup.set(t.group, [])
  byGroup.get(t.group).push(t)
}

// --- 샤드 ---
// 상한을 넘는 그룹은 id 순으로 조각낸다. 조각 경계는 크기가 아니라 **정렬된 id**로 정해
// 원본이 안 바뀌면 산출물도 안 바뀌게 한다(재생성 때마다 경계가 흔들리면 URL 이 흔들린다).
function shardFilesFor(groupId, list) {
  const g = groupById.get(groupId)
  const build = (items, partLabel, file) => {
    const header =
      `# ${g.label} (${groupId})${partLabel}\n` +
      `# category: ${g.category} · 용어 ${items.length}개\n` +
      `# 파생물 — 정본은 docs/ui-vocabulary/terms.yml. 손으로 고치지 마라.\n\n`
    const content = header + YAML.stringify(items)
    return { groupId, file, content, items, bytes: Buffer.byteLength(content, "utf8"), count: items.length }
  }
  const sorted = [...list].sort((a, b) => a.id.localeCompare(b.id))
  const whole = build(sorted, "", `${groupId}.yml`)
  if (whole.bytes <= SHARD_MAX_BYTES) return [whole]

  // 조각 수를 1씩 늘려가며 전부 상한 이하가 되는 최소 분할을 찾는다.
  for (let parts = 2; parts <= sorted.length; parts += 1) {
    const per = Math.ceil(sorted.length / parts)
    const chunks = []
    for (let i = 0; i < sorted.length; i += per) chunks.push(sorted.slice(i, i + per))
    const built = chunks.map((c, i) => build(c, ` — part ${i + 1}/${chunks.length}`, `${groupId}-${i + 1}.yml`))
    if (built.every((b) => b.bytes <= SHARD_MAX_BYTES)) return built
  }
  fail(`${groupId}: 용어 하나가 상한을 넘어 분할로 해결되지 않는다`)
}

const shards = []
for (const [groupId, list] of [...byGroup].sort((a, b) => a[0].localeCompare(b[0]))) {
  shards.push(...shardFilesFor(groupId, list))
}

// --- 인덱스 ---
// 정의를 넣지 않는다. 인덱스는 "무엇이 어디 사는지"만 답하고, 본문은 샤드가 답한다.
const byCategory = new Map()
for (const s of shards) {
  const g = groupById.get(s.groupId)
  if (!byCategory.has(g.category)) byCategory.set(g.category, [])
  byCategory.get(g.category).push(s)
}

const indexLines = [
  "# UI Vocabulary — 용어 인덱스",
  "",
  `> 용어 ${terms.length}개 / 그룹 ${shards.length}개. **이름만 있고 정의는 없다** — 정의는 그룹 샤드에 있다.`,
  "> 조회: 여기서 용어를 찾아 그 그룹 샤드 하나만 가져가라. 원본 전체(680KB)를 받을 일은 없다.",
  "> 파생물 — 정본은 `docs/ui-vocabulary/terms.yml`.",
  "",
]
for (const [category, list] of [...byCategory].sort((a, b) => a[0].localeCompare(b[0]))) {
  indexLines.push(`## ${category}`, "")
  for (const s of list) {
    const g = groupById.get(s.groupId)
    const names = s.items.map((t) => `${t.id}(${t.ko?.name ?? ""})`).join(", ")
    const partSuffix = s.file.startsWith(`${s.groupId}-`) ? ` ${s.file.slice(s.groupId.length + 1, -4)}조각` : ""
    indexLines.push(`### ${g.label}${partSuffix} — \`${s.file}\` (${s.count})`, "", names, "")
  }
}
const indexContent = indexLines.join("\n")
const indexBytes = Buffer.byteLength(indexContent, "utf8")

// --- 검사 ---
const shardIds = new Set(shards.flatMap((s) => s.items.map((t) => t.id)))
if (shardIds.size !== terms.length) {
  fail(`샤드 합집합이 원본과 다르다 — 원본 ${terms.length}, 샤드 ${shardIds.size}`)
}

const summary = {
  terms: terms.length,
  shards: shards.length,
  index_kb: Number((indexBytes / 1024).toFixed(1)),
  largest_shard: shards.reduce((a, b) => (a.bytes > b.bytes ? a : b)),
  total_shard_kb: Number((shards.reduce((n, s) => n + s.bytes, 0) / 1024).toFixed(1)),
}

if (checkOnly) {
  console.log(`검사 통과: 용어 ${summary.terms} / 샤드 ${summary.shards} / 인덱스 ${summary.index_kb}KB`)
  console.log(`최대 샤드: ${summary.largest_shard.file} ${Math.round(summary.largest_shard.bytes / 1024)}KB (상한 ${SHARD_MAX_BYTES / 1024}KB)`)
  process.exit(0)
}

// --- 쓰기 (기존 산출물은 지우고 새로 — 원본에서 사라진 그룹의 유령 샤드를 남기지 않는다) ---
await mkdir(outDir, { recursive: true })
for (const f of await readdir(outDir).catch(() => [])) {
  if (f.endsWith(".yml") || f === "index.md") await rm(path.join(outDir, f))
}
for (const s of shards) await writeFile(path.join(outDir, s.file), s.content, "utf8")
await writeFile(path.join(outDir, "index.md"), indexContent, "utf8")

console.log(`용어 샤드 생성 — ${path.relative(root, outDir)}`)
console.log(`  용어 ${summary.terms} → 샤드 ${summary.shards}개 (합 ${summary.total_shard_kb}KB)`)
console.log(`  인덱스 ${summary.index_kb}KB · 최대 샤드 ${summary.largest_shard.file} ${Math.round(summary.largest_shard.bytes / 1024)}KB`)
console.log(`  원본 대비: 통짜 ${Math.round(Buffer.byteLength(await readFile(termsPath, "utf8"), "utf8") / 1024)}KB → 조회 1건당 인덱스+샤드`)
