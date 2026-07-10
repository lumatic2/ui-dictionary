# Step 1: Hit Testing And Accessible Selection

## 읽어야 할 파일
- `docs/ARCHITECTURE.md` — 왜: stable document ID와 editor overlay 경계를 지킨다.
- `docs/adr/0006-agent-design-layered-dom-webgpu-engine.md` — 왜: DOM content와 WebGPU/DOM editor plane의 역할을 섞지 않는다.
- `packages/canvas-core/src/types.ts` — 왜: canonical bounds, hierarchy, selection 계약을 사용한다.
- `packages/canvas-core/src/operations.ts` — 왜: 모든 selection 변경을 operation/history로 commit한다.
- `apps/agent-design/src/CanvasSurface.tsx` — 왜: DOM target과 stable canvas ID를 연결한다.

## 작업
- core에 deterministic paint order, point hit-test, marquee hit-test, selection reduction 함수를 추가한다.
- click/Shift click, marquee, Escape clear, arrow-key traversal을 `select-nodes` operation으로 연결한다.
- canonical selection에서 DOM focus와 editor selection 표시를 파생한다.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build
```

## 검증 절차
1. overlap/z-order, multi-select, marquee, traversal unit test를 실행한다.
2. React smoke에서 click/Shift/Escape와 focus-visible state를 확인한다.
3. phase index를 completed로 전이하고 summary를 기록한다.

## 금지사항
- renderer DOM을 직접 canonical state처럼 변경하지 마라. document/history와 drift가 생긴다.
- WebGPU readback을 hit-test 정본으로 만들지 마라. fallback과 접근성 경로가 갈라진다.
