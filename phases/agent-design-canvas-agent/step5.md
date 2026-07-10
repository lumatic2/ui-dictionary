# Step 5: React Canvas Round-trip Proof

## 읽어야 할 파일
- `phases/agent-design-canvas-agent/index.json` — 왜: Step 1-4 summary와 contracts를 이어받는다.
- `apps/agent-design/scripts/run-integration.mjs` — 왜: system-Chrome evidence runner를 확장한다.
- `docs/adr/0005-agent-design-code-native-canvas.md` — 왜: structure/pixel/source round-trip 품질 기준이다.
- `apps/agent-design/results/integration-results.json` — 왜: AUC2 baseline과 regression budget이다.

## 작업
- explicit stable IDs가 있는 supported React JSX subset codec을 구현한다.
- fresh fixture에서 code→document→proposal→approve/apply→code/document/browser를 실행한다.
- structure signature, source diff, deterministic replay, screenshot drift와 unsupported/stale/verify failure를 증거로 저장한다.

## Acceptance Criteria
```powershell
cd packages/canvas-core; npm test; npm run build
cd ../agent-design-engine; npm test; npm run build
cd ../cli; npm test; npm run build
cd ../../apps/agent-design; npm test; npm run build; npm run integration; npm run validate:integration
```

## 금지사항
- unsupported JSX를 추정 변환하지 마라.
- deterministic fixture 결과를 live Codex/Claude quality evidence로 부르지 마라.
