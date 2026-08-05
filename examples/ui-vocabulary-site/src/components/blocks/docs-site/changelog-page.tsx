import { useMemo, useState } from "react"

import {
  DocsChangelogCategoryFilterPage,
  type ChangelogCategory,
  type ChangelogDateGroup,
} from "@/components/docs-changelog-category-filter-page"

export type ChangelogData = {
  categories: ChangelogCategory[]
  groups: ChangelogDateGroup[]
}

const GROUPS_PER_PAGE = 2

/**
 * The changelog page owns the filter and pagination *state*; the asset owns
 * how a filtered, paginated changelog looks. That split is deliberate — the
 * asset takes `groups` already narrowed, so the block decides what "matches
 * a category" means (here: the release carries the tag) without the asset
 * having to guess at anyone's tagging scheme.
 */
export function ChangelogPage({ changelog }: { changelog: ChangelogData }) {
  const [activeCategoryId, setActiveCategoryId] = useState(changelog.categories[0]?.id ?? "all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (activeCategoryId === "all") return changelog.groups
    return changelog.groups
      .map((group) => ({
        ...group,
        releases: group.releases.filter((release) => release.tags.includes(activeCategoryId)),
      }))
      .filter((group) => group.releases.length > 0)
  }, [activeCategoryId, changelog.groups])

  const pageCount = Math.max(1, Math.ceil(filtered.length / GROUPS_PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * GROUPS_PER_PAGE, safePage * GROUPS_PER_PAGE)

  return (
    <div className="min-w-0 flex-1 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        Changelog
      </nav>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Changelog</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        Every shipped change, newest first. Breaking changes carry the tag and always name their
        migration window.
      </p>

      <div className="mt-10 max-w-3xl">
        <DocsChangelogCategoryFilterPage
          activeCategoryId={activeCategoryId}
          categories={changelog.categories}
          groups={visible}
          page={safePage}
          pageCount={pageCount}
          onCategoryChange={(categoryId) => {
            setActiveCategoryId(categoryId)
            setPage(1)
          }}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
