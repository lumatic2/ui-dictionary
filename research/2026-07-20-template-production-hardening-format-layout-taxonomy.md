# 포맷별 레이아웃 아키타입 리서치 — Template Production Hardening

- 작성일: 2026-07-20
- 목적: `packages/template-core/src/blueprints/registry.ts`의 "-split" 3종(모든 슬롯을 x+24 / width-48로 기계적으로 이동시킨 clone)을 대체할, 실제로 구별되는 6개 blueprint(포맷당 2개)를 설계하기 위한 근거 자료.
- 현재 상태 확인: `registry.ts:36-44`에서 `formatPackCatalog`가 `blueprintRegistry` 3종을 그대로 넣고, 각각을 `structuredClone` 후 모든 슬롯 bounds에 동일한 x/width 변형만 적용해 `-split` 변종을 만든다. 이는 방향·비율·그리드 구조가 전혀 바뀌지 않는 "가짜 변주"다.

---

## 1. 명함 (Business Card)

### 1.1 인정된 구성 아키타입

리서치 소스는 대부분 벤더/프린트 업체 블로그(listicle 성격)이지만, 반복적으로 등장하는 축은 안정적이다.

- **Orientation(방향)**: horizontal(landscape, 클래식) vs vertical(portrait, 크리에이티브 업종 선호) — [Brandly, Vertical Business Card Designs](https://www.brandly.com/blog/vertical-business-card-designs/) (접속 2026-07-20), [DesignWiz, Business Card Size Guide](https://designwiz.com/blog/business-card-size/) (접속 2026-07-20)
- **Alignment(정렬)**: centered(대칭, 클래식·프리미엄 마감에 적합) vs left-aligned(콘텐츠 밀도 높은 카드에 유연) — [OddPlanPrint, Business Card Layout Guide](https://oddplan.com/blogs/articles/business-card-layout-guide) (접속 2026-07-20)
- **Grid**: landscape는 3-column, portrait는 2-column 그리드가 관행 — 동일 출처(OddPlanPrint)
- 기타 언급된 archetype 이름(열거형, listicle 근거만): left-rail accent bar, full-bleed photo back, split-field(로고/텍스트 대 컬러 블록), minimal type-only — [DesignWiz, 15 Types of Business Cards](https://designwiz.com/blog/types-of-business-cards/) (접속 2026-07-20)

### 1.2 표준 규격 / 도련(bleed) / 안전영역(safe area)

| 규격권 | 재단 크기 | 도련 포함 작업 크기 | 안전영역 |
|---|---|---|---|
| 미국/캐나다 | 3.5 × 2 in (88.9 × 50.8mm) | 3.75 × 2.25 in (0.125in=3mm 도련) | 재단선 안쪽 0.125in, 즉 3.25 × 1.75in | 
| 유럽 대부분 | 85 × 55mm | — | — |
| 한국 표준(90×50) | 90 × 50mm | 96 × 56mm (사방 3mm 도련) | 84 × 44mm (사방 3mm) |
| 한국 글로벌형(85×55) | 85 × 55mm (신용카드 규격) | 동일 원리(사방 3mm) | 동일 원리 |

출처: [Apex Workwear, Business Card Bleed and Safe Area](https://apexworkwear.ca/business-card-bleed-and-safe-area/) (접속 2026-07-20), [PrintingForLess, Standard Business Card Dimensions](https://www.printingforless.com/resources/business-card-size-specifications/) (접속 2026-07-20), [파란디자인, 명함 사이즈 완벽 가이드](https://parancompany.co.kr/blog/business-card-size) (접속 2026-07-20), [오프린트미, 명함 사이즈 90×50 vs 85×55](https://www.ohprint.me/blog/business-card-size-guide-90x50-85x55) (접속 2026-07-20)

한/미 도련 관행은 동일(사방 3mm ≈ 0.125in)하지만 **재단 크기 자체가 다르다** — 90×50(한국 전통, 신뢰·정석 인상, 금융/법률/공공 영업직 선호) vs 85×55(카드지갑 규격, IT/디자인/스타트업 선호, 미국 3.5×2in와도 비율이 다름: 90/50=1.8, 85/55≈1.545, 3.5/2=1.75). 즉 한국 시장 자체에 이미 **두 개의 인정된 표준 종횡비**가 공존하며, 이는 명함 포맷의 blueprint 분화 축으로 그대로 쓸 수 있다 (출처: 오프린트미, 위 링크).

### 1.3 무엇이 두 명함을 "다르게" 느끼게 하는가

가장 근거 있는 단일 축은 **orientation(가로/세로)**이다. 이유:
1. 방향 전환은 그리드 자체를 바꾼다(3-column landscape → 2-column portrait), 즉 슬롯 위치뿐 아니라 슬롯 구조가 달라진다.
2. 업종·톤(전통/신뢰 vs 크리에이티브)과 직결되는 관습적 신호다.
3. 종횡비가 뒤집히므로 초상/로고 등 image 슬롯의 배치 논리(좌측 rail vs 상단 밴드)도 자연히 달라진다.

alignment(centered vs left) 축도 유효하지만 orientation보다 시각적 구별력이 약하다(같은 가로 카드에서 정렬만 바꾼 것은 사용자가 "다른 구성"으로 인지하기 어려울 수 있음).

---

## 2. 제품 포스터 (Product Poster)

### 2.1 인정된 구성 아키타입

- **Hero-image-dominant**: 이미지가 화면 대부분을 차지, 텍스트는 하단/오버레이에 압축 — 관행적으로 널리 쓰이는 이커머스/제품 광고 패턴 (일반적으로 통용, 별도 1차 출처는 확인 실패 — "출처 확인 실패")
- **Swiss/grid, type-dominant**: 모듈러 그리드 기반, 큰 타이포그래피가 이미지보다 우선, 비대칭 레이아웃 — [Farringtons, Swiss Style and Grid Systems](https://farringtonsgraphics.edublogs.org/swiss-tour-poster/) (접속 2026-07-20), [Envato, Swiss Style graphic design](https://elements.envato.com/learn/swiss-style-graphic-design) (접속 2026-07-20)
- **Split(양분) 이미지-텍스트**: 화면을 이미지 블록 / 텍스트 블록으로 나눔, single-column(비대칭, rule of thirds) vs double-column(Z자 읽기 패턴, 이미지·텍스트 교차) — [Icons8, Creative Poster Design Explained](https://icons8.com/blog/articles/creative-poster-design-explained/) (접속 2026-07-20), [GridMakerPro, Editorial grid for posters](https://gridmakerpro.com/grids/design-templates/poster-editorial/) (접속 2026-07-20)
- **Grid/modular (다단 컬럼)**: 매거진처럼 6/8/12 컬럼으로 이미지·텍스트가 행을 공유 — 동일 출처(Icons8/GridMakerPro)

### 2.2 표준 종횡비 및 위계(hierarchy) 관행

- A-시리즈(A3/A2/A1)는 1:√2(≈1:1.414) 고정 비율로 서로 매끄럽게 스케일되지만 미국 규격과는 정확히 맞지 않음 — [PixExact, Poster Size Guide](https://www.pixexact.com/blog/poster-size-guide) (접속 2026-07-20)
- 미국 표준: 18×24in(457×610mm, 2:3, ≈1:1.333)와 24×36in(610×914mm, 2:3) — 동일 출처
- 헤드라인 > 이미지 > 날짜/장소 등 부가정보 순으로 스케일 위계를 준다는 것이 일관된 관행 — [DesignYourWay, Understanding Poster Sizes](https://www.designyourway.net/blog/poster-sizes/) (접속 2026-07-20)
- 타이포 스케일 예시(24×36in 기준): 헤드라인 72pt+, 본문 24pt+ — 동일 출처. 현재 `product-poster-hero`는 1080×1350(4:5, 인스타그램 세로형 소셜 규격)로 인쇄 표준과는 다른 디지털/소셜 규격을 쓰고 있음 — 이는 포스터 인쇄 규격이 아니라 소셜 크리에이티브 규격이라는 점을 명시할 필요 있음(레지스트리 파일 직접 확인).

### 2.3 무엇이 두 포스터를 "다르게" 느끼게 하는가

가장 근거 있는 단일 축은 **image-to-text ratio(이미지 대 텍스트 면적비) 및 그에 따른 그리드 구조**다. 이유:
1. hero-image-dominant(이미지 ~60-70% 면적, 텍스트는 하단 캡션 밴드)와 Swiss/type-dominant(텍스트·타이포가 주역, 이미지는 보조 모듈)는 근본적으로 다른 정보 우선순위를 표현한다 — Swiss style 원전에서 "objectivity·grid 기반의 타이포 우선" 자체가 사진 중심 광고와 대비되는 지점으로 서술됨(Farringtons/Envato).
2. 이 축은 단순 좌표 이동이 아니라 슬롯의 상대적 크기(bounds.width/height 비율) 자체를 바꾸므로, registry.ts의 현재 "-split" 방식(모든 슬롯 동일 offset)과 구조적으로 다른 변형이 강제된다.
3. orientation은 포스터엔 덜 유효하다(대부분 세로 고정 관행이 강함 — 본 리서치에서 poster orientation 자체를 뒤집는 관행은 확인되지 않음, "출처 확인 실패").

---

## 3. 인포그래픽 (Infographic)

### 3.1 인정된 구조 아키타입

10대 유형(통계/big-stat, informational, timeline, process/flow, comparison, hierarchical, geographic/map, list, anatomical, resume)이 다수 소스에서 반복 확인됨 — [Venngage, 9 Types of Infographics](https://venngage.com/blog/9-types-of-infographic-template/) (접속 2026-07-20), [Piktochart, The 10 Types of Infographics](https://piktochart.com/blog/types-of-infographics/) (접속 2026-07-20), [Marq, The 9 Types of Infographics](https://www.marq.com/blog/types-of-infographics/) (접속 2026-07-20). 이들은 listicle류이므로 "업계 통용 명칭 열거"로만 인용한다.

- **Single big-stat / Statistical**: 숫자 자체가 메인 메시지 — 큰 수치 하나 + 짧은 설명. 현재 `infographic-stats` blueprint와 일치.
- **Comparison**: 두 개 이상 대상을 나란히 비교(좌우 분할 또는 대칭 컬럼).
- **Timeline/Process**: 시간순 또는 단계순 배열(수평 축 또는 수직 스텝).
- **Hierarchical**: 위→아래 또는 중심→외곽으로 중요도 순 배열.
- **List/How-to**: 순번이 있는 항목 나열.
- **Geospatial**: 지도 기반.

### 3.2 어떤 데이터 형태가 어떤 구조에 맞는가

- 데이터가 "하나의 강력한 숫자"면 statistical(big-stat) — 숫자를 시각적으로 극대화하고 설명은 보조.
- 데이터가 "여러 항목의 상대 비교"면 comparison — 대칭/양분 레이아웃으로 좌우 균형을 맞춰야 비교가 성립.
- 데이터에 "순서/랭킹"이 있으면 hierarchical — 상단부터 크기·위치로 위계를 표현.
(위 매핑은 Marq/Venngage 소스의 서술을 재구성한 것이며, 정량적 검증 근거는 없음 — 업계 관행 수준.)

### 3.3 출처 표기(source attribution) / 데이터 무결성 관행

- "Source: [기관명]"을 그래픽 위에 짧게 표기하고, 전체 URL은 캡션/별도 패널로 분리하는 것이 표준 관행 — [예시 모음, 7 real examples of best practices for citing sources in infographics](https://examples-of.com/writing-communication/blog-post-formats/infographics/writing-communication-blog-post-formats-infographics-best-practices-for-citing-sources-in-infographics/) (접속 2026-07-20)
- 라벨·폰트·색을 모든 인포그래픽에서 통일해 신뢰도를 높이는 것이 권장됨 — 동일 출처
- 제작/발행일 표기 권장 — 동일 출처
- 현재 `infographic-stats` blueprint는 이미 `source` 텍스트 슬롯(하단, `text.muted` 색)을 갖고 있어 이 관행에 부합함(레지스트리 파일 확인).

### 3.4 무엇이 두 인포그래픽을 "다르게" 느끼게 하는가

가장 근거 있는 단일 축은 **구조 자체(single focal element vs multi-element grid/sequence)** — 즉 "하나의 지배적 요소를 크게 보여주는가, 여러 개의 병렬 요소를 배열하는가"다. 이유:
1. big-stat archetype은 슬롯이 적고 하나(stat)가 압도적으로 크다. comparison/timeline archetype은 반복 가능한 여러 개의 동일 크기 유닛(카드/스텝)으로 구성된다 — 이는 슬롯 "개수와 반복 구조" 자체가 다른 것이라 좌표 이동으로는 흉내낼 수 없다.
2. Venngage/Piktochart 모두 이 구분(단일 초점 vs 다중 병렬 요소)을 유형 분류의 최상위 기준처럼 서술한다.

---

## 4. 포맷별 "가장 결정적인 축" 요약

| 포맷 | 가장 결정적인 축 | 근거 |
|---|---|---|
| 명함 | **Orientation(가로/세로)** — 그리드 구조 자체(3-col↔2-col)가 바뀜 | OddPlanPrint, Brandly |
| 제품 포스터 | **Image-to-text 면적비 및 그리드 구조** — hero-image-dominant vs type/Swiss-dominant | Farringtons/Envato(Swiss), Icons8/GridMakerPro(split grid) |
| 인포그래픽 | **구조(단일 초점 vs 다중 병렬 유닛)** — 슬롯 개수·반복 구조 자체가 다름 | Venngage, Piktochart, Marq |

공통점: 세 포맷 모두 "결정적 축"은 좌표 offset이 아니라 **그리드/슬롯 구조 자체의 변화**다. 현재 registry.ts의 `-split` 생성 로직(`x + 24`, `width - 48`)은 이 세 축 중 어느 것도 건드리지 않으므로 구조적으로 재설계가 필요하다.

---

## 5. 레이아웃-아나토미 참고 자료

- Josef Müller-Brockmann, *Grid Systems in Graphic Design* — 그리드 기반 위계·비례·정렬의 1차 이론서. 원문 PDF: [Internet Archive 스캔본](https://ia802309.us.archive.org/4/items/GridSystemsInGraphicDesignJosefMullerBrockmann/Grid%20systems%20in%20graphic%20design%20-%20Josef%20Muller-Brockmann.pdf) (접속 2026-07-20). 요약: [Möels & Co, Josef Müller-Brockmann: the father of the grid system](https://moelsandco.com/stories/josef-muller-brockmann-a-pioneer-of-swiss-graphic-design) (접속 2026-07-20)
- Rule of thirds / Z-reading pattern (poster grid 설계 근거) — [Icons8, Creative poster design explained](https://icons8.com/blog/articles/creative-poster-design-explained/) (접속 2026-07-20)
- 도련/안전영역 수치 — 2.2, 1.2절 출처 참조

---

## 6. 6-Blueprint 재설계 권장안

| 포맷 | Blueprint A (기존 유지) | Blueprint B (신규 제안) | 구별 축 | 근거 출처 |
|---|---|---|---|---|
| business-card | `business-card-minimal` (가로 1050×600, 좌측 accent rail, centered-ish name/role/contact 스택) | `business-card-vertical` (세로 600×1050 또는 실제 비율 재계산, 2-column 그리드, 상단 photo band + 하단 텍스트 스택) | **Orientation** (가로↔세로, 그리드 3-col↔2-col) | OddPlanPrint, Brandly (1.1절) |
| product-poster | `product-poster-hero` (이미지 ~51% 면적 상단, 텍스트 하단 스택) | `product-poster-editorial` (Swiss/type-dominant: 대형 headline이 화면 상단 지배, 이미지는 좌/우 절반 모듈로 축소, CTA는 대비되는 컬러 블록) | **Image-to-text 비율 + 그리드 구조** | Farringtons/Envato Swiss style, Icons8 split grid (2.1절) |
| infographic | `infographic-stats` (단일 big-stat 중심, 슬롯 4~5개, 수직 스택) | `infographic-comparison` 또는 `infographic-timeline` (반복 가능한 N개 동일 크기 유닛 — 좌우 비교 카드 또는 수평 스텝 시퀀스, source 슬롯 유지) | **구조(단일 초점 vs 다중 병렬 반복 유닛)** | Venngage, Piktochart (3.1, 3.4절) |

구현 시 주의점(리서치에서 도출, 코드 변경은 이 리포트 범위 밖):
- 명함 B안은 단순 회전이 아니라 그리드 column 수 자체를 바꿔야 함(3-col landscape → 2-col portrait 관행).
- 포스터 B안은 슬롯 bounds의 폭 비율을 재계산해야 함(이미지 슬롯을 축소하고 headline 슬롯을 확대) — 현재 backdrop 크기(1080×1350)는 인쇄 표준이 아닌 소셜 세로형 규격임을 별도로 확인함(2.2절).
- 인포그래픽 B안은 슬롯 "개수"가 달라짐(반복 유닛) — TemplateBlueprint 타입이 반복 슬롯을 표현할 수 있는지 별도 확인 필요(이 리서치는 다루지 않음).
- 한국 명함 규격 이원화(90×50 vs 85×55)는 orientation 축과 별개로 "규격 프리셋" 검증 규칙(도련 3mm, 안전영역 인셋 3mm)으로 인코딩 가능(1.2절 표).

## Changelog
- 2026-07-20: 최초 작성.
