# 20260712 실체화 왕복 E2E + Windows 스테이징 경로 수정

Target: QA3 Step 3 — 삽입→실체화→cold re-derive 왕복 증명.

## Scope

- **packaged E2E 확장** (`scripts/run-packaged-e2e.mjs`): recipe 삽입 직후 Materialize 클릭 → `materialized to <path>` 상태 관측 → 프로젝트 디스크의 생성 파일에서 노드 identity marker·placeholder 부재·실 구현(BottomTabBar) 검증 → 재시작 후 동일 노드 id 단일 생존 assert. 실패 시 상태 표면 덤프 진단 포함. report JSON에 `materialization` 섹션.
- **실결함 수정 (E2E가 적발)**: relay transactionId `human:materialize:<ts>`의 콜론이 브리지 스테이징 파일명(`<file>.agent-design-<txId>.tmp`)에 들어가 **Windows에서 모든 실체화가 ENOENT로 실패**. ① `session.ts` 스테이징/백업 경로에 txId sanitize(`[^A-Za-z0-9._-]`→`-`) — 호출자 id 형식 무관 방어, ② relay id 하이픈화.
- **브리지 recipe 왕복 테스트** (`recipe-materialization.test.ts`): 콜론 포함 id로 recipe 실체화 → 파일 생성·marker 검증 → cold re-derive가 동일 id를 실 파일로 해석(단일 노드) — identity 계약 유닛 고정.

## Verification

- [x] `apps/agent-design-bridge npm test` — 46/46 PASS (신규 왕복 테스트 포함)
- [x] `apps/agent-design-desktop npm test` — 56/56 / 양쪽 build exit 0
- [x] `npm run make:win` → `node scripts/run-packaged-e2e.mjs` — **PASS**: "materialization roundtrip: node created-0002 written to src/components/BottomTabBarDemo.tsx with identity marker" + "materialized recipe node identity survived restart (single node, no duplicate)" + 기존 전 스테이지 무회귀 (restart drift 0px)
- [x] 실패 모드: 수정 전 콜론 id로 ENOENT 재현 관측 → 수정 후 동일 id 형식 테스트로 고정

## Result

Completed. 캔버스 recipe 삽입이 실 소스 파일로 실체화되고 identity 왕복이 packaged 표면에서 관측된다. Windows 경로 결함은 세션 레벨 방어로 봉합.
