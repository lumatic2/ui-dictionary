# ROADMAP

> Last updated: 2026-07-12
> Status: H2 Living Design System active (2026-07-12 사용자 승인 활성화)
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="living-design-system" -->
Goal: 일회성 레퍼런스 수집을 반복 가능한 흡수 루프(수집→중복 필터→적응→검증→흡수)로 운영화하고, 전 제품 표면으로 확장하며, 산출이 캔버스 레지스트리·CLI·llms.txt에 재작업 없이 공급되게 한다. (상세 plan → `docs/horizons/2026-07-living-design-system.md`)

## Active Milestones

<!-- harness:milestone id="RL" status="completed" priority="P0" evidence="docs/research/loop/ledger.md (3 batch rows) + changesets/README.md rows 64-68" -->
### RL — Reference Loop Pipeline
- DoD: 표준 루프 절차 문서 + pattern candidate inbox + batch ledger가 존재하고, 3개 실증 배치가 동일 절차로 완주(각 배치: dedup audit 실행 + validate-recipes/validate-ui-vocabulary/build/lint PASS + ledger entry), 신규 콘텐츠가 llms.txt·CLI 데이터 재생성에 반영된다.
- Evidence: docs/research/loop/ledger.md (3 batch rows) + changesets/README.md rows 64-68
- Gap: vocabulary 쪽엔 inbox/dedup/promote 반복 루프가 있으나 pattern/recipe 쪽 레퍼런스 흡수는 전부 일회성 수동 배치다. 절차·도구·장부가 없으면 MS/CS 표면 확장이 매번 재발명이 된다.
- Status: [x]

- Completed at: 2026-07-12
- Summary: 5-stage absorption loop standardized and proven over 3 surface batches (commerce/internal-tools/documentation): 6 recipes, 14 terms, 10 dedup judgments, all validator chains PASS
<!-- harness:milestone id="MS" status="active" priority="P0" -->
### MS — Mobile Surface Batch
- DoD: 사이트 디바이스 프레임 컴포넌트로 모바일 예시가 프로덕션 공개되고, 모바일 수집 2배치(내비게이션·구조 / 입력·피드백)가 RL 5단계 루프를 완주(ledger 2행, validator 체인 PASS)해 mobile-apps 표면에 recipe ≥4·용어 배치가 반영되며, Agent Design 캔버스 설정의 모바일 뷰포트 preset으로 신규 모바일 콘텐츠를 여는 E2E가 관측된다.
- Evidence: `docs/research/loop/ledger.md` (모바일 2행), `docs/plans/2026-07-12-ms-mobile-surface-batch.md`, changesets, `apps/agent-design` 테스트·E2E 기록
- Gap: mobile-apps 표면은 recipe 0종·기준 문서만 존재. 모바일 예시를 사이트에서 렌더할 표현 인프라(디바이스 프레임)와 제작환경(캔버스 모바일 뷰포트)이 둘 다 없다.
- Status: [ ]

## Next Candidates (같은 horizon — 연쇄 승격 대상)

- **CS — Commerce/Dashboard/Docs Surface Batch**: 잔여 표면 카테고리 실콘텐츠.
- **R2 — Recipe/Token Coverage 2세대**: 신규 표면을 덮는 레시피·토큰 확장 + anti-pattern 가이드 심화.
- **FW — Feed Wiring**: 루프 산출이 캔버스 레지스트리·CLI·llms.txt에 코드 변경 없이 공급되는 배선.

## Horizon Queue

1. **Public Product & Monetization** — `docs/horizons/2026-07-public-product-monetization.md`: 공개 경험 완성 + 에셋 모델 정합 + 계정/결제/Pro. Milestone 후보: PX/AM/AC/PG/PP.

## 유지보수 후보 (milestone 아님)

- packaged E2E에 registry 조립·협업 패널 시나리오 통합 (H1 close 잔여, 비차단)
- 에디터 크롬 전면 다크 모드 (토큰 경로는 확보됨)
- shortcuts dialog 풀 focus trap
- 실체화 undo의 파일 삭제 시맨틱

## Archive Pointer

Completed or archived milestone history lives in `BACKLOG.md`; Canvas Production Environment (UX3–AI) closed 2026-07-12, Canvas Product UX (UX1–UX2) superseded 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
