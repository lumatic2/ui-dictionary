# Step 3: Reparent Reorder And Responsive Constraints

## 읽어야 할 파일
- `phases/agent-design-direct-manipulation/index.json` — 왜: selection/manipulation summary를 이어받는다.
- `packages/canvas-core/src/validation.ts` — 왜: hierarchy와 instance invariant를 최종 방어한다.
- `packages/canvas-core/src/types.ts` — 왜: fixed/hug/fill과 layout mode를 보존한다.

## 작업
- valid drop ancestry, insertion index, cycle/locked/instance rejection을 core helper로 정의한다.
- reparent/reorder 후 responsive sizing constraints를 deterministic하게 유지한다.
- UI drop feedback와 canonical operation commit을 연결한다.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build
```

## 금지사항
- UI preflight만 믿지 마라. core validator가 동일 invariant를 방어해야 한다.
- component instance 내부 구조를 임의 reparent하지 마라. source/component contract가 깨진다.
