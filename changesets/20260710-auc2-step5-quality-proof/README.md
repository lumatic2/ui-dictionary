# AUC2 Step 5 — Integrated Quality Proof

## Automated Outcome

- System Chrome used the WebGPU editor plane and rendered 5,000 canonical DOM nodes with 250 source mappings.
- Actual PointerEvent-to-paint p95 across three 60-frame runs was `6.9ms`, `13.5ms`, and `10.7ms`; every gesture changed revision exactly once.
- Keyboard Escape/Arrow traversal produced zero selection, then focused `node-00000` and `node-00001` in canonical order.
- Forced DOM fallback preserved selection and the full property/reparent/text/save workflow.
- Native drag reparented `node-00001` into `node-00100`; typed prop, fill sizing, and dark token mode persisted.
- System Chrome entered `한글 실제 Chrome 입력`; reload restored revision 7, undo/redo produced 6→7, screenshot mismatch was 0, and console errors were empty.

## Evidence

- `packages/canvas-core`: 35/35 tests + TypeScript build PASS.
- `apps/agent-design`: 13/13 tests + Vite build PASS.
- `npm run integration && npm run validate:integration`: PASS.
- DESIGN lint: parse/schema/alias/contrast PASS.
- Report: `apps/agent-design/results/integration-results.json`.
- Screenshots: `apps/agent-design/results/screenshots/`.
- Code/evidence commit: `9d29d9e`.

## Honest Residual Gate

The automated report deliberately records `osMicrosoftImeManualPass: false`. Browser-entered Korean text and synthetic composition events are not evidence of a genuine Windows Microsoft IME composition session.

Manual closure path:

1. Run `cd apps/agent-design; npm run dev` and open the printed local URL in Chrome.
2. Select `node-00007`, enable Windows Microsoft IME, type one composed syllable such as `한`, then move focus out of the text node.
3. Confirm the completed syllable remains, Undo restores the pre-composition text in one action, Redo restores it, and focus never leaves during composition.
4. Record the result in this changeset, set Step 5 completed, then run the AUC2 ledger/work/ROADMAP close sequence.

## Chrome Extension Note

The preferred Chrome extension backend could not initialize because the installed plugin bundle lacked both `docs/browser-safety.md` and `docs/chrome-troubleshooting.md`. The allowed fallback was Playwright against the installed system Chrome binary; this is recorded separately from the pending OS IME pass.

## Microsoft IME Manual Attempt — 2026-07-10

The user authorized the live Windows IME pass. A local Vite server was started at `http://127.0.0.1:4182`, then the supported Computer Use runtime was selected so the test would use actual Windows input rather than synthetic browser events.

The Windows helper failed before any Chrome interaction:

- initial and retry `list_apps()` calls timed out without returning an app list;
- after the required runtime reset, bootstrap failed with `Computer Use native pipe is unavailable: failed to connect native pipe ... os error 2`;
- the temporary Vite process was terminated and no port-4182 Vite process remained.

No PowerShell SendKeys or other foreground-input bypass was used, because that would evade the Computer Use safety/interrupt contract. Therefore `osMicrosoftImeManualPass` remains `false` and AUC2 remains open.
