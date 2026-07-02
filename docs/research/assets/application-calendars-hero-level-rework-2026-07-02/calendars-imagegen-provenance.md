# Calendars imagegen provenance

Date: 2026-07-02
Leaf: Application UI / Data Display / Calendars
Mode: built-in image_gen

## Generated assets

| Preview | Workspace asset | Source generated image |
| --- | --- | --- |
| Small with meetings | `examples/ui-vocabulary-site/public/assets/calendars/calendar-small-meetings-sheet-v2.png` | `C:/Users/yusun/.codex/generated_images/019f1a9a-1c5f-7a40-81e5-606a8918e471/ig_031bd4e78edeb14e016a46159c6b4c81919ae88dbbd53a3ef7.png` |
| Double | `examples/ui-vocabulary-site/public/assets/calendars/calendar-double-sheet-v2.png` | `C:/Users/yusun/.codex/generated_images/019f1a9a-1c5f-7a40-81e5-606a8918e471/ig_031bd4e78edeb14e016a461606b550819199e64d9060f5457d.png` |
| Borderless stacked | `examples/ui-vocabulary-site/public/assets/calendars/calendar-borderless-stacked-sheet-v2.png` | `C:/Users/yusun/.codex/generated_images/019f1a9a-1c5f-7a40-81e5-606a8918e471/ig_031bd4e78edeb14e016a461667e9b8819194e80cd58e44190d.png` |
| Borderless side-by-side | `examples/ui-vocabulary-site/public/assets/calendars/calendar-borderless-side-by-side-sheet-v2.png` | `C:/Users/yusun/.codex/generated_images/019f1a9a-1c5f-7a40-81e5-606a8918e471/ig_031bd4e78edeb14e016a4616be83d4819188f84e9dd07aa35c.png` |

## Prompt pattern

Each prompt requested a square 2x2 contact sheet with four distinct realistic professional head-and-shoulders profile portraits, tuned to the target preview:

- Small with meetings: neutral bright SaaS meeting attendees.
- Double: darker executive calendar attendees for a dark UI.
- Borderless stacked: compact mobile schedule attendees with bright neutral backdrops.
- Borderless side-by-side: collaborative schedule attendees with calm teal/blue office tones.

Shared constraints:

- No text, logos, watermarks, hands, or props.
- Exact 2x2 composition.
- One centered face per quadrant.
- Suitable for tiny circular UI crops.

## Policy note

The calendar renderer deliberately uses one unique contact sheet per image-backed preview. It does not reuse a single avatar set across multiple previews.
