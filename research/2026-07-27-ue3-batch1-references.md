# UE3 배치 1 — 헤더/푸터 레퍼런스 장부

> 2026-07-28 작성 · 소비처: milestone UE3 배치 1 (`plans/2026-07-27-ue3-batch1-header-footer.md` step-2·3)
> 규칙: 참고·재해석만 — 스크린샷 게재·픽셀 복제 금지. 전 항목 출처 URL + 접근일.

## A. 헤더(페이지 머리말 섹션) 레퍼런스

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| H1 | Lexington Themes — Stunning hero sections 2026 https://lexingtonthemes.com/blog/stunning-hero-sections-2026 | 2026-07-28 | 2026 축은 장식이 아니라 **구조**: 편집형 그리드·타입 우선·비대칭·스택 내러티브·시네마틱 프레이밍 5패턴. 중앙 정렬 안전형에서 탈피가 공통 방향 |
| H2 | Perfect Afternoon — Hero section best practices 2026 https://www.perfectafternoon.com/2025/hero-section-design/ | 2026-07-28 | 대형·자신감 있는 타이포 + 최소 콘텐츠 조합. 절제된 상호작용(스크롤 큐) |
| H3 | Dribbble hero_header_section 태그 https://dribbble.com/tags/hero_header_section | 2026-07-28 | 14,000+ 샷 — 상위 노출 다수가 타입 우선·비대칭 분할 구도 (탐색 창구로 기록) |
| H4 | Unsection — Hero section design 큐레이션 https://www.unsection.com/category/hero-section-design | 2026-07-28 | 실서비스 헤더 큐레이션 — 편집형·분할형 비중 높음 |
| H5 | Tailwind Plus Header Sections (기존 패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/header | 2026-07-28 | 우리 8변형의 원 분류 — centered/simple/eyebrow/cards/stats/bg-image 계열 |
| H6 | W3C/관례 — Header Section vs 내비바 구분: 페이지 머리말 섹션(제목·리드·CTA)과 사이트 내비게이션 바는 별개 요소. 우리 IA 도 Elements > Headers(내비바 11변형)로 분리돼 있음 (내부 실측) | 2026-07-28 | O10 혼동의 해소 축 — 컬렉션 안내문에 명시할 것 |

### 기존 8변형 대조 → 갭

기존: with-stats · centered · centered-eyebrow · with-cards · simple · simple-eyebrow · bg-image · centered-bg-image — **전부 "중앙/좌측 정렬 + 대칭" 계열** (H5 패리티).

| 갭 | 근거 | 조치 |
|---|---|---|
| **G-H1 타입 우선(대형 타이포)** | H1·H2 — 2026 대표 패턴인데 우리 목록에 없음 | step-2 신규 변형 `header-type-first` |
| **G-H2 비대칭 분할(편집형)** | H1·H3·H4 — 중앙 정렬 탈피 축 부재 | step-2 신규 변형 `header-split-editorial` |
| 중복감(O10) | centered↔simple 계열이 mock 콘텐츠까지 유사해 구분이 안 읽힘 | step-2 — 변형별 콘텐츠 시나리오 차별화(발표/리포트/채용 등) + 설명 대비 강화 |

## B. 푸터 레퍼런스

| # | 출처 | 접근일 | 관찰 노트 |
|---|---|---|---|
| F1 | UXPin — Footer design best practices 2026 https://www.uxpin.com/studio/blog/footer-design-basics/ | 2026-07-28 | 위계(굵은 카테고리 헤더 + 절제된 링크)·브랜드 연장·전환 마지막 기회 |
| F2 | Digital Silk — Footer examples 2026 https://www.digitalsilk.com/web-design/web-trends/website-footer-design-examples/ | 2026-07-28 | 반복 유형 5: CTA 중심형·내비 구조형(3열 스캔)·시각 동적화·브랜드 강화형·정보 효율형 |
| F3 | Sitebuilder Report — 38 footer examples https://www.sitebuilderreport.com/inspiration/website-footer-designs | 2026-07-28 | 스펙트럼 확인: 미니멀(저작권+링크) ↔ 풀(뉴스레터+사이트맵+**대형 타이포**) |
| F4 | Colorlib — 25 footer examples https://colorlib.com/wp/website-footer-examples/ | 2026-07-28 | 대형 워드마크 푸터·다크 푸터 관례 다수 (탐색 창구) |
| F5 | Tailwind Plus Footers (기존 패리티 원본) https://tailwindcss.com/plus/ui-blocks/marketing/sections/footers | 2026-07-28 | 우리 7변형의 원 분류 — 4-column 계열 + simple 계열 |
| F6 | Blacksmith — Best footer examples https://blacksmith.agency/resources/web-design/best-footer-examples/ | 2026-07-28 | 브랜드 아이덴티티를 푸터까지 연장하는 사례 축 |

### 기존 7변형 대조 → 갭

기존: mission · cta(4열+CTA) · four-column-simple · newsletter · newsletter-below · centered · social — **전부 링크 그리드 중심** (F5 패리티). 정보 구조는 충분.

| 갭 | 근거 | 조치 |
|---|---|---|
| **G-F1 대형 브랜드 타이포(워드마크) 푸터** | F2 브랜드 강화형·F3 "bold typography"·F4 — 2026 관례인데 부재 | step-3 신규 변형 `footer-brand-wordmark` |
| CTA 헤드라인 중심형 | F2 CTA 중심형 — 우리 `footer-cta` 가 4열+CTA 로 부분 커버 | 기존 유지 (갭 아님 — 설명만 대비 강화) |

## 포화

배치 1 목적(대조·갭 도출)에 필요한 표면을 덮었다 — 트렌드 아티클 4·큐레이션 2·패리티 원본 2·내부 실측. 갭 3건(헤더 2·푸터 1) 도출로 step-2·3 입력 완성. 개별 Dribbble 샷 단위 수집은 배치 2+ 에서 카테고리별로 반복한다.
