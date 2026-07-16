# ROADMAP

> Last updated: 2026-07-17
> Status: Agent Adoption Loop — AD1 활성 (monetization은 parked, `docs/horizons/CANDIDATES.md`)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="agent-adoption-loop" status="active" -->
Goal: Claude/Codex 디자인 작업에서 askewly design 조회가 기본 경로가 되고 결과물이 사용자 스타일 기준을 통과하는 상태를 만든다. Details: `docs/horizons/2026-07-agent-adoption-loop.md`.

## Active Milestones

<!-- harness:milestone id="AD1" status="active" priority="P0" -->
### AD1 — Default Routing 배선
- DoD: 진입 프로토콜이 llms.txt에 노출(링크 무결성 PASS), 전역 CLAUDE.md 라우팅 규칙 + 디자인 스킬 참조 갱신·재배포, 신규 세션 E2E에서 askewly design 자동 조회 관측 + 산출물 색 리터럴 0, 실패 모드(오경로 fetch loud failure) 확인.
- Evidence: `docs/plans/2026-07-17-ad1-default-routing.md`
- Gap: 발견·소비 경로(llms.txt·스킬)는 있으나 디자인 작업 → askewly design 자동 라우팅 규칙이 없어 실사용 흐름이 발화하지 않음.
- Scale: changesets>=2; surfaces: llms.txt fetch, 신규 세션 E2E(외부 프로젝트); capability: 디자인 작업 기본 라우팅
- Status: [ ]

## Next Candidates (활성화 시 §B0.5 Beat 3 확정)

- **AD2 — Real-work Dogfooding**: 실제 프로젝트 디자인 작업 3~5건 askewly design 경유 수행 + 마찰 장부화 (대상 프로젝트 = 사용자 결정).
- **AD3 — Style Signature**: "내 스타일" 판정 기준 성문화(기존 자산 역산 + 인터뷰 보강) + 검증 루프 편입.
- **AD4 — Gap-driven 확장**: dogfooding 장부 기반 수요 주도 recipe/token/anti-pattern 확장.

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
