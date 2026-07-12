# FW Step 2 — Recipe Catalog Generator

## Outcome

- Extended `RegistryCollection` (`packages/component-registry/src/types.ts`) with `'recipe'`.
- Added a build-time generator (`packages/component-registry/scripts/build-recipe-catalog.mjs`, wired as `npm run build:catalog`) that parses every `recipes/*/*.md` frontmatter and emits `packages/component-registry/src/recipe-catalog.generated.ts`, exporting `recipeCatalog: RegistryEntry[]` (23 entries, one per recipe).
- Exported `recipeCatalog` from the package index (`src/index.ts`) alongside `shadcnCatalog`/`layoutCatalog`. It is a separate array — `catalog` (`shadcnCatalog` + `layoutCatalog`, 16 entries) is untouched, keeping the build-time recipe derivation decoupled from the hand-authored shadcn/layout catalog per the plan's decision log.
- Missing/invalid frontmatter (missing `id`/`name`/`pattern_group`/`code_asset`, unknown `pattern_group`, duplicate `id`, or a missing `## Intent` section) makes the generator exit non-zero with a clear stderr message — no silent skips.
- Added `yaml` as a devDependency (matches the pattern already used by `packages/cli/scripts/build-data.mjs`).

## Field-mapping decisions

- `id`: `recipe/<frontmatter id>`; `slug`: the frontmatter `id` verbatim.
- `category`: human-readable label per the 10 canonical `pattern_group` values from `docs/design-system/pattern-taxonomy.md` §3 (e.g. `data-display` → `"Data Display"`). Unknown `pattern_group` fails the generator rather than falling back to a guess.
- `description`: recipes have no dedicated summary/description frontmatter field (confirmed against all 23 recipes), so the generator derives it from the first sentence of the recipe's `## Intent` section body.
- `keywords`: `term_refs` (deduplicated with `tags` if a recipe ever defines that field — none currently do).
- `defaultSize`: one constant per `pattern_group` (overlays 360×480, navigation 390×80, the rest sized for a typical desktop content block — see constants and rationale comment in the script). The one exception: a `layout` recipe whose `surface_refs` is exactly `['mobile-apps']` gets a full mobile viewport (390×844) instead of the 800×600 desktop default. No current recipe hits that branch, but it matches the plan's explicit example and costs one conditional.
- `defaultProps: {}` / `variants: {}`: recipes are compositions, not parameterized primitives, so both are always empty per the plan.
- `code_asset` was **not** carried into `RegistryEntry` — a sibling changeset is migrating those paths, and no test/DoD item needs it on the registry entry. Carrying it as an untyped, unvalidated metadata field would only add schema surface for no consumer.

## Evidence

- Baseline: `cd packages/component-registry && npm test -- --run` → 2 files, 20/20 tests passed (`materialize.test.ts` 9, `registry.test.ts` 11).
- After: same command → 3 files, 24/24 tests passed (added `recipe-catalog.test.ts`, 4 tests: 23-entry count, unique `recipe/`-prefixed ids, `collection`/size/props/variants shape, generator failing loudly on a disposable temp fixture with a missing `pattern_group`/`code_asset`).
- `npm run build:catalog` run twice back to back, output diffed byte-for-byte identical (`recipe catalog generated: 23 entries`).
- `cd packages/component-registry && npm run build` → `tsc` passed (canvas-core prebuild + this package), no errors.
- No changes to `apps/`, `recipes/`, `examples/`, `docs/`, or `materialize.ts` behavior for existing collections.

## Next

Step 3: wire `InsertPalette` in `apps/agent-design` to expose the `recipe` collection, add a browser E2E inserting a mobile recipe into a mobile-viewport canvas, and update `reference-loop.md`.
