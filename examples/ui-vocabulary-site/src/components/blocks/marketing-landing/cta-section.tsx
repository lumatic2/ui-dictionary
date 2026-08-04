import { Button } from "@/components/ui/button"
import { MeshGradientSurface } from "@/components/mesh-gradient-surface"
import { RotatingLabel } from "@/components/rotating-label"

type CtaSectionProps = {
  headingPrefix: string
  rotating: string[]
  headingSuffix: string
  body: string
  button: string
}

/** Final ask: mesh-gradient ground, one rotating word slot in the headline, a single action. */
export function CtaSection({ headingPrefix, rotating, headingSuffix, body, button }: CtaSectionProps) {
  const widthCh = Math.max(...rotating.map((label) => label.length)) + 0.6

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <MeshGradientSurface className="rounded-2xl border px-6 py-16 text-center">
        <h2 className="break-keep text-3xl font-semibold tracking-tight text-foreground">
          {headingPrefix} <RotatingLabel labels={rotating} widthCh={widthCh} /> {headingSuffix}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{body}</p>
        <Button className="mt-8" size="lg">
          {button}
        </Button>
      </MeshGradientSurface>
    </section>
  )
}
