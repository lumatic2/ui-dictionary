/**
 * docs-site — Askewly Design composition block (M29).
 * Own composition, no absorbed external source: every open docs framework
 * surveyed owns its own router and build pipeline, so none of them can be
 * copied in as plain React files (research/2026-08-05-m29-docs-site-absorption-survey.md).
 * Page switching is local state — routing stays with the consumer (block contract §3).
 */
import { useEffect, useState } from "react"

import {
  DocSearchCmdkGroupedResultsPanel,
  type DocSearchResultGroup,
} from "@/components/doc-search-cmdk-grouped-results-panel"
import {
  VersionedDocsSwitcherNavbarSidebarSwap,
  type DocSidebarGroup,
  type DocVersion,
} from "@/components/versioned-docs-switcher-navbar-sidebar-swap"
import { ApiPage, type ApiReferenceData } from "./api-page"
import { ArticlePage, type ArticleData } from "./article-page"
import { ChangelogPage, type ChangelogData } from "./changelog-page"
import { DocsNavbar, type DocsPageId } from "./docs-navbar"
import data from "./data.json"

export function DocsSite({ defaultPage = "article" }: { defaultPage?: DocsPageId }) {
  const [page, setPage] = useState<DocsPageId>(defaultPage)
  const [versionId, setVersionId] = useState(data.versions[0].id)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  // ⌘K / Ctrl+K is the docs-wide convention; without it the navbar button
  // advertises a shortcut that does nothing.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <DocsNavbar
        activePage={page}
        product={data.product}
        onNavigate={setPage}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4">
        <aside className="sticky top-14 hidden h-fit w-60 shrink-0 py-6 md:block">
          <VersionedDocsSwitcherNavbarSidebarSwap
            activeVersionId={versionId}
            sidebarByVersion={data.sidebarByVersion as Record<string, DocSidebarGroup[]>}
            versions={data.versions as DocVersion[]}
            onVersionChange={setVersionId}
          />
        </aside>

        <main className="flex min-w-0 flex-1">
          {page === "article" ? <ArticlePage article={data.article as ArticleData} /> : null}
          {page === "api" ? <ApiPage reference={data.apiReference as ApiReferenceData} /> : null}
          {page === "changelog" ? <ChangelogPage changelog={data.changelog as ChangelogData} /> : null}
        </main>
      </div>

      <DocSearchCmdkGroupedResultsPanel
        groups={data.search.groups as DocSearchResultGroup[]}
        open={searchOpen}
        query={query}
        recentQueries={data.search.recentQueries}
        suggestedDocs={data.search.suggestedDocs}
        onOpenChange={setSearchOpen}
        onQueryChange={setQuery}
        onSelect={() => setSearchOpen(false)}
      />
    </div>
  )
}

export function DocsSiteDemo() {
  return (
    <div className="h-[640px] w-full overflow-hidden rounded-lg border">
      <div className="h-full overflow-auto">
        <DocsSite />
      </div>
    </div>
  )
}
