// Attribute selectors whose value is a hex color name a third-party default so
// the rule can override it with a token. Nothing here paints with those values.
export function ChartContainer() {
  return (
    <div
      className="[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-dot[stroke='#fff']]:stroke-transparent"
      data-slot="chart"
    />
  )
}

export const polarGrid = "[&_.recharts-polar-grid_[stroke=\"#ccc\"]]:stroke-border"
