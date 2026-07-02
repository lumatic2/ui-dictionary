# Content Sections imagegen provenance

Date: 2026-07-02

Built-in `image_gen` was used for all image-backed Content previews. Originals remain under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`; workspace copies are the only files referenced by the app.

## Preview mapping

| Preview | Workspace asset | Generated source | Purpose |
| --- | --- | --- | --- |
| With sticky product screenshot | `examples/ui-vocabulary-site/public/assets/content-sections/sticky-product-screenshot-v2.png` | `ig_0bd178824401ecf8016a459aaa0d6881919378cd34510835c5.png` | Dark project dashboard screenshot |
| With image titles | `examples/ui-vocabulary-site/public/assets/content-sections/image-titles-collage-v2.png` | `ig_0bd178824401ecf8016a459af44070819189e12749f88da999.png` | Remote team mission image tile |
| With image titles | `examples/ui-vocabulary-site/public/assets/content-sections/image-titles-video-call-v2.png` | `ig_075218ce2e67e8c3016a459ce63ae48191b624df68d9e32667.png` | Video-call desk image tile |
| With image titles | `examples/ui-vocabulary-site/public/assets/content-sections/image-titles-workshop-v2.png` | `ig_075218ce2e67e8c3016a459d3a05648191996297f6cb681b4c.png` | Workshop table image tile |
| Two columns with screenshot | `examples/ui-vocabulary-site/public/assets/content-sections/two-column-screenshot-v2.png` | `ig_0bd178824401ecf8016a459b5cf98c81918361aaaacabc15b6.png` | Dark workflow dashboard screenshot |
| Split with image | `examples/ui-vocabulary-site/public/assets/content-sections/split-office-v2.png` | `ig_0bd178824401ecf8016a459bb4ec288191922291525253f3f1.png` | Bright office split image |

## Non-image preview decisions

- `With testimonial`: text and quote-only Tailwind reference treatment, no image generated.
- `With testimonial and stats`: stat/testimonial composition, no image generated.
- `Centered`: article/prose composition, no image generated.

## Prompt policy

All image-backed previews received Content-specific assets. The `With image titles` preview uses three distinct image assets to avoid visible repetition inside the multi-image grid.
