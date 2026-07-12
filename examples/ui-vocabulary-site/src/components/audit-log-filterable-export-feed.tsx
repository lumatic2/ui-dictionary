import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type AuditLogEntry = {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
  metadata?: Record<string, string>
}

type AuditLogFilterableExportFeedProps = {
  entries: AuditLogEntry[]
  actionFilter: string
  onActionFilterChange: (value: string) => void
  hasMatchingFilterButNoEvents: boolean
  onExport: () => void
}

/**
 * Filterable, exportable audit feed: actor/action/target/timestamp column
 * order stays fixed regardless of filter state, export always applies to the
 * current filter scope (never a silent full-table dump), and metadata expands
 * on demand instead of always rendering inline.
 */
export function AuditLogFilterableExportFeed({
  entries,
  actionFilter,
  onActionFilterChange,
  hasMatchingFilterButNoEvents,
  onExport,
}: AuditLogFilterableExportFeedProps) {
  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground">
      <div className="flex items-center justify-between gap-3">
        <Select value={actionFilter} onValueChange={onActionFilterChange}>
          <SelectTrigger size="sm" aria-label="Filter by action type">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={onExport}>
          Export filtered (CSV)
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {hasMatchingFilterButNoEvents ? "No events match this filter." : "No audit events yet."}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.actor}</TableCell>
                <TableCell className="text-muted-foreground">{entry.action}</TableCell>
                <TableCell className="text-muted-foreground">{entry.target}</TableCell>
                <TableCell className="text-muted-foreground">{entry.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
