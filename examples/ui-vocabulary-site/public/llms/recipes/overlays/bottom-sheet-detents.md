---
id: bottom-sheet-detents
name: "Bottom Sheet Detents"
pattern_group: overlays
kind: block
status: draft
surface_refs: [mobile-apps]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.radius.xl
code_asset: examples/ui-vocabulary-site/src/components/bottom-sheet-detents.tsx
component_refs: []
term_refs: [mobile-bottom-sheet, standard-bottom-sheet, modal-bottom-sheet]
source_refs: [material-m3-components]
last_verified: 2026-07-12
---

## Intent

A bottom sheet that carries two collapsed/expanded height presets ("detents") toggled from a drag handle, and can run in either of two structural modes: `standard-bottom-sheet` (no scrim — the screen behind stays visible and interactive) or `modal-bottom-sheet` (a scrim blocks the background until the sheet is dismissed). Both existing vocabulary terms describe one of these modes each; this recipe is the single component contract that implements both, selected via a `variant` prop, so a product doesn't need two separate implementations for what is the same detent-cycling shell.

## Anatomy

- Root: `absolute inset-0` layer scoped to the screen's viewport (not the whole page), so the sheet stays inside the device frame/screen bounds rather than portaling to the document body.
- Scrim (`modal` variant only): full-bleed tappable layer behind the sheet; tapping it dismisses the sheet. Omitted entirely in `standard` variant.
- Sheet surface: `rounded-t-2xl` panel pinned to the bottom, height driven by the current detent.
- Drag handle: a small pill button at the top of the sheet. Doubles as the visual affordance and the tap target that cycles detents — required because not every dismiss/resize input is a drag gesture.
- Content: scrollable body below the handle.

## States

- **Closed**: sheet not rendered (`open === false`).
- **Open, collapsed**: `detent === "collapsed"`, sheet occupies a smaller height (45% of viewport in the code asset).
- **Open, expanded**: `detent === "expanded"`, sheet occupies a larger height (85%).
- **Standard variant**: no scrim rendered; background content stays visually present and (in a real screen) interactive.
- **Modal variant**: scrim rendered (`bg-black/50`), `aria-modal="true"` on the sheet's `role="dialog"`, background interaction is blocked until dismissed.

## Variants

- `variant="standard"` — non-blocking, coexists with the current screen (e.g. a map filter panel).
- `variant="modal"` — blocking, used for a decision the user must resolve before continuing (e.g. a short confirmation or option picker).
- On desktop/wide viewports, the vocabulary recommends a side sheet instead of a bottom sheet — this recipe is mobile-viewport-scoped and does not implement that fallback itself.

## Code

```tsx
function cycleDetent() {
  onDetentChange(detent === "collapsed" ? "expanded" : "collapsed")
}

return (
  <div className="absolute inset-0 z-10">
    {variant === "modal" ? (
      <button
        type="button"
        aria-label="Dismiss sheet"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
    ) : null}

    <div
      role="dialog"
      aria-modal={variant === "modal"}
      className={cn(
        "absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t bg-background shadow-xl transition-[height] duration-200",
        detent === "expanded" ? "h-[85%]" : "h-[45%]"
      )}
    >
      <button type="button" onClick={cycleDetent} aria-label={detent === "collapsed" ? "Expand sheet" : "Collapse sheet"}>
        <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />
      </button>
      {/* content */}
    </div>
  </div>
)
```

Full component, including the standard/modal open triggers and the colocated `BottomSheetDetentsDemo` (rendered inside `DeviceFrame`), lives in `code_asset`.

## Checks

- Drag handle has an `aria-label` that reflects the next action ("Expand sheet" / "Collapse sheet"), not just a decorative pill.
- At least one non-drag way to change detent exists (here: tapping the handle) — do not ship a version where the only way to expand/collapse is a physical drag gesture.
- `modal` variant sets `aria-modal="true"` and provides a way to dismiss without a drag (scrim tap here; also wire `Escape` if adapting to a real dialog primitive).
- `standard` variant must not render a scrim — verify background rows remain visually present and are not obscured.
- Detent height transition respects `motion-reduce` if adapted to use CSS transitions beyond the current `transition-[height]`.

## Anti-patterns

- **Modal without a non-scrim-tap dismiss path**: if adapting this into a real dialog/portal implementation, don't rely on scrim-tap alone — keyboard/assistive-tech users need `Escape` or an explicit close control too.
- **Standard variant with a scrim**: adding a scrim to the `standard` variant turns it into a modal sheet in disguise and blocks background interaction the term explicitly says should stay available.
- **Drag-only detent control**: implementing detent cycling purely via `pointermove`/drag tracking with no tap/keyboard alternative strands VoiceOver and switch-control users — the handle must remain a real, labeled button.
- **Full-page portal escaping the screen bounds**: portaling the sheet to `document.body` (as a generic dialog primitive would) breaks the "sheet is scoped to this screen" contract used in a device-framed mobile context; keep it `absolute` within the screen's own relatively-positioned container.

## Agent notes

- `prompt_phrases`: "필터를 누르면 bottom sheet가 올라오게 해줘", "배경을 어둡게 깔고 아래에서 modal bottom sheet가 올라오게 해줘", "드래그 핸들로 시트 높이를 늘렸다 줄였다 하게 해줘"
- If the product needs the screen behind to stay interactive (e.g. a map with a filter/detail panel), use `variant="standard"`. If it needs to force a decision before continuing, use `variant="modal"`.
- On a wide/desktop layout, prefer a side sheet over stretching this component — this recipe does not include that responsive fallback.
- Fallback: if a proper drag/pointer-tracking library is unavailable, tap-to-cycle (as implemented) is an acceptable baseline as long as it remains the case that at least one non-drag path exists — do not regress to drag-only.
