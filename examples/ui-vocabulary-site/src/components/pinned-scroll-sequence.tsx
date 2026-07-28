import { useEffect, useRef, useState } from "react"

const STEPS = [
  ["Pin", "섹션이 뷰포트에 고정됩니다 — 스크롤은 진행률이 됩니다."],
  ["Scrub", "스크롤 위치가 타임라인을 문지릅니다 — 되감기도 자연스럽습니다."],
  ["Release", "시퀀스가 끝나면 고정이 풀리고 흐름이 이어집니다."],
] as const

function StepCard({ title, body, step }: { title: string; body: string; step?: boolean }) {
  return (
    <div data-step={step ? "" : undefined} className="rounded-md border bg-muted/40 px-4 py-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 break-keep text-sm text-muted-foreground">{body}</p>
    </div>
  )
}

/**
 * Pinned scroll sequence (tier ② — GSAP ScrollTrigger): a section pins while
 * the user's scroll scrubs a multi-step sequence, then releases. Tier ① CSS
 * scroll-driven animation cannot express pinning or cross-element sequencing —
 * that escalation is exactly the decision-table row this recipe implements.
 *
 * Load-bearing contracts:
 * - ScrollTrigger is scoped to the demo's own scroll container (`scroller`),
 *   never the page scroll — a gallery demo must not hijack page layout.
 * - gsap.context + cleanup kills the timeline and triggers on unmount.
 * - prefers-reduced-motion: no pin, no scrub — all steps render statically.
 */
export function PinnedScrollSequenceDemo() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) {
      setReduced(true)
      return
    }
    let cleanup: (() => void) | undefined
    let cancelled = false
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !scrollerRef.current || !stageRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        const steps = stageRef.current!.querySelectorAll("[data-step]")
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            scroller: scrollerRef.current,
            start: "top top",
            end: "+=600",
            pin: true,
            scrub: 0.4,
          },
        })
        steps.forEach((step, index) => {
          timeline.fromTo(
            step,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1 },
            index,
          )
          if (index < steps.length - 1) timeline.to(step, { opacity: 0.25, duration: 0.6 }, index + 0.7)
        })
      }, stageRef)
      cleanup = () => ctx.revert()
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div className="w-full max-w-md">
      {reduced ? (
        <div className="space-y-3 rounded-lg border bg-background p-4">
          <p className="break-keep text-sm text-muted-foreground">Reduced motion — 시퀀스가 정적으로 전개됩니다.</p>
          {STEPS.map(([title, body]) => (
            <StepCard key={title} title={title} body={body} />
          ))}
        </div>
      ) : (
        <div ref={scrollerRef} className="relative h-72 overflow-y-auto rounded-lg border bg-background">
          <p className="px-4 pt-4 text-sm text-muted-foreground">Scroll — 스테이지가 고정된 채 3단계가 스크럽됩니다.</p>
          <div ref={stageRef} className="flex h-64 flex-col justify-center gap-3 px-4">
            {STEPS.map(([title, body]) => (
              <StepCard key={title} title={title} body={body} step />
            ))}
          </div>
          <div className="h-40" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
