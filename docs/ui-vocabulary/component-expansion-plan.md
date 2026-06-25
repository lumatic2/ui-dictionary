# UI Vocabulary Component Expansion Plan

Purpose: expand `docs/ui-vocabulary/terms.yml` without turning the glossary into a random component dump. New terms should help users name a visible UI element, recognize its shape, and ask an AI agent for it precisely.

## Current Baseline

- Source of truth: `docs/ui-vocabulary/terms.yml`
- Current count: 177 terms
- Website renderer: `examples/ui-vocabulary-site/src/components/term-visual.tsx`
- Visual policy: every published term needs a recognizable mini mock. Interactive terms should expose a small local state change when clicked, typed into, opened, dismissed, or selected.

## Acceptance For New Terms

Add a term when all conditions are true:

- It has a stable English name used by at least one Tier A or Tier B source in `sources.md`.
- Korean users are likely to need the word while prompting an AI or discussing UI.
- It has a distinct visible shape, interaction, or layout role.
- It is not only a style variant of an existing term.
- It can be rendered as a mini mock without external screenshots.

Prefer `related` comparison notes over duplicate entries when the difference is subtle.

## Batch A — Add Next

These should be the next dataset expansion because they are common in product UI and easy to recognize visually.

### Promoted In 2026-06-26 Batch

- `textarea-autosize`
- `input-group`
- `date-range-picker`
- `time-picker`
- `rating-input`
- `tag-input`
- `masked-input`
- `toggle-group`
- `navigation-drawer`
- `mega-menu`
- `context-menu`
- `loading-button`
- `copy-field`
- `bulk-action-bar`
- `speed-dial`
- `app-shell`
- `split-pane`
- `snackbar`
- `undo-toast`
- `row-selection`

### Promoted In 2026-06-26 Step 6

- `search-view`
- `tree-navigation`
- `side-sheet`
- `breadcrumbs-menu`
- `icon-toggle-button`
- `resizable-panel`
- `master-detail`
- `sticky-header`
- `sticky-footer-bar`
- `sidebar-section`
- `inline-alert`
- `error-boundary`
- `confirmation-dialog`
- `rate-limit-state`
- `data-table-toolbar`
- `column-header-menu`
- `faceted-filter`
- `stat-list`
- `activity-feed`
- `map-marker`
- `scrubber`
- `range-slider`
- `multi-select`
- `transfer-list`
- `virtualized-list`
- `infinite-scroll`
- `pull-to-refresh`
- `swipe-action`
- `wizard`
- `toast-stack`
- `skeleton-table`

### Promoted In 2026-06-26 Step 7

- `empty-table`
- `table-density-control`
- `column-visibility-menu`
- `saved-view-tabs`
- `filter-panel`
- `advanced-filter-builder`
- `query-builder`
- `grouped-list`
- `nested-list`
- `draggable-list`
- `reorder-handle`
- `selection-summary`
- `comparison-table`
- `pivot-table`
- `tree-table`
- `expandable-row`
- `detail-row`
- `audit-log`
- `workspace-switcher`
- `account-switcher`

### Inputs

- `textarea-autosize`: textarea that grows with content.
- `input-group`: input with leading/trailing addon.
- `search-view`: full search surface with suggestions/results.
- `date-range-picker`: paired start/end date selector.
- `time-picker`: clock or time list selector.
- `rating-input`: star rating selector.
- `tag-input`: multiple tags entered inside one field.
- `masked-input`: formatted phone/card/date input.

### Selection And Navigation

- `toggle-group`: multiple toggle buttons in a group.
- `navigation-drawer`: app-level drawer navigation.
- `mega-menu`: large multi-column menu.
- `context-menu`: right-click or long-press command menu.
- `tree-navigation`: navigational tree, separate from generic tree view.
- `side-sheet`: side panel variant used for secondary tasks.
- `breadcrumbs-menu`: breadcrumb item that opens sibling paths.

### Actions

- `loading-button`: button with spinner/progress state.
- `icon-toggle-button`: icon button with pressed state.
- `copy-field`: read-only value plus copy action.
- `bulk-action-bar`: appears when table rows are selected.
- `speed-dial`: floating action button that expands multiple actions.

### Structure

- `app-shell`: header/sidebar/content layout frame.
- `split-pane`: resizable two-pane layout.
- `resizable-panel`: draggable panel layout.
- `master-detail`: list plus detail panel pattern.
- `sticky-header`: header fixed while content scrolls.
- `sticky-footer-bar`: bottom action bar.
- `sidebar-section`: grouped sidebar navigation section.

### Feedback And State

- `snackbar`: brief bottom notification, compare with toast.
- `inline-alert`: alert embedded inside a form or section.
- `error-boundary`: fallback UI for crashed content.
- `confirmation-dialog`: dialog dedicated to dangerous decisions.
- `undo-toast`: toast with an undo action.
- `rate-limit-state`: temporary blocked state with retry time.

### Data Display

- `data-table-toolbar`: table search/filter/action toolbar.
- `row-selection`: checkbox row selection pattern.
- `column-header-menu`: table column sort/filter menu.
- `faceted-filter`: multi-value filter group.
- `stat-list`: compact metric rows.
- `activity-feed`: chronological event list with actor/action.
- `map-marker`: marker/pin on map-like surface.

## Batch B — Add After Review

These are useful but need clearer boundaries or better source comparison first.

- `scrubber`: timeline/media drag control.
- `range-slider`: two-thumb range selector.
- `multi-select`: select with multiple selected chips.
- `transfer-list`: move items between two lists.
- `virtualized-list`: large list rendering pattern.
- `infinite-scroll`: loading more items on scroll.
- `pull-to-refresh`: mobile refresh gesture.
- `swipe-action`: mobile list item swipe command.
- `wizard`: multi-step task flow, compare with stepper.
- `split-view`: platform-specific master/detail naming.
- `toast-stack`: stacked transient notifications.
- `skeleton-table`: table-specific skeleton state.

## Deferred

Do not add these until the site supports richer teaching pages:

- Gesture-only patterns that are hard to show in a static card.
- Animation-only patterns such as shared element transition.
- Highly platform-specific native controls unless they are common in web/product prompting.
- Full page templates such as dashboard, pricing page, landing page, CRM detail page. These belong in cookbook or screen pattern docs, not the component glossary.

## Implementation Order

1. Add 20-30 Batch A terms to `terms.yml`.
2. Run `npm run build` in `examples/ui-vocabulary-site` to regenerate `terms.generated.ts`.
3. Add `asset.variant` handlers in `term-visual.tsx`.
4. Ensure every new interactive visual has at least one visible state transition.
5. Add `related` comparisons for overlapping terms.
6. Smoke test search aliases in Korean and English.

## Visual Interaction Rules

- If it opens, provide an open/closed state.
- If it selects, show the selected item.
- If it edits, allow text or number changes.
- If it loads, allow loading/done transition.
- If it warns or notifies, allow dismiss/restore.
- If it navigates, show an active destination.
- If it displays data, allow row/cell/series selection.
