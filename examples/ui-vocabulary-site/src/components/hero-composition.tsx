import { useEffect, useState } from "react"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Hero composition rotator: one hero surface cycling through three named
 * compositions (centered, proof-surface, compact) so the variants read as an
 * A/B lineup instead of three separate mockups. The tab strip doubles as a
 * manual override; the auto-cycle stops entirely under reduced motion and the
 * fade keyframe is scoped to this component. Semantic tokens throughout.
 */

const HERO_COMPOSITION_CYCLE_MS = 5200

type HeroCompositionProof = "search" | "workspace" | "none"

const heroCompositions: Array<{
  id: string
  label: string
  eyebrow: string
  headline: string
  subcopy: string
  primaryCta: string
  secondaryCta: string
  proof: HeroCompositionProof
}> = [
  {
    id: "centered",
    label: "Centered",
    eyebrow: "Homepage hero",
    headline: "Askewly Design",
    subcopy: "A visual library and agent-ready system for designing better product interfaces.",
    primaryCta: "Get Started",
    secondaryCta: "Open Docs",
    proof: "search",
  },
  {
    id: "proof",
    label: "Proof surface",
    eyebrow: "Workspace preview",
    headline: "Askewly Design",
    subcopy: "Browse the tokens, patterns, and components an agent can ship straight from.",
    primaryCta: "Explore Patterns",
    secondaryCta: "Read the Docs",
    proof: "workspace",
  },
  {
    id: "compact",
    label: "Compact",
    eyebrow: "Nested section hero",
    headline: "Start from a token, not a blank canvas.",
    subcopy: "Every component here maps back to a semantic token pair.",
    primaryCta: "Browse Tokens",
    secondaryCta: "View Components",
    proof: "none",
  },
]

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

export function HeroCompositionDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % heroCompositions.length)
    }, HERO_COMPOSITION_CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [prefersReducedMotion])

  const composition = heroCompositions[activeIndex]

  return (
    <div className="grid min-h-[22.2rem] gap-3">
      <style>{`@keyframes hero-composition-rotator-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div role="tablist" aria-label="Hero composition variant" className="inline-flex w-fit gap-0.5 rounded-full bg-muted p-0.5 text-muted-foreground ring-1 ring-border">
        {heroCompositions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition",
              index === activeIndex ? "bg-background text-foreground shadow-sm ring-1 ring-border" : "hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-background">
        <div
          key={prefersReducedMotion ? "static" : composition.id}
          className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 px-5 py-6 text-center"
          style={{ animation: prefersReducedMotion ? undefined : "hero-composition-rotator-fade 340ms cubic-bezier(0.33, 1, 0.68, 1) both" }}
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{composition.eyebrow}</p>
          <h4 className={cn("font-semibold tracking-tight text-foreground", composition.id === "compact" ? "max-w-[15rem] text-lg" : "text-2xl")}>
            {composition.headline}
          </h4>
          <p className="max-w-[19rem] text-xs leading-5 text-muted-foreground">{composition.subcopy}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button size="sm" type="button">
              {composition.primaryCta}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Button>
            <Button size="sm" variant="outline" type="button">
              {composition.secondaryCta}
            </Button>
          </div>

          {composition.proof === "search" && (
            <div className="mt-1 flex w-full max-w-[15rem] items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-left">
              <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-[11px] text-muted-foreground">Search components, tokens, patterns…</span>
            </div>
          )}

          {composition.proof === "workspace" && (
            <div className="mt-1 grid w-full max-w-[17rem] grid-cols-[3.2rem_minmax(0,1fr)_3.6rem] gap-1.5 rounded-md border border-border bg-muted p-1.5">
              <div className="space-y-1 rounded bg-background p-1.5 text-left">
                {["Docs", "Patterns", "Colors"].map((label) => (
                  <p key={label} className="truncate text-[8px] font-medium text-muted-foreground">
                    {label}
                  </p>
                ))}
              </div>
              <div className="rounded bg-background p-1.5 text-left">
                <p className="text-[8px] font-semibold text-foreground">Button</p>
                <div className="mt-1.5 h-6 w-10 rounded bg-primary" />
              </div>
              <div className="space-y-1 rounded bg-background p-1.5 text-left">
                <p className="font-mono text-[7px] text-muted-foreground">action.primary</p>
                <p className="font-mono text-[7px] text-muted-foreground">radius.md</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
