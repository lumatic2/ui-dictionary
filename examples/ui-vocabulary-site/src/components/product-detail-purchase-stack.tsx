import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ProductVariantOption = {
  value: string
  label: string
  available: boolean
}

type ProductDetailPurchaseStackProps = {
  title: string
  ratingSummary: string
  price: number
  unitPrice?: string
  variantOptions: ProductVariantOption[]
  selectedVariant: string
  onSelectVariant: (value: string) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
  estimatedTotal: number
  currency?: string
  onAddToCart: () => void
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

/**
 * Desktop-first product-detail purchase block: title, price, variant
 * selection as visible buttons (not a hidden dropdown), a quantity stepper,
 * and a primary CTA that repeats the estimated total with a return-policy
 * link nearby — per Baymard's product-page research, hiding options behind a
 * dropdown or deferring total cost to a later step erodes purchase confidence.
 */
export function ProductDetailPurchaseStack({
  title,
  ratingSummary,
  price,
  unitPrice,
  variantOptions,
  selectedVariant,
  onSelectVariant,
  quantity,
  onQuantityChange,
  estimatedTotal,
  currency = "USD",
  onAddToCart,
}: ProductDetailPurchaseStackProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-medium">{title}</h1>
        <p className="text-sm text-muted-foreground">{ratingSummary}</p>
      </div>

      <div>
        <p className="text-lg font-medium tabular-nums">{formatMoney(price, currency)}</p>
        {unitPrice ? <p className="text-xs text-muted-foreground">{unitPrice}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Variant</span>
        <div className="flex flex-wrap gap-2">
          {variantOptions.map((option) => {
            const selected = option.value === selectedVariant
            return (
              <button
                key={option.value}
                aria-pressed={selected}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40",
                  selected ? "border-ring bg-accent" : "hover:bg-accent/50"
                )}
                disabled={!option.available}
                type="button"
                onClick={() => onSelectVariant(option.value)}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="inline-flex items-center rounded-md border">
          <button
            aria-label="Decrease quantity"
            className="inline-flex size-8 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            disabled={quantity <= 1}
            type="button"
            onClick={() => onQuantityChange(quantity - 1)}
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm tabular-nums">{quantity}</span>
          <button
            aria-label="Increase quantity"
            className="inline-flex size-8 items-center justify-center text-muted-foreground transition hover:text-foreground"
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <Button className="w-full" type="button" onClick={onAddToCart}>
        Add to cart · {formatMoney(estimatedTotal, currency)}
      </Button>
      <p className="text-xs text-muted-foreground">
        Estimated total. <a className="underline" href="#return-policy">Return policy</a>
      </p>
    </div>
  )
}
