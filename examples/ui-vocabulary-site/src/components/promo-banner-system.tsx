import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PromoBannerSystemProps = {
  copy: string
  ctaLabel: string
  onCtaClick: () => void
  dismissed: boolean
  onDismiss: () => void
  countdownLabel?: string
  placement?: "top-of-site" | "in-page"
}

/**
 * A single banner shape that carries different promo copy/countdown per
 * placement. Dismissal is session-scoped only (`onDismiss` should not persist
 * across sessions) — this is a promotional urgency strip, distinct from
 * `incentive-trust-strip`, which shows fixed reassurance signals (free
 * shipping, returns, secure checkout) rather than time-limited offers.
 */
export function PromoBannerSystem({
  copy,
  ctaLabel,
  onCtaClick,
  dismissed,
  onDismiss,
  countdownLabel,
  placement = "top-of-site",
}: PromoBannerSystemProps) {
  if (dismissed) return null

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 border-b bg-accent px-4 py-2 text-sm",
        placement === "in-page" && "rounded-md border"
      )}
      role="region"
      aria-label="Promotion"
    >
      <p className="text-center">
        {copy}
        {countdownLabel ? (
          <span className="ml-2 font-medium tabular-nums" role="timer">
            {countdownLabel}
          </span>
        ) : null}
      </p>
      <Button size="sm" variant="link" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
      <button
        aria-label="Dismiss promotion"
        className="ml-1 shrink-0 text-muted-foreground transition hover:text-foreground"
        type="button"
        onClick={onDismiss}
      >
        <XIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}
