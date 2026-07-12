/**
 * Recipe Gallery demo wrappers — one parameterless component per recipe
 * slug, each rendering the recipe's real implementation component
 * (`code_asset` in `recipes/<collection>/<slug>.md`) with sample data and
 * local state so the recipe is genuinely live and interactive, not a static
 * screenshot.
 *
 * Recipes that already ship a zero-prop `*Demo` export reuse it directly.
 * Recipes whose implementation component takes props/handlers get a small
 * `useState`-backed wrapper here instead of duplicating the component.
 */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AtlasCard } from "@/components/showcase-card"
import { atlasItems } from "@/lib/atlas-items"
import { CartDrawerBody, type CartDrawerItem } from "@/components/cart-drawer"
import { CategoryProductGrid, type CategoryProduct } from "@/components/category-product-grid"
import { ProductDetailPurchaseStack, type ProductVariantOption } from "@/components/product-detail-purchase-stack"
import { PromoBannerSystem } from "@/components/promo-banner-system"
import { ShippingMethodSelector, type ShippingMethod } from "@/components/shipping-method-selector"
import { AuditLogFilterableExportFeed, type AuditLogEntry } from "@/components/audit-log-filterable-export-feed"
import { BulkActionToolbar, type BulkAction } from "@/components/bulk-action-toolbar"
import { PermissionMatrixEditorGrid, type PermissionCellState, type PermissionMatrixPermission, type PermissionMatrixRole } from "@/components/permission-matrix-editor-grid"
import { ApiReferenceLayout, type ApiReferenceParam, type ApiReferenceSample } from "@/components/api-reference-layout"
import { DocsArticlePage } from "@/components/article-documentation-layout"
import { docsArticlePages } from "@/lib/documentation-pages"
import { DocsChangelogCategoryFilterPage, type ChangelogCategory, type ChangelogDateGroup } from "@/components/docs-changelog-category-filter-page"
import { DocsCodeBlock, type DocsCodeBlockVariant } from "@/components/docs-code-block"
import { AdvancedFilterBuilder, type FilterFieldOption, type FilterGroup } from "@/components/advanced-filter-builder"
import { DataImportWizardValidationPreviewSteps, type ImportColumnMapping, type ImportPreviewRow, type ImportWizardStep } from "@/components/data-import-wizard-validation-preview-steps"
import { LandingHero } from "@/components/landing-hero"
import { DocSearchCmdkGroupedResultsPanelBody, type DocSearchResultGroup } from "@/components/doc-search-cmdk-grouped-results-panel"
import { Command } from "@/components/ui/command"
import { TopbarSearch } from "@/components/topbar-search"
import { VersionedDocsSwitcherNavbarSidebarSwap, type DocSidebarGroup, type DocVersion } from "@/components/versioned-docs-switcher-navbar-sidebar-swap"
import { terms } from "@/data/terms.generated"

export function ShowcaseCardDemo() {
  return <AtlasCard item={atlasItems[0]} />
}

export function CartDrawerDemo() {
  const [items, setItems] = useState<CartDrawerItem[]>([
    { id: "1", title: "Field Jacket", variant: "Olive · M", quantity: 1, price: 128 },
    { id: "2", title: "Canvas Tote", quantity: 2, price: 42 },
  ])

  return (
    <div className="relative isolate h-[26rem] w-full max-w-3xl overflow-hidden rounded-lg border bg-muted/30">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col gap-4 border-l bg-background shadow-lg">
        <CartDrawerBody
          items={items}
          onQuantityChange={(id, quantity) =>
            setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)))
          }
          onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
          onCheckout={() => {}}
          onContinueShopping={() => {}}
        />
      </div>
    </div>
  )
}

export function CategoryProductGridDemo() {
  const [sort, setSort] = useState("featured")
  const products: CategoryProduct[] = [
    { id: "1", title: "Ceramic Mug", price: 18, rating: 4.6 },
    { id: "2", title: "Linen Throw", price: 64, rating: 4.8 },
    { id: "3", title: "Oak Tray", price: 39, rating: 4.4 },
    { id: "4", title: "Brass Hook Set", price: 22, rating: 4.7 },
  ]

  return <CategoryProductGrid products={products} sort={sort} onSortChange={setSort} onResetFilters={() => {}} />
}

export function ProductDetailPurchaseStackDemo() {
  const [selectedVariant, setSelectedVariant] = useState("m")
  const [quantity, setQuantity] = useState(1)
  const variantOptions: ProductVariantOption[] = [
    { value: "s", label: "S", available: true },
    { value: "m", label: "M", available: true },
    { value: "l", label: "L", available: false },
  ]
  const price = 96

  return (
    <ProductDetailPurchaseStack
      title="Alpine Half-Zip"
      ratingSummary="4.7 · 212 reviews"
      price={price}
      variantOptions={variantOptions}
      selectedVariant={selectedVariant}
      onSelectVariant={setSelectedVariant}
      quantity={quantity}
      onQuantityChange={(next) => setQuantity(Math.max(1, next))}
      estimatedTotal={price * quantity}
      onAddToCart={() => {}}
    />
  )
}

export function PromoBannerSystemDemo() {
  const [dismissed, setDismissed] = useState(false)

  return (
    <PromoBannerSystem
      copy="Free shipping on orders over $75."
      ctaLabel="Shop now"
      onCtaClick={() => {}}
      dismissed={dismissed}
      onDismiss={() => setDismissed(true)}
      countdownLabel="2d 04h"
    />
  )
}

export function ShippingMethodSelectorDemo() {
  const [selectedId, setSelectedId] = useState("standard")
  const methods: ShippingMethod[] = [
    { id: "standard", name: "Standard", carrier: "USPS", eta: "5–7 business days", price: 0 },
    { id: "express", name: "Express", carrier: "UPS", eta: "2 business days", price: 12 },
    { id: "pickup", name: "In-store pickup", carrier: "Downtown store", eta: "Ready in 2 hours", price: 0, kind: "pickup" },
  ]

  return <ShippingMethodSelector methods={methods} selectedId={selectedId} onChange={setSelectedId} />
}

export function AuditLogFilterableExportFeedDemo() {
  const [actionFilter, setActionFilter] = useState("all")
  const allEntries: AuditLogEntry[] = [
    { id: "1", actor: "hana@askewly.com", action: "update", target: "Permission Matrix", timestamp: "2026-07-12 09:14" },
    { id: "2", actor: "yusung@askewly.com", action: "create", target: "Recipe: cart-drawer", timestamp: "2026-07-11 22:03" },
    { id: "3", actor: "system", action: "delete", target: "Draft export #88", timestamp: "2026-07-11 18:47" },
  ]
  const entries = actionFilter === "all" ? allEntries : allEntries.filter((entry) => entry.action === actionFilter)

  return (
    <AuditLogFilterableExportFeed
      entries={entries}
      actionFilter={actionFilter}
      onActionFilterChange={setActionFilter}
      hasMatchingFilterButNoEvents={entries.length === 0}
      onExport={() => {}}
    />
  )
}

export function BulkActionToolbarDemo() {
  const actions: BulkAction[] = [
    { id: "archive", label: "Archive", variant: "outline", onAction: () => {} },
    { id: "delete", label: "Delete", variant: "destructive", onAction: () => {} },
  ]

  return <BulkActionToolbar selectedCount={3} visibleCount={10} totalMatchingCount={42} onClearSelection={() => {}} onSelectAllMatching={() => {}} actions={actions} />
}

export function PermissionMatrixEditorGridDemo() {
  const roles: PermissionMatrixRole[] = [
    { id: "admin", name: "Admin" },
    { id: "editor", name: "Editor" },
    { id: "viewer", name: "Viewer" },
  ]
  const permissions: PermissionMatrixPermission[] = [
    { id: "read", label: "View content", module: "Content" },
    { id: "write", label: "Edit content", module: "Content" },
    { id: "delete", label: "Delete content", module: "Content", dangerous: true },
  ]
  const baseline: Record<string, PermissionCellState> = {
    "admin:read": "granted",
    "admin:write": "granted",
    "admin:delete": "granted",
    "editor:read": "granted",
    "editor:write": "granted",
    "editor:delete": "denied",
    "viewer:read": "inherited",
    "viewer:write": "denied",
    "viewer:delete": "denied",
  }
  const [overrides, setOverrides] = useState<Record<string, PermissionCellState>>({})

  const cellState = (roleId: string, permissionId: string): PermissionCellState => {
    const key = `${roleId}:${permissionId}`
    return overrides[key] ?? baseline[key] ?? "denied"
  }

  return (
    <PermissionMatrixEditorGrid
      roles={roles}
      permissions={permissions}
      cellState={cellState}
      pendingChangeCount={Object.keys(overrides).length}
      onToggleCell={(roleId, permissionId) => {
        const key = `${roleId}:${permissionId}`
        const current = cellState(roleId, permissionId)
        setOverrides((prev) => ({ ...prev, [key]: current === "denied" ? "granted" : "denied" }))
      }}
      onCommit={() => setOverrides({})}
      onDiscard={() => setOverrides({})}
    />
  )
}

export function ApiReferenceThreeColumnLayoutDemo() {
  const params: ApiReferenceParam[] = [
    { name: "id", type: "string", required: true, description: "The customer's unique identifier." },
    { name: "expand", type: "string[]", required: false, description: "Related objects to expand inline in the response." },
  ]
  const samples: ApiReferenceSample[] = [
    { language: "curl", label: "cURL", code: "curl https://api.askewly.com/v1/customers/cus_123 \\\n  -H \"Authorization: Bearer sk_live_...\"" },
    { language: "node", label: "Node", code: "await askewly.customers.retrieve(\"cus_123\")" },
  ]

  return <ApiReferenceLayout method="GET" path="/v1/customers/:id" params={params} samples={samples} response={'{ "id": "cus_123", "name": "Hana Lee" }'} />
}

export function ArticleDocumentationLayoutDemo() {
  const page = [...docsArticlePages.values()][0]
  if (!page) return null

  return <DocsArticlePage page={page} relatedTerms={terms.slice(0, 3)} onSelectTerm={() => {}} />
}

export function DocsChangelogCategoryFilterPageDemo() {
  const [activeCategoryId, setActiveCategoryId] = useState("all")
  const [page, setPage] = useState(1)
  const categories: ChangelogCategory[] = [
    { id: "all", label: "All" },
    { id: "ga", label: "GA" },
    { id: "preview", label: "Preview" },
  ]
  const allGroups: ChangelogDateGroup[] = [
    {
      date: "July 2026",
      releases: [
        { id: "1", version: "v2.4.0", summary: "Recipe Gallery ships as the site's live-render surface.", tags: ["ga"] },
        { id: "2", version: "v2.3.0-preview", summary: "Hierarchical layers panel in the canvas editor.", tags: ["preview"] },
      ],
    },
  ]
  const groups = activeCategoryId === "all" ? allGroups : allGroups.map((group) => ({ ...group, releases: group.releases.filter((release) => release.tags.includes(activeCategoryId)) }))

  return (
    <DocsChangelogCategoryFilterPage
      categories={categories}
      activeCategoryId={activeCategoryId}
      groups={groups}
      page={page}
      pageCount={2}
      onCategoryChange={setActiveCategoryId}
      onPageChange={setPage}
    />
  )
}

export function DocsCodeBlockWithTabsAndCopyDemo() {
  const variants: DocsCodeBlockVariant[] = [
    { id: "npm", label: "npm", code: "npm install @askewly/design" },
    { id: "pnpm", label: "pnpm", code: "pnpm add @askewly/design" },
    { id: "yarn", label: "yarn", code: "yarn add @askewly/design" },
  ]

  return <DocsCodeBlock variants={variants} />
}

export function AdvancedFilterBuilderConditionGroupsDemo() {
  const fields: FilterFieldOption[] = [
    { value: "status", label: "Status", type: "text" },
    { value: "amount", label: "Amount", type: "number" },
    { value: "created_at", label: "Created at", type: "date" },
  ]
  const [groupJoin, setGroupJoin] = useState<"and" | "or">("and")
  const [groups, setGroups] = useState<FilterGroup[]>([
    { id: "g1", join: "and", conditions: [{ id: "c1", field: "status", operator: "equals", value: "active" }] },
  ])

  return (
    <AdvancedFilterBuilder
      fields={fields}
      groups={groups}
      groupJoin={groupJoin}
      onGroupJoinChange={setGroupJoin}
      onConditionChange={(groupId, condition) =>
        setGroups((current) => current.map((group) => (group.id === groupId ? { ...group, conditions: group.conditions.map((existing) => (existing.id === condition.id ? condition : existing)) } : group)))
      }
      onGroupJoinToggle={(groupId, join) => setGroups((current) => current.map((group) => (group.id === groupId ? { ...group, join } : group)))}
      onAddCondition={(groupId) =>
        setGroups((current) =>
          current.map((group) =>
            group.id === groupId
              ? { ...group, conditions: [...group.conditions, { id: `c${group.conditions.length + 1}-${Date.now()}`, field: fields[0].value, operator: "equals", value: "" }] }
              : group,
          ),
        )
      }
      onRemoveCondition={(groupId, conditionId) =>
        setGroups((current) => current.map((group) => (group.id === groupId ? { ...group, conditions: group.conditions.filter((condition) => condition.id !== conditionId) } : group)))
      }
      onAddGroup={() => setGroups((current) => [...current, { id: `g${current.length + 1}-${Date.now()}`, join: "and", conditions: [{ id: `c-${Date.now()}`, field: fields[0].value, operator: "equals", value: "" }] }])}
    />
  )
}

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="outline">Learn more</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="ghost">Dismiss</Button>
      <Button variant="link">View details</Button>
    </div>
  )
}

export function DataImportWizardValidationPreviewStepsDemo() {
  const [step, setStep] = useState<ImportWizardStep>("preview")
  const mappings: ImportColumnMapping[] = [
    { sourceColumn: "email_address", targetField: "email" },
    { sourceColumn: "full_name", targetField: "name" },
  ]
  const previewRows: ImportPreviewRow[] = [
    { id: "1", values: ["hana@askewly.com", "Hana Lee"] },
    { id: "2", values: ["", "Yusung Jeon"], error: "Missing email" },
  ]
  const steps: ImportWizardStep[] = ["upload", "map", "validate", "preview", "confirm"]
  const nextStep = () => setStep((current) => steps[Math.min(steps.indexOf(current) + 1, steps.length - 1)])

  return (
    <DataImportWizardValidationPreviewSteps
      step={step}
      mappings={mappings}
      previewRows={previewRows}
      summary={{ imported: 1, skipped: 0, failed: 1 }}
      onFixRow={() => {}}
      onSkipRow={() => {}}
      onContinue={nextStep}
    />
  )
}

export function LandingHeroDemo() {
  return <LandingHero onNavigate={() => {}} onSearch={() => {}} filter="all" terms={terms} />
}

export function DocSearchCmdkGroupedResultsPanelDemo() {
  const [query, setQuery] = useState("")
  const groups: DocSearchResultGroup[] = [
    { id: "docs", label: "Docs", items: [{ id: "d1", label: "Getting started", description: "Setup and principles" }] },
    { id: "guides", label: "Guides", items: [{ id: "g1", label: "Recipe format contract" }] },
    { id: "api", label: "API", items: [{ id: "a1", label: "GET /v1/customers/:id" }] },
  ]

  return (
    <div className="rounded-md border bg-card p-4">
      <p className="mb-3 text-sm text-muted-foreground">Panel rendered inline for the gallery (production opens it from Cmd/Ctrl+K).</p>
      <div className="overflow-hidden rounded-md border bg-popover text-popover-foreground">
        <Command>
          <DocSearchCmdkGroupedResultsPanelBody
            query={query}
            groups={groups}
            recentQueries={["command palette"]}
            suggestedDocs={[{ id: "s1", label: "Agent recipes" }]}
            onQueryChange={setQuery}
            onSelect={() => {}}
          />
        </Command>
      </div>
    </div>
  )
}

export function TopbarCommandSearchDemo() {
  const [expanded, setExpanded] = useState(true)
  const [query, setQuery] = useState("")

  return (
    <div className="max-w-md">
      <TopbarSearch expanded={expanded} filter="all" query={query} terms={terms} onExpandedChange={setExpanded} onFilterChange={() => {}} onQueryChange={setQuery} />
    </div>
  )
}

export function VersionedDocsSwitcherNavbarSidebarSwapDemo() {
  const [activeVersionId, setActiveVersionId] = useState("v2")
  const versions: DocVersion[] = [
    { id: "v2", label: "v2 (current)", isLatest: true },
    { id: "v1", label: "v1", isLatest: false },
  ]
  const sidebarByVersion: Record<string, DocSidebarGroup[]> = {
    v2: [{ id: "getting-started", label: "Getting started", pages: [{ id: "setup", label: "Setup" }, { id: "principles", label: "Principles" }] }],
    v1: [{ id: "getting-started", label: "Getting started", pages: [{ id: "setup", label: "Setup (legacy)" }] }],
  }

  return <VersionedDocsSwitcherNavbarSidebarSwap versions={versions} activeVersionId={activeVersionId} sidebarByVersion={sidebarByVersion} onVersionChange={setActiveVersionId} />
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Notification settings</PopoverTitle>
          <PopoverDescription>Choose how you want to be notified.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

