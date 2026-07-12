import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export type ChangelogCategory = { id: string; label: string }
export type ReleaseNoteCardData = {
  id: string
  version: string
  summary: string
  tags: string[]
}
export type ChangelogDateGroup = { date: string; releases: ReleaseNoteCardData[] }

type DocsChangelogCategoryFilterPageProps = {
  categories: ChangelogCategory[]
  activeCategoryId: string
  groups: ChangelogDateGroup[]
  page: number
  pageCount: number
  onCategoryChange: (categoryId: string) => void
  onPageChange: (page: number) => void
}

/**
 * Changelog page: category filter chips narrow which release-note-card
 * entries appear, entries stay grouped under their date header (a group
 * with zero remaining entries after filtering is hidden, not shown empty),
 * and pagination replaces the group list rather than appending to it.
 */
export function DocsChangelogCategoryFilterPage({
  categories,
  activeCategoryId,
  groups,
  page,
  pageCount,
  onCategoryChange,
  onPageChange,
}: DocsChangelogCategoryFilterPageProps) {
  const visibleGroups = groups.filter((group) => group.releases.length > 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter changelog by category">
        {categories.map((category) => (
          <button
            key={category.id}
            aria-pressed={category.id === activeCategoryId}
            className="focus-visible:outline-none"
            type="button"
            onClick={() => onCategoryChange(category.id)}
          >
            <Badge
              className="cursor-pointer"
              variant={category.id === activeCategoryId ? "default" : "outline"}
            >
              {category.label}
            </Badge>
          </button>
        ))}
      </div>

      {visibleGroups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No releases match this category.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {visibleGroups.map((group) => (
            <section key={group.date} className="flex flex-col gap-3">
              <h2 className="text-xs font-medium uppercase text-muted-foreground">{group.date}</h2>
              <div className="flex flex-col gap-3">
                {group.releases.map((release) => (
                  <article
                    key={release.id}
                    className="flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{release.version}</span>
                      <div className="flex gap-1.5">
                        {release.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{release.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {pageCount > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm text-muted-foreground">
                {page} / {pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                aria-disabled={page >= pageCount}
                className={cn(page >= pageCount && "pointer-events-none opacity-50")}
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page < pageCount) onPageChange(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  )
}
