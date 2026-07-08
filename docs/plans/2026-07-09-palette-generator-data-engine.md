# Palette Generator Data Engine

Date: 2026-07-09
Status: pending
Horizon: `public-site-shell`
Milestone: `PGD1`

## Summary

Turn the Color Palette Generator from a small hardcoded demo into a believable palette-generation surface with curated seed data, generation rules, and quality checks. The current `Generate` action cycles through `paletteGeneratorSets`; this milestone should replace or extend that with a real palette data contract.

## Step Tree

- [ ] Define palette data contract and seed library: curated palette families, names, source notes, and constraints. (verify: data file schema + lint/build)
- [ ] Implement generator behavior: locked colors stay fixed, unlocked colors are regenerated from compatible palette families or color harmony rules. (verify: unit-like focused checks + Chrome smoke)
- [ ] Add quality gates: contrast/readability, duplicate avoidance, stable export, and deterministic fallback. (verify: lint/build + generator smoke)
- [ ] Polish UI copy and evidence: explain generation source without exposing implementation noise. (verify: Chrome desktop/mobile smoke)

## Decisions

- Treat this as a product capability milestone, not a one-off card polish bugfix.
- Keep current hardcoded `paletteGeneratorSets` only as temporary seed data until the milestone starts.
- Do not fetch third-party palette data at runtime unless a later decision explicitly approves source/licensing and network behavior.

## Evidence Target

- Code changes in `examples/ui-vocabulary-site/src/components/home-page.tsx` or extracted palette data modules.
- Focused lint/build.
- Chrome smoke showing Generate behavior, locked-color preservation, and export stability.
