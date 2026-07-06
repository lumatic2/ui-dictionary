---
id: popover
name: "Popover"
pattern_group: overlays
kind: component
status: draft
surface_refs: [websites, saas-dashboards, mobile-apps]
tokens_used:
  - color.semantic.surface.overlay
  - color.semantic.border.default
  - color.semantic.border.focus
  - color.semantic.text.default
  - color.semantic.text.muted
  - dimension.radius.md
  - dimension.space.2
code_asset: examples/ui-vocabulary-site/src/components/ui/popover.tsx
component_refs: []
term_refs: [popover, popover-form, dropdown-menu, tooltip, dialog]
source_refs: [radix-ui-primitives]
last_verified: 2026-07-07
---

## Intent

A small floating panel anchored to a trigger, used for compact interactive content (a form field, a date picker, a short settings block) that does not need the modal weight of a `dialog` or the pure-text weight of a `tooltip`.

This recipe is a **composition atom**, not a standalone page pattern. It is consumed by higher-order recipes — for example `topbar-command-search` uses this popover as its floating suggestion surface via `PopoverAnchor` + `PopoverContent` around an input. When another recipe lists `component_refs: [popover, ...]`, it means "assemble your overlay behavior from this recipe" rather than duplicating open/close/dismiss logic.

## Anatomy

- **Trigger** — the element the popover is anchored to (`PopoverTrigger` or `PopoverAnchor` when the visual anchor differs from the interactive control, e.g. an input field).
- **Floating panel** — `PopoverContent`, portaled, positioned relative to the trigger with `align`/`sideOffset`.
- **Content** — free-form (form fields, list, `PopoverHeader`/`PopoverTitle`/`PopoverDescription` for structured copy).
- **Optional arrow** — not implemented in the current code asset; add via Radix `Popover.Arrow` only if the design calls for it.

## States

- **closed** — panel unmounted (portal not rendered); trigger visible and focusable.
- **open** — panel mounted, positioned, `data-state="open"` drives the fade/zoom-in animation classes.
- **focus-within** — focus lives inside the panel (e.g. a form field); the panel must not close while focus moves between its own children.
- **dismiss** — triggered by `Escape`, an outside pointer/click, or explicit close action. On dismiss, focus must return to the trigger (Radix handles this by default — do not override `onCloseAutoFocus` without re-implementing the focus return).

## Variants

- **Anchor-decoupled trigger** — `PopoverAnchor` wraps a different element than the interactive control that opens the popover (see `topbar-search.tsx`: the anchor is the search input container, not a dedicated button).
- **Structured content** — `PopoverHeader` + `PopoverTitle` + `PopoverDescription` for a short label/description block instead of raw children.
- **Controlled open state** — pass `open`/`onOpenChange` to drive visibility from external state (e.g. only open when there are suggestions), rather than relying on uncontrolled trigger clicks.

## Code

```tsx
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}
```

`bg-popover` / `text-popover-foreground` / `border` map to `color.semantic.surface.overlay`, `color.semantic.text.default`, `color.semantic.border.default` at the Tailwind theme layer — do not hardcode hex when composing new popover content.

## Checks

- Panel is portaled (not clipped by an `overflow-hidden` ancestor).
- `Escape` and outside pointerdown both close the panel; verify with keyboard-only navigation.
- Closing returns focus to the trigger element (tab order resumes where the user left off).
- Panel repositions/flips when the trigger is near a viewport edge (Radix `Popper` collision handling — do not disable it).
- Panel does not trap focus like a modal; background content stays operable unless the composing recipe explicitly needs modal behavior (in which case use `dialog`, not `popover`).

## Anti-patterns

- **No focus return on dismiss** — overriding `onCloseAutoFocus`/`onOpenAutoFocus` (as `topbar-search.tsx` does for a specific UX reason) without re-implementing focus return elsewhere leaves keyboard users stranded. Only suppress autofocus when the surrounding component manages focus itself.
- **Scroll-lock overreach** — locking `document.body` scroll for a popover (copying `dialog`/`drawer` behavior) is unnecessary weight; a popover is non-modal and background content should stay scrollable and interactive.
- **Unhandled viewport overflow** — hardcoding `align`/`side` without letting Radix's collision detection flip the panel causes it to render off-screen on small viewports or near edges; do not disable collision padding.
- **Using popover for content that needs a dialog** — stuffing a multi-step form or a destructive confirmation into a popover because "it's already wired up" ignores the `anti_use` guidance in `terms.yml` (`popover`): long or high-stakes content belongs in `dialog`.

## Agent notes

- `prompt_phrases`: "버튼을 누르면 작은 popover가 열리게 해줘", "날짜 선택기를 팝오버로 띄워줘", "필터 저장 버튼을 누르면 이름을 입력하는 popover form을 열어줘".
- If the request is a simple command list, prefer `dropdown-menu` over `popover` (see `terms.yml` `popover` → `related: dropdown-menu`).
- If the request is hover-only, short, non-interactive text, prefer `tooltip`.
- If the request needs a compact input/submit flow inside the floating panel, compose `popover` + a form (see `popover-form` term) rather than inventing a new overlay primitive.
- Fallback when Radix is unavailable: implement with native `popover` attribute / `anchor-name` CSS only if the target browser matrix supports it; otherwise keep Radix as the default dependency.
