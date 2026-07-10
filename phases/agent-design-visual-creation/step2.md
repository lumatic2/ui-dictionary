# Step 2: Hierarchical Layers Panel

## Work
- Render the canonical hierarchy as an accessible tree with synchronized selection, rename, visibility/lock, reorder, and reparent.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Tree semantics, focus, keyboard traversal, canvas sync, rename, valid/invalid drops, and operation dispatch pass.

## Guardrails
- The tree is a projection, not a second hierarchy store.
- Invalid structure edits fail visibly without partial mutation.

