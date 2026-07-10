# Step 3: Guarded Apply And Agent Dock

## 읽어야 할 파일
- `phases/agent-design-canvas-agent/index.json` — 왜: context/proposal summary를 이어받는다.
- `apps/agent-design/src/App.tsx` — 왜: canonical history와 persistence 흐름에 proposal session을 연결한다.
- `apps/agent-design/src/PropertyInspector.tsx` — 왜: 기존 right-side inspection 관례와 디자인을 재사용한다.
- `DESIGN.md` — 왜: dock/diff/review UI의 토큰·anti-pattern 정본이다.

## 작업
- proposal state machine과 atomic apply/rollback을 engine에 구현한다.
- Agent dock에 visible context, deterministic request, exact diff, approve/reject/apply, verify state를 구현한다.
- apply는 canonical history operation 한 건으로 undo 가능해야 한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-engine; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build
```

## 금지사항
- approve 없이 apply하지 마라.
- UI disabled state만 보안 경계로 쓰지 마라. engine state machine이 최종 방어한다.
