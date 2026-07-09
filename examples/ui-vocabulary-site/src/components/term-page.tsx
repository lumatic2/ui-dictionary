import { ArrowLeft, Check, Copy, Download, ExternalLink } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TermVisual } from "@/components/term-visual"
import { sourceRegistry, type VocabularyTerm } from "@/data/terms.generated"
import { downloadNodeAsPng, getTermPngFileName } from "@/lib/export-capture"
import { isNavigationPathVisible } from "@/lib/exposure"
import { categoryLabels, kindLabels } from "@/lib/search"
import { getRelatedTerms, getUseCasesForTerm } from "@/lib/term-ux"

const sourcesById = new Map(sourceRegistry.map((source) => [source.id, source]))

type TermPageProps = {
  term: VocabularyTerm
  terms: VocabularyTerm[]
  onBack: () => void
  onNavigatePath: (path: string[]) => void
  onSelectTerm: (term: VocabularyTerm) => void
}

export function TermPage({ term, terms, onBack, onNavigatePath, onSelectTerm }: TermPageProps) {
  const [exporting, setExporting] = useState(false)
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null)
  const relatedTerms = getRelatedTerms(term, terms)
  const useCases = getUseCasesForTerm(term)
  const visibleAlsoAppearsIn = (term.navigation?.also_appears_in ?? []).filter(isNavigationPathVisible)

  async function saveDetailPng() {
    const target = document.querySelector<HTMLElement>(`[data-export-detail="${term.id}"]`)
    if (!target) {
      return
    }

    setExporting(true)
    try {
      await downloadNodeAsPng(target, getTermPngFileName(term))
    } finally {
      setExporting(false)
    }
  }

  async function copyPromptPhrase(phrase: string) {
    try {
      await navigator.clipboard.writeText(phrase)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = phrase
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.top = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }

    setCopiedPhrase(phrase)
    window.setTimeout(() => setCopiedPhrase((current) => (current === phrase ? null : current)), 1600)
  }

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-8" data-export-detail={term.id}>
      <div className="flex flex-wrap items-center justify-between gap-3" data-print-hidden>
        <Button type="button" variant="ghost" onClick={onBack}>
          <ArrowLeft aria-hidden="true" />
          목록으로
        </Button>
        <Button disabled={exporting} type="button" variant="outline" onClick={saveDetailPng}>
          <Download aria-hidden="true" />
          {exporting ? "저장 중" : "PNG 저장"}
        </Button>
      </div>

      <header className="grid gap-8 border-b pb-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0">
          {term.navigation?.canonical_path && (
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              {term.navigation.canonical_path.join(" / ")}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-md">
              {categoryLabels[term.category]}
            </Badge>
            {term.kind !== "component" && (
              <Badge variant="secondary" className="rounded-md">
                {kindLabels[term.kind]}
              </Badge>
            )}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">{term.ko.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{term.en.name}</p>
          <p className="mt-6 max-w-3xl text-base leading-7 text-foreground">{term.one_liner}</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{term.description}</p>
        </div>
        <div className="overflow-hidden rounded-md border bg-background">
          <TermVisual variant={term.asset.variant} label={term.ko.name} size="detail" />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-8">
          <Section title="빠른 판단">
            <div className="grid gap-0 border-y sm:grid-cols-2 sm:divide-x">
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground">이럴 때 쓴다</p>
                <p className="mt-2 text-sm leading-6">{term.when_to_use[0]}</p>
              </div>
              <div className="border-t p-4 sm:border-t-0">
                <p className="text-xs font-medium text-muted-foreground">이럴 땐 피한다</p>
                <p className="mt-2 text-sm leading-6">{term.anti_use[0]}</p>
              </div>
            </div>
          </Section>

          <Section title="생김새 단서">
            <BulletList items={term.visual_anatomy} />
          </Section>

          <Section title="언제 쓰나">
            <BulletList items={term.when_to_use} />
          </Section>

          <Section title="피해야 할 경우">
            <BulletList items={term.anti_use} />
          </Section>

          <Section title="AI에게 이렇게 말하기">
            <div className="flex flex-col gap-2">
              {term.prompt_phrases.map((phrase) => (
                <div key={phrase} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-md bg-accent p-2 text-accent-foreground">
                  <p className="min-w-0 px-1 py-1 text-sm leading-6">{phrase}</p>
                  <Button data-export-ignore="true" size="sm" variant="secondary" onClick={() => copyPromptPhrase(phrase)}>
                    {copiedPhrase === phrase ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                    {copiedPhrase === phrase ? "복사됨" : "복사"}
                  </Button>
                </div>
              ))}
            </div>
          </Section>

          {relatedTerms.length > 0 && (
            <Section title="비슷한 용어와 차이">
              <div className="divide-y border-y">
                {relatedTerms.map((item) => (
                  <button
                    key={`${item.term.id}-${item.relation}-${item.note}`}
                    type="button"
                    className="w-full p-4 text-left transition hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onSelectTerm(item.term)}
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{item.term.ko.name}</span>
                      <Badge variant="secondary" className="rounded-md">{item.relation}</Badge>
                      <span className="text-xs text-muted-foreground">{item.term.en.name}</span>
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">{item.note}</span>
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          {visibleAlsoAppearsIn.length > 0 && (
            <Section title="다른 위치">
              <div className="flex flex-col gap-2">
                {visibleAlsoAppearsIn.map((path) => (
                  <button
                    key={path.join("/")}
                    type="button"
                    className="rounded-md border px-3 py-2 text-left text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onNavigatePath(path)}
                  >
                    {path.join(" / ")}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {useCases.length > 0 && (
            <Section title="상황별 묶음">
              <div className="flex flex-wrap gap-2">
                {useCases.map((item) => (
                  <Badge key={item.id} variant="outline" className="rounded-md px-3 py-1">
                    {item.label}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

            <Section title="출처">
            <div className="divide-y border-y">
              {term.sources.map((source) => {
                const reference = sourcesById.get(source.source_id)

                return (
                  <div key={`${term.id}-${source.source_id}`} className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="rounded-md">
                        Tier {reference?.tier ?? "?"}
                      </Badge>
                      <p className="min-w-0 flex-1 text-sm font-medium">
                        {reference?.label ?? source.source_id}
                      </p>
                      {reference && (
                        <Button asChild data-export-ignore="true" size="sm" variant="outline">
                          <a href={reference.url} rel="noreferrer" target="_blank">
                            <ExternalLink aria-hidden="true" />
                            열기
                          </a>
                        </Button>
                      )}
                    </div>
                    {source.note && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.note}</p>
                    )}
                    {!reference && (
                      <p className="mt-2 text-xs text-destructive">등록되지 않은 source id입니다.</p>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>
        </aside>
      </div>
    </article>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
