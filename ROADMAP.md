# ROADMAP

> Last updated: 2026-07-10
> Status: System Content Depth (active)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="system-content-depth" status="active" -->
Goal: 디자인 시스템의 콘텐츠를 채운다 — Principles 증류(사람용 Docs+에이전트용 llms.txt) + 레시피 5→pattern_group 10종 커버리지. Details: `docs/horizons/2026-07-system-content-depth.md`. 직전 close: `docs/horizons/2026-07-agent-design-cli.md`. 조정 시퀀스: Content Depth → 앱 → Docs.

## Active Milestones

<!-- harness:milestone id="SCD1" status="active" priority="P1" -->
### SCD1 - Principles 증류 (사람용 + 에이전트용)
- DoD: 흩어진 원칙을 `docs/design-system/principles.md`(에이전트 정본, 각 원칙에 근거 소스 표기)로 증류 + llms.txt 인덱스 포함 + 사람용 Docs 아티클(파생, 게이트 패턴) + 원칙 내용 사용자 승인 + build/lint/smoke + 배포 확인.
- Evidence: docs/plans/2026-07-10-scd1-principles.md
- Gap: "AI 티 안 나는 UI"가 제품 차별점인데 그 철학이 사용자 대면·에이전트 소비 어디에도 문서화돼 있지 않음 — 암묵 규칙으로 산재.
- Status: [ ]

## Next Candidates

<!-- harness:milestone id="SCD2" status="pending" priority="P1" -->
### SCD2 - 레시피 커버리지 배치 (pattern_group 10종)
- DoD: 미커버 pattern_group에 각 ≥1 레시피(총 5→13종+), recipe-format·validate PASS, 실구현 code_asset 참조, llms.txt 재생성 + CLI 재번들 + `add` 주입 smoke ≥2종 + 배포 확인.
- Evidence: SCD2 plan doc + changeset README(배치 단위) + smoke 기록
- Gap: 레시피 5종뿐 — CLI add·llms.txt로 흐를 콘텐츠가 얇음. 사이트 실구현 예제 수백 개가 미증류 상태.
- Status: [ ]

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md` (Agent Design CLI, Docs Article Depth & Page Examples, Content Fill, Structure-First Buildout closed 2026-07-10; Figma Workflow, Figma Bridge, Public Site Shell, System Model Core, Agent Integration closed 2026-07-07).
