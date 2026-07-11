---
id: article-documentation-layout
name: "Article Documentation Layout"
pattern_group: docs
kind: block
status: draft
surface_refs: [documentation, websites]
tokens_used:
  - color.semantic.surface.base
  - color.semantic.surface.raised
  - color.semantic.text.default
  - color.semantic.text.muted
  - color.semantic.border.default
  - dimension.space.4
  - dimension.space.8
  - dimension.space.12
  - typography.scale.sm
  - typography.scale.xl
  - typography.weight.medium
code_asset: examples/ui-vocabulary-site/src/App.tsx
component_refs: []
term_refs: [breadcrumb, typography, content-section, anchor-nav]
source_refs: []
last_verified: 2026-07-10
---

## Intent

A documentation article layout turns a long implementation rule into a predictable reading path: breadcrumb and title establish context, a short lead states the decision the article helps make, ordered sections carry definitions and examples, and an on-this-page rail exposes the structure without competing with the body.

## Anatomy

- Context header: breadcrumb, article title, and one-paragraph lead.
- Main column: readable line length with ordered sections and optional code blocks.
- Supporting rail: section labels only; it never duplicates full body copy.
- Related terms: a final comparison surface that keeps nearby vocabulary discoverable.

## States

- Default: article and rail are visible on wide screens.
- Narrow viewport: the rail disappears and the article becomes one column without horizontal overflow.
- Long code: the code block scrolls within its own boundary.
- Missing optional data: previews, API rows, examples, or related terms collapse without empty shells.

## Variants

- Setup article: conceptual guidance and ordered next steps.
- Foundation article: tokens, usage, light/dark behavior, and agent constraints.
- Element article: interactive preview, state contract, API, and accessibility details.
- Category article: shared judgment rules plus a related-term catalog.

## Code

```tsx
function DocumentationArticle({ page }: { page: DocsArticlePageData }) {
  return (
    <article className="mx-auto grid w-full max-w-[76rem] gap-10 xl:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="min-w-0 max-w-4xl">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          {page.breadcrumb}
        </p>
        <h1 className="mt-5 text-5xl text-foreground">{page.title}</h1>
        <p className="mt-8 max-w-3xl leading-7 text-muted-foreground">{page.lead}</p>
        <div className="mt-14 flex flex-col gap-14">
          {page.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.code && <pre className="overflow-x-auto bg-foreground text-background"><code>{section.code}</code></pre>}
            </section>
          ))}
        </div>
      </div>
      <aside className="hidden border-l pl-6 xl:block" aria-label="On this page">
        {page.onThisPage.map((item) => <span key={item}>{item}</span>)}
      </aside>
    </article>
  )
}
```

## Checks

- The lead names the decision or task, not merely the topic.
- Heading order remains semantic and does not skip levels for styling.
- At narrow width the rail is absent, the main column is `min-w-0`, and code scrolls locally.
- Empty optional sections leave no placeholder chrome.
- Light and dark surfaces preserve text, muted text, border, and code contrast.

## Anti-patterns

- **Planning memo as public copy**: internal status, implementation history, or TODO language replaces a reader-facing explanation.
- **Navigation duplicates the article**: the rail repeats paragraphs instead of exposing a short outline.
- **Unbounded code block**: a long command or URL widens the entire page on mobile.
- **Heading paint without hierarchy**: arbitrary font sizes replace semantic heading order.

## Agent notes

- prompt_phrases: "documentation article with a readable main column and responsive outline", "decision-first docs page with related vocabulary"
- fallbacks: omit the rail when there are fewer than three sections; preserve the article order.
- canonical guidance: `docs/design-system/principles.md` principles 1, 5, and 7.
- scroll-spy rail: `anchor-nav` (term) already covers a section-link rail with an active-section indicator; wiring the `onThisPage` rail here to highlight on scroll (IntersectionObserver-based) is an `anchor-nav`-style extension of this rail, not a separate recipe.
