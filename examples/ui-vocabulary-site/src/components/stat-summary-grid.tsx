export type StatSummaryItem = {
  label: string
  value: string
  trend?: string
}

type StatSummaryGridProps = {
  title: string
  rangeLabel: string
  stats: StatSummaryItem[]
  reportHref?: string
}

/**
 * Stat summary grid: a small set of operational measures sharing one
 * label/value/trend hierarchy and one time range, so peer values compare
 * cleanly. Trend meaning is carried in text, never color alone.
 */
export function StatSummaryGrid({ title, rangeLabel, stats, reportHref }: StatSummaryGridProps) {
  return (
    <section aria-labelledby="stat-summary-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="stat-summary-title" className="text-base font-medium text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{rangeLabel}</p>
        </div>
        {reportHref ? (
          <a className="text-sm font-medium text-primary hover:underline" href={reportHref}>
            Open report
          </a>
        ) : null}
      </div>
      <dl className="mt-6 grid grid-cols-1 overflow-hidden rounded-lg border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border-b p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="mt-2 text-3xl font-medium text-foreground tabular-nums">{stat.value}</dd>
            {stat.trend ? <p className="mt-1 text-sm text-muted-foreground">{stat.trend}</p> : null}
          </div>
        ))}
      </dl>
    </section>
  )
}

const demoStats: StatSummaryItem[] = [
  { label: "Active workspaces", value: "24", trend: "+3 this week" },
  { label: "Checks passing", value: "98%", trend: "Stable" },
  { label: "Pending reviews", value: "6", trend: "2 due today" },
]

/**
 * Colocated demo: fixed workspace metrics with named time range and text
 * trends, standing in for the caller-owned data this component expects.
 */
export function StatSummaryGridDemo() {
  return (
    <StatSummaryGrid rangeLabel="Last seven days" reportHref="#" stats={demoStats} title="Workspace summary" />
  )
}
