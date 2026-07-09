# 20260710 Agent Recipes Surface

## Target

- ROADMAP milestone: CF1 - Docs Foundations And Agent Recipes 공개 (Step 3)
- Plan: `docs/plans/2026-07-10-cf1-docs-foundations.md`

## Scope

- `src/lib/documentation-pages.ts`의 `docs-agent-recipes` 아티클 실콘텐츠(한국어): Agent Recipes 정의·Codex/Claude Code 소비 흐름(llms.txt→레시피·토큰 로드→색 리터럴 0 구현), 레시피 5종 목록(Button/Topbar Command Search/Popover/Showcase Card/Landing Hero + pattern_group), llms.txt 자산 링크, recipe-format.md 파생 검증 체크리스트. `onThisPage` 동기화.
- `shell: true` 유지 — 게이트 열기는 Step 4.

## Contract

- 링크 정합: 아티클 내 링크는 실존 llms.txt 자산과 1:1.

## Verification

- [x] `https://ui.askewly.com/llms.txt` 200 + 링크된 자산 10개 전부 200 (구현 에이전트 curl).
- [x] `npm run lint` PASS, `npm run build` PASS (구현 에이전트).
- [x] dev 렌더/번들 포함 확인 후 서버 종료.
- [x] 부모 통합 게이트 재검증 완료 — Step 4(changeset #38)에서 lint/build/preview 스모크 PASS (2026-07-10).
