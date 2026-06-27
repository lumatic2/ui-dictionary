# UI Dictionary

UI Dictionary is a searchable vocabulary site for people who know what kind of interface they want, but do not yet know the names of the components.

It explains UI terms in Korean and English, shows compact visual examples, and gives prompt phrases that can be used when asking an AI coding agent to build a screen.

## Why

Vibe-coding requests often start as vague instructions like "make it clean" or "add a popup." This project turns that into more precise language: card, toggle, dropdown, modal, drawer, toast, data table, and so on.

## What it does

- Maintains a human-editable UI vocabulary dataset in `docs/ui-vocabulary/terms.yml`.
- Generates site-ready data for a Vite + React glossary app.
- Shows Korean names, English names, aliases, plain definitions, visual anatomy, anti-use cases, and prompt phrases.
- Renders small React/CSS visual examples that can be reused in cards, detail pages, and poster exports.
- Documents authoring, search, mobile, export, and deployment workflows under `docs/ui-vocabulary/`.

## Evidence

- Production target: `https://ui.askewly.com/`
- Dataset source: `docs/ui-vocabulary/terms.yml`
- Site app: `examples/ui-vocabulary-site/`
- Deployment notes: `docs/ui-vocabulary/deployment.md`

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui-style component patterns
- lucide-react
- YAML data source with a generated TypeScript data module

## Status

Active public project. The current focus is vocabulary coverage, search quality, mobile readability, and poster/export reuse. It is a static site: no login, backend, account storage, or user-generated content is part of the MVP.
