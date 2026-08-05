import { DocsCodeBlock, type DocsCodeBlockVariant } from "@/components/docs-code-block"
import { ResponsiveContentGrid, type ContentGridItem } from "@/components/responsive-content-grid"
import { TerminalDemoPanel, type TerminalScene } from "@/components/terminal-demo-panel"

export type ArticleSection = {
  id: string
  heading: string
  body: string
  code?: { variants: DocsCodeBlockVariant[] }
}

export type ArticleData = {
  breadcrumb: string[]
  title: string
  lede: string
  sections: ArticleSection[]
  terminalScenes: TerminalScene[]
  related: ContentGridItem[]
}

/**
 * A guide page: prose with inline code blocks, a runnable-looking terminal
 * proof, and a related-reading grid — plus the on-page table of contents
 * that docs readers navigate by.
 *
 * The heading ids the TOC links to are the section ids, so the contract
 * between the two is the data file, not a scraping pass over rendered DOM.
 */
export function ArticlePage({ article }: { article: ArticleData }) {
  return (
    <div className="flex w-full min-w-0 gap-10">
      <article className="min-w-0 flex-1 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          {article.breadcrumb.join(" / ")}
        </nav>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{article.title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{article.lede}</p>

        {article.sections.map((section) => (
          <section key={section.id} className="mt-10 scroll-mt-20" id={section.id}>
            <h2 className="text-xl font-medium tracking-tight">{section.heading}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{section.body}</p>
            {section.code ? <DocsCodeBlock className="mt-4" variants={section.code.variants} /> : null}
          </section>
        ))}

        <section className="mt-10">
          <TerminalDemoPanel scenes={article.terminalScenes} />
        </section>

        <section className="mt-14">
          <h2 className="mb-6 text-xl font-medium tracking-tight">Related</h2>
          <ResponsiveContentGrid items={article.related} />
        </section>
      </article>

      <nav
        aria-label="On this page"
        className="sticky top-20 hidden h-fit w-52 shrink-0 py-8 xl:block"
      >
        <span className="text-xs font-medium uppercase text-muted-foreground">On this page</span>
        <ul className="mt-3 flex flex-col gap-2">
          {article.sections.map((section) => (
            <li key={section.id}>
              <a
                className="text-sm text-muted-foreground hover:text-foreground"
                href={`#${section.id}`}
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
