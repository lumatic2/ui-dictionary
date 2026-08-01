# Evidence — M13 흡수 지식 사이트 반영 (레시피 소배치 + knowledge 노출)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m13-knowledge-site-surfacing.md` · Goal: `usage-and-site-surfacing` (2/2 — goal 마감)
- Changeset: `changesets/20260801-m13-knowledge-site-surfacing/README.md`

## DoD 대조

| DoD 항목 | 증거 |
|---|---|
| 신규 실동작 레시피 ≥1 (mobile-navigation) | `recipes/navigation/adaptive-navigation-container.md` + code_asset tsx — knowledge §1 결정표의 resolver 구현. validate-recipes "recipes ok: 48" |
| 전 체인 + build:catalog PASS | validate-recipes 48 · validate-ui-vocabulary 563 · generate-tokens/llms(173 assets) · build:data 48 · **build:catalog 48(승격 있어 실행 — 개정 §4 조건 발동)** · site build 759 routes · lint:colors 0 · audit:visuals 신규 fallback 0 · check-llms-sync 커밋 후 PASS |
| knowledge 4본 사이트 docs 탐색 가능 | docs 내비 신규 그룹 "Judgment guides" 4페이지(mobile-navigation·dashboard-density·checkout-flow·focus-keyboard) — 요약+정본(llms) 링크+Related terms, 규칙 전문 비복제. 프리렌더 755→759 |
| 실브라우저 확인 | `/docs/judgment-mobile-navigation`·`/docs/judgment-focus-keyboard` 실렌더 + `/recipes` 갤러리에서 Adaptive Navigation Container 카드→데모 진입, 4목적지·compact=bottom bar → 6목적지=rail 승격 전환과 규칙 라인 갱신 실조작 확인 |
| M12 회귀 게이트 | grep 오기 재유입 0 (goal 마감 시점 재실행) |

## 판정 기록

- 2건째 레시피(`sheet-detent-flow`) **미승격** — 계획의 판정 기준 적용: 기존 `bottom-sheet-detents`(단일 시트 detent)·`action-sheet-destructive-confirmation` 이 표면 계약을 커버하고, 잔여(모달 깊이=1·전환 임계)는 행동 규칙이라 knowledge §4 + docs 페이지 노출로 회수. 억지 승격 금지 원칙 준수.
- ledger: batch `20260801-mobile-nav-recipes` — knowledge→recipe 내부 승격(외부 수집 없는 RL 변형)의 첫 선례.
