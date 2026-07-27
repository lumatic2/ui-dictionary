# UE3 배치 2 — 남은 Page Sections 14종 레퍼런스 장부

> 2026-07-28 작성 · 소비처: milestone UE3 배치 2 (`plans/2026-07-28-ue3-batch2-remaining-sections.md` step-2·3·4)
> 규칙: 참고·재해석만 — 스크린샷 게재·픽셀 복제 금지. 전 항목 출처 URL + 접근일.
> 기존 변형 수(실측, `marketingSectionPages` 파싱): hero 12 · feature 15 · pricing 12 · cta 11 · bento 3 · newsletter 6 · stats 8 · testimonials 8 · blog 7 · contact 7 · team 9 · content 7 · logo-clouds 6 · faqs 7 — 합 118.

## O10 중복감 점검 (내부 실측 — 구현 step 에서 설명 대비·콘텐츠 시나리오 차별화로 조치)

| 카테고리 | 중복 위험 군집 | 조치 방향 |
|---|---|---|
| Hero | 스크린샷 계열 4종(split screenshot/bordered screenshot/bordered app/app screenshot) · 이미지 계열 3종(split image/angled/offset) | 라이트-SaaS vs 다크-스포트라이트 vs 카드 프레임 축을 설명·mock 으로 명시 대비 |
| Feature | 스크린샷 계열 5종(product/large/bordered/left/panel) · 2x2 계열 2종(centered/offset) | 스크린샷 위치·프레임·패널 유무 축을 각 설명 첫 구에 박기 |
| CTA | simple 계열 3종(stacked/centered/justified) · 다크 계열 2종(panel/app screenshot) | 정렬 축(세로 쌓기/중앙/양끝) 명시 |
| FAQs | three columns ±centered · two columns ±centered | 정렬 파생임을 설명에 상호 참조 |
| Team | 그리드 계열 6종(small/medium/large/round/large-round/card) | 아바타 크기·형태 축 명시 |

## 그룹 A — Hero · CTA · Pricing (리서치: sonnet 위임, 전 URL fetch 검증)

### Hero Sections (기존 12)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| A-H1 | SaaSFrame — 10 SaaS Landing Page Trends 2026 https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples | 2026-07-28 | 2026 히어로는 정적 스크린샷 대신 히어로 안에 인터랙티브 가이드 투어(embedded demo)를 직접 심는 방향(Amplitude·Forest Admin·Zendesk) |
| A-H2 | Memorable Design — Top Hero Section Examples 2026 https://memorable.design/hero-section-examples/ | 2026-07-28 | 8 골격 분류(Centered Minimalist·Split·Product-First·Social Proof·Video BG·Dark·Asymmetrical Grid·Problem/Solution) — 우리 목록과 다수 겹침 확인 |
| A-H3 | Tailwind Plus Heroes (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/heroes | 2026-07-28 | 우리 12종의 원 분류와 일치 확인 |
| A-H4 | MockFlow — 8 SaaS Website Design Trends 2026 https://mockflow.com/blog/saas-website-design-trends | 2026-07-28 | "Product-led hero" — 대시보드 UI 즉시 노출 + 주/보조 CTA + 근접 proof point 표준화 |

**갭 G-A1** `hero-interactive-tour`: 히어로 영역이 정적 이미지가 아니라 클릭 가능한 단계별 가이드 투어 위젯(hotspot·진행 단계)인 골격 — 기존 스크린샷 계열 4종은 전부 정적 자산(근거 A-H1·A-H4). 데모에서는 카드 안 시뮬레이션(단계 전환 실동작)으로 재해석.

### CTA Sections (기존 11)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| A-C1 | Tailwind Plus CTA sections (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/cta-sections | 2026-07-28 | 우리 11종의 원 분류와 일치 확인 |
| A-C2 | Digital X Labs — Sticky CTAs and Floating Buttons https://www.digitalxlabs.io/blogs/web-design/sticky-cta-design | 2026-07-28 | 문서 흐름 밖 fixed 오버레이(얇은 바/pill) — in-flow 섹션과 골격이 다름 |
| A-C3 | LandingPageFlow — Best CTA Placement Strategies 2026 https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages | 2026-07-28 | 배치 전략 5개 중 Sticky/Floating CTA 를 별도 유형으로 명시 — 모바일 엄지 반경 상시 노출 |
| A-C4 | SaaSFrame (A-H1 재인용) https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples | 2026-07-28 | persistent sticky CTA("Schedule a demo" 단일 행동 라벨) 2026 트렌드 재확인 |

**갭 G-A2** `cta-sticky-bar`: 스크롤 고정 얇은 바 + 모바일 pill 골격 — 기존 11종은 전부 in-flow(근거 A-C2·A-C3). 데모에서는 카드 안 하단 고정 시뮬레이션으로 재해석.

### Pricing Sections (기존 12)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| A-P1 | Tailwind Plus Pricing (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/pricing | 2026-07-28 | 우리 12종의 원 분류와 일치 확인 |
| A-P2 | Spike AI — SaaS Pricing Page Examples 7 Patterns 2026 https://getspike.ai/blog/saas-pricing-page-examples-and-patterns/ | 2026-07-28 | PostHog 를 "Interactive Calculator" 패턴으로 명시 — 슬라이더 조작 시 월 비용 실시간 갱신 |
| A-P3 | PostHog pricing (라이브 사례) https://posthog.com/pricing | 2026-07-28 | 정적 티어 카드 대신 제품별 계산기 + 사용량 구간 요금표 실물 확인 |
| A-P4 | Khod.io — 23 Best Pricing Page Examples 2026 https://www.khod.io/resource-center/articles/pricing-page-examples | 2026-07-28 | Interactive Calculators 를 별도 구조 유형으로 분류(PostHog·Privy·Aircall) |

**갭 G-A3** `pricing-usage-calculator`: 슬라이더 입력으로 월 비용이 실시간 재계산되는 계산기형 골격 — 기존 12종은 전부 정적 티어/비교표(근거 A-P2·A-P3·A-P4). 데모는 실동작 슬라이더로 구현.

## 그룹 B — Feature · Bento · Stats · Testimonials (리서치: sonnet 위임 + 오케스트레이터 보충, 전 URL fetch 검증)

### Feature Sections (기존 15)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| B-F1 | Tailwind Plus Feature Sections (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/feature-sections | 2026-07-28 | 우리 15종의 원 분류와 일치 확인 |
| B-F2 | SaaSFrame — 10 SaaS Landing Page Trends 2026 https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples | 2026-07-28 | 정적 스크린샷 대신 인터랙티브 데모 임베드 + before/after split 흐름 |
| B-F3 | Guideflow — Best 7 ways to embed demos 2026 https://www.guideflow.com/blog/embed-demos-landing-pages | 2026-07-28 | 데모 임베드 배치 7종(inline·modal·floating·lightbox·scroll-triggered·takeover·personalized) — 클릭으로 제품을 조작하는 골격 |
| B-F4 | SaaSFrame — Designing Bento Grids 2026 practical guide https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide | 2026-07-28 | 중요도=박스 크기의 비대칭 모자이크 — 균일 그리드와 다른 원리 |

**갭 G-B1** `feature-interactive-demo`: 정적 스크린샷 패널이 아니라 클릭으로 화면이 전환되는 인라인 데모 패널 골격(근거 B-F2·B-F3). G-A1(히어로 투어: hotspot·단계 진행)과 골격 구분 — 이쪽은 패널 안 뷰 전환.

### Bento Grids (기존 3)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| B-B1 | SaaSFrame — 43 SaaS Bento Grid Examples https://www.saasframe.io/patterns/bento-grid | 2026-07-28 | 실서비스 43건 — 타일 크기 제각각인 비대칭 배치가 공통 특징 |
| B-B2 | SaaSFrame — Designing Bento Grids 2026 (B-F4 재인용) https://www.saasframe.io/blog/designing-bento-grids-that-actually-work-a-2026-practical-guide | 2026-07-28 | 1x1/2x1/2x2/3x2 크기 배수 기반 모자이크 시스템 |
| B-B3 | SaaSFrame — 10 SaaS Landing Page Trends 2026 (B-F2 재인용) https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples | 2026-07-28 | 복잡한 제품에 벤토 그리드가 2026 상위 트렌드 재확인 |

**갭 G-B2** `bento-asymmetric-mosaic`: 행/열 수로 정의되는 기존 3종과 달리 셀 크기(1x1·2x1·2x2)가 섞인 비대칭 모자이크 골격(근거 B-B1·B-B2).

### Stats (기존 8)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| B-S1 | Tailwind Plus Stats (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/stats-sections | 2026-07-28 | 우리 8종과 정확히 일치 |
| B-S2 | SaaSFrame — Stats patterns https://www.saasframe.io/patterns/stats | 2026-07-28 | 굵은 타이포+데이터 시각화 카드, 벤토 결합 사례 — 기존 골격 범주 내 |
| B-S3 | One Page Love — Metrics 태그(144건 큐레이션) https://onepagelove.com/tag/statistics | 2026-07-28 | 실서비스 144건 갤러리 — 그리드/스플릿/타임라인 변형 스펙트럼이 기존 8종 범주와 겹침 (오케스트레이터 직접 검증 — 위임분 2건이 fetch 실패로 폐기돼 보충) |

**갭 없음** — 3 소스의 구조가 기존 8종 골격 안에 들어감. 스크롤 카운터 애니메이션은 인터랙션 트렌드일 뿐 레이아웃 골격 아님.

### Testimonials (기존 8)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| B-T1 | Tailwind Plus Testimonials (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/testimonials | 2026-07-28 | 우리 8종과 일치 |
| B-T2 | Unsection — Testimonial Section Design https://www.unsection.com/category/testimonial-section-design | 2026-07-28 | 비대칭 크기 벤토형 테스티모니얼 그리드를 별도 축으로 소개 |
| B-T3 | GetPureProof — Video Testimonials Guide 2026 https://www.getpureproof.com/resources/video-testimonials-guide | 2026-07-28 | "Wall of Love" — 짧은 영상 클립이 masonry 셀을 채우는 골격 |

**갭 G-B3** `testimonials-video-wall`: 텍스트 인용이 아니라 영상 타일(포스터+재생 UI)이 masonry 벽을 이루는 Wall of Love 골격(근거 B-T3). 벤토형 후보는 Bento Grids 카테고리와의 O10 충돌로 미채택.

## 그룹 C — Newsletter · Blog · Contact · Team · Content · Logo Clouds · FAQs (리서치: sonnet 위임, 전 URL fetch 검증)

### Newsletter Sections (기존 6)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-N1 | Tailwind Plus Newsletter (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/newsletter-sections | 2026-07-28 | 우리 6종 — 전부 정적 폼 배치 |
| C-N2 | Omnisend — 25 Newsletter Signup Examples 2026 https://www.omnisend.com/blog/newsletter-signup-examples/ | 2026-07-28 | 스핀휠·퀴즈 게임화 폼이 2025-26 구조 축 — 인터랙티브 위젯이 섹션 본체 |
| C-N3 | Moosend — 15 Newsletter Signup Examples https://moosend.com/blog/newsletter-signup-examples/ | 2026-07-28 | 멀티스텝 임베드·플로팅 바 등 전개 다양 — 폼 골격은 대체로 기존 범주 |

**갭 G-C1** `newsletter-gamified-quiz`: 이메일 입력 전에 취향 질문(퀴즈)이 먼저 오는 게임화 골격 — 기존 6종은 전부 즉시 입력 폼(근거 C-N2). 데모는 실동작 스텝 전환.

### Blog Sections (기존 7)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-B1 | Tailwind Plus Blog Sections (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/blog-sections | 2026-07-28 | 우리 7종 — 정적 그리드 계열 |
| C-B2 | Unsection — Blog Section Design https://www.unsection.com/category/blog-section-design | 2026-07-28 | 카드/리스트/캐러셀 혼재 — 대부분 기존 범주 |
| C-B3 | Marketer Milk — 30 best blog designs 2026 https://www.marketermilk.com/blog/best-blog-designs | 2026-07-28 | Rise Science·Webflow — 고정 카테고리 사이드바 + 스크롤 콘텐츠 영역 짝 구조 |

**갭 G-C2** `blog-sticky-sidebar`: 고정 사이드바(카테고리 내비) + 우측 글 목록 골격 — 기존 7종은 전부 균일 컬럼/단일 featured(근거 C-B3).

### Contact Sections (기존 7)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-C1 | Tailwind Plus Contact (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/contact-sections | 2026-07-28 | 우리 7종 — 폼/그리드/이미지 조합 |
| C-C2 | Unsection — Contact Section Design https://www.unsection.com/category/contact-section-design | 2026-07-28 | 폼·연락처 그리드·위치 표시 — 전부 정적 폼/카드 계열 |
| C-C3 | Colorlib — 20 Best Contact Us Pages 2026 https://colorlib.com/wp/contact-us-pages/ | 2026-07-28 | split-screen·지사 그리드 — 기존 축과 겹침 |

**갭 없음** — 2025-26 사례가 기존 7종 골격 범주 안. 채팅형 후보는 소스 fetch 403 으로 미검증 — 미채택(인용 규칙).

### Team Sections (기존 9)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-T1 | Tailwind Plus Team (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/team-sections | 2026-07-28 | 우리 9종 — 전부 규칙적 그리드/버티컬 배열 |
| C-T2 | HTMLBurger — 18 Meet the Team Examples https://htmlburger.com/blog/meet-the-team-website-examples/ | 2026-07-28 | Automattic 지도 필터링·FCINQ 산개형 원형 헤드샷 + 확대 인터랙션 — 비그리드 |
| C-T3 | Vandelay Design — Team Page Design Trends https://www.vandelaydesign.com/team-staff-page-design-trends/ | 2026-07-28 | 호버 리빌형·풀블리드 버티컬 분할형이 2025-26 축 |

**갭 G-C3** `team-scatter-reveal`: 원형 아바타가 비그리드로 산개 배치되고 선택 시 인물 정보가 리빌되는 골격(근거 C-T2). 데모는 실동작 선택 전환.

### Content Sections (기존 7)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-O1 | Tailwind Plus Content (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/content-sections | 2026-07-28 | 우리 7종 — 단일 지배 요소(스크린샷+텍스트 짝·프로즈) 중심 |
| C-O2 | SaaSFrame — 10 SaaS Landing Page Trends 2026 (재인용) https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples | 2026-07-28 | 상위 SaaS 67%가 벤토 모자이크를 콘텐츠/기능 섹션에 사용 |
| C-O3 | Framiq — Best SaaS Landing Pages 2026 https://framiq.app/blog/best-saas-landing-pages-2026 | 2026-07-28 | Linear 다크+벤토·Crisp 좌우 교차 스크린샷 흐름 |

**갭 없음(조정)** — 리서치가 제시한 벤토 모자이크 골격은 **Bento Grids 카테고리 소관**이라 여기 추가하면 카테고리 간 중복(O10 의 컬렉션판)이 된다. G-B2 로 흡수. 좌우 교차 흐름은 기존 two-column/split 계열 범주 내.

### Logo Clouds (기존 6)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-L1 | Tailwind Plus Logo Clouds (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/logo-clouds | 2026-07-28 | 우리 6종 — 전부 정적 배치 |
| C-L2 | Unsection — Logo Section Design https://www.unsection.com/category/logo-section-design | 2026-07-28 | 그리드/카드/벤토 배치 — 정적 다수 |
| C-L3 | DiviLover — Infinite Scrolling Logo Section https://divilover.com/create-an-infinite-scrolling-logo-section-divi-tutorial/ | 2026-07-28 | 로고 행 복제 + 무한 좌측 이동 마퀴 — 애니메이션이 골격 자체 |

**갭 G-C4** `logo-cloud-marquee`: 끊김 없이 흐르는 무한 마퀴 골격 — 기존 6종은 전부 고정 배치(근거 C-L3). CSS 애니메이션 실동작.

### FAQs (기존 7)

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| C-F1 | Tailwind Plus FAQ (패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/faq-sections | 2026-07-28 | 우리 7종 — 아코디언/컬럼 나열형, 검색 요소 없음 |
| C-F2 | Slider Revolution — Best FAQ Section Designs https://www.sliderrevolution.com/design/faq-section-design-examples/ | 2026-07-28 | 대형 FAQ 에서 탭+아코디언·검색바+아코디언 하이브리드 |
| C-F3 | FAQPage.com — FAQ Accordion Design Guide https://www.faqpage.com/faq-accordion-design | 2026-07-28 | 50문 이상엔 검색바+아코디언 권장 — 검색 입력이 리스트 상단에 붙는 구조 |

**갭 G-C5** `faqs-search-accordion`: 아코디언 위 실시간 필터 검색 입력이 결합된 골격(근거 C-F2·C-F3). 데모는 실동작 필터.

## 포화 판정

14 카테고리 전부 ≥3 검증 소스 + 갭 판정 완료. 갭 채택 11건(G-A1·G-A2·G-A3·G-B1·G-B2·G-B3·G-C1·G-C2·G-C3·G-C4·G-C5) · 갭 없음 3건(Stats·Contact·Content — 각 근거 명시). 위임분 중 fetch 미검증 후보(Stats 2건·Contact 채팅형)는 인용 규칙에 따라 폐기·미채택. 전 데모는 재해석 구현 — 픽셀 복제 없음.
