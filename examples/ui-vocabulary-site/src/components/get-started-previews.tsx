/** Get Started illustrations (QA2, round 4 — generated artwork set).
 *  Three cohesive brand illustrations (white ground, violet family) generated for the
 *  three hero cards (2026-07-31, codex imagegen; sources in changeset README). Served
 *  as 1200w webp (28–52KB). Decorative: empty alt + aria-hidden wrappers. */

export function PatternsCollage() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative mt-8 h-64 select-none overflow-hidden">
      <img
        alt=""
        className="w-full rounded-t-xl border border-b-0 object-cover object-top shadow-sm"
        src="/assets/get-started/patterns.webp"
      />
    </div>
  )
}

export function ColorsSwatchGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      <img
        alt=""
        className="h-48 w-full rounded-xl border object-cover shadow-sm"
        src="/assets/get-started/colors.webp"
      />
    </div>
  )
}

export function RecipesCollage() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none lg:py-2">
      <img
        alt=""
        className="h-56 w-full rounded-xl border object-cover shadow-sm"
        src="/assets/get-started/recipes.webp"
      />
    </div>
  )
}
