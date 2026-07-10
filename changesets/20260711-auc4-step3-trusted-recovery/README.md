# AUC4 Step 3 — Trusted Project And Durable Recovery

## Outcome

- Added a native directory-picker flow whose absolute path remains in Electron main; renderer responses contain only an opaque project ID, display name, and timestamp.
- Added a canonical trusted-root registry with device/inode identity, recent projects, per-access realpath containment, junction escape rejection, and root replacement detection.
- Added project-hash `userData` recovery generations containing checksum-bound snapshot and audit JSONL files. Files are fsynced before an atomic `CURRENT` pointer swap.
- Added corrupt-generation quarantine, previous-generation read-only fallback, initial/recovered cursor and audit restoration, and mutation rollback when persistence fails.
- Connected trust/recent-project open to the supervised bridge and automatic most-recent startup recovery.

## Evidence

- `cd apps/agent-design-desktop && npm run test:project-trust` — 5/5: redaction, containment, junction escape, root replacement, corrupt registry, controller start contract.
- `cd apps/agent-design-desktop && npm run test:recovery` — 5/5: snapshot/audit parity, corrupt-current fallback, and fault injection after fsync, generation rename, and before pointer swap.
- `cd apps/agent-design-bridge && npm test` — 21/21 including persistence failure rollback and read-only mutation rejection.
- `cd apps/agent-design-desktop && npm run test:supervisor` — live Electron bridge committed revision 1, stopped, restarted from the same recovery root, and returned `recovered` at cursor/revision 1.
- `cd apps/agent-design-desktop && npm test && npm run verify:security && npm audit --audit-level=high` — 29/29, live renderer security PASS, 0 vulnerabilities.
- `cd apps/agent-design && npm test` — 17/17 including native-project surface redaction.
- Code commit: `44fbdf4`.

## Next

Step 4 adds a separate sandboxed project preview, guarded OS actions, and a redacted diagnostic bundle.
