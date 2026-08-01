# M13 · 흡수 지식 사이트 반영 (레시피 소배치 + knowledge 노출) — 완료 보고

Date: 2026-08-01 · Goal: `usage-and-site-surfacing` (연쇄 2/2 — goal 마감) · Plan: `plans/2026-08-01-m13-knowledge-site-surfacing.md`

## 1. 결과

다변화 라운드의 산출이 사람 표면에 존재하게 됐다. ① 신규 레시피 `adaptive-navigation-container` — knowledge/mobile-navigation §1 컨테이너 결정표를 실동작으로 구현(목적지 수×폭 → in-page-tabs/bottom bar/rail 분기, 발동 규칙 표시), 갤러리 등록 + build:catalog 48 ② 사이트 docs 에 신규 그룹 "Judgment guides" 4페이지(mobile-navigation·dashboard-density·checkout-flow·focus-keyboard) — 결정표 요약 + 정본(llms 원문) 링크, 규칙 전문 비복제 ③ 프리렌더 755→759 routes.

## 2. 이슈와 해결

- 2건째 레시피(sheet-detent-flow)는 계획에 박아둔 판정 기준대로 **미승격** — 기존 레시피가 표면 계약을 커버, 잔여는 행동 규칙이라 knowledge §4 + docs 노출 몫(억지 승격 금지 집행).
- ledger 에 knowledge→recipe 내부 승격(외부 수집 없는 RL 변형)의 표기 선례를 남김(batch `20260801-mobile-nav-recipes`).
- 프리렌더 셸의 generic title 은 기존 docs 페이지들과 동일한 클라이언트 렌더 구조 — 회귀 아님(관측 기록만).

## 3. 증거

- changeset: `changesets/20260801-m13-knowledge-site-surfacing` · Evidence: `evidence/usage-and-site-surfacing/m13-knowledge-site-surfacing.md`
- 검증: validate-recipes 48 · build:data 48 · build:catalog 48 · site build 759 · lint:colors 0 · audit:visuals 신규 fallback 0 · check-llms-sync PASS · M12 grep 회귀 0.
- 실표면: 실브라우저(vite preview :4331)로 `/docs/judgment-mobile-navigation`·`/docs/judgment-focus-keyboard` 실렌더 확인 + `/recipes` 갤러리에서 신규 카드→데모 진입, 4목적지·compact=bottom bar → 6목적지=rail 승격 전환·규칙 라인 갱신을 실조작으로 확인 — 통과.
- 재현: `python scripts/validate-recipes.py` · `/docs/judgment-mobile-navigation` 접속 · 갤러리 데모에서 목적지 수 토글.
- 크기 회고: step 2·changeset 1(절 2개) — 레시피 배치와 사이트 노출이 독립 응집 변경, 그릇 정합. goal 전체(M12+M13)가 사용자가 고른 갭 ②·③ 을 정확히 커버 — 과소/과대 없음.
