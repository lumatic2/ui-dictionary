import { useState, type ReactNode } from "react"
import { Download, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TermVisual } from "@/components/term-visual"
import type { VocabularyTerm } from "@/data/terms.generated"
import { downloadNodeAsPng, getTermPngFileName } from "@/lib/export-capture"
import { categoryLabels } from "@/lib/search"
import { getRelatedTerms, getUseCasesForTerm } from "@/lib/term-ux"

type TermDetailProps = {
  term: VocabularyTerm | null
  terms: VocabularyTerm[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTerm: (term: VocabularyTerm) => void
}

export function TermDetail({ term, terms, open, onOpenChange, onSelectTerm }: TermDetailProps) {
  const [exporting, setExporting] = useState(false)
  const relatedTerms = term ? getRelatedTerms(term, terms) : []
  const useCases = term ? getUseCasesForTerm(term) : []

  async function saveDetailPng() {
    if (!term) {
      return
    }

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl">
        {term && (
          <div className="bg-background" data-export-detail={term.id}>
            <SheetHeader className="border-b p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Badge variant="outline" className="w-fit rounded-md">
                    {categoryLabels[term.category]}
                  </Badge>
                  <SheetTitle className="mt-3 text-2xl">{term.ko.name}</SheetTitle>
                  <SheetDescription>
                    {term.en.name} · {term.ko.aliases.concat(term.en.aliases).slice(0, 4).join(", ")}
                  </SheetDescription>
                </div>
                <Button
                  data-export-ignore="true"
                  disabled={exporting}
                  size="sm"
                  variant="outline"
                  onClick={saveDetailPng}
                >
                  <Download aria-hidden="true" />
                  {exporting ? "저장 중" : "PNG 저장"}
                </Button>
              </div>
            </SheetHeader>
            <ScrollArea className="h-[calc(100svh-120px)]">
              <div className="flex flex-col gap-6 p-5">
                <TermVisual variant={term.asset.variant} label={term.ko.name} size="detail" />
                <Section title="빠른 판단">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border bg-card p-3">
                      <p className="text-xs font-medium text-muted-foreground">이럴 때 쓴다</p>
                      <p className="mt-2 text-sm leading-6">{term.when_to_use[0]}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <p className="text-xs font-medium text-muted-foreground">이럴 땐 피한다</p>
                      <p className="mt-2 text-sm leading-6">{term.anti_use[0]}</p>
                    </div>
                  </div>
                </Section>
                <Section title="무엇인가">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm leading-6 text-foreground">{term.one_liner}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{term.description}</p>
                  </div>
                </Section>
                <Section title="생김새 단서">
                  <BulletList items={term.visual_anatomy} />
                </Section>
                <Section title="언제 쓰나">
                  <BulletList items={term.when_to_use} />
                </Section>
                <Section title="피해야 할 때">
                  <BulletList items={term.anti_use} />
                </Section>
                <Section title="AI에게 이렇게 말하기">
                  <div className="flex flex-col gap-2">
                    {term.prompt_phrases.map((phrase) => (
                      <p key={phrase} className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
                        {phrase}
                      </p>
                    ))}
                  </div>
                </Section>
                {relatedTerms.length > 0 && (
                  <Section title="비슷한 용어와 차이">
                    <div className="flex flex-col gap-2">
                      {relatedTerms.map((item) => (
                        <button
                          key={item.term.id}
                          type="button"
                          className="rounded-lg border bg-card p-3 text-left transition hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <div className="flex flex-col gap-2">
                    {term.sources.map((source) => (
                      <Button key={`${term.id}-${source.source_id}`} variant="outline" size="sm" className="justify-start">
                        <ExternalLink aria-hidden="true" />
                        {source.source_id}
                      </Button>
                    ))}
                  </div>
                </Section>
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
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
