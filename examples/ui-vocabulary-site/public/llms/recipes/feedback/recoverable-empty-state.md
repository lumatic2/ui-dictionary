---
id: recoverable-empty-state
name: "Recoverable Empty State"
pattern_group: feedback
kind: block
status: draft
surface_refs: [websites, mobile-apps, saas-dashboards, commerce, internal-tools]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.4
  - dimension.space.8
  - dimension.radius.md
  - typography.scale.sm
  - typography.scale.lg
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/recoverable-empty-state.tsx
component_refs: [button]
term_refs: [empty-state, empty-search-result, empty-filter-state, error-state]
source_refs: []
last_verified: 2026-07-10
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/recoverable-empty-state.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A recoverable empty state explains why expected content is absent and gives the user the most direct next action. It distinguishes first-use emptiness, no search results, filtered-out content, permission limits, and load failures instead of showing one generic illustration for every cause.

## Anatomy

- Cause-specific title that describes the current state.
- One or two sentences explaining what changed or what will appear here.
- Primary recovery action such as Create, Clear filters, Retry, or Request access.
- Optional secondary guidance only when it helps the user choose a different path.

## States

- First use: no records exist yet; creation is primary.
- Search empty: query is visible and editing/clearing it is primary.
- Filter empty: active constraints are visible and reset is primary.
- Error empty: failure is named and Retry/manual fallback is available.
- Permission empty: access boundary and request/return path are explicit.

## Variants

- Inline table/list empty row for a scoped result set.
- Full-panel first-use state for a new workspace.
- Search recovery with related suggestions.
- Offline or failure state with retry and cached-content fallback.

## Code

```tsx
const COPY: Record<EmptyStateKind, { title: (query?: string) => string; body: string; action: string }> = {
  firstUse: { title: () => "No projects yet", body: "Create the first project for this workspace.", action: "Create project" },
  search: { title: (query) => `No results for "${query}"`, body: "Try a broader term or clear the query.", action: "Clear search" },
  filtered: { title: () => "No matching records", body: "The current filters exclude every record.", action: "Clear filters" },
  error: { title: () => "Could not load records", body: "Your changes are safe. Try loading this view again.", action: "Retry" },
}

export function RecoverableEmptyState({ kind, query, onRecover }: RecoverableEmptyStateProps) {
  const copy = COPY[kind]

  return (
    <section className="grid min-h-64 place-items-center rounded-lg border bg-muted/30 p-8 text-center">
      <div className="max-w-md">
        <InboxIcon aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium text-foreground">{copy.title(query)}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.body}</p>
        <Button className="mt-6" type="button" onClick={onRecover}>
          {copy.action}
        </Button>
      </div>
    </section>
  )
}
```

## Checks

- The empty-state kind matches the actual cause; valid zero data is not mislabeled as an error.
- Search/filter states repeat the active query or constraint and make reset observable.
- Recovery action is real, enabled, and returns to the same task context.
- Illustration remains subordinate to the title and action and has no redundant accessible label.
- Retry failure remains visible with an alternate path rather than looping silently.

## Anti-patterns

- **One generic empty illustration**: first use, no results, permissions, and errors receive identical copy.
- **Dead-end apology**: the message explains absence but offers no recovery action.
- **Create action for filter emptiness**: users add duplicate data instead of clearing a constraint.
- **Decorative takeover**: a large illustration pushes the cause and action below the viewport.

## Agent notes

- prompt_phrases: "cause-specific empty state with a working recovery action", "filtered results empty state that exposes and clears constraints"
- fallbacks: use a compact inline row when only a table subsection is empty.
- canonical guidance: `docs/design-system/principles.md` principles 1, 4, and 5.
