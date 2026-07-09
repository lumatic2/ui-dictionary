# 20260710 Docs Shell Gate Open

## Target

- ROADMAP milestone: CF1 - Docs Foundations And Agent Recipes 공개 (Step 4)
- Plan: `docs/plans/2026-07-10-cf1-docs-foundations.md`

## Scope

- `src/lib/documentation-pages.ts`: Foundations 7종 + Agent Recipes의 `shell: true` 16곳 제거 — 프로덕션 노출.
- `src/components/colors-page.tsx`: "Read the Color foundation" 버튼 2곳 게이트 해제 (+ 불용 import 정리).
- Chrome evidence: `docs/research/assets/cf1-docs-2026-07-10/` (desktop light/dark, mobile).

## Contract

- 완성 판정(blueprint Docs 아티클 행) 통과 후 게이트 열기 — CF1 Step 1~3 changesets(#35, #36) 참조.
- 다른 껍데기(Pro 하위·Download·Showcase landing 카드)는 계속 비노출.

## Verification

- [x] `npm run lint` PASS, `npm run build` PASS (부모 직접 — 병렬 편집 종료 후 안정 트리).
- [x] prod preview(4183): Foundations 7종 사이드바 노출 + Color 아티클 한국어 렌더(한글 run 425) + Agent Recipes 아티클(llms.txt·Verification checklist) 렌더.
- [x] 회귀: Pro 하위 skeleton 비노출, 홈 Hero Composition 카드 비노출, placeholder/Content pending 누출 0.
- [x] Chrome evidence 3장 (desktop light/dark, mobile light).
- [x] 프로덕션 배포 반영 확인: push `a9a930a` → 신규 asset `index-W0X34api.js`, 실사이트 — Foundations 7종 사이드바 노출(데스크톱), Color 아티클 한국어 렌더, Agent Recipes(llms.txt·checklist) 렌더, Content pending 누출 0. ※모바일 뷰포트에서 사이드바 미표시는 기존 반응형 동작.
