# 20260710 Docs Shell: Foundations + Agent Recipes

## Target

- ROADMAP milestone: SFB2 - Shell Buildout (Step 1)
- Plan: `docs/plans/2026-07-10-sfb2-shell-buildout.md`

## Scope

- `src/lib/documentation-pages.ts`: Foundation skeleton 아티클 7종(color/typography/spacing-layout/motion/accessibility/dark-mode/tokens — blueprint Foundation 페이지 타입 6섹션 구조 + "Content pending — fill criteria: source-quality" 슬롯) + Agent Recipes 개요 skeleton 1종(실존 llms.txt 링크 + 레시피/체크리스트 슬롯). `shell: true` 플래그.
- `src/lib/navigation-model.ts`: 신설 컬렉션 id 8종 등록.
- `src/lib/exposure.ts`: `isShellVisible()` 헬퍼 추가 (shell 플래그 게이트).
- `src/App.tsx`: docs 사이드바 nav를 shell 게이트로 필터링.

## Contract

- 신설 skeleton 전부 dev-only (`SHOW_UNFILLED`). 프로덕션 표면 변화 0.
- 실 콘텐츠 작성은 SFB3 — skeleton은 구조·슬롯만.

## Verification

- [x] `npm run lint` PASS (에이전트 + 부모 독립 재실행).
- [x] `npm run build` PASS (독립 재실행).
- [x] dev 스모크: Foundations 7종 + Agent Recipes가 사이드바에 나타나고 skeleton 렌더 (구현 에이전트, 4190).
- [x] prod 비노출 회귀: preview DOM에서 신설 항목 0건 (구현 에이전트, 4191).
