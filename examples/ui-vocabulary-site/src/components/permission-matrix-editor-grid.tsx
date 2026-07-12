import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type PermissionCellState = "granted" | "inherited" | "denied"

export type PermissionMatrixRole = { id: string; name: string }
export type PermissionMatrixPermission = { id: string; label: string; module: string; dangerous?: boolean }

type PermissionMatrixEditorGridProps = {
  roles: PermissionMatrixRole[]
  permissions: PermissionMatrixPermission[]
  cellState: (roleId: string, permissionId: string) => PermissionCellState
  pendingChangeCount: number
  onToggleCell: (roleId: string, permissionId: string) => void
  onCommit: () => void
  onDiscard: () => void
}

/**
 * Role × permission editor grid: sticky row/column headers keep both axes
 * readable while scrolling, each cell distinguishes explicit grants from
 * inherited ones, and edits stay pending behind a diff banner until the
 * operator explicitly commits (never auto-saves a single checkbox toggle).
 */
export function PermissionMatrixEditorGrid({
  roles,
  permissions,
  cellState,
  pendingChangeCount,
  onToggleCell,
  onCommit,
  onDiscard,
}: PermissionMatrixEditorGridProps) {
  return (
    <section className="flex flex-col gap-2 overflow-hidden rounded-md border bg-card text-card-foreground">
      {pendingChangeCount > 0 ? (
        <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-4 py-2 text-sm">
          <span>{pendingChangeCount} unsaved permission change{pendingChangeCount === 1 ? "" : "s"}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onDiscard}>Discard</Button>
            <Button size="sm" onClick={onCommit}>Save changes</Button>
          </div>
        </div>
      ) : null}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 top-0 z-20 bg-card">Permission</TableHead>
              {roles.map((role) => (
                <TableHead key={role.id} className="sticky top-0 z-10 bg-card text-center">
                  {role.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="sticky left-0 z-10 bg-card font-medium">
                  <div className="flex items-center gap-2">
                    {permission.label}
                    {permission.dangerous ? <Badge variant="destructive">high risk</Badge> : null}
                  </div>
                </TableCell>
                {roles.map((role) => {
                  const state = cellState(role.id, permission.id)
                  return (
                    <TableCell key={role.id} className="text-center">
                      <Checkbox
                        aria-label={`${permission.label} for ${role.name}`}
                        checked={state !== "denied"}
                        data-state-kind={state}
                        onCheckedChange={() => onToggleCell(role.id, permission.id)}
                      />
                      {state === "inherited" ? (
                        <span className="ml-1 text-xs text-muted-foreground">inherited</span>
                      ) : null}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
