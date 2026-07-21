import { useEffect, useRef } from "react"

type Particle = { x: number; y: number; vx: number; vy: number; r: number }

/**
 * Canvas particle field: dozens of drifting dots drawn straight into a 2D
 * pixel buffer (tier ③ — DOM elements at this count would pay layout/paint
 * cost per node; the canvas pays none). Colors are read from the element's
 * computed token variables, not hardcoded. The canvas is decoration:
 * aria-hidden, pointer-events none, and the rAF loop is cancelled on unmount
 * and never started when the user prefers reduced motion (a static frame is
 * drawn instead — JS loops are not auto-suppressed by the media query).
 */
export function CanvasParticleField({ className, count = 60 }: { className?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const styles = getComputedStyle(canvas)
    const dotColor = styles.getPropertyValue("--primary").trim() || styles.color
    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    context.scale(dpr, dpr)

    const particles: Particle[] = Array.from({ length: count }, (_, index) => ({
      x: ((index * 83) % 97) / 97 * width,
      y: ((index * 47) % 89) / 89 * height,
      vx: (((index * 31) % 13) / 13 - 0.5) * 0.5,
      vy: (((index * 17) % 11) / 11 - 0.5) * 0.5,
      r: 1 + ((index * 7) % 5) / 2,
    }))

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = dotColor
      for (const p of particles) {
        context.globalAlpha = 0.25 + (p.r / 3.5) * 0.5
        context.beginPath()
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw()
      return
    }

    let frame = 0
    const tick = () => {
      for (const p of particles) {
        p.x = (p.x + p.vx + width) % width
        p.y = (p.y + p.vy + height) % height
      }
      draw()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [count])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className ?? ""}`} />
}

/** Colocated demo: the field behind readable foreground copy. */
export function CanvasParticleFieldDemo() {
  return (
    <div className="relative h-56 w-full max-w-2xl overflow-hidden rounded-lg border bg-background">
      <CanvasParticleField className="absolute inset-0 h-full w-full" />
      <div className="relative flex h-full items-center justify-center px-8 text-center">
        <div>
          <p className="text-sm font-medium text-foreground">Canvas particle field</p>
          <p className="mt-1 break-keep text-sm text-muted-foreground">60개 점을 DOM 없이 픽셀 버퍼에 그립니다. reduced-motion에서는 정지 프레임만.</p>
        </div>
      </div>
    </div>
  )
}
