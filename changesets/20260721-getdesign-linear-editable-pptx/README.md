# getdesign Linear editable PPTX

## Purpose

Generate a six-slide native PowerPoint deck from the pilot's shared token map and content source.

## Verification

- `npm run generate:pptx` generated `output/askewly-design-intro.pptx`.
- `npm run verify:pptx` confirmed six slides, editable text runs, editable shapes, and zero flattened slide images.
- LibreOffice opened the PPTX and converted it to PDF successfully.
- Rendered PDF pages were visually reviewed for hierarchy, clipping, and surface consistency.

## Human gate

The user must open the PPTX and confirm it can be edited before this pilot is declared complete.
