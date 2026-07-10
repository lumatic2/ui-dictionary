# Step 5: Viewport And Keyboard Creation Workflow

## Work
- Add pan/zoom anchoring, fit/reset, creation shortcuts, layer traversal, and visible shortcut help.

## Acceptance Criteria
```powershell
cd apps/agent-design; npm test -- --run
```
- Pointer/keyboard behavior, editable exclusions, focus, zoom bounds/anchor, and shortcut discovery pass.

## Guardrails
- Never intercept text-editing/IME keystrokes.
- Every shortcut must have a visible command equivalent.

