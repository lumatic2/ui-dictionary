---
name: "Brutalist"
version: "0.1.0"

tokens:
  color:
    primitive:
      black: { "0": { value: "#000000", type: color } }
      white: { "0": { value: "#ffffff", type: color } }
      yellow: { "500": { value: "#ffe600", type: color } }
      red:    { "500": { value: "#ff2200", type: color } }
    semantic:
      surface:
        base:  { value: "{color.primitive.white.0}", type: color }
        muted: { value: "{color.primitive.yellow.500}", type: color }
      text:
        default: { value: "{color.primitive.black.0}", type: color }
        muted:   { value: "{color.primitive.black.0}", type: color }
      action:
        primary: { value: "{color.primitive.red.500}", type: color }
      border:
        default: { value: "{color.primitive.black.0}", type: color }

  dimension:
    space:
      "1": { value: "4px",  type: dimension }
      "2": { value: "8px",  type: dimension }
      "4": { value: "16px", type: dimension }
      "8": { value: "32px", type: dimension }
    radius:
      sm: { value: "0px", type: dimension }
      md: { value: "0px", type: dimension }
    border:
      thick: { value: "3px", type: dimension }

  typography:
    font:
      mono: { value: "JetBrains Mono, ui-monospace, monospace", type: fontFamily }
      sans: { value: "Space Grotesk, system-ui, sans-serif", type: fontFamily }
    scale:
      base: { value: "16px", type: dimension }
      lg:   { value: "24px", type: dimension }
      xl:   { value: "40px", type: dimension }
      "2xl": { value: "72px", type: dimension }
    weight:
      bold: { value: 700, type: fontWeight }

themes:
  default: { base: true }
  dark:
    color.semantic.surface.base:   { value: "{color.primitive.black.0}",   type: color }
    color.semantic.surface.muted:  { value: "{color.primitive.black.0}",   type: color }
    color.semantic.text.default:   { value: "{color.primitive.white.0}",   type: color }
    color.semantic.text.muted:     { value: "{color.primitive.white.0}",   type: color }
    color.semantic.action.primary: { value: "{color.primitive.yellow.500}", type: color }
    color.semantic.border.default: { value: "{color.primitive.white.0}",   type: color }
---

# Brutalist — Raw / Functional Punk

## 1. Personality
craigslist 와 sci-arc 의 사이. 두꺼운 검정 보더, 형광색 한 톤, 그리드 무시. UI 가 "건축자재"처럼 보임.

## 2. Color
흑백 + 형광 노랑 (`surface.muted`) + 형광 빨강 (action). 그라데이션 절대 금지.

## 3. Typography
헤딩 Space Grotesk weight 700. 본문 또는 라벨 mono. 대문자 라벨 적극.

## 4. Spacing & Layout
일부러 비대칭. container max 없음 (full-bleed). gap 균등하지 않음 — 의도된 불협.

## 5. Radius & Borders
**radius 0**. 모든 보더 **3px solid 검정**. 보더가 디자인 언어 자체.

## 6. Elevation & Motion
오프셋 그림자만 (`8px 8px 0 black` — 평면적). hover 시 offset 0,0.

## 7. Components
### Button
- 3px 검정 보더 + 빨강 배경 + 흰 텍스트. shadow 8px 8px 0 0 black.
- hover: shadow 0 0 0 0, transform translate(8px, 8px).

### Card
- 3px 검정 보더. 배경 노랑 또는 흰색. 그림자 8px offset.

### Input
- 3px 검정 보더. focus 시 빨강 보더.

## 8. Anti-patterns
- 부드러운 그림자 / 라운드 / 파스텔 / 가운데 정렬 본문

## 9. Changelog
## 2026-05-14
- 초안.
