import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export type ShippingMethod = {
  id: string
  name: string
  carrier: string
  eta: string
  price: number
  kind?: "delivery" | "pickup"
}

type ShippingMethodSelectorProps = {
  methods: ShippingMethod[]
  selectedId: string
  currency?: string
  onChange: (id: string) => void
}

function formatMoney(value: number, currency: string) {
  if (value === 0) return "Free"
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

/**
 * Radio group comparing shipping/pickup options side by side, each row
 * binding carrier, ETA, and price together so the recalculated total is
 * visible before the user commits to a method (Baymard checkout-flow
 * guidance: avoid a cost that only appears at final confirmation).
 */
export function ShippingMethodSelector({
  methods,
  selectedId,
  currency = "USD",
  onChange,
}: ShippingMethodSelectorProps) {
  return (
    <RadioGroup value={selectedId} onValueChange={onChange}>
      {methods.map((method) => {
        const inputId = `shipping-method-${method.id}`
        const selected = method.id === selectedId

        return (
          <label
            key={method.id}
            className={cn(
              "flex cursor-pointer items-start justify-between gap-4 rounded-md border p-3 transition",
              selected ? "border-ring bg-accent/50" : "hover:bg-accent/30"
            )}
            htmlFor={inputId}
          >
            <span className="flex items-start gap-3">
              <RadioGroupItem className="mt-0.5" id={inputId} value={method.id} />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">
                  {method.name}
                  {method.kind === "pickup" ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">In-store pickup</span>
                  ) : null}
                </span>
                <span className="text-xs text-muted-foreground">
                  {method.carrier} · {method.eta}
                </span>
              </span>
            </span>
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {formatMoney(method.price, currency)}
            </span>
          </label>
        )
      })}
    </RadioGroup>
  )
}
