# Blog Sections imagegen provenance

Date: 2026-07-02

Built-in `image_gen` was used for all image-backed Blog previews. Originals remain under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`; workspace copies are the only files referenced by the app.

## Preview mapping

| Preview | Workspace asset | Generated source | Purpose |
| --- | --- | --- | --- |
| Three-column with images | `examples/ui-vocabulary-site/public/assets/blog-sections/three-column-thumb-1-v2.png` | `ig_0c06644d9fa1abe7016a458df3babc8191aae474821fb8f107.png` | Founder workspace article thumbnail |
| Three-column with images | `examples/ui-vocabulary-site/public/assets/blog-sections/three-column-thumb-2-v2.png` | `ig_0c06644d9fa1abe7016a458e2251ac81919905ad5397804801.png` | Plant-filled sales workspace thumbnail |
| Three-column with images | `examples/ui-vocabulary-site/public/assets/blog-sections/three-column-thumb-3-v2.png` | `ig_0c06644d9fa1abe7016a458e5900b88191ba1b1f353d8eaa7f.png` | Minimal customer-experience studio desk thumbnail |
| Three-column with background images | `examples/ui-vocabulary-site/public/assets/blog-sections/background-card-1-v2.png` | `ig_0c06644d9fa1abe7016a458e856f7c819196289a8d1689d3ad.png` | Dark-overlay conversion article card |
| Three-column with background images | `examples/ui-vocabulary-site/public/assets/blog-sections/background-card-2-v2.png` | `ig_0c06644d9fa1abe7016a458eb6553c81919453f5ede62af77a.png` | Dark-overlay sales optimization card |
| Three-column with background images | `examples/ui-vocabulary-site/public/assets/blog-sections/background-card-3-v2.png` | `ig_0c06644d9fa1abe7016a458f38d2388191aea2933a699e698b.png` | Dark-overlay customer experience card |
| Single-column with images | `examples/ui-vocabulary-site/public/assets/blog-sections/single-column-row-1-v2.png` | `ig_0c06644d9fa1abe7016a458f70633081918130cf8f185cfd5b.png` | Compact growth article row thumbnail |
| Single-column with images | `examples/ui-vocabulary-site/public/assets/blog-sections/single-column-row-2-v2.png` | `ig_0c06644d9fa1abe7016a458fa3b4fc8191a8d7ac7fcf9f264b.png` | Compact sales research row thumbnail |
| Single-column with images | `examples/ui-vocabulary-site/public/assets/blog-sections/single-column-row-3-v2.png` | `ig_0c06644d9fa1abe7016a458fdec0208191911536ddf1279fc2.png` | Compact customer research row thumbnail |
| With photo and list | `examples/ui-vocabulary-site/public/assets/blog-sections/photo-and-list-v2.png` | `ig_0c06644d9fa1abe7016a4590545e7c8191844bf8d381ca6a9d.png` | Large office photo for hiring/list preview |

## Non-image preview decisions

- `Three-column`: text-only Tailwind reference, no image generated.
- `Single-column`: text-only Tailwind reference, no image generated.
- `With featured post`: dark featured article/list Tailwind reference, no image generated.

## Prompt policy

Each image-backed preview received newly generated Blog-specific assets. Assets were not reused from Hero, Feature, CTA, Bento, Header, Stats, Testimonials, or any other previous leaf.
