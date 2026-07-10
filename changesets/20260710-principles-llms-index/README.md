# 20260710 Principles llms.txt Index

## Target

- ROADMAP milestone: SCD1 - Principles 증류 (사람용 + 에이전트용), Step 2
- Plan: `docs/plans/2026-07-10-scd1-principles.md`

## Scope

- Register `docs/design-system/principles.md` in `scripts/generate-llms-txt.mjs` as a fixed agent asset.
- Regenerate the public `llms.txt` discovery layer and copied raw asset.

## Contract

- `docs/design-system/principles.md` remains the source of truth.
- `examples/ui-vocabulary-site/public/llms.txt` and `public/llms/**` remain generated artifacts; direct edits are forbidden.
- The generator must fail when a registered source is missing or a generated URL lacks a backing file.
- Out of scope: human-facing Docs article, production gate opening, deploy, and ROADMAP completion.

## Verification

- [x] `node scripts/generate-llms-txt.mjs` exits 0 (11 assets copied).
- [x] Generated `llms.txt` contains the principles URL and description (`rg` line 10).
- [x] Generated raw principles asset exists and matches the canonical source byte-for-byte (SHA-256 `18B37F...E41848`).
- [x] Missing-source failure mode exits non-zero when the canonical file is temporarily unavailable (`SSOT source missing`, exit 1), followed by a successful clean regeneration.

## Result

- The agent discovery layer now exposes the canonical principles and retains its missing-source hard failure.
