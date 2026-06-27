# UI Vocabulary Sources

This dataset should be useful to beginners, but definitions should still be traceable. Prefer official design-system and accessibility references over SEO glossary pages.

## Trust Tiers

### Tier A — Primary Definition Sources

Use these for canonical names, core definitions, interaction behavior, and accessibility expectations.

- `wai-aria-apg-patterns`: W3C WAI-ARIA Authoring Practices Guide patterns  
  https://www.w3.org/WAI/ARIA/apg/patterns/
- `material-m3-components`: Material Design 3 components  
  https://m3.material.io/components
- `apple-hig-components`: Apple Human Interface Guidelines components  
  https://developer.apple.com/design/human-interface-guidelines/components
- `fluent2-react-components`: Microsoft Fluent 2 React components  
  https://fluent2.microsoft.design/components/web/react/
- `uswds-components`: U.S. Web Design System components  
  https://designsystem.digital.gov/components/
- `radix-ui-primitives`: Radix UI primitives  
  https://www.radix-ui.com/primitives
- `shadcn-ui-docs`: shadcn/ui component documentation  
  https://ui.shadcn.com/docs/components

### Tier B — Secondary Cross-Checks

Use these to compare naming, categories, variants, and implementation examples.

- `mui-material-components`: MUI Material UI components  
  https://mui.com/material-ui/all-components/
- `chakra-ui-components`: Chakra UI components  
  https://chakra-ui.com/docs/components
- `carbon-design-components`: IBM Carbon Design System components  
  https://carbondesignsystem.com/components/overview/
- `atlassian-design-components`: Atlassian Design System components  
  https://atlassian.design/components/
- `shopify-polaris-components`: Shopify Polaris components  
  https://polaris.shopify.com/components
- `github-primer-components`: GitHub Primer components  
  https://primer.style/components
- `govuk-design-system-components`: GOV.UK Design System components  
  https://design-system.service.gov.uk/components/

### Tier C — Component Gallery And Pattern Libraries

Use these to discover missing terms, alternate names, and how component
families are grouped across products. Cross-check important definitions against
Tier A or B before promoting a term.

- `component-gallery`: Component Gallery  
  https://component.gallery/
- `coss-ui-docs`: coss ui and legacy Origin UI component/particle examples
  https://coss.com/ui
- `blocks-so-library`: blocks.so and adjacent shadcn block ecosystem examples
  https://blocks.so/
- `magic-ui-docs`: Magic UI animated components and effects
  https://magicui.design/
- `aceternity-ui-docs`: Aceternity UI landing, motion, and card components
  https://ui.aceternity.com/
- `ui-patterns-library`: UI Patterns  
  https://ui-patterns.com/patterns
- `design-systems-repo`: Design Systems Repo  
  https://designsystemsrepo.com/design-systems/

### Tier D — Mobile And Product Flow References

Use these for mobile-specific patterns, real product examples, and flow-level UX
vocabulary. They are especially useful for candidate discovery, not canonical
definition.

- `mobbin-mobile-patterns`: Mobbin mobile app screenshots and patterns  
  https://mobbin.com/browse/ios/apps
- `page-flows`: Page Flows user flow references  
  https://pageflows.com/
- `uxarchive`: UXArchive mobile flows  
  https://uxarchive.com/
- `pttrns-mobile-patterns`: Pttrns mobile design patterns  
  https://pttrns.com/

### Tier E — Alias And Teaching Sources

Use these only for beginner wording, common aliases, and explanatory examples. Do not let them override Tier A definitions.

- UX education sites and glossaries
- Product design blogs
- Community discussions
- Real product screenshots

## Conflict Rules

- Accessibility behavior wins over visual naming when a component is interactive.
- Platform-specific names stay as aliases unless the term is explicitly platform-only.
- If Material, Apple, Fluent, and APG use different words for the same visible concept, keep separate entries only when behavior differs.
- When conflict remains, mark the term `status: draft` and add a `related` comparison note.

## Starter Collection Queries

- `UI component glossary button input modal tooltip toast`
- `design system components input selection feedback data display`
- `WAI ARIA APG combobox dialog tabs accordion`
- `Material Design components text field dialog snackbar navigation drawer`
- `Fluent 2 React components button menu dialog tooltip`
- `Apple Human Interface Guidelines controls components`
- `Component Gallery UI component names examples`
- `Mobbin mobile filter sort bottom sheet UI pattern`
- `Page Flows onboarding checkout search user flow`
- `Pttrns mobile navigation empty state filter pattern`
