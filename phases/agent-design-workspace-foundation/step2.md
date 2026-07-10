# Step 2: Project Entry And Recent-Project Flow

## Read
- `apps/agent-design/src/desktopHost.ts`, `desktopHost.test.tsx`.
- `apps/agent-design-desktop/src/project-controller.ts`, `project-registry.ts`.

## Work
- Add first-run, recent-project, opening, canceled, and failure states around existing trusted-project APIs.
- Transition cleanly from entry to active workspace.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Tests cover empty, cancel, open, recent, and host failure paths.

## Guardrails
- Renderer receives only existing opaque project summaries and IDs.
- No raw filesystem paths or new trust bypass.

## Evidence — 2026-07-11
- First-run, loading, recent, opening, canceled, unavailable, and retry surfaces use existing opaque trusted-project APIs.
- Renderer tests 19/19 and desktop host project-open smoke pass. Implementation: `40f3f0d`.
