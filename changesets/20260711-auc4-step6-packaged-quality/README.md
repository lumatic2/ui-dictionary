# AUC4 Step 6 — Packaged E2E And Representative Quality Proof (Partial)

## Outcome

- Connected the packaged canvas to the supervised bridge through an Electron-main relay. The renderer receives typed snapshots/operations but never the loopback URL or session token; its packaged CSP now denies all network connections.
- Imported a representative trusted React `src/App.tsx` mapping, ran the packaged MCP adapter as both Codex and Claude, applied a human property edit, and observed the source watcher update the same canvas.
- Fixed ESM bundle compatibility for the packaged bridge/MCP, disabled the unavailable browser-specific V8 snapshot fuse that prevented startup, and added a real packaged utility-process smoke.
- Added Squirrel first-run/install/update/uninstall/obsolete handling, Start Menu and desktop shortcut lifecycle, installed-app launch verification, uninstaller payload removal, and explicit cleanup of Squirrel's allowlisted tombstone files.
- Fixed selected text editing so the manipulation overlay no longer blocks the real `contentEditable` surface; real Windows UI Roman text entry now works.

## Passing evidence

- `npm run test:packaged-child` — packaged ESM bridge utility reached `ready` with fresh recovery state.
- `node scripts/run-packaged-e2e.mjs` — Codex revision 1, Claude revision 2, human edit, watcher edit at 130.2ms, bridge crash/recovery at revision 5, restart canvas pixel drift 0, 5k packaged p95 worst 11.5ms, DOM fallback, keyboard order, and process cleanup passed.
- `node scripts/run-installer-lifecycle.mjs` — current-user install, packaged launch, renderer authority check, Start Menu/Desktop shortcut creation, uninstall, shortcut removal, application payload removal, and allowlisted tombstone cleanup passed.
- `npm test` — 42/42 desktop tests passed; `npm --prefix ../agent-design test` — 17/17 renderer tests passed.
- `npm run verify:package` — 5 artifacts, 5 resources, and all 9 explicit fuse states passed; `npm audit --omit=optional` — 0 vulnerabilities.
- Code commits: `fdfe727`, `ca0cbfc`.

## Open gate

- `npm run verify:packaged-evidence` intentionally fails with `COMPUTER_USE_HANGUL_KEY_UNSUPPORTED`.
- Computer Use drove the real packaged window and confirmed the fixed text surface accepts Roman input, but its `Hangul` keysym is unsupported and alternative layout/mode shortcuts did not activate Microsoft Korean IME composition. No synthetic event or literal Korean injection is being counted as an actual IME pass.
- Required proof is recorded in `results/packaged/ime-manual.json`. AUC4 and Step 6 remain in progress until that exact manual proof is observed or the user explicitly waives the gate.
