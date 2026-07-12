import { TriangleAlert } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DocVersion = { id: string; label: string; isLatest: boolean }
export type DocSidebarGroup = { id: string; label: string; pages: { id: string; label: string }[] }

type VersionedDocsSwitcherNavbarSidebarSwapProps = {
  versions: DocVersion[]
  activeVersionId: string
  sidebarByVersion: Record<string, DocSidebarGroup[]>
  onVersionChange: (versionId: string) => void
}

/**
 * Version dropdown, stale banner, and sidebar tree are one state contract:
 * changing the dropdown swaps the sidebar's data source (not just a badge)
 * and shows the stale banner whenever the selected version isn't the latest.
 * The current page is expected to re-map to its nearest equivalent in the
 * target version by the caller before calling onVersionChange's consumer.
 */
export function VersionedDocsSwitcherNavbarSidebarSwap({
  versions,
  activeVersionId,
  sidebarByVersion,
  onVersionChange,
}: VersionedDocsSwitcherNavbarSidebarSwapProps) {
  const activeVersion = versions.find((version) => version.id === activeVersionId)
  const sidebarGroups = sidebarByVersion[activeVersionId] ?? []

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
        <span className="text-sm font-medium">Docs</span>
        <Select value={activeVersionId} onValueChange={onVersionChange}>
          <SelectTrigger aria-label="Select docs version" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.label}
                {version.isLatest ? " (latest)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeVersion && !activeVersion.isLatest ? (
        <div className="mx-4 flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
          <span>
            You are viewing docs for {activeVersion.label}, which is not the latest version.
          </span>
        </div>
      ) : null}

      <nav aria-label="Docs sidebar" className="flex flex-col gap-4 px-4 pb-4">
        {sidebarGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase text-muted-foreground">{group.label}</span>
            {group.pages.map((page) => (
              <a key={page.id} className="rounded-md px-2 py-1 text-sm hover:bg-muted" href={`#${page.id}`}>
                {page.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </div>
  )
}
