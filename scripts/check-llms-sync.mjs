#!/usr/bin/env node
// llms 정합 게이트 (M5 2026-08-01) — 소스(tokens SSOT·docs·knowledge 등)를 재생성했을 때
// 커밋된 배포물(public/llms*, tokens.css, DESIGN.md frontmatter)과 달라지면 FAIL.
// 실사례: M1 이 copy-language.md 를 고치고 generate-llms-txt 를 안 돌려 llms 가 구본을 서빙(M2 가 부수 정합화).
//
// 동작: 검사 대상 경로가 clean 한지 확인 → 재생성 2종 실행 → git diff → 결과 무관하게 재생성 부산물을 원복.
// Usage: node scripts/check-llms-sync.mjs

import { execSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const WATCHED = [
  "examples/ui-vocabulary-site/public/llms",
  "examples/ui-vocabulary-site/public/llms.txt",
  "examples/ui-vocabulary-site/src/tokens.css",
  "DESIGN.md",
];

function git(args) {
  return spawnSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" });
}

// 1) 검사 대상이 이미 dirty 면 판정 불가 — 사용자 변경을 덮어쓸 수 있어 거부.
const pre = git(["status", "--porcelain", "--", ...WATCHED]);
if (pre.stdout.trim()) {
  console.error("llms-sync: SKIP-FAIL — 검사 대상 경로에 커밋 안 된 변경이 있어 판정 불가. 먼저 커밋/원복하세요:");
  console.error(pre.stdout.trim());
  process.exit(2);
}

// 2) 재생성 (생성기 2종 — tokens.css/DESIGN.md 와 llms 배포물)
try {
  execSync("node scripts/generate-tokens.mjs", { cwd: REPO_ROOT, stdio: "pipe" });
  execSync("node scripts/generate-llms-txt.mjs", { cwd: REPO_ROOT, stdio: "pipe" });
} catch (err) {
  git(["checkout", "--", ...WATCHED]);
  console.error("llms-sync: FAIL — 재생성 커맨드 실패:", err.message);
  process.exit(1);
}

// 3) diff 판정 후 부산물 원복 (작업 트리 청정 유지)
const diff = git(["diff", "--name-only", "--", ...WATCHED]);
git(["checkout", "--", ...WATCHED]);
// untracked 신규 파일(신규 문서 추가 시)도 잡는다
const untracked = git(["status", "--porcelain", "--", ...WATCHED]).stdout
  .split("\n").filter((l) => l.startsWith("??"));
if (untracked.length) {
  execSync(`git clean -fd -- ${WATCHED.map((w) => `"${w}"`).join(" ")}`, { cwd: REPO_ROOT, stdio: "pipe" });
}

const changed = diff.stdout.trim();
if (changed || untracked.length) {
  console.error("llms-sync: FAIL — 소스와 생성물이 어긋남. 재생성 후 커밋 필요:");
  if (changed) console.error(changed);
  untracked.forEach((l) => console.error(l));
  console.error("→ node scripts/generate-tokens.mjs && node scripts/generate-llms-txt.mjs 실행 후 결과를 커밋하세요.");
  process.exit(1);
}
console.log("llms-sync: PASS — 소스·생성물 정합 (watched: " + WATCHED.length + " paths)");
