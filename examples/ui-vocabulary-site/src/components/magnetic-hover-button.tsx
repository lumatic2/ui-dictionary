import { useRef } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"

type MagneticHoverButtonProps = {
  children: string
  onClick?: () => void
  /** Max pull toward the cursor, in px. Keep small — attraction, not chase. */
  pull?: number
}

/**
 * Magnetic hover button: the button leans toward the cursor while hovered and
 * springs back to rest on leave (tier ② — JS reads pointer position, CSS
 * transform renders). An experimental touch per signature principle 5: use on
 * showcase/marketing CTAs on explicit request, never as a product-wide button
 * default. Keyboard users get the identical button minus the lean — focus and
 * activation are untouched.
 */
export function MagneticHoverButton({ children, onClick, pull = 10 }: MagneticHoverButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 22 })
  const springY = useSpring(y, { stiffness: 320, damping: 22 })

  const handleMove = (event: React.PointerEvent) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * pull)
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * pull)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ x: springX, y: springY }}
      type="button"
      onClick={onClick}
      onPointerLeave={reset}
      onPointerMove={handleMove}
    >
      {children}
    </motion.button>
  )
}

/** Colocated demo: one magnetic CTA with room to observe the pull and spring-back. */
export function MagneticHoverButtonDemo() {
  return (
    <div className="flex h-48 w-full max-w-md items-center justify-center rounded-lg border bg-muted/30">
      <MagneticHoverButton>Hover me</MagneticHoverButton>
    </div>
  )
}
