import { BookOpen, Search, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { categories, terms } from "@/data/terms.generated"

function App() {
  const categoryCounts = categories.map((category) => ({
    category,
    count: terms.filter((term) => term.category === category).length,
  }))
  const sampleTerms = terms.slice(0, 12)

  return (
    <main className="min-h-svh bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:px-8 lg:px-10">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">UI Vocabulary Encyclopedia</p>
                <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-5xl">
                  이름 옆에 생김새가 붙는 UI 용어 사전
                </h1>
              </div>
            </div>
            <Badge variant="secondary" className="rounded-md px-3 py-1 text-sm">
              {terms.length} terms
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-11 pl-9" placeholder="토글, 모달, dropdown, combobox..." />
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryCounts.map((item) => (
                <Badge key={item.category} variant="outline" className="rounded-md">
                  {item.category} {item.count}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        <Separator />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sampleTerms.map((term, index) => (
            <Card key={term.id} className="overflow-hidden rounded-lg">
              <CardHeader className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">{term.category}</p>
                  <CardTitle className="mt-1 text-xl tracking-normal">
                    {term.ko.name}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">{term.en.name}</span>
                  </CardTitle>
                </div>
                <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {index + 1}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex min-h-24 items-center justify-center rounded-md border bg-muted/50 p-4">
                  <MiniVisual variant={term.asset.variant} label={term.ko.name} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-6 text-muted-foreground">{term.one_liner}</p>
                  <p className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
                    {term.prompt_phrases[0]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </section>
    </main>
  )
}

function MiniVisual({ variant, label }: { variant: string; label: string }) {
  if (variant.includes("button")) {
    return <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{label}</button>
  }

  if (variant.includes("field") || variant.includes("input")) {
    return <div className="h-9 w-44 rounded-md border bg-card px-3 py-2 text-left text-sm text-muted-foreground">Aa</div>
  }

  if (variant.includes("switch")) {
    return (
      <div className="flex h-7 w-12 items-center justify-end rounded-full bg-primary p-1">
        <div className="size-5 rounded-full bg-primary-foreground" />
      </div>
    )
  }

  if (variant.includes("card")) {
    return (
      <div className="w-44 rounded-md border bg-card p-3 shadow-sm">
        <div className="mb-2 h-3 w-20 rounded bg-foreground/20" />
        <div className="h-2 w-32 rounded bg-muted-foreground/25" />
      </div>
    )
  }

  if (variant.includes("table")) {
    return (
      <div className="grid w-44 grid-cols-3 overflow-hidden rounded-md border bg-card text-xs">
        {Array.from({ length: 9 }).map((_, cell) => (
          <div key={cell} className="h-7 border-b border-r p-1 last:border-r-0">
            <div className="h-2 rounded bg-muted-foreground/25" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
      <Sparkles className="size-4 text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default App
