# getdesign → editable PPTX pilot

This is a thin local proof that one project-owned `DESIGN.md` can guide both a web page and an editable PowerPoint deck.

## Run

```bash
npm install
npm run dev
npm run generate:pptx
npm run verify:pptx
```

The generated deck is `output/askewly-design-intro.pptx`. Its text boxes and shapes are native PowerPoint objects, not slide screenshots.

## Inputs and boundaries

- `DESIGN.md` owns the pilot's visual decisions.
- `source-intake.md` records the getdesign Linear analysis and what was deliberately excluded.
- `src/theme.mjs` is the token map consumed by both the web page and the PPTX generator.
- This is a pilot, not a global Codex/Claude slide command yet.
