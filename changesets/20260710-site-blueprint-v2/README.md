# 20260710 Site Blueprint v2

## Target

- ROADMAP milestone: SFB1 - Structure Contract And Clean Production (Step 1)
- Plan: `docs/plans/2026-07-10-sfb1-structure-contract.md`

## Scope

- `docs/design-system/site-blueprint.md` 를 v2 로 갱신: 상위 축 Docs/Patterns/Colors/Pro 확정 (Colors 축 신설 — Coolors 레퍼런스), Templates→Pro 하위, Download→앱 배포 표면으로 재정의(게이트 뒤).
- Production Exposure Policy 신설: "나열된 것 = 완성된 것", 대상별 게이트 규칙, 데이터 보존·실개수 노출 운영 규칙.
- Section Completion Criteria 신설: source-quality 공통 하한선 + 섹션별 판정 기준.
- Implementation Order 를 Structure-First Buildout horizon (SFB1→SFB2→SFB3)에 정렬.

## Contract

- Source of truth: `docs/design-system/site-blueprint.md` (사이트 IA·노출 정책·완성 기준 정본).
- 코드 변경 없음 — 노출 게이트 구현은 SFB1 Step 2 별도 changeset.
- Out of scope: 라우팅 방식 전환(PageMode→Router), 앱 개발, 결제.

## Verification

- [x] 상위 축·Templates·Download 결정이 사용자 확정과 일치 (2026-07-10 AskUserQuestion 기록).
- [x] 노출 규칙·완성 판정 기준이 문서에 명문화됨.
- [x] 시장 근거 백링크 존재 (`docs/market/2026-07-10-site-integrity-benchmarks.md`).
- [x] horizon/plan doc 백링크 정합 (`docs/horizons/2026-07-structure-first-buildout.md`).
