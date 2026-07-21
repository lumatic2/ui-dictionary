// score-decision-cases.mjs — 요소 판정 케이스 채점기.
//
// 판정자(서브에이전트)는 답과 근거만 낸다. 채점은 여기서 한다 — 자기채점 금지.
// 기준선(VL1)과 처치(VL7)가 **같은 자**로 채점되어야 대조가 성립하므로 스크립트를 공유한다.
//
// 사용: node scripts/score-decision-cases.mjs <answers.json> [--cases <path>] [--json]
//   answers.json = [{ "id": "<case id>", "answer": "<term id>", "because": "<갈린 축>" }, ...]
// 종료 코드: 0 (채점 성공) / 1 (케이스·답 불일치 등 채점 불가)

import { createRequire } from "node:module"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const require = createRequire(path.join(root, "examples", "ui-vocabulary-site", "package.json"))
const YAML = require("yaml")

const argv = process.argv.slice(2)
const asJson = argv.includes("--json")
const casesFlag = argv.indexOf("--cases")
const casesPath = casesFlag !== -1 && argv[casesFlag + 1]
  ? path.resolve(argv[casesFlag + 1])
  : path.join(root, "evidence", "vocabulary-in-use", "cases.yml")
// --cases 의 값 위치만 제외한다. casesFlag 가 -1 일 때 argv[0](=답안 경로)를 지우던 버그가 있었다.
const casesValueIndex = casesFlag !== -1 ? casesFlag + 1 : -1
const answersPath = argv.find((a, i) => !a.startsWith("--") && i !== casesValueIndex)

if (!answersPath) {
  console.error("사용: node scripts/score-decision-cases.mjs <answers.json> [--cases <path>] [--json]")
  process.exit(1)
}

const cases = YAML.parse(await readFile(casesPath, "utf8"))
const answers = JSON.parse(await readFile(path.resolve(answersPath), "utf8"))

if (!Array.isArray(cases) || cases.length === 0) {
  console.error(`FAIL: 케이스를 목록으로 읽지 못했다 — ${casesPath}`)
  process.exit(1)
}

const byId = new Map(cases.map((c) => [c.id, c]))
const answered = new Map()
for (const a of answers) {
  if (!byId.has(a.id)) {
    console.error(`FAIL: 케이스에 없는 id 에 답했다 — ${a.id}`)
    process.exit(1)
  }
  if (answered.has(a.id)) {
    console.error(`FAIL: 같은 케이스에 두 번 답했다 — ${a.id}`)
    process.exit(1)
  }
  answered.set(a.id, a)
}

const missing = cases.filter((c) => !answered.has(c.id)).map((c) => c.id)
if (missing.length > 0) {
  console.error(`FAIL: 답이 없는 케이스 ${missing.length}건 — ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " …" : ""}`)
  process.exit(1)
}

// 근거 없는 답은 무효다 — 맞았어도 감으로 맞은 것과 구분되지 않는다.
const ungrounded = cases.filter((c) => !String(answered.get(c.id).because ?? "").trim()).map((c) => c.id)

// 표기 흔들림으로 오답 처리되는 것을 막는다 — "Accordion" / "accordion" / "load more" 는 같은 답이다.
// 판정을 느슨하게 만드는 게 아니라, 측정하려는 것이 표기법이 아니기 때문이다.
const canon = (s) => String(s ?? "").toLowerCase().replace(/[\s_-]+/g, "").trim()

// 같은 요소의 다른 이름. **판정이 아니라 표기만** 다른 쌍만 넣는다 — 의미가 갈리면 넣지 않는다.
// (2026-07-21 VL1 기준선 실행 후 추가. 추가 방향은 보수적이다: 기준선 점수를 *올려* 처치가 넘어야 할
//  문턱을 높인다. 기준선과 처치가 같은 표를 쓰므로 대조는 유지된다.)
const ALIASES = {
  modal: ["dialog", "modaldialog", "confirmationdialog", "alertdialog"],
  drawer: ["sidepanel", "sidesheet", "slideover", "sidedrawer"],
  "search-field": ["searchbar", "searchinput", "searchbox"],
  "load-more": ["loadmorebutton", "showmorebutton", "showmore"],
  "toggle-switch": ["switch", "toggle"],
  "progress-bar": ["progressindicator", "determinateprogress"],
  "empty-state": ["emptystatemessage"],
  card: ["cardgrid", "cards"],
  list: ["listview"],
  select: ["dropdown", "listbox", "picker", "selectmenu"],
  popover: ["flyout"],
  spinner: ["loadingspinner", "activityindicator"],
  // 2026-07-21 VL7 처치 실행 후 추가. 처치 판정자가 사전을 **실제로 읽어서** 진짜 term id 로 답했는데
  // 케이스 라벨이 일반 UX 용어로 적혀 있어 오답 처리됐다. `radio`·`banner`·`single-long-form` 은
  // 애초에 terms.yml 에 없는 이름이다 — 자를 결과에 맞춘 게 아니라 **라벨의 결함을 고친 것**이다.
  // 방향이 처치에 유리하므로 원시 점수와 보정 점수를 둘 다 보고한다(vl7-separation.md §자 보정).
  radio: ["radiogroup", "radiobuttons", "radiobutton"],
  banner: ["alert", "inlinealert", "inlinebanner", "persistentalert"],
  "single-long-form": ["pagelayout", "longformpage", "longform", "singlepageform", "onepageform"],
  "tab-bar": ["bottomnavigation", "bottomtabbar", "tabbar"],
  "segmented-control": ["mobilesegmentedtabs", "segmentedtabs", "segmentedbuttons"],
}
const aliasOf = new Map()
for (const [target, names] of Object.entries(ALIASES)) {
  for (const n of names) aliasOf.set(canon(n), canon(target))
}
const norm = (s) => {
  const c = canon(s)
  return aliasOf.get(c) ?? c
}

const rows = cases.map((c) => {
  const a = answered.get(c.id)
  const accepted = [c.answer, ...(c.also_acceptable ?? [])].map(norm)
  return {
    id: c.id,
    cluster: c.cluster,
    expected: c.answer,
    got: a.answer,
    correct: accepted.includes(norm(a.answer)),
    grounded: Boolean(String(a.because ?? "").trim()),
    because: a.because ?? "",
  }
})

const byCluster = new Map()
for (const r of rows) {
  if (!byCluster.has(r.cluster)) byCluster.set(r.cluster, { total: 0, correct: 0 })
  const s = byCluster.get(r.cluster)
  s.total += 1
  if (r.correct) s.correct += 1
}

const total = rows.length
const correct = rows.filter((r) => r.correct).length
const report = {
  cases_path: path.relative(root, casesPath),
  answers_path: path.relative(root, path.resolve(answersPath)),
  total,
  correct,
  accuracy_pct: Number(((correct / total) * 100).toFixed(1)),
  ungrounded: ungrounded.length,
  by_cluster: Object.fromEntries(
    [...byCluster].map(([k, v]) => [k, { total: v.total, correct: v.correct, pct: Number(((v.correct / v.total) * 100).toFixed(1)) }]),
  ),
}

if (asJson) {
  console.log(JSON.stringify({ ...report, rows }, null, 2))
} else {
  console.log(`채점: ${report.correct}/${report.total} = ${report.accuracy_pct}%`)
  if (report.ungrounded > 0) console.log(`근거 없는 답 ${report.ungrounded}건 — 맞아도 감으로 맞은 것과 구분 불가`)
  console.log("---")
  for (const [cluster, s] of Object.entries(report.by_cluster)) {
    console.log(`${cluster.padEnd(24)} ${s.correct}/${s.total}  ${s.pct}%`)
  }
  const wrong = rows.filter((r) => !r.correct)
  if (wrong.length > 0) {
    console.log("---")
    console.log("오답:")
    for (const r of wrong) console.log(`  ${r.id}: ${r.got} (정답 ${r.expected})`)
  }
}
