---
id: product-detail-purchase-stack
name: "Product Detail Purchase Stack"
pattern_group: commerce
kind: block
status: draft
surface_refs: [commerce, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - color.semantic.action.primary
  - dimension.space.2
  - dimension.space.4
  - dimension.radius.md
  - typography.scale.sm
  - typography.scale.lg
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/components/product-detail-purchase-stack.tsx
component_refs: []
term_refs: [product-option-sheet, quantity-stepper]
source_refs: [baymard-product-page-ux]
last_verified: 2026-07-12
---

## Intent

The product detail purchase stack is the desktop-default vertical block that binds title, price, variant selection, quantity, and the add-to-cart CTA into one continuously visible unit. Baymard's product-page research recommends exposing variant choices (size/color) as visible buttons rather than hiding them behind a dropdown, and surfacing the estimated total plus a return-policy link right next to the CTA rather than deferring cost/policy facts to a later step. `product-option-sheet` is the mobile bottom-sheet variant of this same decision set — this recipe is the inline desktop default, not a replacement for it.

## Anatomy

- Title and rating summary link.
- Price, with an optional unit price line (e.g. price per 100g) beneath it.
- Variant selectors rendered as a visible button group per axis (color, size) — not a hidden `<select>`.
- Quantity stepper (reuses the `quantity-stepper` term).
- Stock/availability state surfaced per variant, not just for the product as a whole.
- Primary add-to-cart CTA that repeats the estimated total.
- Return-policy link placed directly beneath the CTA.

## States

- Default: a valid variant pre-selected where possible, CTA enabled.
- Variant unavailable: that option renders disabled with a visible reason (e.g. "Out of stock") rather than disappearing from the button group.
- No variant selected yet (when no sane default exists): CTA disabled until a required axis is chosen.
- Quantity at minimum: decrease control disabled at 1, matching `quantity-stepper`'s own floor behavior.
- Updated total: changing variant or quantity recalculates the CTA's repeated total in the same interaction.

## Variants

- Single-axis variant selection (color only, or size only) — the button group renders for just that one axis.
- Two-axis variant selection (color and size together) — two separate button groups, each with its own label.
- No variants (single SKU product) — the variant section is omitted entirely rather than shown empty.

## Code

```tsx
export function ProductDetailPurchaseStack({ title, ratingSummary, price, variantOptions, selectedVariant, onSelectVariant, quantity, onQuantityChange, estimatedTotal, onAddToCart }: ProductDetailPurchaseStackProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{ratingSummary}</p>
      <p>{formatMoney(price)}</p>
      <div>
        {variantOptions.map((option) => (
          <button key={option.value} aria-pressed={option.value === selectedVariant} disabled={!option.available} onClick={() => onSelectVariant(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
      <QuantityStepper quantity={quantity} onChange={onQuantityChange} />
      <Button onClick={onAddToCart}>Add to cart · {formatMoney(estimatedTotal)}</Button>
      <a href="#return-policy">Return policy</a>
    </div>
  )
}
```

Full implementation: `examples/ui-vocabulary-site/src/components/product-detail-purchase-stack.tsx`.

## Checks

- Variant options render as buttons, never a `<select>`/dropdown.
- An out-of-stock variant stays visible and disabled with a reason, rather than being removed from the list.
- The CTA's repeated total updates in the same interaction as a variant or quantity change — no stale total.
- A return-policy link is present directly beneath the CTA, not only on a separate page.
- Quantity control shares the same floor-at-1 behavior as the standalone `quantity-stepper` term.

## Anti-patterns

- **Variant dropdown**: hiding size/color behind a `<select>` forces an extra click to see all options and hides stock state per option — Baymard flags this as a recurring product-page friction point.
- **Silent stock-outs**: removing an unavailable variant from the button group instead of showing it disabled with a reason confuses users comparing options.
- **Total revealed only after Add to cart**: not repeating the estimated total on the CTA itself defers a cost fact the user should see before committing.
- **Return policy buried**: linking to return policy only from a footer or separate page, far from the purchase decision itself.

## Agent notes

- prompt_phrases: "사이즈 색상을 버튼으로 고르는 product detail purchase stack을 만들어줘", "담기 버튼에 예상 총액과 반품 정책 링크를 함께 보여줘"
- fallbacks: if a unit price isn't applicable to the product, omit that line entirely rather than showing an empty placeholder.
- component composition: reuses `quantity-stepper` for the quantity control and stays inline/desktop-default — for a mobile bottom-sheet presentation of the same variant/quantity/CTA decision set, see `product-option-sheet`.
