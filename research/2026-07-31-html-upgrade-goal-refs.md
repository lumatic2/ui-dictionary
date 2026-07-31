# HTML 슬라이드 업그레이드 — 레퍼런스 수집·분석 (goal 개설 재료)

> 2026-07-31 · 소비처: 차기 goal `html-upgrade` 계획서(/harness-plan) — 이 문서가 그 계획의 재료 수집 산출물이다.
> 방법: sonnet 리서치 에이전트 3본 병렬(① GitHub 프레임워크 지형 ② 품질 기법·실전 ③ AI 생성 동향) + 현행 스킬 트랙 기준선 인라인 대조.
> 배경(사용자, 2026-07-31): 해커톤 발표·순위 발표·강의에서 HTML 덱이 실제로 쓰이는 것을 관측 — "퀄리티만 충분히 올리면 매력적인 자산"이라는 판단에서 HTML 제작 단계 업그레이드 축 개설.
> 인용 규칙 준수: 외부 사실은 출처 URL + 접근일(전부 2026-07-31). 에이전트가 "미확인"으로 표기한 것은 그대로 유지 — 수치 발명 금지.

## 0. 기준선 — 현행 스킬 트랙 (presentation-slides-yusung)

- `content/slides.json` 단일 원본 → builder 생성(`NN-*.html`·index·print), 16:9 고정 논리 캔버스 `hd`.
- 레이아웃 18종(정적 14 + 인터랙티브 4), 테마 dark/light/askewly + DESIGN.md→theme.json custom.
- 게이트 G1~G7(자료→구성안→문구→디자인→**캘리브레이션(대표 1장 수렴)**→검증→export).
- 검증: validate(+거장 원칙 린트 R1~R3)·build·overflow-checker·Chrome 실조작.
- export 3트랙: raster PDF / vector PDF / PPTX(범용 + bespoke — PB1·PB2로 방금 완주).

## 1. 프레임워크 지형 (GitHub) — 활발히 유지되는 상위 5

| 프레임워크 | Star(대략) | 최근 활동 | 아키텍처 |
|---|---|---|---|
| [reveal.js](https://github.com/hakimel/reveal.js/) | 72.1k | v6.0.1 릴리스 2026-04 | 순수 HTML/TS |
| [Slidev](https://github.com/slidevjs/slidev) | 47.9k | 지속 커밋 | Markdown+Vue+Vite |
| [impress.js](https://github.com/impress/impress.js) | 38.2k | 커밋 2026-07-23 | 순수 HTML/CSS3 3D |
| [Marp 계열](https://github.com/marp-team/marp) | 11.6k+cli 3.7k | 조직 단위 유지 | Markdown→HTML/PDF/PPTX |
| [Spectacle](https://github.com/FormidableLabs/spectacle) | 10.1k | 커밋 2026-04 | React/JSX |

유지보수 중단(참고만): WebSlides(2020 정지 — 단 CSS 클래스 조합 카탈로그 방식은 우리 아키텍처와 가장 가까운 선례), remark(2021 정지 — 단일 HTML 파일 배포 철학), mdx-deck(code surfing), shower(엔진-테마 분리), bespoke.js(최소 코어+플러그인). 인접: Motion Canvas(19k — 비디오 도구, 카테고리 제외), **Presenton**([presenton/presenton](https://github.com/presenton/presenton) — 2025 등장 AI-우선 오픈소스 생성기, 목적이 우리와 가장 가까운 최근 진입자 → 벤치마크 대상).

**차용 후보 top 5** (에이전트 판정): ① reveal.js fragment/Auto-Animate(속성 선언만으로 단계 공개·요소 보간) ② Slidev named layout preset(frontmatter 키워드 — 우리 layout 필드와 동형, 이미 보유) ③ Marp theme directive 한 줄 스위칭(이미 보유 — template 필드) ④ shower 엔진-테마 분리(이미 보유 — builder/src vs theme) ⑤ remark 단일 HTML 파일 배포(미보유).

## 2. 품질 기법 (HTML 덱을 좋아 보이게 만드는 것)

이미 보유: 고정 캔버스+스케일 접근·타이포 위계·아이콘 규율(SVG/lucide)·overflow 검사·스크린샷 캘리브레이션.

**신규 후보** (출처는 에이전트 보고서 원문 — 대표만 병기):

1. **폰트 preload + `font-display` 규율** — FOIT/FOUT로 발표 첫 화면·Playwright 캡처가 폰트 미로딩 상태로 뜨는 사고 방지. `<link rel="preload" as="font">` + swap/optional. ([Chrome DevDocs font-display](https://developer.chrome.com/docs/lighthouse/performance/font-display), 2026-07-31)
2. **스피커 노트 듀얼스크린 뷰** — reveal.js `S`키 별도 창(다음 슬라이드 프리뷰 포함) 패턴. 현행은 노트가 JSON·PPTX 이관에만 존재, 발표 중 볼 수단 없음. ([reveal.js Speaker View](https://revealjs.com/speaker-view/), 2026-07-31)
3. **PDF export 노트 옵션** — reveal.js `showNotes`(오버레이/별도 페이지) 동형 플래그를 우리 export 트랙에. ([reveal.js PDF Export](https://revealjs.com/pdf-export/), 2026-07-31)
4. **단일 파일 오프라인 배포** — 에셋 base64 인라인으로 완전 독립 HTML 1개(발표장 Wi-Fi 리스크 대비). base64 ~33% 오버헤드 유의. ([DevPry base64 embed](https://devpry.com/blog/embed-images-base64-html/), 2026-07-31)
5. **모션 규율 명문화** — transform/opacity만(GPU 합성)·stagger 8~10개 상한·`prefers-reduced-motion` 가드. ([LogRocket staggered animations](https://blog.logrocket.com/css-staggered-animations/), 2026-07-31)
6. **프레젠테이션 모션 문법: fragment(단계 공개)** — 현행 덱은 슬라이드 진입 애니메이션은 있으나 "클릭당 요소 공개"가 없음. reveal.js fragment/Slidev click 시스템이 표준. ([reveal.js](https://revealjs.com/), [Slidev Animation](https://sli.dev/guide/animations), 2026-07-31)
7. **프로젝터 실측 게이트** — 밝은 방=밝은 배경, 프로젝터 색 왜곡은 실기기 확인 필수, 텍스트 대비 WCAG AAA 7:1 권장. ([SlideBazaar](https://slidebazaar.com/blog/design-presentations-that-for-dark-rooms-with-high-contrast-settings/), 2026-07-31)
8. **Bento 그리드 레이아웃** — 차트/인용/이미지를 모듈 블록으로 한 장에 조합 — 2026 트렌드, 레이아웃 프리셋 후보. ([Envato 2026 trends](https://elements.envato.com/learn/presentation-design-trends-ppt), 2026-07-31)

미확인(추정 금지 표기 유지): View Transitions API×슬라이드 프레임워크 실결합 사례, 유명 keynote 웹덱 화제 요인 분석, 리모컨 클리커 키 매핑 세부.

## 3. AI 생성 동향 — 시장 검증

- **Tome 2025-04 서비스 종료**(카테고리 과포화) · Gamma 등 독자 렌더러는 PPTX export 시 레이아웃 붕괴 불만 다수 — **순수 HTML+표준 웹 스택 출력(우리)이 구조적으로 유리**하다는 시장 방증. ([slidegmm.ai Tome migration](https://www.slidegmm.ai/en/blog/tome-alternatives-2026-migration-ranked), [24slides Gamma review](https://24slides.com/presentbetter/gamma-app-review), 2026-07-31)
- 커뮤니티 검증 패턴 vs 우리: 아웃라인 승인(=G2)·스타일 값 고정 주입(=theme 토큰)·스크린샷 자기검사(=G5·PNG 루프) — **이미 보유**. 신규: **few-shot 예시 슬라이드 선제작**(완성 장 3개를 (지시, 결과) 쌍으로 넣어 나머지 전파 — 우리 G5 "한 장 수렴 후 전파"의 형식화 근거), 콘텐츠/레이아웃 분리+Reviewer/Refiner 루프 연구([arXiv 2502.15412](https://arxiv.org/abs/2502.15412v1), 2026-07-31).
- Claude Code 스킬 생태계: Marp/reveal.js 스킬 다수(`robonuggets/marp-slides`, `nibzard/marp-slide-quality` 등), Anthropic 공식은 pptx 스킬만 — **HTML 슬라이드 전용 공식 스킬 없음**(우리 스킬의 포지션 공백 확인). ([anthropics/skills](https://github.com/anthropics/skills), [AI-Presentation-Builders-Index](https://github.com/danielrosehill/AI-Presentation-Builders-Index), 2026-07-31)

## 4. 격차 판정 — 업그레이드 후보 (기준선 대조 완료)

**A. 발표 운영력 (현행 최대 공백 — 해커톤·강의 실사용 직결)**
- A1 스피커 노트 듀얼스크린 뷰 (§2-2)
- A2 단일 파일 오프라인 배포 export (§2-4, remark 철학)
- A3 PDF 노트 포함 옵션 (§2-3)

**B. 프레젠테이션 모션 문법**
- B1 fragment/단계 공개 시스템 (§2-6 — 키보드 진행당 요소 reveal, exportFallback은 전체 표시)
- B2 모션 규율 명문화 (§2-5 — style-system.md에 GPU 속성·stagger 상한·reduced-motion)

**C. 시각 품질 인프라**
- C1 폰트 preload/`font-display` 규율 (§2-1 — 캡처 파이프라인 신뢰성에도 직결)
- C2 프로젝터 실측 게이트 (§2-7 — G6/G7 하위 체크 후보)
- C3 Bento 그리드 레이아웃 프리셋 (§2-8)

**D. 워크플로우 형식화**
- D1 few-shot 예시 장 선제작 패턴을 G5 계약에 형식화 (§3)
- D2 Presenton 벤치마크 정밀 조사 (별도 리서치 후보)

**이미 앞서 있는 것 (재확인 — 손대지 않음)**: 토큰 SSOT+매체별 게이트, 구성안 승인 게이트, 스크린샷 캘리브레이션 루프, 검증된 export round-trip(PPTX bespoke 포함), 순수 HTML 출력 포지션.

## 5. 내부 자산 발굴 — KG·toolshelf (사용자 확장 요청 2026-07-31)

kg discover + shelf recall 실측 (접근 2026-07-31):

- **AI-slop 스멜 테스트 8항** — KG `design-prompt-ai-slop-smell-test-검수` + `design-prompt-break-default-aesthetic-창출` (원출처 = 이 레포 `methodology/prompt-patterns.md`): 디폴트 그림자(0 4px 12px rgba(0,0,0,.1))·보라/파랑 그라데이션 CTA·라운드 8/12px·Inter/Geist 단일 폰트·좌텍스트-우일러스트 히어로·white-on-gray 카드+1px 보더·CTA 화살표 아이콘·#111 다크. → 슬라이드판 번안해 검증 규율에 배선할 재료.
- **거장 5원칙** — KG `slide-deck-convergent-principles`: 이미 validate `--lint` 로 배선됨(재확인).
- **아이콘** — shelf `lucide-react`·`lobe-icons`: 스킬 §6 계약(이모지 금지, lucide/lobe SVG)과 일치 — 린트 강제 후보.
- **실사진 소스** — shelf `adobe-stock-free`·`burst-shopify`(라이선스 확인 계약 포함). Pexels 는 셸프 미등재(사용자 언급 — 소스 맵에 추가 후보). 누끼 = 로컬 `rmbg`(rembg+BiRefNet).
- **생성 이미지** — PB2 하이브리드 트랙의 codex exec image_gen 프롬프트 템플릿(`decks/claude-ppt-lab/codex-image-deck/imagegen-prompts.md` — 팔레트 hex 고정·글자/로고 금지) 재사용.
- **벤치마크 참고** — shelf `slides-grab`(agent-first HTML 슬라이드 하네스, bbox 시각 편집·PNG/PDF/PPTX export)·`graphcon-deck`. KG `html-first-slide-export-pipeline`(export 3등급 지도 — 기존 결정과 정합).

## Changelog

- 2026-07-31 신설 — 리서치 에이전트 3본 종합, goal `html-upgrade` 개설 재료.
- 2026-07-31 §5 추가 — KG·toolshelf 내부 자산 발굴(사용자 확장 요청: AI-slop 회피·아이콘·이미지).
