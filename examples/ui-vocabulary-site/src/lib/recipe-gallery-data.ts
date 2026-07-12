/**
 * Recipe Gallery data — the site's live-render index for all 35
 * `recipes/<collection>/<slug>.md` design-system recipes.
 *
 * Slug/title/collection/description mirror the frontmatter-derived catalog at
 * `packages/component-registry/src/recipe-catalog.generated.ts` (kept in sync
 * by hand today — both ultimately trace back to the same `recipes/*.md`
 * frontmatter SSOT). This file only adds gallery-specific grouping order and
 * hands each slug off to the demo component registered in
 * `@/components/recipe-gallery-demos`.
 */

export type RecipeCollection =
  | "Application UI"
  | "Commerce"
  | "Data Display"
  | "Docs"
  | "Feedback"
  | "Forms"
  | "Layout"
  | "Marketing"
  | "Navigation"
  | "Overlays"

export type RecipeGalleryEntry = {
  slug: string
  title: string
  collection: RecipeCollection
  description: string
}

/** Display order for collection group headings — matches recipe-format.md's 10-collection taxonomy. */
export const recipeCollectionOrder: RecipeCollection[] = [
  "Application UI",
  "Commerce",
  "Data Display",
  "Docs",
  "Feedback",
  "Forms",
  "Layout",
  "Marketing",
  "Navigation",
  "Overlays",
]

export const recipeGalleryEntries: RecipeGalleryEntry[] = [
  { slug: "showcase-card", title: "Showcase Card", collection: "Application UI", description: "A self-contained shell that proves an interaction capability rather than describing it: a header sits above a bounded demo region that runs a live, interactive product-interface behavior." },
  { slug: "cart-drawer", title: "Cart Drawer", collection: "Commerce", description: "A cart drawer keeps the browsing context intact while confirming what a user has added." },
  { slug: "category-product-grid", title: "Category Product Grid", collection: "Commerce", description: "Assembles many product cards into the higher-order list structure a category or search-results page needs: a filter/sort bar, a matching loading skeleton, and a recoverable empty state." },
  { slug: "checkout-order-summary", title: "Checkout Order Summary", collection: "Commerce", description: "Keeps the exact purchase commitment visible while the user provides delivery and payment details." },
  { slug: "product-detail-purchase-stack", title: "Product Detail Purchase Stack", collection: "Commerce", description: "The desktop-default vertical block that binds title, price, variant selection, quantity, and the add-to-cart CTA into one continuously visible unit." },
  { slug: "promo-banner-system", title: "Promo Banner System", collection: "Commerce", description: "One banner shape that carries different urgency-driven offer copy depending on where it's placed — top-of-site vs in-page." },
  { slug: "shipping-method-selector", title: "Shipping Method Selector", collection: "Commerce", description: "Lets a checkout user compare delivery/pickup options by cost and timing in one glance, binding the choice directly to the order total." },
  { slug: "audit-log-filterable-export-feed", title: "Audit Log Filterable Export Feed", collection: "Data Display", description: "The actor/action/target/timestamp record as a filterable, exportable operational surface, where export always applies to the currently active filter." },
  { slug: "bulk-action-toolbar-selection-model", title: "Bulk Action Toolbar with Selection Model", collection: "Data Display", description: "Turns a table's per-row selection into a single place to act on many rows at once." },
  { slug: "interactive-data-table", title: "Interactive Data Table", collection: "Data Display", description: "Supports scanning and acting on structured records while preserving column meaning." },
  { slug: "permission-matrix-editor-grid", title: "Permission Matrix Editor Grid", collection: "Data Display", description: "An editable, high-density role-by-permission table where explicit grants stay visually distinct from inherited ones and edits stay pending behind a diff step." },
  { slug: "pull-to-refresh-list-pattern", title: "Pull to Refresh List Pattern", collection: "Data Display", description: "The full drag-triggered refresh state machine for a mobile list: pulling to threshold-crossed to refreshing to settled or cancelled." },
  { slug: "stat-summary-grid", title: "Stat Summary Grid", collection: "Data Display", description: "Gives a small set of operational measures a consistent hierarchy: label, current value, and a contextual trend or status." },
  { slug: "swipe-action-row-pattern", title: "Swipe Action Row (Leading/Trailing)", collection: "Data Display", description: "One list row that can reveal either a leading or a trailing action by dragging horizontally, such as archive or delete." },
  { slug: "api-reference-three-column-layout", title: "API Reference Three-Column Layout", collection: "Docs", description: "A reading path for scanning parameter names and types while running or copying a request at the same time." },
  { slug: "article-documentation-layout", title: "Article Documentation Layout", collection: "Docs", description: "Turns a long implementation rule into a predictable reading path: breadcrumb and title, a short lead, ordered sections, and an on-this-page rail." },
  { slug: "docs-changelog-category-filter-page", title: "Docs Changelog Page With Category Filter Chips And Pagination", collection: "Docs", description: "A date-grouped release-note list with a category filter chip row and pagination so the page doesn't grow unbounded." },
  { slug: "docs-code-block-with-tabs-and-copy", title: "Docs Code Block With Language Tabs And Copy", collection: "Docs", description: "The same instruction in more than one equivalent form, switchable by tab, with one-click copy." },
  { slug: "actionable-toast", title: "Actionable Toast", collection: "Feedback", description: "Confirms a recent low-risk operation and may offer one short recovery action such as Undo or Retry." },
  { slug: "recoverable-empty-state", title: "Recoverable Empty State", collection: "Feedback", description: "Explains why expected content is absent and gives the user the most direct next action." },
  { slug: "advanced-filter-builder-condition-groups", title: "Advanced Filter Builder with Condition Groups", collection: "Forms", description: "Conditions nest inside groups, and groups combine with a top-level AND/OR join, at composition scale beyond one flat condition list." },
  { slug: "button", title: "Button", collection: "Forms", description: "Lets a user trigger a single, immediate action such as submit, save, confirm, or cancel." },
  { slug: "data-import-wizard-validation-preview-steps", title: "Data Import Wizard Validation Preview Steps", collection: "Forms", description: "The upload-to-summary contract as five discrete steps: upload, map, validate, preview, confirm." },
  { slug: "mobile-signup-field-stack", title: "Mobile Signup Field Stack", collection: "Forms", description: "The field-level implementation of the structural constraint: 48x48 touch targets and a next-field keyboard action." },
  { slug: "responsive-content-grid", title: "Responsive Content Grid", collection: "Layout", description: "Arranges peer items into as many columns as the content can support, then collapses without changing their reading order." },
  { slug: "sidebar-application-shell", title: "Sidebar Application Shell", collection: "Layout", description: "Gives repeated product navigation a stable rail while keeping the task surface flexible." },
  { slug: "landing-hero", title: "Landing Hero", collection: "Marketing", description: "The first-viewport block for a public product homepage: a centered promise, one supporting line, two calls to action, and one restrained proof surface." },
  { slug: "bottom-tab-bar", title: "Bottom Tab Bar", collection: "Navigation", description: "A persistent bar fixed to the bottom of a mobile screen that switches between the app's top-level, equally-important destinations." },
  { slug: "doc-search-cmdk-grouped-results-panel", title: "Doc Search Cmd-K Grouped Results Panel", collection: "Navigation", description: "A documentation site's Cmd/Ctrl+K search whose result set is grouped by content kind rather than shown as one flat list." },
  { slug: "large-title-collapsing-header", title: "Large Title Collapsing Header", collection: "Navigation", description: "The transition contract behind the big-title-to-collapsed-title visual states of a scrolling mobile header." },
  { slug: "topbar-command-search", title: "Topbar Command Search", collection: "Navigation", description: "A collapsed topbar icon that expands into a full-width search input with a live suggestion popover underneath it." },
  { slug: "versioned-docs-switcher-navbar-sidebar-swap", title: "Versioned Docs Switcher With Navbar Dropdown And Sidebar Swap", collection: "Navigation", description: "Picking a version in the navbar dropdown swaps the sidebar tree's entire data source and shows a stale-version banner when the version isn't the latest." },
  { slug: "action-sheet-destructive-confirmation", title: "Action Sheet Destructive Confirmation", collection: "Overlays", description: "An action sheet variant tuned for the common case where one of the listed actions is destructive and irreversible." },
  { slug: "bottom-sheet-detents", title: "Bottom Sheet Detents", collection: "Overlays", description: "A bottom sheet with two collapsed/expanded height presets toggled from a drag handle, with or without a background scrim." },
  { slug: "popover", title: "Popover", collection: "Overlays", description: "A small floating panel anchored to a trigger, for compact interactive content that doesn't need the weight of a dialog or a tooltip." },
]

export function getRecipeGalleryEntriesByCollection(collection: RecipeCollection): RecipeGalleryEntry[] {
  return recipeGalleryEntries.filter((entry) => entry.collection === collection)
}

/** Stable DOM anchor id for a collection's section in the gallery index, used by the recipes sidebar nav. */
export function recipeCollectionAnchorId(collection: RecipeCollection): string {
  return `recipe-collection-${collection.toLowerCase().replace(/\s+/g, "-")}`
}

export function getRecipeGalleryEntry(slug: string): RecipeGalleryEntry | undefined {
  return recipeGalleryEntries.find((entry) => entry.slug === slug)
}
