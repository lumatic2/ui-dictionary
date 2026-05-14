---
name: "Glass"
version: "0.1.0"

tokens:
  color:
    primitive:
      slate:
        "50":  { value: "oklch(98% 0.01 250)", type: color }
        "100": { value: "oklch(94% 0.02 250)", type: color }
        "400": { value: "oklch(65% 0.04 250)", type: color }
        "500": { value: "oklch(55% 0.04 250)", type: color }
        "600": { value: "oklch(45% 0.04 250)", type: color }
        "800": { value: "oklch(25% 0.04 250)", type: color }
        "900": { value: "oklch(15% 0.04 250)", type: color }
      iris:
        "400": { value: "oklch(70% 0.16 280)", type: color }
        "500": { value: "oklch(55% 0.18 280)", type: color }
        "700": { value: "oklch(40% 0.18 280)", type: color }
    semantic:
      surface:
        base:   { value: "{color.primitive.slate.50}", type: color }
        glass:  { value: "color-mix(in oklch, {color.primitive.slate.50} 60%, transparent)", type: color }
        muted:  { value: "{color.primitive.slate.100}", type: color }
      text:
        default:    { value: "{color.primitive.slate.900}", type: color }
        muted:      { value: "{color.primitive.slate.600}", type: color }
        on-primary: { value: "{color.primitive.slate.50}",  type: color }
      action:
        primary: { value: "{color.primitive.iris.500}", type: color }
      border:
        default: { value: "color-mix(in oklch, {color.primitive.slate.500} 25%, transparent)", type: color }

  dimension:
    space:
      "1": { value: "4px",  type: dimension }
      "2": { value: "8px",  type: dimension }
      "4": { value: "16px", type: dimension }
      "6": { value: "24px", type: dimension }
      "8": { value: "32px", type: dimension }
    radius:
      md:   { value: "12px", type: dimension }
      lg:   { value: "20px", type: dimension }
      xl:   { value: "32px", type: dimension }
      full: { value: "9999px", type: dimension }
    blur:
      sm: { value: "8px", type: dimension }
      md: { value: "16px", type: dimension }
      lg: { value: "32px", type: dimension }

  typography:
    font:
      sans: { value: "Inter Variable, system-ui, sans-serif", type: fontFamily }
    scale:
      sm:   { value: "14px", type: dimension }
      base: { value: "16px", type: dimension }
      lg:   { value: "20px", type: dimension }
      xl:   { value: "28px", type: dimension }
      "2xl": { value: "44px", type: dimension }
    weight:
      regular: { value: 400, type: fontWeight }
      medium:  { value: 500, type: fontWeight }
      semibold: { value: 600, type: fontWeight }

themes:
  default: { base: true }
  dark:
    color.semantic.surface.base:   { value: "{color.primitive.slate.900}", type: color }
    color.semantic.surface.glass:  { value: "color-mix(in oklch, {color.primitive.slate.900} 60%, transparent)", type: color }
    color.semantic.surface.muted:  { value: "{color.primitive.slate.800}", type: color }
    color.semantic.text.default:   { value: "{color.primitive.slate.50}",  type: color }
    color.semantic.text.muted:      { value: "{color.primitive.slate.400}", type: color }
    color.semantic.text.on-primary: { value: "{color.primitive.slate.900}", type: color }
    color.semantic.action.primary:  { value: "{color.primitive.iris.400}", type: color }
    color.semantic.border.default: { value: "color-mix(in oklch, {color.primitive.slate.500} 35%, transparent)", type: color }
---

# Glass — Apple visionOS / Aurora

## 1. Personality
배경 그라데이션 + frosted glass 패널. iris/violet 액센트. 텍스트는 또렷, 표면은 흐릿.

## 2. Color
배경에 mesh gradient. 카드/패널은 반투명 + backdrop-filter blur.

## 3. Typography
Inter Variable 400/500/600. tracking 살짝 타이트 (-0.5%).

## 4. Spacing & Layout
넉넉한 여백. 카드 패딩 24-32. container max 1200.

## 5. Radius & Borders
큰 라운드 (`radius.lg` 기본, 카드 `xl`). 보더는 반투명 hairline.

## 6. Elevation & Motion
- 그림자 작게 + 색상 (iris 5%): `0 8px 32px oklch(62% 0.18 280 / 0.08)`
- 패널: `backdrop-filter: blur(16px)` + 반투명 배경
- spring motion (`cubic-bezier(0.3, 0.7, 0.4, 1.5)`) 허용

## 7. Components
### Button (primary)
- 배경 `action.primary`. radius `full` 또는 `md`. shadow 위 참고.

### Card
- `surface.glass` + `backdrop-filter blur(16px)` + 1px hairline 보더.
- 패딩 `space.6`-`space.8`.

### Nav
- floating bar. glass + 큰 라운드. 상단에서 16px 띄움.

## 8. Anti-patterns
- 반투명 위에 반투명 (계층 무너짐 — 최대 2층)
- contrast 미달 텍스트 on glass (4.5:1 강제)
- gradient 4색 이상

## 9. Changelog
## 2026-05-14
- 초안.
