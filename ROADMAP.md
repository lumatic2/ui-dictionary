# ROADMAP

> Last updated: 2026-07-17
> Status: Agent Adoption Loop — AD1·AD2 완료(2026-07-17), AD3 활성 (monetization은 parked, `docs/horizons/CANDIDATES.md`)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="agent-adoption-loop" status="active" -->
Goal: Claude/Codex 디자인 작업에서 askewly design 조회가 기본 경로가 되고 결과물이 사용자 스타일 기준을 통과하는 상태를 만든다. Details: `docs/horizons/2026-07-agent-adoption-loop.md`.

## Active Milestones

<!-- harness:milestone id="AD1" status="completed" priority="P0" evidence="docs/plans/2026-07-17-ad1-default-routing.md" -->
### AD1 — Default Routing 배선
- DoD: 진입 프로토콜이 llms.txt에 노출(링크 무결성 PASS), Claude 배선(전역 CLAUDE.md 규칙 + 디자인 스킬 갱신·재배포) + Codex 배선(전역 지침·배포 미러), 양 에이전트 신규 세션 E2E에서 askewly design 자동 조회 관측 + 산출물 색 리터럴 0, 실패 모드(오경로 fetch loud failure) 확인.
- Evidence: docs/plans/2026-07-17-ad1-default-routing.md
- Gap: 발견·소비 경로(llms.txt·스킬)는 있으나 디자인 작업 → askewly design 자동 라우팅 규칙이 없어 실사용 흐름이 발화하지 않음.
- Scale: changesets>=3; surfaces: llms.txt fetch, Claude·Codex 신규 세션 E2E(외부 프로젝트); capability: 디자인 작업 기본 라우팅
- Status: [x]

- Completed at: 2026-07-17
- Summary: 진입 프로토콜 llms.txt 노출 + Claude(규칙+hook)·Codex(AGENTS.md) 라우팅 배선 — 양 에이전트 E2E 토큰 파생 PASS(14/14·16/16, 발명 0), silent 404·URL 구성 결함 적발·봉합 — changesets #99–101
<!-- harness:milestone id="AD2" status="completed" priority="P0" evidence="docs/plans/2026-07-17-ad2-style-signature.md" -->
### AD2 — Style Signature
- DoD: 기존 자산(토큰 SSOT·templates·사이트·과거 결과물) 역산 초안 → 사용자 인터뷰 확정을 거친 style-signature 정본 + 판정 체크리스트, 체크리스트가 design-qa 스킬·llms.txt에 편입되어 실제 판정 1회 구동.
- Evidence: docs/plans/2026-07-17-ad2-style-signature.md
- Gap: 결과물이 "유성 스타일"인지 판정할 기준이 시스템에 없음 — close 기준(체크리스트 통과)의 전제.
- Scale: changesets>=2; surfaces: llms.txt fetch, design-qa 스킬 실판정 구동; capability: 스타일 적합성 판정
- Status: [x]

- Completed at: 2026-07-17
- Summary: 인터뷰 확정 시그니처(운용 원칙 5 + 비선호 5, 점수제 폐기) — entry-protocol 판정 단계 편입·llms.txt 배포, 실판정 1회 구동(발명 팔레트 FAIL 변별) — changesets #102–103
<!-- harness:milestone id="AD3" status="active" priority="P1" -->
### AD3 — Real-work Dogfooding
- DoD: dogfooding ledger 인프라 + 실작업 3건 이상(지정 2건=bootcamp.askewly.com 표면 2곳(사용자 확정 2026-07-17) + 기회주의)이 라우팅 경유로 수행되어 건별 조회 경로·AD2 체크리스트 판정·마찰이 장부화.
- Evidence: `docs/research/dogfooding/ledger.md`(신설) + 활성화 시 plan doc
- Gap: 실사용 0건에 가까워 마찰·부족 자산을 모름 — 채택 흐름의 실증 그 자체.
- Scale: changesets>=3; surfaces: 외부 레포 실작업 결과물, ledger; capability: 실작업 채택 실증
- Status: [ ]

<!-- harness:milestone id="AD4" status="active" priority="P1" evidence="docs/plans/2026-07-17-ad4-gap-driven-expansion.md" -->
### AD4 — Gap-driven 확장
- DoD: AD3 장부의 갭 목록이 우선순위화되고, 수요 주도 자산 확장(recipe/token/anti-pattern/프로토콜)이 기존 검증 체인(build:catalog·llms.txt·audit:visuals)을 통과하며, 장부 항목 → 자산 반영 추적이 남는다.
- Evidence: 활성화 시 plan doc + 갭별 changeset 추적표
- Gap: 수요 주도 성장 루프 단절 — 쓰다가 부족한 자산을 채우는 루프가 안 돌고 있음.
- Scale: changesets>=2; surfaces: site build·llms.txt·audit:visuals; capability: 수요 주도 자산 성장 루프
- Status: [ ]

## 유지보수 후보 (milestone 아님)

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)
- ui-dictionary CLAUDE.md의 design-bootstrap/custom-skills 스킬 서술 stale — 로컬 design-* 스킬 소스 부재 (AD1 실사, changeset #100)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; Public Product & Monetization parked 2026-07-17 (PX completed), Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
