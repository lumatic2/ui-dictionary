# Slide Style Preset — MiniMax-derived PPT prompt (SP1 lab)

> 영상 ②(프롬프트 커스터마이즈) 등가 산출물. 원본: `research/sources/minimax-design-md.md` (getdesign.md, 접근일 2026-07-31).
> 영상 규칙 반영: 프롬프트 본문은 영어 유지("디자인 프롬프트는 한글보다 영어로 훨씬 잘 알아들으니까" [03:30]). 상태: draft → step-2 캘리브레이션 후 v1 확정.
> 편차 기록: 영상은 폰트 파일·로고 파일을 대화창에 업로드했다 — 등가 치환: Pretendard는 CDN(로컬 설치 폰트) 참조, 로고는 텍스트 워드마크 "Askewly" (레포에 로고 파일 없음 — 장부 기재).

## Customized prompt (English — the equivalent of the video's project instructions)

You are producing presentation slides. Use the MiniMax design system tokens below as the visual foundation, with the following overrides and slide-specific rules.

### Overrides (my brand, not MiniMax's)

1. **Font**: Use only **Pretendard** for all text. Do not use DM Sans or any other font. Map all `fontFamily: DM Sans` tokens to Pretendard. Keep the original size/weight/line-height/letter-spacing scale.
2. **Logo**: Use the text wordmark **"Askewly"** (Pretendard 600, 14px, ink color) instead of the MiniMax logo. Never draw or imitate the MiniMax logo.
3. **Aspect ratio**: Every slide is **16:9** (1280×720 logical canvas). Never produce any other ratio.

### Slide layout rules (the video's step-2 "PPT 기본 사항")

4. **Fixed anchor positions on every content slide**: chapter label (top-left, caption-bold, steel color), title (heading-lg, ink), subtitle (subtitle token, slate) — same x/y position on every page. Title and subtitle sit close together (subtitle directly under title, gap ≤ 12px).
5. **Body density**: do not leave the lower third of the body area empty. Fill with content blocks (cards, charts, key-value rows) without harming readability.
6. **Page footer**: page number bottom-left, logo wordmark bottom-right (the video swapped these two — we adopt the swapped layout as our default).
7. **Color discipline**: white canvas (`#ffffff`), near-black ink (`#0a0a0a`), one restrained key color per deck chosen from the brand gradient set (coral `#ff5530` / magenta `#ea5ec1` / blue `#1456f0` / purple `#a855f7`). Use the key color only for accents: chapter label, data highlights, dividers, chart series.
8. **Cards**: use `card-base` (white, 1px hairline `#e5e7eb`, radius 16px, padding 24px) and `card-feature` (surface `#f7f8fa`, radius 16px, padding 32px) for grouping. Product-gradient cards are reserved for cover/section-break slides only.
9. **Charts**: charts must be real data-driven charts (never images of charts). Chart series colors come from the brand set; axis text = body-sm; grid lines = hairline-soft `#eaecf0`.
10. **Copywriting tone**: short declarative title, one-line supporting subtitle per slide. No filler bullet walls.

### Token reference (from MiniMax DESIGN.md — keep as-is unless overridden above)

- colors: canvas `#ffffff` · surface `#f7f8fa` · surface-soft `#f2f3f5` · hairline `#e5e7eb` · ink `#0a0a0a` · slate `#45515e` · steel `#5f5f5f` · muted `#a8aab2` · brand set (coral/magenta/blue/purple above)
- typography scale (Pretendard): hero-display 80/600/-2px · display-lg 56/600/-1.5px · heading-lg 40/600/-1px · heading-md 32/600 · heading-sm 24/600 · card-title 20/600 · subtitle 18/500 · body-md 16/400 · body-sm 14/400 · caption 13/400 · micro 12/400
- rounded: md 8 · lg 12 · xl 16 · hero 32 · full 9999
- spacing: xs 8 · sm 12 · md 16 · lg 20 · xl 24 · xxl 32 · section 64

## 캘리브레이션 로그 (step-2 — 영상 ③ 등가, 1장 왕복 3회)

테스트 슬라이드: `content/slides.json` 1장 (한일 AI 리터러시 비교, comparison-2col — 영상 [04:03] 예시 주제 재현). 스크린샷: `evidence/slide-pipeline/img/lab-calib-r{1,2,3}.png`.

| 회차 | 관측 편차 | 교정 지시 (반영 diff) |
|---|---|---|
| r1 | ① 챕터명 부재 ② 제목 중앙정렬 ③ 제목-부제 간격 과다(18px+) ④ 카드 보더 2색 혼용(보라·코랄) ⑤ 푸터가 규칙 6 불일치(넘버 중앙·로고 부재) | ① kicker 필드 사용 ② `.title/.subtitle/.slide-header` 좌측 정렬(cover·closing 예외) ③ title margin 18→8px, subtitle 34→20px(본문 비례 상향 — 영상 교정 항목 그대로) ④ `.comparison-panel` border-top → `--accent-start` 단일화 ⑤ 푸터 넘버 좌하단·"Askewly" 워드마크 우하단 (shell.mjs) |
| r2 | 제목 x축(80px)과 카드 x축(120px) 기준선 불일치 | `.slide-header` max-width 1040px + margin auto — 콘텐츠 그리드와 기준선 일치 |
| r3 | 수렴 — 편차 0 (validate·build·overflow PASS) | v1 확정 |

교정은 전부 덱 로컬 `tools/` 사본에만 반영 (스킬 소스 무접촉). 콘솔 에러는 favicon 404 1건뿐(무해).

## Changelog

- 2026-07-31 v1 — 캘리브레이션 3회 왕복 수렴, 좌측 앵커·단일 키컬러·푸터 규칙 확정.
- 2026-07-31 draft — 영상 ② 등가: 폰트/로고/비율 3요소 + 레이아웃 규칙 4~10 반영.
