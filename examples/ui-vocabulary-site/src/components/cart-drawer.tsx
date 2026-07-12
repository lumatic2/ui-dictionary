import { MinusIcon, PlusIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type CartDrawerItem = {
  id: string
  title: string
  variant?: string
  quantity: number
  price: number
}

type CartDrawerProps = {
  open: boolean
  items: CartDrawerItem[]
  currency?: string
  trigger: React.ReactNode
  onOpenChange: (open: boolean) => void
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  onContinueShopping: () => void
}

type CartDrawerBodyProps = Omit<CartDrawerProps, "open" | "trigger" | "onOpenChange">

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

/**
 * Cart drawer's header/list/footer markup, extracted from the `Sheet`
 * chrome so it can be reused verbatim by a contained demo (no portal, no
 * viewport-fixed positioning) instead of duplicating the item-list JSX.
 */
export function CartDrawerBody({
  items,
  currency = "USD",
  onQuantityChange,
  onRemove,
  onCheckout,
  onContinueShopping,
}: CartDrawerBodyProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isEmpty = items.length === 0

  return (
    <>
      <SheetHeader>
        {/* Plain heading: SheetTitle requires Dialog context, and this body also renders in the contained gallery demo without one. */}
        <h2 className="font-semibold text-foreground">Your cart</h2>
      </SheetHeader>

      {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button size="sm" variant="outline" onClick={onContinueShopping}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <ul className="flex-1 divide-y overflow-y-auto px-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-4">
                <div
                  aria-hidden="true"
                  className="size-16 shrink-0 rounded-md border bg-muted"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      {item.variant ? (
                        <p className="truncate text-xs text-muted-foreground">{item.variant}</p>
                      ) : null}
                    </div>
                    <button
                      aria-label={`Remove ${item.title}`}
                      className="shrink-0 text-muted-foreground transition hover:text-foreground"
                      type="button"
                      onClick={() => onRemove(item.id)}
                    >
                      <XIcon aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center rounded-md border">
                      <button
                        aria-label={`Decrease quantity of ${item.title}`}
                        className="inline-flex size-7 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                      >
                        <MinusIcon aria-hidden="true" className="size-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                      <button
                        aria-label={`Increase quantity of ${item.title}`}
                        className="inline-flex size-7 items-center justify-center text-muted-foreground transition hover:text-foreground"
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                      >
                        <PlusIcon aria-hidden="true" className="size-3" />
                      </button>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      {formatMoney(item.price * item.quantity, currency)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isEmpty ? (
          <SheetFooter className={cn("gap-3 border-t")}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">{formatMoney(subtotal, currency)}</span>
            </div>
            <Button className="w-full" type="button" onClick={onCheckout}>
              Checkout · {formatMoney(subtotal, currency)}
            </Button>
            <Button className="w-full" type="button" variant="ghost" onClick={onContinueShopping}>
              Continue shopping
            </Button>
          </SheetFooter>
        ) : null}
    </>
  )
}

/**
 * Slide-over cart overlay: browse a grid, add items, and review/edit the
 * cart without leaving the current page. Only shows a subtotal — full cost
 * breakdown (tax, shipping) is deferred to `checkout-order-summary`.
 */
export function CartDrawer({
  open,
  items,
  currency = "USD",
  trigger,
  onOpenChange,
  onQuantityChange,
  onRemove,
  onCheckout,
  onContinueShopping,
}: CartDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent aria-describedby={undefined} className="w-full sm:max-w-md">
        <SheetTitle className="sr-only">Your cart</SheetTitle>
        <CartDrawerBody
          items={items}
          currency={currency}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onCheckout={onCheckout}
          onContinueShopping={onContinueShopping}
        />
      </SheetContent>
    </Sheet>
  )
}
