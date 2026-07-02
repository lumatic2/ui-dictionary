# Contact Sections imagegen provenance

Date: 2026-07-02

Built-in `image_gen` was used for the single image-backed Contact preview. The original remains under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471`; the workspace copy is the only file referenced by the app.

## Preview mapping

| Preview | Workspace asset | Generated source | Purpose |
| --- | --- | --- | --- |
| Split with image | `examples/ui-vocabulary-site/public/assets/contact-sections/split-office-v2.png` | `ig_0368c3daddf6cb42016a4592e5ba8c81918f0ddbedf27fd122.png` | Bright collaborative office scene for the split contact form image |

## Non-image preview decisions

- `Centered`: form-only Tailwind reference, no image generated.
- `Side-by-side grid`: contact/location card grid Tailwind reference, no image generated.
- `Split with pattern`: dark patterned form Tailwind reference, no image generated.
- `Simple four-column`: office address list Tailwind reference, no image generated.
- `Simple centered`: support contact list Tailwind reference, no image generated.
- `With testimonial`: dark form/testimonial Tailwind reference, no image generated.

## Prompt policy

The generated image is Contact-specific and was not reused from Blog, Testimonials, Stats, Header, Bento, CTA, Feature, Hero, or any other leaf.
