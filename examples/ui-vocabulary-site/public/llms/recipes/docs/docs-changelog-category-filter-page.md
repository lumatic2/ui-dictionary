---
id: docs-changelog-category-filter-page
name: "Docs Changelog Page With Category Filter Chips And Pagination"
pattern_group: docs
kind: block
status: draft
surface_refs: [documentation, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/docs-changelog-category-filter-page.tsx
component_refs: []
term_refs: [docs-changelog-page, release-note-card]
source_refs: [stripe-changelog-docs]
last_verified: 2026-07-12
---

> Code asset (start here, then restyle to project tokens): https://ui.askewly.com/r/docs-changelog-category-filter-page.json

## Intent

`docs-changelog-page` already names a date-grouped `release-note-card` list as a page; this recipe is the concrete implementation with the two controls that make a long changelog navigable — a category filter chip row (All/GA/Preview-style categories) that narrows which cards show, and pagination so the page doesn't grow unbounded. Filtering and pagination share one state contract: changing the category resets which date groups are visible, and a date group with zero remaining cards after filtering disappears rather than rendering with an empty heading.

## Anatomy

- Category filter row: chip-style toggle buttons (All + one per category), one active at a time.
- Date-grouped sections: a date header followed by that date's `release-note-card` entries.
- Release note card: version label, tag badges, change summary — matches the `release-note-card` term's own anatomy.
- Pagination footer: page indicator plus previous/next controls, shown only when there is more than one page.

## States

- Default (All category, page 1): every date group with at least one release renders.
- Category selected: date groups whose releases don't match the category are hidden entirely, not shown with a "no releases" placeholder inside an otherwise-empty group.
- No releases match the selected category across every group: a single page-level empty message replaces the group list.
- Last page reached: the "Next" control is disabled (`aria-disabled`), not hidden, so the control's position stays stable.

## Variants

- Single-page changelog (few releases): pagination footer is omitted entirely rather than rendered disabled, since `pageCount <= 1`.
- Search-augmented variant: a search field ahead of the category chips — not implemented here; this recipe covers the category+pagination baseline only.

## Code

```tsx
<div role="group" aria-label="Filter changelog by category">
  {categories.map((c) => (
    <button key={c.id} aria-pressed={c.id === activeCategoryId} onClick={() => onCategoryChange(c.id)}>
      <Badge variant={c.id === activeCategoryId ? "default" : "outline"}>{c.label}</Badge>
    </button>
  ))}
</div>
{visibleGroups.map((group) => (
  <section key={group.date}>
    <h2>{group.date}</h2>
    {group.releases.map((r) => (
      <article key={r.id}>
        <span>{r.version}</span>
        {r.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        <p>{r.summary}</p>
      </article>
    ))}
  </section>
))}
{pageCount > 1 ? <Pagination>{/* previous / page indicator / next */}</Pagination> : null}
```

Full implementation: `examples/ui-vocabulary-site/src/components/docs-changelog-category-filter-page.tsx`. Built on the `badge` and `pagination` shadcn primitives.

## Checks

- Hidden date groups (zero releases after filtering) do not render their date header either — no empty section chrome.
- Only one category chip shows the active (`default` variant) state at a time.
- Pagination is entirely absent, not just visually inert, when `pageCount <= 1`.
- Previous/Next controls stay in the same layout position whether enabled or `aria-disabled`.

## Anti-patterns

- **Empty date headers**: rendering a date section with no cards underneath it after a category filter removes all of that date's releases.
- **Category chips as a single-select dropdown**: collapsing the chip row into a `Select`, losing the at-a-glance multi-option scan a changelog reader relies on.
- **Pagination appended instead of replacing**: a "load more" that keeps appending pages to a single infinite list instead of this recipe's page-replaces-page contract (either is valid UX, but they are different recipes — do not mix load-more state into a page-number pager).
- **Filter and pagination state drifting apart**: not resetting to page 1 when the category changes, leaving the reader on a page number that may not exist for the new filtered set.

## Agent notes

- prompt_phrases: "카테고리 필터 chip과 페이지네이션이 있는 changelog 페이지를 만들어줘", "release note를 날짜별로 묶고 카테고리로 필터링할 수 있는 체인지로그를 만들어줘"
- fallbacks: if no `tags` exist for a release, omit the tag badge row rather than rendering an empty badge group.
- related: implements the existing `docs-changelog-page` term and reuses `release-note-card`'s card anatomy directly — no new term needed for either.
