# Step 1: Selection-bound Agent Context

## 읽어야 할 파일
- `docs/ARCHITECTURE.md` — 왜: canonical document, source mapping, local engine 경계를 지킨다.
- `docs/plans/2026-07-10-auc3-canvas-agent-code-roundtrip.md` — 왜: AUC3 transport/apply 결정과 stop rule 정본이다.
- `packages/canvas-core/src/types.ts` — 왜: selection, hierarchy, source, property canonical types를 사용한다.
- `packages/cli/src/load.ts` — 왜: design knowledge 데이터 shape를 복사하지 않고 provider contract로 연결한다.

## 작업
- `packages/agent-design-engine` package를 생성한다.
- `buildAgentContext(document, knowledge, options)`가 selected IDs, primary node, ancestry, bounded descendants, source mappings, props/layout/tokens, revision/signature, knowledge refs를 deterministic하게 만든다.
- missing/stale/oversized context는 typed error로 거부한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-engine; npm test; npm run build
cd ../canvas-core; npm test; npm run build
```

## 금지사항
- 전체 5k document를 무조건 prompt context로 직렬화하지 마라. bounded selection context여야 한다.
- source 파일 내용을 읽지 마라. AUC3 engine은 pure이며 host authority가 없다.
