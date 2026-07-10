# 20260710 Showcase Gate Open

## Target

- ROADMAP milestone: CF2 - Showcase Atlas Source-Quality 카드 (Step 3)
- Plan: `docs/plans/2026-07-10-cf2-showcase-cards.md`

## Scope

- `src/components/home-page.tsx`: `placeholderAtlasItemIds`를 빈 배열로 (12카드 전부 공개 — 게이트 메커니즘은 보존), `DarkInversionSection`(Product operations dashboard) 게이트 해제.
- 카드별 완성 판정(부모 직접, 스크린샷 리뷰): landing/command/commerce/mobile + Dashboard 전부 통과 — 제거 카드 0.
- Chrome evidence: `docs/research/assets/cf2-showcase-2026-07-10/` (atlas grid desktop light/dark, mobile, dashboard).

## Contract

- 프로덕션 변화: 홈 Atlas 8→12칸 + Dashboard 섹션 복귀. hero "Get Started"(Download 진입)·Pro 하위·Download·Patterns 빈 컬렉션은 계속 비노출.

## Verification

- [x] `npm run lint` PASS, `npm run build` PASS (부모 직접).
- [x] prod preview(4188, 로컬 Playwright 스크립트): 12카드+Dashboard 렌더, placeholder 텍스트 0, Pro 하위 비노출, `?page=download` 홈 정규화. ("Get Started" 검출은 Hero 데모 mock CTA 카피 — 실 진입 버튼은 게이트 유지 확인, home-page.tsx:226)
- [x] 카드 품질 판정: 스크린샷 리뷰 통과 (Hero 3변형·Command 실사 커맨드·Dashboard 스탯/차트/상태).
- [x] 프로덕션 배포 반영 확인: 일괄 push `ed74eda` → `index-DS_5UVrc.js`, 실사이트 — 카드 4종+Dashboard 렌더(h3 12), placeholder 0 (2026-07-10).
