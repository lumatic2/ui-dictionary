# M7 · 플랫폼 가이드라인 흡수 (HIG·Material → 모바일 내비게이션·시트) — 완료 보고

Date: 2026-08-01 · Goal: `reference-diversification` (연쇄 1/2) · Plan: `archive/plans/2026-08-01-m7-platform-guideline-absorption.md`

## 1. 결과

비-Tailwind 소스(Apple HIG·Material 3)가 RL 흡수 루프 전 단계를 처음 완주했다. 산출물: ① `knowledge/mobile-navigation.md` 신설(컨테이너 선택 결정표·행동 계약·모달 표면 선택·깊이 규칙) + llms FIXED_ASSETS 노출 ② terms.yml 보강 7건(tab-bar·bottom-navigation·navigation-drawer+related·modal-bottom-sheet·full-screen-dialog·sheet-drag-handle·dialog) ③ 배관 보수 — ledger `source` 열 신설(소스 편중 측정 축), absorption-criteria §원칙류 소스 착지 규칙, reference-loop 검증 체인 개정(check-llms-sync 편입·build:catalog 조건화). 신규 규범 사실 1건 확보: **M3 Expressive 가 navigation drawer 를 비권장으로 전환(expanded rail 대체)** — baseline 리서치(7/4) 이후 변화.

## 2. 이슈와 해결

- WebFetch 는 HIG·M3 양쪽 다 JS 셸 반환 → 실브라우저(Claude in Chrome) 캡처로 전환(계획의 폴백 경로 그대로).
- step-1 게이트 실증 중 **기존 llms 드리프트 2건 부수 적발**(slide-production·slide-principles — 이전 세션 병합 잔재) → 재생성에 접어 해소.
- 드리프트 1건(의도적): ledger 소급값을 계획의 "tailwind" 대신 **"tailwind 주도(소급)"** 로 기입 — 과거 배치가 Tier 2 를 섞어 썼다는 reference-loop 기록이 있어 단정 기입은 거짓이 됨(정직성 우선).
- 예상 적중: 신규 term 0 — 후보 14건 전건이 기존 항목 보강/knowledge 규칙으로 착지(기존 모바일 계열 ~30개). 원칙류 배치는 proposed_artifact 어휘에 enrichment 가 없어 어색 — ledger amendments 에 차기 검토로 기록.
- kg 승격 후보 2건(goal 마감 시 인입 예정): ① 플랫폼 가이드라인은 캡처 시점 갱신 확인 필수(M3 Expressive drawer 비권장 실측, 출처 https://m3.material.io/components/navigation-drawer/guidelines 접근 2026-08-01) ② HIG·M3 공식 문서는 WebFetch 불가·실브라우저 필수(실측 커밋 04cfcfa).

## 3. 증거

- Evidence: `evidence/reference-diversification/m7-platform-guideline-absorption.md` · Changeset: `changesets/20260801-m7-platform-guideline-absorption/README.md` · 근거 동결: `research/2026-08-01-m7-mobile-nav-sheets-capture.md`
- 검증 체인: validate-recipes(47)·validate-ui-vocabulary(563)·재생성·check-llms-sync PASS(FAIL 경로 실증 포함)·사이트 build 755 routes·oxlint 기존 경고만·lint:colors 0·build:data terms=563·audit:visuals 신규 fallback 0. build:catalog 생략(recipe 0 — 개정 규약 근거).
- 실표면: 실브라우저(vite preview :4321)에서 `/terms/navigation-drawer` 열어 보강 description·anti_use·related(navigation-rail) 렌더를 눈으로 확인 — 통과. llms.txt 에 knowledge/mobile-navigation 링크 노출 확인(자산 168→169).
- 재현: `node scripts/check-llms-sync.mjs` (PASS) · `cd examples/ui-vocabulary-site && npm run build && npm run audit:visuals` · 커밋 e70b66a→ffe8b3b (4건).
- 크기 회고: milestone = changeset 1개로 닫힘 — 그러나 독립 step 3개(배관/수집/승격) + 통합 검증 체인이라 milestone-grade 판정 유지, 라벨 정합 문제 없음. 연쇄(M7→M8)가 목표 전체를 담는 그릇으로 설계됨 — 과소 그릇 아님.
