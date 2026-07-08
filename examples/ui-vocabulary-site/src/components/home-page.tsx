import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import * as Matter from "matter-js"
import { MeshGradient } from "@paper-design/shaders-react"
import {
  ArrowRight,
  ArrowUp,
  Check,
  Command,
  Copy,
  FileCode2,
  Pipette,
  List,
  Lock,
  MoveHorizontal,
  Palette,
  Play,
  Plus,
  Shuffle,
  SkipBack,
  SkipForward,
  Download,
  LayoutDashboard,
  Magnet,
  MousePointerClick,
  PanelsTopLeft,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Unlock,
  WandSparkles,
  X,
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
  { id: "agent", title: "Agent-Ready Design System", copy: "Talk to an agent docked to your canvas: humanize, fix, and animate the UI in place, then hand the build off to Codex or Claude.", layout: "md:col-span-2 xl:col-span-4" },
  { id: "pointer", title: "Cursor-Reactive Field", copy: "Surfaces that respond to cursor movement with spatial feedback and temporary visual traces.", layout: "md:col-span-2 xl:col-span-2" },
  { id: "physics", title: "Physics-Based Interaction", copy: "UI primitives fall, collide, and settle in a real rigid-body field.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "scroll", title: "Product Surface Coverflow", copy: "Distinct product surfaces glide past in a self-playing 3D coverflow.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "motion", title: "Motion Choreography", copy: "Sequencing multiple motion cues into one coherent, readable rhythm.", layout: "md:col-span-1 xl:col-span-2" },
  { id: "shader", title: "Shader Gradient System", copy: "Tokenized color palettes rendered as a continuously animated gradient shader.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "filters", title: "Image Treatment", copy: "Predefined color and grain recipes applied consistently across a set of photos.", layout: "md:col-span-1 xl:col-span-3" },
  { id: "color", title: "Color Palette Generator", copy: "Generate, lock, inspect, and export five-color palettes from one compact design surface.", layout: "md:col-span-2 xl:col-span-6" },
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
  color: Palette,
  landing: PanelsTopLeft,
  command: Command,
  commerce: ShoppingBag,
  mobile: Smartphone,
  agent: FileCode2,
} satisfies Record<AtlasItemId, LucideIcon>

export function HomePage({ onNavigate, onSearch, filter, terms }: HomePageProps) {
  return (
    <div className="bg-background text-foreground">
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
            <Button className="h-11 rounded-lg bg-askewly-violet px-6 has-[>svg]:px-6 text-white hover:bg-[#5f22a8]" type="button" onClick={() => onNavigate({ page: "plus", filter: "nav:plus-application-ui" })}>
              Get Started
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <Button className="h-11 rounded-lg border-border bg-background px-6 text-foreground hover:bg-muted" variant="outline" type="button" onClick={() => onNavigate({ page: "docs", filter: "nav:docs-getting-started-setup" })}>
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
    <div className="mt-16 w-full text-foreground">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-askewly-violet">Why Askewly Design?</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal text-foreground md:text-6xl">
            From visual taste to working UI.
          </h2>
        </div>
        <p className="max-w-md text-base leading-7 text-muted-foreground">
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
        "group flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-askewly-lavender hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]",
        item.layout,
      )}
    >
      <div className={cn("grid gap-5 p-6 sm:grid-cols-[5.75rem_minmax(0,1fr)]", item.id === "agent" && "sm:grid-cols-[4.25rem_minmax(0,1fr)]")}>
        <div className="flex items-start justify-center sm:justify-start">
          <LineArtIcon id={item.id} />
        </div>
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-normal text-card-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col border-t border-border bg-slate-50 p-5">
        <AtlasDemo id={item.id} />
      </div>
    </article>
  )
}

function LineArtIcon({ id }: { id: AtlasItemId }) {
  const Icon = atlasIconMap[id]

  return (
    <span className="flex h-16 w-20 shrink-0 items-start justify-center text-card-foreground">
      <Icon aria-hidden="true" className="mt-1 size-11" strokeWidth={1.75} absoluteStrokeWidth />
    </span>
  )
}

function AtlasDemo({ id }: { id: AtlasItemId }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [mobileStep, setMobileStep] = useState(0)
  const [cartCount, setCartCount] = useState(1)
  const [agentFrame, setAgentFrame] = useState({ left: 18, top: 24, width: 58, height: 150 })
  const [agentSelected, setAgentSelected] = useState(false)
  const [agentResizing, setAgentResizing] = useState(false)
  const [agentMoving, setAgentMoving] = useState(false)
  const [agentScenario, setAgentScenario] = useState<"humanize" | "fix" | "interactive">("humanize")
  const [agentPhase, setAgentPhase] = useState<"before" | "after">("before")
  const [agentAssembleKey, setAgentAssembleKey] = useState(0)
  const [agentTilt, setAgentTilt] = useState({ x: 0, y: 0 })
  const [agentChat, setAgentChat] = useState<Array<{ role: "you" | "agent"; text: string }>>([
    { role: "agent", text: "Drag or resize the card, or pick a scenario and I'll rework it on the canvas." },
  ])
  const [agentInput, setAgentInput] = useState("")
  const [agentTyping, setAgentTyping] = useState(false)
  const agentChatRef = useRef<HTMLDivElement | null>(null)
  const scenarioTimersRef = useRef<number[]>([])
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

  useEffect(() => {
    if (id !== "agent") return
    const el = agentChatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [id, agentChat, agentTyping])

  useEffect(() => {
    if (id !== "agent") return
    return () => {
      scenarioTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      scenarioTimersRef.current = []
    }
  }, [id])

  if (id === "agent") {
    const defaultFrame = { humanize: { left: 18, top: 20, width: 58, height: 172 }, fix: { left: 16, top: 22, width: 62, height: 158 }, interactive: { left: 22, top: 26, width: 52, height: 140 } }
    const agentScenarios = [
      {
        key: "humanize" as const,
        label: "Humanizing",
        turns: [
          { role: "you" as const, text: "This card screams AI. Make it feel designed." },
          { role: "agent" as const, text: "Rebuilding with real hierarchy, type, and one intentional accent." },
          { role: "agent" as const, text: "Now it reads like a designer made it — not a generator." },
        ],
      },
      {
        key: "fix" as const,
        label: "Fixing",
        turns: [
          { role: "you" as const, text: "The layout is broken — everything's off." },
          { role: "agent" as const, text: "Snapping elements back to the grid and normalizing type." },
          { role: "agent" as const, text: "Aligned and on-baseline. Structure restored." },
        ],
      },
      {
        key: "interactive" as const,
        label: "Interactive",
        turns: [
          { role: "you" as const, text: "Make it feel alive." },
          { role: "agent" as const, text: "Adding a floating idle and cursor-reactive tilt." },
          { role: "agent" as const, text: "It responds to the pointer now — hover to lift it." },
        ],
      },
    ]
    const playScenario = (scenario: (typeof agentScenarios)[number]) => {
      scenarioTimersRef.current.forEach((timer) => window.clearTimeout(timer))
      scenarioTimersRef.current = []
      setAgentScenario(scenario.key)
      setAgentPhase("before")
      setAgentTilt({ x: 0, y: 0 })
      setAgentFrame(defaultFrame[scenario.key])
      setAgentAssembleKey((key) => key + 1)
      const [first, ...rest] = scenario.turns
      setAgentChat([first])
      const applyAfter = () => {
        setAgentPhase("after")
        if (scenario.key === "humanize") setAgentAssembleKey((key) => key + 1)
      }
      if (prefersReducedMotion) {
        setAgentChat(scenario.turns)
        applyAfter()
        return
      }
      let delay = 0
      rest.forEach((turn) => {
        delay += 720
        const showAt = delay
        scenarioTimersRef.current.push(window.setTimeout(() => setAgentTyping(true), Math.max(0, showAt - 360)))
        scenarioTimersRef.current.push(window.setTimeout(() => {
          setAgentTyping(false)
          setAgentChat((log) => [...log, turn])
        }, showAt))
      })
      // change the canvas only after the agent finishes talking
      scenarioTimersRef.current.push(window.setTimeout(applyAfter, delay + 560))
    }
    const sendAgentMessage = () => {
      const text = agentInput.trim()
      if (!text) return
      setAgentChat((log) => [...log, { role: "you", text }, { role: "agent", text: "Try it in Askewly Design!" }])
      setAgentInput("")
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
      const minWidth = 30
      const maxWidth = 82
      const minHeight = 74
      const maxHeight = 190
      const maxLeft = 70
      const maxTop = 40
      const onPointerMove = (moveEvent: PointerEvent) => {
        const dxPercent = ((moveEvent.clientX - startX) / rect.width) * 100
        const dyPx = moveEvent.clientY - startY
        setAgentFrame(() => {
          let nextLeft = start.left
          let nextTop = start.top
          let nextWidth = start.width
          let nextHeight = start.height
          if (edge.includes("e")) nextWidth = Math.min(maxWidth, Math.max(minWidth, start.width + dxPercent))
          if (edge.includes("s")) nextHeight = Math.min(maxHeight, Math.max(minHeight, start.height + dyPx))
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
    const startAgentMove = (event: ReactPointerEvent<HTMLDivElement>) => {
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
    const onCanvasPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (agentScenario !== "interactive" || agentPhase !== "after" || prefersReducedMotion) return
      if (agentMoving || agentResizing) return
      const rect = event.currentTarget.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      setAgentTilt({ x: +(py * -10).toFixed(2), y: +(px * 12).toFixed(2) })
    }
    const alive = agentScenario === "interactive" && agentPhase === "after" && !prefersReducedMotion

    return (
      <div className="grid min-h-[21.8rem] overflow-hidden rounded-md border border-slate-200 bg-white lg:h-[23rem] lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="relative flex min-h-[17rem] flex-col bg-slate-50 p-4">
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
            className="relative mt-4 min-h-[16rem] flex-1 overflow-hidden rounded-md border border-slate-200 bg-white bg-[linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:28px_28px] [perspective:700px]"
            onPointerMove={onCanvasPointerMove}
            onPointerDown={(event) => {
              if (!(event.target as HTMLElement).closest("[data-agent-asset='true']")) setAgentSelected(false)
            }}
          >
            <div
              key={agentAssembleKey}
              data-agent-asset="true"
              role="button"
              tabIndex={0}
              className={cn(
                "absolute overflow-visible text-left focus:outline-none motion-safe:animate-[agentAssemble_460ms_ease-out]",
                agentMoving ? "cursor-grabbing" : "cursor-grab",
              )}
              style={{ left: `${agentFrame.left}%`, top: `${agentFrame.top}%`, width: `${agentFrame.width}%`, height: `${agentFrame.height}px` }}
              onPointerDown={startAgentMove}
              onClick={() => {
                if (agentDraggedRef.current) { agentDraggedRef.current = false; return }
                setAgentSelected(true)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setAgentSelected(true)
                }
              }}
            >
              {agentSelected && (
                <>
                  <span className="pointer-events-none absolute inset-0 z-10 border-[1.5px]" style={{ borderColor: "var(--askewly-violet)" }} />
                  <span className="absolute inset-x-2 -top-1 z-20 h-3 cursor-ns-resize touch-none" data-resize-edge="n" role="presentation" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => startAgentResize(e, "n")} />
                  <span className="absolute inset-y-2 -right-1 z-20 w-3 cursor-ew-resize touch-none" data-resize-edge="e" role="presentation" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => startAgentResize(e, "e")} />
                  <span className="absolute inset-x-2 -bottom-1 z-20 h-3 cursor-ns-resize touch-none" data-resize-edge="s" role="presentation" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => startAgentResize(e, "s")} />
                  <span className="absolute inset-y-2 -left-1 z-20 w-3 cursor-ew-resize touch-none" data-resize-edge="w" role="presentation" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => startAgentResize(e, "w")} />
                  {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                    <span
                      key={corner}
                      className={cn("absolute z-30 size-2 cursor-nwse-resize touch-none border bg-white", corner === "nw" && "left-[0.75px] top-[0.75px] -translate-x-1/2 -translate-y-1/2", corner === "ne" && "right-[0.75px] top-[0.75px] translate-x-1/2 -translate-y-1/2 cursor-nesw-resize", corner === "sw" && "bottom-[0.75px] left-[0.75px] -translate-x-1/2 translate-y-1/2 cursor-nesw-resize", corner === "se" && "bottom-[0.75px] right-[0.75px] translate-x-1/2 translate-y-1/2")}
                      style={{ borderColor: "var(--askewly-violet)" }}
                      data-resize-edge={corner}
                      role="presentation"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => startAgentResize(e, corner)}
                    />
                  ))}
                </>
              )}
              <div className={cn("h-full w-full transition-transform duration-300", alive && "motion-safe:animate-[agentFloat_4s_ease-in-out_infinite]")}>
                <div
                  className={cn(
                    "flex h-full min-h-0 flex-col overflow-hidden rounded-lg text-left transition-all duration-500",
                    agentScenario === "humanize" && agentPhase === "before"
                      ? "gap-2 border border-fuchsia-400/30 bg-[linear-gradient(160deg,#2e1065,#4a1d96_45%,#831843)] p-3"
                      : cn("gap-2.5 border border-slate-200 bg-white p-3 shadow-sm", alive && "hover:shadow-[0_16px_40px_rgba(111,45,189,0.18)]"),
                  )}
                  style={alive ? { transform: `rotateX(${agentTilt.x}deg) rotateY(${agentTilt.y}deg)`, transformStyle: "preserve-3d" } : undefined}
                >
                  {agentScenario === "humanize" && agentPhase === "before" ? (
                    <>
                      <div className="flex items-start gap-1.5">
                        <img src="/assets/navbars/avatar-03.png" alt="" className="h-11 w-8 shrink-0 rounded-none object-cover ring-1 ring-fuchsia-400/70" />
                        <div className="min-w-0">
                          <p className="truncate font-serif text-[17px] font-black italic leading-none text-cyan-300 [text-shadow:0_0_10px_rgba(34,211,238,0.9)]">Maya Okonkwo ✨</p>
                          <p className="truncate text-[7px] uppercase tracking-[0.2em] text-fuchsia-200">🚀 Design Lead &amp; AI Visionary 🚀</p>
                        </div>
                      </div>
                      <p className="text-[12px] font-black leading-3 text-purple-100">“Our agents <span className="text-[8px] font-normal">finally ship UI</span> that looks INTENTIONAL 🔥🚀 not generated!! 💯✨”</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[15px] leading-none text-amber-300 [text-shadow:0_0_8px_rgba(252,211,77,0.9)]">★★★★★</span>
                        <span className="text-[7px] font-black uppercase text-fuchsia-300">100% Amazing!!!</span>
                      </div>
                      <button type="button" className="mt-auto -rotate-2 self-center rounded-none bg-[linear-gradient(90deg,#22d3ee,#a855f7)] px-2 py-1.5 text-[15px] font-black uppercase leading-none tracking-tight text-white shadow-[0_0_16px_rgba(168,85,247,0.75)]">Read More 👉</button>
                    </>
                  ) : (
                    (() => {
                      const broken = agentScenario === "fix" && agentPhase === "before"
                      return (
                        <>
                          <div className={cn("flex items-center gap-2 transition-all duration-500", broken && "translate-x-3 rotate-[-4deg]")}>
                            <img src="/assets/navbars/avatar-03.png" alt="" className="size-8 shrink-0 rounded-full object-cover" />
                            <div className={cn("min-w-0 transition-all duration-500", broken && "translate-y-1")}>
                              <p className={cn("truncate font-semibold text-slate-950 transition-all duration-500", broken ? "text-[13px] italic" : "text-[12px]")}>Maya Okonkwo</p>
                              <p className="truncate text-[9px] text-slate-500">Design Lead, Northwind</p>
                            </div>
                          </div>
                          <p className={cn("text-[11px] leading-4 text-slate-700 transition-all duration-500", broken && "translate-x-6 rotate-1 text-[13px] leading-3 text-slate-400")}>
                            “Our agents finally ship UI that looks intentional — not generated.”
                          </p>
                          <div className={cn("mt-auto flex gap-0.5 text-[11px] leading-none text-amber-400 transition-all duration-500", broken && "-translate-x-2 translate-y-1 rotate-2")} aria-hidden="true">
                            {"★★★★★"}
                          </div>
                        </>
                      )
                    })()
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col border-t border-slate-200 bg-white lg:border-l lg:border-t-0">
          <div className="border-b border-slate-200 px-3 py-2.5">
            <p className="text-[11px] font-semibold text-slate-900">Canvas agent</p>
          </div>

          <div ref={agentChatRef} className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-3">
            {agentChat.map((message, index) => (
              message.role === "you" ? (
                <div key={index} className="flex justify-end">
                  <span className="max-w-[85%] rounded-lg rounded-br-sm bg-slate-100 px-2.5 py-1.5 text-[11px] leading-4 text-slate-700">
                    {message.text}
                  </span>
                </div>
              ) : (
                <p key={index} className="max-w-[92%] text-[11px] leading-4 text-slate-500">
                  {message.text}
                </p>
              )
            ))}
            {agentTyping && (
              <span className="inline-flex w-fit gap-0.5 rounded-full bg-slate-100 px-2 py-1.5" aria-label="Agent is typing">
                <span className="size-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                <span className="size-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                <span className="size-1 animate-bounce rounded-full bg-slate-400" />
              </span>
            )}
          </div>

          <div className="border-t border-slate-200 p-2">
            <div className="flex gap-1 pb-2">
              {agentScenarios.map((scenario) => (
                <button
                  key={scenario.key}
                  className="flex-1 whitespace-nowrap rounded bg-slate-100 px-1 py-1 text-center text-[9px] font-medium text-slate-600 transition hover:bg-askewly-lavender/25 hover:text-askewly-violet"
                  type="button"
                  onClick={() => playScenario(scenario)}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 pl-2.5 pr-1 focus-within:border-askewly-orchid">
              <input
                className="min-w-0 flex-1 bg-transparent py-1.5 text-[11px] text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Message the agent…"
                value={agentInput}
                onChange={(event) => setAgentInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    sendAgentMessage()
                  }
                }}
              />
              <button className="grid size-6 shrink-0 place-items-center rounded-md bg-askewly-violet text-white transition hover:bg-[#5f22a8] disabled:opacity-30" type="button" aria-label="Send message" disabled={!agentInput.trim()} onClick={sendAgentMessage}>
                <ArrowUp aria-hidden="true" className="size-3.5" />
              </button>
            </div>
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
    return <CoverflowDemo />
  }

  if (id === "filters") {
    return <ImageTreatmentDemo />
  }

  if (id === "color") {
    return <ColorPaletteGeneratorDemo />
  }

  if (id === "shader") {
    return <ShaderGradientDemo />
  }

  if (id === "motion") {
    return <MotionShowcaseDemo />
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
    <div className="grid min-h-[22.2rem] place-items-center rounded-md border border-slate-200 bg-white p-4 text-xs text-slate-400">
      Preview coming soon.
    </div>
  )
}

type CoverflowKind = "analytics" | "calendar" | "kanban" | "media" | "chat" | "pricing"

// Six visually distinct product surfaces (hardcoded light palette so they stay bright in both themes).
const coverflowCards: CoverflowKind[] = ["analytics", "calendar", "kanban", "media", "chat", "pricing"]

function CoverflowCard({ kind }: { kind: CoverflowKind }) {
  const frame = "h-[132px] w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_46px_rgba(0,0,0,0.5)]"
  if (kind === "analytics") {
    return (
      <div className={frame}>
        <div className="flex items-center justify-between px-3 pt-3">
          <p className="text-[10px] font-semibold text-slate-900">Revenue</p>
          <span className="text-[9px] font-medium text-emerald-500">+18%</span>
        </div>
        <p className="px-3 text-lg font-semibold leading-tight text-slate-900">$48.2k</p>
        <div className="mt-1 flex h-[52px] items-end gap-1 px-3 pb-3">
          {[0.35, 0.6, 0.45, 0.82, 0.55, 0.95, 0.7].map((h, i) => (
            <span key={i} className="flex-1 rounded-t" style={{ height: `${h * 100}%`, background: i === 5 ? "var(--askewly-violet)" : "var(--askewly-lavender)" }} />
          ))}
        </div>
      </div>
    )
  }
  if (kind === "calendar") {
    return (
      <div className={cn(frame, "p-3")}>
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold text-slate-900">March</p>
          <span className="text-[8px] text-slate-400">2026</span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className={cn("aspect-square rounded-[3px]", i === 16 ? "bg-askewly-violet" : "bg-slate-100")} />
          ))}
        </div>
      </div>
    )
  }
  if (kind === "kanban") {
    const columns = [
      { color: "var(--askewly-sky)", n: 3 },
      { color: "#fbbf24", n: 2 },
      { color: "var(--askewly-mint)", n: 2 },
    ]
    return (
      <div className={cn(frame, "p-3")}>
        <p className="text-[10px] font-semibold text-slate-900">Sprint 12</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {columns.map((col, ci) => (
            <div key={ci} className="space-y-1.5">
              <span className="block h-1 w-6 rounded-full" style={{ background: col.color }} />
              {Array.from({ length: col.n }).map((_, i) => (
                <span key={i} className="block h-4 rounded bg-slate-100" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (kind === "media") {
    return (
      <div className={cn(frame, "p-3")}>
        <div className="flex items-center gap-2.5">
          <div className="size-11 shrink-0 rounded-md" style={{ background: "linear-gradient(135deg, var(--askewly-violet), var(--askewly-mint))" }} />
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-slate-900">Nightfall</p>
            <p className="truncate text-[9px] text-slate-500">Askewly Radio</p>
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full bg-slate-200">
          <span className="block h-full w-2/3 rounded-full bg-askewly-violet" />
        </div>
        <div className="mt-2.5 flex items-center justify-center gap-3 text-slate-700">
          <SkipBack className="size-3" aria-hidden="true" />
          <Play className="size-4 fill-current" aria-hidden="true" />
          <SkipForward className="size-3" aria-hidden="true" />
        </div>
      </div>
    )
  }
  if (kind === "chat") {
    return (
      <div className={cn(frame, "flex flex-col gap-1.5 p-3")}>
        <span className="max-w-[82%] self-start rounded-lg rounded-bl-sm bg-slate-100 px-2 py-1 text-[9px] leading-snug text-slate-700">How’s the redesign going?</span>
        <span className="max-w-[82%] self-end rounded-lg rounded-br-sm bg-askewly-violet px-2 py-1 text-[9px] leading-snug text-white">Shipping it today ✦</span>
        <span className="max-w-[60%] self-start rounded-lg rounded-bl-sm bg-slate-100 px-2 py-1 text-[9px] leading-snug text-slate-700">🔥 amazing</span>
      </div>
    )
  }
  return (
    <div className={cn(frame, "p-3")}>
      <p className="text-[9px] font-semibold uppercase tracking-wide text-askewly-violet">Pro</p>
      <p className="text-slate-900">
        <span className="text-xl font-semibold">$24</span>
        <span className="text-[9px] text-slate-400">/mo</span>
      </p>
      <div className="mt-2 space-y-1.5">
        {["Unlimited tokens", "Team library", "Priority sync"].map((feature) => (
          <div key={feature} className="flex items-center gap-1.5 text-[9px] text-slate-600">
            <Check className="size-3 shrink-0 text-emerald-500" aria-hidden="true" />
            {feature}
          </div>
        ))}
      </div>
    </div>
  )
}

function CoverflowDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const total = coverflowCards.length

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = window.setInterval(() => setActive((value) => (value + 1) % total), 2600)
    return () => window.clearInterval(interval)
  }, [prefersReducedMotion, total])

  return (
    <div className="min-h-[17.65rem]">
      <div className="relative h-64 overflow-hidden rounded-md border border-slate-200 bg-slate-950" style={{ perspective: "1000px" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(111,45,189,0.34),transparent_64%)]" />
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {coverflowCards.map((kind, index) => {
            // Shortest signed distance around the loop, so the row wraps seamlessly.
            let pos = index - active
            if (pos > total / 2) pos -= total
            if (pos < -total / 2) pos += total
            const abs = Math.abs(pos)
            const side = Math.max(-1, Math.min(1, pos))
            const x = pos * 66
            const rotateY = -side * 44
            const z = -abs * 70
            const scale = Math.max(0.6, 1 - abs * 0.14)
            const opacity = abs > 2.6 ? 0 : Math.max(0, 1 - abs * 0.24)
            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
                  zIndex: 100 - Math.round(abs * 10),
                  opacity,
                  transition: prefersReducedMotion ? undefined : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                <CoverflowCard kind={kind} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

type MotionBurstKind = "square" | "triangle" | "hex" | "dot" | "pentagon"

type MotionBurstShape = {
  kind: MotionBurstKind
  angle: number
  arrangeDistance: number
  finalDistance: number
  rotate: number
  size: number
  depth: number
}

// arrangeDistance = the sharp ring the shape snaps to right after it emerges from the ball
// (the single hold point in the burst); finalDistance = the one decisive push outward as it
// fades; depth = 0..1, how much bigger/blurrier it gets on that push (a cheap depth-of-field cue).
const motionBurstShapes: MotionBurstShape[] = [
  { kind: "square", angle: -160, arrangeDistance: 56, finalDistance: 130, rotate: 24, size: 15, depth: 0.3 },
  { kind: "triangle", angle: -122, arrangeDistance: 50, finalDistance: 100, rotate: -18, size: 12, depth: 0.7 },
  { kind: "hex", angle: -62, arrangeDistance: 58, finalDistance: 125, rotate: 12, size: 17, depth: 0.5 },
  { kind: "triangle", angle: -18, arrangeDistance: 60, finalDistance: 145, rotate: 96, size: 15, depth: 0.9 },
  { kind: "dot", angle: 22, arrangeDistance: 54, finalDistance: 120, rotate: 0, size: 10, depth: 0.2 },
  { kind: "square", angle: 68, arrangeDistance: 52, finalDistance: 108, rotate: -30, size: 14, depth: 0.6 },
  { kind: "hex", angle: 132, arrangeDistance: 58, finalDistance: 138, rotate: 20, size: 16, depth: 0.4 },
  { kind: "triangle", angle: 172, arrangeDistance: 54, finalDistance: 115, rotate: -60, size: 12, depth: 0.8 },
  { kind: "pentagon", angle: 100, arrangeDistance: 56, finalDistance: 128, rotate: 40, size: 16, depth: 0.5 },
  { kind: "triangle", angle: 45, arrangeDistance: 62, finalDistance: 150, rotate: -50, size: 22, depth: 0.85 },
  { kind: "hex", angle: -100, arrangeDistance: 48, finalDistance: 105, rotate: -15, size: 9, depth: 0.15 },
  { kind: "dot", angle: 158, arrangeDistance: 60, finalDistance: 118, rotate: 0, size: 7, depth: 0.35 },
  { kind: "pentagon", angle: -40, arrangeDistance: 52, finalDistance: 112, rotate: -70, size: 13, depth: 0.65 },
]

function MotionBurstShapeMark({ shape }: { shape: MotionBurstShape }) {
  const style = { width: shape.size, height: shape.size, background: "radial-gradient(circle at 34% 28%, #ffffff, #c7cdd9)" }
  if (shape.kind === "dot") {
    return <span className="block rounded-full" style={style} />
  }
  if (shape.kind === "square") {
    return <span className="block rounded-[3px]" style={style} />
  }
  if (shape.kind === "hex") {
    return <span className="block" style={{ ...style, clipPath: "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)" }} />
  }
  if (shape.kind === "pentagon") {
    return <span className="block" style={{ ...style, clipPath: "polygon(50% 2%, 98% 38%, 79% 96%, 21% 96%, 2% 38%)" }} />
  }
  return <span className="block" style={{ ...style, clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)" }} />
}

function MotionShowcaseDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const orbitDots = 8
  const ballAnimation = "motion-showcase-ball 9s linear infinite"

  return (
    <div className="min-h-[17.65rem]">
      <div className="relative h-64 overflow-hidden rounded-md border border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(111,45,189,0.22),transparent_62%)]" />

        <div className="absolute left-1/2 top-1/2">
          {!prefersReducedMotion && (
            <>
              {/* phase 2: shapes glow off the ball at the exact canvas center, arrange into a sharp
                  spinning ring (the one hold in the burst), then push out to their final spot and fade */}
              <div
                className="motion-showcase-shockwave absolute -left-8 -top-8 size-16 rounded-full border border-white/70"
                style={{ animation: "motion-showcase-shockwave 9s ease-out infinite" }}
              />
              {motionBurstShapes.map((shape, index) => {
                const rad = (shape.angle * Math.PI) / 180
                const fx = Math.cos(rad) * shape.finalDistance
                const fy = Math.sin(rad) * shape.finalDistance
                const atx = Math.cos(rad) * shape.arrangeDistance
                const aty = Math.sin(rad) * shape.arrangeDistance
                return (
                  <div
                    key={index}
                    className="motion-showcase-shape absolute -left-2 -top-2"
                    style={{
                      ["--fx" as string]: `${fx.toFixed(1)}px`,
                      ["--fy" as string]: `${fy.toFixed(1)}px`,
                      ["--atx" as string]: `${atx.toFixed(1)}px`,
                      ["--aty" as string]: `${aty.toFixed(1)}px`,
                      ["--rot" as string]: `${shape.rotate}deg`,
                      ["--depth" as string]: `${shape.depth}`,
                      animation: "motion-showcase-shape 9s cubic-bezier(0.22, 1, 0.36, 1) infinite",
                    }}
                  >
                    <span
                      className="motion-showcase-shape-float block"
                      style={{ animation: `motion-showcase-shape-float ${(2.2 + index * 0.15).toFixed(2)}s ease-in-out infinite`, animationDelay: `${index * 120}ms` }}
                    >
                      <MotionBurstShapeMark shape={shape} />
                    </span>
                  </div>
                )
              })}
            </>
          )}

          {/* phase 3: the field expands out of the ball, centered on the same canvas-center point,
              and contracts back into it before the loop restarts */}
          <div
            className="motion-showcase-rings absolute -left-[92px] -top-[92px] size-[184px]"
            style={prefersReducedMotion ? { opacity: 1, transform: "scale(1)" } : { animation: "motion-showcase-rings 9s ease-in-out infinite" }}
          >
            <span className="absolute inset-0 rounded-full border border-white/25" />
            <span className="absolute inset-[26px] rounded-full border border-dashed border-white/20" />
            <span className="absolute inset-[52px] rounded-full border border-white/30" />
            <div
              className="motion-showcase-orbit-spin absolute inset-0"
              style={prefersReducedMotion ? undefined : { animation: "motion-showcase-orbit-spin 6s linear infinite" }}
            >
              {Array.from({ length: orbitDots }).map((_, index) => {
                const angle = (index / orbitDots) * 360
                return (
                  <span
                    key={index}
                    className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-white/80"
                    style={{ transform: `rotate(${angle}deg) translate(52px) rotate(-${angle}deg)` }}
                  />
                )
              })}
            </div>
          </div>

          {/* phase 1: the protagonist ball - swings in a decaying pendulum arc into the exact canvas
              center (no floor bounce) and stays visible for the whole loop. Three increasingly faint,
              increasingly blurred echoes trail behind it (secondary motion) so the swing reads as
              weighted momentum instead of a mechanical back-and-forth. */}
          {!prefersReducedMotion && (
            <>
              <div className="motion-showcase-ball-echo absolute -left-3 -top-3 size-6 rounded-full bg-white/45 blur-[4px]" style={{ animation: ballAnimation, animationDelay: "90ms" }} />
              <div className="motion-showcase-ball-echo absolute -left-3 -top-3 size-6 rounded-full bg-white/28 blur-[7px]" style={{ animation: ballAnimation, animationDelay: "190ms" }} />
              <div className="motion-showcase-ball-echo absolute -left-3 -top-3 size-6 rounded-full bg-white/14 blur-[10px]" style={{ animation: ballAnimation, animationDelay: "310ms" }} />
            </>
          )}
          <div
            className="absolute -left-3 -top-3 size-6"
            style={{ animation: prefersReducedMotion ? undefined : ballAnimation, transform: prefersReducedMotion ? "translate3d(0, 0, 0)" : undefined }}
          >
            <span
              className="motion-showcase-ball-breathe block size-full rounded-full bg-white shadow-[0_0_28px_10px_rgba(255,255,255,0.5)]"
              style={{ animation: prefersReducedMotion ? undefined : "motion-showcase-ball-breathe 2.6s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type PaletteColor = {
  hex: string
  name: string
}

type GeneratorColor = PaletteColor & {
  id: string
  locked: boolean
}

type DragPreview = GeneratorColor & {
  height: number
  left: number
  offsetX: number
  offsetY: number
  top: number
  width: number
}

const paletteGeneratorSets: PaletteColor[][] = [
  [
    { hex: "#FF99C8", name: "Baby Pink" },
    { hex: "#FCF6BD", name: "Lemon Chiffon" },
    { hex: "#D0F4DE", name: "Frosted Mint" },
    { hex: "#A9DEF9", name: "Icy Blue" },
    { hex: "#E4C1F9", name: "Mauve" },
  ],
  [
    { hex: "#12130F", name: "Onyx" },
    { hex: "#5B9279", name: "Viridian" },
    { hex: "#8FCB9B", name: "Mint Leaf" },
    { hex: "#EAE6E5", name: "Soft Ash" },
    { hex: "#8F8073", name: "Taupe" },
  ],
  [
    { hex: "#12130F", name: "Onyx" },
    { hex: "#FBBA72", name: "Apricot" },
    { hex: "#CA5310", name: "Burnt Orange" },
    { hex: "#BB4D00", name: "Copper" },
    { hex: "#8F250C", name: "Russet" },
  ],
  [
    { hex: "#102A33", name: "Deep Ink" },
    { hex: "#6F2DBD", name: "Violet" },
    { hex: "#A663CC", name: "Orchid" },
    { hex: "#B9FAF8", name: "Mint" },
    { hex: "#F8FAFC", name: "Cloud" },
  ],
  [
    { hex: "#1C1C1C", name: "Carbon" },
    { hex: "#E7CBA9", name: "Canvas" },
    { hex: "#C6D8AF", name: "Sage" },
    { hex: "#8AA399", name: "Sea Glass" },
    { hex: "#F4F1DE", name: "Parchment" },
  ],
]

function getReadableTextColor(hex: string) {
  const value = hex.replace("#", "")
  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255
  return luminance > 0.62 ? "#111827" : "#F8FAFC"
}

function shiftHex(hex: string, amount: number) {
  const value = hex.replace("#", "")
  const channels = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((channel) => {
    const next = Math.min(255, Math.max(0, parseInt(channel, 16) + amount))
    return next.toString(16).padStart(2, "0")
  })
  return `#${channels.join("")}`.toUpperCase()
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "")
  return {
    red: parseInt(value.slice(0, 2), 16),
    green: parseInt(value.slice(2, 4), 16),
    blue: parseInt(value.slice(4, 6), 16),
  }
}

function formatRgb(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  return `${red}, ${green}, ${blue}`
}

function hexToHsl(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2
  let hue = 0
  let saturation = 0

  if (max !== min) {
    const delta = max - min
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0)
    if (max === g) hue = (b - r) / delta + 2
    if (max === b) hue = (r - g) / delta + 4
    hue /= 6
  }

  return `${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((channel) => clampNumber(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function hexToHsv(hex: string) {
  const { red, green, blue } = hexToRgb(hex)
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const hue =
    delta === 0 ? 0 :
    max === r ? 60 * (((g - b) / delta) % 6) :
    max === g ? 60 * ((b - r) / delta + 2) :
    60 * ((r - g) / delta + 4)

  return {
    h: (hue + 360) % 360,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  }
}

function hsvToHex(hue: number, saturation: number, value: number) {
  const h = ((hue % 360) + 360) % 360
  const s = clampNumber(saturation, 0, 100) / 100
  const v = clampNumber(value, 0, 100) / 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] :
    [c, 0, x]

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255)
}

function buildShadeSet(color: PaletteColor) {
  return [-88, -68, -48, -28, -10, 10, 28, 46, 64, 82].map((amount) => ({
    hex: shiftHex(color.hex, amount),
    name: `${color.name} ${amount < 0 ? "Shade" : "Tint"} ${Math.abs(amount)}`,
  }))
}

function downloadPalettePng(palette: PaletteColor[]) {
  const width = palette.length * 240
  const height = 320
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) return

  palette.forEach((color, index) => {
    const x = index * 240
    context.fillStyle = color.hex
    context.fillRect(x, 0, 240, height)
    context.fillStyle = getReadableTextColor(color.hex)
    context.font = "700 28px Arial, sans-serif"
    context.fillText(color.hex.replace("#", ""), x + 30, height - 70)
    context.font = "600 18px Arial, sans-serif"
    context.fillText(color.name, x + 30, height - 36)
  })

  const link = document.createElement("a")
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = "askewly-palette.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, "image/png")
}

function buildPaletteSvg(palette: PaletteColor[]) {
  const width = palette.length * 160
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 220">${palette.map((color, index) => `<rect x="${index * 160}" y="0" width="160" height="220" fill="${color.hex}"/><text x="${index * 160 + 22}" y="178" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="${getReadableTextColor(color.hex)}">${color.hex.replace("#", "")}</text><text x="${index * 160 + 22}" y="202" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="${getReadableTextColor(color.hex)}">${color.name}</text>`).join("")}</svg>`
}

function ColorPaletteGeneratorDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [palette, setPalette] = useState<GeneratorColor[]>(() => paletteGeneratorSets[0].map((color, index) => ({ ...color, id: `initial-${index}-${color.hex}`, locked: false })))
  const [exportOpen, setExportOpen] = useState(false)
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null)
  const [shadeState, setShadeState] = useState<{ index: number; base: PaletteColor } | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
  const [removingIndex, setRemovingIndex] = useState<number | null>(null)
  const [copyToast, setCopyToast] = useState<string | null>(null)
  const [infoColorId, setInfoColorId] = useState("initial-0-#FF99C8")
  const [paletteEntryAnimation, setPaletteEntryAnimation] = useState(false)
  const [shadePanelClosing, setShadePanelClosing] = useState(false)
  const paletteBoardRef = useRef<HTMLDivElement | null>(null)
  const paletteRootRef = useRef<HTMLDivElement | null>(null)
  const addedColorIdRef = useRef(0)
  const shadeCloseTimerRef = useRef<number | null>(null)
  const dragStateRef = useRef<{ sourceIndex: number; targetIndex: number; width: number; boardLeft: number } | null>(null)
  const isDraggingPalette = draggedIndex !== null
  const pickerColor = pickerOpenIndex === null ? null : palette[pickerOpenIndex]
  const infoColor = palette.find((color) => color.id === infoColorId) ?? palette[0]
  const pickerHsv = pickerColor ? hexToHsv(pickerColor.hex) : null
  const pickerHueHex = pickerHsv ? hsvToHex(pickerHsv.h, 100, 100) : "#FF0000"
  const shadeSet = shadeState ? buildShadeSet(shadeState.base) : []

  const closeShadePanel = useCallback((animated = true) => {
    if (!shadeState) {
      setShadePanelClosing(false)
      return
    }
    if (shadeCloseTimerRef.current !== null) {
      window.clearTimeout(shadeCloseTimerRef.current)
      shadeCloseTimerRef.current = null
    }
    if (!animated || prefersReducedMotion) {
      setShadePanelClosing(false)
      setShadeState(null)
      return
    }
    setShadePanelClosing(true)
    shadeCloseTimerRef.current = window.setTimeout(() => {
      setShadeState(null)
      setShadePanelClosing(false)
      shadeCloseTimerRef.current = null
    }, 180)
  }, [prefersReducedMotion, shadeState])

  const openShadePanel = (index: number, color: GeneratorColor) => {
    if (shadeCloseTimerRef.current !== null) {
      window.clearTimeout(shadeCloseTimerRef.current)
      shadeCloseTimerRef.current = null
    }
    setShadePanelClosing(false)
    setShadeState({ index, base: { hex: color.hex, name: color.name } })
  }

  const blurPaletteAction = (event: ReactMouseEvent<HTMLElement>) => {
    event.currentTarget.blur()
  }

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (target.closest("[data-palette-popover]") || target.closest("[data-palette-trigger]")) return
      setPickerOpenIndex(null)
      closeShadePanel()
      setExportOpen(false)
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [closeShadePanel])

  useEffect(() => {
    if (!copyToast) return
    const timer = window.setTimeout(() => setCopyToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [copyToast])

  useEffect(() => {
    if (!paletteEntryAnimation) return
    const timer = window.setTimeout(() => setPaletteEntryAnimation(false), 560)
    return () => window.clearTimeout(timer)
  }, [paletteEntryAnimation])

  useEffect(() => {
    return () => {
      if (shadeCloseTimerRef.current !== null) {
        window.clearTimeout(shadeCloseTimerRef.current)
      }
    }
  }, [])

  const writeClipboard = async (value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = value
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.left = "-9999px"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
      setCopyToast("Color copied to clipboard")
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = value
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopyToast("Color copied to clipboard")
    }
  }

  const pickWithEyeDropper = async (index: number) => {
    const EyeDropperCtor = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper
    if (!EyeDropperCtor) {
      setCopyToast("Eyedropper unavailable")
      return
    }
    try {
      const result = await new EyeDropperCtor().open()
      replaceColor(index, result.sRGBHex.toUpperCase())
    } catch {
      // User cancelled the eyedropper.
    }
  }

  const generatePalette = () => {
    const nextIndex = (paletteIndex + 1) % paletteGeneratorSets.length
    const nextSet = paletteGeneratorSets[nextIndex]
    setPalette((current) => current.map((color, index) => (color.locked ? color : { ...nextSet[index % nextSet.length], id: color.id, locked: false })))
    setPaletteIndex(nextIndex)
    setPickerOpenIndex(null)
    closeShadePanel()
    setPaletteEntryAnimation(true)
  }

  const toggleLock = (index: number) => {
    setPalette((current) => current.map((color, colorIndex) => (colorIndex === index ? { ...color, locked: !color.locked } : color)))
    if (palette[index]) setInfoColorId(palette[index].id)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Space") {
      event.preventDefault()
      generatePalette()
    }
  }

  const removeColor = (index: number) => {
    if (palette.length <= 3) {
      return
    }
    const removingId = palette[index]?.id
    setRemovingIndex(index)
    window.setTimeout(() => {
      setPalette((current) => {
        const next = current.filter((_, colorIndex) => colorIndex !== index)
        if (removingId === infoColorId) {
          setInfoColorId(next[Math.min(index, next.length - 1)]?.id ?? next[0]?.id ?? "")
        }
        return next
      })
      setRemovingIndex(null)
    }, prefersReducedMotion ? 0 : 180)
    setPickerOpenIndex(null)
    closeShadePanel()
  }

  const applyShade = (shade: PaletteColor) => {
    if (!shadeState) return
    setPalette((current) => current.map((color, colorIndex) => (colorIndex === shadeState.index ? { ...color, ...shade } : color)))
    if (palette[shadeState.index]) setInfoColorId(palette[shadeState.index].id)
  }

  const replaceColor = (index: number, hex: string) => {
    setPalette((current) => current.map((color, colorIndex) => (colorIndex === index ? { ...color, hex } : color)))
  }

  const updatePickerField = (index: number, clientX: number, clientY: number, rect: DOMRect) => {
    const current = palette[index]
    if (!current) return
    const hsv = hexToHsv(current.hex)
    const saturation = clampNumber(((clientX - rect.left) / rect.width) * 100, 0, 100)
    const value = clampNumber(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100)
    replaceColor(index, hsvToHex(hsv.h, saturation, value))
  }

  const updatePickerHue = (index: number, clientX: number, rect: DOMRect) => {
    const current = palette[index]
    if (!current) return
    const hsv = hexToHsv(current.hex)
    const hue = clampNumber(((clientX - rect.left) / rect.width) * 360, 0, 360)
    replaceColor(index, hsvToHex(hue, hsv.s, hsv.v))
  }

  const startPickerDrag = (event: ReactPointerEvent<HTMLElement>, index: number, mode: "field" | "hue") => {
    event.preventDefault()
    event.stopPropagation()
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const update = (pointerEvent: PointerEvent | ReactPointerEvent<HTMLElement>) => {
      if (mode === "field") {
        updatePickerField(index, pointerEvent.clientX, pointerEvent.clientY, rect)
      } else {
        updatePickerHue(index, pointerEvent.clientX, rect)
      }
    }
    update(event)

    const movePicker = (pointerEvent: PointerEvent) => update(pointerEvent)
    const finishPicker = () => {
      window.removeEventListener("pointermove", movePicker)
      window.removeEventListener("pointerup", finishPicker)
      window.removeEventListener("pointercancel", finishPicker)
    }
    window.addEventListener("pointermove", movePicker)
    window.addEventListener("pointerup", finishPicker, { once: true })
    window.addEventListener("pointercancel", finishPicker, { once: true })
  }

  const reorderColor = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    setPalette((current) => {
      const boundedToIndex = clampNumber(toIndex, 0, current.length - 1)
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(boundedToIndex, 0, moved)
      return next
    })
  }

  const addColor = (side: "start" | "end") => {
    const nextSet = paletteGeneratorSets[(paletteIndex + 1) % paletteGeneratorSets.length]
    const candidate = nextSet.find((color) => !palette.some((item) => item.hex === color.hex)) ?? nextSet[palette.length % nextSet.length] ?? { hex: "#F8FAFC", name: "Cloud" }
    const color = { ...candidate, id: `added-${addedColorIdRef.current++}-${candidate.hex}`, locked: false }
    setPalette((current) => side === "start" ? [color, ...current] : [...current, color])
    setInfoColorId(color.id)
    setPaletteEntryAnimation(true)
  }

  const startPaletteDrag = (event: ReactPointerEvent<HTMLSpanElement>, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    if (palette[index]?.locked) return
    const board = paletteBoardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const cardRect = board.parentElement?.getBoundingClientRect()
    const columnWidth = rect.width / palette.length
    const color = palette[index]
    const colorElement = event.currentTarget.closest("[data-palette-color]") as HTMLElement | null
    const colorRect = colorElement?.getBoundingClientRect()
    if (!color || !colorRect || !cardRect) return
    setDraggedIndex(index)
    setDragTargetIndex(index)
    setDragPreview({
      ...color,
      height: colorRect.height,
      left: colorRect.left - cardRect.left,
      offsetX: event.clientX - colorRect.left,
      offsetY: event.clientY - colorRect.top,
      top: colorRect.top - cardRect.top,
      width: colorRect.width,
    })
    setPickerOpenIndex(null)
    closeShadePanel(false)
    dragStateRef.current = { sourceIndex: index, targetIndex: index, width: columnWidth, boardLeft: rect.left }

    const moveDrag = (pointerEvent: PointerEvent) => {
      const state = dragStateRef.current
      if (!state) return
      setDragPreview((current) => current ? {
        ...current,
        left: pointerEvent.clientX - cardRect.left - current.offsetX,
      } : current)
      const targetIndex = clampNumber(Math.floor((pointerEvent.clientX - state.boardLeft) / state.width), 0, palette.length - 1)
      if (targetIndex !== state.targetIndex) {
        dragStateRef.current = { ...state, targetIndex }
        flushSync(() => setDragTargetIndex(targetIndex))
      }
    }
    const finishDrag = () => {
      const state = dragStateRef.current
      if (state) {
        flushSync(() => reorderColor(state.sourceIndex, state.targetIndex))
      }
      setDraggedIndex(null)
      setDragTargetIndex(null)
      setDragPreview(null)
      dragStateRef.current = null
      window.removeEventListener("pointermove", moveDrag)
      window.removeEventListener("pointerup", finishDrag)
      window.removeEventListener("pointercancel", cancelDrag)
    }
    const cancelDrag = () => {
      setDraggedIndex(null)
      setDragTargetIndex(null)
      setDragPreview(null)
      dragStateRef.current = null
      window.removeEventListener("pointermove", moveDrag)
      window.removeEventListener("pointerup", finishDrag)
      window.removeEventListener("pointercancel", cancelDrag)
    }
    window.addEventListener("pointermove", moveDrag)
    window.addEventListener("pointerup", finishDrag, { once: true })
    window.addEventListener("pointercancel", cancelDrag, { once: true })
  }

  const exportPalette = (format: "image" | "code" | "svg") => {
    const hexes = palette.map((color) => color.hex)
    const svg = buildPaletteSvg(palette)
    if (format === "image") {
      downloadPalettePng(palette)
    }
    if (format === "svg") {
      void writeClipboard(svg)
    }
    if (format === "code") {
      void writeClipboard(`const palette = ${JSON.stringify(hexes, null, 2)}\n`)
    }
    setExportOpen(false)
  }

  const actionClass = "grid size-5 place-items-center rounded-full border border-current/25 bg-white/18 text-current backdrop-blur-sm transition hover:scale-105 hover:bg-white/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
  const hueBackground = "linear-gradient(90deg,#ff1d00,#fff500,#00ff38,#00d1ff,#1b2cff,#bd00ff,#ff0080,#ff1d00)"
  const pickerGradient = pickerColor
    ? `linear-gradient(180deg, rgba(255,255,255,0), #000), linear-gradient(90deg, #fff, ${pickerHueHex})`
    : undefined

  return (
    <div ref={paletteRootRef} className="min-h-[18.6rem]" onKeyDown={handleKeyDown}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span aria-hidden="true" />
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet"
            type="button"
            onClick={generatePalette}
          >
            <Shuffle aria-hidden="true" className="size-3.5" />
            Generate
          </button>
          <button
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md border text-slate-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet",
              exportOpen ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:border-slate-300 hover:text-slate-950",
            )}
            type="button"
            aria-label="Export palette"
            onClick={() => {
              setExportOpen(true)
              setPickerOpenIndex(null)
              closeShadePanel()
            }}
          >
            <Download aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        className="group/palette relative overflow-visible rounded-md border border-slate-200 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet"
        tabIndex={0}
        aria-label="Interactive color palette generator"
      >
        <div ref={paletteBoardRef} className="relative flex h-[18.5rem] overflow-visible">
          <span className="group/add-start absolute inset-y-0 left-2 z-30 flex w-10 items-center justify-start">
            <button
              className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 opacity-0 shadow-md transition hover:scale-105 hover:bg-slate-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet group-hover/add-start:opacity-100"
              type="button"
              aria-label="Add color to start"
              onClick={() => addColor("start")}
            >
              <Plus aria-hidden="true" className="size-5" />
            </button>
          </span>
          <span className="group/add-end absolute inset-y-0 right-2 z-30 flex w-10 items-center justify-end">
            <button
              className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 opacity-0 shadow-md transition hover:scale-105 hover:bg-slate-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet group-hover/add-end:opacity-100"
              type="button"
              aria-label="Add color to end"
              onClick={() => addColor("end")}
            >
              <Plus aria-hidden="true" className="size-5" />
            </button>
          </span>
          {palette.map((color, index) => {
            const textColor = getReadableTextColor(color.hex)
            const dragShift =
              draggedIndex === null || dragTargetIndex === null ? undefined :
              draggedIndex < dragTargetIndex && index > draggedIndex && index <= dragTargetIndex ? "translateX(-100%)" :
              draggedIndex > dragTargetIndex && index >= dragTargetIndex && index < draggedIndex ? "translateX(100%)" :
              undefined
            return (
              <div
                key={color.id}
                data-palette-color="true"
                className={cn(
                  "group/swatch relative flex min-w-0 flex-1 cursor-pointer flex-col justify-between overflow-visible p-3 text-left transition-all duration-200 focus-within:z-20",
                  !prefersReducedMotion && paletteEntryAnimation && "palette-generator-enter",
                  removingIndex === index && "scale-x-0 opacity-0",
                  draggedIndex === index && "opacity-0",
                )}
                style={{ backgroundColor: color.hex, color: textColor, flex: removingIndex === index ? "0 0 0%" : "1 1 0%", transform: dragShift }}
                role="button"
                tabIndex={0}
                onPointerDown={(event) => {
                  if ((event.target as HTMLElement).closest("button,[data-palette-popover],[data-palette-trigger]")) return
                  setPickerOpenIndex(null)
                  closeShadePanel()
                  setInfoColorId(color.id)
                }}
                onPointerEnter={() => setInfoColorId(color.id)}
                onClick={() => {
                  setPickerOpenIndex(null)
                  closeShadePanel()
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    setPickerOpenIndex(null)
                    closeShadePanel()
                  }
                }}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">0{index + 1}</span>
                  {color.locked && <Lock aria-hidden="true" className="size-3.5" />}
                </span>
                <span className="min-w-0">
                  <button
                    className="block max-w-full truncate rounded px-0.5 text-left font-mono text-[11px] font-semibold uppercase tracking-normal transition hover:bg-white/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                    type="button"
                    data-palette-trigger="true"
                    onClick={(event) => {
                      event.stopPropagation()
                      setInfoColorId(color.id)
                      setPickerOpenIndex((current) => (current === index ? null : index))
                      closeShadePanel()
                    }}
                  >
                    {color.hex.replace("#", "")}
                  </button>
                  <span className="mt-1 block truncate text-xs font-semibold">{color.name}</span>
                </span>
                <span
                  className={cn(
                    "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1 opacity-0 transition",
                    isDraggingPalette ? "pointer-events-none" : "group-hover/swatch:opacity-100",
                  )}
                  data-palette-actions="true"
                >
                  <button className={cn(actionClass, "group/action relative")} type="button" aria-label={`Remove ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); removeColor(index) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover/action:block">Remove color</span>
                    <X aria-hidden="true" className="size-3" />
                  </button>
                  <button className={cn(actionClass, "group/action relative")} type="button" data-palette-trigger="true" aria-label={`Show shades for ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); if (shadeState?.index === index && !shadePanelClosing) { closeShadePanel() } else { openShadePanel(index, color) } setPickerOpenIndex(null) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover/action:block">View shades</span>
                    <List aria-hidden="true" className="size-3" />
                  </button>
                  <span className={cn(actionClass, "group/action relative", color.locked ? "cursor-not-allowed opacity-45" : "cursor-grab touch-none active:cursor-grabbing")} aria-label={`Drag ${color.hex}`} role="img" onPointerDown={(event) => startPaletteDrag(event, index)}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover/action:block">Drag color</span>
                    <MoveHorizontal aria-hidden="true" className="size-3" />
                  </span>
                  <button className={cn(actionClass, "group/action relative")} type="button" aria-label={`Copy ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); void writeClipboard(color.hex) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover/action:block">Copy HEX</span>
                    <Copy aria-hidden="true" className="size-3" />
                  </button>
                  <button className={cn(actionClass, "group/action relative")} type="button" aria-label={color.locked ? `Unlock ${color.hex}` : `Lock ${color.hex}`} onClick={(event) => { event.stopPropagation(); blurPaletteAction(event); setInfoColorId(color.id); toggleLock(index) }}>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-950 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover/action:block">{color.locked ? "Unlock color" : "Lock color"}</span>
                    {color.locked ? <Lock aria-hidden="true" className="size-3" /> : <Unlock aria-hidden="true" className="size-3" />}
                  </button>
                </span>
                {pickerOpenIndex === index && pickerColor && (
                  <div className={cn("absolute bottom-14 z-40 w-[16rem] rounded-2xl border border-slate-200 bg-white p-3 text-slate-950 shadow-2xl sm:w-[18rem]", index === 0 ? "left-0" : index >= palette.length - 2 ? "right-0" : "left-1/2 -translate-x-1/2")} data-palette-popover="true" onClick={(event) => event.stopPropagation()}>
                    <div
                      className="relative h-28 cursor-crosshair overflow-hidden rounded-lg border border-slate-200"
                      style={{ background: pickerGradient }}
                      role="button"
                      tabIndex={0}
                      aria-label="Adjust saturation and brightness"
                      onPointerDown={(event) => startPickerDrag(event, index, "field")}
                    >
                      <span
                        className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-white shadow"
                        style={{ left: `${pickerHsv?.s ?? 0}%`, top: `${100 - (pickerHsv?.v ?? 100)}%` }}
                      />
                    </div>
                    <div
                      className="relative mt-3 h-3 cursor-ew-resize rounded-full"
                      style={{ background: hueBackground }}
                      role="button"
                      tabIndex={0}
                      aria-label="Adjust hue"
                      onPointerDown={(event) => startPickerDrag(event, index, "hue")}
                    >
                      <span
                        className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow"
                        style={{ backgroundColor: pickerColor.hex, left: `${((pickerHsv?.h ?? 0) / 360) * 100}%` }}
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-500 px-2 py-1.5">
                      <button className="min-w-0 flex-1 text-left font-mono text-base font-semibold" type="button" onClick={() => void writeClipboard(pickerColor.hex)}>
                        {pickerColor.hex}
                      </button>
                      <input
                        className="size-8 shrink-0 rounded border border-slate-200 bg-transparent"
                        type="color"
                        aria-label={`Pick replacement for ${pickerColor.hex}`}
                        value={pickerColor.hex}
                        onChange={(event) => replaceColor(index, event.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-sm font-semibold text-slate-950">Picker</span>
                      <div className="flex gap-3">
                        <button className="text-slate-950" type="button" aria-label="Pick color from screen" onClick={() => void pickWithEyeDropper(index)}>
                          <Pipette aria-hidden="true" className="size-5" />
                        </button>
                        <button className="text-slate-950" type="button" aria-label="Copy picked color" onClick={() => void writeClipboard(pickerColor.hex)}>
                          <Copy aria-hidden="true" className="size-5" />
                        </button>
                        <button className="text-slate-950" type="button" aria-label="Close picker" onClick={() => setPickerOpenIndex(null)}>
                          <X aria-hidden="true" className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {dragPreview && (
          <div
            data-palette-drag-preview="true"
            className="pointer-events-none absolute z-[70] flex flex-col justify-between rounded-sm p-3 text-left shadow-2xl"
            style={{
              backgroundColor: dragPreview.hex,
              color: getReadableTextColor(dragPreview.hex),
              height: dragPreview.height,
              left: dragPreview.left,
              top: dragPreview.top,
              width: dragPreview.width,
            }}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">DRAG</span>
              {dragPreview.locked && <Lock aria-hidden="true" className="size-3.5" />}
            </span>
            <span className="min-w-0">
              <span className="block max-w-full truncate font-mono text-[11px] font-semibold uppercase tracking-normal">{dragPreview.hex.replace("#", "")}</span>
              <span className="mt-1 block truncate text-xs font-semibold">{dragPreview.name}</span>
            </span>
          </div>
        )}

        {copyToast && (
          <div className="absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            {copyToast}
          </div>
        )}

        <div className="border-t border-slate-200 bg-white p-3" data-palette-bottom-rail="true" data-palette-popover="true">
          <div className="grid min-h-[4.5rem] gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,16rem)] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{infoColor?.name ?? "Palette color"}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-normal text-slate-500">
                {infoColor ? `${infoColor.hex} / RGB ${formatRgb(infoColor.hex)} / HSL ${hexToHsl(infoColor.hex)}` : "Select a color"}
              </p>
            </div>
            {shadeState !== null ? (
              <div className={cn("palette-shades-panel grid h-9 grid-cols-10 overflow-hidden rounded border border-slate-200", shadePanelClosing && "palette-shades-panel-exit")}>
                {shadeSet.map((shade) => (
                  <button
                    key={shade.hex}
                    className="h-full transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet"
                    type="button"
                    style={{ backgroundColor: shade.hex, color: getReadableTextColor(shade.hex) }}
                    onClick={() => applyShade(shade)}
                  >
                    <span className="sr-only">{shade.hex}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-9" aria-hidden="true" />
            )}
          </div>
        </div>

        {exportOpen && (
          <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950/72 p-4" data-palette-popover="true">
            <div className="w-full max-w-md rounded-2xl bg-white text-slate-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <p className="text-lg font-semibold">Export Palette</p>
                <button className="rounded p-1 text-slate-700 transition hover:bg-slate-100" type="button" aria-label="Close export palette" onClick={() => setExportOpen(false)}>
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 p-5">
                {[
                  ["image", "Image", Download],
                  ["code", "Code", FileCode2],
                  ["svg", "SVG", PanelsTopLeft],
                ].map(([format, label, Icon]) => (
                  <button
                    key={String(format)}
                    className="grid aspect-square place-items-center rounded-xl bg-slate-100 p-3 text-center transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-askewly-violet"
                    type="button"
                    aria-label={`Export palette as ${String(label)}`}
                    onClick={() => exportPalette(format as "image" | "code" | "svg")}
                  >
                    <Icon aria-hidden="true" className="size-7" />
                    <span className="text-sm font-semibold">{String(label)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const shaderGradientColors = ["#020617", "#6F2DBD", "#A663CC", "#B9FAF8", "#B8D0EB"]

function ShaderGradientDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="min-h-[24.7rem]">
      <div className="relative h-[24.7rem] overflow-hidden rounded-md border border-slate-200 bg-slate-950">
        <MeshGradient
          className="absolute inset-0 size-full"
          colors={shaderGradientColors}
          distortion={0.85}
          swirl={0.55}
          grainMixer={0.25}
          grainOverlay={0.12}
          speed={prefersReducedMotion ? 0 : 0.45}
        />
      </div>
    </div>
  )
}

type ImageRecipe = {
  name: string
  filter: string
  overlay?: string
  overlayBlend?: CSSProperties["mixBlendMode"]
  contrast: number
  saturation: number
  grain: number
}

const imageRecipes: ImageRecipe[] = [
  {
    name: "Duotone + Grain",
    filter: "grayscale(1) contrast(1.08) saturate(0.9)",
    overlay: "linear-gradient(135deg, var(--askewly-violet), var(--askewly-mint))",
    overlayBlend: "color",
    contrast: 1.08,
    saturation: 0.9,
    grain: 0.45,
  },
  {
    name: "Warm Film",
    filter: "sepia(0.4) contrast(0.92) saturate(1.1) brightness(1.02)",
    overlay: "linear-gradient(160deg, rgba(255,214,170,0.35), rgba(120,72,30,0.12))",
    overlayBlend: "soft-light",
    contrast: 0.92,
    saturation: 1.1,
    grain: 0.25,
  },
  {
    name: "High-Contrast Mono",
    filter: "grayscale(1) contrast(1.45) brightness(0.95)",
    contrast: 1.45,
    saturation: 0,
    grain: 0.6,
  },
]

const imageTreatmentPhotos = [
  "/assets/ecommerce-category-pages/stationery-hero.png",
  "/assets/ecommerce-storefront-pages/dark-desk-hero.png",
  "/assets/ecommerce-storefront-pages/apparel-hero.png",
  "/assets/ecommerce-reviews/avatar-navy-overshirt.png",
  "/assets/ecommerce-reviews/avatar-curly-hair.png",
  "/assets/ecommerce-reviews/avatar-silver-hair.png",
]

const IMAGE_TREATMENT_CYCLE_MS = 4500

function ImageTreatmentDemo() {
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
  const previewPhotos = imageTreatmentPhotos.slice(0, 3)

  return (
    <div className="grid min-h-[18.6rem] gap-3">
      <div className="rounded-md border border-slate-200 bg-white p-3">
        <p className="text-base font-semibold text-slate-950">{recipe.name}</p>
        <div className="mt-3 flex gap-1.5">
          {imageRecipes.map((item, index) => (
            <span key={item.name} className={cn("h-1 flex-1 rounded-full transition-colors", index === recipeIndex ? "bg-askewly-violet" : "bg-slate-100")} />
          ))}
        </div>
      </div>
      <div className="relative">
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id="filters-grain-noise">
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
          {previewPhotos.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-white">
              <img src={src} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: recipe.filter }} />
              {recipe.overlay && <div className="absolute inset-0" style={{ background: recipe.overlay, mixBlendMode: recipe.overlayBlend }} />}
              <div className="absolute inset-0" style={{ opacity: recipe.grain, mixBlendMode: "multiply", filter: "url(#filters-grain-noise)" }} />
            </div>
          ))}
        </div>
        {/* Single shared before/after line sweeping the whole grid, not one per tile. */}
        {!prefersReducedMotion && (
          <div
            key={recipeIndex}
            className="absolute inset-0 grid grid-cols-3 gap-2"
            style={{ animation: `filters-wipe-sweep ${IMAGE_TREATMENT_CYCLE_MS}ms linear 1` }}
          >
            {previewPhotos.map((src) => (
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

function MatterPhysicsDemo() {
  const prefersReducedMotion = usePrefersReducedMotion()
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
    // Extra solver iterations reduce how far the settled pile sinks into the floor.
    engine.positionIterations = 14
    engine.velocityIterations = 10
    engineRef.current = engine

    // Resting surface, matched to the physics floor top so clamped bodies align with the line.
    const FLOOR_INSET = 20

    function syncTokens() {
      const floorLine = element.clientHeight - FLOOR_INSET
      setTokens(recordsRef.current.map((record) => {
        const angle = record.body.angle
        // Half the vertical extent (rotation-aware for rects) so nothing renders past the floor line.
        const halfExtent = record.shape === "circle"
          ? record.width / 2
          : (Math.abs(Math.sin(angle)) * record.width + Math.abs(Math.cos(angle)) * record.height) / 2
        return {
          id: record.id,
          label: record.label,
          shape: record.shape,
          width: record.width,
          height: record.height,
          className: record.className,
          x: record.body.position.x,
          y: Math.min(record.body.position.y, floorLine - halfExtent),
          angle,
        }
      }))
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
        Matter.Bodies.rectangle(width / 2, height + wallThickness / 2 - 20, width + wallThickness * 2, wallThickness, { isStatic: true }),
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
          restitution: 0.5,
          friction: 0.46,
          frictionAir: 0.024,
          density: 0.00075,
          angle: (index % 2 === 0 ? -1 : 1) * (0.04 + index * 0.006),
        }
        const body = spec.shape === "circle"
          ? Matter.Bodies.circle(x, y, spec.width / 2, commonOptions)
          : Matter.Bodies.rectangle(x, y, spec.width, spec.height, {
              ...commonOptions,
              chamfer: { radius: Math.min(14, spec.height / 2 - 2) },
            })

        // Resist tumbling so labels settle mostly upright, without freezing rotation.
        if (spec.shape !== "circle") {
          Matter.Body.setInertia(body, body.inertia * 6)
        }

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
      const delta = Math.min(1000 / 60, Math.max(1000 / 90, time - previousTime))
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

    if (!prefersReducedMotion) {
      frameRef.current = window.requestAnimationFrame(tick)
    }

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
  }, [prefersReducedMotion])

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
      <p className="pointer-events-none absolute left-4 top-3.5 z-10 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">push the chips with your cursor</p>
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
      <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-left shadow-sm transition focus-within:border-askewly-orchid focus-within:ring-2 focus-within:ring-askewly-violet/20">
        <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-label="Askewly Design 검색"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
          className="hidden rounded border border-border bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:border-askewly-lavender hover:text-askewly-violet sm:inline"
          type="button"
          onClick={() => commitQuery()}
        >
          Ctrl F
        </button>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-md border border-border bg-popover p-2 text-left shadow-xl shadow-slate-950/10">
          <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {draftQuery.trim() ? "Suggested results" : "Quick search"}
          </p>
          <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                className={cn(
                  "flex min-w-0 items-start gap-3 rounded-md px-3 py-2 text-left transition",
                  index === activeIndex ? "bg-askewly-lavender/15 text-foreground" : "hover:bg-muted",
                )}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
              >
                <Search aria-hidden="true" className="mt-1 size-4 shrink-0 text-askewly-violet" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{suggestion.label}</span>
                  <span className="block truncate text-xs leading-5 text-muted-foreground">{suggestion.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
