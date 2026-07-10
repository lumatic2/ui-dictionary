# 20260710 CLI Inject

## Target

- ROADMAP milestone: CLI2 - 프로젝트 주입 (init / add)
- Plan: `docs/plans/2026-07-10-cli2-inject.md`

## Scope

- `packages/cli/src/inject.ts` 신규 + `src/index.ts` 커맨드 2종:
  - `init [dir] [--force]`: DESIGN.md + tokens.css + **askewly.css**(tokens import + Tailwind v4 `@theme inline` 바인딩 — 실사에서 바인딩 없이는 토큰 utility가 동작하지 않음을 확인해 산출물에 추가) 생성, 충돌 시 exit 1.
  - `add <recipe> [--out] [--tokens] [--force]`: 레시피 `## Code` fenced 발췌를 `<id>.tsx`로 주입 + tokens_used 대비 대상 tokens.css 확인(부재 시 init 안내) + Checks/Anti-patterns/code_asset 노트 출력.
- `scripts/build-data.mjs`: DESIGN.md·askewly.css(@theme 블록은 사이트 index.css에서 추출, 부재 시 exit≠0) 번들 추가.
- `docs/design-system/cli-registry-contract.md` §3·§4 갱신: add 주입물 = Code 발췌 (code_asset 2/5가 거대 페이지 파일이라 전체 복사 비현실 — 설계 조정 기록).
- `test/inject.test.ts` 신규 (7 케이스).
- Evidence: `docs/research/assets/cli2-external-proof-2026-07-10.png`.

## Contract

- add 주입물은 구조 계약 발췌 — 에이전트가 적응(import·export 추가)하는 것을 전제로 하고, code_asset은 전체 구현 참조로 노트 출력.
- init의 askewly.css 소비법: `@import "tailwindcss"; @import "./askewly.css";`.

## Verification

- [x] vitest 18/18 (기존 11 + inject 7): init 3종 파일·충돌 계약, 5개 레시피 전부 Code 발췌 추출, add 충돌·missing-tokens 계약.
- [x] 로컬 실행: init/add + 실패 모드 3종(충돌·unknown recipe·재충돌) exit 1.
- [x] `npm pack` fresh-env E2E 재실행: npx로 init(3파일)·add popover·충돌 exit 1.
- [x] 외부 프로젝트 실증: 스크래치 Vite+React+Tailwind v4 프로젝트에 init+add button → 최소 적응(import/export) 후 프로덕션 빌드+브라우저 렌더 — primary 버튼이 토큰 경유 askewly violet(rgb 111,45,189)로 렌더, 주입 컴포넌트 hex 리터럴 0, 스크린샷 evidence.
