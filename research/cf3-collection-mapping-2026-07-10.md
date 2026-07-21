# CF3 사전 감사 — Patterns 빈 컬렉션(4개) 매핑 판정

- 날짜: 2026-07-10
- 범위: read-only 조사 (Explore 에이전트 수행, 오케스트레이터가 저장). `terms.yml`·`navigation-model.ts` 무수정.
- 대상: `navigation-model.ts`에서 `termIds: []`인 4개 컬렉션 — Blog Sections, Contact Sections, Content Sections, Logo Clouds (모두 `Plus > UI Blocks > Marketing > Page Sections` 하위)
- 목적: 신규 term 수집 전에 기존 527개 terms(`docs/ui-vocabulary/terms.yml`)만으로 채울 수 있는지 판정.

## 0. 결론 요약

| 컬렉션 | 후보 수(적합) | 판정 |
|---|---|---|
| Blog Sections | 0 | (c) 전면 신규 수집 필요 |
| Contact Sections | 0 | (c) 전면 신규 수집 필요 |
| Content Sections | 0(직접) / 2(원거리, 부적합) | (c) 전면 신규 수집 필요 |
| Logo Clouds | 0(직접) / 1(원거리, 용도 다름) | (c) 전면 신규 수집 필요 |

4개 전부 기존 terms만으로 채울 수 없다. 각 컬렉션이 가리키는 랜딩페이지 마케팅 블록(blog post 카드/리스트, contact form/오피스 정보, prose/rich content 섹션, 고객 로고 그리드)에 해당하는 term이 terms.yml에 원천적으로 없다 — blog/contact/content/logo-cloud 주제가 애초 소스 수집 스코프에서 다뤄지지 않은 것으로 보임.

## 1. 컬렉션 메타

네 컬렉션 모두 `categories`/`groupIds`/`kinds` 필터 없이 순수 `termIds` 수동 배정 방식 (navigation-model.ts lines 614–642). 부모 `plus-marketing-page-sections`와 형제 컬렉션(Hero/Feature/CTA/Bento/Pricing/Stats/Testimonials/FAQs/Footers/Team)은 전부 채워져 있고, 빈 4개만 패턴에서 누락.

## 2. 형제 컬렉션 기준선

컬렉션당 term 1~2개가 정상 (Hero Sections=2, Feature/CTA/Bento/Pricing/Newsletter/Testimonials/Team/FAQs/Footers=각 1, Stats=2). 대부분 전용 `*-section` block term(category: structure, group: structure-sections). 예외(Stats/Team/FAQs)는 data-display term 재사용 — **카테고리는 유연하되 주제 일치는 필수**가 배정 관례.

## 3. 컬렉션별 조사 결과

- **Blog Sections**: `blog`/`article`/`post` 검색 매칭 2건 전부 무관(`help-center-card`는 헬프센터 카드). 전용 term 없음 → 신규: `blog-post-card`, `blog-grid-section` (여유 시 `featured-post-card`).
- **Contact Sections**: `contact-picker`(모바일 연락처 피커)·`location-permission-empty`(OS 권한) 등 전부 컨텍스트 불일치. 신규: `contact-form-section`, `contact-info-panel` (여유 시 `office-location-card`).
- **Content Sections**: `rich-text-editor`(입력 위젯)·`section`(범용 구조 개념, alias "Content section"이 있으나 최상위 개념이라 부적합) — 채택 보류. 신규: `content-section`(prose/이미지+텍스트 랜딩 블록), 여유 시 `split-content-section`.
- **Logo Clouds**: `logo`(단일 브랜드 마크 요소 — 단위 불일치)·`integration-grid-section`(연동 상태 그리드 — 목적 불일치) 보류. 신규: `logo-cloud-section`, 여유 시 `logo-marquee`.

## 4. 권고

- 4개 컬렉션 전면 신규 수집: 필수 6개(blog-post-card, blog-grid-section, contact-form-section, contact-info-panel, content-section, logo-cloud-section) + 여유 3개(featured-post-card, split-content-section, logo-marquee).
- 신규 term에는 `integration-grid-section`/`section`/`logo`/`rich-text-editor`와의 `related`(compare) 링크로 경계를 명시.
- 기존 term 억지 재활용은 사전 신뢰도·배정 관례 위배로 금지.
