# 404 Pages imagegen provenance

Date: 2026-07-02
Mode: built-in image_gen

## Split with image

Workspace asset:

`examples/ui-vocabulary-site/public/assets/404-pages/split-desert-v2.png`

Original generated image:

`C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0722a0e19e371514016a45f16f57d48191a3c4fb2fce3be8d5.png`

Prompt:

```text
Use case: photorealistic-natural
Asset type: website 404 page split-panel image, right half of a Tailwind-style preview
Primary request: a quiet wide desert dune landscape for a lost-page recovery screen
Scene/backdrop: pale sand dunes under a soft hazy blue sky, minimal and spacious
Subject: a single very small distant person walking away across the dunes, placed low in frame for scale
Style/medium: photorealistic editorial travel photography
Composition/framing: wide horizontal crop, lots of negative space, horizon in upper third, no foreground clutter
Lighting/mood: soft daylight, calm, slightly overcast, airy
Color palette: warm sand, pale beige, muted blue sky
Constraints: no text, no logos, no watermark, no UI, no frame, no border, no extra people, no vehicles
```

## With background image

Workspace asset:

`examples/ui-vocabulary-site/public/assets/404-pages/background-mountains-v2.png`

Original generated image:

`C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\ig_0722a0e19e371514016a45f194b07081918396e475831862c8.png`

Prompt:

```text
Use case: photorealistic-natural
Asset type: website 404 page full background image, Tailwind-style preview
Primary request: a muted mountain landscape for a full-bleed background 404 recovery screen
Scene/backdrop: rugged gray mountain ridgeline and open desert foothills beneath a clear washed teal sky
Subject: distant mountain range, no prominent people, no buildings
Style/medium: photorealistic editorial landscape photography
Composition/framing: wide horizontal crop, mountains along lower third, spacious sky above for centered white page text
Lighting/mood: calm daylight, slightly desaturated, premium travel editorial feel
Color palette: cool gray rock, muted sage/teal sky, soft beige ground
Constraints: no text, no logos, no watermark, no UI, no frame, no border, no dramatic sunset, no city, no snow
```

## Rule

Preview-level visual parity uses fresh purpose-fit generated assets per image-backed preview. Do not reuse this leaf's desert image for the background preview, do not reuse the background image for the split preview, and do not reuse either image for future leaves.
