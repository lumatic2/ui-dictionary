import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import * as Matter from "matter-js"
import {
  ArrowRight,
  Command,
  FileCode2,
  LayoutDashboard,
  Layers3,
  Magnet,
  MousePointerClick,
  PanelsTopLeft,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  WandSparkles,
  ScrollText,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VocabularyTerm } from "@/data/terms.generated"
import type { TermFilter } from "@/lib/search"
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/search-suggestions"
import { cn } from "@/lib/utils"

export type HomePageDestination = {
  filter: TermFilter
  page: "docs" | "plus"
}

type HomePageProps = {
  onNavigate: (destination: HomePageDestination) => void
  onSearch: (query: string) => void
  filter: TermFilter
  terms: VocabularyTerm[]
}

const footerColumns: Array<{
  title: string
  links: Array<{ label: string; destination: HomePageDestination }>
}> = [
  {
    title: "Askewly Design",
    links: [
      { label: "Docs", destination: { page: "docs", filter: "nav:docs-getting-started-setup" } },
      { label: "Patterns", destination: { page: "plus", filter: "nav:plus-application-ui" } },
      { label: "Showcase", destination: { page: "plus", filter: "nav:plus-templates-products" } },
      { label: "Resources", destination: { page: "docs", filter: "nav:docs-getting-started-assets" } },
    ],
  },
  {
    title: "System",
    links: [
      { label: "UI Atlas", destination: { page: "plus", filter: "nav:plus-application-ui" } },
      { label: "Components", destination: { page: "docs", filter: "nav:docs-elements-introduction" } },
      { label: "Tokens", destination: { page: "docs", filter: "nav:docs-getting-started-assets" } },
      { label: "Motion", destination: { page: "docs", filter: "nav:docs-elements-disclosure" } },
    ],
  },
  {
    title: "Surfaces",
    links: [
      { label: "SaaS", destination: { page: "plus", filter: "nav:plus-application-ui" } },
      { label: "Commerce", destination: { page: "plus", filter: "nav:plus-ecommerce" } },
      { label: "Docs", destination: { page: "docs", filter: "nav:docs-component-api" } },
      { label: "Mobile", destination: { page: "plus", filter: "nav:plus-ui-kit-controls" } },
    ],
  },
  {
    title: "Pro",
    links: [
      { label: "Pro Plan", destination: { page: "plus", filter: "nav:plus-templates-products" } },
      { label: "Implementation packs", destination: { page: "plus", filter: "nav:plus-application-ui" } },
      { label: "Agent assets", destination: { page: "docs", filter: "nav:docs-getting-started-assets" } },
      { label: "Reference captures", destination: { page: "docs", filter: "nav:docs-getting-started-setup" } },
    ],
  },
]

const floatingBlocks = [
  { id: "a", className: "left-[7%] top-[16%] hidden h-28 w-8 xl:block", tone: "deep" },
  { id: "b", className: "left-[10%] top-[28%] hidden h-8 w-4 md:block", tone: "deep" },
  { id: "c", className: "right-[9%] top-[32%] hidden h-12 w-7 lg:block", tone: "deep" },
  { id: "e", className: "right-[12%] top-[16%] hidden h-20 w-5 lg:block", tone: "pale" },
  { id: "f", className: "left-[2%] top-[20%] hidden h-12 w-2 xl:block", tone: "soft" },
  { id: "v", className: "right-[20%] top-[27%] hidden h-16 w-5 xl:block", tone: "mid" },
  { id: "h", className: "left-[16%] top-[38%] hidden h-6 w-6 md:block", tone: "mid" },
  { id: "i", className: "right-[34%] top-[41%] hidden h-12 w-2 md:block", tone: "soft" },
  { id: "k", className: "left-[4%] top-[48%] hidden h-16 w-2 lg:block", tone: "soft" },
  { id: "l", className: "right-[15%] top-[50%] hidden h-10 w-2 lg:block", tone: "soft" },
  { id: "m", className: "left-[24%] top-[53%] hidden h-9 w-3 xl:block", tone: "pale" },
  { id: "n", className: "right-[27%] top-[58%] hidden h-14 w-2 xl:block", tone: "soft" },
  { id: "u", className: "right-[24%] top-[40%] hidden h-14 w-5 xl:block", tone: "deep" },
  { id: "o", className: "left-[38%] top-[62%] hidden h-20 w-3 xl:block", tone: "pale" },
  { id: "p", className: "right-[39%] top-[66%] hidden h-24 w-4 2xl:block", tone: "soft" },
  { id: "q", className: "left-[13%] top-[70%] hidden h-32 w-5 xl:block", tone: "mid" },
  { id: "r", className: "right-[18%] top-[72%] hidden h-28 w-4 xl:block", tone: "pale" },
  { id: "w", className: "right-[9%] top-[69%] hidden h-36 w-5 xl:block", tone: "deep" },
  { id: "s", className: "left-[47%] top-[76%] hidden h-20 w-2 2xl:block", tone: "soft" },
  { id: "t", className: "right-[47%] top-[83%] hidden h-16 w-2 2xl:block", tone: "pale" },
]

const invertedBlocks = [
  { id: "a", className: "left-[8%] top-[13%] h-24 w-5 opacity-80" },
  { id: "b", className: "left-[18%] top-[34%] h-12 w-3 opacity-45" },
  { id: "c", className: "left-[31%] top-[68%] h-28 w-4 opacity-70" },
  { id: "d", className: "right-[34%] top-[22%] h-20 w-3 opacity-35" },
  { id: "e", className: "right-[22%] top-[45%] h-16 w-5 opacity-85" },
  { id: "f", className: "right-[9%] top-[24%] h-32 w-4 opacity-55" },
  { id: "g", className: "right-[12%] top-[72%] h-24 w-3 opacity-75" },
]

const dashboardViews = [
  {
    id: "ops",
    label: "Ops",
    title: "Pattern operations",
    metric: "128",
    detail: "UI surfaces reviewed",
    status: "Live review",
    rows: [
      ["Command center", "Keyboard", "Ready"],
      ["Revenue table", "Density", "Review"],
      ["Settings flow", "States", "Ready"],
    ],
  },
  {
    id: "quality",
    label: "Quality",
    title: "Interface quality",
    metric: "AA",
    detail: "Contrast and motion gates",
    status: "3 checks open",
    rows: [
      ["Dashboard shell", "Responsive", "Ready"],
      ["Docs leaf", "Examples", "Review"],
      ["Checkout summary", "Copy", "Ready"],
    ],
  },
  {
    id: "agent",
    label: "Agent",
    title: "Agent-ready assets",
    metric: "42",
    detail: "Recipes and code paths",
    status: "Export queue",
    rows: [
      ["DESIGN.md tokens", "System", "Ready"],
      ["Prompt recipe", "Claude/Codex", "Ready"],
      ["Capture ledger", "Evidence", "Review"],
    ],
  },
] as const

const atlasItems = [
  { id: "agent", title: "Agent-Ready Design System", copy: "Editable UI assets packaged with agent-ready design context.", layout: "md:col-span-2 xl:col-span-4" },
  { id: "pointer", title: "Cursor-Reactive Field", copy: "Surfaces that respond to cursor movement with spatial feedback and temporary visual traces.", layout: "md:col-span-2 xl:col-span-2" },
  { id: "physics", title: "Physics-Based Interaction", copy: "Interface objects collide, drift, and settle under a live physics field.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "scroll", title: "Scroll-Driven Narrative", copy: "Copy, layers, and interface states advance as a self-running story.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "motion", title: "Motion Choreography", copy: "Easing curves compared as visible motion from center to edge and back.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "shader", title: "Shader Gradient System", copy: "Tokenized mesh color, grain, and luminous fields in a continuous loop.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "material", title: "Material Surface System", copy: "Glass, paper, shadow, blur, and depth rules that keep complex surfaces tactile and readable.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "filters", title: "Image Treatment", copy: "Filters, masks, crops, and focus treatments loop through visual tone.", layout: "md:col-span-2 xl:col-span-6" },
  { id: "landing", title: "Hero Composition", copy: "First-viewport structure balancing headline, proof surface, calls to action, media, and visual rhythm.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "command", title: "Command Center Interface", copy: "Keyboard-first product control with search, review queues, agent actions, and system status in one place.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "commerce", title: "Commerce Flow", copy: "Product discovery, purchase confidence, cart states, pricing, and checkout signals arranged as one buying path.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "mobile", title: "Mobile App Patterns", copy: "Compact app states for account, billing, alerts, navigation, density, and thumb-friendly actions.", layout: "md:col-span-1 xl:col-span-3" },
] as const

type AtlasItemId = (typeof atlasItems)[number]["id"]

type CursorFieldCell = {
  id: number
  x: number
  y: number
  glyph: string
  opacity: number
  life: number
}

const atlasIconMap = {
  pointer: MousePointerClick,
  physics: Magnet,
  scroll: ScrollText,
  motion: Sparkles,
  shader: WandSparkles,
  filters: SlidersHorizontal,
  material: Layers3,
  landing: PanelsTopLeft,
  command: Command,
  commerce: ShoppingBag,
  mobile: Smartphone,
  agent: FileCode2,
} satisfies Record<AtlasItemId, LucideIcon>

export function HomePage({ onNavigate, onSearch, filter, terms }: HomePageProps) {
  return (
    <div className="bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-white px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20 lg:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-white" />
        <FloatingField />
        <div className="relative z-30 mx-auto flex max-w-[1180px] min-w-0 flex-col items-center">
          <h1 className="mt-4 text-center text-[clamp(3.5rem,16vw,8rem)] font-semibold leading-[0.9] tracking-normal text-slate-950">
            Askewly Design
          </h1>
          <p className="mt-7 w-full max-w-2xl text-center text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:text-xl">
            A visual library and agent-ready system for designing better product interfaces.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 rounded-full bg-askewly-violet px-6 text-white hover:bg-[#5f22a8]" type="button" onClick={() => onNavigate({ page: "plus", filter: "nav:plus-application-ui" })}>
              Get Started
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <Button className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-950 hover:bg-slate-50" variant="outline" type="button" onClick={() => onNavigate({ page: "docs", filter: "nav:docs-getting-started-setup" })}>
              Open Docs
            </Button>
          </div>

          <HeroSearch filter={filter} terms={terms} onNavigate={onNavigate} onSearch={onSearch} />

          <ShowcaseAtlas />
        </div>
      </section>

      <DarkInversionSection onNavigate={onNavigate} />

      <Footer onNavigate={onNavigate} />
    </div>
  )
}

function DarkInversionSection({ onNavigate }: { onNavigate: HomePageProps["onNavigate"] }) {
  const [activeView, setActiveView] = useState<(typeof dashboardViews)[number]["id"]>("ops")
  const view = dashboardViews.find((item) => item.id === activeView) ?? dashboardViews[0]

  return (
    <section className="relative isolate overflow-hidden bg-black px-4 py-44 text-white md:px-8 lg:px-10">
      <div className="inverted-section-fade" />
      <InvertedField />
      <div className="relative z-30 mx-auto max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Showcase 01 / SaaS</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-normal text-white md:text-6xl">
              Product operations dashboard
            </h2>
            <p className="mt-6 text-base leading-7 text-white/60 md:text-lg">
              A dense SaaS surface built from the current Askewly assets: sidebar navigation, page headings,
              stats, review tables, command actions, and implementation evidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {dashboardViews.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    item.id === activeView
                      ? "border-white bg-white text-black"
                      : "border-white/18 bg-white/[0.03] text-white/58 hover:border-white/45 hover:text-white",
                  )}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-9 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
              {[
                ["Assets", "bento, tables, stats"],
                ["States", "hover, selected, review"],
                ["Output", "site + agent system"],
              ].map(([label, value]) => (
                <div key={label} className="bg-black/70 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/34">{label}</p>
                  <p className="mt-2 text-sm leading-5 text-white/68">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <DashboardShowcase view={view} onNavigate={() => onNavigate({ page: "plus", filter: "nav:plus-application-ui" })} />
        </div>
      </div>
    </section>
  )
}

function DashboardShowcase({
  view,
  onNavigate,
}: {
  view: (typeof dashboardViews)[number]
  onNavigate: () => void
}) {
  return (
    <div className="group relative min-w-0 border border-white/12 bg-black/82 p-2 shadow-[0_24px_120px_rgba(0,0,0,0.5)] backdrop-blur-sm transition hover:border-white/22">
      <div className="grid min-h-[34rem] overflow-hidden border border-white/10 bg-[#f8fafc] text-slate-950 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-slate-950 p-4 text-white lg:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded bg-askewly-violet">
              <LayoutDashboard aria-hidden="true" className="size-4" />
            </span>
            Atlas Ops
          </div>
          <div className="mt-8 space-y-1 text-sm">
            {["Overview", "Surfaces", "Reviews", "Tokens", "Exports"].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "rounded px-3 py-2 transition",
                  index === 2 ? "bg-white text-slate-950" : "text-slate-400 group-hover:text-slate-300",
                )}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-10 border border-white/10 bg-white/[0.04] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/34">Source assets</p>
            <p className="mt-2 text-xs leading-5 text-white/58">sidebar-navigation, stats-sections, tables</p>
          </div>
        </aside>
        <div className="min-w-0 p-4 md:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-askewly-violet">Application UI</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{view.title}</h3>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-askewly-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet"
              type="button"
              onClick={onNavigate}
            >
              Open pattern
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              [view.metric, view.detail],
              ["18", "Interactive states"],
              ["06", "Reference captures"],
            ].map(([value, label], index) => (
              <div key={label} className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-3xl font-semibold tracking-normal text-slate-950">{value}</p>
                <p className="mt-2 text-sm leading-5 text-slate-500">{label}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full", index === 0 ? "w-4/5 bg-askewly-violet" : "w-3/5 bg-askewly-mint")}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-950">Review queue</p>
                <span className="rounded-full bg-askewly-mint/70 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {view.status}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {view.rows.map(([surface, type, status]) => (
                  <div key={surface} className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-[1fr_7rem_5rem]">
                    <span className="font-medium text-slate-950">{surface}</span>
                    <span className="text-slate-500">{type}</span>
                    <span className={cn("font-semibold", status === "Ready" ? "text-askewly-violet" : "text-slate-500")}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">Command actions</p>
              <div className="mt-4 space-y-2">
                {["Generate React", "Copy tokens", "Export assets"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <span>{item}</span>
                    <span className={cn("size-2 rounded-full", index === 0 ? "bg-askewly-violet" : "bg-slate-300")} />
                  </div>
                ))}
              </div>
              <div className="mt-5 border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-300">
                <div>system.surface = saas</div>
                <div>density = operational</div>
                <div>agent.ready = true</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvertedField() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const revealRadius = 48

    function updateBlockReveals(event: PointerEvent) {
      const root = rootRef.current

      if (!root) {
        return
      }

      root.querySelectorAll<HTMLElement>(".inverted-block").forEach((block) => {
        const rect = block.getBoundingClientRect()
        const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right))
        const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom))
        const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY)

        block.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
        block.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)

        if (distance <= revealRadius) {
          block.dataset.revealed = "true"
        } else {
          delete block.dataset.revealed
        }
      })
    }

    function clearBlockReveals() {
      rootRef.current?.querySelectorAll<HTMLElement>(".inverted-block").forEach((block) => {
        delete block.dataset.revealed
      })
    }

    document.addEventListener("pointermove", updateBlockReveals)
    document.addEventListener("pointerleave", clearBlockReveals)

    return () => {
      document.removeEventListener("pointermove", updateBlockReveals)
      document.removeEventListener("pointerleave", clearBlockReveals)
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden="true" className="inverted-field-layer pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <div className="inverted-grid-field" />
      {invertedBlocks.map((block) => (
        <span key={block.id} className={cn("inverted-block", `inverted-block-${block.id}`, block.className)} />
      ))}
    </div>
  )
}

function Footer({ onNavigate }: { onNavigate: HomePageProps["onNavigate"] }) {
  return (
    <footer className="bg-black px-4 pb-12 pt-0 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px] pt-12">
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title} className="bg-black p-6 md:p-7">
              <h2 className="text-sm font-semibold text-white">{column.title}</h2>
              <div className="mt-7 flex flex-col items-start gap-4">
                {column.links.map((link) => (
                  <button
                    key={`${column.title}-${link.label}`}
                    className="text-left text-sm leading-5 text-white/62 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    type="button"
                    onClick={() => onNavigate(link.destination)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-x border-b border-white/10 px-6 py-7 text-sm text-white/56 md:flex-row md:items-center md:justify-between md:px-7">
          <p>Copyright © 2026 Askewly Design.</p>
          <p>A visual library and agent-ready system for product interfaces.</p>
        </div>
      </div>
    </footer>
  )
}

function ShowcaseAtlas() {
  return (
    <div className="mt-16 w-full text-slate-950">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Why Askewly Design?</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
            From visual taste to working UI.
          </h2>
        </div>
        <p className="max-w-md text-base leading-7 text-slate-600">
          Askewly Design turns interaction, layout, motion, and implementation rules into a system that humans can browse and coding agents can use.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-6">
        {atlasItems.map((item) => (
          <AtlasCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function AtlasCard({ item }: { item: (typeof atlasItems)[number] }) {
  return (
    <article
      className={cn(
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-askewly-lavender hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
        item.layout,
      )}
    >
      <div className={cn("grid gap-5 p-6 sm:grid-cols-[5.75rem_minmax(0,1fr)]", item.id === "agent" && "sm:grid-cols-[4.25rem_minmax(0,1fr)]", item.id === "filters" && "lg:grid-cols-[5.75rem_minmax(0,1fr)_14rem]")}>
        <div className="flex items-start justify-center sm:justify-start">
          <LineArtIcon id={item.id} />
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-normal text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
        </div>
        {item.id === "filters" && (
          <div className="hidden rounded border border-slate-200 bg-slate-50 p-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 lg:block">
            Treatment strip / wide editorial surface
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-200 bg-slate-50 p-5">
        <AtlasDemo id={item.id} />
      </div>
    </article>
  )
}

function LineArtIcon({ id }: { id: AtlasItemId }) {
  const Icon = atlasIconMap[id]

  return (
    <span className="flex h-16 w-20 shrink-0 items-start justify-center text-slate-950">
      <Icon aria-hidden="true" className="mt-1 size-11" strokeWidth={1.75} absoluteStrokeWidth />
    </span>
  )
}

function AtlasDemo({ id }: { id: AtlasItemId }) {
  const [filter, setFilter] = useState(62)
  const [shaderMix, setShaderMix] = useState(58)
  const [materialDepth, setMaterialDepth] = useState(3)
  const [materialMode, setMaterialMode] = useState<"paper" | "glass" | "solid" | "dim">("glass")
  const [scrollStory, setScrollStory] = useState(36)
  const [mobileStep, setMobileStep] = useState(0)
  const [cartCount, setCartCount] = useState(1)
  const [agentMode, setAgentMode] = useState<"design" | "code" | "verify">("design")
  const [agentFrame, setAgentFrame] = useState({ left: 17, top: 20, width: 66, height: 136 })
  const [agentContext, setAgentContext] = useState<"DESIGN.md" | "Tokens" | "Patterns" | "Checks">("DESIGN.md")
  const [agentSelected, setAgentSelected] = useState(false)
  const [agentResizing, setAgentResizing] = useState(false)
  const [agentMoving, setAgentMoving] = useState(false)
  const [agentPressed, setAgentPressed] = useState(false)
  const [codexPacked, setCodexPacked] = useState(false)
  const [browserChecked, setBrowserChecked] = useState(false)
  const agentCanvasRef = useRef<HTMLDivElement | null>(null)
  const agentDraggedRef = useRef(false)
  const [cursorField, setCursorField] = useState<CursorFieldCell[]>(() => {
    const cells: CursorFieldCell[] = []
    const columns = 24
    const rows = 18

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        cells.push({
          id: row * columns + column,
          x: 4.5 + column * 4,
          y: 7 + row * 4.9,
          glyph: "-",
          opacity: 0,
          life: 0,
        })
      }
    }

    return cells
  })
  const [commandMode, setCommandMode] = useState<"review" | "ship" | "agent">("review")

  useEffect(() => {
    if (id !== "scroll") return

    const timer = window.setInterval(() => {
      setScrollStory((value) => (value + 2) % 101)
    }, 140)

    return () => window.clearInterval(timer)
  }, [id])

  useEffect(() => {
    if (id !== "shader") return

    const timer = window.setInterval(() => {
      setShaderMix((value) => (value >= 92 ? 18 : value + 2))
    }, 120)

    return () => window.clearInterval(timer)
  }, [id])

  useEffect(() => {
    if (id !== "filters") return

    const timer = window.setInterval(() => {
      setFilter((value) => (value >= 92 ? 34 : value + 3))
    }, 150)

    return () => window.clearInterval(timer)
  }, [id])

  useEffect(() => {
    if (id !== "pointer") return

    const timer = window.setInterval(() => {
      setCursorField((cells) => cells.map((cell) => {
        const life = Math.max(0, cell.life - 1)

        return {
          ...cell,
          life,
          opacity: life > 0 ? 1 : 0,
        }
      }))
    }, 85)

    return () => window.clearInterval(timer)
  }, [id])

  if (id === "agent") {
    const contextCopy = {
      "DESIGN.md": "North star, tone, typography, and component rules travel with the project.",
      Tokens: "Color, spacing, radius, shadow, and motion values are exposed as reusable primitives.",
      Patterns: "Surface recipes explain when to use each layout, state, and interaction model.",
      Checks: "Browser smoke, responsive passes, and interaction notes become agent-readable proof.",
    }
    const chooseAgentLayer = (mode: "design" | "code" | "verify") => {
      setAgentMode(mode)
      const width = mode === "design" ? 66 : mode === "code" ? 30 : 56
      const height = mode === "design" ? 136 : mode === "code" ? 46 : 132
      setAgentFrame((frame) => ({
        ...frame,
        left: (100 - width) / 2,
        top: ((224 - height) / 2 / 224) * 100,
        width,
        height,
      }))
      setAgentSelected(false)
      setAgentPressed(false)
    }
    const startAgentResize = (event: ReactPointerEvent<HTMLSpanElement>, edge: "n" | "e" | "s" | "w" | "nw" | "ne" | "sw" | "se") => {
      event.preventDefault()
      event.stopPropagation()
      flushSync(() => {
        setAgentSelected(true)
        setAgentResizing(true)
      })

      const canvas = agentCanvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const start = agentFrame
      const startX = event.clientX
      const startY = event.clientY
      const minWidth = agentMode === "code" ? 16 : 24
      const maxWidth = 78
      const minHeight = agentMode === "code" ? 24 : 54
      const maxHeight = 172
      const maxLeft = 76
      const maxTop = 45

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dxPercent = ((moveEvent.clientX - startX) / rect.width) * 100
        const dyPx = moveEvent.clientY - startY

        setAgentFrame(() => {
          let nextLeft = start.left
          let nextTop = start.top
          let nextWidth = start.width
          let nextHeight = start.height

          if (edge.includes("e")) {
            nextWidth = Math.min(maxWidth, Math.max(minWidth, start.width + dxPercent))
          }
          if (edge.includes("s")) {
            nextHeight = Math.min(maxHeight, Math.max(minHeight, start.height + dyPx))
          }
          if (edge.includes("w")) {
            const right = start.left + start.width
            nextLeft = Math.min(maxLeft, Math.max(4, start.left + dxPercent))
            nextWidth = Math.min(maxWidth, Math.max(minWidth, right - nextLeft))
            nextLeft = right - nextWidth
          }
          if (edge.includes("n")) {
            const bottom = start.top * rect.height / 100 + start.height
            const nextTopPx = Math.min((maxTop / 100) * rect.height, Math.max(4, (start.top / 100) * rect.height + dyPx))
            nextHeight = Math.min(maxHeight, Math.max(minHeight, bottom - nextTopPx))
            nextTop = ((bottom - nextHeight) / rect.height) * 100
          }

          return { left: nextLeft, top: nextTop, width: nextWidth, height: nextHeight }
        })
      }

      const onPointerUp = () => {
        setAgentResizing(false)
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onPointerUp)
      }

      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onPointerUp, { once: true })
    }
    const startAgentMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if ((event.target as HTMLElement).closest("[data-resize-edge]")) return
      flushSync(() => {
        setAgentSelected(true)
        setAgentMoving(false)
      })

      const canvas = agentCanvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const start = agentFrame
      const startX = event.clientX
      const startY = event.clientY
      agentDraggedRef.current = false

      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        if (Math.hypot(dx, dy) > 3) {
          agentDraggedRef.current = true
          setAgentMoving(true)
        }
        const dxPercent = (dx / rect.width) * 100
        const dyPercent = (dy / rect.height) * 100

        setAgentFrame(() => ({
          ...start,
          left: Math.min(96 - start.width, Math.max(4, start.left + dxPercent)),
          top: Math.min(88 - (start.height / rect.height) * 100, Math.max(4, start.top + dyPercent)),
        }))
      }

      const onPointerUp = () => {
        setAgentMoving(false)
        window.removeEventListener("pointermove", onPointerMove)
        window.removeEventListener("pointerup", onPointerUp)
      }

      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerup", onPointerUp, { once: true })
    }
    const isTinyAsset = agentFrame.width < 28 || agentFrame.height < 54
    const isCompactAsset = agentFrame.width < 46 || agentFrame.height < 112
    const isTallAsset = agentFrame.height > 138
    const isWideAsset = agentFrame.width > 52

    return (
      <div className="grid min-h-[21.8rem] overflow-hidden rounded-md border border-slate-200 bg-white lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="relative min-h-[17rem] bg-slate-50 p-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-slate-300" />
              <span className="size-2 rounded-full bg-slate-300" />
              <span className="size-2 rounded-full bg-slate-300" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Design canvas</p>
          </div>

          <div
            ref={agentCanvasRef}
            className="relative mt-4 h-56 overflow-hidden rounded border border-slate-200 bg-white"
            onPointerDown={(event) => {
              if (!(event.target as HTMLElement).closest("[data-agent-asset='true']")) {
                setAgentSelected(false)
              }
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <button
              className={cn(
                "absolute overflow-visible rounded bg-white text-left shadow-sm transition-[box-shadow,border-color] hover:shadow-md focus:outline-none",
                agentSelected ? "border-2 border-askewly-violet" : "border border-slate-200",
                agentMode === "code" && "rounded-md",
                (agentResizing || agentMoving) && "border-2 border-askewly-violet shadow-[0_0_0_3px_rgba(111,45,189,0.18),0_12px_30px_rgba(111,45,189,0.16)]",
              )}
              style={{
                left: `${agentFrame.left}%`,
                top: `${agentFrame.top}%`,
                width: `${agentFrame.width}%`,
                height: `${agentFrame.height}px`,
                borderColor: agentSelected || agentResizing || agentMoving ? "var(--askewly-violet)" : undefined,
                boxShadow: agentResizing || agentMoving ? "0 0 0 3px rgba(111,45,189,0.18), 0 12px 30px rgba(111,45,189,0.16)" : undefined,
                cursor: agentMoving ? "grabbing" : "grab",
              }}
              data-agent-asset="true"
              type="button"
              onPointerDown={startAgentMove}
              onClick={() => {
                if (agentDraggedRef.current) {
                  agentDraggedRef.current = false
                  return
                }
                setAgentSelected(true)
                if (agentMode === "code") setAgentPressed((value) => !value)
                if (agentMode === "verify") setBrowserChecked((value) => !value)
              }}
            >
              {agentSelected && (
                <>
                  <span className="absolute inset-x-2 -top-1 z-20 h-3 cursor-ns-resize touch-none" data-resize-edge="n" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "n")} />
                  <span className="absolute inset-y-2 -right-1 z-20 w-3 cursor-ew-resize touch-none" data-resize-edge="e" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "e")} />
                  <span className="absolute inset-x-2 -bottom-1 z-20 h-3 cursor-ns-resize touch-none" data-resize-edge="s" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "s")} />
                  <span className="absolute inset-y-2 -left-1 z-20 w-3 cursor-ew-resize touch-none" data-resize-edge="w" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "w")} />
                  <span className="absolute -left-0.5 -top-0.5 z-30 size-2 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize touch-none rounded-sm border border-askewly-violet bg-white" data-resize-edge="nw" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "nw")} />
                  <span className="absolute -right-0.5 -top-0.5 z-30 size-2 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize touch-none rounded-sm border border-askewly-violet bg-white" data-resize-edge="ne" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "ne")} />
                  <span className="absolute -bottom-0.5 -left-0.5 z-30 size-2 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize touch-none rounded-sm border border-askewly-violet bg-white" data-resize-edge="sw" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "sw")} />
                  <span className="absolute -bottom-0.5 -right-0.5 z-30 size-2 translate-x-1/2 translate-y-1/2 cursor-nwse-resize touch-none rounded-sm border border-askewly-violet bg-white" data-resize-edge="se" role="presentation" onClick={(event) => event.stopPropagation()} onPointerDown={(event) => startAgentResize(event, "se")} />
                </>
              )}
              <div
                className={cn(
                  "flex h-full min-h-0 flex-col overflow-hidden rounded-[3px]",
                  agentMode === "code" ? "items-center justify-center p-2" : isCompactAsset ? "p-2" : "p-3",
                )}
              >
                {agentMode === "code" ? (
                  <span
                    className={cn(
                      "inline-flex h-full w-full items-center justify-center truncate rounded font-semibold leading-none transition",
                      agentPressed ? "translate-y-px bg-askewly-violet text-white shadow-inner" : "bg-slate-950 text-white shadow-sm",
                    )}
                    style={{ fontSize: `${Math.max(7, Math.min(14, agentFrame.height / 6.2))}px`, paddingInline: `${Math.max(5, Math.min(18, agentFrame.width / 3))}px` }}
                  >
                    {isTinyAsset ? "Go" : agentPressed ? "Pressed" : "Get Started"}
                  </span>
                ) : agentMode === "verify" ? (
                  <div className={cn("grid min-h-0 flex-1 overflow-hidden", isCompactAsset ? "gap-1.5" : "gap-2", isWideAsset && "mt-2")}>
                    <div className={cn("grid min-h-0 gap-2", isWideAsset ? "grid-cols-[minmax(0,1fr)_auto] items-start" : "grid-cols-1")}>
                      <div className="min-w-0">
                        <p className={cn("truncate font-semibold text-slate-950", isCompactAsset ? "text-[11px]" : "text-sm")}>UI surface review</p>
                        {!isTinyAsset && !isCompactAsset && <p className="truncate text-[9px] text-slate-500">Landing card / interaction</p>}
                      </div>
                      {!isCompactAsset && isWideAsset && <span className="shrink-0 rounded-full bg-askewly-mint px-2 py-1 text-[9px] font-semibold text-askewly-violet">Ready</span>}
                    </div>
                    <div className={cn("grid min-h-0 gap-1.5", isCompactAsset ? "grid-cols-1" : isWideAsset ? "grid-cols-3" : "grid-cols-2")}>
                      <div className="min-w-0 rounded border border-slate-200 bg-slate-50 p-1.5">
                        <p className="text-[8px] uppercase tracking-[0.12em] text-slate-400">Score</p>
                        <p className="mt-1 text-xs font-semibold text-slate-950">92</p>
                      </div>
                      {!isCompactAsset && <div className="min-w-0 rounded border border-slate-200 bg-slate-50 p-1.5"><p className="text-[8px] uppercase tracking-[0.12em] text-slate-400">State</p><p className="mt-1 text-xs font-semibold text-slate-950">Open</p></div>}
                      {!isCompactAsset && isWideAsset && <div className="min-w-0 rounded border border-slate-200 bg-askewly-mint/35 p-1.5"><p className="text-[8px] uppercase tracking-[0.12em] text-askewly-violet">Agent</p><p className="mt-1 text-xs font-semibold text-slate-950">Pass</p></div>}
                    </div>
                    {isTallAsset && <div className="grid gap-1.5"><div className="h-1.5 rounded bg-slate-200" /><div className="h-1.5 w-2/3 rounded bg-slate-200" /></div>}
                  </div>
                ) : (
                  <div className={cn("min-h-0 flex-1 overflow-hidden", isCompactAsset ? "grid content-start gap-1.5" : "grid content-start gap-2")}>
                    <div className={cn("grid gap-2", isCompactAsset ? "grid-cols-1" : "grid-cols-[1fr_2.5rem] items-start")}>
                      <div className="min-w-0">
                        <p className={cn("truncate font-semibold tracking-normal text-slate-950", isCompactAsset ? "text-sm" : "text-lg leading-5")}>Askewly Design</p>
                        {!isTinyAsset && <p className={cn("text-slate-500", isCompactAsset ? "truncate text-[9px]" : "line-clamp-2 text-[10px] leading-4")}>A visual library and agent-ready system for better product interfaces.</p>}
                      </div>
                      {!isCompactAsset && <div className="size-9 rounded bg-[linear-gradient(135deg,var(--askewly-mint),var(--askewly-lavender))] shadow-sm" />}
                    </div>
                    <div className={cn("flex gap-2", isCompactAsset && "mt-1")}>
                      <span className={cn("rounded bg-askewly-violet text-center font-semibold text-white", isCompactAsset ? "h-4 w-12 text-[8px] leading-4" : "h-5 w-16 max-w-[48%] text-[9px] leading-5")}>Start</span>
                      {!isCompactAsset && <span className="h-5 w-14 max-w-[36%] rounded border border-slate-200 text-center text-[9px] font-semibold leading-5 text-slate-500">Docs</span>}
                    </div>
                    {isTallAsset && <div className="mt-1 rounded border border-slate-200 px-2 py-1 text-[9px] text-slate-400">Search patterns, components, docs...</div>}
                    {isTallAsset && !isCompactAsset && <div className="grid grid-cols-3 gap-1.5"><span className="h-6 rounded border border-slate-200 bg-slate-50" /><span className="h-6 rounded border border-slate-200 bg-slate-50" /><span className="h-6 rounded border border-slate-200 bg-slate-50" /></div>}
                  </div>
                )}
              </div>
            </button>
          </div>
          <div className="mt-3 rounded border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex gap-2">
                <button className={cn("rounded border px-3 py-2 text-xs font-semibold transition", agentMode === "code" ? "border-askewly-violet bg-askewly-lavender/20 text-askewly-violet" : "border-slate-200 bg-white text-slate-500 hover:border-askewly-lavender")} type="button" onClick={() => chooseAgentLayer("code")}>Button</button>
                <button className={cn("rounded border px-3 py-2 text-xs font-semibold transition", agentMode === "verify" ? "border-askewly-violet bg-askewly-lavender/20 text-askewly-violet" : "border-slate-200 bg-white text-slate-500 hover:border-askewly-lavender")} type="button" onClick={() => chooseAgentLayer("verify")}>Card</button>
                <button className={cn("rounded border px-3 py-2 text-xs font-semibold transition", agentMode === "design" ? "border-askewly-violet bg-askewly-lavender/20 text-askewly-violet" : "border-slate-200 bg-white text-slate-500 hover:border-askewly-lavender")} type="button" onClick={() => chooseAgentLayer("design")}>Hero</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col border-t border-slate-200 bg-white p-4 lg:border-l lg:border-t-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Agent Context</p>
          <div className="mt-4 space-y-2">
            {["DESIGN.md", "Tokens", "Patterns", "Checks"].map((item, index) => (
              <button key={item} className={cn("flex w-full items-center justify-between rounded border px-3 py-2 text-left transition", agentContext === item ? "border-askewly-violet bg-askewly-lavender/15" : "border-slate-200 bg-slate-50 hover:border-askewly-lavender")} type="button" onClick={() => setAgentContext(item as typeof agentContext)}>
                <span className="text-xs font-semibold text-slate-700">{item}</span>
                <span className={cn("size-1.5 rounded-full", index < 3 ? "bg-askewly-violet" : "bg-askewly-mint")} />
              </button>
            ))}
          </div>
          <p className="mt-3 min-h-[4rem] rounded border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">{contextCopy[agentContext]}</p>
          <div className="mt-auto grid gap-2 pt-4">
            <button className={cn("rounded-full px-2 py-1 text-center font-semibold uppercase leading-none tracking-[0.08em] transition", codexPacked ? "bg-askewly-violet text-white" : "bg-slate-950 text-white hover:bg-slate-800")} style={{ fontSize: "8px" }} type="button" onClick={() => setCodexPacked((value) => !value)}>
              {codexPacked ? "Context packed" : "Ready for Codex"}
            </button>
            <button className={cn("rounded-full border px-2 py-1 text-center font-semibold uppercase leading-none tracking-[0.08em] transition", browserChecked ? "border-askewly-violet bg-askewly-lavender/15 text-askewly-violet" : "border-slate-200 bg-white text-slate-500 hover:border-askewly-lavender")} style={{ fontSize: "8px" }} type="button" onClick={() => setBrowserChecked((value) => !value)}>
              {browserChecked ? "Browser checked" : "Run browser check"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (id === "pointer") {
    return (
      <div
        className="relative h-[22.5rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          const x = ((event.clientX - rect.left) / rect.width) * 100
          const y = ((event.clientY - rect.top) / rect.height) * 100

          setCursorField((cells) => cells.map((cell) => {
            const distance = Math.hypot(cell.x - x, cell.y - y)
            const influence = Math.max(0, 1 - distance / 7)

            if (influence <= 0) {
              return cell
            }

            const cluster = Math.floor(cell.x / 18) + Math.floor(cell.y / 15) + Math.floor(x / 22) + Math.floor(y / 20)
            const glyph = influence > 0.76 ? "o" : cluster % 5 === 0 ? "_" : ">"
            const life = Math.max(cell.life, Math.round(2 + influence * 13))

            return {
              ...cell,
              glyph,
              life,
              opacity: 1,
            }
          }))
        }}
      >
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(15,23,42,0.042)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.042)_1px,transparent_1px)] [background-size:34px_34px]" />
        {cursorField.map((cell) => (
          <span
            key={cell.id}
            className="absolute font-mono text-[13px] font-medium leading-none text-black"
            style={{
              left: `${cell.x}%`,
              top: `${cell.y}%`,
              opacity: cell.opacity,
              transform: "translate(-50%, -50%)",
            }}
          >
            {cell.glyph}
          </span>
        ))}
      </div>
    )
  }

  if (id === "physics") {
    return <MatterPhysicsDemo />
  }

  if (id === "scroll") {
    const chapter = scrollStory < 34 ? "brief" : scrollStory < 68 ? "system" : "proof"

    return (
      <div className="min-h-[17.65rem]">
        <div className="relative h-64 overflow-hidden rounded-md border border-slate-200 bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(111,45,189,0.45),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(185,250,248,0.35),transparent_28%)]" />
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-white/10"><div className="w-full bg-askewly-mint transition-all" style={{ height: `${scrollStory}%` }} /></div>
          <div className="absolute left-8 top-8 max-w-[15rem] transition" style={{ transform: `translateY(${scrollStory > 50 ? -8 : 0}px)`, opacity: 0.72 + scrollStory / 360 }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">scroll chapter</p>
            <p className="mt-3 text-3xl font-semibold capitalize">{chapter}</p>
            <p className="mt-3 text-sm leading-6 text-white/62">{chapter === "brief" ? "Open with a sharp visual promise." : chapter === "system" ? "Reveal the rules behind the interface." : "End with proof, code, and reusable assets."}</p>
          </div>
          <div className="absolute right-8 top-8 grid gap-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-16 w-32 rounded border border-white/15 bg-white/10 backdrop-blur transition"
                style={{ transform: `translateY(${(index * 22) - scrollStory / (index + 2)}px)`, opacity: scrollStory / 120 + 0.2 + index * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (id === "filters") {
    const treatment = filter < 50 ? "duotone" : filter < 76 ? "focus" : "grain"

    return (
      <div className="grid min-h-[18.6rem] gap-4 lg:grid-cols-[12rem_1fr_12rem]">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">treatment</p>
          <p className="mt-4 text-3xl font-semibold capitalize text-slate-950">{treatment}</p>
          <div className="mt-6 h-1.5 overflow-hidden rounded bg-slate-100">
            <div className="h-full rounded bg-askewly-violet transition-all" style={{ width: `${filter}%` }} />
          </div>
          <div className="mt-6 space-y-2 text-xs font-semibold text-slate-500">
            <div className="flex justify-between"><span>blur</span><span>{((100 - filter) / 30).toFixed(1)}</span></div>
            <div className="flex justify-between"><span>saturation</span><span>{(0.7 + filter / 42).toFixed(1)}</span></div>
            <div className="flex justify-between"><span>contrast</span><span>{(0.86 + filter / 140).toFixed(1)}</span></div>
          </div>
        </div>
        <div className="relative min-h-[17rem] overflow-hidden rounded-md border border-slate-200 bg-white">
          <div
            className="absolute inset-4 rounded bg-[radial-gradient(circle_at_22%_30%,var(--askewly-mint),transparent_20%),radial-gradient(circle_at_68%_55%,var(--askewly-violet),transparent_24%),radial-gradient(circle_at_82%_24%,var(--askewly-sky),transparent_16%),linear-gradient(135deg,#f8fafc,#cbd5e1)] transition"
            style={{ filter: `blur(${(100 - filter) / 30}px) saturate(${0.7 + filter / 42}) contrast(${0.86 + filter / 140})` }}
          />
          <div className="absolute inset-4 bg-[radial-gradient(circle_at_32%_35%,transparent_0_18%,rgba(255,255,255,0.72)_19%_100%)] opacity-70 transition" style={{ transform: `translateX(${filter / 10 - 7}px)` }} />
          <div className="absolute inset-0 opacity-25 mix-blend-multiply [background-image:repeating-linear-gradient(0deg,rgba(15,23,42,0.16)_0_1px,transparent_1px_5px)]" />
          <div className="absolute inset-x-10 bottom-8 h-14 rounded bg-white/78 shadow-sm backdrop-blur" />
        </div>
        <div className="grid gap-3">
          {["duotone", "focus", "grain"].map((item, index) => (
            <button key={item} className={cn("rounded-md border bg-white p-3 text-left transition hover:border-askewly-lavender", treatment === item ? "border-askewly-violet shadow-sm" : "border-slate-200")} type="button" onClick={() => setFilter([42, 72, 88][index])}>
              <span className="font-semibold capitalize text-slate-950">{item}</span>
              <span className="mt-2 block h-1.5 rounded bg-slate-100"><span className="block h-full rounded bg-askewly-violet" style={{ width: `${[42, 72, 88][index]}%` }} /></span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (id === "material") {
    const materialStyle = {
      paper: "border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]",
      glass: "border-white/70 bg-white/58 shadow-[0_22px_54px_rgba(111,45,189,0.14)] backdrop-blur-xl",
      solid: "border-slate-950 bg-slate-950 text-white shadow-[0_22px_54px_rgba(15,23,42,0.26)]",
      dim: "border-slate-700/30 bg-slate-900/72 text-white shadow-[0_22px_54px_rgba(15,23,42,0.34)] backdrop-blur",
    } satisfies Record<typeof materialMode, string>

    return (
      <div className="min-h-[18.6rem]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {(["paper", "glass", "solid", "dim"] as const).map((item) => (
              <button key={item} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition", materialMode === item ? "border-askewly-violet bg-askewly-lavender/20 text-askewly-violet" : "border-slate-200 bg-white text-slate-500 hover:border-askewly-lavender")} type="button" onClick={() => setMaterialMode(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-500">
            <button className="size-6 rounded-full hover:bg-slate-100" type="button" onClick={() => setMaterialDepth((value) => Math.max(1, value - 1))}>-</button>
            <span className="w-5 text-center">{materialDepth}</span>
            <button className="size-6 rounded-full hover:bg-slate-100" type="button" onClick={() => setMaterialDepth((value) => Math.min(5, value + 1))}>+</button>
          </div>
        </div>
        <div className="relative h-56 overflow-hidden rounded-md border border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#e2e8f0)] p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(185,250,248,0.64),transparent_24%),radial-gradient(circle_at_72%_70%,rgba(178,152,220,0.45),transparent_28%)]" />
          {Array.from({ length: materialDepth }).map((_, index) => (
            <div
              key={index}
              className={cn("absolute rounded-md border p-4 transition-all", materialStyle[materialMode])}
              style={{
                left: `${14 + index * 9}%`,
                top: `${18 + index * 7}%`,
                width: `${56 - index * 4}%`,
                height: `${8.5 - index * 0.3}rem`,
                zIndex: index + 1,
              }}
            >
              <div className={cn("h-2 w-20 rounded", materialMode === "solid" || materialMode === "dim" ? "bg-white/80" : "bg-slate-950/70")} />
              <div className={cn("mt-4 h-2 w-32 rounded", materialMode === "solid" || materialMode === "dim" ? "bg-white/24" : "bg-slate-400/35")} />
              {index === materialDepth - 1 && (
                <div className={cn("mt-5 grid grid-cols-3 gap-1.5", materialDepth < 3 && "hidden")}>
                  <span className={cn("h-6 rounded", materialMode === "solid" || materialMode === "dim" ? "bg-white/10" : "bg-slate-100")} />
                  <span className={cn("h-6 rounded", materialMode === "solid" || materialMode === "dim" ? "bg-white/10" : "bg-slate-100")} />
                  <span className={cn("h-6 rounded", materialMode === "solid" || materialMode === "dim" ? "bg-white/10" : "bg-slate-100")} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === "shader") {
    return (
      <div className="min-h-[17.65rem]">
        <div className="relative h-56 overflow-hidden rounded-md border border-slate-200 bg-slate-950">
          <div
            className="absolute inset-0 transition"
            style={{
              background: `radial-gradient(circle at ${shaderMix}% 28%, var(--askewly-mint), transparent 24%), radial-gradient(circle at ${100 - shaderMix}% 70%, var(--askewly-violet), transparent 30%), linear-gradient(135deg, #020617, var(--askewly-orchid) ${shaderMix}%, var(--askewly-sky))`,
            }}
          />
          <div className="absolute inset-0 visual-aurora-one bg-[radial-gradient(circle_at_36%_42%,rgba(255,255,255,0.38),transparent_24%)] mix-blend-overlay" />
          <div className="absolute inset-0 visual-aurora-two bg-[radial-gradient(circle_at_72%_62%,rgba(185,250,248,0.35),transparent_28%)] mix-blend-screen" />
          <div className="absolute inset-0 mix-blend-overlay opacity-45 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_1px,transparent_1px_7px)]" />
        </div>
      </div>
    )
  }

  if (id === "motion") {
    const lanes = [
      { label: "linear", color: "#111827", x: 222, y: 42, keySplines: "0 0 1 1;0 0 1 1" },
      { label: "ease-out", color: "#06B6D4", x: 212, y: 90, keySplines: "0.16 1 0.3 1;0.7 0 0.84 0" },
      { label: "ease-in-out", color: "var(--askewly-violet)", x: 204, y: 138, keySplines: "0.65 0 0.35 1;0.65 0 0.35 1" },
      { label: "spring", color: "#F472B6", x: 194, y: 184, keySplines: "0.22 1 0.36 1;0.45 0 0.55 1" },
    ]

    return (
      <div className="relative h-72 overflow-hidden rounded-md border border-slate-200 bg-white">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 260 230">
          <circle cx="130" cy="114" r="5" fill="#0F172A" />
          <circle cx="130" cy="114" r="82" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="1.4" />
          {lanes.map((lane, index) => (
            <g key={lane.label}>
              <line x1="130" y1="114" x2={lane.x} y2={lane.y} stroke="rgba(15,23,42,0.13)" strokeWidth="1" />
              <text x="18" y={36 + index * 45} fill="#64748B" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.3">{lane.label}</text>
              <circle cx="130" cy="114" r="7" fill={lane.color}>
                <animate attributeName="cx" dur="2.8s" repeatCount="indefinite" values={`130;${lane.x};130`} keyTimes="0;0.5;1" calcMode="spline" keySplines={lane.keySplines} />
                <animate attributeName="cy" dur="2.8s" repeatCount="indefinite" values={`114;${lane.y};114`} keyTimes="0;0.5;1" calcMode="spline" keySplines={lane.keySplines} />
              </circle>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  if (id === "command") {
    const commandRows = {
      review: [
        ["Inspect docs leaf", "visual delta", "Ready"],
        ["Tune landing card", "interaction", "Open"],
        ["Check dark mode", "theme gate", "Ready"],
      ],
      ship: [
        ["Build preview", "npm run build", "Ready"],
        ["Chrome smoke", "local tab", "Open"],
        ["Write handoff", "phase log", "Queued"],
      ],
      agent: [
        ["DESIGN.md", "tokens", "Ready"],
        ["Component intent", "copyable", "Ready"],
        ["Verification signal", "browser", "Open"],
      ],
    } satisfies Record<typeof commandMode, Array<[string, string, string]>>

    return (
      <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-3 sm:grid-cols-[8rem_1fr]">
        <aside className="rounded bg-slate-950 p-3 text-xs font-semibold text-white">
          <p>Command</p>
          <div className="mt-4 space-y-1">
            {(["review", "ship", "agent"] as const).map((item) => (
              <button
                key={item}
                className={cn("block w-full rounded px-2 py-1.5 text-left capitalize transition", commandMode === item ? "bg-white text-slate-950" : "text-slate-400 hover:bg-white/10 hover:text-white")}
                type="button"
                onClick={() => setCommandMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>
        <div>
          <div className="rounded border border-slate-200 bg-slate-50 p-2">
            <div className="flex items-center gap-2 rounded bg-white px-3 py-2 text-sm font-semibold text-slate-500 shadow-sm">
              <Search aria-hidden="true" className="size-4" />
              <span>{commandMode === "review" ? "Find interaction gaps..." : commandMode === "ship" ? "Run release checks..." : "Package agent assets..."}</span>
            </div>
          </div>
          <div className="mt-3 rounded border border-slate-200">
            {commandRows[commandMode].map(([label, meta, status]) => (
              <button key={label} className="grid w-full gap-2 border-b border-slate-100 p-3 text-left last:border-b-0 sm:grid-cols-[1fr_6.5rem_4.5rem]" type="button">
                <span className="font-semibold text-slate-950">{label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{meta}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em]", status === "Ready" ? "bg-askewly-mint/70 text-slate-700" : "bg-askewly-lavender/20 text-askewly-violet")}>{status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (id === "commerce") {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <div className="relative size-24 overflow-hidden rounded bg-[linear-gradient(135deg,var(--askewly-sky),var(--askewly-mint))]">
            <div className="absolute left-4 top-4 size-14 rounded-full border border-white/80 bg-white/30" />
            <div className="absolute bottom-3 right-3 size-7 rounded bg-slate-950/80" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-950">Soft shell pack</p>
            <p className="text-sm text-slate-500">$128.00 · Ships today</p>
            <div className="mt-3 flex items-center gap-2">
              <button className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-askewly-violet" type="button" onClick={() => setCartCount((value) => value + 1)}>Add</button>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">cart {cartCount}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-semibold text-slate-500">
          {["Fit", "Ship", "Pay"].map((item, index) => <span key={item} className={cn("rounded border p-2 text-center", index < cartCount % 4 ? "border-askewly-violet text-askewly-violet" : "border-slate-200")}>{item}</span>)}
        </div>
      </div>
    )
  }

  if (id === "landing") {
    return (
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="relative min-h-[19.1rem] overflow-hidden bg-white p-5">
          <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute right-5 top-5 grid gap-4">
            <span className="h-14 w-4 bg-slate-950 transition group-hover:translate-y-3" />
            <span className="ml-8 h-10 w-3 bg-slate-400/45 transition group-hover:-translate-y-2" />
            <span className="h-16 w-5 bg-askewly-violet transition group-hover:translate-x-2" />
          </div>
          <div className="relative max-w-[18rem]">
            <p className="text-4xl font-semibold leading-[0.92] tracking-normal text-slate-950">Askewly Design</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">A visual library and agent-ready system for designing better product interfaces.</p>
            <div className="mt-5 flex gap-2">
              <button className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition active:translate-y-px" type="button">Get Started</button>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition active:translate-y-px" type="button">Open Docs</button>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2">
            {["SaaS", "Commerce", "Mobile"].map((item) => (
              <div key={item} className="rounded border border-slate-200 bg-white/82 p-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition group-hover:-translate-y-1">{item}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (id === "mobile") {
    const steps = ["Account", "Billing", "Alerts"]
    return (
      <div className="mx-auto max-w-[14rem] rounded-[1.7rem] border border-slate-200 bg-slate-100 p-2 shadow-sm">
        <button className="w-full rounded-[1.25rem] bg-white p-4 text-left" type="button" onClick={() => setMobileStep((value) => (value + 1) % steps.length)}>
          <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />
          <p className="mt-6 text-xs font-semibold text-slate-400">Tap to advance</p>
          <p className="mt-3 text-xl font-semibold text-slate-950">{steps[mobileStep]}</p>
          <div className="mt-4 grid gap-2">
            {steps.map((item, index) => (
              <span key={item} className={cn("rounded border px-3 py-2 text-xs font-semibold transition", index === mobileStep ? "border-askewly-violet bg-askewly-lavender/15 text-askewly-violet" : "border-slate-200 text-slate-500")}>{item}</span>
            ))}
          </div>
          <div className="mt-4 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-askewly-violet transition-all" style={{ width: `${(mobileStep + 1) * 33}%` }} /></div>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[22.2rem] rounded-md border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
        {(["design", "code", "verify"] as const).map((item) => (
          <button key={item} className={cn("rounded border p-3 capitalize transition", agentMode === item ? "border-askewly-violet bg-askewly-lavender/15 text-askewly-violet" : "border-slate-200 text-slate-500 hover:border-askewly-lavender")} type="button" onClick={() => setAgentMode(item)}>{item}</button>
        ))}
      </div>
      <div className="mt-4 rounded bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-300">
        <div>mode = {agentMode}</div>
        <div>tokens = DESIGN.md</div>
        <div>{agentMode === "verify" ? "chrome.smoke = required" : agentMode === "code" ? "component.path = src/components" : "taste = Askewly"}</div>
      </div>
    </div>
  )
}

type MatterTokenShape = "circle" | "rect"

type MatterTokenSpec = {
  id: string
  label: string
  shape: MatterTokenShape
  width: number
  height: number
  className: string
}

type MatterTokenRecord = MatterTokenSpec & {
  body: Matter.Body
}

type MatterTokenRender = MatterTokenSpec & {
  x: number
  y: number
  angle: number
}

const matterTokenSpecs: MatterTokenSpec[] = [
  { id: "card", label: "Card", shape: "rect", width: 94, height: 46, className: "border-slate-950 bg-white text-slate-950" },
  { id: "button", label: "CTA", shape: "rect", width: 72, height: 34, className: "border-askewly-violet bg-askewly-violet text-white" },
  { id: "token", label: "Token", shape: "circle", width: 54, height: 54, className: "border-askewly-lavender bg-askewly-lavender/45 text-slate-950" },
  { id: "menu", label: "Menu", shape: "rect", width: 86, height: 38, className: "border-slate-300 bg-slate-50 text-slate-700" },
  { id: "input", label: "Input", shape: "rect", width: 102, height: 36, className: "border-askewly-sky bg-askewly-sky/45 text-slate-950" },
  { id: "chip", label: "Chip", shape: "circle", width: 42, height: 42, className: "border-slate-950 bg-slate-950 text-white" },
  { id: "surface", label: "Panel", shape: "rect", width: 96, height: 52, className: "border-askewly-mint bg-askewly-mint/55 text-slate-950" },
  { id: "dot", label: "UI", shape: "circle", width: 38, height: 38, className: "border-slate-300 bg-white text-slate-500" },
]

function MatterPhysicsDemo() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const recordsRef = useRef<MatterTokenRecord[]>([])
  const pointerRef = useRef({ active: false, x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)
  const [tokens, setTokens] = useState<MatterTokenRender[]>([])

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const element = root
    const engine = Matter.Engine.create()
    engine.gravity.y = 0.45
    engineRef.current = engine

    function syncTokens() {
      setTokens(recordsRef.current.map((record) => ({
        id: record.id,
        label: record.label,
        shape: record.shape,
        width: record.width,
        height: record.height,
        className: record.className,
        x: record.body.position.x,
        y: record.body.position.y,
        angle: record.body.angle,
      })))
    }

    function rebuildWorld() {
      const width = element.clientWidth
      const height = element.clientHeight

      if (width <= 0 || height <= 0) {
        return
      }

      Matter.Composite.clear(engine.world, false)
      recordsRef.current = []

      const wallThickness = 72
      const walls = [
        Matter.Bodies.rectangle(width / 2, height + wallThickness / 2 - 18, width + wallThickness * 2, wallThickness, { isStatic: true }),
        Matter.Bodies.rectangle(-wallThickness / 2 + 8, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
        Matter.Bodies.rectangle(width + wallThickness / 2 - 8, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
        Matter.Bodies.rectangle(width / 2, -wallThickness / 2 + 4, width + wallThickness * 2, wallThickness, { isStatic: true }),
      ]

      const records = matterTokenSpecs.map((spec, index) => {
        const column = index % 4
        const row = Math.floor(index / 4)
        const x = width * (0.18 + column * 0.19)
        const y = height * (0.2 + row * 0.16)
        const commonOptions: Matter.IBodyDefinition = {
          restitution: 0.68,
          friction: 0.42,
          frictionAir: 0.018,
          density: 0.00075,
          angle: (index % 2 === 0 ? -1 : 1) * (0.08 + index * 0.015),
        }
        const body = spec.shape === "circle"
          ? Matter.Bodies.circle(x, y, spec.width / 2, commonOptions)
          : Matter.Bodies.rectangle(x, y, spec.width, spec.height, {
              ...commonOptions,
              chamfer: { radius: Math.min(14, spec.height / 2 - 2) },
            })

        Matter.Body.setVelocity(body, {
          x: (index % 2 === 0 ? 1 : -1) * (0.4 + index * 0.06),
          y: 0.2 + index * 0.04,
        })

        return { ...spec, body }
      })

      recordsRef.current = records
      Matter.Composite.add(engine.world, [...walls, ...records.map((record) => record.body)])
      syncTokens()
    }

    const observer = new ResizeObserver(rebuildWorld)
    observer.observe(element)
    rebuildWorld()

    let previousTime = performance.now()
    let previousRenderTime = 0

    function tick(time: number) {
      const delta = Math.min(1000 / 30, Math.max(1000 / 90, time - previousTime))
      previousTime = time

      if (pointerRef.current.active) {
        const forceRadius = 170

        for (const record of recordsRef.current) {
          const dx = record.body.position.x - pointerRef.current.x
          const dy = record.body.position.y - pointerRef.current.y
          const distance = Math.max(1, Math.hypot(dx, dy))
          const force = Math.max(0, 1 - distance / forceRadius)

          if (force > 0) {
            Matter.Sleeping.set(record.body, false)
            Matter.Body.applyForce(record.body, record.body.position, {
              x: (dx / distance) * force * 0.014,
              y: (dy / distance) * force * 0.014,
            })
          }
        }
      }

      Matter.Engine.update(engine, delta)

      if (time - previousRenderTime > 24) {
        syncTokens()
        previousRenderTime = time
      }

      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      observer.disconnect()

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      Matter.Composite.clear(engine.world, false)
      Matter.Engine.clear(engine)
      engineRef.current = null
      recordsRef.current = []
    }
  }, [])

  function updatePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerRef.current = {
      active: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  return (
    <div
      ref={rootRef}
      aria-label="Matter.js rigid-body interaction demo"
      className="relative h-[22.5rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950"
      onPointerMove={updatePointer}
      onPointerEnter={updatePointer}
      onPointerLeave={() => {
        pointerRef.current.active = false
      }}
    >
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute inset-x-5 bottom-5 h-px bg-slate-950/18" />
      {tokens.map((token) => (
        <div
          key={token.id}
          className={cn(
            "absolute flex select-none items-center justify-center border text-[11px] font-semibold tracking-normal shadow-sm will-change-transform",
            token.shape === "circle" ? "rounded-full" : "rounded-md",
            token.className,
          )}
          style={{
            width: token.width,
            height: token.height,
            transform: `translate3d(${token.x - token.width / 2}px, ${token.y - token.height / 2}px, 0) rotate(${token.angle}rad)`,
          }}
        >
          {token.label}
        </div>
      ))}
    </div>
  )
}

function FloatingField() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const revealRadius = 48

    function updateBlockReveals(event: PointerEvent) {
      const root = rootRef.current

      if (!root) {
        return
      }

      root.querySelectorAll<HTMLElement>(".floating-block").forEach((block) => {
        const rect = block.getBoundingClientRect()
        const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right))
        const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom))
        const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY)

        block.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`)
        block.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`)

        if (distance <= revealRadius) {
          block.dataset.revealed = "true"
        } else {
          delete block.dataset.revealed
        }
      })
    }

    function clearBlockReveals() {
      rootRef.current?.querySelectorAll<HTMLElement>(".floating-block").forEach((block) => {
        delete block.dataset.revealed
      })
    }

    document.addEventListener("pointermove", updateBlockReveals)
    document.addEventListener("pointerleave", clearBlockReveals)

    return () => {
      document.removeEventListener("pointermove", updateBlockReveals)
      document.removeEventListener("pointerleave", clearBlockReveals)
    }
  }, [])

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[68rem] overflow-hidden">
      <div className="floating-grid-field" />
      {floatingBlocks.map((block) => (
        <span
          key={block.id}
          className={cn("floating-block", `floating-block-${block.id}`, `floating-block-${block.tone}`, block.className)}
        />
      ))}
      <div className="floating-field-fade" />
    </div>
  )
}

function HeroSearch({
  filter,
  terms,
  onNavigate,
  onSearch,
}: {
  filter: TermFilter
  terms: VocabularyTerm[]
  onNavigate: HomePageProps["onNavigate"]
  onSearch: HomePageProps["onSearch"]
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [draftQuery, setDraftQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const suggestions = useMemo(() => getSearchSuggestions(terms, draftQuery, filter, 7), [draftQuery, filter, terms])
  const open = focused && suggestions.length > 0

  useEffect(() => {
    if (!focused) {
      return
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      const target = event.target as Node | null
      if (target && rootRef.current?.contains(target)) {
        return
      }

      setFocused(false)
      setActiveIndex(0)
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer)
    }
  }, [focused])

  function commitQuery(value = draftQuery) {
    const nextQuery = value.trim()
    if (!nextQuery) {
      inputRef.current?.focus()
      setFocused(true)
      return
    }

    setDraftQuery(nextQuery)
    setFocused(false)
    setActiveIndex(0)
    onSearch(nextQuery)
  }

  function selectSuggestion(suggestion: SearchSuggestion) {
    if (suggestion.type === "category" || suggestion.type === "group") {
      setDraftQuery("")
      setFocused(false)
      setActiveIndex(0)
      const page = suggestion.filter.startsWith("nav:docs-") ? "docs" : "plus"
      onNavigate({ page, filter: suggestion.filter })
      return
    }

    commitQuery(suggestion.value)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault()
      setFocused(true)
      setActiveIndex((current) => (current + 1) % suggestions.length)
    }
    if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault()
      setFocused(true)
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
    }
    if (event.key === "Enter") {
      event.preventDefault()
      const activeSuggestion = open ? suggestions[activeIndex] : undefined
      if (activeSuggestion) {
        selectSuggestion(activeSuggestion)
      } else {
        commitQuery()
      }
    }
    if (event.key === "Escape") {
      setFocused(false)
      setActiveIndex(0)
    }
  }

  return (
    <div ref={rootRef} className="relative mt-7 w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition focus-within:border-askewly-orchid focus-within:ring-2 focus-within:ring-askewly-violet/20">
        <Search aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-label="Askewly Design 검색"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
          placeholder="Search patterns, components, docs, and examples..."
          value={draftQuery}
          onChange={(event) => {
            setDraftQuery(event.target.value)
            setFocused(true)
            setActiveIndex(0)
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="hidden rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500 transition hover:border-askewly-lavender hover:text-askewly-violet sm:inline"
          type="button"
          onClick={() => commitQuery()}
        >
          Ctrl F
        </button>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-slate-200 bg-white p-2 text-left shadow-xl shadow-slate-950/10">
          <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {draftQuery.trim() ? "Suggested results" : "Quick search"}
          </p>
          <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                className={cn(
                  "flex min-w-0 items-start gap-3 rounded-md px-3 py-2 text-left transition",
                  index === activeIndex ? "bg-askewly-lavender/15 text-slate-950" : "hover:bg-slate-50",
                )}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
              >
                <Search aria-hidden="true" className="mt-1 size-4 shrink-0 text-askewly-violet" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-950">{suggestion.label}</span>
                  <span className="block truncate text-xs leading-5 text-slate-500">{suggestion.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
