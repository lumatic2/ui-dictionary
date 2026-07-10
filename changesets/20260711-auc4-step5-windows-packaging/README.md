# AUC4 Step 5 — Windows Packaging, Fuses, Installer, And Release Boundary

## Outcome

- Added independent production assembly for the Electron main/preload, Vite renderer, supervised bridge child, and stdio MCP adapter without a development server dependency.
- Added Windows x64 Forge packaging with the Agent Design icon/metadata and a Squirrel installer named `AgentDesign-UnsignedDevelopment-Setup.exe`.
- Applied and verified every Electron 43 fuse: RunAsNode, NODE_OPTIONS, inspect arguments, and extra file privileges are disabled; cookie encryption, embedded ASAR integrity, ASAR-only loading, browser V8 snapshot, and Wasm trap handlers are enabled.
- Added fail-closed package inspection for ASAR/resource inventory, hashes, forbidden development URLs/source maps/secret patterns, Authenticode status, updater/publisher state, and CycloneDX component inventory.
- Kept the distribution classification at `unsigned-development`; no signing identity, updater, or publisher is configured.

## Evidence

- `cd apps/agent-design-desktop && npm run make:win` — Windows x64 unpacked application, Squirrel full package, RELEASES index, and unsigned development installer created.
- `cd apps/agent-design-desktop && npm run verify:package` — 5 artifacts, 5 packaged resources, and all 9 fuse states passed; hashes are recorded in `results/package/artifact-manifest.json` and shipped components in `results/package/sbom.cdx.json`.
- `cd apps/agent-design-desktop && npm test` — 36/36 desktop host, authority, trust, lifecycle, preview, diagnostics, and OS-action tests passed.
- `cd apps/agent-design-desktop && npm run verify:security` — real Electron runtime smoke and Electronegativity high-severity scan passed; the legacy scanner's Electron release table does not recognize 43.1.x, so runtime controls and exact fuse inspection remain the controlling evidence.
- `cd apps/agent-design-desktop && npm audit --omit=optional` — 0 vulnerabilities.
- Code commit: `72b5bb0`.

## Next

Step 6 exercises the packaged executable and installer lifecycle, the complete terminal-to-canvas workflow, crash/recovery and fallback paths, representative performance/a11y/IME proof, process cleanup, and install/uninstall evidence.
