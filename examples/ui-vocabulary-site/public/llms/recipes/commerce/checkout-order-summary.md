---
id: checkout-order-summary
name: "Checkout Order Summary"
pattern_group: commerce
kind: block
status: draft
surface_refs: [commerce, websites, mobile-apps]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
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
  - typography.scale.lg
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/checkout-order-summary.tsx
component_refs: [button]
term_refs: [cart-summary, checkout-step, checkout-progress-header, payment-method-card, order-status]
source_refs: [tailwind-plus-ecommerce]
last_verified: 2026-07-10
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/checkout-order-summary.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A checkout order summary keeps the exact purchase commitment visible while the user provides delivery and payment details. Products, quantities, discounts, shipping, tax, total, fulfillment method, and final action stay consistent across steps and remain editable before confirmation.

## Anatomy

- Progress context: named checkout step and a clear return path.
- Item summary: product identity, selected options, quantity, price, and edit/remove controls.
- Cost breakdown: subtotal, discounts, shipping, tax, and total with currency consistency.
- Fulfillment and payment facts: selected address/method with explicit change actions.
- Final action: verb names the consequence and is disabled until required facts are valid.

## States

- Incomplete details with field-level errors and preserved item summary.
- Recalculation after quantity, discount, shipping, or fulfillment changes.
- Submitting state that prevents duplicate confirmation while keeping the total visible.
- Payment failure with retry/change-method actions and no loss of entered details.
- Confirmed state with order status, reference, and next-step expectations.

## Variants

- Desktop split layout with sticky summary beside the form.
- Mobile linear flow with a collapsible but always reachable total.
- Pickup checkout with location/time facts instead of shipping address.
- Zero-charge or fully discounted order that still explains what will be authorized.

## Code

```tsx
export function CheckoutOrderSummary({ order, onConfirm, onEdit }: CheckoutOrderSummaryProps) {
  const total = order.subtotal - order.discount + order.shipping + order.tax
  const canConfirm = order.address != null && order.paymentMethod != null && !order.submitting

  return (
    <aside className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground" aria-labelledby="checkout-summary-title">
      <div className="flex items-center justify-between gap-4">
        <h2 id="checkout-summary-title" className="text-lg font-medium">
          Order summary
        </h2>
        <Button size="sm" type="button" variant="ghost" onClick={onEdit}>
          Edit cart
        </Button>
      </div>

      <ul className="mt-6 divide-y">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.option} · Qty {item.quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">{formatMoney(item.total, order.currency)}</p>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between border-t pt-3 text-base font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(total, order.currency)}</dd>
        </div>
      </dl>

      <Button className="mt-6 w-full" disabled={!canConfirm} type="button" onClick={onConfirm}>
        {order.submitting ? "Placing order" : `Place order · ${formatMoney(total, order.currency)}`}
      </Button>
    </aside>
  )
}
```

## Checks

- Total is derived from displayed line items and every adjustment uses one currency/rounding rule.
- Edit actions return to the relevant fact without clearing unrelated delivery or payment input.
- Final button names the consequence and repeats the committed total.
- Submitting blocks duplicate orders; failure preserves the cart and entered details.
- Mobile keeps total and confirmation reachable without hiding required terms or fees.
- Pickup, shipping, and zero-charge flows explain their distinct authorization/fulfillment behavior.

## Anti-patterns

- **Surprise total**: tax, shipping, or fees appear only after the confirmation action.
- **Detached summary**: line items change but the visible total remains stale.
- **Generic Continue button**: the final action does not distinguish navigation from placing an order.
- **Failure resets checkout**: a payment error clears address, fulfillment, or cart state.
- **Mobile summary trap**: collapsed totals hide fees and require an unclear gesture to review the commitment.

## Agent notes

- prompt_phrases: "checkout summary with editable facts, explicit fee breakdown, and duplicate-submit guard", "mobile order commitment with visible total and payment recovery"
- fallbacks: for a one-item free claim, keep a compact confirmation summary rather than removing the commitment step.
- canonical guidance: `docs/design-system/principles.md` principles 1, 4, 5, and 7.
