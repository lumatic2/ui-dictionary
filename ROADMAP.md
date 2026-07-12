# ROADMAP

> Last updated: 2026-07-12
> Status: H2.5 Quality & Dogfooding active (2026-07-12 사용자 승인 활성화)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="quality-dogfooding" -->
Goal: 기계 검증을 통과한 시스템을 사람이 쓰고 볼 수 있는 품질로 — recipe 사이트 실노출·design-qa 루프, AskewlyDesign 설치·실사용, 유지보수 소진. (상세 plan → `docs/horizons/2026-07-quality-dogfooding.md`)

## Active Milestones

<!-- harness:milestone id="QA2" status="active" priority="P0" -->
### QA2 — AskewlyDesign Install & Dogfooding
- DoD: AskewlyDesign 이름으로 재패키징(make:win + verify-package PASS)되어 시스템에 실설치·시작 메뉴 실행 확인, dogfooding 시나리오(프로젝트 trust·열기, 모바일 뷰포트 recipe 삽입, 저장/undo, 재실행 연속성) 체크리스트 통과 + 발견 결함 목록 기록, 유지보수 후보 4건(에디터 다크모드·shortcuts focus trap·실체화 undo 파일 삭제 시맨틱·packaged E2E registry/협업 시나리오 통합) 각각 검증과 함께 처리.
- Evidence: `docs/plans/2026-07-12-qa2-install-dogfooding.md`, changesets, 설치·실행 스크린샷, dogfooding 결함 목록
- Gap: 데스크톱 앱은 packaged E2E 하네스로만 검증됐고 실설치·실사용 0회. 유지보수 후보 4건 적체. 리네임 후 재패키징 미실행.
- Status: [ ]

## Next Candidates (같은 horizon — 연쇄 승격 대상)

- **QA1 — Recipe Gallery & Visual QA**: 전용 갤러리 섹션으로 recipe 35종 실노출 + design-qa(WCAG·스크린샷·다크모드) 일괄 패스 + 결함 수정. recipe-format live render 유보 계약 갱신 포함.
- **QA3 — Canvas Recipe Materialization**: 팔레트 recipe 삽입의 실 소스 실체화 + 왕복 E2E.

## Horizon Queue (활성화 = 사용자 결정)

1. **Public Product & Monetization** — `docs/horizons/2026-07-public-product-monetization.md`: 공개 경험 완성 + 에셋 모델 정합 + 계정/결제/Pro. Milestone 후보: PX/AM/AC/PG/PP.

## 유지보수 후보 (milestone 아님)

- packaged E2E에 registry 조립·협업 패널 시나리오 통합 (H1 close 잔여, 비차단)
- 에디터 크롬 전면 다크 모드 (토큰 경로는 확보됨)
- shortcuts dialog 풀 focus trap
- 실체화 undo의 파일 삭제 시맨틱

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`; Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
