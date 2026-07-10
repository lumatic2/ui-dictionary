# AUC4 Step 2 — Supervised Bridge And Terminal Bootstrap

## Outcome

- Added an Electron `utilityProcess` child entry that starts the existing bridge authority and exchanges ready/health/stop messages over a transferred `MessageChannelMain` port.
- Added a supervisor with ready timeout, bounded restart backoff, three-failures-per-60-seconds circuit breaker, graceful stop, forced cleanup fallback, and redacted renderer status.
- Kept the ephemeral token inside the utility child/Electron main boundary. The renderer can request clipboard copy for Codex or Claude but never receives the token, loopback URL, adapter path, or command string.
- Added Codex one-shot config overrides and Claude `--strict-mcp-config --mcp-config` inline launch commands without spawning agents or writing global/project MCP configuration.

## Evidence

- `cd apps/agent-design-desktop && npm run test:supervisor` — 4 lifecycle cases plus real Electron utility process ready/health/stop smoke passed.
- The lifecycle suite covers fatal child signal, ready timeout, restart, three-strike circuit open, graceful stop, and redacted status.
- `cd apps/agent-design-desktop && npm run test:terminal-bootstrap` — Codex and Claude command contracts passed and contain no config-file mutation commands.
- Installed `codex --help` exposes one-shot `-c/--config`; installed `claude --help` exposes `--mcp-config` and `--strict-mcp-config`.
- `cd apps/agent-design && npm test` — 17/17 including renderer redaction and main-owned copy actions.
- `cd apps/agent-design-desktop && npm run verify:security && npm audit --audit-level=high` — live sandbox gate passed; 0 vulnerabilities.
- Code commit: `25bbebe`.

## Next

Step 3 adds native trusted-folder import, canonical containment, durable snapshots/audit, and recovery, then uses that trusted project to start the supervisor.
