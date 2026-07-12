---
id: category-product-grid
name: "Category Product Grid"
pattern_group: commerce
kind: block
status: draft
surface_refs: [commerce, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.space.8
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/category-product-grid.tsx
component_refs: []
term_refs: [product-card, filter-bar, sort-control]
source_refs: [tailwind-plus-ecommerce]
last_verified: 2026-07-12
---

## Intent

A category product grid assembles many `product-card` cells into the higher-order list structure a category or search-results page actually needs: a filter/sort bar above the grid, a loading skeleton that matches the final column count, and an empty state that offers a way out instead of a dead end. The card itself stays a separate term — this recipe is the layout and state machine around it.

## Anatomy

- Result count: a line above the grid stating how many items matched (or "Loading results…" while fetching).
- Sort control: a single sort dropdown, right-aligned above the grid.
- Grid container: a responsive column count (2 on narrow viewports, up to 4 on wide desktop).
- Repeated `product-card` cells filling the grid.
- Loading skeleton: placeholder cells matching the final column count and card shape, not a generic spinner.
- Empty/zero-result state: message plus a reset-filters action, not just "no results".

## States

- Loading: skeleton grid shown at the same column count the real grid will use, so the layout doesn't jump on load.
- Populated: result count, sort control, and full grid of cards.
- Empty (zero results): no cards, a short explanation, and a reset-filters button — never an empty grid with no path forward.
- Sort changed: result count and grid update together; scroll position is preserved rather than jumping back to the top.

## Variants

- 3-column grid for denser card content (larger imagery, more per-card metadata).
- 4-column grid (default) for standard product cards.
- Infinite-scroll load trigger appended below the grid instead of numbered pagination, for long category lists.

## Code

```tsx
export function CategoryProductGrid({ products, loading, sort, onSortChange, onResetFilters, columns = 4 }: CategoryProductGridProps) {
  if (loading) {
    return <SkeletonGrid columns={columns} />
  }
  if (products.length === 0) {
    return (
      <EmptyState message="No products match these filters" onResetFilters={onResetFilters} />
    )
  }
  return (
    <section aria-label="Product results">
      <ResultsHeader count={products.length} sort={sort} onSortChange={onSortChange} />
      <div className={gridColumnsClass(columns)}>
        {products.map((product) => <ProductCardCell key={product.id} product={product} />)}
      </div>
    </section>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/category-product-grid.tsx`. Built on the `select` primitive for sort and `skeleton` primitive for the loading grid.

## Checks

- The loading skeleton renders the same column count as the real grid — no layout shift on load.
- Zero results always show a reset-filters action, never a silent empty grid.
- Changing sort does not reset scroll position back to the top of the page.
- Each grid cell renders a full `product-card` (image, title, price) — this recipe does not redefine the card's own anatomy.

## Anti-patterns

- **Generic spinner instead of skeleton**: a centered spinner during load causes a layout jump once real cards arrive; use a skeleton grid at the target column count instead.
- **Dead-end empty state**: showing only "No results" with no reset action strands the user with the filters that produced zero matches.
- **Column count drift**: loading skeleton at a different column count than the populated grid, causing a visible reflow.
- **Card logic duplicated into the grid**: reimplementing product-card's own image/price/rating layout inline instead of composing the existing card.

## Agent notes

- prompt_phrases: "카테고리 페이지에 필터/정렬 바와 상품 카드 그리드를 만들어줘", "결과 없을 때 필터 초기화 버튼이 있는 빈 상태를 넣어줘"
- fallbacks: if infinite scroll isn't available, numbered pagination below the grid is an acceptable substitute — keep the same loading-skeleton and empty-state behavior either way.
- component composition: compose from the existing `product-card` term rather than inlining card markup; this recipe owns the grid/filter/loading/empty shell only.
