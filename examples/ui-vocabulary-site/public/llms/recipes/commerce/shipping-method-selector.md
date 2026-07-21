---
id: shipping-method-selector
name: "Shipping Method Selector"
pattern_group: commerce
kind: block
status: draft
surface_refs: [commerce, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.border.focus
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/shipping-method-selector.tsx
component_refs: []
term_refs: [checkout-step, checkout-progress-header, payment-method-card, cart-summary]
source_refs: [baymard-checkout-flow-ux]
last_verified: 2026-07-12
---

> **STOP — do not re-implement this recipe from prose.** A verified code asset exists: fetch https://ui.askewly.com/r/shipping-method-selector.json, write `files[].content` into the project, install the declared dependencies, THEN restyle the look to the project's own tokens (mandatory — component-restyle.md). Prose below is the contract you verify against, not the thing you rebuild.

## Intent

A shipping method selector lets a checkout user compare delivery/pickup options by cost and timing in one glance, and binds the choice directly to the order total. Baymard's checkout-flow research treats a total that changes unexpectedly after this step as a trust problem — so selecting a method must recalculate the visible total immediately, not just at final confirmation.

## Anatomy

- Option list: one row per method, structured as a radio group (single choice).
- Per-row facts: carrier/store name, ETA, and price shown together, not in separate sections.
- Selected state: visually distinct row (border/background) plus the checked radio control.
- Pickup variant: rows for in-store pickup carry a location/time label instead of a carrier name.
- Total binding: the selection is wired to whatever component displays the order total (`cart-summary` / `checkout-order-summary`), which must update the moment selection changes.

## States

- Default: one method pre-selected (commonly the cheapest or fastest, per product policy) so the total is always current.
- Selected: chosen row highlighted; radio indicator filled.
- Free shipping: price renders as "Free" rather than "$0.00" to read as a benefit, not a placeholder.
- Pickup selected: no delivery ETA copy; store/pickup-window copy instead.
- Disabled/unavailable method: row present but not selectable, with a short reason (e.g. address outside delivery zone) — not silently hidden, so the user understands why an option is missing.

## Variants

- Delivery-only list (no pickup row) for sellers without physical locations.
- Mixed delivery + pickup list, pickup row(s) grouped at the end or start per product convention.
- Single-method checkout: skip the selector entirely and show the one method as a fixed line instead of a one-item radio group.

## Code

```tsx
export function ShippingMethodSelector({ methods, selectedId, currency = "USD", onChange }: ShippingMethodSelectorProps) {
  return (
    <RadioGroup value={selectedId} onValueChange={onChange}>
      {methods.map((method) => {
        const selected = method.id === selectedId
        return (
          <label key={method.id} className={cn("flex items-start justify-between gap-4 rounded-md border p-3", selected && "border-ring bg-accent/50")}>
            <span className="flex items-start gap-3">
              <RadioGroupItem value={method.id} />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{method.name}</span>
                <span className="text-xs text-muted-foreground">{method.carrier} · {method.eta}</span>
              </span>
            </span>
            <span className="text-sm font-medium tabular-nums">{formatMoney(method.price, currency)}</span>
          </label>
        )
      })}
    </RadioGroup>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/shipping-method-selector.tsx`. Built on the `radio-group` primitive (`examples/ui-vocabulary-site/src/components/ui/radio-group.tsx`).

## Checks

- Exactly one method can be selected at a time (native radio-group semantics, not independent checkboxes).
- Changing selection recalculates the bound order total in the same interaction — no separate "apply" step.
- Free shipping renders as "Free", not "$0.00".
- Pickup rows never show a delivery ETA string.
- Disabled/unavailable methods remain visible with a reason rather than disappearing.

## Anti-patterns

- **Cost revealed only at confirmation**: showing every method as "calculated at next step" instead of a real price per row reproduces the surprise-total problem this recipe exists to avoid.
- **Split facts**: putting price in one column and ETA in another disconnected block forces the user to cross-reference rows instead of comparing at a glance.
- **Checkbox group instead of radio group**: shipping method is a single choice; checkboxes imply multiple methods can apply simultaneously.
- **Silent total lag**: updating the selected radio without immediately recalculating the visible order total shown elsewhere on the page.

## Agent notes

- prompt_phrases: "배송/픽업 방식별 도착일과 가격을 비교하는 shipping method selector를 만들어줘", "선택하면 바로 총액이 바뀌는 배송 옵션 라디오 그룹을 checkout에 넣어줘"
- fallbacks: if carrier-level ETA data isn't available, show a date range instead of a carrier name, but never drop the price-per-row structure.
- related: pairs with `cart-summary`/`checkout-order-summary` for the total this selector feeds; does not replace `payment-method-card`, which is a separate selection for how the order is paid, not how it is delivered.
