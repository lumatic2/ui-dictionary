import { useEffect, useState } from "react"
import { Check, Play, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Product coverflow: a looping 3D carousel of product-surface mockups.
 * Each card's transform is derived from its shortest signed distance to the
 * active index, so the row wraps seamlessly — translateX for spread, rotateY
 * for the flanks, translateZ/scale/opacity for depth falloff.
 *
 * The card faces are showcase *content*: a deliberately fixed light palette
 * so they stay bright product shots on the dark stage in both themes. The
 * accent palette is self-contained below (`--pc-*`) — remap those five values
 * to your brand when transplanting.
 */

type CoverflowKind = "analytics" | "calendar" | "kanban" | "media" | "chat" | "pricing"

const coverflowCards: CoverflowKind[] = ["analytics", "calendar", "kanban", "media", "chat", "pricing"]

// Demo content palette — intentionally theme-independent (see note above).
const contentPalette = {
  "--pc-accent": "#6F2DBD",
  "--pc-accent-soft": "#B298DC",
  "--pc-sky": "#B8D0EB",
  "--pc-mint": "#B9FAF8",
  "--pc-amber": "#FBBF24",
} as React.CSSProperties

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  )

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => setReduced(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return reduced
}

function CoverflowCard({ kind }: { kind: CoverflowKind }) {
  const frame = "h-[132px] w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_46px_color-mix(in_srgb,black_50%,transparent)]"
  if (kind === "analytics") {
    return (
      <div className={frame}>
        <div className="flex items-center justify-between px-3 pt-3">
          <p className="text-[10px] font-semibold text-slate-900">Revenue</p>
          <span className="text-[9px] font-medium text-emerald-500">+18%</span>
        </div>
        <p className="px-3 text-lg font-semibold leading-tight text-slate-900">$48.2k</p>
        <div className="mt-1 flex h-[52px] items-end gap-1 px-3 pb-3">
          {[0.35, 0.6, 0.45, 0.82, 0.55, 0.95, 0.7].map((h, i) => (
            <span key={i} className="flex-1 rounded-t" style={{ height: `${h * 100}%`, background: i === 5 ? "var(--pc-accent)" : "var(--pc-accent-soft)" }} />
          ))}
        </div>
      </div>
    )
  }
  if (kind === "calendar") {
    return (
      <div className={cn(frame, "p-3")}>
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold text-slate-900">March</p>
          <span className="text-[8px] text-slate-400">2026</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className={cn("aspect-square rounded-[3px]", i !== 16 && "bg-slate-100")} style={i === 16 ? { background: "var(--pc-accent)" } : undefined} />
          ))}
        </div>
      </div>
    )
  }
  if (kind === "kanban") {
    const columns = [
      { color: "var(--pc-sky)", n: 3 },
      { color: "var(--pc-amber)", n: 2 },
      { color: "var(--pc-mint)", n: 2 },
    ]
    return (
      <div className={cn(frame, "p-3")}>
        <p className="text-[10px] font-semibold text-slate-900">Sprint 12</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {columns.map((col, ci) => (
            <div key={ci} className="space-y-1.5">
              <span className="block h-1 w-6 rounded-full" style={{ background: col.color }} />
              {Array.from({ length: col.n }).map((_, i) => (
                <span key={i} className="block h-4 rounded bg-slate-100" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (kind === "media") {
    return (
      <div className={cn(frame, "p-3")}>
        <div className="flex items-center gap-2.5">
          <div className="size-11 shrink-0 rounded-md" style={{ background: "linear-gradient(135deg, var(--pc-accent), var(--pc-mint))" }} />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-slate-900">Nightfall</p>
            <p className="truncate text-[9px] text-slate-500">Askewly Radio</p>
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full bg-slate-200">
          <span className="block h-full w-2/3 rounded-full" style={{ background: "var(--pc-accent)" }} />
        </div>
        <div className="mt-2.5 flex items-center justify-center gap-3 text-slate-700">
          <SkipBack className="size-3" aria-hidden="true" />
          <Play className="size-4 fill-current" aria-hidden="true" />
          <SkipForward className="size-3" aria-hidden="true" />
        </div>
      </div>
    )
  }
  if (kind === "chat") {
    return (
      <div className={cn(frame, "flex flex-col gap-1.5 p-3")}>
        <span className="max-w-[82%] self-start rounded-lg rounded-bl-sm bg-slate-100 px-2 py-1 text-[9px] leading-snug text-slate-700">How’s the redesign going?</span>
        <span className="max-w-[82%] self-end rounded-lg rounded-br-sm px-2 py-1 text-[9px] leading-snug text-white" style={{ background: "var(--pc-accent)" }}>Shipping it today ✦</span>
        <span className="max-w-[60%] self-start rounded-lg rounded-bl-sm bg-slate-100 px-2 py-1 text-[9px] leading-snug text-slate-700">🔥 amazing</span>
      </div>
    )
  }
  return (
    <div className={cn(frame, "p-3")}>
      <p className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: "var(--pc-accent)" }}>Pro</p>
      <p className="text-slate-900">
        <span className="text-xl font-semibold">$24</span>
        <span className="text-[9px] text-slate-400">/mo</span>
      </p>
      <div className="mt-2 space-y-1.5">
        {["Unlimited tokens", "Team library", "Priority sync"].map((feature) => (
          <div key={feature} className="flex items-center gap-1.5 text-[9px] text-slate-600">
            <Check className="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductCoverflowDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const total = coverflowCards.length

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = window.setInterval(() => setActive((value) => (value + 1) % total), 2600)
    return () => window.clearInterval(interval)
  }, [prefersReducedMotion, total])

  return (
    <div className="min-h-[17.65rem]" style={contentPalette}>
      <div className="relative h-64 overflow-hidden rounded-md border border-slate-200 bg-slate-950" style={{ perspective: "1000px" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,color-mix(in_srgb,var(--pc-accent)_34%,transparent),transparent_64%)]" />
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {coverflowCards.map((kind, index) => {
            // Shortest signed distance around the loop, so the row wraps seamlessly.
            let pos = index - active
            if (pos > total / 2) pos -= total
            if (pos < -total / 2) pos += total
            const abs = Math.abs(pos)
            const side = Math.max(-1, Math.min(1, pos))
            const x = pos * 66
            const rotateY = -side * 44
            const z = -abs * 70
            const scale = Math.max(0.6, 1 - abs * 0.14)
            const opacity = abs > 2.6 ? 0 : Math.max(0, 1 - abs * 0.24)
            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                  zIndex: 100 - Math.round(abs * 10),
                  opacity,
                  transition: prefersReducedMotion ? undefined : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                <CoverflowCard kind={kind} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
