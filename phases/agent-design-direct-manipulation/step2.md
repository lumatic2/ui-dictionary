# Step 2: Move And Resize Transaction

## 읽어야 할 파일
- `phases/agent-design-direct-manipulation/index.json` — 왜: Step 1 selection 계약과 summary를 이어받는다.
- `packages/canvas-core/src/operations.ts` — 왜: gesture당 하나의 invertible operation을 정의한다.
- `apps/agent-design/src/EditorPlane.tsx` — 왜: preview bounds와 guides를 renderer 독립 overlay로 표시한다.

## 작업
- zoom-adjusted move와 8-handle resize transaction을 core에 정의한다.
- pointer capture 동안 preview만 갱신하고 pointerup에서 final bounds를 operation 한 건으로 commit한다.
- cancel, minimum size, derived alignment guides를 구현한다.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build
```

## 금지사항
- pointermove마다 history operation을 쌓지 마라. gesture는 정확히 한 operation이어야 한다.
- selection overlay를 project DOM 안에 삽입하지 마라. project code와 editor state가 섞인다.
