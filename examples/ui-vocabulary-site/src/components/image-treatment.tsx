import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

/**
 * Image treatment rotator: one photo grid cycling through named treatment
 * recipes (duotone+grain, warm film, high-contrast mono). Each recipe is a
 * CSS filter chain plus an optional blend-mode overlay, and an SVG
 * feTurbulence filter supplies the grain as real speckle rather than gray
 * haze. A single before/after wipe line sweeps the whole grid — the raw
 * layer resets its clip while transparent so the loop reads as the treatment
 * dissolving away, never a geometry snap. Reduced motion pins the treated
 * state with no sweep.
 *
 * The photo tiles are showcase content on a fixed light frame. Pass `photos`
 * (three square-ish image URLs) when transplanting; the duotone overlay's
 * accent pair is self-contained below (`--it-*`) — remap to your brand.
 */

type ImageRecipe = {
  name: string
  filter: string
  overlay?: string
  overlayBlend?: CSSProperties["mixBlendMode"]
  grain: number
}

const imageRecipes: ImageRecipe[] = [
  {
    name: "Duotone + Grain",
    filter: "grayscale(1) contrast(1.08) saturate(0.9)",
    overlay: "linear-gradient(135deg, var(--it-accent), var(--it-accent-alt))",
    overlayBlend: "color",
    grain: 0.45,
  },
  {
    name: "Warm Film",
    filter: "sepia(0.4) contrast(0.92) saturate(1.1) brightness(1.02)",
    overlay: "linear-gradient(160deg, color-mix(in srgb, var(--color-orange-200) 35%, transparent), color-mix(in srgb, var(--color-amber-900) 12%, transparent))",
    overlayBlend: "soft-light",
    grain: 0.25,
  },
  {
    name: "High-Contrast Mono",
    filter: "grayscale(1) contrast(1.45) brightness(0.95)",
    grain: 0.6,
  },
]

// Demo content palette for the duotone overlay — intentionally theme-independent.
const contentPalette = {
  "--it-accent": "#6F2DBD",
  "--it-accent-alt": "#B9FAF8",
} as CSSProperties

const defaultPhotos = [
  "/assets/ecommerce-reviews/avatar-navy-overshirt.png",
  "/assets/ecommerce-reviews/avatar-curly-hair.png",
  "/assets/ecommerce-reviews/avatar-silver-hair.png",
]

const IMAGE_TREATMENT_CYCLE_MS = 4500

const wipeKeyframes = `@keyframes image-treatment-wipe-sweep {
  0% { clip-path: inset(0 0 0 0%); opacity: 1; animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1); }
  35% { clip-path: inset(0 0 0 50%); opacity: 1; }
  58% { clip-path: inset(0 0 0 50%); opacity: 1; animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1); }
  80% { clip-path: inset(0 0 0 100%); opacity: 1; animation-timing-function: ease-in; }
  85% { clip-path: inset(0 0 0 100%); opacity: 0; }
  86% { clip-path: inset(0 0 0 0%); opacity: 0; animation-timing-function: ease-out; }
  100% { clip-path: inset(0 0 0 0%); opacity: 1; }
}`

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

export function ImageTreatmentDemo({ photos = defaultPhotos }: { photos?: string[] }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [recipeIndex, setRecipeIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setInterval(() => {
      setRecipeIndex((value) => (value + 1) % imageRecipes.length)
    }, IMAGE_TREATMENT_CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [prefersReducedMotion])

  const recipe = imageRecipes[recipeIndex]

  return (
    <div className="grid min-h-[13.25rem] gap-3" style={contentPalette}>
      <style>{wipeKeyframes}</style>
      <p className="text-base font-semibold text-foreground">{recipe.name}</p>
      <div className="relative">
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id="image-treatment-grain-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
              {/* Convert luminance to alpha and punch up the contrast so this reads as
                  distinct black speckles instead of a smooth gray haze - a flat
                  overlay/soft-light blend of raw turbulence barely shows on a pale photo. */}
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="alphaNoise" />
              <feComponentTransfer in="alphaNoise">
                <feFuncA type="linear" slope="4.2" intercept="-1.7" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
              <img src={src} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: recipe.filter }} />
              {recipe.overlay && <div className="absolute inset-0" style={{ background: recipe.overlay, mixBlendMode: recipe.overlayBlend }} />}
              <div className="absolute inset-0" style={{ opacity: recipe.grain, mixBlendMode: "multiply", filter: "url(#image-treatment-grain-noise)" }} />
            </div>
          ))}
        </div>
        {/* Single shared before/after line sweeping the whole grid, not one per tile. */}
        {!prefersReducedMotion && (
          <div
            key={recipeIndex}
            className="absolute inset-0 grid grid-cols-3 gap-2"
            style={{ animation: `image-treatment-wipe-sweep ${IMAGE_TREATMENT_CYCLE_MS}ms linear 1` }}
          >
            {photos.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
                <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
