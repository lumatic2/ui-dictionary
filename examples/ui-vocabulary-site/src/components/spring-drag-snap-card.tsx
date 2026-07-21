import { useRef } from "react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Spring drag snap-back card: drag the card anywhere inside its field and it
 * springs back to rest on release (tier ②). The point of the demo is
 * interruptibility — grab it mid-flight and the spring re-targets without a
 * snap, which duration/easing tweens cannot do. Springs like this are a
 * production-grade default for drag, reorder, and dismiss interactions.
 * Reduced motion swaps the spring for an instant return.
 */
export function SpringDragSnapCard() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  return (
    <div ref={fieldRef} className="relative flex h-56 w-full max-w-md items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
      <motion.div
        className="cursor-grab touch-none select-none rounded-lg border bg-background px-6 py-4 shadow-sm active:cursor-grabbing"
        drag
        dragConstraints={fieldRef}
        dragElastic={0.2}
        dragSnapToOrigin
        dragTransition={
          reduceMotion
            ? { bounceStiffness: 100000, bounceDamping: 100000 }
            : { bounceStiffness: 380, bounceDamping: 24 }
        }
        whileDrag={{ scale: 1.04 }}
      >
        <p className="text-sm font-medium text-foreground">Drag me</p>
        <p className="mt-1 break-keep text-sm text-muted-foreground">놓으면 스프링으로 복귀합니다. 복귀 중에 다시 잡아도 끊기지 않습니다.</p>
      </motion.div>
    </div>
  )
}

/** Colocated demo: the card itself is the demo. */
export function SpringDragSnapCardDemo() {
  return <SpringDragSnapCard />
}
