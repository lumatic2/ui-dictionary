---
id: doc-search-cmdk-grouped-results-panel
name: "Doc Search Cmd-K Grouped Results Panel"
pattern_group: navigation
kind: block
status: draft
surface_refs: [documentation, websites]
tokens_used:
  - color.semantic.surface.overlay
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.2
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/doc-search-cmdk-grouped-results-panel.tsx
component_refs: [topbar-command-search]
term_refs: [command-palette, search-suggestions]
source_refs: [tailwind-plus-documentation-command-palette]
last_verified: 2026-07-12
---

> Code asset (start here, then restyle to project tokens): https://ui.askewly.com/r/doc-search-cmdk-grouped-results-panel.json

## Intent

A documentation site's Cmd/Ctrl+K search reuses the `command-palette` overlay shell (`topbar-command-search` implements the same input+popover idea inline in a topbar), but a docs search result set spans several kinds of content — pages, guides, API entries — and a flat list makes the reader scan section by section anyway. Grouping results under section headers (Docs/Guides/API) inside the same overlay does that scanning for them, without inventing a second overlay pattern.

## Anatomy

- Trigger: a topbar button showing a keyboard shortcut hint (handled by the caller, not this component — this recipe covers the overlay itself).
- Overlay: `CommandDialog` (Radix `Dialog` + `cmdk`), with a search input pinned at the top.
- Result list: one `CommandGroup` per section (e.g. Docs, Guides, API), each with its own heading and rows.
- Row: label plus an optional one-line description, keyboard-navigable via `cmdk`'s built-in active-row handling.
- Empty-query state: instead of an empty overlay, shows a "Recent" group (past queries) and a "Suggested" group (curated docs) — this absorbs the recent/suggested-terms behavior into the same panel rather than a separate recipe.
- No-match state: a single `CommandEmpty` row when a non-empty query yields zero results in every group.

## States

- Empty query (`query === ""`): shows Recent + Suggested groups, no `CommandEmpty` row.
- Typed query with matches: shows the section groups that have results; a group with zero matching rows is omitted entirely, not rendered with a "no results" placeholder.
- Typed query with zero matches across every group: shows only `CommandEmpty`.
- Keyboard navigation: arrow keys move the active row across group boundaries, Enter selects it — handled by `cmdk`, not re-implemented here.

## Variants

- Docs-scoped (this recipe): sections are content-type groups (Docs/Guides/API).
- Ops-scoped variant: `command-palette`'s own description already covers an entity-scoped ops variant with visually separated destructive actions — that is a different scoping axis (entity, not content-type) and stays a `command-palette` usage note rather than a second grouped-results recipe.

## Code

```tsx
<CommandDialog open={open} title="Search documentation" onOpenChange={onOpenChange}>
  <CommandInput value={query} onValueChange={onQueryChange} placeholder="Search docs..." />
  <CommandList>
    {isEmptyQuery ? (
      <>
        <CommandGroup heading="Recent">{/* recent queries */}</CommandGroup>
        <CommandGroup heading="Suggested">{/* suggested docs */}</CommandGroup>
      </>
    ) : (
      <>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.id} heading={group.label}>
            {group.items.map((item) => <CommandItem key={item.id} value={item.label} onSelect={() => onSelect(item.id)} />)}
          </CommandGroup>
        ))}
      </>
    )}
  </CommandList>
</CommandDialog>
```

Full implementation: `examples/ui-vocabulary-site/src/components/doc-search-cmdk-grouped-results-panel.tsx`. Built on the `command` (cmdk) and `dialog` shadcn primitives.

## Checks

- A group with no matching rows for the current query is omitted from the list, not rendered with an empty sub-heading.
- The Recent/Suggested empty-query content and the grouped-results typed-query content are mutually exclusive — never both visible at once.
- `CommandEmpty` only renders when every group has zero rows, not per-group.
- Keyboard active-row state survives moving from one group's last row to the next group's first row.

## Anti-patterns

- **Flat list pretending to be grouped**: rendering section labels as plain text inside one list instead of using `CommandGroup`, which breaks `cmdk`'s per-group keyboard semantics.
- **Empty overlay on first open**: showing a blank result list before the user types anything, instead of the Recent/Suggested fallback content.
- **Per-group "no results" rows**: rendering an explicit empty message inside every group instead of simply omitting empty groups.
- **Reimplementing keyboard navigation**: hand-rolling arrow-key/active-index logic on top of `cmdk`'s `Command.List`/`Command.Item`, which already owns that behavior.

## Agent notes

- prompt_phrases: "문서 사이트에 Cmd K로 여는 검색 패널을 만들어줘, 결과를 Docs/Guides/API로 그룹핑해줘", "검색어가 없을 때는 최근 검색어와 추천 문서를 보여주는 문서 검색 오버레이를 만들어줘"
- fallbacks: if only one section has results, still render it inside a `CommandGroup` with its heading rather than collapsing to a flat list — a second section can be added later without restructuring.
- related: distinct from `topbar-command-search`, which renders search inline in the topbar via a `Popover` and is not grouped by content-type; this recipe is a full-overlay `CommandDialog` grouped by section.
