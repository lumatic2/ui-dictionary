# Tailwind Plus Documentation Depth Ledger

Date: 2026-07-03
Phase: `tailwind-plus-documentation-depth`

## Scope

Reference root: `https://tailwindcss.com/plus/ui-blocks/documentation`

This ledger tracks the Tailwind Plus Documentation leaf pages that must be
matched for structure and depth with original UI Dictionary content. It is not a
source-code or prose-copy ledger.

## Capture Method

- Desktop viewport: Playwright Chromium, `1440 x 1000`, full-page screenshot.
- Mobile viewport: Playwright Chromium, `390 x 900`, full-page screenshot.
- Metadata source:
  `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/playwright-reference-meta.json`
- Chrome extension control was used to verify the live reference surface before
  switching to fixed-viewport Playwright capture. Chrome's extension backend did
  not expose a reliable viewport switch for 390px screenshots.

## Reference Rows

| Group | Leaf | Tailwind URL | Local nav id | Desktop reference | Mobile reference | Reference structure | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Getting started | Getting set up | `https://tailwindcss.com/plus/ui-blocks/documentation` | `docs-getting-started-setup` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/getting-set-up-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/getting-set-up-mobile.png` | Requirements, Inter font, dark mode, on-this-page rail, setup code blocks | captured |
| Getting started | Using HTML | `https://tailwindcss.com/plus/ui-blocks/documentation/using-html` | `docs-getting-started-html` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/using-html-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/using-html-mobile.png` | Dependency install, component creation, framework-free usage, code blocks | captured |
| Getting started | Using React | `https://tailwindcss.com/plus/ui-blocks/documentation/using-react` | `docs-getting-started-react` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/using-react-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/using-react-mobile.png` | Dependency install, React component creation, composition notes, code blocks | captured |
| Getting started | Using Vue | `https://tailwindcss.com/plus/ui-blocks/documentation/using-vue` | `docs-getting-started-vue` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/using-vue-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/using-vue-mobile.png` | Dependency install, Vue component creation, composition notes, code blocks | captured |
| Getting started | Assets | `https://tailwindcss.com/plus/ui-blocks/documentation/assets` | `docs-getting-started-assets` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/assets-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/assets-mobile.png` | Icons, images, illustrations, Figma assets, asset governance | captured |
| Elements | Introduction | `https://tailwindcss.com/plus/ui-blocks/documentation/elements` | `docs-elements-introduction` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/introduction-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/introduction-mobile.png` | Available components, browser support, project install, CDN usage | captured |
| Elements | Autocomplete | `https://tailwindcss.com/plus/ui-blocks/documentation/autocomplete` | `docs-elements-autocomplete` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/autocomplete-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/autocomplete-mobile.png` | Component API, options, option rows, examples, API tables | captured |
| Elements | Command palette | `https://tailwindcss.com/plus/ui-blocks/documentation/command-palette` | `docs-elements-command-palette` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/command-palette-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/command-palette-mobile.png` | Component API, command list, defaults, grouped examples, API tables | captured |
| Elements | Copy button | `https://tailwindcss.com/plus/ui-blocks/documentation/copy-button` | `docs-elements-copy-button` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/copy-button-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/copy-button-mobile.png` | Copyable wrapper, button behavior, examples, API tables | captured |
| Elements | Dialog | `https://tailwindcss.com/plus/ui-blocks/documentation/dialog` | `docs-elements-dialog` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/dialog-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/dialog-mobile.png` | Dialog API, native dialog, backdrop, panels, focus behavior, API tables | captured |
| Elements | Disclosure | `https://tailwindcss.com/plus/ui-blocks/documentation/disclosure` | `docs-elements-disclosure` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/disclosure-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/disclosure-mobile.png` | Disclosure API, button, examples, open/closed state, API tables | captured |
| Elements | Dropdown menu | `https://tailwindcss.com/plus/ui-blocks/documentation/dropdown-menu` | `docs-elements-dropdown-menu` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/dropdown-menu-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/dropdown-menu-mobile.png` | Dropdown API, menu, item grouping, examples, API tables | captured |
| Elements | Popover | `https://tailwindcss.com/plus/ui-blocks/documentation/popover` | `docs-elements-popover` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/popover-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/popover-mobile.png` | Popover API, popover group, trigger button, examples, API tables | captured |
| Elements | Select | `https://tailwindcss.com/plus/ui-blocks/documentation/select` | `docs-elements-select` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/select-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/select-mobile.png` | Select API, options, option rows, examples, API tables | captured |
| Elements | Tabs | `https://tailwindcss.com/plus/ui-blocks/documentation/tabs` | `docs-elements-tabs` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/tabs-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/tabs-mobile.png` | Tab group, tab list, tab panels, compact API table | captured |

## Content Depth Requirements For Local Pages

- Getting started pages should have setup flow, local integration guidance,
  code/prompt examples, pitfalls, and next-page links.
- Element pages should have anatomy, state model, keyboard/focus behavior,
  example usage, anti-patterns, related terms, and API/state tables where useful.
- Pages with API-table-heavy references should not be reduced to prose only.
- Pages with examples should include local examples that teach the UI Dictionary
  vocabulary, not Tailwind source implementation details.

## Capture Completeness

- Reference leaves: 15 / 15 captured.
- Desktop screenshots: 15 / 15 captured.
- Mobile screenshots: 15 / 15 captured.
- Mobile horizontal overflow in captured references: 0 pages.

## Local Implementation Evidence

### Step 2 - Getting started pages

Local capture root:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/`

| Leaf | Local desktop | Local mobile | Result |
| --- | --- | --- | --- |
| Getting set up | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/getting-set-up-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/getting-set-up-mobile.png` | article rendered, no fallback, no overflow |
| Using HTML | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/using-html-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/using-html-mobile.png` | article rendered, no fallback, no overflow |
| Using React | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/using-react-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/using-react-mobile.png` | article rendered, no fallback, no overflow |
| Using Vue | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/using-vue-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/using-vue-mobile.png` | article rendered, no fallback, no overflow |
| Assets | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/assets-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/assets-mobile.png` | article rendered, no fallback, no overflow |

Smoke metadata:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step2/smoke-meta.json`

### Step 3 - Elements batch A

Local capture root:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/`

| Leaf | Local desktop | Local mobile | Result |
| --- | --- | --- | --- |
| Introduction | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/introduction-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/introduction-mobile.png` | article rendered, no fallback, no overflow |
| Autocomplete | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/autocomplete-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/autocomplete-mobile.png` | article rendered, no fallback, no overflow |
| Command palette | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/command-palette-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/command-palette-mobile.png` | article rendered, no fallback, no overflow |
| Copy button | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/copy-button-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/copy-button-mobile.png` | article rendered, no fallback, no overflow |
| Dialog | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/dialog-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/dialog-mobile.png` | article rendered, no fallback, no overflow |

Smoke metadata:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step3/smoke-meta.json`

### Step 4 - Elements batch B

Local capture root:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/`

| Leaf | Local desktop | Local mobile | Result |
| --- | --- | --- | --- |
| Disclosure | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/disclosure-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/disclosure-mobile.png` | article rendered, no fallback, no overflow |
| Dropdown menu | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/dropdown-menu-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/dropdown-menu-mobile.png` | article rendered, no fallback, no overflow |
| Popover | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/popover-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/popover-mobile.png` | article rendered, no fallback, no overflow |
| Select | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/select-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/select-mobile.png` | article rendered, no fallback, no overflow |
| Tabs | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/tabs-desktop.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/tabs-mobile.png` | article rendered, no fallback, no overflow |

Smoke metadata:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/local-step4/smoke-meta.json`

### Step 5 - Final cross-page QA

Final smoke metadata:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/final-docs-smoke/all-docs-smoke.json`

Result:

- Documentation routes checked: 30 viewport-route combinations.
- Desktop routes: 15 / 15 passed.
- Mobile routes: 15 / 15 passed.
- Article rendering failures: 0.
- Raw search fallback failures: 0.
- Horizontal overflow failures: 0.
- Console errors: 0.
- Topbar search representative check: `Command palette` suggestion opens
  `?filter=nav%3Adocs-elements-command-palette&page=docs`.

## Next Step

This phase is complete. Future docs work should treat
`examples/ui-vocabulary-site/src/lib/documentation-pages.ts` as the local
Documentation content source of truth.

### Step 6 - Element visual correction pass

Correction capture root:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/`

Reason:

- Earlier element pages had page text and API rows, but several leaves did not yet match the Tailwind Plus leaf-page pattern of a large visual example, Component API, Examples, and an On this page outline.
- Autocomplete, Command palette, and Dropdown menu were used as representative visual parity checks because Tailwind's corresponding pages include concrete component previews rather than prose-only documentation.

Implementation changes:

- Added element-specific preview renderers for Autocomplete, Command palette, Copy button, Dialog, Disclosure, Dropdown menu, Popover, Select, and Tabs.
- Added Examples sections across all nine element leaves.
- Added structured Component API subsections for Autocomplete and Command palette.
- Used the generated image asset `examples/ui-vocabulary-site/public/generated/docs/command-palette-bg-1.png` for the Command palette preview background.

Verification:

- `npm run build` passed.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Playwright checked all nine element leaves at desktop and mobile viewports for expected title, element preview DOM, Examples section, Component API section, and horizontal overflow.

| Leaf | Desktop | Mobile | Result |
| --- | --- | --- | --- |
| Autocomplete | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-autocomplete.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-autocomplete.png` | preview, API, examples, no overflow |
| Command palette | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-command-palette.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-command-palette.png` | preview, API, examples, no overflow |
| Copy button | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-copy-button.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-copy-button.png` | preview, API, examples, no overflow |
| Dialog | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-dialog.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-dialog.png` | preview, API, examples, no overflow |
| Disclosure | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-disclosure.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-disclosure.png` | preview, API, examples, no overflow |
| Dropdown menu | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-dropdown-menu.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-dropdown-menu.png` | preview, API, examples, no overflow |
| Popover | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-popover.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-popover.png` | preview, API, examples, no overflow |
| Select | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-select.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-select.png` | preview, API, examples, no overflow |
| Tabs | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/desktop-tabs.png` | `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/correction-pass/mobile-tabs.png` | preview, API, examples, no overflow |

### Step 7 - Interactive example pass

Interaction capture root:
`docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/`

Reason:

- The Step 6 previews matched the visual structure of Tailwind leaf pages, but they were still mostly static mockups.
- Element examples now behave like small local components: users can type, select, copy, toggle, open/close, and switch tabs inside the documentation preview.

Implemented interactions:

- Autocomplete: type to filter teammates, select an option, close the list, and show selected state.
- Command palette: type to filter commands, select a command, close with Esc button, and reopen the palette.
- Dropdown menu: open/close the menu, choose an action, close after selection, and reopen.
- Copy button: invoke Clipboard API when available and show a temporary Copied state.
- Dialog: cancel, reopen, delete, and show completion state.
- Disclosure: open one row and collapse the previous row.
- Popover: toggle the panel and switch density.
- Select: open options, select a value, and close the list.
- Tabs: switch active tab and update selected panel state.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright interaction smoke exercised all nine element leaves.
- Mobile Playwright interaction smoke exercised Autocomplete, Dropdown menu, Copy button, Select, and Tabs.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-autocomplete-selected.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-command-palette-closed.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-dropdown-menu-reopened.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-copy-button-copied.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-dialog-deleted.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-disclosure-second-open.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-popover-closed.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-select-member.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-tabs-settings.png`

### Step 8 - Dropdown menu anchoring hotfix

Reason:

- The Dropdown menu preview originally kept the menu panel in normal document flow. Closing the panel changed the stage height and made the Options trigger appear to move.
- The selected-state label also overlapped the menu panel after the first fixed-position pass.

Implementation:

- Reworked the Dropdown menu preview stage so the Options trigger, menu panel, and selected-state label are absolutely positioned inside a fixed-size local stage.
- Kept the menu mounted during close and changed its classes between `opacity-100 scale-100 translate-y-0` and `opacity-0 scale-95 -translate-y-2 pointer-events-none`.
- Added `aria-expanded` on the trigger and removed hidden menu items from tab order with `tabIndex={open ? 0 : -1}`.
- Moved the selected-state label below the open menu panel.

Verification:

- `npm run build` passed.
- Playwright measured the Options trigger bounding box in open, closed, reopened, and after-selection states. All four measurements were identical: `x=732.34`, `y=508`, `width=116.16`, `height=42`.
- Playwright confirmed open and closed transition classes are present.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/dropdown-menu-open-fixed-stage.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/interaction-pass/desktop-dropdown-menu-fixed-position.png`

### Step 9 - Element animation polish pass

Reason:

- After the Dropdown menu anchoring fix, the remaining element examples still had several static state changes. The goal was to make every example feel like a small component rather than a click-to-swap mockup.

Implementation:

- Command palette: keeps the palette mounted and animates between palette and trigger button with opacity, scale, and translate transitions.
- Autocomplete: keeps the option list mounted and animates list open/close with max-height, opacity, scale, and translate transitions.
- Copy button: adds temporary ring/scale feedback on successful copy.
- Dialog: animates backdrop and panel open/close, dims the background trigger, removes background controls from the accessibility tree while open, and removes closed dialog from the accessibility tree with `aria-hidden`.
- Disclosure: animates panel expansion/collapse with grid-template-rows and hides collapsed panels from the accessibility tree.
- Popover: keeps the panel mounted and animates open/close with opacity, scale, and translate transitions.
- Select: keeps the option list mounted and animates open/close with max-height, opacity, scale, and translate transitions.
- Tabs: adds animated active indicator and panel content fade/slide on tab change.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright animation smoke checked all nine element leaves for state changes, transition classes, stable trigger positions where relevant, and accessibility hiding for Dialog/Disclosure.
- Mobile Playwright animation smoke checked Autocomplete, Dropdown menu, Popover, Select, and Tabs with no horizontal overflow.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-command-palette-animated-closed.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-autocomplete-animated-selected.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-dropdown-animated-selected.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-copy-animated-copied.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-dialog-animated-open.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-disclosure-animated-second.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-popover-animated-closed.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-select-animated-member.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/desktop-tabs-animated-settings.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/mobile-autocomplete-animated-selected.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/mobile-dropdown-animated-selected.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/mobile-select-animated-viewer.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/animation-pass/mobile-tabs-animated-activity.png`

### Step 10 - Reference recheck and leaf preview parity

Reason:

- A second review against Tailwind Plus showed that Command palette, Disclosure, Popover, and Tabs still diverged from the reference leaf examples even though they were interactive.
- Command palette also had an awkward internal wrapping issue caused by a narrow right-side preview panel.

Implementation:

- Rechecked Tailwind Plus leaf screenshots for Command palette, Disclosure, Popover, and Tabs under `ref-recheck/`.
- Command palette now follows the reference single-list command surface on the mountain background and removes the right preview panel that caused wrapping.
- Disclosure now uses the reference FAQ accordion structure with plus/minus controls, animated expansion, and closed content marked visually hidden.
- Popover now uses a Solutions flyout with five option rows plus Watch demo and Contact sales footer actions. The trigger stays position-stable while opening, closing, and selecting.
- Tabs now uses the reference Write/Preview comment editor pattern with active tab state, editable textarea, preview panel, and post action.
- Mobile preview stages for these four leaves now use a taller aspect ratio so the examples do not collapse into clipped fragments on narrow screens.

Verification:

- `npm run build` passed.
- `npm run lint` passed with only the existing shadcn fast-refresh warnings.
- `python scripts/validate-ui-vocabulary.py` passed.
- `npm run audit:visuals` passed with the existing six fallback variants unchanged.
- Desktop Playwright smoke verified Command palette selection with no row wrap, Disclosure toggle behavior, Popover selection plus trigger box stability, Popover footer visibility, and Tabs write-to-preview transition.
- Mobile Playwright smoke checked Command palette, Disclosure, Popover, and Tabs for route rendering, title text, screenshots, zero console errors, and no horizontal overflow.

Evidence screenshots:

- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/ref-recheck/command-palette-desktop.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/ref-recheck/disclosure-desktop.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/ref-recheck/popover-desktop.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/ref-recheck/tabs-desktop.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-local/command-palette.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-local/disclosure.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-local/popover.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-local/tabs-write.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-local/tabs-preview.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-mobile/command-palette.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-mobile/disclosure.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-mobile/popover.png`
- `docs/research/assets/tailwind-plus-documentation-depth-2026-07-03/step10-mobile/tabs.png`
