# 20260709 Palette Generator Data Engine

Target: ROADMAP milestone PGD1 - Palette Generator Data Engine.

## Scope

- Replace the small inline `paletteGeneratorSets` cycle with a palette seed library and deterministic generation helper.
- Preserve locked colors while regenerating unlocked columns from curated seed families and harmony candidates.
- Add duplicate/readability/export-stability quality checks and show them in the Color Palette Generator rail.
- Keep generation local and deterministic; no runtime third-party palette fetch.

## Contract

- Source of truth: `examples/ui-vocabulary-site/src/lib/palette-generator.ts` for palette data and generation rules, `examples/ui-vocabulary-site/src/components/home-page.tsx` for UI state and interaction.
- The generator must keep existing lock, add, shade, picker, drag, and export UI behavior compatible.
- Seed data is curated in-repo product-interface palette data with source notes, not scraped or remotely fetched data.
- Out of scope: AI palette generation, external palette APIs, billing-gated packs, or broad visual redesign of the showcase card.

## Verification

- [x] `npm run lint` from `examples/ui-vocabulary-site`
- [x] `npm run build` from `examples/ui-vocabulary-site`
- [x] Local Chrome smoke on `http://127.0.0.1:4175/?pgd1-smoke=1`: rail shows seed source copy and `Unique`, `Readable`, `Export OK` quality badges.
- [x] Local Chrome smoke: locking `#FF99C8` then pressing `Generate` preserves that locked color and regenerates the unlocked colors from the next seed family.
- [x] Local Chrome smoke: export dialog opens after generation and exposes Image, Code, and SVG export actions.

## Result

Completed. The Color Palette Generator now uses a typed seed library plus deterministic harmony candidates, preserves locked colors during generation, avoids duplicate candidates, and exposes compact quality gates in the rail. Lint/build passed; local Chrome smoke verified seed-source copy, locked-color preservation, quality badges, and export dialog stability.
