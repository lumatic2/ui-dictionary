---
id: topbar-command-search
name: "Topbar Command Search"
pattern_group: navigation
kind: block
status: draft
surface_refs: [websites, saas-dashboards]
tokens_used:
  - color.semantic.surface.overlay
  - color.semantic.border.focus
  - color.semantic.text.muted
  - color.semantic.surface.muted
  - dimension.radius.lg
  - dimension.radius.xl
  - typography.scale.sm
code_asset: examples/ui-vocabulary-site/src/components/topbar-search.tsx
component_refs: [popover]
term_refs: [command-palette, autocomplete]
source_refs: [tailwind-plus-application-ui]
last_verified: 2026-07-07
---

## Intent

A collapsed topbar icon that expands into a full-width search input with a live suggestion popover underneath it. It gives a site or app header a lightweight, command-palette-adjacent entry point without the modal weight of a full command palette (`command-palette`): the field lives inline in the topbar, expands in place, and collapses back to an icon when the user is done. Suggestions blend two behaviors from the vocabulary — starter shortcuts (`group`/`category` suggestions shown before typing) and typed autocomplete (`autocomplete`) ranked as the user types.

## Anatomy

- Root container: fixed-width wrapper that animates `width` between a collapsed icon-button size and an expanded input size (`transition-[width]`, respects `motion-reduce`).
- Collapsed state: icon-only button (`Search` icon + optional `Ctrl F` hint label on desktop).
- Expanded state: leading search icon, text input, trailing close (`X`) button.
- `Popover` (Radix) anchored to the input via `PopoverAnchor`, with `PopoverContent` rendering a scrollable suggestion list below.
- Each suggestion row: leading `Search` icon, label + description stack, trailing `ArrowRight` icon; highlighted row uses `bg-secondary`.
- Section label above the list switches between "바로 찾기" (starter suggestions, empty query) and "추천 결과" (typed results).

## States

- **Closed / collapsed**: `expanded === false`. Only the icon button renders; clicking it sets `expanded = true`, which focuses the input on a short delay (`window.setTimeout(..., 40)`) so the width transition finishes first.
- **Open, empty query**: `expanded === true` and `draftQuery` is empty. `suggestions` falls back to a fixed `topbarStarterSuggestions` list (site sections such as Hero Sections, Footers, Application Shells). The popover is open (`open = expanded && suggestions.length > 0`) as long as this fallback list is non-empty, so an empty-query state always has content — there is no true "no results" state at the empty-query step.
- **Open, typed query**: `getSearchSuggestions` computes up to 8 ranked matches from `terms` against `draftQuery` and the active `filter`. If a typed query yields zero suggestions, `suggestions.length === 0` forces `open` to `false` — the popover disappears entirely rather than showing an explicit empty state.
- **Keyboard navigation** (`handleKeyDown`, bound to the input's `onKeyDown`):
  - `ArrowDown` / `ArrowUp`: move `activeIndex` forward/backward through `suggestions` with wraparound (`(current + 1) % suggestions.length`), `preventDefault()`'d so the caret doesn't move.
  - `Enter`: commits the currently active suggestion (`selectSuggestion(suggestions[activeIndex])`) if one exists, otherwise commits the raw typed query (`commitQuery()`).
  - `Escape`: calls `collapse()` — closes the popover, resets `activeIndex` to 0, and re-collapses the topbar to icon width via `onExpandedChange(false)`.
  - Mouse `onMouseEnter` on a row also sets `activeIndex`, so hover and keyboard arrows share the same highlight state.
- **Outside pointerdown**: a `document` listener collapses the field whenever a pointerdown lands outside the root container while expanded (checked via `rootRef.current?.contains(target)`).
- **Selecting a suggestion**: `category`/`group` suggestions call `onFilterChange` and clear the query; term suggestions commit the suggestion's `value` as the query. Either path calls `collapse()` afterward.
- **Focus behavior on the popover itself**: `onOpenAutoFocus` and `onCloseAutoFocus` both call `preventDefault()` — focus is deliberately kept on the input, never stolen by the popover content.

## Variants

- Desktop shows a `Ctrl F` hint label next to the collapsed icon (`hidden md:inline`); mobile hides it.
- Expanded width differs by breakpoint: `w-[calc(100vw-2rem)]` on mobile vs. fixed `md:w-[22rem]` on desktop, so the field goes near-fullscreen on small viewports instead of overflowing.
- Popover content width is itself clamped (`w-[min(28rem,calc(100vw-2rem))]`) independent of the trigger width.

## Code

```tsx
function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.key === "ArrowDown" && suggestions.length > 0) {
    event.preventDefault()
    setActiveIndex((current) => (current + 1) % suggestions.length)
  }
  if (event.key === "ArrowUp" && suggestions.length > 0) {
    event.preventDefault()
    setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
  }
  if (event.key === "Enter") {
    event.preventDefault()
    const activeSuggestion = suggestions[activeIndex]
    if (activeSuggestion) {
      selectSuggestion(activeSuggestion)
    } else {
      commitQuery()
    }
  }
  if (event.key === "Escape") {
    collapse()
  }
}
```

```tsx
useEffect(() => {
  if (!expanded) {
    return
  }

  function closeOnOutsidePointer(event: PointerEvent) {
    const target = event.target as Node | null
    if (target && rootRef.current?.contains(target)) {
      return
    }

    collapse()
  }

  document.addEventListener("pointerdown", closeOnOutsidePointer)

  return () => {
    document.removeEventListener("pointerdown", closeOnOutsidePointer)
  }
}, [collapse, expanded])
```

Full implementation, including the starter suggestion list and popover markup, lives in `code_asset`. Suggestion ranking is delegated to `examples/ui-vocabulary-site/src/lib/search-suggestions.ts` (`getSearchSuggestions`), which this recipe treats as an implementation detail of the block, not part of its own contract.

## Checks

- Input has `aria-autocomplete="list"`, `aria-expanded={open}`, and an explicit `aria-label` (Korean copy in the current asset — localize per product).
- Collapsed and close buttons both have `aria-label` (검색 열기 / 검색 닫기); icons are `aria-hidden`.
- Active suggestion row is reachable and distinguishable by both keyboard (`activeIndex`) and mouse (`onMouseEnter`) — verify the highlighted state (`bg-secondary`) has sufficient contrast against `hover:bg-muted` rows.
- Confirm the outside-pointerdown collapse does not fire when clicking inside the popover (popover is inside `rootRef` via anchor, but verify after any DOM restructuring).
- Confirm `Escape` collapses even when focus is inside the popover list, not just the input.
- Motion: width transition must respect `motion-reduce:transition-none`.

## Anti-patterns

- **No keyboard path, mouse-only rows**: rendering suggestion rows as plain `<div onClick>` instead of tracking an `activeIndex` reachable via `ArrowUp`/`ArrowDown` and committed via `Enter`. AI-generated search overlays frequently wire only `onClick`, which strands keyboard users and violates the command-palette expectation this pattern borrows from.
- **No empty-results state for typed queries**: silently closing the popover when `suggestions.length === 0` (as this asset does) is acceptable only if the input itself signals "no matches" some other way (e.g. inline text). A common AI mistake is to leave zero-result typing completely silent with no feedback that the query is being processed or matched at all — always give the user *some* observable response to a search with no hits.
- **Autofocus stealing on open**: letting the popover's default `onOpenAutoFocus` run moves focus off the input onto the first list item, breaking normal typing. This pattern must explicitly `preventDefault()` both `onOpenAutoFocus` and `onCloseAutoFocus`, or typed input gets interrupted the moment suggestions appear.
- **Outside-click without outside-focus handling**: only listening for `pointerdown` to collapse the field ignores keyboard-only users tabbing away from the component (e.g. Shift+Tab out of the input). A robust version should also collapse on blur when focus moves outside `rootRef`, not just on pointer events.

## Agent notes

- `prompt_phrases`: "topbar 검색창에 자동완성 붙여줘", "헤더 검색 아이콘 눌렀을 때 커맨드 팔레트처럼 확장되게 해줘", "검색 결과 없을 때 화면 처리도 해줘"
- Fallback: if the host app has no `terms`-shaped dataset to rank against, keep the starter-suggestion fallback (`topbarStarterSuggestions`-equivalent) so the popover never opens empty; wire the ranking function later without changing the keyboard/state contract above.
- If the product needs a true modal command palette (Cmd+K style, full-screen overlay, always-available global shortcut) rather than an inline topbar expand/collapse, use the `command-palette` term instead — this recipe assumes an anchored, dismissible, topbar-local field, not a global overlay.
