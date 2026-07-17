# ROADMAP

> Last updated: 2026-07-17
> Status: Expressive Stack closed 2026-07-17 (VI1~VI5 전부 완료) — 다음 horizon은 사용자 결정 대기 (`plans/horizons/CANDIDATES.md`: monetization 복귀 후보)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="expressive-stack" status="completed" -->
Goal: 화면에 그려지는 시각 표현 대다수를 4개 렌더링 티어(CSS·SVG/모션/Canvas/WebGL)로 계보화하고, 에이전트가 티어를 판정해 구현할 수 있는 recipe·knowledge를 정본화한다. Details: `plans/horizons/2026-07-expressive-stack.md`.

## Active Milestones

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
