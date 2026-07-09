# Horizon - Content Fill

Date: 2026-07-10
Status: active

## Goal

Structure-First Buildout이 세운 dev 껍데기 중 "콘텐츠만 있으면 열리는 것"(Docs Foundations·Agent Recipes·Showcase 카드·Patterns 빈 컬렉션)을 완성 판정 통과 → 노출 게이트 열기 프로세스(SFB3 실증)로 순차 프로덕션 공개한다.

## Why Now

직전 horizon close 시점 재고: 프로덕션은 클린하지만 껍데기 6종이 dev에 대기 중이다 (`docs/roadmap-gap-2026-07-10.md`). 그중 Docs Foundations/Agent Recipes는 레포 SSOT(tokens/·knowledge/·recipes/)에 재료가 이미 있고, Showcase 카드와 Patterns 컬렉션은 제작·수집 프로세스가 정의돼 있다. **Pro 실물 자산과 Download 앱은 제외** — 에셋 모델/라이선스 결정 선행 필요(PRD non-goal)·별도 제품 개발이므로 후속 horizon.

## Milestones

### CF1 - Docs Foundations And Agent Recipes 공개

DoD: Foundations 아티클 7종(color/typography/spacing-layout/motion/accessibility/dark-mode/tokens)이 레포 SSOT 기반 실콘텐츠(완성 판정: 실예시·라이트/다크·복붙 가능 코드)로 작성되고, Agent Recipes 표면이 `recipes/` 5종+llms.txt 실자산과 연결되며, shell 게이트를 열어 프로덕션 공개(Colors 페이지 foundation 링크 부활 포함) + Chrome evidence + 배포 확인.

Evidence: `docs/plans/2026-07-10-cf1-docs-foundations.md` + changeset README들 + Chrome evidence.

### CF2 - Showcase Atlas Source-Quality 카드

DoD: placeholder 카드 4종(Hero Composition/Command Center/Commerce Flow/Mobile App Patterns) + Dashboard 카드가 토큰·레시피 기반 인터랙티브 미니 데모(기존 완성 8카드와 같은 방식)로 완성 판정을 통과해 공개되거나, 카드별 미달 판단 시 근거와 함께 제거된다. 라이트/다크·reduced-motion 검증 + Chrome evidence + 배포.

Evidence: CF2 plan doc + changeset README들 + Chrome evidence.

### CF3 - Patterns 빈 컬렉션 배치

DoD: 빈 컬렉션 중 우선 4개(Blog/Contact/Content/Logo Clouds Sections)가 UI vocabulary authoring workflow(수집→중복 필터→승격→시각 검증)로 실 terms를 얻어 컬렉션 단위 공개. audit 스크립트·visual 검증 + 배포. (Marketing Page Examples 3종은 완성 페이지 예시 성격이라 후속 배치로 이월.)

Evidence: CF3 plan doc + terms.yml diff + audit 결과 + 배포 확인.

## Close Criteria

Docs Foundations·Agent Recipes·Showcase 카드가 전부 처리(공개 또는 근거 있는 제거)되고, Patterns 빈 컬렉션 최소 4개가 실데이터로 공개된 상태. Pro/Download 껍데기는 dev 보존.

## Backlinks

- Objective: `docs/OBJECTIVE.md` (장기 아크 4 "제품 표면")
- 직전 horizon: `docs/horizons/2026-07-structure-first-buildout.md` (closed 2026-07-10)
- Gap report: `docs/roadmap-gap-2026-07-10.md`
- 완성 판정 계약: `docs/design-system/site-blueprint.md` Section Completion Criteria
