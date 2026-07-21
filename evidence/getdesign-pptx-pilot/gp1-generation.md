# GP1 generation evidence

Date: 2026-07-21

## Automated checks

- `npm run build`: PASS.
- `npm run generate:pptx`: PASS.
- `npm run verify:pptx`: PASS — 6 slides, native text, native shapes, no flattened images.
- LibreOffice headless conversion: PASS — the generated PPTX opened and converted to PDF.

## Visual checks

- Web preview checked in Chrome at desktop and 390px width.
- PDF render checked for all six slides: no clipped title/body text, no overlap, and the project-owned dark surface ladder with one lavender accent remains consistent.

## Pending human gate

Open `examples/getdesign-pptx-pilot/output/askewly-design-intro.pptx` in a presentation editor and change a text box and a rectangle. Record the result before closing GP1.
