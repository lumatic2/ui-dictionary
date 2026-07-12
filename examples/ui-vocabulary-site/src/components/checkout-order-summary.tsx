import { useState } from "react"
import { Button } from "@/components/ui/button"

export type CheckoutOrderItem = {
  id: string
  name: string
  option?: string
  quantity: number
  total: number
}

export type CheckoutOrder = {
  items: CheckoutOrderItem[]
  currency: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  address: string | null
  paymentMethod: string | null
  submitting: boolean
  paymentError?: string
}

type CheckoutOrderSummaryProps = {
  order: CheckoutOrder
  onConfirm: () => void
  onEdit: () => void
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

/**
 * Checkout order summary: keeps the exact purchase commitment (line items,
 * cost breakdown, fulfillment/payment facts) visible and editable while the
 * user completes delivery/payment steps. The final button names the
 * consequence and repeats the committed total, and stays disabled until the
 * required facts (address, payment method) are present and not submitting.
 */
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
              {item.option ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.option} · Qty {item.quantity}
                </p>
              ) : (
                <p className="mt-0.5 text-xs text-muted-foreground">Qty {item.quantity}</p>
              )}
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">{formatMoney(item.total, order.currency)}</p>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(order.subtotal, order.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Discount</dt>
          <dd className="tabular-nums">-{formatMoney(order.discount, order.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="tabular-nums">{formatMoney(order.shipping, order.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax</dt>
          <dd className="tabular-nums">{formatMoney(order.tax, order.currency)}</dd>
        </div>
        <div className="flex justify-between border-t pt-3 text-base font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(total, order.currency)}</dd>
        </div>
      </dl>

      <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Deliver to</dt>
          <dd className="truncate text-right">{order.address ?? "Add an address"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Pay with</dt>
          <dd className="truncate text-right">{order.paymentMethod ?? "Add a payment method"}</dd>
        </div>
      </dl>

      {order.paymentError ? (
        <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {order.paymentError}
        </p>
      ) : null}

      <Button className="mt-6 w-full" disabled={!canConfirm} type="button" onClick={onConfirm}>
        {order.submitting ? "Placing order" : `Place order · ${formatMoney(total, order.currency)}`}
      </Button>
    </aside>
  )
}

const demoItems: CheckoutOrderItem[] = [
  { id: "item-1", name: "Cotton crewneck", option: "Charcoal · M", quantity: 1, total: 48 },
  { id: "item-2", name: "Canvas tote", option: "Natural", quantity: 2, total: 64 },
]

/**
 * Colocated demo: cycles a checkout through address/payment selection,
 * a submitting state, and a recoverable payment failure without losing
 * the entered facts, matching the recipe's Checks.
 */
export function CheckoutOrderSummaryDemo() {
  const [address, setAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | undefined>(undefined)
  const [confirmed, setConfirmed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const order: CheckoutOrder = {
    items: demoItems,
    currency: "USD",
    subtotal: demoItems.reduce((sum, item) => sum + item.total, 0),
    discount: 10,
    shipping: 6,
    tax: 9.28,
    address,
    paymentMethod,
    submitting,
    paymentError,
  }

  const handleConfirm = () => {
    setPaymentError(undefined)
    setSubmitting(true)
    const isFirstAttempt = attempt === 0
    setAttempt((value) => value + 1)
    window.setTimeout(() => {
      setSubmitting(false)
      if (isFirstAttempt) {
        setPaymentError("Payment failed. Your cart and details are unchanged — try again or change your payment method.")
      } else {
        setConfirmed(true)
      }
    }, 900)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" type="button" variant="outline" onClick={() => setAddress("142 Maple Street, Portland, OR")}>
          Set address
        </Button>
        <Button size="sm" type="button" variant="outline" onClick={() => setPaymentMethod("Visa •••• 4242")}>
          Set payment method
        </Button>
      </div>
      <CheckoutOrderSummary
        order={order}
        onConfirm={handleConfirm}
        onEdit={() => setPaymentError(undefined)}
      />
      {confirmed ? (
        <p role="status" className="text-sm text-muted-foreground">
          Order confirmed — a receipt was sent to your email.
        </p>
      ) : null}
    </div>
  )
}
