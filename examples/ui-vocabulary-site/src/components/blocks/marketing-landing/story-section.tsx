import { MeshGradientSurface } from "@/components/mesh-gradient-surface"
import { ZigzagStorySection, type ZigzagStep } from "@/components/zigzag-story-section"

type StorySectionProps = {
  eyebrow: string
  heading: string
  steps: Array<{ title: string; body: string }>
}

/**
 * "How it works" narrative: zigzag rows walk the visitor through the product
 * loop. The first step gets a mesh-gradient media panel so the section opens
 * with a token-driven visual; later steps use the asset's numbered fallback —
 * consumers replace media per step (screenshots, short clips).
 */
export function StorySection({ eyebrow, heading, steps }: StorySectionProps) {
  const zigzagSteps: ZigzagStep[] = steps.map((step, index) => ({
    ...step,
    media:
      index === 0 ? (
        <MeshGradientSurface className="flex aspect-[4/3] items-end rounded-xl border p-5">
          <p className="text-sm font-medium text-foreground">Brief in, decisions out.</p>
        </MeshGradientSurface>
      ) : undefined,
  }))

  return (
    <section className="mx-auto flex w-full max-w-5xl justify-center px-6 py-20">
      <ZigzagStorySection eyebrow={eyebrow} heading={heading} steps={zigzagSteps} />
    </section>
  )
}
