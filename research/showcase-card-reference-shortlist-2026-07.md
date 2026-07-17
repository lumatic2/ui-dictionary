# Interactive Product-UI Component Research — Showcase Card Reference Shortlist

- Target repo: `ui-dictionary` (Askewly Design) — 12 showcase cards on landing page, React + TypeScript + Tailwind stack.
- Goal: find *new* reference material (not already in toolshelf: react-bits, motion/Framer Motion, Matter.js, animated-grid-lines, jquery.ripples, simple-water-waves-shader, landing-love, Brainwave-Interactive-Landing).
- Access date for all sources below: **2026-07-07** (via WebSearch; primary candidates cross-checked but not all individually WebFetched — see caveats).

---

## 1. Summary — Top Picks

1. **Magic UI** (`magicuidesign/magicui`) — MIT, fully open source, copy-paste React+Tailwind+Framer Motion components. Best general-purpose reference for cards 5 (Motion Choreography), 6 (Shader/Gradient — has `AnimatedGradientText`, `Meteors`, `BorderBeam`), 9 (Hero Composition), and marketing polish generally. Cleanest license story of the "Aceternity-family" libraries — no restrictions, actively maintained, growing faster than Aceternity per 2026 comparisons.
2. **`@paper-design/shaders-react`** (`paper-design/shaders`) — zero-dependency canvas/WebGL shaders (`MeshGradient`, `StaticMeshGradient`, and more), installable via npm or usable as copy-paste code exported from the Paper design tool. Free for commercial/non-commercial use *except building a competing product*. Directly maps to card 6 (Shader Gradient System) — likely the single best fit found.
3. **`cmdk`** (`pacocoursey/cmdk`, distributed as `cmdk` on npm) — the unstyled command-menu primitive that shadcn/ui's own `Command` component wraps. MIT, tens of millions of weekly downloads, de facto standard. Directly maps to card 10 (Command Center).
4. **Aceternity UI free tier** (`ui.aceternity.com`, components collected across many small repos under the `aceternity` GitHub org and community mirrors) — MIT for the free component set (Pro tier has marketplace-resale restrictions only, not usage restrictions). Bolder, more "3D card / spotlight / magnetic button" effects than Magic UI — good secondary reference for cards 2 (Cursor-Reactive Field), 7 (Material Surface System — 3D card/glare), 9 (Hero Composition).
5. **GSAP + ScrollTrigger demo hub** (`demos.gsap.com`, `gsap.com/scroll`, CodePen "ScrollTrigger Showcase" collection) — GSAP core is now free for all use (including commercial) as of the 2024 Webflow acquisition; ScrollTrigger demos are the deepest available library of scroll-driven storytelling patterns. Directly maps to card 4 (Scroll-Driven Narrative). Note: this is a demo/reference gallery, not a component library to install — use it as technique reference, re-implement with our own motion primitives if we want to stay off a GSAP dependency, or add GSAP directly since it's free now.

Runners-up worth a lighter look: **Cult UI** (MIT, shadcn-compatible, niche "design engineer" components — good for card 1/7), **`whatamesh`** (Stripe-style mesh gradient WebGL, ISC-ish permissive but *not* an npm package — copy the ~800-line script), **React Native Reusables** (shadcn-for-RN, MIT, card 12 reference even though our stack is web).

---

## 2. Candidate Table

| Name | URL | What it provides | License | Useful card(s) | Install/usage | Maturity signal |
|---|---|---|---|---|---|---|
| Magic UI | https://github.com/magicuidesign/magicui | 50+ animated React/Tailwind/Framer Motion components (gradient text, meteors, border beam, marquee, bento grids, animated lists) | MIT (confirmed via `LICENSE.md`) | 5 Motion Choreography, 6 Shader Gradient, 9 Hero Composition | copy-paste via CLI (`npx shadcn add <url>`) or manual copy from site | Actively maintained 2026, large Discord, "growing faster than Aceternity" per comparison sources |
| Aceternity UI (free tier) | https://ui.aceternity.com/ | 3D card, spotlight, magnetic button, particle backgrounds, background beams | MIT for free components; Pro tier = Aceternity License (no resale/marketplace redistribution, but end-product commercial use fine) | 2 Cursor-Reactive Field, 7 Material Surface System, 9 Hero Composition | copy-paste, Framer Motion + Tailwind dependency | Long-running, widely cited, but per 2026 sources Magic UI has overtaken it in momentum |
| Cult UI | https://github.com/nolly-studio/cult-ui | shadcn-compatible "design engineer" niche components (dynamic islands, text morph, family button, etc.) | MIT (confirmed) | 1 Agent-Ready Design System (editable canvas widgets), 7 Material Surface System | shadcn registry copy-paste | Smaller than Magic UI/Aceternity but MIT-clean and shadcn-native |
| HextaUI | https://github.com/preetsuthar17/HextaUI / hextaui.com | React component library, Tailwind-based | 미확인 (not verified in this pass) | possible 5/9 | shadcn-style copy-paste (typical for this family) | Present but not deeply vetted this round — needs a follow-up license check before use |
| Kokonut UI | https://github.com/kokonut-labs/kokonutui | React 19 + Tailwind v4 + shadcn/ui + Motion (Framer Motion v12) components | MIT (confirmed) | 5 Motion Choreography, 7 Material Surface | copy-paste / shadcn registry | Actively maintained, modern stack (Tailwind v4, React 19) — useful if repo upgrades stack |
| Syntax UI | (not resolved to a specific repo in this pass) | unclear | 미확인 | — | — | Search did not surface a canonical repo distinct from generic "syntax highlighting" results — **treat as unconfirmed, do not shelve without a direct follow-up search** |
| `@paper-design/shaders` / `@paper-design/shaders-react` | https://github.com/paper-design/shaders | Zero-dependency canvas/WebGL shaders: `MeshGradient`, `StaticMeshGradient`, noise/plasma/dot-grid shaders | Free for commercial + non-commercial use, with a "may not compete with Paper/Paper Shaders" clause (not pure MIT — read full license before shipping a competing shader tool) | 6 Shader Gradient System | `npm i @paper-design/shaders-react`, then `<MeshGradient colors={...} distortion speed swirl />` | Actively maintained, has a visual design tool (Paper) backing it, npm package with real version history |
| `whatamesh` | https://github.com/jordienr/whatamesh | Stripe-style animated mesh gradient (WebGL canvas, ~800 lines, the same technique Stripe/Luma use) | 미확인 — appears permissive/open but no explicit license text surfaced in search; verify before use | 6 Shader Gradient System | not an npm package — copy the JS file and call `initGradient(canvasId)` | Small, single-purpose, widely referenced/forked (e.g. `shaunchander/animated-mesh-gradients-with-whatamesh`) as the canonical "how Stripe does it" implementation |
| `JohnnyLeek1/React-Mesh-Gradient` | https://github.com/JohnnyLeek1/React-Mesh-Gradient | React wrapper for interactive mesh gradients | 미확인 | 6 Shader Gradient System | npm package | Smaller/less active than paper-design — secondary option only |
| `cmdk` | https://github.com/pacocoursey/cmdk (npm: `cmdk`) | Unstyled, accessible command-menu/combobox primitive — fuzzy filter + keyboard nav, style with Tailwind | MIT | 10 Command Center | `npm i cmdk`, compose `<Command>`, `<Command.Input>`, `<Command.List>` | De facto standard — shadcn/ui's own Command component wraps it; tens of millions of weekly downloads |
| `react-cmdk` | https://github.com/albingroen/react-cmdk | Prebuilt, pre-styled command palette (uses Headless UI internally) | 미확인 (verify before use) | 10 Command Center | npm package, more opinionated/pre-styled than cmdk | Smaller alternative if a ready-made look is wanted instead of a primitive |
| GSAP + ScrollTrigger (core + demo hub) | https://gsap.com/scroll/ , https://demos.gsap.com/plugin/scrolltrigger/ , CodePen collection https://codepen.io/collection/DkvGzg | Scroll-pinning, scrubbing, parallax, staged reveal techniques; huge demo library (parallax gallery, cinematic map reveal, marquee frames) | GSAP core + all plugins (incl. ScrollTrigger) are free for all use since the 2024 Webflow acquisition — verify current terms at gsap.com/pricing before adding as a dependency | 4 Scroll-Driven Narrative | `npm i gsap`, register `ScrollTrigger`, use refs + cleanup in React | Industry-standard scroll library; demo hub is the deepest single source of scroll-narrative technique references found |
| React Native Reusables | https://github.com/founded-labs/react-native-reusables | shadcn/ui brought to React Native via NativeWind | MIT (typical for shadcn-family; verify) | 12 Mobile App Patterns | CLI copy-paste, React Native + NativeWind stack | Actively maintained, closest "shadcn-quality" reference for RN if we ever port; for a *web* Tailwind reference of mobile patterns it's secondary to hand-rolled bottom nav CSS |
| Ecommerce Starter Kit (bundui) | https://allshadcn.com/templates/ecommerce-starter-kit/ (GitHub via bundui) | Free, open-source shadcn-based product/cart/checkout blocks | Reported free/open-source, no tiers — verify exact license on repo before use | 11 Commerce Flow | shadcn registry copy-paste | Early-stage but explicitly free; simplest no-strings option found for commerce blocks |
| easings.net | https://github.com/ai/easings.net | Easing-function cheat sheet + visual curve reference (not a component lib) | 미확인 (small reference site, check repo license) | 5 Motion Choreography | reference only — read curve definitions, reimplement with our own motion tokens | Long-standing, widely linked reference; not code you'd copy-paste, more a design reference for choosing/comparing eases |

---

## 3. toolshelf 등재 추천 (shelve candidates)

For each: category, type, one-line summary, one-line invoke note, caveats.

1. **magicuidesign/magicui**
   - category: `ui-components` (or repo's existing frontend/design category)
   - type: reference
   - summary: MIT React/Tailwind/Framer Motion component library — cleanest license, best general showcase-card reference (gradient text, border beam, meteors, bento grids).
   - invoke: `shelf.py shelve magicuidesign/magicui --category ui-components`
   - 주의: still Framer Motion-coupled like the toolshelf's existing `motion` entry — dedupe check against that entry's coverage before treating as a separate "new technique" source.

2. **paper-design/shaders**
   - category: `ui-components` or new `shaders` subcategory
   - type: reference
   - summary: zero-dependency WebGL mesh-gradient/shader library (`@paper-design/shaders-react`) — direct fit for card 6 Shader Gradient System.
   - invoke: `shelf.py shelve paper-design/shaders --category shaders`
   - 주의: license has a "no competing product" clause — fine for our internal design-system use, but note before any redistribution.

3. **pacocoursey/cmdk**
   - category: `ui-components`
   - type: reference
   - summary: unstyled command-menu primitive (the one shadcn/ui's Command wraps) — direct fit for card 10 Command Center.
   - invoke: `shelf.py shelve pacocoursey/cmdk --category ui-components`
   - 주의: none significant — MIT, extremely stable dependency.

4. **jordienr/whatamesh**
   - category: `shaders`
   - type: reference
   - summary: ~800-line WebGL script recreating the Stripe animated mesh-gradient effect — lighter-weight alternative to paper-design/shaders for card 6.
   - invoke: `shelf.py shelve jordienr/whatamesh --category shaders`
   - 주의: license not confirmed in this pass — verify repo LICENSE before treating as safe-to-copy; not an npm package (manual file copy only).

5. **GSAP ScrollTrigger demo hub (not a repo — bookmark reference)**
   - category: `motion-reference`
   - type: reference (external site, not shelvable as a git repo — record as a bookmark/notes entry if toolshelf supports non-repo references, otherwise skip formal shelving and just link from `knowledge/` or `methodology/`)
   - summary: largest available library of scroll-driven storytelling technique demos for card 4.
   - invoke: n/a (browse-only reference)
   - 주의: GSAP core+ScrollTrigger licensing changed favorably in 2024 (free for all use) — reconfirm current terms at gsap.com/pricing before adding `gsap` as an actual npm dependency to the demo app.

Not recommended for shelving without further verification: **Syntax UI** (repo not confidently resolved), **HextaUI** (license unverified), **react-cmdk** (license unverified, and `cmdk` alone likely sufficient).

---

## 4. Caveats / Follow-ups

- Licenses marked "미확인" were not independently confirmed via WebFetch of a LICENSE file in this pass — only search-summary claims. Before shipping any copied code from HextaUI, `whatamesh`, `react-cmdk`, `React-Mesh-Gradient`, `easings.net`, or the bundui Ecommerce Starter Kit, do a direct repo LICENSE check.
- "Syntax UI" could not be resolved to a canonical GitHub repo distinct from unrelated "syntax highlighting" search noise — needs a targeted follow-up search (e.g. `site:github.com "syntax-ui"` or checking if it's a Figma-only product) before any shelving decision.
- No individual candidate was WebFetched for a live demo screenshot in this pass (search-only research per time budget) — recommend a quick `/browse` pass on the top 3 picks (Magic UI, paper-design/shaders demo page, cmdk demo) before committing implementation time.

---

## Sources (all accessed 2026-07-07)

- https://www.pkgpulse.com/guides/aceternity-ui-vs-magic-ui-vs-shadcn-animated-react-2026
- https://ui.aceternity.com/guides/best-react-ui-components-2026
- https://www.pkgpulse.com/guides/react-bits-animated-components-2026
- https://github.com/magicuidesign/magicui
- https://github.com/magicuidesign/magicui/blob/main/LICENSE.md
- https://ui.aceternity.com/licence
- https://pro.aceternity.com/licence
- https://github.com/nolly-studio/cult-ui
- https://github.com/nolly-studio/cult-ui/blob/main/LICENSE.md
- https://github.com/kokonut-labs/kokonutui
- https://kokonutui.com/
- https://github.com/preetsuthar17/HextaUI
- https://github.com/paper-design/shaders
- https://shaders.paper.design/mesh-gradient
- https://www.npmjs.com/package/@paper-design/shaders-react
- https://github.com/jordienr/whatamesh
- https://github.com/JohnnyLeek1/React-Mesh-Gradient
- https://github.com/pacocoursey/cmdk (via search result referencing cmdk npm package)
- https://github.com/albingroen/react-cmdk
- https://react-cmdk.com/
- https://gsap.com/scroll/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://demos.gsap.com/plugin/scrolltrigger/
- https://codepen.io/collection/DkvGzg
- https://github.com/founded-labs/react-native-reusables
- https://github.com/Mobilecn-UI/nativecn-ui
- https://allshadcn.com/templates/ecommerce-starter-kit/
- https://github.com/ai/easings.net
- https://easings.net/
