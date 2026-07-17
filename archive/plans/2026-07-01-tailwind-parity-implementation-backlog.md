# Tailwind parity implementation backlog

Date: 2026-07-01
Reference: Tailwind CSS / Tailwind Plus public structure

## Goal

Bring UI Dictionary close to the Tailwind Plus catalog model:

- Docs explains concepts and implementation vocabulary.
- Plus is a browsable product catalog.
- Every major Plus nav item should have a standalone page.
- Page examples should show realistic previews first, then link back to terms.
- Card-grid encyclopedia surfaces should not be the primary navigation model.

## Current Completed Surface

- Docs / Plus split exists.
- Plus sidebar uses a static Tailwind-like hierarchy instead of accordions.
- Term detail is one page per term.
- Result lists use rows instead of `TermCard`.
- Marketing tree implemented:
  Page Sections, Elements, Feedback, and Page Examples currently visible in the sidebar all open standalone pages.
- Application UI high-level pages implemented:
  Application Shells, Data Display, Forms, Navigation, Overlays, Feedback.
- Application UI Forms depth implemented:
  Form Layouts, Input Groups, Select Menus, Sign-in and Registration, Textareas,
  Radio Groups, Checkboxes, Toggles, Action Panels, Comboboxes.
- Application UI Data Display depth implemented:
  Description Lists, Stats, Calendars, Lists, Tables.
- Application UI Navigation depth implemented:
  Navbars, Tabs, Breadcrumbs, Pagination, Command Menus, Sidebars.
- Application UI Overlays depth implemented:
  Modals, Drawers, Slide-overs, Popovers.
- Application UI Feedback depth implemented:
  Alerts, Empty States, Progress, Skeletons, Toasts.
- Application UI remaining depth implemented:
  Application Shells (Stacked Layouts, Sidebar Layouts, Multi-column Layouts),
  Headings (Page Headings, Section Headings, Table Headings),
  Elements (Avatars, Badges, Dropdowns, Buttons, Button Groups),
  Layout (Containers, Panels, Dividers),
  Page Examples (Dashboards, Settings, Detail Pages, List Pages, Auth Pages, Onboarding Pages).
- Ecommerce parity implemented:
  Components (Product Overviews, Product Lists, Category Previews, Shopping Carts, Category Filters,
  Product Quickviews, Product Features, Store Navigation, Promo Sections, Checkout Forms, Reviews,
  Order Summaries, Order History) and Page Examples (Storefront, Product Page, Category Page, Cart,
  Checkout, Order Detail).
- Templates parity implemented:
  Marketing Pages (Startup Landing, SaaS Pricing, Company About),
  Dashboard Screens (Analytics Dashboard, Settings Console, Billing Portal),
  Auth Screens (Sign-in Suite, Invite Flow, Consent Review),
  Ecommerce Screens (Storefront Kit, Checkout Flow, Order Account),
  Onboarding Screens (Setup Wizard, Welcome Flow, Consent Setup).
- UI Kit parity implemented:
  Overview plus component-system pages for Controls, Forms, Navigation, Overlays, Data Display,
  Layout, Feedback, Visual Treatments, and Motion Patterns. Each page explains component
  vocabulary through usage notes, states, previews, tags, and representative term links.

## Remaining Parity Backlog

### P0 - Marketing completion - done

Finished the currently modeled Tailwind Marketing tree before expanding other areas.

Definition of done:

- Each nav item opens a standalone page.
- Each page has breadcrumb, heading, explanation, three examples, preview variants, tags, and term links.
- Existing terms are reused where possible; add new terms only when no representative term exists.

### P1 - Application UI depth

Split the broad Application UI pages into Tailwind-like subpages.

Status: done for the currently modeled Application UI tree.

Definition of done:

- The sidebar can drill past the current six broad buckets.
- Current high-level pages remain as overview pages.
- Subpages reuse the same catalog-page renderer.

### P2 - Ecommerce parity

Build the Ecommerce tree as its own substantial catalog.

Status: done for the currently modeled Ecommerce tree.

Definition of done:

- Ecommerce no longer behaves like a small term list.
- Commerce previews show realistic product, cart, checkout, and order states.

### P3 - Templates parity

Reframe Templates from internal screen buckets into named complete products or page kits.

Status: done for the currently modeled Templates tree.

Definition of done:

- Templates feel like complete starting points, not just filtered term lists.

### P4 - UI Kit parity

Make UI Kit a component-system surface rather than a navigation label.

Status: done for the currently modeled UI Kit tree.

Definition of done:

- UI Kit explains reusable component vocabulary and states.
- It complements Docs and Plus rather than duplicating them.

## Stop Points

- Stop before production deploy only.
- Do not stop for local implementation batches unless build, validator, or Chrome smoke fails.
- If a Tailwind category has no matching local term, prefer a small representative term addition over leaving the page empty.

## Immediate Execution Order

Completed through P4 for the currently modeled Tailwind parity tree.
