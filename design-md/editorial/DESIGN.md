---
name: "Editorial"
version: "0.1.0"

tokens:
  color:
    primitive:
      paper:
        "50":  { value: "oklch(98% 0.005 80)", type: color }
        "100": { value: "oklch(95% 0.01 80)", type: color }
      ink:
        "700": { value: "oklch(28% 0.02 30)", type: color }
        "900": { value: "oklch(15% 0.02 30)", type: color }
      accent:
        "500": { value: "oklch(50% 0.20 25)", type: color }
    semantic:
      surface:
        base:  { value: "{color.primitive.paper.50}", type: color }
        muted: { value: "{color.primitive.paper.100}", type: color }
      text:
        default: { value: "{color.primitive.ink.900}", type: color }
        muted:   { value: "{color.primitive.ink.700}", type: color }
      action:
        primary: { value: "{color.primitive.accent.500}", type: color }
      border:
        default: { value: "{color.primitive.ink.700}", type: color }

  dimension:
    space:
      "1": { value: "4px",  type: dimension }
      "2": { value: "8px",  type: dimension }
      "4": { value: "16px", type: dimension }
      "8": { value: "32px", type: dimension }
      "12": { value: "48px", type: dimension }
    radius:
      sm: { value: "0px", type: dimension }
      md: { value: "0px", type: dimension }

  typography:
    font:
      serif: { value: "GT Sectra, Charter, Georgia, serif", type: fontFamily }
      sans:  { value: "Inter Variable, system-ui, sans-serif", type: fontFamily }
    scale:
      sm:    { value: "14px", type: dimension }
      base:  { value: "18px", type: dimension }
      lg:    { value: "24px", type: dimension }
      xl:    { value: "36px", type: dimension }
      "2xl": { value: "56px", type: dimension }
      "3xl": { value: "80px", type: dimension }
    weight:
      regular: { value: 400, type: fontWeight }
      bold:    { value: 700, type: fontWeight }
---

# Editorial — Magazine / Long-form

## 1. Personality
NYT / The Atlantic 의 인쇄 톤. serif 헤딩 + sans 본문. 큰 헤드라인, 좁은 본문 폭, 풍부한 leading.

## 2. Color
종이 + 잉크 + 단일 액센트(deep red). 액센트는 link·pull-quote 에만.

## 3. Typography
헤딩 serif (GT Sectra), 본문 sans 18/30. drop-cap 허용. measure 60-75 ch.

## 4. Spacing & Layout
container max 680px (article). aside 320px. column gap 64px.

## 5. Radius & Borders
**radius 0 — 모든 모서리 직각**. 보더는 hairline (1px ink).

## 6. Elevation & Motion
그림자 없음. 이미지에 1px 보더만. motion 최소.

## 7. Components
### Button
- 텍스트 링크처럼. underline + accent color. 박스형은 secondary 만 사용.

### Pull-quote
- serif italic, scale.xl, left-border 4px accent.

### Card
- 보더 1px hairline. 패딩 32.

## 8. Anti-patterns
- 라운드 모서리 / 그림자 / gradient / 형광색

## 9. Changelog
## 2026-05-14
- 초안.
