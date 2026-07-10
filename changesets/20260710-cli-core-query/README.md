# 20260710 CLI Core Query

## Target

- ROADMAP milestone: CLI1 - 코어 조회 CLI + registry 계약 (Steps 1~4)
- Plan: `docs/plans/2026-07-10-cli1-core-query.md`

## Scope

- `packages/cli/` 신규: `@askewly/design`(바이너리 `askewly-design`) Node/TS CLI — commander 기반, SSOT 번들 방식(오프라인 동작).
  - `scripts/build-data.mjs`: terms.yml(536)·askewly.tokens.json·tokens.css(생성물)·recipes 5종 frontmatter+body → `data/*.json` 번들 (소스 누락 시 exit≠0).
  - `src/index.ts`·`src/load.ts`: `terms search|show`, `tokens [--tier|--format json|css]`, `recipes list|show`, 전 커맨드 `--json` 에이전트 출력.
  - `test/cli.test.ts`: vitest 11개 (데이터 무결성·검색 랭킹·tier 필터·exit code 계약).
- `docs/design-system/cli-registry-contract.md` 신규: 소스→번들 매핑, 버전 규약, shadcn registry-item 스키마 대응(CLI2 `add` 입력 계약), 커맨드 표면.

## Contract

- 데이터는 전부 SSOT 파생 — 번들(`data/`)·빌드 산출물(`dist/`)은 gitignore, `prepack`이 재생성.
- 실패 계약: 없는 term/recipe/tier/format, 검색 0건 → stderr + exit 1.
- ADR 0004 준수: CLI-first, 이름 `@askewly/design`, 위치 packages/cli. npm publish는 CLI3 범위.

## Verification

- [x] 빌드: `npm run build`(build:data + tsc) PASS — terms=536, recipes=5 번들.
- [x] 조회 E2E: terms search/show(한국어 질의 포함), tokens json/tier/css, recipes list/show 실행 출력 관측.
- [x] 실패 모드 5종: unknown term/recipe/tier/format·검색 0건 전부 stderr+exit 1.
- [x] 테스트: vitest 11/11 PASS.
- [x] `npm pack` → 신규 임시 디렉터리 `npm install <tgz>` → `npx askewly-design` 조회·`--json` 파싱·실패 모드 재실행 PASS (fresh-env E2E).
