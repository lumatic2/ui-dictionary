# 20260712 recipe 실체화 소스 임베드

Target: QA3 Step 1 — recipe 노드 실체화가 제네릭 스켈레톤 대신 실 standalone 소스를 생성.

## Scope

- `scripts/build-recipe-catalog.mjs`: brace/string-aware 소스 스캐너 추가 — 각 recipe code_asset의 마지막 top-level export 함수의 단일 JSX return 루트에 `__AD_NODE_*__` identity marker placeholder를 주입해 `src/recipe-sources.generated.ts`(35 entries) 생성. 루트 특정 불가 시 loud fail(exit 1). 결정성: 2회 실행 byte-identical.
- `src/materialize.ts`: `registry://recipe/<slug>` 노드 분기 — 임베드 소스 사용, placeholder를 노드 id/name/label로 치환, 실 export명 기준 파일명 해석(예: showcase-card→AtlasCard), 충돌 시 export 식별자까지 결정적 rename. 비-recipe 경로·identity 계약·`operations: []` 불변.
- 테스트 5건 추가(실 소스 방출·placeholder 잔존 0·결정성·충돌 rename·source-backed 거부) + stale assertion 수정(recipe-catalog 23→35 — FW Step 2 작성 후 배치 12종 추가에 미갱신).

## Verification

- [x] `npm run build:catalog` — 35 entries, 2회 실행 diff 0 (결정성)
- [x] `npm test` — 29/29 PASS (오케스트레이터 게이트 재실행 포함; stale 23-entry assertion 수정 후)
- [x] `npm run build` (tsc) — exit 0
- [x] `apps/agent-design-bridge npm test` — 45/45 무회귀

## Result

Completed. recipe 실체화가 marker 주입된 실 구현 소스를 방출하며, 의존성 주석 헤더가 포함된다.
