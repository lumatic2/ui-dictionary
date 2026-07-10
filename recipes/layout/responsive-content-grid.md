---
id: responsive-content-grid
name: "Responsive Content Grid"
pattern_group: layout
kind: block
status: draft
surface_refs: [websites, saas-dashboards, commerce, documentation]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.4
  - dimension.space.8
  - dimension.space.12
  - dimension.radius.md
  - typography.scale.sm
  - typography.scale.lg
code_asset: examples/ui-vocabulary-site/src/App.tsx
component_refs: []
term_refs: [grid, responsive-stack, responsive-layout, container]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-10
---

## Intent

A responsive content grid arranges peer items into as many columns as the content can support, then collapses without changing their reading order. It is a layout contract for cards, examples, products, or records, not a decorative checkerboard.

## Anatomy

- Outer container: a content-driven maximum width and page padding.
- Grid: one source order, explicit gap, and breakpoint-based column count.
- Item boundary: `min-w-0` plus a consistent internal spacing contract.
- Content priority: heading and primary information remain visible before optional media or metadata.

## States

- Mobile: one column with no clipped actions or horizontal scroll.
- Intermediate: two columns after each item can preserve its minimum useful width.
- Wide: three or four columns only when content remains readable.
- Sparse data: the final row stays left aligned; empty slots are not rendered as placeholders.

## Variants

- Equal cards for peer choices.
- Dense records with a smaller gap and stronger row scanning.
- Featured item spanning columns when its information priority is genuinely higher.
- Media grid with a fixed aspect ratio and text below.

## Code

```tsx
function ResponsiveContentGrid({ items }: { items: Item[] }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="min-w-0 border bg-card p-6 text-card-foreground">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-medium">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {item.status && <StatusChip value={item.status} />}
            </div>
            {item.actions && (
              <div className="mt-6 flex flex-wrap gap-2">
                {item.actions.map((action) => (
                  <button key={action.label} type="button" onClick={action.run}>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
```

## Checks

- Breakpoints follow the point where content no longer fits, not device names alone.
- DOM order remains the reading and keyboard order at every width.
- Each item and text wrapper has `min-w-0` where truncation or overflow is possible.
- At mobile width the page has zero horizontal overflow and primary actions remain visible.
- Empty results use an explicit empty state instead of an empty grid frame.

## Anti-patterns

- **Desktop grid squeezed smaller**: three columns persist until text and actions clip.
- **Visual reordering**: CSS order creates a different keyboard and screen-reader sequence.
- **Card mosaic without information priority**: random spans make peer items appear unequal.
- **Nested frame repetition**: every item contains several more bordered cards instead of a clear internal hierarchy.

## Agent notes

- prompt_phrases: "content-driven responsive grid with stable source order", "one-to-three column product grid with mobile overflow check"
- fallbacks: use a vertical list when comparison depends on aligned columns or rows.
- canonical guidance: `docs/design-system/principles.md` principles 1, 2, and 5.
