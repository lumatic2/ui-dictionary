# Askewly Design 소개 덱

- 정본: `content/slides.json` (7장, askewly 테마, hd 16:9 — pptx-widescreen-16-9 선언)
- 재생성: `node tools/build-slides.mjs` · 검증: `node tools/validate-slides.mjs --lint` + `node tools/overflow-checker.mjs`
- 로컬 미리보기: `python -m http.server` 후 index.html
- PPTX 파생: `export/` (SL3 실험 — 손편집 금지, 재생성으로만)
