# Step 4: Canvas Live Sync And Source Watcher Reverse Sync

## 읽어야 할 파일
- `apps/agent-design/src/CanvasSurface.tsx` — 왜: canonical snapshot/revision에서 render를 파생한다.
- `apps/agent-design/src` connection/state files — 왜: existing selection/history state와 live bridge state를 안전하게 결합한다.
- `apps/agent-design-bridge` event protocol — 왜: cursor replay와 snapshot recovery 계약을 그대로 쓴다.
- `packages/cli/src/load.ts` — 왜: watched source를 canonical document로 다시 읽는 경로를 재사용한다.

## 작업
- Agent Design app에 WebSocket bridge client, connection status, current actor/revision, reconnect/snapshot recovery를 구현한다.
- committed transaction event만 canvas state에 반영하고 acknowledgement→visible timestamp를 측정한다.
- Node bridge에 trusted source mapping file watcher와 debounce/stable-read/reload transaction을 구현한다.
- bridge transaction ID/content hash로 self-write watcher echo loop를 제거하고 외부 direct edit는 watcher actor로 audit한다.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test; npm run build
cd ../agent-design-bridge; npm test; npm run build
npm run test:live-sync
```

## 검증 절차
1. bridge apply acknowledgement 후 canvas visible p95 ≤100ms를 3회 측정한다.
2. 직접 source edit 후 canvas visible p95 ≤300ms를 3회 측정한다.
3. disconnect 중 event를 만든 뒤 cursor replay 또는 snapshot recovery로 drift 없이 수렴시킨다.
4. bridge-origin source write가 watcher transaction을 중복 생성하지 않고 실제 external edit는 누락하지 않는지 확인한다.

## 금지사항
- uncommitted/staged intermediate state를 canvas에 publish하지 마라.
- browser가 local filesystem을 직접 watch하거나 쓰게 하지 마라.
- 단순 debounce만으로 echo와 실제 external edit를 구분하지 마라.
