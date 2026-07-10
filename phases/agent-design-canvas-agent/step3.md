# Step 3: Atomic Auto-Apply, Exact Audit, And Undo

## 읽어야 할 파일
- `packages/agent-design-engine` transaction contract — 왜: source/document/history를 한 commit boundary로 묶는다.
- `packages/canvas-core/src/operations.ts` — 왜: typed canonical operation과 inverse를 재사용한다.
- `packages/canvas-core/src/history.ts` — 왜: agent transaction도 기존 Undo/Redo invariant를 지킨다.
- `packages/cli/src/inject.ts` — 왜: existing source injection과 rollback 경계를 확인한다.
- `packages/cli/src/verify.ts` — 왜: publish 전 verification gate를 공통 사용한다.

## 작업
- trusted MCP write를 별도 canvas Approve 없이 validate→stage→persist→publish 순서로 auto-apply한다.
- operation batch 또는 source patch마다 exact before/after diff, actor, prompt/tool metadata, transaction ID, hashes, verification result를 audit entry로 남긴다.
- document/source/history/audit 중 하나라도 실패하면 전체 transaction을 rollback한다.
- Undo가 정확한 inverse transaction을 새 revision으로 적용하며 source와 canvas document를 함께 복원하게 한다.

## Acceptance Criteria
```powershell
cd packages/agent-design-engine; npm test
cd ../../apps/agent-design-bridge; npm test
npm run test:agent-transaction
```

## 검증 절차
1. valid operation과 source patch가 각각 one transaction→one history entry로 즉시 적용된다.
2. stale revision, before-hash mismatch, invalid prop/path, verify failure가 아무 partial write도 남기지 않는다.
3. audit exact diff를 재계산한 값과 비교하고 Undo 후 original document/source hash를 확인한다.
4. 동시 Codex/Claude write에서 한 transaction만 성공하고 다른 쪽은 structured conflict를 받는다.

## 금지사항
- trusted terminal mutation 앞에 per-change Approve dialog를 넣지 마라.
- validation/verification 전에 source나 canvas event를 publish하지 마라.
- conflict를 silent overwrite 또는 last-write-wins로 처리하지 마라.
