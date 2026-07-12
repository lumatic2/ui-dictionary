# Docs 역할 재정의 — Vocabulary 그룹 통합·중복 축 해소

- Date: 2026-07-12
- Milestone: PX Step 3 (`docs/plans/2026-07-12-px-public-experience.md`)
- Scope: `src/lib/documentation-pages.ts` 단독

## What

승인된 IA 원칙(Docs=읽는 것 / 어휘 사전=용어 참조 / 보는 것=독립 표면) 적용:

- **Vocabulary 사이드바 그룹 신설** (Foundations 뒤, Agent Recipes 앞): 고아 상태였던 어휘 카테고리 아티클 7종(UI Blocks·Component API·Layout·Styling·Interaction·Accessibility·Motion effects)을 Docs 사이드바에 통합. collection id 무변경 — 딥링크 하위호환.
- **중복 축 역할 선언** (lead 한 문장씩): Foundations Accessibility(근거·토큰/상태 계약 정본) ↔ Vocabulary Accessibility(용어 레퍼런스), Foundations Motion ↔ Vocabulary Motion effects 동일 페어링.
- **경계 명시**: Elements Introduction — API/동작 계약 vs Patterns 시각 예시; Agent Recipes Overview — Recipe Gallery가 같은 레시피의 live-render 표면.

## Verification

- [x] `npm run build` PASS (오케스트레이터 결합 게이트 — Step 5 커밋 포함 상태)
- [x] `npm run lint` 6-warning baseline 유지 (오케스트레이터)
- [x] 브라우저 smoke (워커, dev :5177 Playwright): Vocabulary 그룹 7항목 렌더·Layout/Accessibility 클릭 렌더·기존 딥링크 `nav:docs-component-api` 직접 로드 + 사이드바 하이라이트·Foundations Accessibility 역할 문장 관측 — 전부 PASS
- [x] 실패 모드: collection id 무변경으로 기존 nav: filter 전부 유효, exposure 게이트 무접촉
