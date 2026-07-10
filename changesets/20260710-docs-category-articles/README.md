# 20260710 Docs Category Articles

## Target

- ROADMAP milestone: DA1 - Docs 카테고리 아티클 7종 심화 (Steps 1~4)
- Plan: `docs/plans/2026-07-10-da1-docs-category-articles.md`

## Scope

- `src/lib/documentation-pages.ts`: 카탈로그 폴백 카테고리 7종(Layout/Styling/Interaction/Accessibility/Motion & Effects/UI Blocks/Component API)에 서술형 아티클 신규 저작(한국어 서술·영어 섹션 헤딩, tokens SSOT + pattern-taxonomy/groups.yml 파생) + `kind` 유니온에 `"category"` 추가. 완성 판정 통과 후 `shell: true` 7곳 제거(게이트 해제).
- `src/App.tsx`: category kind 아티클은 Related terms에 해당 컬렉션 전체 term 목록 전달(기존 카탈로그 목록 보존 — 다른 kind는 기존 6개 유지).
- Evidence: `docs/research/assets/da1-docs-category-articles-2026-07-10/` (desktop light/dark, mobile light/dark 4장).

## Contract

- 아티클은 SSOT 파생 원칙 — `tokens/askewly.tokens.json`(space 4–64px 6단계, radius 4단계, typography 5 scale/2 weight), `docs/ui-vocabulary/groups.yml` group 라벨, 기존 아티클 22종의 관례에서만 서술. duration/easing 토큰 부재는 gap으로 명시(Foundations Motion과 동일 계약).
- 기존 Foundations/Elements 아티클과 역할 분담: Foundations=토큰 정의, category=조합·판단 기준 (본문에서 상호 참조).
- 다른 껍데기(Pro 하위·Download·Templates·Page Examples)는 계속 비노출.

## Verification

- [x] `npm run lint` PASS(기존 경고만), `npm run build` PASS.
- [x] dev 렌더 스모크: 7종 전부 아티클+Checklist+Related terms 렌더 + foundations 회귀 PASS (`smoke-da1.mjs` 8/8).
- [x] shell 게이트 회귀: 해제 전 prod preview에서 아티클 7종 비노출(카탈로그 폴백 유지) 7/7 PASS.
- [x] 게이트 해제 후 prod preview(5198): 아티클 7종 렌더 + docs-all 랜딩 → Layout 클릭 진입 E2E + 모바일 375px 가로 overflow 0 + nav 게이트 홀드(Page Examples/Download 비노출, 라이브 패리티) + evidence 4장.
- [x] 프로덕션 배포 반영 확인: push `5b48b31`(일괄) → ui.askewly.com에서 Layout("Container and rhythm")·Styling·Component API 아티클 렌더 + foundations 회귀 PASS (2026-07-10).

## Notes

- 발견(기존 사안, 이 changeset 범위 밖): DocsArticlePage 렌더러의 heading이 `text-slate-950` 하드코딩이라 다크 모드에서 제목 대비가 무너짐 — 라이브의 기존 22종 아티클 동일(oklch 0.129 계측). 후속 개선 후보.
- 게이트 딥링크 계측: 노출 게이트는 nav/목록만 차단하고 직접 URL 접근은 렌더됨 — 라이브와 동일한 기존 설계.
