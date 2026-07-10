# Step 3: Searchable Insert Palette

## Work
- Add primitive and supported-component insertion with search/categories and deterministic parent/placement behavior.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Search, empty state, parent/index/bounds, selection, Undo, and insertion feedback pass.

## Guardrails
- Do not browse or execute arbitrary npm packages.
- Use only canonical/project-supported component metadata.

