# Feature Sections Image Generation Provenance - 2026-07-02

## Rule

Image-bearing Feature Section previews use fresh v2 screenshot assets for this rework. Existing non-v2 assets remain in place but are not used by the updated screenshot previews.

## Selected Assets

| Workspace asset | Source generated file | Use |
| --- | --- | --- |
| `examples/ui-vocabulary-site/public/assets/feature-sections/dashboard-product-screenshot-v2.png` | `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0ffda53084546962016a45729834988191b58a77c8361a70cf.png` | `With product screenshot` |
| `examples/ui-vocabulary-site/public/assets/feature-sections/large-dark-screenshot-v2.png` | `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0ffda53084546962016a4572dfc4fc8191af0f479f6e495991.png` | `With large screenshot` |
| `examples/ui-vocabulary-site/public/assets/feature-sections/bordered-project-screenshot-v2.png` | `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0ffda53084546962016a457328dbf88191816d2e648223fb6f.png` | `With large bordered screenshot` |
| `examples/ui-vocabulary-site/public/assets/feature-sections/left-support-screenshot-v2.png` | `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0ffda53084546962016a457371b86c8191a4d2959492c3f05a.png` | `With product screenshot on left` |
| `examples/ui-vocabulary-site/public/assets/feature-sections/contained-analytics-screenshot-v2.png` | `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0ffda53084546962016a4573b79580819184bb645776674a55.png` | `With product screenshot panel` |

## Inspection

- All five generated screenshots were inspected with `view_image`.
- No watermark, real brand logo, people, or photographic content was found.
- Text is generic dashboard UI labeling and is acceptable for small product screenshot use.

## Prompt Pattern

Each asset used a separate built-in `image_gen` call with:

- use case: `ui-mockup`
- asset type: feature section product screenshot
- style: high-fidelity Tailwind-like SaaS dashboard screenshot
- composition: wide 16:10, no browser chrome
- constraints: no watermark, no real company logos, no photographic content, no people
