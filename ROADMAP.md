# ROADMAP

> Last updated: 2026-07-13
> Status: AskewlyDesign Editor Quality — EQ0 planning complete, implementation approval pending
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="askewlydesign-editor-quality" status="active" -->
Goal: 코드 네이티브 캔버스의 기술 proof를 실제 React UI를 보고 만들고 되돌릴 수 있는 Mac 우선 편집 제품으로 끌어올린다. Details: `docs/horizons/2026-07-askewlydesign-editor-quality.md`.

## Active Milestones

<!-- harness:milestone id="EQ0" status="active" priority="P0" evidence="docs/plans/2026-07-13-eq0-mac-reproducible-baseline.md" -->
### EQ0 — Mac Reproducible Baseline
- DoD: fresh clone에서 한 문서화된 진입 명령으로 의존성·로컬 패키지 build·Mac dev launch가 재현되고, core/renderer/bridge/desktop 테스트 행렬이 green이며, production 기본 진입에서 1,000-node fixture와 dev 계기판이 분리된다.
- Evidence: `docs/plans/2026-07-13-eq0-mac-reproducible-baseline.md`, `phases/askewlydesign-mac-baseline/`
- Gap: 루트 workspace 진입점이 없어 수동 install/build 순서가 필요하고, renderer 테스트가 Mac에서 깨지며, production shell이 benchmark fixture로 시작한다.
- Status: [ ] — 상세 계획 완료, 구현 승인 대기

## Next Milestones

- **EQ1 — Real React Rendering Contract**: flat 이름표 renderer를 실제 계층·콘텐츠·clipping·z-order가 보이는 source-linked renderer로 교체.
- **EQ2 — Editor State And Editing Fidelity**: document/ephemeral state 분리, human Undo/Redo, snap·guide, 실제 auto layout, inspector 동기화.
- **EQ3 — Components And Assets**: 시각 Assets surface, main/instance/override/variant, 실제 component/recipe materialization과 source round-trip.
- **EQ4 — Trusted Co-Creation And Mac Delivery**: 사람이 읽는 agent diff·conflict·targeted revert와 macOS package/reopen/recovery/source-integrity를 실제 실사용으로 함께 검증.

## Paused Horizon

- **Public Product & Monetization**: PX는 완료 상태로 유지. AM·AC·PG·PP는 편집기 품질 horizon 종료 또는 재승인 전까지 보류. Details: `docs/horizons/2026-07-public-product-monetization.md`.

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`; Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
