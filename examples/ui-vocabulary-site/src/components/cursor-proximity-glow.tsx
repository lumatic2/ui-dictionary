import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

// Harvested from ui.askewly.com FloatingField reveal mechanic, 2026-08-04
// (docs/design-system/harvest-contract.md §4).

type CursorProximityGlowProps = {
  children: ReactNode
  /** px from an element's edge at which its glow reveals. */
  radius?: number
}

/**
 * Cursor proximity glow: children marked with `data-glow` light up when the
 * pointer comes near. One document-level pointermove writes `--cursor-x/y`
 * custom properties per element and toggles `data-revealed`; the visual is a
 * pure CSS radial-gradient overlay that follows those variables, so the hot
 * path does no React re-renders. Touch and keyboard users simply see the
 * elements in their resting state — the glow is decoration, never meaning.
 */
export function CursorProximityGlow({ children, radius = 48 }: CursorProximityGlowProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    function update(event: PointerEvent) {
      root!.querySelectorAll<HTMLElement>("[data-glow]").forEach((el) => {
        const rect = el.getBoundingClientRect()
        const nearestX = Math.max(rect.left, Math.min(event.clientX, rect.right))
        const nearestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom))
        const distance = Math.hypot(event.clientX - nearestX, event.clientY - nearestY)
        el.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
        el.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)
        if (distance <= radius) el.dataset.revealed = "true"
        else delete el.dataset.revealed
      })
    }
    function clear() {
      root!.querySelectorAll<HTMLElement>("[data-glow]").forEach((el) => delete el.dataset.revealed)
    }

    document.addEventListener("pointermove", update)
    document.addEventListener("pointerleave", clear)
    return () => {
      document.removeEventListener("pointermove", update)
      document.removeEventListener("pointerleave", clear)
    }
  }, [radius])

  return (
    <div ref={rootRef} className="relative">
      {children}
      <style>{`
        [data-glow] { position: relative; }
        [data-glow]::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            circle 48px at var(--cursor-x, 50%) var(--cursor-y, 50%),
            color-mix(in srgb, var(--primary) 85%, transparent) 0 58%,
            transparent 60%
          );
          transition: opacity 90ms linear;
        }
        [data-glow][data-revealed]::after { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { [data-glow]::after { transition: none; } }
      `}</style>
    </div>
  )
}
