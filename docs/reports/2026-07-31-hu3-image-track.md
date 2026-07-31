# 완료 — HU3 이미지 표현 트랙 (goal `html-upgrade` 3/4)

> 완료: 2026-07-31 · HU3 (goal `html-upgrade`) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 changeset·커밋·evidence 에.

## 1. 결과

HTML 덱이 이미지 3원천을 계약으로 갖게 됐다: `references/imagery.md`(실사진 소스 맵 Pexels·Adobe Free·Burst + 라이선스 장부 규율 · 누끼 `rmbg` · 생성 codex exec image_gen — 팔레트 hex 고정·이미지 안 글자 금지·치수 가드) + 커버 풀블리드 히어로(스크림이 텍스트 대비 소유). fixture 에서 3원천 전부 실투입 — 스톡 다운로드·rmbg 실행·image_gen 실위임(1672×941, 16:9 정합) — 하고 standalone 인라인까지 오프라인 검증. custom-skills 3커밋(ba00378→509de6b) 배포·push.

## 2. 이슈와 해결

- 커버 미디어 미표시(slide-content relative 가 absolute 앵커 가로챔) → cover 한정 static 오버라이드, 라운드 3회로 수렴.
- sourceNote 의 긴 URL 이 기존 린트 경고 — 장부 참조형으로 정정(장부는 덱 README).
- split-screen sourceNote 가 미디어와 겹치는 기존 배치 발견 — HU4 재관측 대상으로 기록(이번 회귀 아님).

## 3. 증거

- changeset: custom-skills `changesets/20260731-hu3-image-track` (step 3절)
- 검증: `evidence/html-upgrade/hu3-image-track.md` — 3원천 실렌더 스크린샷 3장, 치수 가드 통과, `STANDALONE-OFFLINE PASS`(5.96MB·요청 0), 출처 장부 4행, shelf used rmbg.
- 크기 회고: changeset 1디렉터리·3절 — 라벨 정합.
- 실표면: fixture 덱을 Chrome 실개봉 — 스톡 커버 스크림 가독·누끼 투명 PNG·생성 커버 3장 육안 + 오프라인 file:// 재개봉.
- 재현: `curl(Pexels CDN) && bash ~/bin/rmbg <in> <out> && codex exec "<imagery.md 템플릿 프롬프트>" && node tools/build-slides.mjs && node tools/export-standalone.mjs`
