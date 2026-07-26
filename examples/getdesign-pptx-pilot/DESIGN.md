---
version: alpha
name: "Askewly Design introduction — Linear-inspired pilot"
description: "A dark, precise product introduction for Askewly Design. It uses a restrained lavender signal, compact technical labels, and a shallow charcoal surface ladder across web and editable PowerPoint output."
colors:
  canvas: "#0B0C10"
  surface: "#12141A"
  surface-raised: "#191C24"
  surface-strong: "#222632"
  border: "#2C3140"
  text: "#F5F7FA"
  text-muted: "#A9B0BE"
  accent: "#8B93FF"
  accent-hover: "#A6ADFF"
  success: "#67D99A"
typography:
  display:
    fontFamily: "Inter, Noto Sans KR, Arial, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: -1.8px
  title:
    fontFamily: "Inter, Noto Sans KR, Arial, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.6px
  body:
    fontFamily: "Inter, Noto Sans KR, Arial, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, Noto Sans KR, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.8px
rounded:
  sm: 4px
  md: 8px
spacing:
  unit: 8px
  page: 64px
  section: 96px
components:
  primary-action:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
---

# Askewly Design introduction — DESIGN.md

## Overview

This pilot is a project-owned adaptation of a getdesign Linear analysis. The goal is not to resemble Linear; it is to test whether a concise dark product language can survive both a web page and a native PowerPoint deck.

## Colors

- `canvas` and the surface ladder create hierarchy. Do not add gradients or glows.
- `accent` is singular: primary action, selected state, and one decisive proof cue only.
- Text hierarchy comes from `text` and `text-muted`, never from lowering every surface contrast.

## Typography

- Use the system-safe sans stack for English and Korean. Do not use the reference brand's typefaces.
- Titles are compact, but Korean must retain readable word boundaries.
- `label` is uppercase only for short English metadata; Korean labels remain normal case.

## Layout

- Web: max-width 1180px, one focused proof surface per viewport.
- Slides: 16:9, 0.6in outer margin, one claim per slide, and no more than three supporting points.
- Use the same panel, border, and accent roles in both media; web responsiveness must not distort slide composition.

## Elevation & Depth

- Use the surface ladder and 1px borders. No drop shadows.
- A raised panel signals a product proof or a decision, not decoration.

## Shapes

- Use 4px to 8px corner radii. Avoid pills except tiny status tags.

## Components

- Primary action: lavender fill, near-black text.
- Proof panel: dark surface, hairline border, compact monospace-like metadata treatment.
- Slide number: muted label at the lower-right, never a decorative badge.

## Do's and Don'ts

- Do keep every text run and shape editable in PPTX.
- Do use a plain visual hierarchy that still reads without motion.
- Don't import logos, product screenshots, custom fonts, or brand copy from the reference.
- Don't flatten an HTML slide to an image for the PPTX output.

<!-- Changelog: 2026-07-21 getdesign Linear analysis adapted for the editable PPTX pilot -->
