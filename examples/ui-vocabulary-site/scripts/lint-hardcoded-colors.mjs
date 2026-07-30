#!/usr/bin/env node
// 하드코딩 색 스캐너 (DM2) — src/**/*.{ts,tsx} 에서 리터럴 팔레트 Tailwind 클래스·hex 를 검출한다.
// 셸(사이트 UI) 코드는 semantic 토큰 클래스(bg-background 등)만 써야 한다 — 위반은 다크모드를 구조적으로 막는다.
//
// 데모 콘텐츠는 검사 대상이 아니다(ALLOWLIST): 데모는 두 팔레트를 콘텐츠로서 보여주는 것이 기능이다.
// 셸 파일 안의 의도적 고정색(브랜드 색 등)은 해당 줄 또는 직전 줄에 `hardcoded-color-ok` 주석으로 예외 처리한다.
//
// Usage: node scripts/lint-hardcoded-colors.mjs [--max N] [--list]
//   --max N : 총 위반 건수가 N 을 넘으면 exit 1 (게이트 모드 — step-3 에서 0 으로 배선)
//   --list  : 위반 라인 전부 출력 (기본은 파일별 건수 요약)

import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync, statSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "src");

// 데모 콘텐츠 — 사이트 테마와 격리된 콘텐츠 표면 (검사 제외)
const ALLOWLIST = [
  "components/marketing-section-preview.tsx",
  "components/variation-demos/",
  // 색이 콘텐츠 데이터인 라이브러리 (팔레트 생성기 데이터 · 문서 예시 코드)
  "lib/palette-generator.ts",
  "lib/documentation-pages.ts",
  // 용어 미니목 데모 렌더러 — 미니목 안 색(브랜드 로고·글래스·Light/Dark 병치)이 콘텐츠다.
  // 프레임/라벨은 semantic 토큰 사용 중 (2026-07-31 실측: 셸 프레임 위반 0)
  "components/term-visual.tsx",
  // 랜딩 쇼케이스/Atlas 데모 캔버스 지배 파일 — 셸(푸터·히어로 카피)은 이미 토큰화 완료.
  // 줄 단위 마커 208개가 JSX 자식 위치에서 텍스트로 렌더되는 사고(2026-07-31 사람 관측 적발)로 파일 단위 예외로 전환.
  "components/home-page.tsx",
];

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PREFIX =
  "bg|text|border|ring|divide|from|via|to|fill|stroke|outline|decoration|accent|caret|placeholder|shadow";
// bg-slate-100, text-white/70, dark:bg-slate-900 등 — variant 접두(dark:, hover: …)가 붙어도 잡는다.
const CLASS_RE = new RegExp(
  `(?<![\\w-])(?:${PREFIX})-(?:(?:${PALETTE})-\\d{2,3}|white|black)(?:/\\d{1,3})?(?![\\w-])`,
  "g",
);
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const OPT_OUT = "hardcoded-color-ok";
// 블록 예외: 복사용 코드 스니펫 문자열처럼 구간 전체가 콘텐츠인 곳
const OPT_OUT_START = "hardcoded-color-ok-start";
const OPT_OUT_END = "hardcoded-color-ok-end";

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(ts|tsx)$/.test(name)) files.push(p);
  }
  return files;
}

const args = process.argv.slice(2);
const maxIdx = args.indexOf("--max");
const max = maxIdx >= 0 ? Number(args[maxIdx + 1]) : null;
const list = args.includes("--list");

const results = new Map();
let total = 0;

for (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).split(path.sep).join("/");
  if (ALLOWLIST.some((a) => rel.startsWith(a))) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const hits = [];
  let inBlock = false;
  lines.forEach((line, i) => {
    if (line.includes(OPT_OUT_START)) { inBlock = true; return; }
    if (line.includes(OPT_OUT_END)) { inBlock = false; return; }
    if (inBlock) return;
    if (line.includes(OPT_OUT)) return;
    if (i > 0 && lines[i - 1].includes(OPT_OUT) && !lines[i - 1].includes(OPT_OUT_END)) return;
    // 주석 줄은 코드가 아니다
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    const found = [...(line.match(CLASS_RE) ?? []), ...(line.match(HEX_RE) ?? [])];
    if (found.length) hits.push({ line: i + 1, tokens: found });
  });
  if (hits.length) {
    const count = hits.reduce((n, h) => n + h.tokens.length, 0);
    results.set(rel, { count, hits });
    total += count;
  }
}

const sorted = [...results.entries()].sort((a, b) => b[1].count - a[1].count);
for (const [rel, { count, hits }] of sorted) {
  console.log(`${String(count).padStart(5)}  ${rel}`);
  if (list) for (const h of hits) console.log(`         L${h.line}: ${h.tokens.join(" ")}`);
}
console.log(`total: ${total} violations in ${results.size} files (allowlist: ${ALLOWLIST.length} entries)`);

if (max !== null && total > max) {
  console.error(`FAIL lint:colors — ${total} > max ${max}`);
  process.exit(1);
}
