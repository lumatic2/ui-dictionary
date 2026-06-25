import { ExternalLink } from "lucide-react"
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
import { categoryLabels } from "@/lib/search"

type TermDetailProps = {
  term: VocabularyTerm | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TermDetail({ term, open, onOpenChange }: TermDetailProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-xl">
        {term && (
          <>
            <SheetHeader className="border-b p-5">
              <Badge variant="outline" className="w-fit rounded-md">
                {categoryLabels[term.category]}
              </Badge>
              <SheetTitle className="text-2xl">{term.ko.name}</SheetTitle>
              <SheetDescription>
                {term.en.name} · {term.ko.aliases.concat(term.en.aliases).slice(0, 4).join(", ")}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100svh-120px)]">
              <div className="flex flex-col gap-6 p-5">
                <TermVisual variant={term.asset.variant} label={term.ko.name} size="detail" />
                <Section title="한 줄 설명">
                  <p className="text-sm leading-6 text-muted-foreground">{term.description}</p>
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
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
