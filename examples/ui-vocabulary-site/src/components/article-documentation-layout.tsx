import { useState } from "react"
import {
  Archive,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  CheckCircle2,
  Clipboard,
  CloudUpload,
  Copy,
  Cpu,
  Edit3,
  Mail,
  Move,
  MousePointerClick,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DocsArticlePageData } from "@/lib/documentation-pages"
import type { VocabularyTerm } from "@/data/terms.generated"

function DocsInteractiveElementPreview({ variant }: { variant: DocsArticlePageData["preview"] }) {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState("")
  const [copied, setCopied] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(true)
  const [disclosureIndex, setDisclosureIndex] = useState(0)
  const [tab, setTab] = useState("Overview")

  if (!variant) return null

  if (variant === "docs-command-palette") {
    const commands = ["Workflow Inc. / Website Redesign", "Add new file...", "Add new folder...", "Add hashtag...", "Add label..."]
    const visibleCommands = commands.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    const active = selected || visibleCommands[0] || ""

    return (
      <div className="relative mx-auto flex aspect-[4/5] max-w-2xl items-center justify-center overflow-hidden rounded-lg bg-slate-200 sm:aspect-[16/10]">
        <img alt="" className="absolute inset-0 size-full object-cover" src="/generated/docs/command-palette-bg-1.png" />
        <div
          className={cn(
            "relative w-[86%] origin-center overflow-hidden rounded-xl bg-white/95 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur transition duration-200 ease-out sm:w-[82%]",
            open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0",
          )}
        >
          <div className="flex items-center gap-2 border-b px-4 py-3 text-sm text-slate-400">
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <input aria-label="Search commands" className="min-w-0 flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search..." tabIndex={open ? 0 : -1} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Escape" && setOpen(false)} />
            <button className="rounded px-1.5 py-0.5 text-[0.65rem] hover:bg-slate-100" tabIndex={open ? 0 : -1} type="button" onClick={() => setOpen(false)}>Esc</button>
          </div>
          <div className="p-3">
            <p className="px-2 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">Recent searches</p>
            {visibleCommands.length > 0 ? visibleCommands.map((item, index) => (
              <button key={item} className={cn("flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition active:scale-[0.99]", item === active ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50")} tabIndex={open ? 0 : -1} type="button" onClick={() => setSelected(item)}>
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <Clipboard aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 truncate whitespace-nowrap">{item}</span>
                </span>
                {index > 0 && <span className="shrink-0 text-[0.65rem] text-slate-400">⌘{index}</span>}
              </button>
            )) : <p className="px-3 py-5 text-sm text-slate-500">No commands found.</p>}
            <p className={cn("px-3 pb-1 pt-2 text-xs text-slate-500 transition", selected ? "opacity-100" : "opacity-0")}>Selected: <span className="font-medium text-slate-700">{selected || "None"}</span></p>
          </div>
        </div>
        <button
          className={cn(
            "absolute rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-xl transition duration-200 ease-out hover:bg-slate-800",
            open ? "pointer-events-none translate-y-3 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100",
          )}
          tabIndex={open ? -1 : 0}
          type="button"
          onClick={() => setOpen(true)}
        >
          Open command palette
        </button>
      </div>
    )
  }

  if (variant === "docs-autocomplete") {
    const people = ["Leslie Alexander", "Michael Foster", "Dries Vincent", "Lindsay Walton", "Courtney Henry"]
    const visiblePeople = people.filter((name) => name.toLowerCase().includes(query.toLowerCase()))

    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-12">
        <div className="w-72">
          <label className="mb-2 block text-xs font-semibold text-slate-700">Assigned to</label>
          <div className="flex h-10 w-full items-center gap-2 rounded-md border bg-white px-3 text-sm shadow-sm">
            <input aria-label="Search teammates" className="min-w-0 flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400" placeholder={selected || "Search teammates..."} value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true) }} onFocus={() => setOpen(true)} />
            <button aria-label="Toggle teammate options" type="button" onClick={() => setOpen((value) => !value)}><ChevronDown aria-hidden="true" className={cn("size-4 text-slate-400 transition", open && "rotate-180")} /></button>
          </div>
          <div
            className={cn(
              "mt-1 origin-top overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-900/10 transition duration-200 ease-out",
              open ? "max-h-72 translate-y-0 scale-100 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 scale-95 opacity-0",
            )}
          >
              {visiblePeople.map((name) => (
                <button key={name} className={cn("flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-slate-50", selected === name && "bg-slate-100")} tabIndex={open ? 0 : -1} type="button" onClick={() => { setSelected(name); setQuery(""); setOpen(false) }}>
                  <span className={cn("size-6 rounded-full", ["bg-rose-200", "bg-amber-200", "bg-sky-200", "bg-emerald-200", "bg-violet-200"][people.indexOf(name)])} />
                  <span className="text-slate-700">{name}</span>
                </button>
              ))}
              {visiblePeople.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">No teammates found.</p>}
            </div>
          <p className={cn("mt-3 text-xs text-slate-500 transition", selected ? "opacity-100" : "opacity-0")}>Selected: {selected || "None"}</p>
        </div>
      </div>
    )
  }

  if (variant === "docs-dropdown-menu") {
    const items = [[Edit3, "Edit"], [Copy, "Duplicate"], [Archive, "Archive"], [Move, "Move"], [UserRound, "Share"], [CheckCircle2, "Add to favorites"], [Trash2, "Delete"]] as const

    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-12">
        <div className="relative h-[23.5rem] w-72">
          <button
            aria-expanded={open}
            className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            type="button"
            onClick={() => setOpen((value) => !value)}
          >
            Options <ChevronDown aria-hidden="true" className={cn("size-4 text-slate-400 transition-transform duration-200", open && "rotate-180")} />
          </button>
          <div
            className={cn(
              "absolute right-0 top-12 w-72 origin-top-right overflow-hidden rounded-lg bg-white text-sm shadow-xl ring-1 ring-slate-900/10 transition duration-200 ease-out",
              open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0",
            )}
          >
            {items.map(([Icon, label], index) => (
              <button
                key={label}
                className={cn("flex w-full items-center gap-3 px-4 py-3 text-left text-slate-600 hover:bg-slate-50", [2, 4, 6].includes(index) && "border-t", label === "Delete" && "text-rose-600")}
                tabIndex={open ? 0 : -1}
                type="button"
                onClick={() => {
                  setSelected(label)
                  setOpen(false)
                }}
              >
                <Icon aria-hidden="true" className="size-5 text-slate-400" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <p className="absolute left-0 top-[22.75rem] text-xs text-slate-500">Selected: {selected || "No action selected"}</p>
        </div>
      </div>
    )
  }

  if (variant === "docs-copy-button") {
    const command = "npm install ui-dictionary\nnpx ui-dictionary add command-palette"

    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center rounded-lg bg-slate-100">
        <div className={cn("w-[min(32rem,90%)] overflow-hidden rounded-xl bg-slate-950 text-slate-100 shadow-xl transition duration-200", copied && "scale-[1.015] ring-2 ring-emerald-400/70")}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400">
            <span>install.sh</span>
            <button className={cn("inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-slate-100 transition", copied ? "bg-emerald-500/20 text-emerald-100" : "bg-white/10 hover:bg-white/15")} type="button" onClick={async () => { try { await navigator.clipboard?.writeText(command) } catch { /* clipboard may be unavailable in preview contexts */ } setCopied(true); window.setTimeout(() => setCopied(false), 1600) }}>{copied ? <CheckCircle2 aria-hidden="true" className="size-3.5 animate-in zoom-in duration-150" /> : <Copy aria-hidden="true" className="size-3.5" />} {copied ? "Copied" : "Copy"}</button>
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-7"><code>{command}</code></pre>
          <p className="sr-only" aria-live="polite">{copied ? "Copied install command" : ""}</p>
        </div>
      </div>
    )
  }

  if (variant === "docs-dialog") {
    return (
      <div className="relative mx-auto flex aspect-[16/10] max-w-2xl items-center justify-center overflow-hidden rounded-lg bg-slate-100">
        <div aria-hidden={dialogOpen} className={cn("flex flex-col items-center gap-3 transition duration-200", dialogOpen && "scale-95 opacity-40")}>
          <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800" tabIndex={dialogOpen ? -1 : 0} type="button" onClick={() => setDialogOpen(true)}>Open dialog</button>
          <p className="text-xs text-slate-500">{selected || "Project is still active"}</p>
        </div>
        <button
          aria-label="Close dialog backdrop"
          className={cn("absolute inset-0 bg-slate-900/20 transition duration-200", dialogOpen ? "opacity-100" : "pointer-events-none opacity-0")}
          tabIndex={dialogOpen ? 0 : -1}
          type="button"
          onClick={() => setDialogOpen(false)}
        />
        <div
          aria-modal="true"
          aria-hidden={!dialogOpen}
          role="dialog"
          className={cn("relative w-80 rounded-xl bg-white p-6 text-sm shadow-2xl ring-1 ring-slate-900/10 transition duration-200 ease-out", dialogOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0")}
        >
          <div className="grid size-10 place-items-center rounded-full bg-rose-100 text-rose-600"><CircleAlert aria-hidden="true" className="size-5" /></div>
          <h4 className="mt-4 text-base font-semibold text-slate-950">Delete project</h4>
          <p className="mt-2 leading-6 text-slate-500">This action cannot be undone. All project files and activity will be removed.</p>
          <div className="mt-6 flex justify-end gap-2">
            <button className="rounded-md border px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50" tabIndex={dialogOpen ? 0 : -1} type="button" onClick={() => setDialogOpen(false)}>Cancel</button>
            <button className="rounded-md bg-rose-600 px-3 py-2 font-semibold text-white transition hover:bg-rose-500" tabIndex={dialogOpen ? 0 : -1} type="button" onClick={() => { setSelected("Project deleted"); setDialogOpen(false) }}>Delete</button>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "docs-disclosure") {
    const rows = [
      ["How do I choose a component pattern?", "Start with the user action, then compare the state, layout, and feedback examples before implementing."],
      ["How do you make holy water?", "You boil the hell out of it, then keep the answer collapsed until the user asks for it."],
      ["What do you call someone with no body and no nose?", "Nobody knows. The important part is that the disclosure button and panel stay connected."],
      ["Why do you never see elephants hiding in trees?", "Because they are really good at it. Long answer copy should expand without shifting unrelated controls."],
      ["Why can't you hear a pterodactyl go to the bathroom?", "Because the P is silent. The open row announces its content while closed rows remain compact."],
    ]

    return (
      <div className="mx-auto flex aspect-[4/5] max-w-2xl items-start justify-center overflow-hidden rounded-lg bg-white px-6 pt-16 ring-1 ring-slate-200 sm:aspect-[16/10]">
        <div className="w-full max-w-xl">
          <h4 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">Frequently asked questions</h4>
          <div className="mt-10 divide-y divide-slate-200">
          {rows.map(([title, body], index) => {
            const rowOpen = disclosureIndex === index
            return (
              <div key={title} className="py-4">
                <button className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-slate-950 transition hover:text-slate-700" type="button" onClick={() => setDisclosureIndex((value) => value === index ? -1 : index)}>
                  <span>{title}</span>
                  <span className="grid size-5 shrink-0 place-items-center text-2xl font-light leading-none text-slate-700">{rowOpen ? "-" : "+"}</span>
                </button>
                <div aria-hidden={!rowOpen} className={cn("grid transition-[grid-template-rows] duration-200 ease-out", rowOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className={cn("mt-3 max-w-lg text-sm leading-6 text-slate-600 transition duration-200", rowOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0")}>{body}</p>
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "docs-popover") {
    const solutions = [
      [Cpu, "Analytics", "Get a better understanding of your traffic"],
      [Sparkles, "Engagement", "Speak directly to your customers"],
      [ShieldCheck, "Security", "Your customers' data will be safe and secure"],
      [Shapes, "Integrations", "Connect with third-party tools"],
      [CloudUpload, "Automations", "Build strategic funnels that will convert"],
    ] as const
    const activeSolution = selected || "Analytics"

    return (
      <div className="mx-auto flex aspect-[4/5] max-w-2xl items-start justify-center overflow-hidden rounded-lg bg-white pt-7 ring-1 ring-slate-200 sm:aspect-[16/10]">
        <div className="relative h-[25rem] w-[min(28rem,88%)]">
          <button className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50" type="button" onClick={() => setOpen((value) => !value)}>
            Solutions <ChevronDown aria-hidden="true" className={cn("size-4 text-slate-700 transition-transform duration-200", open && "rotate-180")} />
          </button>
          <div
            className={cn(
              "absolute left-1/2 top-10 w-full origin-top -translate-x-1/2 overflow-hidden rounded-3xl bg-white text-sm shadow-xl ring-1 ring-slate-900/10 transition duration-200 ease-out",
              open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0",
            )}
          >
            <div className="space-y-1.5 p-4">
              {solutions.map(([Icon, title, body]) => (
                <button key={title} className={cn("flex w-full items-center gap-4 rounded-xl p-1 text-left transition", activeSolution === title ? "bg-slate-50" : "hover:bg-slate-50")} tabIndex={open ? 0 : -1} type="button" onClick={() => setSelected(title)}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-900/5">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-950">{title}</span>
                    <span className="mt-0.5 block truncate text-xs text-slate-600">{body}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x border-t bg-slate-50">
              <button className="inline-flex items-center justify-center gap-3 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-white" tabIndex={open ? 0 : -1} type="button" onClick={() => setSelected("Watch demo")}>
                <MousePointerClick aria-hidden="true" className="size-4 text-slate-400" /> Watch demo
              </button>
              <button className="inline-flex items-center justify-center gap-3 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-white" tabIndex={open ? 0 : -1} type="button" onClick={() => setSelected("Contact sales")}>
                <Mail aria-hidden="true" className="size-4 text-slate-400" /> Contact sales
              </button>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">Selected: {activeSolution}</p>
        </div>
      </div>
    )
  }

  if (variant === "docs-select") {
    const roles = ["Admin", "Member", "Viewer", "Billing only"]

    return (
      <div className="mx-auto flex aspect-[16/10] max-w-2xl items-start justify-center rounded-lg bg-slate-100 pt-14">
        <div className="w-80">
          <label className="mb-2 block text-xs font-semibold text-slate-700">Role</label>
          <button className="flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50" type="button" onClick={() => setOpen((value) => !value)}>{selected || "Admin"} <ChevronDown aria-hidden="true" className={cn("size-4 text-slate-400 transition-transform duration-200", open && "rotate-180")} /></button>
          <div className={cn("mt-1 origin-top overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-900/10 transition duration-200 ease-out", open ? "max-h-60 translate-y-0 scale-100 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 scale-95 opacity-0")}>
            {roles.map((item) => <button key={item} className={cn("flex w-full items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-slate-50", (selected || "Admin") === item ? "bg-indigo-50 text-indigo-700" : "text-slate-600")} tabIndex={open ? 0 : -1} type="button" onClick={() => { setSelected(item); setOpen(false) }}><span>{item}</span>{(selected || "Admin") === item && <CheckCircle2 aria-hidden="true" className="size-4" />}</button>)}
          </div>
        </div>
      </div>
    )
  }

  const activeTab = tab === "Preview" ? "Preview" : "Write"

  return (
    <div className="mx-auto flex aspect-[4/5] max-w-2xl items-center justify-center rounded-lg bg-white ring-1 ring-slate-200 sm:aspect-[16/10]">
      <div className="w-[min(36rem,86%)]">
        <div className="mb-2 flex items-center justify-between">
          <div role="tablist" aria-label="Comment editor tabs" className="flex gap-2">
            {["Write", "Preview"].map((item) => (
              <button key={item} role="tab" aria-selected={activeTab === item} className={cn("rounded-md px-4 py-2 text-sm font-medium transition", activeTab === item ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")} type="button" onClick={() => setTab(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex gap-5 text-slate-400">
            <Clipboard aria-hidden="true" className="size-4" />
            <Cpu aria-hidden="true" className="size-4" />
            <CircleHelp aria-hidden="true" className="size-4" />
          </div>
        </div>
        <div className="relative">
          <textarea aria-label="Add your comment" className={cn("h-32 w-full resize-none rounded-md border border-slate-300 bg-white p-4 text-sm text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20", activeTab === "Write" ? "opacity-100" : "pointer-events-none opacity-0")} placeholder="Add your comment..." value={selected} onChange={(event) => setSelected(event.target.value)} />
          <div className={cn("absolute inset-0 rounded-md border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-600 transition duration-200", activeTab === "Preview" ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0")}>
            {selected ? selected : "Nothing to preview yet."}
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]" type="button" onClick={() => setSelected((value) => value || "Draft comment posted.")}>Post</button>
        </div>
      </div>
    </div>
  )
}

export function DocsArticlePage({ page, relatedTerms, onSelectTerm }: { page: DocsArticlePageData; relatedTerms: VocabularyTerm[]; onSelectTerm: (term: VocabularyTerm) => void }) {
  return (
    <article className="mx-auto grid w-full max-w-[76rem] gap-10 xl:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="min-w-0 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{page.breadcrumb}</p>
        <h2 className="mt-5 text-5xl font-normal tracking-normal text-slate-950 md:text-6xl">{page.title}</h2>
        {page.lead && <p className="mt-8 max-w-3xl text-base leading-7 text-slate-600">{page.lead}</p>}

        {page.kind === "element" && (
          <div className="mt-8 rounded-xl border bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
            이 문서는 UI Dictionary의 공개 vocabulary를 기준으로 작성되었습니다. Tailwind Plus element docs의 구조는 참고하되, 내용은 우리 용어/프롬프트/상태 검증 기준에 맞춥니다.
          </div>
        )}

        {page.kind === "element" && page.preview && (
          <section className="mt-8" data-docs-element-preview={page.preview}>
            <div className="overflow-hidden rounded-xl border bg-slate-100 p-4 shadow-sm md:p-8">
              <DocsInteractiveElementPreview variant={page.preview} />
            </div>
          </section>
        )}

        {(page.apiSections?.length || (page.apiRows?.length ?? 0) > 0) && (
          <section className="mt-14 flex flex-col gap-6">
            <h3 className="text-xl font-semibold tracking-normal text-slate-950">Component API</h3>
            {page.apiSections?.map((apiSection) => (
              <div key={apiSection.title} className="flex flex-col gap-4">
                <h4 className="font-mono text-sm font-semibold text-slate-950">{apiSection.title}</h4>
                <p className="text-sm leading-6 text-slate-600">{apiSection.description}</p>
                {apiSection.groups.map((group) => (
                  <div key={group.label} className="overflow-hidden rounded-xl border">
                    <div className="border-b bg-slate-50 px-4 py-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{group.label}</div>
                    <table className="w-full border-collapse text-left text-sm">
                      <tbody>
                        {group.rows.map((row) => (
                          <tr key={row.name} className="border-b last:border-b-0">
                            <th className="w-48 bg-white px-4 py-4 align-top font-mono text-xs font-semibold text-slate-950">{row.name}</th>
                            <td className="px-4 py-4 leading-6 text-slate-600">{row.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))}
            {!page.apiSections?.length && page.apiRows && (
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full border-collapse text-left text-sm">
                  <tbody>
                    {page.apiRows.map((row) => (
                      <tr key={row.name} className="border-b last:border-b-0">
                        <th className="w-48 bg-slate-50 px-4 py-4 align-top font-mono text-xs font-semibold text-slate-950">{row.name}</th>
                        <td className="px-4 py-4 leading-6 text-slate-600">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {page.examples && page.examples.length > 0 && (
          <section className="mt-14 flex flex-col gap-7">
            <h3 className="text-xl font-semibold tracking-normal text-slate-950">Examples</h3>
            <div className="flex flex-col gap-7">
              {page.examples.map((example) => (
                <div key={example.title} className="flex flex-col gap-2">
                  <h4 className="text-sm font-semibold text-slate-950">{example.title}</h4>
                  <p className="text-sm leading-6 text-slate-600">{example.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 flex flex-col gap-14">
          {page.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-6">
              <h3 className="text-xl font-semibold tracking-normal text-slate-950">{section.title}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-slate-600">{paragraph}</p>
              ))}
              {section.code && (
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-7 text-slate-100 shadow-sm"><code>{section.code}</code></pre>
              )}
            </section>
          ))}
        </div>

        {relatedTerms.length > 0 && (
          <section className="mt-14 flex flex-col gap-4">
            <h3 className="text-xl font-semibold tracking-normal text-slate-950">Related terms</h3>
            <div className="divide-y border-y">
              {relatedTerms.map((term) => (
                <button
                  key={term.id}
                  className="grid w-full gap-2 py-4 text-left transition hover:bg-accent/30 sm:grid-cols-[12rem_minmax(0,1fr)] sm:px-3"
                  type="button"
                  onClick={() => onSelectTerm(term)}
                >
                  <span className="font-semibold text-slate-950">{term.ko.name}</span>
                  <span className="text-sm leading-6 text-slate-600">{term.one_liner}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="hidden border-l pl-6 text-sm xl:block">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">On this page</p>
        <div className="mt-5 flex flex-col gap-3 text-slate-600">
          {page.onThisPage.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </aside>
    </article>
  )
}

