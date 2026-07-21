# Around Template System Capture

Date: 2026-07-04
Source: `https://around.createx.studio/`

## Purpose

Around by Createx Studio is a multipurpose Bootstrap template reference. It is useful for `ui-dictionary` because it packages a broad set of product surfaces into one commercial template system:

- landing pages;
- inner pages;
- shop and checkout;
- account flows;
- UI Kit;
- docs;
- theme customizer;
- Figma/package positioning.

This makes Around a different reference from Tailwind Plus. Tailwind Plus is strong for component/page-section pedagogy. Around is strong for breadth, packaged template navigation, theme customization, and commercial product positioning.

## Evidence

Capture root: `docs/research/assets/around-template-system-2026-07-04/`

| Page | URL | Evidence | Notes |
| --- | --- | --- | --- |
| Home / template catalog | `https://around.createx.studio/` | `around-home-fullpage.png`, `home-viewport.png`, `around-home-dom-summary.json` | Full catalog navigation, landing grid, inner pages, customizer, feature claims. |
| SaaS v4 | `https://around.createx.studio/landing-saas-v4.html` | `saas-v4-fullpage.png`, `saas-v4-viewport.png` | AI/SaaS landing example with industry cards and conversion-oriented sections. |
| Shop checkout | `https://around.createx.studio/shop-checkout.html` | `shop-checkout-fullpage.png`, `shop-checkout-viewport.png` | Checkout flow with shipping, method, payment, and order summary. |
| Account overview | `https://around.createx.studio/account-overview.html` | `account-overview-viewport.png` | Account dashboard/profile/settings-style internal surface. |
| UI Kit typography | `https://around.createx.studio/components/typography.html` | `ui-kit-typography-viewport.png` | UI Kit docs with content/components/utilities navigation. |
| Docs getting started | `https://around.createx.studio/docs/getting-started.html` | `docs-getting-started-viewport.png` | Template documentation, prerequisites, and static HTML/Bootstrap positioning. |
| Target page summary | captured DOM summaries | `around-target-pages-summary.json` | Headings, navigation, controls, images, and overflow measurements. |

Browser method:

- Existing open Chrome tab was reused.
- No new Chrome tab or window was created.
- Chrome extension backend captured screenshots and DOM summaries.
- Viewport captures for all six target pages showed `overflow=0`.

## Observed IA

Around's top navigation exposes the template as a product catalog:

```text
Around
├── Landings
│   ├── Mobile App Showcase
│   ├── Product Landing
│   ├── SaaS v.1
│   ├── SaaS v.2
│   ├── SaaS v.3
│   ├── SaaS v.4
│   ├── Shop Homepage v.1
│   ├── Shop Homepage v.2
│   ├── Marketing Agency
│   ├── Creative Agency
│   ├── Conference / Event
│   ├── Web Studio
│   ├── Corporate
│   ├── Insurance Company
│   ├── Business Consulting
│   ├── Coworking Space
│   ├── Yoga Studio
│   ├── Influencer
│   └── Blog Homepage
├── Pages
│   ├── Portfolio
│   ├── Shop
│   ├── Blog
│   ├── About
│   ├── Services
│   ├── Pricing
│   ├── Contacts
│   └── Specialty Pages
├── Account
│   ├── Auth pages
│   ├── Overview
│   ├── Settings
│   ├── Billing
│   ├── Orders
│   ├── Earnings
│   ├── Chat
│   └── Favorites
├── UI Kit
└── Docs
```

## Template-System Model

Around suggests a template-system model with five layers:

1. **Catalog layer**: top-level preview of available page families.
2. **Surface layer**: landing, shop, blog, account, docs, UI Kit.
3. **Page layer**: concrete pages like checkout, account overview, SaaS landing.
4. **Customization layer**: color, typography, border/radius controls.
5. **Package layer**: Bootstrap, Sass, npm scripts, JavaScript, W3C validation, Figma file, touch support, fonts, icons.

This is useful because Yusung's system also needs to become a packaged product, not only a visual gallery.

## Surface Mapping

| Around surface | Yusung taxonomy mapping | Design-system lesson |
| --- | --- | --- |
| Mobile App Showcase | Mobile Apps + Websites | Mobile products can be represented through landing pages before native app screens exist. |
| SaaS v1-v4 | SaaS And Dashboards + Websites | SaaS marketing pages need multiple narrative styles, not one generic hero. |
| Shop homepage / catalog / product / checkout | Commerce | Commerce references need both browse surfaces and transactional flows. |
| Portfolio / Blog / Services / About / Pricing / Contacts | Websites | A template system should cover common business-site inner pages, not only homepages. |
| Account overview/settings/billing/orders/chat | Internal Tools + SaaS | Account surfaces bridge public product and authenticated app UI. |
| UI Kit | Components And Primitives + Foundations | Public components need docs/navigation beyond isolated examples. |
| Docs | Documentation And Learning | Template docs are part of the product package. |
| Customizer | Foundations + Agent Recipes | Color/type/radius controls can become token-editing or promptable design knobs. |

## Customizer Model

The homepage exposes a visible theme customizer with:

- primary/warning/info/success/danger colors;
- Google font URL and font family;
- root and body font size;
- border width;
- base radius and radius multipliers;
- generated custom styles that must be placed after the theme CSS.

### Transferable Customizer Principles

- Surface design tokens as editable controls.
- Keep generated styles copyable.
- Separate token customization from page-specific content.
- Include typography and radius, not only color.
- Treat customization as part of the sales/product experience.

### Non-Transferable Customizer Details

- Bootstrap/Sass implementation is not the required stack for this repo.
- Around's exact token names and generated CSS format should not become canonical by default.
- Around's visual identity and commercial template styling should not be copied.

## Page Examples Captured

### SaaS v4

Observed headings include:

- `Powerful AI models to serve your business needs`
- industry categories such as E-commerce, Transportation, Marketing, Robotics, Programming

Transferable:

- SaaS landing can be organized by user industries/use cases.
- AI product messaging benefits from dense category cards plus conversion sections.

### Shop Checkout

Observed headings include:

- `Checkout`
- `Shipping details`
- `Shipping method`
- `Payment method`
- `Order summary`

Transferable:

- Commerce examples need multi-step flow state and persistent summary.
- Checkout is a high-trust surface and should be treated separately from product browsing.

### Account Overview

Observed headings include:

- profile/person identity;
- `Overview`;
- `Basic info`;
- `Address`;
- `Shipping address`.

Transferable:

- Account pages are a missing bridge between marketing templates and app dashboards.
- User settings/account flows deserve first-class taxonomy coverage.

### UI Kit Typography

Observed structure includes content/components/utilities navigation.

Transferable:

- UI Kit docs should distinguish foundation/content, components, and utilities.
- Typography docs are a foundation page, not only visual samples.

### Docs Getting Started

Observed headings include:

- `Getting started`;
- a warning that the template is static HTML/Bootstrap, not WordPress;
- `Prerequisites`;
- `Next steps`.

Transferable:

- Product packages need explicit stack/format boundaries.
- Docs should say what the product is not, not only what it is.

## Comparison With Tailwind Reference Model

| Dimension | Tailwind Plus | Around |
| --- | --- | --- |
| Primary strength | Component/page-section pedagogy and docs depth | Multipurpose commercial template breadth |
| Surface breadth | Marketing, Application UI, Ecommerce, Documentation | Landings, pages, shop, account, UI Kit, docs |
| Customization | Tailwind utility/config mental model | Visible theme customizer with copyable generated CSS |
| Access model | Free/locked examples, Tailwind Plus commercial package | Buy template package, Figma file, Bootstrap/Sass/npm positioning |
| Best lesson for us | How to teach patterns and interactions | How to package many product surfaces as one sellable system |

## Transferable Principles

- A design-system website can present a broad template catalog before exposing implementation details.
- Top navigation should make surface breadth obvious.
- Account/auth/billing/chat/favorites pages should be treated as product surfaces, not afterthoughts.
- Checkout deserves dedicated modeling separate from ecommerce listings.
- A customizer can make tokens feel tangible to non-designers.
- A commercial system should state stack, automation, asset, validation, and Figma/package claims clearly.
- Docs and UI Kit should be shipped as part of the system, not as optional extras.

## Non-Transferable Identity

Do not copy:

- Around's exact template visuals;
- paid source/package content;
- Bootstrap as a required implementation stack;
- Createx/Around brand identity;
- exact page copy or demo content;
- generated CSS format as the canonical token format.

## Agent Asset Model Mapping

| Agent asset entity | Around-derived mapping |
| --- | --- |
| `surface` | Landings, shop, account, UI Kit, docs map directly to public surfaces. |
| `pattern` | Checkout flow, account overview, SaaS landing, template catalog, customizer. |
| `component` | Checkout inputs, account nav, UI Kit primitives, customizer controls. |
| `token_set` | Customizer controls expose colors, typography, radius, border width. |
| `example` | Captured target pages become reference examples with screenshots and DOM summaries. |
| `source_ref` | Around URL + evidence files + observed transferable/non-transferable notes. |
| `code_asset` | No source code copied; future local implementation must be original. |
| `agent_recipe` | Around informs prompts for multipurpose template breadth and token customization. |

## Implementation Targets For This Repo

Near-term:

- Add `template-system` as a reference/source type.
- Add `account` and `auth` as first-class surface tags.
- Add `customizer` as a future foundation/tooling pattern.
- Use Around's IA breadth when designing the public site structure.

Later:

- Build an original design-system customizer for color, typography, radius, density, and motion.
- Model paid/free asset packaging without copying Around's commercial package.
- Compare Around's UI Kit/docs structure against Tailwind docs and local documentation pages.

## RME2 Completion Check

RME2 is complete when this document:

- captures Around's catalog IA;
- records screenshot/DOM evidence;
- maps Around surfaces to Yusung taxonomy;
- explains customizer and package lessons;
- separates transferable principles from non-transferable identity;
- maps Around into the agent asset model.
