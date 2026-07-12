import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type ImportWizardStep = "upload" | "map" | "validate" | "preview" | "confirm"

const STEPS: ImportWizardStep[] = ["upload", "map", "validate", "preview", "confirm"]

export type ImportColumnMapping = { sourceColumn: string; targetField: string }
export type ImportPreviewRow = { id: string; values: string[]; error?: string }

type DataImportWizardStepsProps = {
  step: ImportWizardStep
  mappings: ImportColumnMapping[]
  previewRows: ImportPreviewRow[]
  summary?: { imported: number; skipped: number; failed: number }
  onFixRow: (rowId: string) => void
  onSkipRow: (rowId: string) => void
  onContinue: () => void
}

/**
 * Upload -> map -> validate -> preview -> confirm wizard: each step keeps its
 * own screen, per-row validation errors surface inline in the preview table
 * (not just an aggregate count), and a failing row can be fixed or explicitly
 * skipped rather than aborting the whole import.
 */
export function DataImportWizardValidationPreviewSteps({
  step,
  mappings,
  previewRows,
  summary,
  onFixRow,
  onSkipRow,
  onContinue,
}: DataImportWizardStepsProps) {
  const stepIndex = STEPS.indexOf(step)
  const errorCount = previewRows.filter((row) => row.error).length

  return (
    <section className="flex flex-col gap-3 rounded-md border bg-card p-4 text-card-foreground">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={
                index === stepIndex
                  ? "font-medium text-foreground"
                  : index < stepIndex
                    ? "text-muted-foreground line-through"
                    : "text-muted-foreground"
              }
            >
              {index + 1}. {label}
            </span>
            {index < STEPS.length - 1 ? <span className="text-muted-foreground">/</span> : null}
          </li>
        ))}
      </ol>

      {step === "map" ? (
        <ul className="flex flex-col gap-1 text-sm">
          {mappings.map((mapping) => (
            <li key={mapping.sourceColumn} className="flex items-center gap-2">
              <span className="text-muted-foreground">{mapping.sourceColumn}</span>
              <span>-&gt;</span>
              <span className="font-medium">{mapping.targetField}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {step === "validate" || step === "preview" ? (
        <>
          {errorCount > 0 ? <Badge variant="destructive">{errorCount} rows need attention</Badge> : null}
          <Table>
            <TableHeader>
              <TableRow>
                {mappings.map((mapping) => (
                  <TableHead key={mapping.targetField}>{mapping.targetField}</TableHead>
                ))}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row) => (
                <TableRow key={row.id} data-state={row.error ? "error" : undefined}>
                  {row.values.map((value, index) => (
                    <TableCell key={index}>{value}</TableCell>
                  ))}
                  <TableCell>
                    {row.error ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-destructive">{row.error}</span>
                        <Button size="sm" variant="ghost" onClick={() => onFixRow(row.id)}>Fix</Button>
                        <Button size="sm" variant="ghost" onClick={() => onSkipRow(row.id)}>Skip row</Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">ok</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}

      {step === "confirm" && summary ? (
        <div className="flex gap-4 text-sm">
          <span>Imported {summary.imported}</span>
          <span className="text-muted-foreground">Skipped {summary.skipped}</span>
          <span className="text-destructive">Failed {summary.failed}</span>
        </div>
      ) : null}

      <Button size="sm" className="self-end" onClick={onContinue}>
        Continue
      </Button>
    </section>
  )
}
