# Step 2: Typed Adapter And Exact Proposal Diff

## 읽어야 할 파일
- `phases/agent-design-canvas-agent/index.json` — 왜: Step 1 context summary와 생성 package를 이어받는다.
- `packages/canvas-core/src/operations.ts` — 왜: proposal의 canonical mutation 단위다.
- `packages/canvas-core/src/persistence.ts` — 왜: stable signature/checksum 선례를 재사용한다.

## 작업
- `CanvasAgentAdapter`, `AgentProposal`, `CanonicalChange`, `SourcePatch` 계약을 정의한다.
- deterministic fixture adapter와 proposal validator/diff formatter를 구현한다.
- base revision/document signature/source before hash/allowed source mapping을 검증한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-engine; npm test; npm run build
```

## 금지사항
- adapter가 document를 직접 mutate하지 마라. proposal만 반환한다.
- free-form patch를 검증 없이 canonical operation으로 변환하지 마라.
