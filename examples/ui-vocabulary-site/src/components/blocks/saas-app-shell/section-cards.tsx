/**
 * Absorbed from shadcn/ui block `dashboard-01` (https://ui.shadcn.com/blocks).
 * Copyright (c) 2023 shadcn — MIT License
 * (https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
 * Adapted for Askewly Design (M18): @tabler/icons-react → lucide-react,
 * card copy data-driven so consumers replace metrics without editing JSX
 * (stat-summary-grid recipe rule: no fabricated metrics as decoration).
 */
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type SectionCardStat = {
  label: string
  value: string
  delta: string
  trend: "up" | "down"
  headline: string
  caption: string
}

export function SectionCards({ stats }: { stats: SectionCardStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {stats.map((stat) => {
        const TrendIcon = stat.trend === "up" ? TrendingUpIcon : TrendingDownIcon
        return (
          <Card key={stat.label} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {stat.delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.headline} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">{stat.caption}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
