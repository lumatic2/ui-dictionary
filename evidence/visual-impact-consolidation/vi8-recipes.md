# VI8 — 실증 확장 evidence (2026-07-28)

> Milestone: VI8 (goal `visual-impact-consolidation`) · Plan: `plans/2026-07-28-vi8-expressive-recipes.md` · Changeset: `changesets/20260728-vi8-expressive-recipes/`

## 1. recipe 2종 실구현

| recipe | 티어 | 핵심 계약 |
|---|---|---|
| `pinned-scroll-sequence` | ② GSAP ScrollTrigger | 스코프드 scroller(페이지 스크롤 무접촉)·pin+scrub·gsap.context revert·reduced-motion 정적 분기. gsap 신규 의존성 — **별도 청크 69.94kB(gzip 27.41kB)**, dynamic import 로 메인 청크 미증가 |
| `shader-gradient-surface` | ④ Paper Shaders | lazy 경계·로딩/reduced-motion/WebGL 실패가 같은 정적 토큰 그라디언트로 수렴·시맨틱 토큰 CSS 변수 판독(하드코딩 hex 없음) |

갤러리·catalog(47 entries)·llms(164 assets) 전부 등재 — grep 확인.

## 2. 브라우저 실동작 (Playwright, dev 서버 + headless chromium)

```
PASS pinned detail demo mounted steps=3
PASS pin-spacer created (ScrollTrigger active)
PASS scrub drives opacity 0 -> 0.25
PASS shader demo mounted (canvas or fallback) canvas=1
PASS existing reveal demo mounts   (회귀 스모크)
CONSOLE ERRORS: 0
```

- **게이트 적발 결함 1건 (수리 완료)**: 토큰이 `oklch()` 로 저작돼 있는데 Paper Shaders 는 hex/rgb 만 파싱 — 콘솔 에러 "Unsupported color format oklch(…)" 2건. 1×1 canvas fillStyle 경유 sRGB hex 정규화로 수리 후 재검증 에러 0. ("유닛 통과 ≠ 실표면 동작"의 재실증 — build·lint 는 이 결함을 못 봤다.)
- catalog 추출기 계약 적발 1건: exported 데모의 JSX return 이 2개면 build:catalog 거부 — 단일 return 으로 재구성.

## 3. three-scene 상호 링크

- `recipes/application-ui/lazy-three-object-scene.md` §Related media contract 신설 (슬라이드 매체 ↔ 웹 매체 게이트 차이 명시).
- custom-skills `promoted/presentation-slides-yusung/references/interactive.md` §three-scene 에 역링크 1줄 — 커밋 `89752c6`, `setup.sh` 배포(출고 정합 통과), origin push 완료.

## 4. 회귀 게이트

- build ✓ 981ms · lint exit 0 · validate-recipes `recipes ok: 47` (신규 2종의 적발 5건 — 필수 섹션 2·프리미티브 토큰 3 — 전부 교정 후).
- 실배포 확인은 세션 말 push 후 갤러리 라우트에서.
