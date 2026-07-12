# 20260712 캔버스 Materialize 액션

Target: QA3 Step 2 — registry-backed 노드의 사용자 실체화 액션 (브리지 연결 한정).

## Scope

- **렌더러**: PropertyInspector에 `data-testid="materialize-node"` 버튼 — 선택 노드가 `registry://` code-component + 브리지 연결일 때만 노출. `App.tsx`가 `planMaterializeRegistryNode`(existingFiles=사이드바 project files)로 계획을 만들고 host API로 제출, 기존 status 표면에 "materialized to <path>"/오류 표기.
- **데스크톱 IPC 채널 신설**(기존 applyCanvasOperation 패턴 미러): `contract.ts`에 `SourcePatchRequest` 검증(상대 .ts/.tsx/.js/.jsx 경로, `..`·절대경로 거부, 2MB 상한) → `ipc.ts` trusted-sender 라우트 → `preload.ts` contextBridge → `bridge-relay.ts` `materializeSource`(NEW_FILE_HASH sentinel로 `/source-patches` POST, actor human) → `main.ts` 배선.
- 웹(liveBridge) 경로는 의도적으로 미지원 — plan 결정(브리지 연결 한정).
- 테스트: 렌더러 4건(오프라인/소스백드 숨김·happy path·오류 표면), 데스크톱 contract 3건 + relay 1건.

## Verification

- [x] `apps/agent-design npm test` — 78/78 PASS (baseline 74+4; 오케스트레이터 게이트 재실행 포함)
- [x] `apps/agent-design-desktop npm test` — 56/56 PASS (52+4)
- [x] `apps/agent-design-bridge npm test` — 45/45 무회귀
- [x] 양쪽 `npm run build` — exit 0
- [x] 실패 모드: 브리지 오류 시 기존 오류 표면 노출 + 경로 검증 거부 테스트

## Result

Completed. 삽입된 recipe/registry 노드를 사람 손으로 실 소스 파일로 실체화하는 경로가 캔버스 UI에 열렸다.
