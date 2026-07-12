---
id: large-title-collapsing-header
name: "Large Title Collapsing Header"
pattern_group: navigation
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.text.default
  - color.semantic.surface.base
  - color.semantic.border.default
code_asset: examples/ui-vocabulary-site/src/components/large-title-collapsing-header.tsx
component_refs: []
term_refs: [large-title-header, top-app-bar]
source_refs: [material-m3-components]
last_verified: 2026-07-12
---

## Intent

`large-title-header` names the visual states (big title / collapsed) but not the transition contract. This recipe fixes the scroll-driven large→small compression itself: the exact threshold behavior, the back button staying a separate always-present tap target distinct from the title transform, and the compact header filling in a background once collapsed so it visually separates from the scrolling content beneath it.

## Anatomy

- Large title text row: the screen's title rendered at a large type scale, left-aligned above the content.
- Safe-area-top inset: the header sits above the device's safe area, not overlapping it.
- Back-button leading: a fixed 44×44+ tap target, always present regardless of collapse state — never removed or resized during the transition.
- Scroll-driven compress transition: a `sticky` header whose title size and background opacity respond to the list's scroll offset, not to any tap/drag gesture on the header itself.
- Compact header post-collapse: once past the threshold, the header gains a bottom border and background fill so it reads as a distinct bar from the content scrolling underneath it.

## States

- **Expanded**: `scrollTop <= COLLAPSE_THRESHOLD_PX`. Title renders at the large type scale, header background and border are transparent (title appears to sit directly on the content).
- **Compact**: `scrollTop > COLLAPSE_THRESHOLD_PX`. Title shrinks to the compact type scale, header gains a background fill and bottom border.
- **Screen-reader active**: the header must not auto-hide on scroll direction the way a `top-app-bar` show/hide bar might — the title-collapse transform stays, but a hide-on-scroll behavior (if added) must be suppressed per the accessibility exception both terms already document.

## Variants

- Passive scroll-linked transform only — the header itself is not a tap or drag target for the compression; only the back button is interactive.
- This recipe implements title-collapse only; it does not implement the separate scroll-direction show/hide behavior described on `top-app-bar` — combine the two only if the product actually needs both.

## Code

```tsx
<div
  className={cn(
    "sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b px-4 transition-colors",
    isCompact ? "border-border bg-background py-3" : "border-transparent bg-background pb-3 pt-1"
  )}
>
  <button type="button" aria-label="Back" className="flex size-11 shrink-0 items-center justify-center rounded-full">
    <ChevronLeftIcon className="size-5" aria-hidden="true" />
  </button>
  <p className={cn("font-semibold transition-all", isCompact ? "text-base" : "text-2xl")}>Inbox</p>
</div>
```

Full scroll-offset tracking and the colocated `LargeTitleCollapsingHeaderDemo` (rendered inside `DeviceFrame`) live in `code_asset`.

## Checks

- Back button stays a constant 44×44+ tap target at every scroll position — it must never shrink alongside the title.
- Title type scale and header background transition only in response to scroll offset, not to any header tap/drag.
- Compact state visually separates the header from content (border/background fill) so users can tell where the fixed header ends and scrollable content begins.
- Verify no auto-hide-on-scroll behavior is added without the screen-reader-active exception carried over from `top-app-bar`.

## Anti-patterns

- **Back button changing size/position across states**: shrinking or moving the back button as part of the title-collapse animation breaks a fixed, predictable tap target users rely on mid-scroll.
- **Conflating back with sheet dismiss**: reusing this back button to dismiss a bottom sheet or modal (instead of stack navigation) contradicts `large-title-header`'s own distinction between the two actions.
- **Header opaque at all times**: skipping the expanded/transparent state and always rendering the compact background fill loses the "large presence at the top of a screen" effect the term is named for.
- **Auto-hiding this header on scroll direction without the accessibility exception**: if a hide-on-scroll behavior is layered on top, it must be suppressed when a screen reader is active — do not hide navigation controls from assistive tech users the same way as sighted scroll-based hiding.

## Agent notes

- `prompt_phrases`: "화면 상단에 스크롤하면 접히는 large title header를 넣어줘", "뒤로가기 버튼은 스크롤 상태와 무관하게 항상 같은 크기로 유지해줘", "접힌 뒤에는 헤더 배경을 채워서 콘텐츠와 분리해줘"
- If the product also needs the bar to hide on scroll-down and reappear on scroll-up (not just shrink), combine with `top-app-bar`'s show/hide rule rather than adding that behavior here.
- Fallback: if a spring-animation library isn't available, a CSS `transition` on font-size/background (as implemented) is an acceptable baseline — do not skip the transition entirely and snap instantly between states.
