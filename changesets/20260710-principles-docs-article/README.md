# 20260710 Principles Docs Article

## Target

- ROADMAP milestone: SCD1 - Principles 증류 (사람용 + 에이전트용), Step 3
- Plan: `docs/plans/2026-07-10-scd1-principles.md`

## Scope

- Add a Korean human-facing Principles article derived from `docs/design-system/principles.md`.
- Add the article to Getting started navigation behind the existing `shell: true` development-only gate.
- Register the corresponding navigation collection so deep-link/filter parsing remains typed and stable.

## Contract

- `docs/design-system/principles.md` remains the sole canonical source; this article is a readable derivative.
- The nav item and article must stay `shell: true` until the Step 4 user approval gate is explicitly released.
- Production navigation and direct article rendering must remain unavailable before approval, while development mode must render the full article.
- Out of scope: gate release, production deploy, recipe expansion, and ROADMAP completion.

## Verification

- [x] `npm run lint` and `npm run build` PASS (existing Fast Refresh and bundle-size warnings only).
- [x] Dev server (5197) renders one Principles nav item, article title, eight numbered principle sections, and Implementation checklist.
- [x] Production preview (5198) hides the Principles nav item and does not render the article lead or any numbered principle section on the direct filter URL.
- [x] Mobile development render at 375px override has horizontal overflow 0.
- [x] Existing public `Getting set up` article still renders its title and Requirements section in production preview; Principles remains absent from its nav.

## Result

- The complete Korean derivative is available in development and remains correctly gated from production pending user approval.
