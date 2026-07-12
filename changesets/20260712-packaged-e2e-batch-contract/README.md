# 20260712 desktop batch 계약 + packaged E2E registry/협업 시나리오

Target: QA2 Step 6 — 유지보수 (H1 close 잔여) + dogfooding 결함 #1 해소.

## Scope

- **계약 확장 (결함 #1 근본 수정)**: `apps/agent-design-desktop/src/contract.ts` `parseCanvasMutationRequest`가 UX2 `batch` operation을 수용 — 자식 operation 각각을 동일 화이트리스트로 재귀 검증, 중첩 batch 거부, 빈/500개 초과 batch 거부, 1MB 총량 제한 유지, `run-command` 등 미지 타입 거부 불변. 설치본에서 팔레트 삽입(primitive/registry/recipe)이 전부 "unsupported canvas operation"으로 거부되던 결함의 수정.
- **packaged E2E 시나리오 통합**: `scripts/run-packaged-e2e.mjs`에 (a) registry 조립 — insert palette로 primitive frame + recipe(bottom-tab-bar) 삽입 후 node count·revision 증가 assert, (b) 협업 패널 — agents 패널에 같은 run의 Codex/Claude MCP transaction feed 항목 존재 assert. 기존 trusted-project 단일 launch phase 재사용.
- 테스트: contract 4건(batch 수용/금지 자식/중첩/초과), bridge-relay 1건(planInsert 산출 batch 릴레이 + run-command 자식 거부) 추가.

## Verification

- [x] `cd apps/agent-design-desktop && npm test` — 11 files, 52/52 PASS (baseline 47 + 5; 오케스트레이터 게이트 재실행 포함)
- [x] `npm run build` — exit 0
- [x] `npm run make:win` 재패키징 → `node scripts/run-packaged-e2e.mjs` **PASS**: "collaboration panel shows 2 feed entries including both packaged MCP transactions" / "registry assembly: primitive insertion via batch operation reached revision 5 (3 nodes)" / "recipe insertion (bottom-tab-bar) via batch operation reached revision 6 (4 nodes)" / watcher 122.3ms / restart drift 0px / 5k p95 19.00ms(부하 병행 중 측정)
- [x] installer lifecycle 재관측 (새 빌드) PASS + dogfooding 설치본 갱신 재설치 (`%LOCALAPPDATA%\askewly_design` — batch 수정 포함 빌드)

## Result

Completed. dogfooding 결함 #1(팔레트 삽입 전면 거부)이 계약 확장으로 근본 수정됐고, 같은 삽입 경로가 packaged E2E의 registry 조립 시나리오로 상시 회귀 방어된다. 협업 패널 시나리오도 통합돼 H1 close 잔여 항목이 소진됐다.
