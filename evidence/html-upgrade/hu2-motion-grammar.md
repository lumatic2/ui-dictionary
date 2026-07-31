# HU2 — 모션 문법 + 표현 규율 (fragment·규율 린트·bento-grid)

> 2026-07-31 · plan: `plans/2026-07-31-hu2-motion-grammar.md` · changeset: custom-skills `20260731-hu2-motion-grammar` (커밋 01bea4f·b13b7bf·cf44bc4, push 완료)

## step-1 — fragment 단계 공개

- 구현: item `fragment: <순번>`(opt-in) → 런타임 태깅(items 순서=article 문서 순서 — renderer 전수 수정 없이 계약 구현), 진행 키 fragment-first(소진 후 장 이동·← 역순 되감기), 스피커 `step` 프로토콜 + pos `+k/m` 표시, print/capture 침묵.
- 검증 실측(`FRAGMENTS PASS`): 초기 pending 3 → →키 3회 순차 공개(revealed 3) → 4회째 장 이동 → ← 역행 → 재진입 시 pending 3 · `?capture` 태깅 0·전 요소 opacity 1 · 스피커 step 동기 `+0/3→+1/3`.
- 라운드: overflow-checker 오탐 1건 재현(pending translateY) → capture 모드 전환은 nav-overlap 판정 붕괴로 기각, 중화 스타일 주입으로 수리 → 0건.

## step-2 — 모션·폰트·anti-slop 규율 + 린트

- style-system.md 규율 절(R4 모션·폰트 로딩·R5/R6 anti-slop — KG 스멜 테스트 8항 슬라이드판, 기계 검사 가능 항목만 린트·구도류는 G5 경계 명기) + theme.mjs preconnect/style-preload 자동 삽입(실측: `as="font"` 불성립 — 폰트 URL 은 CDN CSS 소유, `font-display:swap` 기선언 확인) + lint R4~R6.
- 검증 실측: 정상 fixture — head preconnect+preload 존재·R4~R6 경고 0 / 위반 fixture(이모지·items 12·중복 fragment·인터랙티브 fragment·slop theme: 디폴트 그림자·Inter 단독·라운드 12 고정) — **경고 7건 전부 실발화**. standalone 재검(preload 힌트 제거 반영) `STANDALONE-OFFLINE PASS`(요청 0).

## step-3 — bento-grid (정적 15종째)

- renderer+CSS(4열·span wide/tall/big·빅넘버 스탯 셀)+layout-meta·schema(item.span)+layouts.md §15+SKILL 카운트(15종/19종).
- 검증 실측: validate --lint·build·overflow PASS(3장 통합 — fragment 장+bento 장 동시) + Chrome 육안 — r1 셀 높이 눌림(제목 잘림) → auto-rows 수리, r2 수렴(`img/hu2-bento-v2.png`).

## 게이트

- 회귀: fragment/bento 미사용 장·덱 산출 무변화(opt-in) + HU1 스피커 동기 유지(step 프로토콜로 확장, 같은 빌드 재생성 계약).
- 통합: 한 fixture 에서 fragment+bento+규율 린트 동시 PASS.
