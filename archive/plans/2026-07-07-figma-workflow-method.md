# Plan - FW1 리서치 → 방법론 채택

Date: 2026-07-07
Milestone: FW1 (`ROADMAP.md`)
Horizon: `docs/horizons/2026-07-figma-workflow.md`
Objective: `docs/OBJECTIVE.md`

## 산문 요약

Claude Code × Figma를 함께 쓰는 트렌디한 워크플로우 지형을 리서치(다각 리포트 + 최근 30일 커뮤니티 펄스, sonnet 위임)로 수집하고, askewly 적합성 기준으로 후보 워크플로우를 비교·평가한 뒤, 파일럿 방향을 사용자 결정으로 확정하고 채택 방법론을 `methodology/figma-workflow.md` 계약 문서로 박는다.

## Step 트리

- [x] FW1-1 리서치 재료 수집 (artifact: analysis, sonnet 위임 2건 병렬) — (verify: `docs/market/2026-07-07-figma-claude-workflows.md` + `docs/market/2026-07-07-figma-claude-community-pulse.md` 존재, 인용에 출처 URL+접근일 포함 — 게이트 직접 읽기 검증 PASS 2026-07-07)
- [x] FW1-2 후보 워크플로우 비교·평가 + 파일럿 방향 결정 — 비교 표는 리서치 리포트 §3(6개 후보 × askewly 적합성), 종합·추천 제시 후 사용자 확정 (verify: 비교 표 존재 + 파일럿 방향 사용자 확정 기록 — 아래 결정 로그)
- [x] FW1-3 방법론 계약 문서 작성 — `methodology/figma-workflow.md` (역할 분담, 5단계 왕복 절차, 도구 좌표, 안티패턴, 리스크) (verify: 브리지 계약 §0/§1/§2.4/§3/§4 명시 정합 + `methodology/00-INDEX.md` 신설 등재 + Changelog — PASS 2026-07-07)

## 중단점

- FW1-3 완료(= milestone 완료) 또는 리서치 재료가 방향 결정에 불충분하다고 판정될 때(추가 수집 여부 사용자에게 질문).

## 결정 로그

- **파일럿 방향**: **확정 (2026-07-07 사용자 "진행") — 하이브리드 왕복**: 코드로 디자인 → Figma 투입(Code to Canvas) → 사용자 디테일링 → `get_design_context`로 코드 회수. 근거: 사용자 원 구상 + 6월 트렌드(round-trip 서사) + "코드가 SSOT" 브리지 계약 정합.
- **리서치 방식**: 확정 (2026-07-07) — deep-research식 + 커뮤니티 펄스 병행, sonnet 위임.
- 그 외 예상 결정: 없음 (FW2의 스킬 갱신 범위는 백로그 3건으로 이미 고정).
