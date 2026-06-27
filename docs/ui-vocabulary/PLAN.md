# UI Vocabulary Encyclopedia Plan

## Goal

UI/UX 용어를 잘 몰라 원하는 화면을 설명하지 못하는 문제를 줄인다. 바이브코딩 사용자와 초급 디자이너가 "이름 + 생김새 + 언제 쓰는지 + AI에게 어떻게 말할지"를 한 번에 익히는 웹 백과사전으로 만든다.

Reference seed: a local screenshot used only to set the initial poster-style layout direction. Do not treat the local file as a repository dependency.

## Product Shape

- Searchable UI component glossary website.
- Each term shows Korean/English name, aliases, plain explanation, visual example, and AI prompt phrase.
- Poster/image output is handled by website capture/download, not by a separate image-first workflow.
- Primary implementation stack: Vite + React + TypeScript + Tailwind CSS + shadcn/ui.
- Canonical vocabulary data stays in human-editable YAML, then the website consumes generated JSON/TS.
- Visual examples start as React/CSS mini mocks so the same asset can render in cards, detail pages, and poster exports.

## Decisions To Lock Before Building

1. Dataset contract: field names, required fields, category taxonomy, source citation format, and review status.
2. Source strategy: which references are trusted for definitions, which are only useful for aliases/examples, and how conflicts are resolved.
3. Site information architecture: browse/search first, then detail pages, then poster/export views.
4. Visual asset strategy: CSS/React mini assets first, export via browser capture later, no image-generation dependency for MVP.

## Milestone H1 — Vocabulary Dataset

- [ ] `docs/ui-vocabulary/schema.md`: term entry schema
- [ ] `docs/ui-vocabulary/sources.md`: source list and trust rules
- [ ] `docs/ui-vocabulary/terms.yml`: first 60 terms
- [ ] Six categories: input, selection, action, structure, feedback, data-display
- [ ] Required fields: Korean name, English name, aliases, plain definition, visual anatomy, when to use, anti-use, prompt phrase
- [ ] Web research pass: design system docs, UI glossary pages, component library docs

Acceptance:
- 60 terms follow one schema.
- Every term has at least one "AI에게 이렇게 말하기" phrase.
- `visual_anatomy` is concrete enough to render a mini asset.

## Milestone H2 — Website MVP

- [ ] `examples/ui-vocabulary-site/` Vite/React prototype
- [ ] Data pipeline from `terms.yml` or generated JSON
- [ ] Home: category card grid, search, category filter, source-visible term count
- [ ] Card: names, short definition, mini visual asset, prompt phrase
- [ ] Detail view: appearance, when to use, similar terms, anti-use
- [ ] shadcn/ui components: Button, Input, Card, Badge, Tabs, Select, Dialog/Sheet, Tooltip, Accordion, Table, ScrollArea
- [ ] Responsive desktop/mobile verification

Acceptance:
- Korean search such as "토글", "모달", "드롭다운" works.
- English search such as "toggle", "modal", "dropdown" works.
- Cards are visually understandable without opening the detail page.

## Milestone H3 — Visual Assets And Capture

- [ ] Decide visual asset method per term: CSS mini mock by default, lucide icon composition where useful, SVG only for fixed diagrams
- [ ] Download one card as PNG
- [ ] Export one category as poster-style PNG
- [ ] Build a six-category summary poster view like the seed image
- [ ] Verify text size, spacing, and exported resolution

Acceptance:
- The website can export poster-style images such as "입력 요소 6개" or "화면 구조 요소 6개".
- Image output reuses the same data and visual components as the website.
- Basic poster output works without image generation.

## Milestone H4 — Collection And Refinement Loop

- [ ] Web research checklist for term collection
- [ ] `docs/ui-vocabulary/inbox.yml` for candidate terms
- [ ] Review rules for promoting candidates into `terms.yml`
- [ ] Similar-term comparisons: dropdown/select/combobox, modal/dialog/drawer, toast/snackbar/banner
- [ ] Improve `design-screen` so it can use `terms.yml` to interpret vague screen requests
- [ ] Optional later bridge: term detail pages link to relevant cookbook technique notes

Acceptance:
- New terms can move from inbox to official entry with clear review rules.
- Aliases and visual anatomy help users find terms even when they do not know the exact name.

## Deferred

- No quiz feature.
- No separate poster-only app.
- `cookbook/` integration after the website MVP.

## Cookbook Role

`cookbook/` is a technique catalog, not the vocabulary itself.

UI Vocabulary answers: "What is this component called and what does it look like?"

Cookbook answers: "How do I implement or adapt this technique inside a design system?"

Example:
- Vocabulary: `Modal` = a focused overlay window on top of the screen.
- Cookbook: how a modal should handle backdrop, blur, border, focus, motion, and anti-use in a specific visual system.

Vocabulary comes first. Cookbook links can become advanced references later.
