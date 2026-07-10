# 20260710 Principles Gate Open

## Target

- ROADMAP milestone: SCD1 - Principles 증류 (사람용 + 에이전트용), Step 4
- Plan: `docs/plans/2026-07-10-scd1-principles.md`

## Scope

- Record the user's 2026-07-10 approval in the canonical principles document.
- Remove the `shell: true` flags from the Principles nav item and article so production builds expose them.
- Regenerate the public agent assets after the canonical status change.
- Verify the human and agent surfaces locally and after deployment.

## Contract

- `docs/design-system/principles.md` remains the canonical source; the Docs article and `public/llms/**` remain derived consumers.
- Gate removal is authorized by the user's explicit `승인` response at the SCD1 Step 4 stop point.
- No principle wording, unrelated Docs route, recipe, token, or visual treatment changes in this changeset.
- Deployment target: `ui.askewly.com` through the existing `main` push workflow.

## Verification

- [x] User approval is recorded in the canonical source and changeset evidence (user response: `승인`, 2026-07-10).
- [x] `node scripts/generate-llms-txt.mjs` succeeds (11 assets) and the generated raw principles asset matches the canonical source (SHA-256 `C73397...EE530`).
- [x] `npm run lint` and `npm run build` PASS (existing Fast Refresh and bundle-size warnings only).
- [x] Production preview exposes one Principles nav item, article title, eight numbered sections, and checklist; 375px overflow 0; `Getting set up` regression PASS; console errors 0.
- [x] Missing-source failure mode remains non-zero (`SSOT source missing`, exit 1), followed by successful clean regeneration.
- [x] Cloudflare deployment `e9cba517-7f6b-4ea8-883e-0ae4de9c13d4` succeeded for source `74ade1a`; its deployment URL and `ui.askewly.com` both expose the approved raw principles asset, llms index entry, `index-CJVsnwas.js` article heading, and public gate id.

## Result

- User-approved Principles are public on both human and agent surfaces. Local and production release gates pass.
