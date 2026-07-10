# Horizon - Docs Article Depth & Page Examples

Date: 2026-07-10
Status: active

## Goal

docs nav에서 여전히 카탈로그 목록 폴백인 카테고리 7종(Layout / Styling / Interaction / Accessibility / Motion Effects / UI Blocks / Component API)을 서술형 아티클로 심화하고, Marketing Page Examples 3종(Landing / Pricing / About)을 정적 풀 페이지 예제로 제작해 공개한다. 이로써 "콘텐츠 저작만으로 닫히는" dev 갭을 완결한다.

## Why Now

Content Fill close 시점 재고(`docs/roadmap-gap-2026-07-10-b.md`): active milestone 0. 남은 dev 갭 중 Pro 실물 자산(에셋 모델·라이선스 결정 선행, PRD non-goal)과 Download 앱(별도 제품)을 제외하면, 남은 것은 전부 콘텐츠 저작 반복이다:

- **Docs 아티클** — 장문 아티클 22종(Getting Started 5 + Elements intro+9 + Foundations 7 + Agent Recipes 1, 전부 `src/lib/documentation-pages.ts`)이 이미 있고, 카테고리 페이지 7종만 카탈로그 폴백. CF1에서 검증된 관례(한국어 서술 + 영어 섹션 헤딩, tokens SSOT 파생·발명 금지, dev 게이트 → 완성 판정 → 해제)를 그대로 반복하면 된다.
- **Marketing Page Examples** — `navigation-model.ts`의 `plus-marketing-page-examples` 하위 3종이 termIds 빈 배열로 게이트 뒤. CF3 매핑 감사(`docs/research/cf3-collection-mapping-2026-07-10.md`)에서 "term 수집이 아니라 완성 페이지 예시 제작"으로 판정. Blog/Contact/Content/Logo Clouds가 정적 예제 시스템(StaticUiBlockGroup)으로 풀 페이지 렌더된 방식을 재사용한다.

market intake beat 면제 — 기확정 방향의 콘텐츠 채우기로 시장 판단 없음 (사용자 방향 확정 2026-07-10).

## Milestones

### DA1 - Docs 카테고리 아티클 7종 심화

DoD: 카탈로그 폴백 카테고리 7종(Layout/Styling/Interaction/Accessibility/Motion Effects/UI Blocks/Component API)이 서술형 아티클(한국어 서술·영어 섹션 헤딩, tokens SSOT + 실존 문서 파생, 실예시·복붙 코드)로 작성되어 완성 판정을 통과하고 게이트 해제 + validate/build/lint/브라우저 smoke PASS + 배포 확인(세션 일괄 push).

Evidence: `docs/plans/2026-07-10-da1-docs-category-articles.md` + changeset README + 배포 확인.

### PE1 - Marketing Page Examples 3종 제작

DoD: Landing/Pricing/About Page Examples 3종이 정적 풀 페이지 예제(StaticUiBlockGroup 방식, 토큰·레시피 기반, 라이트/다크)로 제작되어 게이트 자연 해제(termIds 또는 정적 예제 배정), Marketing UI Blocks 축에 게이트 뒤 항목 0 + build/lint/smoke PASS + 배포 확인.

Evidence: PE1 plan doc + changeset README + 배포 확인.

## Close Criteria

docs nav 항목 전부가 실콘텐츠(장문 아티클 또는 의도된 카탈로그)로 처리되고, Marketing UI Blocks 축의 게이트 뒤 항목이 0인 상태. Pro/Download 껍데기는 dev 보존(후속 horizon).

## Backlinks

- Objective: `docs/OBJECTIVE.md` (장기 아크 4 "제품 표면")
- 직전 horizon: `docs/horizons/2026-07-content-fill.md` (closed 2026-07-10)
- Gap report: `docs/roadmap-gap-2026-07-10-b.md`
- 완성 판정 계약: `docs/design-system/site-blueprint.md` Section Completion Criteria
