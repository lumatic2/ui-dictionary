# changeset — UE3 배치 2(확대): 남은 Page Sections 14종

> milestone UE3 (배치 2 — 최종) · plan `plans/2026-07-28-ue3-batch2-remaining-sections.md` · 2026-07-28

## step-1 — 통합 레퍼런스 장부 (14종)

- `research/2026-07-28-ue3-batch2-references.md` — 14 카테고리 전부 ≥3 검증 소스(전 항목 URL+접근일, 리서치는 sonnet 3병렬 위임 + 오케스트레이터 보충 검증), 기존 118 변형 대비 갭 판정: 채택 11건(히어로 인터랙티브 투어 · CTA 고정 바 · 프라이싱 계산기 · 피처 인라인 데모 · 벤토 비대칭 모자이크 · 테스티모니얼 비디오 월 · 뉴스레터 퀴즈 · 블로그 고정 사이드바 · 팀 산개 리빌 · 로고 마퀴 · FAQ 검색 아코디언) · 갭 없음 3건(Stats·Contact·Content — 근거 명시, Content 벤토는 Bento 카테고리로 흡수 조정).
- fetch 미검증 후보는 인용 규칙에 따라 폐기(Stats 2건·Contact 채팅형). O10 중복감 점검표(카테고리 내 군집 5건) 포함 — 구현 step 에서 설명 대비로 조치.

## step-2 — 그룹 A: Hero · CTA · Pricing

- 신규 변형 3종 (장부 갭 G-A1·G-A2·G-A3, 참고 재해석): `hero-interactive-tour`(hotspot 3단계 실동작 투어 + 진행 도트) · `cta-sticky-bar`(카드 안 스크롤 영역 + 하단 고정 바 시뮬레이션) · `pricing-usage-calculator`(실동작 슬라이더 → 구간 요금 실시간 재계산·활성 구간 하이라이트). 각 컬렉션 목록 맨 앞 배치 + 컬렉션 설명에 신규 축 문장 추가.
- O10 군집 점검: CTA simple 3종(stacked/centered/justified)·Hero 스크린샷 4종은 기존 설명이 이미 정렬·프레임 축을 명시 — 무변경 판정.
- Verify: Playwright PASS — 히어로 13예제·CTA 12예제·프라이싱 렌더, 신규 3종 텍스트 렌더, 투어 Next 로 step 2 전환 실동작, 슬라이더 fill(20) 반영, 다크 캡처, 콘솔 에러 0. tsc 0. 신규 코드 hex 리터럴 0(diff 검사). 신규 변형이라 타 사용처 회귀 없음.

## step-3 — 그룹 B: Feature · Bento · Stats · Testimonials

- 신규 변형 3종 (장부 갭 G-B1·G-B2·G-B3): `features-interactive-demo`(탭으로 패널 뷰 전환 — 히어로 hotspot 투어와 골격 구분을 설명에 명시) · `bento-mosaic`(1x1·2x1·2x2 셀 크기 배수 비대칭 — 기존 `bento-asymmetric` 구명과 겹치지 않게 mosaic 명명) · `testimonials-video-wall`(masonry 영상 타일 + 재생 토글 실동작).
- Stats: 장부 판정 갭 없음 — 변경 없음(8예제 렌더 회귀만 확인).
- Verify: Playwright PASS — 피처 16·벤토 4·테스티모니얼 9·스탯 8 예제, 탭 전환·재생 토글 실동작, 다크 캡처, 콘솔 에러 0. tsc 0. 신규 코드 hex 0.

## step-4 — 그룹 C: Newsletter · Blog · Contact · Team · Content · Logo Clouds · FAQs

- 신규 변형 5종 (장부 갭 G-C1~C5): `newsletter-gamified-quiz`(2스텝 퀴즈→이메일 실동작) · `blog-sticky-sidebar`(고정 카테고리 사이드바 + 목록 필터 실동작) · `team-scatter-reveal`(산개 아바타 클릭 리빌) · `logo-cloud-marquee`(CSS 무한 마퀴 — motion-reduce 폴백) · `faqs-search-accordion`(실시간 필터 검색 + 아코디언). Contact·Content 는 장부 판정 갭 없음 — 무변경(렌더 회귀만 확인).
- Verify: Playwright PASS — 7 컬렉션 예제 수·신규 렌더, 퀴즈 스텝·카테고리 필터·리빌·검색 카운터('1 of 6')·마퀴 animationName 실동작 단정, 다크 캡처, 콘솔 에러 0. tsc 0. 신규 코드 hex 0.

## step-5 — 통합 검증 + 사람 관측

- 통합 스위트: 14 컬렉션 `/patterns/:slug` 직접 진입(=UE5 라우팅 스모크) 전부 PASS · 콘솔 에러 0 · build·lint exit 0 · 청크 941→978kB(임계 내). 원문: `evidence/ui-encyclopedia/ue3-batch2.md`.
- 사람 관측: 대기 — 통과 시 UE3 milestone 마감.
