import type { TermCategory, TermKind } from "@/data/terms.generated"

export type NavigationCollectionId =
  | "docs-all"
  | "docs-layout"
  | "docs-styling"
  | "docs-interaction"
  | "docs-accessibility"
  | "docs-motion-effects"
  | "docs-ui-blocks"
  | "docs-component-api"
  | "docs-getting-started-setup"
  | "docs-getting-started-html"
  | "docs-getting-started-react"
  | "docs-getting-started-vue"
  | "docs-getting-started-assets"
  | "docs-elements-introduction"
  | "docs-elements-autocomplete"
  | "docs-elements-command-palette"
  | "docs-elements-copy-button"
  | "docs-elements-dialog"
  | "docs-elements-disclosure"
  | "docs-elements-dropdown-menu"
  | "docs-elements-popover"
  | "docs-elements-select"
  | "docs-elements-tabs"
  | "docs-foundations-color"
  | "docs-foundations-typography"
  | "docs-foundations-spacing-layout"
  | "docs-foundations-motion"
  | "docs-foundations-accessibility"
  | "docs-foundations-dark-mode"
  | "docs-foundations-tokens"
  | "docs-agent-recipes"
  | "plus-all"
  | "plus-marketing"
  | "plus-marketing-page-sections"
  | "plus-marketing-hero-sections"
  | "plus-marketing-feature-sections"
  | "plus-marketing-cta-sections"
  | "plus-marketing-bento-grids"
  | "plus-marketing-pricing-sections"
  | "plus-marketing-header-sections"
  | "plus-marketing-newsletter-sections"
  | "plus-marketing-stats"
  | "plus-marketing-testimonials"
  | "plus-marketing-blog-sections"
  | "plus-marketing-contact-sections"
  | "plus-marketing-team-sections"
  | "plus-marketing-content-sections"
  | "plus-marketing-logo-clouds"
  | "plus-marketing-faqs"
  | "plus-marketing-footers"
  | "plus-marketing-elements"
  | "plus-marketing-headers"
  | "plus-marketing-flyout-menus"
  | "plus-marketing-banners"
  | "plus-marketing-feedback"
  | "plus-marketing-404-pages"
  | "plus-marketing-page-examples"
  | "plus-marketing-landing-pages"
  | "plus-marketing-pricing-pages"
  | "plus-marketing-about-pages"
  | "plus-application-ui"
  | "plus-ecommerce"
  | "plus-ecommerce-components"
  | "plus-ecommerce-product-overviews"
  | "plus-ecommerce-product-lists"
  | "plus-ecommerce-category-previews"
  | "plus-ecommerce-shopping-carts"
  | "plus-ecommerce-category-filters"
  | "plus-ecommerce-product-quickviews"
  | "plus-ecommerce-product-features"
  | "plus-ecommerce-store-navigation"
  | "plus-ecommerce-promo-sections"
  | "plus-ecommerce-checkout-forms"
  | "plus-ecommerce-reviews"
  | "plus-ecommerce-order-summaries"
  | "plus-ecommerce-order-history"
  | "plus-ecommerce-incentives"
  | "plus-ecommerce-page-examples"
  | "plus-ecommerce-page-examples-storefront-pages"
  | "plus-ecommerce-page-examples-product-pages"
  | "plus-ecommerce-page-examples-category-pages"
  | "plus-ecommerce-page-examples-shopping-cart-pages"
  | "plus-ecommerce-page-examples-checkout-pages"
  | "plus-ecommerce-page-examples-order-detail-pages"
  | "plus-ecommerce-page-examples-order-history-pages"
  | "plus-ecommerce-page-examples-storefront"
  | "plus-ecommerce-page-examples-product"
  | "plus-ecommerce-page-examples-category"
  | "plus-ecommerce-page-examples-cart"
  | "plus-ecommerce-page-examples-checkout"
  | "plus-ecommerce-page-examples-order-detail"
  | "plus-forms"
  | "plus-forms-form-layouts"
  | "plus-forms-input-groups"
  | "plus-forms-select-menus"
  | "plus-forms-sign-in-registration"
  | "plus-forms-textareas"
  | "plus-forms-radio-groups"
  | "plus-forms-checkboxes"
  | "plus-forms-toggles"
  | "plus-forms-action-panels"
  | "plus-forms-comboboxes"
  | "plus-navigation"
  | "plus-navigation-navbars"
  | "plus-navigation-tabs"
  | "plus-navigation-breadcrumbs"
  | "plus-navigation-pagination"
  | "plus-navigation-vertical-navigation"
  | "plus-navigation-sidebar-navigation"
  | "plus-navigation-progress-bars"
  | "plus-navigation-command-palettes"
  | "plus-navigation-command-menus"
  | "plus-navigation-sidebars"
  | "plus-overlays"
  | "plus-overlays-modal-dialogs"
  | "plus-overlays-modals"
  | "plus-overlays-drawers"
  | "plus-overlays-notifications"
  | "plus-overlays-slide-overs"
  | "plus-overlays-popovers"
  | "plus-feedback"
  | "plus-feedback-alerts"
  | "plus-feedback-empty-states"
  | "plus-feedback-progress"
  | "plus-feedback-skeletons"
  | "plus-feedback-toasts"
  | "plus-data-display"
  | "plus-data-display-description-lists"
  | "plus-data-display-stats"
  | "plus-data-display-calendars"
  | "plus-data-display-lists"
  | "plus-data-display-tables"
  | "plus-page-sections"
  | "plus-application-shells"
  | "plus-application-shells-stacked-layouts"
  | "plus-application-shells-sidebar-layouts"
  | "plus-application-shells-multi-column-layouts"
  | "plus-application-headings"
  | "plus-application-headings-page-headings"
  | "plus-application-headings-card-headings"
  | "plus-application-headings-section-headings"
  | "plus-application-headings-table-headings"
  | "plus-application-lists"
  | "plus-application-lists-stacked-lists"
  | "plus-application-lists-tables"
  | "plus-application-lists-grid-lists"
  | "plus-application-lists-feeds"
  | "plus-application-elements"
  | "plus-application-elements-avatars"
  | "plus-application-elements-badges"
  | "plus-application-elements-dropdowns"
  | "plus-application-elements-buttons"
  | "plus-application-elements-button-groups"
  | "plus-application-layout"
  | "plus-application-layout-containers"
  | "plus-application-layout-cards"
  | "plus-application-layout-list-containers"
  | "plus-application-layout-media-objects"
  | "plus-application-layout-panels"
  | "plus-application-layout-dividers"
  | "plus-application-page-examples"
  | "plus-application-page-examples-home-screens"
  | "plus-application-page-examples-detail-screens"
  | "plus-application-page-examples-settings-screens"
  | "plus-application-page-examples-dashboards"
  | "plus-application-page-examples-settings"
  | "plus-application-page-examples-detail"
  | "plus-application-page-examples-list"
  | "plus-application-page-examples-auth"
  | "plus-application-page-examples-onboarding"
  | "plus-templates-marketing"
  | "plus-templates-marketing-startup-landing"
  | "plus-templates-marketing-saas-pricing"
  | "plus-templates-marketing-company-about"
  | "plus-templates-dashboard"
  | "plus-templates-dashboard-analytics"
  | "plus-templates-dashboard-settings"
  | "plus-templates-dashboard-billing"
  | "plus-templates-auth"
  | "plus-templates-auth-sign-in"
  | "plus-templates-auth-invite"
  | "plus-templates-auth-consent"
  | "plus-templates-ecommerce"
  | "plus-templates-ecommerce-storefront"
  | "plus-templates-ecommerce-checkout"
  | "plus-templates-ecommerce-orders"
  | "plus-templates-onboarding"
  | "plus-templates-onboarding-setup"
  | "plus-templates-onboarding-welcome"
  | "plus-templates-onboarding-consent"
  | "plus-templates-products"
  | "plus-templates-catalyst"
  | "plus-templates-oatmeal"
  | "plus-templates-radiant"
  | "plus-templates-spotlight"
  | "plus-templates-salient"
  | "plus-templates-protocol"
  | "plus-templates-commit"
  | "plus-templates-compass"
  | "plus-templates-primer"
  | "plus-templates-studio"
  | "plus-templates-transmit"
  | "plus-templates-pocket"
  | "plus-templates-syntax"
  | "plus-templates-keynote"
  | "plus-ui-kit"
  | "plus-ui-kit-component-docs"
  | "plus-ui-kit-components"
  | "plus-ui-kit-blocks"
  | "plus-ui-kit-controls"
  | "plus-ui-kit-forms"
  | "plus-ui-kit-navigation"
  | "plus-ui-kit-overlays"
  | "plus-ui-kit-data-display"
  | "plus-ui-kit-layout"
  | "plus-ui-kit-feedback"
  | "plus-ui-kit-form-patterns"
  | "plus-ui-kit-visual-effects"
  | "plus-ui-kit-motion-patterns"
  | "plus-ui-kit-visual-treatments"

export type NavigationFilter = `nav:${NavigationCollectionId}`

const navigationCollectionAliases: Record<string, NavigationCollectionId> = {
  "plus-application-ui-shells": "plus-application-shells",
  "plus-application-ui-shells-stacked-layouts": "plus-application-shells-stacked-layouts",
  "plus-application-ui-shells-sidebar-layouts": "plus-application-shells-sidebar-layouts",
  "plus-application-ui-shells-multi-column-layouts": "plus-application-shells-multi-column-layouts",
  "plus-application-ui-headings": "plus-application-headings",
  "plus-application-ui-headings-page-headings": "plus-application-headings-page-headings",
  "plus-application-ui-headings-card-headings": "plus-application-headings-card-headings",
  "plus-application-ui-headings-section-headings": "plus-application-headings-section-headings",
  "plus-application-ui-headings-table-headings": "plus-application-headings-table-headings",
  "plus-application-ui-data-display": "plus-data-display",
  "plus-application-ui-data-display-description-lists": "plus-data-display-description-lists",
  "plus-application-ui-data-display-stats": "plus-data-display-stats",
  "plus-application-ui-data-display-calendars": "plus-data-display-calendars",
  "plus-application-ui-data-display-lists": "plus-data-display-lists",
  "plus-application-ui-data-display-tables": "plus-data-display-tables",
  "plus-application-ui-lists": "plus-application-lists",
  "plus-application-ui-lists-stacked-lists": "plus-application-lists-stacked-lists",
  "plus-application-ui-lists-tables": "plus-application-lists-tables",
  "plus-application-ui-lists-grid-lists": "plus-application-lists-grid-lists",
  "plus-application-ui-lists-feeds": "plus-application-lists-feeds",
  "plus-application-ui-forms": "plus-forms",
  "plus-application-ui-forms-form-layouts": "plus-forms-form-layouts",
  "plus-application-ui-forms-input-groups": "plus-forms-input-groups",
  "plus-application-ui-forms-select-menus": "plus-forms-select-menus",
  "plus-application-ui-forms-sign-in-registration": "plus-forms-sign-in-registration",
  "plus-application-ui-forms-textareas": "plus-forms-textareas",
  "plus-application-ui-forms-radio-groups": "plus-forms-radio-groups",
  "plus-application-ui-forms-checkboxes": "plus-forms-checkboxes",
  "plus-application-ui-forms-toggles": "plus-forms-toggles",
  "plus-application-ui-forms-action-panels": "plus-forms-action-panels",
  "plus-application-ui-forms-comboboxes": "plus-forms-comboboxes",
  "plus-application-ui-feedback": "plus-feedback",
  "plus-application-ui-feedback-alerts": "plus-feedback-alerts",
  "plus-application-ui-feedback-empty-states": "plus-feedback-empty-states",
  "plus-application-ui-feedback-progress": "plus-feedback-progress",
  "plus-application-ui-feedback-skeletons": "plus-feedback-skeletons",
  "plus-application-ui-feedback-toasts": "plus-feedback-toasts",
  "plus-application-ui-navigation": "plus-navigation",
  "plus-application-ui-navigation-navbars": "plus-navigation-navbars",
  "plus-application-ui-navigation-pagination": "plus-navigation-pagination",
  "plus-application-ui-navigation-tabs": "plus-navigation-tabs",
  "plus-application-ui-navigation-vertical-navigation": "plus-navigation-vertical-navigation",
  "plus-application-ui-navigation-sidebar-navigation": "plus-navigation-sidebar-navigation",
  "plus-application-ui-navigation-breadcrumbs": "plus-navigation-breadcrumbs",
  "plus-application-ui-navigation-progress-bars": "plus-navigation-progress-bars",
  "plus-application-ui-navigation-command-palettes": "plus-navigation-command-palettes",
  "plus-application-ui-navigation-command-menus": "plus-navigation-command-menus",
  "plus-application-ui-navigation-sidebars": "plus-navigation-sidebars",
  "plus-application-ui-overlays": "plus-overlays",
  "plus-application-ui-overlays-modal-dialogs": "plus-overlays-modal-dialogs",
  "plus-application-ui-overlays-drawers": "plus-overlays-drawers",
  "plus-application-ui-overlays-notifications": "plus-overlays-notifications",
  "plus-application-ui-overlays-slide-overs": "plus-overlays-slide-overs",
  "plus-application-ui-overlays-popovers": "plus-overlays-popovers",
  "plus-application-ui-elements": "plus-application-elements",
  "plus-application-ui-elements-avatars": "plus-application-elements-avatars",
  "plus-application-ui-elements-badges": "plus-application-elements-badges",
  "plus-application-ui-elements-dropdowns": "plus-application-elements-dropdowns",
  "plus-application-ui-elements-buttons": "plus-application-elements-buttons",
  "plus-application-ui-elements-button-groups": "plus-application-elements-button-groups",
  "plus-application-ui-layout": "plus-application-layout",
  "plus-application-ui-layout-containers": "plus-application-layout-containers",
  "plus-application-ui-layout-cards": "plus-application-layout-cards",
  "plus-application-ui-layout-list-containers": "plus-application-layout-list-containers",
  "plus-application-ui-layout-media-objects": "plus-application-layout-media-objects",
  "plus-application-ui-layout-panels": "plus-application-layout-panels",
  "plus-application-ui-layout-dividers": "plus-application-layout-dividers",
  "plus-application-ui-page-examples": "plus-application-page-examples",
  "plus-application-ui-page-examples-home-screens": "plus-application-page-examples-home-screens",
  "plus-application-ui-page-examples-detail-screens": "plus-application-page-examples-detail-screens",
  "plus-application-ui-page-examples-settings-screens": "plus-application-page-examples-settings-screens",
} as const

export function normalizeNavigationFilter(value: string): NavigationFilter | null {
  if (!value.startsWith("nav:")) {
    return null
  }

  const id = value.slice("nav:".length)
  if (navigationCollections.some((collection) => collection.id === id)) {
    return value as NavigationFilter
  }

  const alias = navigationCollectionAliases[id]
  return alias ? navFilter(alias) : null
}

export type NavigationCollection = {
  id: NavigationCollectionId
  label: string
  path: string[]
  categories?: TermCategory[]
  groupIds?: string[]
  kinds?: TermKind[]
  termIds?: string[]
}

export const navigationCollections: NavigationCollection[] = [
  {
    id: "docs-all",
    label: "Docs",
    path: ["Docs"],
    categories: ["style", "layout-rendering", "accessibility"],
    groupIds: ["feedback-interaction-states", "feedback-loading-progress", "feedback-empty-error", "accessibility-aria-screen-reader", "accessibility-focus-motion"],
  },
  {
    id: "docs-layout",
    label: "Layout",
    path: ["Docs", "Layout"],
    categories: ["layout-rendering"],
    groupIds: ["layout-spacing-sizing", "layout-responsive-viewport", "layout-stacking-overflow", "layout-scroll-behavior"],
  },
  {
    id: "docs-styling",
    label: "Styling",
    path: ["Docs", "Styling"],
    categories: ["style"],
    groupIds: ["style-surface-material", "style-border-color", "style-typography", "style-tokens", "style-decorative-effects"],
  },
  {
    id: "docs-interaction",
    label: "Interaction",
    path: ["Docs", "Interaction"],
    groupIds: ["feedback-interaction-states", "feedback-loading-progress", "feedback-alerts-toasts", "feedback-empty-error"],
  },
  {
    id: "docs-accessibility",
    label: "Accessibility",
    path: ["Docs", "Accessibility"],
    categories: ["accessibility"],
    groupIds: ["accessibility-aria-screen-reader", "accessibility-focus-motion"],
  },
  {
    id: "docs-motion-effects",
    label: "Motion & Effects",
    path: ["Docs", "Motion & Effects"],
    kinds: ["motion-pattern", "visual-effect"],
    groupIds: ["feedback-interaction-states", "feedback-loading-progress", "style-decorative-effects"],
  },
  {
    id: "docs-ui-blocks",
    label: "UI Blocks",
    path: ["Docs", "UI Blocks"],
    groupIds: ["layout-spacing-sizing", "layout-responsive-viewport", "layout-stacking-overflow", "style-tokens"],
    termIds: ["container", "stack", "responsive-breakpoint", "dark-mode", "code-preview-tabs", "viewport-preview"],
  },
  {
    id: "docs-component-api",
    label: "Component API",
    path: ["Docs", "Component API"],
    groupIds: ["input-text", "input-pickers", "selection-navigation", "feedback-alerts-toasts", "data-tables-lists"],
    termIds: ["button", "text-field", "checkbox", "combobox", "dialog", "data-table-toolbar", "sidebar-nav"],
  },
  {
    id: "docs-getting-started-setup",
    label: "Getting set up",
    path: ["Docs", "Getting started", "Getting set up"],
    groupIds: ["layout-spacing-sizing", "style-tokens", "accessibility-focus-motion"],
    termIds: ["container", "typography", "dark-mode", "responsive-breakpoint"],
  },
  {
    id: "docs-getting-started-html",
    label: "Using HTML",
    path: ["Docs", "Getting started", "Using HTML"],
    groupIds: ["structure-sections", "layout-spacing-sizing", "style-tokens"],
    termIds: ["semantic-html", "button", "input-label", "focus-ring"],
  },
  {
    id: "docs-getting-started-react",
    label: "Using React",
    path: ["Docs", "Getting started", "Using React"],
    groupIds: ["input-text", "selection-navigation", "feedback-interaction-states"],
    termIds: ["component-props", "controlled-input", "dialog", "tabs"],
  },
  {
    id: "docs-getting-started-vue",
    label: "Using Vue",
    path: ["Docs", "Getting started", "Using Vue"],
    groupIds: ["input-text", "selection-navigation", "feedback-interaction-states"],
    termIds: ["component-props", "controlled-input", "combobox", "popover"],
  },
  {
    id: "docs-getting-started-assets",
    label: "Assets",
    path: ["Docs", "Getting started", "Assets"],
    groupIds: ["style-decorative-effects", "data-basic-content-elements"],
    termIds: ["avatar", "icon", "logo", "empty-state-illustration"],
  },
  {
    id: "docs-elements-introduction",
    label: "Introduction",
    path: ["Docs", "Elements", "Introduction"],
    groupIds: ["input-text", "selection-navigation", "feedback-interaction-states", "accessibility-focus-motion"],
    termIds: ["button", "text-field", "dialog", "tabs", "combobox"],
  },
  {
    id: "docs-elements-autocomplete",
    label: "Autocomplete",
    path: ["Docs", "Elements", "Autocomplete"],
    groupIds: ["input-pickers", "selection-navigation", "feedback-empty-error"],
    termIds: ["combobox", "search-field", "empty-state", "keyboard-navigation"],
  },
  {
    id: "docs-elements-command-palette",
    label: "Command palette",
    path: ["Docs", "Elements", "Command palette"],
    groupIds: ["selection-navigation", "selection-menus", "feedback-empty-error"],
    termIds: ["command-palette", "search-field", "keyboard-shortcut", "empty-state"],
  },
  {
    id: "docs-elements-copy-button",
    label: "Copy button",
    path: ["Docs", "Elements", "Copy button"],
    groupIds: ["feedback-status-notifications", "feedback-confirmation-help"],
    termIds: ["button", "toast", "tooltip", "icon-button"],
  },
  {
    id: "docs-elements-dialog",
    label: "Dialog",
    path: ["Docs", "Elements", "Dialog"],
    groupIds: ["feedback-confirmation-help", "accessibility-focus-motion"],
    termIds: ["dialog", "modal", "focus-trap", "button"],
  },
  {
    id: "docs-elements-disclosure",
    label: "Disclosure",
    path: ["Docs", "Elements", "Disclosure"],
    groupIds: ["selection-navigation", "feedback-interaction-states"],
    termIds: ["accordion", "details-summary", "expand-collapse"],
  },
  {
    id: "docs-elements-dropdown-menu",
    label: "Dropdown menu",
    path: ["Docs", "Elements", "Dropdown menu"],
    groupIds: ["selection-menus", "selection-navigation"],
    termIds: ["dropdown-menu", "menu-item", "keyboard-navigation"],
  },
  {
    id: "docs-elements-popover",
    label: "Popover",
    path: ["Docs", "Elements", "Popover"],
    groupIds: ["selection-menus", "feedback-confirmation-help"],
    termIds: ["popover", "tooltip", "floating-panel"],
  },
  {
    id: "docs-elements-select",
    label: "Select",
    path: ["Docs", "Elements", "Select"],
    groupIds: ["input-pickers", "selection-menus"],
    termIds: ["select-menu", "combobox", "option-list"],
  },
  {
    id: "docs-elements-tabs",
    label: "Tabs",
    path: ["Docs", "Elements", "Tabs"],
    groupIds: ["selection-navigation", "structure-navigation"],
    termIds: ["tabs", "segmented-control", "tab-panel"],
  },
  {
    id: "docs-foundations-color",
    label: "Color",
    path: ["Docs", "Foundations", "Color"],
    categories: ["style"],
    groupIds: ["style-surface-material", "style-border-color"],
  },
  {
    id: "docs-foundations-typography",
    label: "Typography",
    path: ["Docs", "Foundations", "Typography"],
    categories: ["style"],
    groupIds: ["style-typography"],
  },
  {
    id: "docs-foundations-spacing-layout",
    label: "Spacing & layout",
    path: ["Docs", "Foundations", "Spacing & layout"],
    categories: ["layout-rendering"],
    groupIds: ["layout-spacing-sizing", "layout-responsive-viewport"],
  },
  {
    id: "docs-foundations-motion",
    label: "Motion",
    path: ["Docs", "Foundations", "Motion"],
    kinds: ["motion-pattern"],
    groupIds: ["feedback-interaction-states"],
  },
  {
    id: "docs-foundations-accessibility",
    label: "Accessibility",
    path: ["Docs", "Foundations", "Accessibility"],
    categories: ["accessibility"],
    groupIds: ["accessibility-aria-screen-reader", "accessibility-focus-motion"],
  },
  {
    id: "docs-foundations-dark-mode",
    label: "Dark mode",
    path: ["Docs", "Foundations", "Dark mode"],
    groupIds: ["style-tokens"],
    termIds: ["dark-mode"],
  },
  {
    id: "docs-foundations-tokens",
    label: "Tokens",
    path: ["Docs", "Foundations", "Tokens"],
    groupIds: ["style-tokens"],
  },
  {
    id: "docs-agent-recipes",
    label: "Agent Recipes",
    path: ["Docs", "Agent Recipes"],
  },
  {
    id: "plus-all",
    label: "Plus",
    path: ["Plus"],
    categories: ["input", "selection", "action", "structure", "data-display"],
    groupIds: ["feedback-alerts-toasts", "feedback-loading-progress", "feedback-empty-error", "feedback-access-limits", "feedback-auth-security", "feedback-status-notifications", "feedback-confirmation-help"],
  },
  {
    id: "plus-marketing",
    label: "Marketing",
    path: ["Plus", "UI Blocks", "Marketing"],
    termIds: ["hero", "cta-section", "testimonial-section", "feature-grid-section", "pricing-section", "bento-grid", "spotlight-hero", "newsletter-section", "animated-gradient-background"],
  },
  {
    id: "plus-marketing-page-sections",
    label: "Page Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections"],
    groupIds: ["structure-sections"],
    termIds: ["hero", "cta-section", "pricing-section", "feature-grid-section", "bento-grid", "testimonial-section", "newsletter-section"],
  },
  {
    id: "plus-marketing-hero-sections",
    label: "Hero Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Hero Sections"],
    termIds: ["hero", "spotlight-hero"],
  },
  {
    id: "plus-marketing-feature-sections",
    label: "Feature Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Feature Sections"],
    termIds: ["feature-grid-section"],
  },
  {
    id: "plus-marketing-cta-sections",
    label: "CTA Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "CTA Sections"],
    termIds: ["cta-section"],
  },
  {
    id: "plus-marketing-bento-grids",
    label: "Bento Grids",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Bento Grids"],
    termIds: ["bento-grid"],
  },
  {
    id: "plus-marketing-pricing-sections",
    label: "Pricing Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Pricing Sections"],
    termIds: ["pricing-section"],
  },
  {
    id: "plus-marketing-header-sections",
    label: "Header Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Header Sections"],
    termIds: ["header"],
  },
  {
    id: "plus-marketing-newsletter-sections",
    label: "Newsletter Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Newsletter Sections"],
    termIds: ["newsletter-section"],
  },
  {
    id: "plus-marketing-stats",
    label: "Stats",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Stats"],
    termIds: ["stat-list", "metric-card"],
  },
  {
    id: "plus-marketing-testimonials",
    label: "Testimonials",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Testimonials"],
    termIds: ["testimonial-section"],
  },
  {
    id: "plus-marketing-blog-sections",
    label: "Blog Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Blog Sections"],
    termIds: ["blog-post-card", "blog-grid-section", "featured-post-card"],
  },
  {
    id: "plus-marketing-contact-sections",
    label: "Contact Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Contact Sections"],
    termIds: ["contact-form-section", "contact-info-panel", "office-location-card"],
  },
  {
    id: "plus-marketing-team-sections",
    label: "Team Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Team Sections"],
    termIds: ["team-member-row"],
  },
  {
    id: "plus-marketing-content-sections",
    label: "Content Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Content Sections"],
    termIds: ["content-section", "split-content-section"],
  },
  {
    id: "plus-marketing-logo-clouds",
    label: "Logo Clouds",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Logo Clouds"],
    termIds: ["logo-cloud-section", "marquee-row"],
  },
  {
    id: "plus-marketing-faqs",
    label: "FAQs",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "FAQs"],
    termIds: ["faq-list"],
  },
  {
    id: "plus-marketing-footers",
    label: "Footers",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections", "Footers"],
    termIds: ["footer"],
  },
  {
    id: "plus-marketing-elements",
    label: "Elements",
    path: ["Plus", "UI Blocks", "Marketing", "Elements"],
    termIds: ["header", "floating-navbar", "announcement-banner"],
  },
  {
    id: "plus-marketing-headers",
    label: "Headers",
    path: ["Plus", "UI Blocks", "Marketing", "Elements", "Headers"],
    termIds: ["header", "floating-navbar"],
  },
  {
    id: "plus-marketing-flyout-menus",
    label: "Flyout Menus",
    path: ["Plus", "UI Blocks", "Marketing", "Elements", "Flyout Menus"],
    termIds: ["mega-menu", "navbar-menu"],
  },
  {
    id: "plus-marketing-banners",
    label: "Banners",
    path: ["Plus", "UI Blocks", "Marketing", "Elements", "Banners"],
    termIds: ["announcement-banner", "banner"],
  },
  {
    id: "plus-marketing-feedback",
    label: "Feedback",
    path: ["Plus", "UI Blocks", "Marketing", "Feedback"],
    termIds: ["not-found-state"],
  },
  {
    id: "plus-marketing-404-pages",
    label: "404 Pages",
    path: ["Plus", "UI Blocks", "Marketing", "Feedback", "404 Pages"],
    termIds: ["not-found-state"],
  },
  {
    id: "plus-marketing-page-examples",
    label: "Page Examples",
    path: ["Plus", "UI Blocks", "Marketing", "Page Examples"],
    termIds: [],
  },
  {
    id: "plus-marketing-landing-pages",
    label: "Landing Pages",
    path: ["Plus", "UI Blocks", "Marketing", "Page Examples", "Landing Pages"],
    termIds: [],
  },
  {
    id: "plus-marketing-pricing-pages",
    label: "Pricing Pages",
    path: ["Plus", "UI Blocks", "Marketing", "Page Examples", "Pricing Pages"],
    termIds: [],
  },
  {
    id: "plus-marketing-about-pages",
    label: "About Pages",
    path: ["Plus", "UI Blocks", "Marketing", "Page Examples", "About Pages"],
    termIds: [],
  },
  {
    id: "plus-application-ui",
    label: "Application UI",
    path: ["Plus", "UI Blocks", "Application UI"],
    groupIds: ["structure-app-layout", "structure-sidebar-layouts", "data-tables-lists", "data-metrics-charts", "input-auth-forms", "selection-navigation", "structure-panels", "feedback-alerts-toasts", "feedback-empty-error"],
    termIds: ["command-palette", "data-table-toolbar", "filter-panel", "faceted-filter", "saved-view-tabs", "bulk-action-bar"],
  },
  {
    id: "plus-ecommerce",
    label: "Ecommerce",
    path: ["Plus", "UI Blocks", "Ecommerce"],
    groupIds: ["data-commerce-billing", "selection-context"],
    termIds: ["product-card", "product-option-sheet", "cart-summary-bar", "bottom-cta-bar", "checkout-progress-header", "payment-method-card", "price-card", "plan-card"],
  },
  {
    id: "plus-ecommerce-components",
    label: "Components",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components"],
    groupIds: ["data-commerce-billing", "selection-context"],
    termIds: ["product-card", "product-option-sheet", "cart-summary", "cart-summary-bar", "checkout-step", "checkout-progress-header", "payment-method-card", "price-card", "plan-card"],
  },
  {
    id: "plus-ecommerce-product-overviews",
    label: "Product Overviews",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Product Overviews"],
    termIds: ["product-card", "product-option-sheet", "price-card"],
  },
  {
    id: "plus-ecommerce-product-lists",
    label: "Product Lists",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Product Lists"],
    termIds: ["product-card", "filter-panel", "faceted-filter"],
  },
  {
    id: "plus-ecommerce-category-previews",
    label: "Category Previews",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Category Previews"],
    termIds: ["product-card", "price-card", "filter-panel"],
  },
  {
    id: "plus-ecommerce-shopping-carts",
    label: "Shopping Carts",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Shopping Carts"],
    termIds: ["cart-summary", "cart-summary-bar", "quantity-stepper"],
  },
  {
    id: "plus-ecommerce-category-filters",
    label: "Category Filters",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Category Filters"],
    termIds: ["faceted-filter", "filter-panel", "product-card"],
  },
  {
    id: "plus-ecommerce-product-quickviews",
    label: "Product Quickviews",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Product Quickviews"],
    termIds: ["product-option-sheet", "product-card", "bottom-cta-bar"],
  },
  {
    id: "plus-ecommerce-product-features",
    label: "Product Features",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Product Features"],
    termIds: ["product-card", "price-card", "plan-card"],
  },
  {
    id: "plus-ecommerce-store-navigation",
    label: "Store Navigation",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Store Navigation"],
    termIds: ["product-card", "filter-panel", "bottom-cta-bar"],
  },
  {
    id: "plus-ecommerce-promo-sections",
    label: "Promo Sections",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Promo Sections"],
    termIds: ["price-card", "product-card", "bottom-cta-bar"],
  },
  {
    id: "plus-ecommerce-checkout-forms",
    label: "Checkout Forms",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Checkout Forms"],
    termIds: ["checkout-step", "checkout-progress-header", "payment-method-card"],
  },
  {
    id: "plus-ecommerce-reviews",
    label: "Reviews",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Reviews"],
    termIds: ["product-card", "order-status", "testimonial-section"],
  },
  {
    id: "plus-ecommerce-order-summaries",
    label: "Order Summaries",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Order Summaries"],
    termIds: ["cart-summary", "cart-summary-bar", "order-status"],
  },
  {
    id: "plus-ecommerce-order-history",
    label: "Order History",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Order History"],
    termIds: ["order-status", "cart-summary", "checkout-step"],
  },
  {
    id: "plus-ecommerce-incentives",
    label: "Incentives",
    path: ["Plus", "UI Blocks", "Ecommerce", "Components", "Incentives"],
    termIds: ["price-card", "announcement-banner", "bottom-cta-bar"],
  },
  {
    id: "plus-ecommerce-page-examples",
    label: "Page Examples",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples"],
    termIds: ["order-status"],
  },
  {
    id: "plus-ecommerce-page-examples-storefront-pages",
    label: "Storefront Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Storefront Pages"],
    termIds: ["product-card", "price-card", "bottom-cta-bar"],
  },
  {
    id: "plus-ecommerce-page-examples-product-pages",
    label: "Product Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Product Pages"],
    termIds: ["product-card", "product-option-sheet", "price-card"],
  },
  {
    id: "plus-ecommerce-page-examples-category-pages",
    label: "Category Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Category Pages"],
    termIds: ["faceted-filter", "filter-panel", "product-card"],
  },
  {
    id: "plus-ecommerce-page-examples-shopping-cart-pages",
    label: "Shopping Cart Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Shopping Cart Pages"],
    termIds: ["cart-summary", "quantity-stepper", "cart-summary-bar"],
  },
  {
    id: "plus-ecommerce-page-examples-checkout-pages",
    label: "Checkout Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Checkout Pages"],
    termIds: ["checkout-step", "checkout-progress-header", "payment-method-card"],
  },
  {
    id: "plus-ecommerce-page-examples-order-detail-pages",
    label: "Order Detail Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Order Detail Pages"],
    termIds: ["order-status", "cart-summary", "checkout-step"],
  },
  {
    id: "plus-ecommerce-page-examples-order-history-pages",
    label: "Order History Pages",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Order History Pages"],
    termIds: ["order-status", "cart-summary", "checkout-step"],
  },
  {
    id: "plus-ecommerce-page-examples-storefront",
    label: "Storefront",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Storefront"],
    termIds: ["product-card", "price-card", "bottom-cta-bar"],
  },
  {
    id: "plus-ecommerce-page-examples-product",
    label: "Product Page",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Product Page"],
    termIds: ["product-card", "product-option-sheet", "price-card"],
  },
  {
    id: "plus-ecommerce-page-examples-category",
    label: "Category Page",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Category Page"],
    termIds: ["faceted-filter", "filter-panel", "product-card"],
  },
  {
    id: "plus-ecommerce-page-examples-cart",
    label: "Cart",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Cart"],
    termIds: ["cart-summary", "quantity-stepper", "cart-summary-bar"],
  },
  {
    id: "plus-ecommerce-page-examples-checkout",
    label: "Checkout",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Checkout"],
    termIds: ["checkout-step", "checkout-progress-header", "payment-method-card"],
  },
  {
    id: "plus-ecommerce-page-examples-order-detail",
    label: "Order Detail",
    path: ["Plus", "UI Blocks", "Ecommerce", "Page Examples", "Order Detail"],
    termIds: ["order-status", "cart-summary", "checkout-step"],
  },
  {
    id: "plus-forms",
    label: "Forms",
    path: ["Plus", "UI Blocks", "Application UI", "Forms"],
    groupIds: ["input-text", "input-pickers", "input-file-media", "input-editing", "input-auth-forms"],
  },
  {
    id: "plus-forms-form-layouts",
    label: "Form Layouts",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Form Layouts"],
    termIds: ["formisch-form-pattern", "text-field", "textarea"],
  },
  {
    id: "plus-forms-input-groups",
    label: "Input Groups",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Input Groups"],
    termIds: ["input-group", "text-field", "api-key-field"],
  },
  {
    id: "plus-forms-select-menus",
    label: "Select Menus",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Select Menus"],
    termIds: ["select", "combobox", "dropdown-menu"],
  },
  {
    id: "plus-forms-sign-in-registration",
    label: "Sign-in and Registration",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Sign-in and Registration"],
    termIds: ["login-page", "split-auth-layout", "invite-acceptance-screen"],
  },
  {
    id: "plus-forms-textareas",
    label: "Textareas",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Textareas"],
    termIds: ["textarea", "text-field", "input-group"],
  },
  {
    id: "plus-forms-radio-groups",
    label: "Radio Groups",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Radio Groups"],
    termIds: ["radio-group", "segmented-control", "checkout-step"],
  },
  {
    id: "plus-forms-checkboxes",
    label: "Checkboxes",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Checkboxes"],
    termIds: ["checkbox", "checkbox-card", "selection-summary"],
  },
  {
    id: "plus-forms-toggles",
    label: "Toggles",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Toggles"],
    termIds: ["switch", "toggle-group", "segmented-control"],
  },
  {
    id: "plus-forms-action-panels",
    label: "Action Panels",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Action Panels"],
    termIds: ["cta-section", "alert", "confirmation-dialog"],
  },
  {
    id: "plus-forms-comboboxes",
    label: "Comboboxes",
    path: ["Plus", "UI Blocks", "Application UI", "Forms", "Comboboxes"],
    termIds: ["combobox", "autocomplete", "command-palette"],
  },
  {
    id: "plus-navigation",
    label: "Navigation",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation"],
    groupIds: ["selection-navigation", "selection-menus", "structure-navigation"],
  },
  {
    id: "plus-navigation-navbars",
    label: "Navbars",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Navbars"],
    termIds: ["navigation-bar", "top-app-bar", "floating-navbar"],
  },
  {
    id: "plus-navigation-tabs",
    label: "Tabs",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Tabs"],
    termIds: ["tabs", "content-tabs", "saved-view-tabs"],
  },
  {
    id: "plus-navigation-breadcrumbs",
    label: "Breadcrumbs",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Breadcrumbs"],
    termIds: ["breadcrumb", "breadcrumb-header", "breadcrumb-overflow"],
  },
  {
    id: "plus-navigation-pagination",
    label: "Pagination",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Pagination"],
    termIds: ["pagination", "pagination-jump"],
  },
  {
    id: "plus-navigation-vertical-navigation",
    label: "Vertical Navigation",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Vertical Navigation"],
    termIds: ["navigation-rail", "sidebar-nav", "navigation-drawer"],
  },
  {
    id: "plus-navigation-sidebar-navigation",
    label: "Sidebar Navigation",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Sidebar Navigation"],
    termIds: ["sidebar-nav", "navigation-rail", "sidebar-dashboard-layout"],
  },
  {
    id: "plus-navigation-progress-bars",
    label: "Progress Bars",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Progress Bars"],
    termIds: ["progress-bar", "setup-progress", "progress-stepper"],
  },
  {
    id: "plus-navigation-command-palettes",
    label: "Command Palettes",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Command Palettes"],
    termIds: ["command-palette", "combobox", "search-field"],
  },
  {
    id: "plus-navigation-command-menus",
    label: "Command Menus",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Command Menus"],
    termIds: ["command-palette", "combobox", "search-field"],
  },
  {
    id: "plus-navigation-sidebars",
    label: "Sidebars",
    path: ["Plus", "UI Blocks", "Application UI", "Navigation", "Sidebars"],
    termIds: ["sidebar-nav", "navigation-rail", "navigation-drawer"],
  },
  {
    id: "plus-overlays",
    label: "Overlays",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays"],
    groupIds: ["structure-panels", "structure-mobile"],
    termIds: ["dialog", "drawer", "side-sheet", "popover", "modal-bottom-sheet", "full-screen-dialog", "tooltip"],
  },
  {
    id: "plus-overlays-modals",
    label: "Modals",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays", "Modals"],
    termIds: ["dialog", "confirmation-dialog", "full-screen-dialog"],
  },
  {
    id: "plus-overlays-modal-dialogs",
    label: "Modal Dialogs",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays", "Modal Dialogs"],
    termIds: ["dialog", "confirmation-dialog", "full-screen-dialog"],
  },
  {
    id: "plus-overlays-drawers",
    label: "Drawers",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays", "Drawers"],
    termIds: ["drawer", "navigation-drawer", "modal-bottom-sheet"],
  },
  {
    id: "plus-overlays-notifications",
    label: "Notifications",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays", "Notifications"],
    termIds: ["toast", "toast-stack", "notification-list"],
  },
  {
    id: "plus-overlays-slide-overs",
    label: "Slide-overs",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays", "Slide-overs"],
    termIds: ["side-sheet", "sidebar-dialog-layout", "detail-row"],
  },
  {
    id: "plus-overlays-popovers",
    label: "Popovers",
    path: ["Plus", "UI Blocks", "Application UI", "Overlays", "Popovers"],
    termIds: ["popover", "popover-form", "tooltip"],
  },
  {
    id: "plus-feedback",
    label: "Feedback",
    path: ["Plus", "UI Blocks", "Application UI", "Feedback"],
    groupIds: ["feedback-alerts-toasts", "feedback-loading-progress", "feedback-empty-error", "feedback-access-limits", "feedback-status-notifications"],
  },
  {
    id: "plus-feedback-alerts",
    label: "Alerts",
    path: ["Plus", "UI Blocks", "Application UI", "Feedback", "Alerts"],
    termIds: ["alert", "error-state", "warning-state"],
  },
  {
    id: "plus-feedback-empty-states",
    label: "Empty States",
    path: ["Plus", "UI Blocks", "Application UI", "Feedback", "Empty States"],
    termIds: ["empty-state", "empty-table", "empty-search-result"],
  },
  {
    id: "plus-feedback-progress",
    label: "Progress",
    path: ["Plus", "UI Blocks", "Application UI", "Feedback", "Progress"],
    termIds: ["progress-bar", "loading-state", "setup-progress"],
  },
  {
    id: "plus-feedback-skeletons",
    label: "Skeletons",
    path: ["Plus", "UI Blocks", "Application UI", "Feedback", "Skeletons"],
    termIds: ["skeleton", "loading-state"],
  },
  {
    id: "plus-feedback-toasts",
    label: "Toasts",
    path: ["Plus", "UI Blocks", "Application UI", "Feedback", "Toasts"],
    termIds: ["toast", "toast-stack", "success-state"],
  },
  {
    id: "plus-data-display",
    label: "Data Display",
    path: ["Plus", "UI Blocks", "Application UI", "Data Display"],
    groupIds: ["data-tables-lists", "data-metrics-charts", "data-timeline-history", "data-people-integrations", "data-basic-content-elements"],
  },
  {
    id: "plus-data-display-description-lists",
    label: "Description Lists",
    path: ["Plus", "UI Blocks", "Application UI", "Data Display", "Description Lists"],
    termIds: ["description-list", "detail-row"],
  },
  {
    id: "plus-data-display-stats",
    label: "Stats",
    path: ["Plus", "UI Blocks", "Application UI", "Data Display", "Stats"],
    termIds: ["stat-list", "metric-card"],
  },
  {
    id: "plus-data-display-calendars",
    label: "Calendars",
    path: ["Plus", "UI Blocks", "Application UI", "Data Display", "Calendars"],
    termIds: ["calendar-view", "calendar-event-card", "date-range-picker"],
  },
  {
    id: "plus-data-display-lists",
    label: "Lists",
    path: ["Plus", "UI Blocks", "Application UI", "Data Display", "Lists"],
    termIds: ["activity-feed", "team-member-row"],
  },
  {
    id: "plus-data-display-tables",
    label: "Tables",
    path: ["Plus", "UI Blocks", "Application UI", "Data Display", "Tables"],
    termIds: ["table", "data-table-toolbar", "pagination"],
  },
  {
    id: "plus-page-sections",
    label: "Page Sections",
    path: ["Plus", "UI Blocks", "Marketing", "Page Sections"],
    groupIds: ["structure-sections"],
    termIds: ["hero", "cta-section", "pricing-section", "feature-grid-section", "bento-grid", "testimonial-section", "newsletter-section"],
  },
  {
    id: "plus-application-shells",
    label: "Application Shells",
    path: ["Plus", "UI Blocks", "Application UI", "Application Shells"],
    groupIds: ["structure-app-layout", "structure-sidebar-layouts"],
  },
  {
    id: "plus-application-shells-stacked-layouts",
    label: "Stacked Layouts",
    path: ["Plus", "UI Blocks", "Application UI", "Application Shells", "Stacked Layouts"],
    termIds: ["app-shell", "top-app-bar", "navigation-bar"],
  },
  {
    id: "plus-application-shells-sidebar-layouts",
    label: "Sidebar Layouts",
    path: ["Plus", "UI Blocks", "Application UI", "Application Shells", "Sidebar Layouts"],
    termIds: ["sidebar-dashboard-layout", "sidebar-nav", "navigation-rail"],
  },
  {
    id: "plus-application-shells-multi-column-layouts",
    label: "Multi-Column Layouts",
    path: ["Plus", "UI Blocks", "Application UI", "Application Shells", "Multi-Column Layouts"],
    termIds: ["split-pane", "resizable-panel", "inspector-panel"],
  },
  {
    id: "plus-application-headings",
    label: "Headings",
    path: ["Plus", "UI Blocks", "Application UI", "Headings"],
    termIds: ["typography", "section", "breadcrumb-header"],
  },
  {
    id: "plus-application-headings-page-headings",
    label: "Page Headings",
    path: ["Plus", "UI Blocks", "Application UI", "Headings", "Page Headings"],
    termIds: ["typography", "breadcrumb-header", "section"],
  },
  {
    id: "plus-application-headings-card-headings",
    label: "Card Headings",
    path: ["Plus", "UI Blocks", "Application UI", "Headings", "Card Headings"],
    termIds: ["card", "profile-card", "price-card"],
  },
  {
    id: "plus-application-headings-section-headings",
    label: "Section Headings",
    path: ["Plus", "UI Blocks", "Application UI", "Headings", "Section Headings"],
    termIds: ["section", "typography", "divider"],
  },
  {
    id: "plus-application-headings-table-headings",
    label: "Table Headings",
    path: ["Plus", "UI Blocks", "Application UI", "Headings", "Table Headings"],
    termIds: ["data-table-toolbar", "table", "filter-bar"],
  },
  {
    id: "plus-application-lists",
    label: "Lists",
    path: ["Plus", "UI Blocks", "Application UI", "Lists"],
    groupIds: ["data-tables-lists", "data-timeline-history", "data-people-integrations"],
    termIds: ["activity-feed", "team-member-row", "table", "data-table-toolbar"],
  },
  {
    id: "plus-application-lists-stacked-lists",
    label: "Stacked Lists",
    path: ["Plus", "UI Blocks", "Application UI", "Lists", "Stacked Lists"],
    termIds: ["activity-feed", "team-member-row", "detail-row"],
  },
  {
    id: "plus-application-lists-tables",
    label: "Tables",
    path: ["Plus", "UI Blocks", "Application UI", "Lists", "Tables"],
    termIds: ["table", "data-table-toolbar", "pagination"],
  },
  {
    id: "plus-application-lists-grid-lists",
    label: "Grid Lists",
    path: ["Plus", "UI Blocks", "Application UI", "Lists", "Grid Lists"],
    termIds: ["card", "profile-card", "product-card"],
  },
  {
    id: "plus-application-lists-feeds",
    label: "Feeds",
    path: ["Plus", "UI Blocks", "Application UI", "Lists", "Feeds"],
    termIds: ["activity-feed", "toast-stack", "notification-list"],
  },
  {
    id: "plus-application-elements",
    label: "Elements",
    path: ["Plus", "UI Blocks", "Application UI", "Elements"],
    termIds: ["avatar", "badge", "dropdown-menu", "button", "button-group"],
  },
  {
    id: "plus-application-elements-avatars",
    label: "Avatars",
    path: ["Plus", "UI Blocks", "Application UI", "Elements", "Avatars"],
    termIds: ["avatar", "avatar-group", "status-avatar"],
  },
  {
    id: "plus-application-elements-badges",
    label: "Badges",
    path: ["Plus", "UI Blocks", "Application UI", "Elements", "Badges"],
    termIds: ["badge", "badge-group", "role-badge"],
  },
  {
    id: "plus-application-elements-dropdowns",
    label: "Dropdowns",
    path: ["Plus", "UI Blocks", "Application UI", "Elements", "Dropdowns"],
    termIds: ["dropdown-menu", "breadcrumbs-menu", "account-switcher"],
  },
  {
    id: "plus-application-elements-buttons",
    label: "Buttons",
    path: ["Plus", "UI Blocks", "Application UI", "Elements", "Buttons"],
    termIds: ["button", "icon-button", "bottom-cta-bar"],
  },
  {
    id: "plus-application-elements-button-groups",
    label: "Button Groups",
    path: ["Plus", "UI Blocks", "Application UI", "Elements", "Button Groups"],
    termIds: ["button-group", "segmented-control", "social-login-button-group"],
  },
  {
    id: "plus-application-layout",
    label: "Layout",
    path: ["Plus", "UI Blocks", "Application UI", "Layout"],
    termIds: ["container", "split-pane", "divider"],
  },
  {
    id: "plus-application-layout-containers",
    label: "Containers",
    path: ["Plus", "UI Blocks", "Application UI", "Layout", "Containers"],
    termIds: ["container", "section", "dashboard-grid"],
  },
  {
    id: "plus-application-layout-cards",
    label: "Cards",
    path: ["Plus", "UI Blocks", "Application UI", "Layout", "Cards"],
    termIds: ["card", "profile-card", "price-card"],
  },
  {
    id: "plus-application-layout-list-containers",
    label: "List containers",
    path: ["Plus", "UI Blocks", "Application UI", "Layout", "List containers"],
    termIds: ["activity-feed", "table", "data-table-toolbar"],
  },
  {
    id: "plus-application-layout-media-objects",
    label: "Media Objects",
    path: ["Plus", "UI Blocks", "Application UI", "Layout", "Media Objects"],
    termIds: ["avatar", "profile-card", "team-member-row"],
  },
  {
    id: "plus-application-layout-panels",
    label: "Panels",
    path: ["Plus", "UI Blocks", "Application UI", "Layout", "Panels"],
    termIds: ["split-pane", "resizable-panel", "properties-panel"],
  },
  {
    id: "plus-application-layout-dividers",
    label: "Dividers",
    path: ["Plus", "UI Blocks", "Application UI", "Layout", "Dividers"],
    termIds: ["divider", "section", "container"],
  },
  {
    id: "plus-application-page-examples",
    label: "Page Examples",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples"],
    termIds: ["dashboard-overview-page", "settings-page-layout", "login-page", "onboarding-flow-page"],
  },
  {
    id: "plus-application-page-examples-home-screens",
    label: "Home Screens",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Home Screens"],
    termIds: ["dashboard-overview-page", "dashboard-grid", "sidebar-dashboard-layout"],
  },
  {
    id: "plus-application-page-examples-detail-screens",
    label: "Detail Screens",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Detail Screens"],
    termIds: ["detail-row", "description-list", "side-sheet"],
  },
  {
    id: "plus-application-page-examples-settings-screens",
    label: "Settings Screens",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Settings Screens"],
    termIds: ["settings-page-layout", "billing-settings-page", "properties-panel"],
  },
  {
    id: "plus-application-page-examples-dashboards",
    label: "Dashboards",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Dashboards"],
    termIds: ["dashboard-overview-page", "dashboard-grid", "sidebar-dashboard-layout"],
  },
  {
    id: "plus-application-page-examples-settings",
    label: "Settings",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Settings"],
    termIds: ["settings-page-layout", "billing-settings-page", "properties-panel"],
  },
  {
    id: "plus-application-page-examples-detail",
    label: "Detail Pages",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Detail Pages"],
    termIds: ["detail-row", "description-list", "side-sheet"],
  },
  {
    id: "plus-application-page-examples-list",
    label: "List Pages",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "List Pages"],
    termIds: ["data-table-toolbar", "activity-feed", "filter-panel"],
  },
  {
    id: "plus-application-page-examples-auth",
    label: "Auth Pages",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Auth Pages"],
    termIds: ["login-page", "split-auth-layout", "invite-acceptance-screen"],
  },
  {
    id: "plus-application-page-examples-onboarding",
    label: "Onboarding Pages",
    path: ["Plus", "UI Blocks", "Application UI", "Page Examples", "Onboarding Pages"],
    termIds: ["onboarding-flow-page", "welcome-choice-screen", "onboarding-checklist"],
  },
  {
    id: "plus-templates-marketing",
    label: "Marketing Pages",
    path: ["Plus", "Templates", "Marketing Pages"],
    termIds: ["hero", "pricing-section", "testimonial-section"],
  },
  {
    id: "plus-templates-marketing-startup-landing",
    label: "Startup Landing",
    path: ["Plus", "Templates", "Marketing Pages", "Startup Landing"],
    termIds: ["hero", "feature-grid-section", "cta-section"],
  },
  {
    id: "plus-templates-marketing-saas-pricing",
    label: "SaaS Pricing",
    path: ["Plus", "Templates", "Marketing Pages", "SaaS Pricing"],
    termIds: ["pricing-section", "price-card", "plan-card"],
  },
  {
    id: "plus-templates-marketing-company-about",
    label: "Company About",
    path: ["Plus", "Templates", "Marketing Pages", "Company About"],
    termIds: ["testimonial-section", "profile-card", "logo"],
  },
  {
    id: "plus-templates-dashboard",
    label: "Dashboard Screens",
    path: ["Plus", "Templates", "Dashboard Screens"],
    termIds: ["dashboard-overview-page", "settings-page-layout", "billing-settings-page"],
  },
  {
    id: "plus-templates-dashboard-analytics",
    label: "Analytics Dashboard",
    path: ["Plus", "Templates", "Dashboard Screens", "Analytics Dashboard"],
    termIds: ["dashboard-overview-page", "data-table-toolbar", "stat-list"],
  },
  {
    id: "plus-templates-dashboard-settings",
    label: "Settings Console",
    path: ["Plus", "Templates", "Dashboard Screens", "Settings Console"],
    termIds: ["settings-page-layout", "profile-settings-form", "sidebar-nav"],
  },
  {
    id: "plus-templates-dashboard-billing",
    label: "Billing Portal",
    path: ["Plus", "Templates", "Dashboard Screens", "Billing Portal"],
    termIds: ["billing-settings-page", "payment-method-card", "plan-card"],
  },
  {
    id: "plus-templates-auth",
    label: "Auth Screens",
    path: ["Plus", "Templates", "Auth Screens"],
    termIds: ["login-page", "split-auth-layout", "invite-acceptance-screen", "welcome-choice-screen", "consent-review-screen"],
  },
  {
    id: "plus-templates-auth-sign-in",
    label: "Sign-in Suite",
    path: ["Plus", "Templates", "Auth Screens", "Sign-in Suite"],
    termIds: ["login-page", "auth-card", "signup-form"],
  },
  {
    id: "plus-templates-auth-invite",
    label: "Invite Flow",
    path: ["Plus", "Templates", "Auth Screens", "Invite Flow"],
    termIds: ["invite-acceptance-screen", "welcome-choice-screen", "auth-method-choice"],
  },
  {
    id: "plus-templates-auth-consent",
    label: "Consent Review",
    path: ["Plus", "Templates", "Auth Screens", "Consent Review"],
    termIds: ["consent-review-screen", "auth-method-choice", "login-page"],
  },
  {
    id: "plus-templates-ecommerce",
    label: "Ecommerce Screens",
    path: ["Plus", "Templates", "Ecommerce Screens"],
    termIds: ["billing-settings-page", "order-status"],
  },
  {
    id: "plus-templates-ecommerce-storefront",
    label: "Storefront Kit",
    path: ["Plus", "Templates", "Ecommerce Screens", "Storefront Kit"],
    termIds: ["product-card", "price-card", "bottom-cta-bar"],
  },
  {
    id: "plus-templates-ecommerce-checkout",
    label: "Checkout Flow",
    path: ["Plus", "Templates", "Ecommerce Screens", "Checkout Flow"],
    termIds: ["checkout-step", "checkout-progress-header", "payment-method-card"],
  },
  {
    id: "plus-templates-ecommerce-orders",
    label: "Order Account",
    path: ["Plus", "Templates", "Ecommerce Screens", "Order Account"],
    termIds: ["order-status", "cart-summary", "billing-settings-page"],
  },
  {
    id: "plus-templates-onboarding",
    label: "Onboarding Screens",
    path: ["Plus", "Templates", "Onboarding Screens"],
    termIds: ["onboarding-flow-page", "welcome-choice-screen", "consent-review-screen"],
  },
  {
    id: "plus-templates-onboarding-setup",
    label: "Setup Wizard",
    path: ["Plus", "Templates", "Onboarding Screens", "Setup Wizard"],
    termIds: ["onboarding-flow-page", "onboarding-checklist", "progress-stepper"],
  },
  {
    id: "plus-templates-onboarding-welcome",
    label: "Welcome Flow",
    path: ["Plus", "Templates", "Onboarding Screens", "Welcome Flow"],
    termIds: ["welcome-choice-screen", "auth-method-choice", "onboarding-pager"],
  },
  {
    id: "plus-templates-onboarding-consent",
    label: "Consent Setup",
    path: ["Plus", "Templates", "Onboarding Screens", "Consent Setup"],
    termIds: ["consent-review-screen", "onboarding-flow-page", "progress-stepper"],
  },
  {
    id: "plus-templates-products",
    label: "Template Products",
    path: ["Plus", "Templates", "Template Products"],
    termIds: ["hero", "dashboard-overview-page", "data-table-toolbar", "onboarding-flow-page", "product-card"],
  },
  {
    id: "plus-templates-catalyst",
    label: "Catalyst UI Kit",
    path: ["Plus", "Templates", "Template Products", "Catalyst UI Kit"],
    termIds: ["button", "text-field", "data-table-toolbar"],
  },
  {
    id: "plus-templates-oatmeal",
    label: "Oatmeal",
    path: ["Plus", "Templates", "Template Products", "Oatmeal"],
    termIds: ["hero", "pricing-section", "testimonial-section"],
  },
  {
    id: "plus-templates-radiant",
    label: "Radiant",
    path: ["Plus", "Templates", "Template Products", "Radiant"],
    termIds: ["hero", "feature-grid-section", "cta-section"],
  },
  {
    id: "plus-templates-spotlight",
    label: "Spotlight",
    path: ["Plus", "Templates", "Template Products", "Spotlight"],
    termIds: ["profile-card", "testimonial-section", "content-tabs"],
  },
  {
    id: "plus-templates-salient",
    label: "Salient",
    path: ["Plus", "Templates", "Template Products", "Salient"],
    termIds: ["hero", "feature-grid-section", "pricing-section"],
  },
  {
    id: "plus-templates-protocol",
    label: "Protocol",
    path: ["Plus", "Templates", "Template Products", "Protocol"],
    termIds: ["sidebar-nav", "table", "content-tabs"],
  },
  {
    id: "plus-templates-commit",
    label: "Commit",
    path: ["Plus", "Templates", "Template Products", "Commit"],
    termIds: ["activity-feed", "timeline", "badge"],
  },
  {
    id: "plus-templates-compass",
    label: "Compass",
    path: ["Plus", "Templates", "Template Products", "Compass"],
    termIds: ["dashboard-overview-page", "data-table-toolbar", "sidebar-nav"],
  },
  {
    id: "plus-templates-primer",
    label: "Primer",
    path: ["Plus", "Templates", "Template Products", "Primer"],
    termIds: ["content-tabs", "pricing-section", "faq-list"],
  },
  {
    id: "plus-templates-studio",
    label: "Studio",
    path: ["Plus", "Templates", "Template Products", "Studio"],
    termIds: ["team-member-row", "logo", "testimonial-section"],
  },
  {
    id: "plus-templates-transmit",
    label: "Transmit",
    path: ["Plus", "Templates", "Template Products", "Transmit"],
    termIds: ["media-card", "content-tabs", "cta-section"],
  },
  {
    id: "plus-templates-pocket",
    label: "Pocket",
    path: ["Plus", "Templates", "Template Products", "Pocket"],
    termIds: ["hero", "feature-grid-section", "bottom-cta-bar"],
  },
  {
    id: "plus-templates-syntax",
    label: "Syntax",
    path: ["Plus", "Templates", "Template Products", "Syntax"],
    termIds: ["sidebar-nav", "table", "content-tabs"],
  },
  {
    id: "plus-templates-keynote",
    label: "Keynote",
    path: ["Plus", "Templates", "Template Products", "Keynote"],
    termIds: ["hero", "timeline", "profile-card"],
  },
  {
    id: "plus-ui-kit",
    label: "UI Kit",
    path: ["Plus", "UI Kit"],
    termIds: ["button", "text-field", "dialog", "data-table-toolbar", "glassmorphism", "marquee-row"],
  },
  {
    id: "plus-ui-kit-component-docs",
    label: "Component Docs",
    path: ["Plus", "UI Kit", "Component Docs"],
    termIds: ["button", "text-field", "table", "sidebar-nav", "checkbox", "combobox", "radio-group", "switch", "description-list", "badge", "pagination", "dialog", "divider", "textarea"],
  },
  {
    id: "plus-ui-kit-components",
    label: "Components",
    path: ["Plus", "UI Kit", "Components"],
    kinds: ["component"],
  },
  {
    id: "plus-ui-kit-controls",
    label: "Controls",
    path: ["Plus", "UI Kit", "Controls"],
    termIds: ["button", "icon-button", "checkbox", "radio-group", "switch", "slider", "segmented-control", "focus-ring"],
  },
  {
    id: "plus-ui-kit-forms",
    label: "Forms",
    path: ["Plus", "UI Kit", "Forms"],
    groupIds: ["input-text", "input-pickers", "input-file-media", "input-editing", "input-auth-forms"],
  },
  {
    id: "plus-ui-kit-navigation",
    label: "Navigation",
    path: ["Plus", "UI Kit", "Navigation"],
    groupIds: ["selection-navigation", "selection-menus", "structure-navigation"],
    termIds: ["command-palette"],
  },
  {
    id: "plus-ui-kit-overlays",
    label: "Overlays",
    path: ["Plus", "UI Kit", "Overlays"],
    termIds: ["dialog", "popover", "tooltip", "drawer", "side-sheet", "modal-bottom-sheet"],
  },
  {
    id: "plus-ui-kit-data-display",
    label: "Data Display",
    path: ["Plus", "UI Kit", "Data Display"],
    groupIds: ["data-tables-lists", "data-metrics-charts", "data-basic-content-elements"],
  },
  {
    id: "plus-ui-kit-layout",
    label: "Layout",
    path: ["Plus", "UI Kit", "Layout"],
    groupIds: ["structure-panels", "structure-app-layout", "structure-sidebar-layouts"],
  },
  {
    id: "plus-ui-kit-feedback",
    label: "Feedback",
    path: ["Plus", "UI Kit", "Feedback"],
    groupIds: ["feedback-alerts-toasts", "feedback-loading-progress", "feedback-empty-error", "feedback-status-notifications"],
  },
  {
    id: "plus-ui-kit-blocks",
    label: "Blocks",
    path: ["Plus", "UI Kit", "Blocks"],
    kinds: ["block"],
  },
  {
    id: "plus-ui-kit-form-patterns",
    label: "Form Patterns",
    path: ["Plus", "UI Kit", "Form Patterns"],
    kinds: ["form-pattern"],
  },
  {
    id: "plus-ui-kit-visual-effects",
    label: "Visual Effects",
    path: ["Plus", "UI Kit", "Visual Effects"],
    kinds: ["visual-effect"],
  },
  {
    id: "plus-ui-kit-motion-patterns",
    label: "Motion Patterns",
    path: ["Plus", "UI Kit", "Motion Patterns"],
    kinds: ["motion-pattern"],
  },
  {
    id: "plus-ui-kit-visual-treatments",
    label: "Visual Treatments",
    path: ["Plus", "UI Kit", "Visual Treatments"],
    kinds: ["visual-treatment"],
  },
]

export function navFilter(id: NavigationCollectionId): NavigationFilter {
  return `nav:${id}`
}

export function isNavigationFilter(value: string): value is NavigationFilter {
  return normalizeNavigationFilter(value) !== null
}

export function getNavigationCollection(filter: NavigationFilter) {
  const normalizedFilter = normalizeNavigationFilter(filter) ?? filter
  const id = normalizedFilter.slice("nav:".length) as NavigationCollectionId

  return navigationCollections.find((collection) => collection.id === id) ?? null
}

export function getNavigationCollectionLabel(filter: NavigationFilter) {
  const collection = getNavigationCollection(filter)

  return collection ? collection.path.join(" · ") : "현재 탐색"
}
