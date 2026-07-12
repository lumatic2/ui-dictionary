import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type DataTableRow = {
  id: string
  name: string
  role: string
  status: "Active" | "Invited" | "Suspended"
}

type InteractiveDataTableProps = {
  rows: DataTableRow[]
}

/**
 * Interactive data table: semantic table markup with a stable row `id` for
 * selection (not visual position), a toolbar that only surfaces bulk
 * actions once something is selected, and an explicit selected count.
 */
export function InteractiveDataTable({ rows }: InteractiveDataTableProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))

  const toggleAll = () =>
    setSelected((current) => (current.length === rows.length ? [] : rows.map((row) => row.id)))

  const allSelected = rows.length > 0 && selected.length === rows.length

  return (
    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <header className="flex items-center justify-between gap-4 border-b p-4">
        <p className="text-sm text-muted-foreground">{rows.length} members</p>
        {selected.length > 0 ? (
          <Button size="sm" type="button" variant="outline" onClick={() => setSelected([])}>
            Archive {selected.length}
          </Button>
        ) : null}
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox aria-label="Select all rows" checked={allSelected} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  onCheckedChange={() => toggle(row.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-muted-foreground">{row.role}</TableCell>
              <TableCell className="text-muted-foreground">{row.status}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 ? (
            <TableRow>
              <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={4}>
                No members match the current filters.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </section>
  )
}

const demoRows: DataTableRow[] = [
  { id: "user-1", name: "Lindsay Walton", role: "Front-end developer", status: "Active" },
  { id: "user-2", name: "Courtney Henry", role: "Designer", status: "Invited" },
  { id: "user-3", name: "Tom Cook", role: "Director of Product", status: "Active" },
  { id: "user-4", name: "Whitney Francis", role: "Copywriter", status: "Suspended" },
]

/**
 * Colocated demo: fixed member list so selection and bulk-archive behavior
 * can be exercised without any App.tsx shared state.
 */
export function InteractiveDataTableDemo() {
  return <InteractiveDataTable rows={demoRows} />
}
