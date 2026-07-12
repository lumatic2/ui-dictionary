---
id: bottom-tab-bar
name: "Bottom Tab Bar"
pattern_group: navigation
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.destructive
code_asset: examples/ui-vocabulary-site/src/components/bottom-tab-bar.tsx
component_refs: []
term_refs: [tab-bar]
source_refs: [apple-hig-components]
last_verified: 2026-07-12
---

## Intent

A persistent bar fixed to the bottom of a mobile screen that switches between the app's top-level, equally-important destinations (`tab-bar` in the vocabulary). Unlike `mobile-segmented-tabs`, which switches views inside one screen, this bar changes the whole destination — home, search, activity, profile — and stays visible across all of them.

## Anatomy

- Bar container: full-width row, fixed to the bottom of the screen, sitting above the device's safe-area inset.
- One button per destination (3-5 total): icon + a short 1-2 word label, always shown together — never icon-only.
- Active indicator: the active tab's icon switches from outlined to filled and its text/icon color shifts from muted to full-emphasis foreground.
- Optional badge: a small filled circle with a count, reserved for critical/actionable info (unread count), not decorative.

## States

- **Inactive tab**: outlined icon, muted label/icon color (`text-muted-foreground`).
- **Active tab**: filled icon (`fill="currentColor"`), full-emphasis color (`text-foreground`), `aria-current="page"` and `aria-selected="true"` for the current destination.
- **Badge present**: rendered as a small absolutely-positioned circle on the icon; paired with visually-hidden text (`sr-only`, e.g. "3 unread") so the count isn't screen-reader-silent.
- **Tap**: `onTabChange` fires immediately on click/tap — there is no drag or swipe state; switching between destinations is tap-only.

## Variants

- Destination count: keep to 3-5 (HIG). More than that should trigger an information-architecture review (move less-used destinations into a `More` screen or reconsider grouping) rather than reflowing the bar to fit extra tabs.
- Trailing accessory (not implemented in the code asset): platforms like iOS allow a minimize-on-scroll trailing element (e.g. a mini player) docked beside the tab bar; treat that as a separate composed element, not a tab.

## Code

```tsx
<button
  type="button"
  role="tab"
  aria-selected={isActive}
  aria-current={isActive ? "page" : undefined}
  onClick={() => onTabChange(tab.id)}
  className={cn(
    "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors",
    isActive ? "text-foreground" : "text-muted-foreground"
  )}
>
  <span className="relative">
    <Icon className="size-5" fill={isActive ? "currentColor" : "none"} aria-hidden="true" />
    {tab.badgeCount ? (
      <span
        aria-hidden="true"
        className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-semibold text-white"
      >
        {tab.badgeCount}
      </span>
    ) : null}
  </span>
  <span>{tab.label}</span>
</button>
```

Full tab list, layout, and the colocated `BottomTabBarDemo` (rendered inside `DeviceFrame`) live in `code_asset`.

## Checks

- Every tab has both an icon and a visible text label — never ship icon-only tabs.
- Active tab is distinguishable by more than color alone (filled vs outlined icon), so it still reads correctly for color-blind users.
- Badge count has an `sr-only` text equivalent; the badge itself is `aria-hidden`.
- `role="tab"` + `aria-selected`/`aria-current` are present so assistive tech announces the current destination.
- Bar respects the bottom safe-area inset on real devices (see `safe-area` term) so it doesn't collide with the home indicator.

## Anti-patterns

- **Icon-only tabs**: dropping the label to save space breaks HIG guidance and hurts discoverability — always pair icon + label.
- **Using tabs for view-mode switching**: wiring this bar to swap sort/filter modes within the same screen instead of switching top-level destinations conflates it with `mobile-segmented-tabs` — keep tab bar reserved for destination switching only.
- **Overflowing past 5 destinations**: adding a 6th+ tab instead of restructuring the IA (e.g. a `More` screen or moving a destination into settings) makes the bar cramped and harder to scan.
- **Swipe-to-switch destinations**: allowing a horizontal swipe on the screen body to change the active tab (instead of requiring an explicit tap on the bar) contradicts the "tabs switch only by tapping" rule this recipe encodes.

## Agent notes

- `prompt_phrases`: "하단에 tab bar를 넣고 홈 검색 설정 탭을 보여줘", "선택된 탭은 아이콘과 라벨을 강조해줘", "활동 탭에 안 읽은 알림 뱃지를 표시해줘"
- If the request needs same-screen view switching (not top-level destination switching), use `mobile-segmented-tabs` instead of adding more tabs here.
- If destinations exceed 5 or the app also runs on a wide/tablet layout, consider `adaptive-split-view` (sidebar-convertible) rather than cramming more tabs into this bar.
- Fallback: if no icon set matches the destination set, keep labels mandatory and use any consistent icon set — the label is the accessibility floor, not the icon choice.
