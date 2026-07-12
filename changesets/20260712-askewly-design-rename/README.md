# 20260712 AskewlyDesign Rename

Target: maintenance — 구 Agent Design 제품명 개명.

## Scope

- Rename the desktop canvas app's PRODUCT NAME from "Agent Design" to "AskewlyDesign" per user decision 2026-07-12.
- Display/product-level rename only — directories, package names (`@askewly/agent-design-*`), icon file paths, and npm workspace identifiers are unchanged.
- Fixed mapping applied: "Agent Design" (product references) → "AskewlyDesign"; `AgentDesign`/`AgentDesign.exe` → `AskewlyDesign`/`AskewlyDesign.exe`; squirrel `agent_design` → `askewly_design`; setupExe `AgentDesign-UnsignedDevelopment-Setup.exe` → `AskewlyDesign-UnsignedDevelopment-Setup.exe`; electron-forge out dir `out/Agent Design-win32-x64` → `out/AskewlyDesign-win32-x64`.

## Files changed

**apps/agent-design-desktop**
- `package.json` — `productName`
- `forge.config.cjs` — packagerConfig `name`/`executableName`, `win32metadata` (FileDescription, OriginalFilename, ProductName, InternalName), squirrel maker `name`/`setupExe`, postPackage fuses executable path
- `src/main.ts` — startup failure error string
- `src/electron-bridge-process.ts` — utilityProcess `serviceName`
- `scripts/run-packaged-e2e.mjs` — packaged out path, preview fixture string
- `scripts/run-installer-lifecycle.mjs` — installer path, `installRoot` (`askewly_design`), installed executable path, shortcut-matching regex, refusal message
- `scripts/electron-packaged-child-smoke.cjs` — packaged out path (env var `AGENT_DESIGN_CHILD_ENTRY` name kept as-is, it's an identifier)
- `scripts/verify-package.mjs` — package/installer/nupkg paths, verifier tool display name
- `test/squirrel-startup.test.ts` — executable/update path fixtures and expectations
- `test/terminal-command.test.ts` — adapter path fixture
- `test/asset-path.test.ts` — fixture HTML fixture string

**apps/agent-design**
- `index.html` — `<title>`
- `src/App.tsx` — h1 product name, eyebrow copy
- `src/CanvasSurface.tsx` — canvas `aria-label`
- `src/App.test.tsx` — describe block label
- `scripts/run-integration.mjs` — readiness error string
- `README.md` — heading and body copy

**packages/agent-design-mcp**
- `src/server.ts` — tool `title` display strings (get_context, apply_operations, verify, undo)
- `src/contract.test.ts` — describe block label
- `scripts/run-roundtrip.mjs` — fixture document `name`

**Living docs (Scope B)**
- `CLAUDE.md` — App bullet
- `docs/OBJECTIVE.md` — objective bullet, long-arc item 6
- `docs/PRD.md` — non-goal bullet, success criteria bullet
- `docs/ARCHITECTURE.md` — section heading, user-owned-agents bullet
- `docs/agent-design-terminal-connection.md` — title, two body sentences

## Deliberately left unchanged

- Icon paths (`staging/icons/agent-design.*`) — explicitly out of scope per instructions.
- `AGENT_DESIGN_CHILD_ENTRY`, `AGENT_DESIGN_ACTOR`, `AGENT_DESIGN_BRIDGE_URL`, `AGENT_DESIGN_SESSION_TOKEN` env var names, and MCP server name `agent-design-${actor}` — these are code-level identifiers/env vars, not display strings.
- Diagnostics default filename prefix (`agent-design-diagnostics-*`) — identifier-ish, left as-is per instructions' discretion clause.
- Temp directory prefix `agent-design-packaged-child-` in `electron-packaged-child-smoke.cjs` — internal tmp naming, not user-facing.
- `docs/horizons/2026-07-public-product-monetization.md` — no "Agent Design" string found; nothing to change.
- `ROADMAP.md` — no "Agent Design" string found; nothing to change.
- `packages/canvas-core/src/fixtures.ts` (`name: \`Agent Design ${size} node fixture\``) — internal test-fixture document metadata, not a package in the given SCOPE A list; left untouched, flagged for a future pass if desired.
- Frozen records (BACKLOG.md, docs/plans/*, changesets/*, docs/adr/*, docs/roadmap-gap-*, docs/research/*, docs/market/*, references/*, other docs/horizons/*, CLAUDE.local.md) — untouched per instructions.
- `out/` packaged artifacts (electron-forge output, installer, nupkg) keep the old name until the next `make:win` run — expected; packaged repackage under the new name is deferred to the upcoming Quality horizon install step.

## Verification

- [x] `cd apps/agent-design-desktop && npm test` — 11 test files, 47 tests passed.
- [x] `cd apps/agent-design-desktop && npm run build` — `tsc -p tsconfig.json && esbuild ...` exit 0 (prebuild chain also rebuilt canvas-core, agent-design, agent-design-bridge, agent-design-mcp cleanly).
- [x] `cd apps/agent-design && npm test -- --run` — 10 test files, 73 tests passed (baseline preserved, no regressions).
- [x] `cd apps/agent-design && npm run build` — `tsc -b && vite build` exit 0.
- [x] `cd packages/agent-design-mcp && npm test` — 3 test files, 21 tests passed.
- [x] `grep -r "Agent Design" apps/agent-design/src apps/agent-design-desktop/src apps/agent-design-desktop/forge.config.cjs` — no matches.

## Result

Completed. All display/product-facing "Agent Design" strings in apps/agent-design-desktop, apps/agent-design, packages/agent-design-mcp, and the listed living docs were renamed to "AskewlyDesign" per the fixed mapping, while directory names, npm package identifiers, icon paths, and internal env var/identifier names were left untouched. Full desktop (47/47) and canvas app (73/73 baseline) unit suites pass, both apps build cleanly, and the agent-design-mcp contract suite (21/21) passes with updated describe labels. No git commit was made.
