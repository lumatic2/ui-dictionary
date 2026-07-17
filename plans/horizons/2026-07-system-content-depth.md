# Horizon - System Content Depth

Date: 2026-07-10
Status: closed 2026-07-10 — Principles 공개 + recipes 13종 / pattern_group 10/10 + CLI 신규 `add` 2종 + production discovery 검증으로 close criteria 충족.

## Goal

디자인 시스템의 "흐르는 콘텐츠"를 채운다: ① 시스템의 디자인 철학을 Principles 문서(사람용 Docs + 에이전트용 llms.txt 자산 이중 용도)로 증류하고, ② 레시피 커버리지를 5종 → pattern_group 10종 전체(신규 ~8종+)로 확장해 CLI `add`·llms.txt·사이트가 같은 콘텐츠를 소비하게 만든다.

## Why Now

Agent Design CLI close 시점 진단(사용자, 2026-07-10): "CLI의 정확한 기능도 아직 확정 아니고 **디자인 시스템으로서 완성된 게 없다**" — 파이프(CLI·llms.txt)는 생겼지만 콘텐츠가 얇다(레시피 5종, 철학 미문서화). 이 상태로 H2 앱에 가면 보여줄 게 적은 GUI가 된다. 콘텐츠가 차야 CLI·앱·Pro 에셋·Docs 설치법이 전부 산다. 시퀀스 조정: **System Content Depth(이번) → 앱(콘텐츠 위 GUI, 정체 결정 §B0 선행) → Docs(설치법·사용법, publish 재검토)** — ADR 0004의 CLI→앱→Docs에 한 단계 삽입 (사용자 확정 2026-07-10).

재료는 이미 레포에 있다(발명 불필요, 증류만): 사이트 실구현 예제 수백 개(Page Sections·Application UI·Page Examples), recipe-format 계약 + validate 스크립트, 흩어진 암묵 규칙(레시피 Anti-patterns·blueprint 완성 판정·Docs 아티클 판단 기준·CLAUDE.md Showcase 카피 원칙).

## Milestones

### SCD1 - Principles 증류 (사람용 + 에이전트용) — completed 2026-07-10

DoD: 레포에 흩어진 디자인 원칙을 Principles 문서로 증류 — ① 사람용: Docs 최상위 아티클(한국어 서술·영어 헤딩, dev 게이트 → 완성 판정 → 공개) ② 에이전트용: `docs/design-system/principles.md`(또는 동급) 자산이 llms.txt 인덱스에 포함 ③ 원칙 각 항목에 근거 소스 표기(발명 금지) ④ **원칙 내용 최종 승인 = 사용자** ⑤ build/lint/smoke + 배포 확인.

Evidence: `docs/plans/2026-07-10-scd1-principles.md` + changesets #48-51 + Cloudflare deployment `e9cba517` (source `74ade1a`).

Size retrospective: 4 independent changesets (canonical principles, llms discovery, gated human article, approval/gate release) plus integrated production verification. The helper's single-evidence-path inflation warning was a false positive; SCD1 is milestone-grade under the observable rubric.

### SCD2 - 레시피 커버리지 배치 (pattern_group 10종) — completed 2026-07-10

DoD: 미커버 pattern_group 6종(marketing·forms·navigation·overlays·application-ui 커버됨 → docs/data-display/feedback/layout/commerce 등)에 각 ≥1 레시피, 총 5→13종+ — 각 레시피는 recipe-format 계약 준수(validate-recipes PASS), 실구현 code_asset 참조, Principles 정합. 통합 검증: llms.txt 재생성(신규 레시피 포함) + CLI 데이터 재번들 + `askewly-design add <신규 레시피>` 주입 smoke ≥2종 + 배포 확인.

Evidence: `docs/plans/2026-07-10-scd2-recipe-coverage.md` + changesets #52-56 + Cloudflare deployment `15a65241` (source `71d88f2`).

## Close Criteria

pattern_group 10종 각각 ≥1 레시피 + Principles가 사이트(Docs)와 llms.txt 양쪽에 공개 + CLI `add`로 신규 레시피 주입이 실제로 도는 상태.

## Objective 임팩트

Objective의 시스템 모델·에이전트 통합 축을 실질적으로 움직였다: 암묵 철학을 근거 기반 Principles 8개로 공개하고, 레시피를 5→13종·pattern_group 10/10으로 채워 llms.txt와 로컬 CLI가 같은 콘텐츠를 발견·주입하게 만들었다. 성공 모습 중 "같은 시스템을 사람이 탐색하고 에이전트가 재사용"하는 연결이 실제 production/fresh-target 증거로 강화됐다. ROADMAP 자기평가의 재측정은 다음 앱 horizon 기획 시 수행한다.

## 크기 회고

- SCD1: 4 changesets (#48-51) + 사용자 승인 + 통합 production 검증 — milestone-grade.
- SCD2: 5 changesets (#52-56) + group 교차 통합 검증 — milestone-grade.
- `roadmap_sync.py complete`가 각각 최종 Evidence changeset 한 경로만 세어 1-changeset 인플레로 표시한 것은 오탐이다. 실제 changeset 수 기준으로 두 milestone 모두 정상 규모다.

## Backlinks

- Objective: `docs/OBJECTIVE.md` (장기 아크 3 "시스템 모델" 심화 + 5 "에이전트 통합")
- 직전 horizon: `docs/horizons/2026-07-agent-design-cli.md` (closed 2026-07-10, 부분 close — publish 보류)
- 시퀀스 결정: `docs/adr/0004-agent-design-cli.md` (+ 이번 삽입 조정은 이 문서 Why Now)
- Gap report: `docs/roadmap-gap-2026-07-10-d.md`
- 레시피 계약: `docs/design-system/recipe-format.md`
