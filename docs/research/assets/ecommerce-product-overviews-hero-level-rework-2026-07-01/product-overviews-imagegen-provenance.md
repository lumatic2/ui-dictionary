# Product Overviews Imagegen Provenance - 2026-07-01

Built-in `image_gen` was used once per Product Overviews preview. The generated files were copied into the workspace and the originals were left under `C:\Users\yusun\.codex\generated_images\019f1a9a-1c5f-7a40-81e5-606a8918e471\`.

## Workspace Assets

| Preview | Workspace asset | Source generated file | Prompt summary |
| --- | --- | --- | --- |
| With image grid | `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/image-grid-backpack.png` | `ig_06aa513183869cb9016a450941a6088191b89bc544f1d6227b.png` | Modern soft-sided charcoal travel backpack on warm light gray studio backdrop. |
| With tiered images | `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/tiered-sling-bag.png` | `ig_06aa513183869cb9016a45095cfac88191811a29ab487cabf5.png` | Olive canvas modular camera sling bag on pale stone studio backdrop. |
| With image gallery and expandable details | `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/gallery-duffel.png` | `ig_06aa513183869cb9016a45099be1208191b4bb7fd73c0cb196.png` | Tan canvas weekender duffel bag with leather handles on bright off-white studio backdrop. |
| Split with image | `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/split-tote.png` | `ig_06aa513183869cb9016a4509c2e0448191aef5413c51e8b6f4.png` | Deep navy slim everyday tote bag in a neutral beige studio corner. |
| With tabs | `examples/ui-vocabulary-site/public/assets/ecommerce-product-overviews/tabs-pouch.png` | `ig_06aa513183869cb9016a450a02c3348191957ce0264b914ef5.png` | Muted clay red compact technical pouch organizer on cool white studio table. |

## Rule

For image-backed parity passes, generate a fresh purpose-fit imagegen asset per individual preview. Do not reuse imagery from another preview or leaf. If a preview contains a gallery, internal thumbnail reuse is acceptable only when it represents alternate crops of that preview's own generated product image and is documented.

