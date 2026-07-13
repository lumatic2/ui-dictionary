# Step 2: Mac Green Test Matrix

## Work

- Reproduce and fix the renderer localStorage environment failure, bridge/collaboration timeouts, and materialization rejection assertion with surgical changes.
- Add a root gate that runs core, renderer, bridge, and desktop suites in a stable order.

## Acceptance Criteria

- The complete Mac matrix passes from one command.
- Renderer and timeout-sensitive suites pass three consecutive runs.
- Existing core 1k/5k, operation, history, persistence, manipulation, structure, and property coverage remains green.

## Guardrails

- Secure a failing reproduction before each fix.
- Do not weaken assertions, increase timeouts without cause, or hide warnings to obtain green output.
- Keep test-environment fixes separate from product behavior changes.
