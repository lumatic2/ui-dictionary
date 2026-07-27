# UE3 배치 2(확대) — 남은 Page Sections 14종 · 증거

> milestone UE3 (배치 2 — 최종) · goal `ui-encyclopedia` · 2026-07-28
> plan: `plans/2026-07-28-ue3-batch2-remaining-sections.md` · changeset: `changesets/20260728-ue3-batch2-remaining-sections/`

## 기계 검증 (실행 관측 — 원문)

통합 스위트 (14 컬렉션, `/patterns/:slug` 경로 직접 진입 = UE5 라우팅 스모크 겸함):

```
marketing-hero-sections: examples=13 (min 13) -> PASS
marketing-cta-sections: examples=12 (min 12) -> PASS
marketing-pricing-sections: examples=45 (min 13) -> PASS
marketing-feature-sections: examples=16 (min 16) -> PASS
marketing-bento-grids: examples=4 (min 4) -> PASS
marketing-stats: examples=8 (min 8) -> PASS
marketing-testimonials: examples=9 (min 8) -> PASS
marketing-newsletter-sections: examples=7 (min 7) -> PASS
marketing-blog-sections: examples=18 (min 8) -> PASS
marketing-contact-sections: examples=7 (min 7) -> PASS
marketing-team-sections: examples=10 (min 10) -> PASS
marketing-content-sections: examples=15 (min 7) -> PASS
marketing-logo-clouds: examples=7 (min 7) -> PASS
marketing-faqs: examples=8 (min 8) -> PASS
CONSOLE ERRORS: 0
```

인터랙션 검증 (그룹별 스위트 원문 — 전부 실동작 단정):

```
hero tour advance: PASS · pricing slider: value=20 PASS
feature demo tab switch: PASS · video wall play toggle: PASS
newsletter quiz step: PASS · blog sidebar filter: PASS
team scatter reveal: PASS · faq search filter: counter='1 of 6' PASS
logo marquee animation: ui-logo-marquee PASS
다크 캡처: cta_dark.png · bento_dark.png · team_dark.png (scratchpad)
```

- 신규 변형 11종 (장부 갭 1:1 대응): hero-interactive-tour · cta-sticky-bar · pricing-usage-calculator · features-interactive-demo · bento-mosaic · testimonials-video-wall · newsletter-gamified-quiz · blog-sticky-sidebar · team-scatter-reveal · logo-cloud-marquee · faqs-search-accordion. 갭 없음 3(Stats·Contact·Content — 장부 근거).
- tsc 0 에러 · build exit 0 · lint exit 0(기존 warning 만) · 신규 코드 hex 리터럴 0(커밋 diff 검사 3회).
- 번들: `marketing-section-preview` lazy 청크 941→978kB (임계 1.3MB 내 — 분할 불요, finding 큐 미등재).
- 시그니처 자가 판정: 신규 11종 전부 기존과 다른 골격(인터랙티브 위젯/고정 오버레이/계산기/모자이크/masonry 영상/2스텝 퀴즈/고정 사이드바/산개 배치/마퀴/검색 결합) — 각 컬렉션 설명에 신규 축 문장 명시로 O10 재발 방지.

## 사람 관측 (배치 2 DoD 최종 항목 — 통과 시 UE3 milestone 마감)

- 과업: "컬렉션들 훑어봐 주세요 — 카테고리마다 새 변형(맨 앞 배치)이 기존과 뚜렷이 달라 보이고, 직접 조작(투어·슬라이더·퀴즈·검색·마퀴)이 어색하지 않나요?"
- 관측 1회차 (2026-07-28): "기존분이 어땠는지 기억이 안나서 말야. 비교는 못하겠네. Contact Sections의 Centered 부분은 좀 ui 배치가 엉망이라 고쳐야 하고." — 결함 1건 발견: contact 폼 인풋에 `w-full` 누락으로 인풋들이 inline-block 기본 폭으로 흘러 배치 붕괴(기존 변형의 잠복 결함 — 기계 스위트는 예제 수·텍스트만 재서 못 잡음, 사람이 잡음). 즉시 수리(`efa6786`) 후 Centered·형제 폼 변형 스크린샷 재확인. 관측 과업을 "신규 변형 절대 평가"로 재정의(비교 불요) — 재관측 대기.
- 관측 2회차 (2026-07-28): "응 통과. 나머지도 진행하자." — 신규 변형 절대 평가 통과.
- **상태: 통과 (2회 왕복 — 결함 1건 발견·수리 포함)**
