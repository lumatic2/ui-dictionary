# Mobile Platform Design Baseline

Date: 2026-07-04

## Purpose

RME4 defines the mobile baseline for Yusung's digital product design system. The goal is not to copy iOS or Android styling. The goal is to make future mobile UI pages and agent-generated mobile screens respect platform expectations.

Checked official sources:

- Apple Human Interface Guidelines: `https://developer.apple.com/design/human-interface-guidelines`
- Apple HIG navigation/search: `https://developer.apple.com/design/human-interface-guidelines/navigation-and-search`
- Apple HIG sheets: `https://developer.apple.com/design/human-interface-guidelines/sheets`
- Apple HIG accessibility: `https://developer.apple.com/design/human-interface-guidelines/accessibility`
- Apple HIG motion: `https://developer.apple.com/design/human-interface-guidelines/motion`
- Apple Design overview and WWDC25 design-system material: `https://developer.apple.com/design/`
- Material Design 3 foundations: `https://m3.material.io/foundations`
- Material Design 3 layout/breakpoints: `https://m3.material.io/foundations/layout/applying-layout`
- Material Design 3 accessibility/designing: `https://m3.material.io/foundations/designing/structure`
- Material Design 3 motion: `https://m3.material.io/styles/motion/overview/how-it-works`
- Material Design 3 components: `https://m3.material.io/components`

Note: Apple and Material documentation pages are JavaScript-rendered in the browser. This audit uses official entrypoints and visible official summaries as the reference anchors; detailed implementation should still re-open the official docs when building a specific native surface.

## Baseline Principle

Mobile UI is platform-shaped, not just small web UI.

For this design system, every mobile pattern needs to answer:

1. Which platform expectation is being honored?
2. Which parts are shared across iOS/Android/mobile web?
3. Which details must branch by platform?
4. What interaction, accessibility, and motion rules make the UI feel native instead of resized desktop?

## Platform Comparison

| Topic | Apple baseline | Material baseline | Yusung system rule |
|---|---|---|---|
| Navigation | Prioritize content and familiar platform navigation patterns. Use tab bars, hierarchical navigation, sheets, and search where they match user expectation. | Use adaptive navigation patterns that change by window size and task structure. Navigation should have clear flows, minimal steps, easy-to-locate controls, and clear labels. | Model navigation as task depth: top-level tabs, stack/detail, modal task, search task. Branch visual treatment by platform. |
| Modality | Sheets can be modal or nonmodal on iOS/iPadOS. Modal surfaces should clarify task focus and dismissal. | Dialogs, bottom sheets, navigation drawers, and component states should be explicit, accessible, and adaptive. | Do not use a generic "modal" component for mobile. Pick sheet/dialog/drawer/full-screen task by platform and task weight. |
| Inputs | Respect touch, keyboard, voice, assistive tech, and device-specific affordances. Standard controls carry learned behavior. | Support keyboard, screen reader, tab/arrow navigation, and touch targets. Material explicitly frames accessibility around achievable goals and focus control. | Every mobile form pattern needs touch target, focus order, keyboard type, validation timing, and error recovery notes. |
| Density | Apple surfaces often rely on native spacing, legibility, content-first hierarchy, and system controls. Newer Apple design guidance emphasizes harmony across devices, screen sizes, and input modes. | Material uses adaptive layout, grids, spacing, breakpoints, and component evolution across sizes. | Define density as a tokenized range: compact phone, regular phone, tablet/sidebar, large-screen/responsive. |
| Visual language | Apple identity is tied to platform materials, system typography, depth, motion, and native controls. WWDC25 guidance highlights a more adaptive, expressive design language across devices. | Material 3 is personal, adaptive, expressive, tokenized, component-backed, and open-source. | Yusung identity can sit above platform rules, but native container, control, and motion expectations must remain recognizable. |
| Motion | Motion should help orientation and hierarchy, and custom motion must avoid distracting or disorienting people. | Material 3 motion is physics-based, fluid, and used for interaction and transitions. | Motion tokens need duration/easing/gesture relation/reduced-motion fallback. Animation is a state transition, not decoration. |
| Accessibility | Accessibility is a first-order HIG foundation; interfaces should work regardless of capability or device usage mode. | Material foundations include accessibility, interaction, and layout principles; goals should be achievable by keyboard, screen reader, and assistive tech. | Accessibility gates are required for every mobile pattern: label, focus, contrast, touch size, reduced motion, error text, state exposure. |

## Required Mobile Pattern Fields

Future mobile entries in `ui-dictionary` should carry extra fields beyond desktop/web components:

```yaml
platforms:
  ios:
    native_pattern: "sheet | tab bar | navigation stack | list | form | ..."
    caveats: []
  android:
    material_pattern: "bottom sheet | navigation bar | top app bar | fab | ..."
    caveats: []
  mobile_web:
    browser_constraints: []

interaction:
  touch_target: ""
  gestures: []
  keyboard: ""
  focus_order: ""
  screen_reader_labeling: ""

motion:
  transition_role: "orientation | feedback | continuity | affordance"
  reduced_motion_fallback: ""

density:
  phone_compact: ""
  phone_regular: ""
  tablet: ""
```

## Navigation Baseline

### Shared model

Mobile navigation should be described as one of four task shapes:

1. **Top-level switching:** persistent destinations such as Home, Search, Saved, Account.
2. **Hierarchical drill-down:** list to detail, detail to edit, back stack.
3. **Focused temporary task:** sheet/dialog/full-screen modal for one decision or edit.
4. **Search/explore task:** query entry, suggestions, results, filters, and empty states.

### Implementation rule

For every mobile navigation pattern, record:

- entry point
- exit path
- back behavior
- current-location indicator
- whether state persists between destinations
- empty/loading/error behavior

This prevents AI-generated mobile screens from becoming disconnected static panels.

## Modality Baseline

Mobile modality must be chosen by task weight.

| Task weight | Preferred pattern | Notes |
|---|---|---|
| Lightweight choice | Menu, popover, small sheet | Keep dismissal obvious. |
| Focused edit | Sheet or page-level edit flow | Preserve context if the user can return without losing work. |
| Blocking decision | Alert/dialog | Use sparingly and make actions unambiguous. |
| Multi-step task | Full-screen flow | Give progress, cancel/back behavior, and draft preservation rules. |

Rule: if a modal contains scrolling content, forms, validation, or multi-step state, it is no longer a simple modal. Treat it as a mobile task flow.

## Input Baseline

Every mobile input example needs:

- label and helper/error text
- keyboard type or input mode
- focus state
- disabled/read-only state
- validation timing
- loading/submitting state
- touch target size check
- screen reader label
- dark mode rendering

Forms are not complete without submission and error recovery examples.

## Density Baseline

Use density as a product variable:

- **Comfortable:** onboarding, marketing, consumer browsing, editorial UI.
- **Standard:** settings, checkout, account, profile, forms.
- **Dense:** SaaS admin, financial data, operations, dashboards.

Dense mobile is allowed, but it must use:

- persistent hierarchy
- progressive disclosure
- pinned primary actions only when necessary
- data grouping
- readable touch targets
- horizontal scrolling only for deliberate tables/charts

## Motion Baseline

Motion must communicate one of these:

- continuity between states
- spatial relationship
- interaction feedback
- completion or failure
- interruptibility/dismissal

Avoid:

- animation that delays input
- decorative repeated motion in forms or reading surfaces
- motion with no reduced-motion fallback
- using desktop hover transitions as mobile interaction design

## Dark Mode Baseline

Mobile pages must verify both light and dark modes because platform users expect system-theme alignment.

Required checks:

- background and elevated surface contrast
- input borders and focus rings
- disabled states
- destructive actions
- status/error/success colors
- scrims/backdrops for sheets and dialogs
- media thumbnails and icons

Dark mode is not a color inversion. It needs platform-aware elevation and contrast.

## Agent Rules

When Codex/Claude Code builds mobile UI from this design system:

1. Do not simply make the desktop component narrower.
2. Declare the intended platform: iOS, Android/Material, mobile web, or cross-platform.
3. Pick a navigation/task shape before styling.
4. Include interactive states, not just a screenshot-like mock.
5. Verify light/dark mode.
6. Verify at least one phone viewport and one wider viewport when tablet behavior is implied.
7. Respect platform-specific naming in docs and copy; do not call everything a modal/dropdown.

## Implementation Targets

Short-term pages that should use this baseline:

- Mobile app onboarding
- Mobile settings/account
- Mobile checkout/payment
- Mobile search/filter results
- Mobile bottom sheet/action sheet
- Mobile tab/navigation shell
- Mobile form validation

These should become future leaf pages beside the current Tailwind-inspired web/documentation pages.

## RME4 Completion Check

- Official Apple HIG and Material 3 entrypoints were checked on 2026-07-04.
- Navigation, modality, inputs, density, visual language, motion, accessibility, and dark mode are compared.
- A mobile-specific data-field extension is proposed.
- Agent implementation rules are defined so mobile output is not just resized desktop UI.
