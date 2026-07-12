import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type CategoryProduct = {
  id: string
  title: string
  price: number
  rating?: number
}

type CategoryProductGridProps = {
  products: CategoryProduct[]
  loading?: boolean
  sort: string
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  currency?: string
  columns?: 3 | 4
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

/**
 * Category/search-results grid: a filter/sort bar sits above a responsive
 * grid of `product-card` cells, with a loading skeleton matching the final
 * column count and a reset-filters empty state when nothing matches.
 */
export function CategoryProductGrid({
  products,
  loading = false,
  sort,
  onSortChange,
  onResetFilters,
  currency = "USD",
  columns = 4,
}: CategoryProductGridProps) {
  const gridCols = columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"

  return (
    <section aria-label="Product results" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading results…" : `${products.length} results`}
        </p>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger aria-label="Sort products" className="w-40" size="sm">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className={cn("grid grid-cols-1 gap-4", gridCols)}>
          {Array.from({ length: columns * 2 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed py-12 text-center">
          <p className="text-sm font-medium">No products match these filters</p>
          <p className="text-sm text-muted-foreground">Try removing a filter to see more results.</p>
          <Button size="sm" variant="outline" onClick={onResetFilters}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className={cn("grid grid-cols-1 gap-4", gridCols)}>
          {products.map((product) => (
            <article key={product.id} className="flex flex-col gap-2 rounded-md border p-3">
              <div aria-hidden="true" className="aspect-square w-full rounded-md bg-muted" />
              <p className="truncate text-sm font-medium">{product.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tabular-nums">
                  {formatMoney(product.price, currency)}
                </span>
                {product.rating ? (
                  <span className="text-xs text-muted-foreground">★ {product.rating.toFixed(1)}</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
