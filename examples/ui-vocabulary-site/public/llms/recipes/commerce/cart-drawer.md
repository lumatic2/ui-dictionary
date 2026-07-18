---
id: cart-drawer
name: "Cart Drawer"
pattern_group: commerce
kind: block
status: draft
surface_refs: [commerce, websites, saas-dashboards]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.overlay
  - color.semantic.surface.muted
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - color.semantic.action.destructive
  - dimension.space.2
  - dimension.space.4
  - dimension.space.8
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/cart-drawer.tsx
component_refs: [popover, button]
term_refs: [cart-summary, cart-summary-bar, quantity-stepper]
source_refs: [tailwind-plus-ecommerce]
last_verified: 2026-07-12
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/cart-drawer.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A cart drawer keeps the browsing context intact while confirming what a user has added. It opens as a slide-over panel, shows each item with enough detail to double-check the choice, and moves the user toward checkout without a full page navigation. It intentionally shows only a subtotal — a full cost breakdown belongs to `checkout-order-summary`.

## Anatomy

- Trigger: a cart icon or button anywhere in the shell that opens the drawer without leaving the current page.
- Panel: a slide-over surface anchored to one edge (right on desktop/mobile by default), with a scrim behind it.
- Item rows: thumbnail, title, variant, per-item quantity control, remove action, and line price.
- Subtotal: sum of visible line items only — no shipping/tax estimate here.
- Primary action: a checkout button that repeats the subtotal.
- Secondary action: a continue-shopping affordance that closes the drawer without discarding the cart.
- Empty state: a message plus continue-shopping action when there are no items.

## States

- Empty: no items, subtotal hidden, only the continue-shopping action shown.
- Populated: one or more items, subtotal and checkout action visible.
- Quantity at minimum: decrease control disabled at quantity 1 rather than allowing an accidental removal via stepping to zero.
- Item removed: row leaves the list and subtotal recalculates immediately.
- Open/closed: panel slides in from the edge and returns focus to the trigger on close (inherited from the underlying overlay primitive).

## Variants

- Right-edge slide-over (default) for desktop and tablet.
- Bottom-edge variant for narrow mobile viewports where a right-edge panel would feel cramped.
- Free/zero-item variant that still renders the empty state rather than an empty list with a $0.00 subtotal.

## Code

```tsx
export function CartDrawer({ open, items, currency = "USD", trigger, onOpenChange, onQuantityChange, onRemove, onCheckout, onContinueShopping }: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isEmpty = items.length === 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent aria-describedby={undefined} className="w-full sm:max-w-md">
        <SheetHeader><SheetTitle>Your cart</SheetTitle></SheetHeader>
        {isEmpty ? (
          <EmptyCart onContinueShopping={onContinueShopping} />
        ) : (
          <CartItemList items={items} currency={currency} onQuantityChange={onQuantityChange} onRemove={onRemove} />
        )}
        {!isEmpty ? (
          <SheetFooter className="gap-3 border-t">
            <SubtotalRow subtotal={subtotal} currency={currency} />
            <Button className="w-full" onClick={onCheckout}>Checkout · {formatMoney(subtotal, currency)}</Button>
            <Button className="w-full" variant="ghost" onClick={onContinueShopping}>Continue shopping</Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/cart-drawer.tsx`. Built on the `Sheet` overlay primitive (`examples/ui-vocabulary-site/src/components/ui/sheet.tsx`) the same way `topbar-search.tsx` builds on `popover`.

## Checks

- Trigger opens the drawer without a route change; the underlying grid/page stays mounted.
- Subtotal only sums visible line items — it never silently includes shipping or tax.
- Decreasing quantity below 1 is blocked by the control, not by allowing 0 and hiding the row.
- Removing the last item shows the empty state, not an empty list with a stale subtotal.
- Closing the drawer (checkout, continue shopping, scrim click, Escape) returns focus to the trigger.

## Anti-patterns

- **Hidden fees in the drawer**: showing a total that already includes shipping/tax invites a mismatch with the real checkout total — keep the drawer to a subtotal only.
- **Silent quantity-to-zero removal**: letting the stepper go to 0 and disappear the row without an explicit remove action surprises users who meant to just lower the count.
- **Drawer as full checkout**: cramming address/payment fields into the drawer defeats its purpose as a fast confirm-and-continue surface; route to checkout instead.
- **Stale subtotal**: updating item quantity or removing an item without recalculating the visible subtotal in the same render.

## Agent notes

- prompt_phrases: "장바구니 아이콘을 누르면 오른쪽에서 열리는 cart drawer를 만들어줘", "수량 조절과 삭제, subtotal, checkout 버튼이 있는 슬라이드형 장바구니를 넣어줘"
- fallbacks: if the overlay primitive library lacks a side-anchored sheet, a `dialog` positioned flush to one edge with a manual slide transition is an acceptable substitute — do not fall back to a full-page cart for this recipe's use case.
- component composition: reuses the same overlay-primitive relationship documented in `recipes/overlays/popover.md`'s Agent notes — assemble from the existing overlay primitive rather than re-implementing open/close/dismiss/focus-return logic.
