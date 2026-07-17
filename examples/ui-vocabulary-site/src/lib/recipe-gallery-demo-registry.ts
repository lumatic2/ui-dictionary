/**
 * slug -> zero-prop demo component, one entry per recipe in
 * recipe-gallery-data.ts. Kept in a plain `.ts` module (not `.tsx`) so the
 * component file `@/components/recipe-gallery-demos` only exports React
 * components — mixing a data export in there trips the Fast Refresh
 * only-export-components lint rule for every component in the file.
 */
import type { ComponentType } from "react"
import {
  ShowcaseCardDemo,
  CartDrawerDemo,
  CategoryProductGridDemo,
  ProductDetailPurchaseStackDemo,
  PromoBannerSystemDemo,
  ShippingMethodSelectorDemo,
  AuditLogFilterableExportFeedDemo,
  BulkActionToolbarDemo,
  PermissionMatrixEditorGridDemo,
  ApiReferenceThreeColumnLayoutDemo,
  ArticleDocumentationLayoutDemo,
  DocsChangelogCategoryFilterPageDemo,
  DocsCodeBlockWithTabsAndCopyDemo,
  AdvancedFilterBuilderConditionGroupsDemo,
  ButtonDemo,
  DataImportWizardValidationPreviewStepsDemo,
  LandingHeroDemo,
  DocSearchCmdkGroupedResultsPanelDemo,
  TopbarCommandSearchDemo,
  VersionedDocsSwitcherNavbarSidebarSwapDemo,
  PopoverDemo,
} from "@/components/recipe-gallery-demos"
import { CheckoutOrderSummaryDemo } from "@/components/checkout-order-summary"
import { InteractiveDataTableDemo } from "@/components/interactive-data-table"
import { PullToRefreshListPatternDemo } from "@/components/pull-to-refresh-list-pattern"
import { StatSummaryGridDemo } from "@/components/stat-summary-grid"
import { SwipeActionRowPatternDemo } from "@/components/swipe-action-row-pattern"
import { ActionableToastDemo } from "@/components/actionable-toast"
import { RecoverableEmptyStateDemo } from "@/components/recoverable-empty-state"
import { MobileSignupFieldStackDemo } from "@/components/mobile-signup-field-stack"
import { ResponsiveContentGridDemo } from "@/components/responsive-content-grid"
import { SidebarApplicationShellDemo } from "@/components/sidebar-application-shell"
import { BottomTabBarDemo } from "@/components/bottom-tab-bar"
import { LargeTitleCollapsingHeaderDemo } from "@/components/large-title-collapsing-header"
import { ActionSheetDestructiveConfirmationDemo } from "@/components/action-sheet-destructive-confirmation"
import { BottomSheetDetentsDemo } from "@/components/bottom-sheet-detents"
import { ChatConversationPanelDemo } from "@/components/chat-conversation-panel"
import { MeshGradientSurfaceDemo } from "@/components/mesh-gradient-surface"
import { GlassPanelDemo } from "@/components/glass-panel"
import { GrainTextureOverlayDemo } from "@/components/grain-texture-overlay"
import { ScrollDrivenRevealDemo } from "@/components/scroll-driven-reveal"
import { MagneticHoverButtonDemo } from "@/components/magnetic-hover-button"
import { SpringDragSnapCardDemo } from "@/components/spring-drag-snap-card"

export const recipeDemoComponents: Record<string, ComponentType> = {
  "showcase-card": ShowcaseCardDemo,
  "chat-conversation-panel": ChatConversationPanelDemo,
  "mesh-gradient-surface": MeshGradientSurfaceDemo,
  "glass-panel": GlassPanelDemo,
  "grain-texture-overlay": GrainTextureOverlayDemo,
  "scroll-driven-reveal": ScrollDrivenRevealDemo,
  "magnetic-hover-button": MagneticHoverButtonDemo,
  "spring-drag-snap-card": SpringDragSnapCardDemo,
  "cart-drawer": CartDrawerDemo,
  "category-product-grid": CategoryProductGridDemo,
  "checkout-order-summary": CheckoutOrderSummaryDemo,
  "product-detail-purchase-stack": ProductDetailPurchaseStackDemo,
  "promo-banner-system": PromoBannerSystemDemo,
  "shipping-method-selector": ShippingMethodSelectorDemo,
  "audit-log-filterable-export-feed": AuditLogFilterableExportFeedDemo,
  "bulk-action-toolbar-selection-model": BulkActionToolbarDemo,
  "interactive-data-table": InteractiveDataTableDemo,
  "permission-matrix-editor-grid": PermissionMatrixEditorGridDemo,
  "pull-to-refresh-list-pattern": PullToRefreshListPatternDemo,
  "stat-summary-grid": StatSummaryGridDemo,
  "swipe-action-row-pattern": SwipeActionRowPatternDemo,
  "api-reference-three-column-layout": ApiReferenceThreeColumnLayoutDemo,
  "article-documentation-layout": ArticleDocumentationLayoutDemo,
  "docs-changelog-category-filter-page": DocsChangelogCategoryFilterPageDemo,
  "docs-code-block-with-tabs-and-copy": DocsCodeBlockWithTabsAndCopyDemo,
  "actionable-toast": ActionableToastDemo,
  "recoverable-empty-state": RecoverableEmptyStateDemo,
  "advanced-filter-builder-condition-groups": AdvancedFilterBuilderConditionGroupsDemo,
  button: ButtonDemo,
  "data-import-wizard-validation-preview-steps": DataImportWizardValidationPreviewStepsDemo,
  "mobile-signup-field-stack": MobileSignupFieldStackDemo,
  "responsive-content-grid": ResponsiveContentGridDemo,
  "sidebar-application-shell": SidebarApplicationShellDemo,
  "landing-hero": LandingHeroDemo,
  "bottom-tab-bar": BottomTabBarDemo,
  "doc-search-cmdk-grouped-results-panel": DocSearchCmdkGroupedResultsPanelDemo,
  "large-title-collapsing-header": LargeTitleCollapsingHeaderDemo,
  "topbar-command-search": TopbarCommandSearchDemo,
  "versioned-docs-switcher-navbar-sidebar-swap": VersionedDocsSwitcherNavbarSidebarSwapDemo,
  "action-sheet-destructive-confirmation": ActionSheetDestructiveConfirmationDemo,
  "bottom-sheet-detents": BottomSheetDetentsDemo,
  popover: PopoverDemo,
}
