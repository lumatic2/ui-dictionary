# Askewly Landing Showcase Atlas Upgrade Plan

Date: 2026-07-05
Status: active (2026-07-07 재개 — 사용자 승격; resume from Step 4. SMC·FW 이월 항목을 Step 11a~11c로 흡수)
Milestone: PSS2 Landing Page Design Quality
Horizon: `docs/horizons/2026-07-public-site-shell.md`
Implementation surface: `examples/ui-vocabulary-site/src/components/home-page.tsx`

## Purpose

The landing showcase should prove that Askewly Design is more than a static gallery. Each card should demonstrate a reusable product-interface capability: an interaction model, visual treatment, product workflow, or agent-ready design asset that a coding agent can later consume as a recipe.

Selection criteria:

- Interaction value: pointer, drag, scroll, keyboard, state, motion, or editing behavior should matter.
- Visual distinctiveness: each card needs a memorable visual idea, not a generic dashboard tile.
- Product relevance: every card must map to websites, mobile apps, SaaS, commerce, dashboards, docs, or internal tools.
- Agent value: each card should eventually become a reusable Codex/Claude Code recipe with tokens, intent, states, checks, and anti-pattern notes.

## Planning Gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  spec_delta: "PSS2 showcase implementation will move one card at a time from taxonomy labels to interactive, reference-quality product surfaces."
  perspectives:
    product: "The showcase becomes proof that Askewly Design can produce polished interfaces, not only describe them."
    architecture: "Keep the current React/Tailwind homepage component, but split complex card demos into local helper components when a card grows."
    security: "No auth, secrets, paid gates, or external data in this milestone."
    qa: "Each card pass must run build/lint plus Chrome interaction smoke for the edited card."
    skeptic: "The risk is building isolated toys. Each card therefore needs a concrete product-interface recipe and not just animation."
  dod:
    - "Each card has a title, copy, content model, interaction model, failure mode, and verification check."
    - "Implementation proceeds one card per pass unless the change is purely shared scaffolding."
```

## Decision Log

- **(확정 2026-07-07) CTA pill 방향 = B (8px, radius.lg)** — Figma 배리에이션 보드(13:2)에서 사용자 픽. hero CTA·탑바 Pro Plan `rounded-full` → `rounded-lg`(8px), DESIGN.md §7 Button radius `sm`→`lg` 개정. §8 "oversized rounded pills" 안티패턴은 유지(8px는 pill 아님 — 이제 실제로 충족).
- **(확정 2026-07-07) 재개 작업 순서** — 갭 3건(11a~11c) 먼저, 카드(Step 4~11)는 그 뒤 순차. 11a는 Figma 픽 대기 중이므로 11b→11c 선진행.

- Keep the 12-card atlas. Do not add more cards until these are meaningfully implemented.
- Work one card at a time. A card is done only when its demo is interactive and Chrome-verified.
- Keep the atlas as one continuous showcase of independent surfaces instead of adding another taxonomy layer.
- Use current Askewly Design tokens from `DESIGN.md`; avoid adding new palette families during this milestone.
- If a card needs a reference capture or GitHub implementation pattern, document it before coding that card.
- Do not make the cards static screenshots. Product UI text and controls remain code-native.

## Current Card Set

### 1. Agent-Ready Design System

Status: first upgrade in progress.

Proposed card copy:

> Editable UI assets packaged with agent-ready design context.

Content to show:

- A compact design canvas with editable `Button`, `Card`, and `Hero` assets.
- Asset selection, deselection, drag move, resize handles, and pressed state.
- Agent context rows: `DESIGN.md`, `Tokens`, `Patterns`, `Checks`.
- `Ready for Codex` / `Run browser check` actions as stateful controls.

Interaction contract:

- Clicking an asset selects it and shows violet outline plus resize handles.
- Clicking empty canvas deselects it.
- Dragging the asset moves it.
- Dragging edges or corners resizes it.
- Button asset click toggles pressed state.
- Card/Hero assets reflow internal content instead of clipping text.

Verification:

- Build/lint pass.
- Chrome smoke: select/deselect, drag move, resize, Button/Card/Hero switch, pressed state.
- Failure mode: selection should not remain active after empty-canvas click.

### 2. Cursor-Reactive Field

Current title: `Cursor Tracking Interaction`

Proposed title:

> Cursor-Reactive Field

Proposed copy:

> Pointer movement bends icons, light, and focus across the surface in real time.

Content to show:

- A field of small directional marks, dashes, and dots that gather around the cursor like a visual current.
- Light and scale respond by proximity, but coordinates should not be the main content.
- Leaving the card should settle to a balanced still frame.

Interaction contract:

- Pointer movement updates icon rotation, opacity, scale, and radial focus.
- The effect can activate even when the cursor is near a mark, not only directly on top of it.
- No layout jitter and no distracting cursor trail.

Verification:

- Chrome pointer movement changes CSS variables and visible element state.
- Failure mode: no layout jitter and no unreadable low-contrast state.

### 3. Physics-Based Interaction

Proposed copy:

> Fluid-like forces make interface objects feel guided by flow, not static hover.

Content to show:

- A water-flow style field with stream lines, particles, and draggable force nodes.
- Pointer movement bends the field and changes particle direction.
- The visual metaphor should read as fluid dynamics, not only magnetic buttons.

Interaction contract:

- Pointer movement creates visible flow distortion.
- Dragging or hovering a force node changes nearby stream strength.
- Reduced-motion path should still show static relationships.

Verification:

- Chrome pointer/drag smoke changes node positions.
- Failure mode: nodes must not overlap labels or escape the card.

### 4. Scroll-Driven Narrative

Proposed copy:

> Copy, layers, and interface states advance as a self-running story.

Content to show:

- A miniature story panel with progress rail.
- Chapters such as `Brief`, `System`, `Proof`.
- Layered cards reveal or compress as progress changes.

Interaction contract:

- The card auto-plays its own progress loop instead of waiting for user input.
- Progress changes headline, visual layer positions, and proof state.
- Later page-scroll binding can reuse the same chapter model.

Verification:

- Chrome range or scroll input changes chapter and layer transforms.
- Failure mode: no hidden essential text at small card widths.

### 5. Motion Choreography

Proposed copy:

> Easing curves compared as visible motion from center to edge and back.

Content to show:

- A circular/radial motion study where small balls repeatedly move from center toward the radius.
- Each lane uses a different timing feel: linear, ease-out, ease-in-out, spring.
- The comparison should be visible without reading labels.

Interaction contract:

- The animation loops by itself.
- Labels support the motion but do not dominate the card.
- Reduced-motion fallback should leave the balls in comparable positions.

Verification:

- Chrome click on Play changes visible positions/states.
- Failure mode: animation must not run forever without user control.

### 6. Shader Gradient System

Proposed copy:

> Tokenized mesh color, grain, and luminous fields in a continuous loop.

Content to show:

- Askewly palette as an animated mesh or shader-like gradient.
- Controls for intensity, grain, and palette band.
- Token labels only as small support text.

Interaction contract:

- The shader-like surface runs by itself.
- Palette bands and grain should stay inside Askewly tokens.
- Later optional WebGL/canvas only if CSS is not enough.

Verification:

- Chrome control changes rendered gradient.
- Failure mode: no purple-dominated one-note surface.

### 7. Material Surface System

Proposed copy:

> Glass, paper, blur, shadow, and depth rules that keep layered UI readable.

Content to show:

- A polished layered stack with paper, glass, solid, and dim material states.
- Blur, border, shadow, grain, and contrast should look intentional rather than rough CSS blocks.
- Light/dark contrast check built into the demo.

Interaction contract:

- Depth slider changes stack count/elevation.
- Material toggle changes blur, opacity, border, and shadow.
- Layers should remain readable.

Verification:

- Chrome toggles material states and depth.
- Failure mode: text contrast must not collapse on translucent surfaces.

### 8. Image Treatment

Proposed copy:

> Filters, masks, crops, and focus treatments loop through visual tone.

Content to show:

- A wide editorial strip with image treatments.
- Treatment controls: `Duotone`, `Focus`, `Grain`, `Mask`.
- Before/after split or draggable comparison handle.

Interaction contract:

- The treatment loops automatically through duotone, focus, grain, and mask.
- Wide layout uses the 6-column span intentionally.
- Later can use generated or curated image assets.

Verification:

- Chrome filter controls change CSS filter/mask state.
- Failure mode: image should not overpower text or become unreadable.

### 9. Hero Composition

Proposed copy:

> First-viewport structure for headline, proof surface, actions, and scroll continuation.

Content to show:

- A miniature Askewly landing hero with H1, subcopy, CTA, search/proof surface.
- Responsive control for compact vs wide hero.
- Show next-section hint in small form.

Interaction contract:

- Toggle between `Centered`, `Proof`, and `Compact`.
- Resizing/reflow should change layout, not clip copy.
- CTA buttons should have pressed/active states.

Verification:

- Chrome mode switch changes layout and keeps text readable.
- Failure mode: no split hero/card composition that contradicts current design direction.

### 10. Command Center Interface

Proposed copy:

> Keyboard-first control for search, review queues, agent actions, and system status.

Content to show:

- Command palette or dense command center.
- Search input, review queue, actions, status pills.
- Agent actions such as `Generate React`, `Copy tokens`, `Export assets`.

Interaction contract:

- Typing filters actions.
- Mode tabs switch review/ship/agent queues.
- Enter or click marks an action as selected/executed.

Verification:

- Chrome type/click changes filtered results and selected action.
- Failure mode: keyboard controls should not be decorative only.

### 11. Commerce Flow

Proposed copy:

> Product discovery, purchase confidence, cart state, and checkout signals in one buying path.

Content to show:

- Product card, price, variant selector, cart summary.
- Confidence signals: stock, delivery, guarantee, review.
- Add-to-cart and checkout state changes.

Interaction contract:

- Variant changes price or availability.
- Add to cart increments count and reveals cart state.
- Checkout button shows a confirmation or disabled state when invalid.

Verification:

- Chrome click path changes variant/cart/checkout state.
- Failure mode: cart count and price must not desync.

### 12. Mobile App Patterns

Proposed copy:

> Native-feeling compact states for account, alerts, billing, navigation, and thumb-safe actions.

Content to show:

- Phone-like surface with bottom nav.
- Screens: `Home`, `Alerts`, `Billing`, `Settings`.
- Native density, large tap targets, compact content.

Interaction contract:

- Bottom nav switches screens.
- One screen has a toggle or action state.
- Mobile card should feel intentionally mobile, not a web card squeezed down.

Verification:

- Chrome click through nav states.
- Failure mode: no horizontal overflow or illegible tiny text.

## Scope correction (2026-07-07)

**Step 4~11의 데모는 이미 구현돼 있다** (개발 서버 실측 — 12장 전부 인터랙티브 데모 존재, plan 체크박스만 stale이었음). 남은 작업은 "데모 구현"이 아니라 **카드별 품질 폴리싱 + 제목·설명 카피 다듬기**다. 인터랙션은 코드에만 존재하므로 폴리싱 캔버스는 Figma가 아니라 **개발 서버(localhost:5173)** — 카드 하나씩 실측→품질/카피 개선→재확인. 참고 라이브러리: `docs/research/showcase-card-reference-shortlist-2026-07.md` + toolshelf(`magicui`, `cmdk`, `shaders`, `cult-ui`, `react-bits`, `motion`).

## Implementation Step Tree

> Step 4~11 = 이제 "폴리싱 패스"(데모 존재 확인됨). 각 항목: 개발 서버 실측 → 품질 이슈(간격·대비·다크모드·모바일 오버플로우) + 제목·설명 카피 [현행→제안] → 반영 → Chrome 재확인.

- [x] Step 0 - Showcase Atlas High-Impact Taxonomy. (verify: build/lint + taxonomy presence)
- [x] Step 1 - Agent-Ready Design System card polish. (verify: Chrome select/deselect, drag, resize, Button/Card/Hero states — implemented 2026-07-05/06. 2026-07-07 비전 정렬 폴리싱 패스: 우측 파일목록→에이전트 채팅(버블+프롬프트 입력, 컨텍스트 칩, "Claude Code·connected" 양방향 표시), 캔버스 Static/Interactive 태그, Codex/Claude 핸드오프. 채팅 입력 동작·light/dark Chrome 확인)
- [x] Step 2 - Cursor-Reactive Field. (verify: pointer movement changes focus/proximity field without layout jitter — implemented and Chrome-verified in 2026-07-05/06 sessions)
- [x] Step 3 - Physics-Based Interaction. (verify: pointer changes fluid field and nodes stay bounded — implemented as Matter.js rigid-body demo, Chrome-verified, commit 9fd453d)
- [ ] Step 4 - Scroll-Driven Narrative. (verify: auto progress changes chapter, copy, and layers)
- [ ] Step 5 - Motion Choreography. (verify: easing balls loop and remain visually comparable)
- [ ] Step 6 - Shader Gradient System. (verify: self-running gradient loop preserves contrast)
- [ ] Step 7 - Material Surface System. (verify: material states remain readable and tactile)
- [ ] Step 8 - Image Treatment wide strip. (verify: automatic treatment loop changes filter/mask/crop state)
- [ ] Step 9 - Hero Composition. (verify: Askewly hero asset reflows without clipping)
- [ ] Step 10 - Command Center Interface. (verify: mode switch, command filtering, keyboard/click state)
- [ ] Step 11 - Commerce Flow + Mobile App Patterns. (verify: cart path and mobile bottom-nav state)
- [x] Step 11a - Hero/topbar pill-button reconciliation. (verify: B(8px) 픽으로 hero CTA·topbar Pro Plan `rounded-lg` + DESIGN.md §7/§8 개정 + Figma 8px 동기화, computed radius=8px Chrome 확인, 커밋 훅 design lint PASS — 커밋 6344d7b)
- [x] Step 11b - Dark-mode toggle activation. (verify: 탑바 SiteThemeToggle(system/light/dark) 클릭 → `.dark` 적용·localStorage 지속·새로고침 유지, light/dark 스크린샷 `docs/research/evidence/pss2-11b-*` — 커밋 baf6c1b)
- [x] Step 11c - Showcase reduced-motion fallback. (verify: Playwright emulateMedia(reduce)에서 physics/자동재생 카드 정적(innerHTML 무변화) + no-preference에서 낙하·포인터 반응 정상 — 커밋 cf25622)
- [ ] Step 12 - Integrated showcase QA. (verify: desktop/mobile Chrome screenshots, no overlap, no inert controls, build/lint)

## Run Boundary

This plan does not require a new ROADMAP milestone. It is the execution plan for the active `PSS2 - Landing Page Design Quality` milestone.

Implementation should continue one card at a time. Each pass may update `home-page.tsx`, extract local helper components if needed, and record Chrome evidence in the final report. If a card requires external reference research or image generation, pause that card and add a short reference note before implementation.
