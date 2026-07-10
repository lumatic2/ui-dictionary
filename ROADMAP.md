# ROADMAP

> Last updated: 2026-07-10
> Status: Docs Article Depth & Page Examples (active)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="docs-depth-page-examples" status="active" -->
Goal: docs nav의 카탈로그 폴백 카테고리 7종을 서술형 아티클로 심화하고, Marketing Page Examples 3종을 정적 풀 페이지 예제로 제작해 콘텐츠 저작만으로 닫히는 dev 갭을 완결한다. Details: `docs/horizons/2026-07-docs-depth-page-examples.md`. 직전 close: `docs/horizons/2026-07-content-fill.md`.

## Active Milestones

<!-- harness:milestone id="DA1" status="active" priority="P1" -->
### DA1 - Docs 카테고리 아티클 7종 심화
- DoD: 카탈로그 폴백 카테고리 7종(Layout/Styling/Interaction/Accessibility/Motion Effects/UI Blocks/Component API)이 서술형 아티클(한국어 서술·영어 섹션 헤딩, tokens SSOT + 실존 문서 파생, 실예시·복붙 코드)로 완성 판정 통과 후 게이트 해제 + validate/build/lint/브라우저 smoke PASS + 배포 확인(세션 일괄 push).
- Evidence: docs/plans/2026-07-10-da1-docs-category-articles.md
- Gap: docs nav 장문 아티클 22종 대비 카테고리 페이지 7종이 카탈로그 목록 폴백 — 서술형 콘텐츠 부재.
- Status: [ ]

<!-- harness:milestone id="PE1" status="active" priority="P1" -->
### PE1 - Marketing Page Examples 3종 제작
- DoD: Landing/Pricing/About Page Examples 3종이 정적 풀 페이지 예제(StaticUiBlockGroup 방식, 토큰·레시피 기반, 라이트/다크)로 제작되어 게이트 해제, Marketing UI Blocks 축 게이트 뒤 항목 0 + build/lint/smoke PASS + 배포 확인.
- Evidence: PE1 plan doc + changeset README + 배포 확인
- Gap: plus-marketing-page-examples 3종이 termIds 빈 배열로 게이트 뒤 — CF3에서 "완성 페이지 예시 제작" 성격으로 이월됨.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Content Fill, Structure-First Buildout closed 2026-07-10; Figma Workflow, Figma Bridge closed 2026-07-07; Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
