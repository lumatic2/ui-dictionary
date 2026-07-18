# ROADMAP

> Last updated: 2026-07-18
> Status: Design Brief active (착수 인터뷰 + 프로젝트 룩 소유권 — 사용자 발의 2026-07-18)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="design-brief" status="active" -->
Goal: 디자인 진입에 시니어 디자이너식 브리프 인터뷰를 추가하고(규모 비례), 답변을 프로젝트 DESIGN.md로 저장해 룩 소유권을 생성한다. Details: `plans/horizons/2026-07-design-brief.md`.

## Active Milestones

<!-- harness:milestone id="DB1" status="active" priority="P0" -->
### DB1 — 브리프 계약 정본 + 프로토콜 배선
- DoD: design-brief.md(규모 게이트·7도메인·DESIGN.md 계약·headless 폴백)가 llms 배포되고 entry-protocol이 브리프 단계를 지시한다.
- Evidence: curl design-brief.md + entry-protocol grep
- Gap: 무토큰 프로젝트의 룩 소유권을 만드는 절차 부재 — 에이전트 추정으로 메움(진주 만두 실증)
- Scale: changesets>=2; surfaces: ui.askewly.com curl; capability: 브리프 계약 정본
- Status: [ ]

<!-- harness:milestone id="DB2" status="pending" priority="P0" -->
### DB2 — skill 개정 + E2E
- DoD: skill이 브리프 단계를 안무하고, E2E로 생략(소형)·발동(신규 화면)·파생(DESIGN.md 존재) 3경로가 관측된다.
- Evidence: evidence/design-brief/ 로그 + 대화형 실연
- Gap: 계약이 실제 흐름에서 도는지 검증 필요(SE2 교훈: 1차 미발화)
- Scale: changesets>=2; surfaces: headless 세션 2 + 대화형 실연; capability: 브리프 흐름 실증
- Status: [ ]

<!-- harness:milestone id="SE1" status="completed" priority="P0" evidence="changesets/20260718-askewly-design-skill/README.md" -->
### SE1 — skill 신설 + 프로토콜 사람 게이트 개정
- DoD: entry-protocol에 스크린샷+사람 확인 게이트가 배포 반영되고, askewly-design skill이 Claude·Codex 양쪽에 배포된다.
- Evidence: changesets/20260718-entry-protocol-human-gate/README.md, changesets/20260718-askewly-design-skill/README.md
- Gap: 자가 판정만으론 상한 보증 없음(사람 눈 부재) + 전역 규칙 진입은 비결정적(AD1 실측)
- Scale: changesets>=2; surfaces: ui.askewly.com curl, skill 배포처 2곳; capability: 사람 게이트 내장된 skill 진입 경로
- Status: [x]

- Completed at: 2026-07-18
- Summary: entry-protocol 사람 게이트 배포 + askewly-design skill Claude·Codex 배포
<!-- harness:milestone id="SE2" status="completed" priority="P0" evidence="changesets/20260718-global-routing-removal/README.md, changesets/20260718-skill-entry-e2e/README.md" -->
### SE2 — 전역 규칙 제거 + E2E 검증
- DoD: 양 전역 파일에서 "디자인 판정" 절 제거(grep 0) + headless E2E로 skill 발화·스크린샷 산출 관측.
- Evidence: changesets/20260718-global-routing-removal/README.md, changesets/20260718-skill-entry-e2e/README.md
- Gap: 전역 절은 모든 세션에 주입되는 noise — skill 단일 경로로 대체 (사용자 확정: 완전 제거)
- Scale: changesets>=2; surfaces: 전역 파일 2개, headless Claude/Codex 세션; capability: skill 단일 진입 경로 실증
- Status: [x]

- Completed at: 2026-07-18
- Summary: 전역 절 제거(grep 0) + 양 에이전트 E2E skill 발화·스크린샷 관측 (1차 FAIL→교정→PASS)
## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
