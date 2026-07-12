import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingField, HeroSearch, ShowcaseAtlas, type HomePageProps } from "@/components/home-page"
import { SHOW_UNFILLED } from "@/lib/exposure"

export function LandingHero({ onNavigate, onSearch, filter, terms }: HomePageProps) {
  return (
    <section className="relative isolate overflow-hidden bg-background px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background" />
      <FloatingField />
      <div className="relative z-30 mx-auto flex max-w-[1180px] min-w-0 flex-col items-center">
        <h1 className="mt-4 text-center text-[clamp(3.5rem,16vw,8rem)] font-semibold leading-[0.9] tracking-normal text-foreground">
          Askewly Design
        </h1>
        <p className="mt-7 w-full max-w-2xl text-center text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl">
          A visual library and agent-ready system for
          <br className="hidden md:inline" /> designing better product interfaces.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {SHOW_UNFILLED && (
            <Button className="h-11 rounded-lg bg-askewly-violet px-6 has-[>svg]:px-6 text-white hover:bg-[#5f22a8]" type="button" onClick={() => onNavigate({ page: "download" })}>
              Get Started
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          )}
          <Button className="h-11 rounded-lg border-border bg-background px-6 text-foreground hover:bg-muted" variant="outline" type="button" onClick={() => onNavigate({ page: "docs", filter: "nav:docs-getting-started-setup" })}>
            Open Docs
          </Button>
        </div>

        <HeroSearch filter={filter} terms={terms} onNavigate={onNavigate} onSearch={onSearch} />

        <ShowcaseAtlas />
      </div>
    </section>
  )
}
