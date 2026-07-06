---
# GENERATED tokens/themes from tokens/askewly.tokens.json — edit the SSOT, then regenerate
name: "Askewly Design"
version: "0.2.0"

tokens:
  color:
    primitive:
      white: { value: {"colorSpace":"oklch","components":[1,0,0]}, type: color }
      gray:
        "1": { value: {"colorSpace":"oklch","components":[0.985,0,0]}, type: color }
        "2": { value: {"colorSpace":"oklch","components":[0.97,0.005,270]}, type: color }
        "3": { value: {"colorSpace":"oklch","components":[0.95,0.015,270]}, type: color }
        "4": { value: {"colorSpace":"oklch","components":[0.94,0.02,270]}, type: color }
        "5": { value: {"colorSpace":"oklch","components":[0.91,0.015,270]}, type: color }
        "6": { value: {"colorSpace":"oklch","components":[0.88,0.015,270]}, type: color }
        "7": { value: {"colorSpace":"oklch","components":[0.72,0.02,270]}, type: color }
        "8": { value: {"colorSpace":"oklch","components":[0.6,0.025,270]}, type: color }
        "9": { value: {"colorSpace":"oklch","components":[0.46,0.03,270]}, type: color }
        "10": { value: {"colorSpace":"oklch","components":[0.35,0.03,270]}, type: color }
        "11": { value: {"colorSpace":"oklch","components":[0.25,0.03,270]}, type: color }
        "12": { value: {"colorSpace":"oklch","components":[0.16,0.015,270]}, type: color }
      askewly:
        violet: { value: {"colorSpace":"srgb","components":[0.435294,0.176471,0.741176],"hex":"#6F2DBD"}, type: color }
        orchid: { value: {"colorSpace":"srgb","components":[0.65098,0.388235,0.8],"hex":"#A663CC"}, type: color }
        lavender: { value: {"colorSpace":"srgb","components":[0.698039,0.596078,0.862745],"hex":"#B298DC"}, type: color }
        sky: { value: {"colorSpace":"srgb","components":[0.721569,0.815686,0.921569],"hex":"#B8D0EB"}, type: color }
        mint: { value: {"colorSpace":"srgb","components":[0.72549,0.980392,0.972549],"hex":"#B9FAF8"}, type: color }
      red:
        "9": { value: {"colorSpace":"oklch","components":[0.58,0.22,27]}, type: color }
    semantic:
      surface:
        base: { value: "{color.primitive.gray.1}", type: color }
        raised: { value: "{color.primitive.white}", type: color }
        overlay: { value: "{color.primitive.white}", type: color }
        muted: { value: "{color.primitive.gray.3}", type: color }
        secondary: { value: "{color.primitive.gray.4}", type: color }
        tint: { value: "{color.primitive.askewly.mint}", type: color }
      text:
        default: { value: "{color.primitive.gray.12}", type: color }
        muted: { value: "{color.primitive.gray.9}", type: color }
        secondary: { value: "{color.primitive.gray.11}", type: color }
        on-accent: { value: "{color.primitive.gray.1}", type: color }
      action:
        primary: { value: "{color.primitive.askewly.violet}", type: color }
        secondary: { value: "{color.primitive.askewly.orchid}", type: color }
        destructive: { value: "{color.primitive.red.9}", type: color }
      accent:
        base: { value: "{color.primitive.askewly.mint}", type: color }
        foreground: { value: "{color.primitive.gray.12}", type: color }
      border:
        default: { value: "{color.primitive.gray.6}", type: color }
        input: { value: "{color.primitive.gray.6}", type: color }
        focus: { value: "{color.primitive.askewly.violet}", type: color }
        accent: { value: "{color.primitive.askewly.lavender}", type: color }
    component:
      button:
        bg: { value: "{color.semantic.action.primary}", type: color }
        text: { value: "{color.semantic.text.on-accent}", type: color }

  dimension:
    space:
      "1": { value: "4px", type: dimension }
      "2": { value: "8px", type: dimension }
      "4": { value: "16px", type: dimension }
      "8": { value: "32px", type: dimension }
      "12": { value: "48px", type: dimension }
      "16": { value: "64px", type: dimension }
    radius:
      sm: { value: "4px", type: dimension }
      md: { value: "6px", type: dimension }
      lg: { value: "8px", type: dimension }
      xl: { value: "12px", type: dimension }

  typography:
    font:
      sans: { value: "Geist, Noto Sans KR, ui-sans-serif, system-ui, sans-serif", type: fontFamily }
      mono: { value: "Geist Mono, ui-monospace, monospace", type: fontFamily }
    scale:
      sm: { value: "14px", type: dimension }
      base: { value: "16px", type: dimension }
      lg: { value: "20px", type: dimension }
      xl: { value: "28px", type: dimension }
      2xl: { value: "40px", type: dimension }
    weight:
      regular: { value: 400, type: fontWeight }
      medium: { value: 500, type: fontWeight }

themes:
  default: { base: true }
  dark:
    color.semantic.surface.base: { value: "{color.primitive.gray.12}", type: color }
    color.semantic.surface.raised: { value: "{color.primitive.gray.11}", type: color }
    color.semantic.surface.overlay: { value: "{color.primitive.gray.11}", type: color }
    color.semantic.surface.muted: { value: "{color.primitive.gray.10}", type: color }
    color.semantic.surface.secondary: { value: "{color.primitive.gray.10}", type: color }
    color.semantic.surface.tint: { value: "{color.primitive.gray.10}", type: color }
    color.semantic.text.default: { value: "{color.primitive.gray.1}", type: color }
    color.semantic.text.muted: { value: "{color.primitive.gray.7}", type: color }
    color.semantic.text.secondary: { value: "{color.primitive.gray.3}", type: color }
    color.semantic.text.on-accent: { value: "{color.primitive.gray.12}", type: color }
    color.semantic.action.primary: { value: "{color.primitive.gray.1}", type: color }
    color.semantic.action.secondary: { value: "{color.primitive.askewly.mint}", type: color }
    color.semantic.action.destructive: { value: "{color.primitive.red.9}", type: color }
    color.semantic.accent.base: { value: "{color.primitive.gray.10}", type: color }
    color.semantic.accent.foreground: { value: "{color.primitive.gray.1}", type: color }
    color.semantic.border.default: { value: "{color.primitive.gray.10}", type: color }
    color.semantic.border.input: { value: "{color.primitive.gray.10}", type: color }
    color.semantic.border.focus: { value: "{color.primitive.askewly.lavender}", type: color }
    color.semantic.border.accent: { value: "{color.primitive.askewly.orchid}", type: color }
---

# Askewly Design — White System / Intentional Asymmetry

## 1. Personality
화이트 기반의 조용한 제품 디자인 시스템. 첫 화면은 중앙 hero 제목으로 시작하고, 색은 팔레트 전체를 뿌리는 장식이 아니라 제품 표면과 상태를 구분하는 신호로만 쓴다.

Askewly는 "살짝 비틀렸지만 의도적인" 브랜드다. 레이아웃은 정돈되어야 하지만, 작은 비대칭, 겹침, 단계적 색 전환으로 사람이 설계한 긴장을 남긴다.

## 2. Color
기본 테마는 white. 배경은 거의 흰색이고, 본문은 고대비 charcoal을 쓴다.

Extracted palette from landing planning reference image:

- Violet: `#6F2DBD` — primary action, selected state, strongest brand mark.
- Orchid: `#A663CC` — secondary accent, hover, active navigation underline.
- Lavender: `#B298DC` — soft border, muted badge, chart/pattern highlight.
- Sky: `#B8D0EB` — informational surface, preview panel wash.
- Mint: `#B9FAF8` — success/agent-ready signal, light hero glow.

Do not turn the whole page purple. Use the palette as a controlled five-step spectrum in the hero proof surface, selected chips, small gradients, and state indicators.

## 3. Typography
Geist is the primary Latin UI face. Noto Sans KR is the Korean fallback in the same sans stack because Geist does not cover Korean reliably. Geist Mono is reserved for code, token names, keyboard shortcuts, and agent-facing technical labels.

- Hero title: 72-96px desktop, 44-56px mobile, line-height 0.95-1.05.
- Section heading: 32-44px.
- Body: 16-18px, relaxed but not editorial.
- Korean UI/body copy uses `Noto Sans KR` through the shared sans stack.
- Technical labels and code snippets use `Geist Mono`.
- Do not use negative letter spacing except where the existing type scale already requires optical tightening in the hero.

## 4. Spacing & Layout
Landing first viewport:

- Top navigation stays compact and close to the current site shell: Askewly Design / Docs / Patterns / Showcase / Resources / Pro.
- Hero copy sits centered, not split left/right.
- Hero should show the product promise before scroll: a design-system website for humans plus an agent-usable system for Codex/Claude Code.
- Keep enough of the next section visible on desktop and mobile, so the page does not feel like a dead poster.

General layout:

- Container max 1120-1200px.
- Use `space.12` and `space.16` for major vertical rhythm.
- Use a single strong focal area per viewport.
- Below the hero, prefer full-width bands or unframed grids over nested cards.

## 5. Radius & Borders
Small radius only. Cards and framed previews should stay at 4px or below unless a real browser/device mockup needs a slightly larger corner.

Use hairline borders for structure. Use `border.accent` only for selected/active states or subtle hero preview edges.

## 6. Elevation & Motion
No heavy drop shadows. Use borders, spacing, tint surfaces, and subtle opacity/translate motion.

Motion rules:

- The still frame must work before animation.
- Motion should explain focus, state, or progression.
- Hero segmented preview changes can crossfade/slide 120-180ms.
- Respect reduced motion.

## 7. Components
### Landing Hero
- White background.
- Centered product name or direct product promise.
- Primary CTA: `Explore Patterns`.
- Secondary CTA: `Open Docs`.
- Supporting copy should mention both surfaces: public UI reference website and agent-facing design system.
- Below the centered title, show one restrained proof surface rather than many unrelated decorative cards.

### Hero Proof Surface
- Show a compact design-system workspace: left nav, central preview, right inspector.
- The proof surface can include Docs, Patterns, Showcase, Resources, and Pro as visible labels.
- Use palette spectrum as tiny state chips or inspector accents.
- Must not look like a generic SaaS analytics dashboard unless the selected mode is Dashboard.

### Top Navigation
- Keep the current compressed nav model.
- Use text labels: Docs, Patterns, Showcase, Resources, Pro.
- Active/hover state may use Violet/Orchid underline or text shift.

### Button
- height 40, padding-x 24. radius `sm`.
- primary: Violet background / white text. hover opacity 0.9.
- secondary: 투명 / 1px 보더.

### Input
- 보더 없음, bottom-border 1px. focus 시 2px.

### Card
- 보더만. 패딩 32. 그림자 없음.

## 8. Anti-patterns
- Purple-dominated page.
- Generic SaaS dashboard hero with fake metrics and no design-system meaning.
- Split hero with text on one side and card/mockup on the other.
- Decorative blob/orb backgrounds.
- Nested cards inside cards.
- Heavy shadows, oversized rounded pills, or one-note gradient surfaces.
- Motion that runs forever without communicating state.

## 9. Changelog
## 2026-07-05
- Bootstrapped design-manual Minimal family and rewrote it as Askewly Design landing guidance.
- Extracted planning palette from user reference image: `#6F2DBD`, `#A663CC`, `#B298DC`, `#B8D0EB`, `#B9FAF8`.

## 2026-05-14
- 초안.
