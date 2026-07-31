# Codex Image Deck

재생성:

```powershell
node tools\export-pptx-bespoke.mjs export\askewly-pipeline-recap.pptx
pwsh C:\Users\yusun\.codex\skills\presentation-slides-yusung\scripts\pptx-to-png.ps1 -PptxPath export\askewly-pipeline-recap.pptx -OutputDir export\png
Copy-Item export\png\*.png .
```

- 콘텐츠 원본: `content/pptx-composition.json`
- PPTX 생성 코드: `tools/export-pptx-bespoke.mjs`
- 생성 이미지 프롬프트: `imagegen-prompts.md`
