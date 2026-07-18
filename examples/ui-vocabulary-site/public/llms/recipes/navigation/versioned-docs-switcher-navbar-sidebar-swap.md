---
id: versioned-docs-switcher-navbar-sidebar-swap
name: "Versioned Docs Switcher With Navbar Dropdown And Sidebar Swap"
pattern_group: navigation
kind: block
status: draft
surface_refs: [documentation, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.2
  - dimension.space.4
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/versioned-docs-switcher-navbar-sidebar-swap.tsx
component_refs: []
term_refs: [versioned-docs-switcher]
source_refs: [mintlify-docs-navigation]
last_verified: 2026-07-12
---

> Code asset (start here, then restyle to project tokens): https://ui.askewly.com/r/versioned-docs-switcher-navbar-sidebar-swap.json

## Intent

The `versioned-docs-switcher` term already names the dropdown-plus-stale-banner concept; this recipe is the actual three-part state contract behind it — picking a version in the navbar dropdown does not just relabel the page, it swaps the sidebar tree's entire data source to that version's structure, and shows a stale-version banner whenever the selected version is not the latest. The dropdown, banner, and sidebar all read from one `activeVersionId` value instead of three independently-set flags.

## Anatomy

- Navbar row: site/docs label plus a version `Select` dropdown, latest version selected by default.
- Stale banner: conditional strip below the navbar, visible only when the active version is not the latest.
- Sidebar tree: full nested navigation list, sourced from `sidebarByVersion[activeVersionId]` — a different version renders a structurally different tree, not the same tree with different labels.

## States

- Latest version selected: no stale banner, sidebar shows the latest version's tree.
- Older version selected: stale banner visible, sidebar swaps to that version's own tree (which may have fewer or differently-organized pages).
- Version with no matching page for the reader's current location: out of scope for this component — the caller re-maps the current page to its nearest equivalent in the target version before rendering, this component only renders whatever tree it is given.

## Variants

- Dropdown-only (no sidebar swap): a lighter variant where only the banner+dropdown apply and the sidebar stays version-agnostic — not implemented here; if the product never has version-specific navigation structure, `versioned-docs-switcher`'s dropdown+banner alone is enough and this heavier recipe is unnecessary.

## Code

```tsx
<Select value={activeVersionId} onValueChange={onVersionChange}>
  <SelectTrigger size="sm"><SelectValue /></SelectTrigger>
  <SelectContent>
    {versions.map((v) => <SelectItem key={v.id} value={v.id}>{v.label}{v.isLatest ? " (latest)" : ""}</SelectItem>)}
  </SelectContent>
</Select>
{activeVersion && !activeVersion.isLatest ? (
  <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
    <TriangleAlert className="size-4" />
    <span>You are viewing docs for {activeVersion.label}, which is not the latest version.</span>
  </div>
) : null}
<nav>{sidebarGroups.map((group) => /* group.pages rendered as links */ null)}</nav>
```

Full implementation: `examples/ui-vocabulary-site/src/components/versioned-docs-switcher-navbar-sidebar-swap.tsx`. Built on the `select` shadcn primitive.

## Checks

- Selecting a version updates the sidebar tree, not only the dropdown's displayed value.
- The stale banner's visibility is derived from `activeVersion.isLatest`, never a separately-tracked boolean that could drift out of sync with the dropdown selection.
- Sidebar groups render from `sidebarByVersion[activeVersionId]` only — no merging of the previous version's tree with the new one.
- Latest version never shows the stale banner, even immediately after switching away from and back to it.

## Anti-patterns

- **Dropdown without a data swap**: changing the selected label but leaving the sidebar tree pointing at the previous version's data — the two must read the same `activeVersionId`.
- **Banner tracked separately from the dropdown**: a standalone "is this stale" flag that can fall out of sync with the actual selected version, instead of deriving it from `isLatest` on the currently selected version.
- **Silent page 404 on switch**: switching version and leaving the reader on a URL that doesn't exist in the new version's tree without any re-map or redirect.

## Agent notes

- prompt_phrases: "navbar 버전 드롭다운을 고르면 사이드바 전체가 그 버전 구조로 바뀌는 문서 내비게이션을 만들어줘", "오래된 버전을 보고 있으면 상단에 경고 배너가 뜨고 사이드바도 그 버전 트리로 바뀌게 해줘"
- fallbacks: if a version has no entry in `sidebarByVersion`, render an empty sidebar rather than falling back to another version's tree silently.
- related: this recipe implements the existing `versioned-docs-switcher` term's dropdown+banner+sidebar-swap description as actual composition; it does not introduce a new term.
