# SQ3 — O9 검색 결과 UI 재디자인 evidence (2026-07-28)

> Milestone: SQ3 (goal `site-quality`) · Plan: `plans/2026-07-28-sq3-search-redesign.md` · Changeset: `changesets/20260728-sq3-search-redesign/`

## 1. 계층화 실측 (dev 실브라우저, Playwright)

| 시나리오 | 결과 |
|---|---|
| "토글" 검색 | 7개 = 정확 일치 5(부스트 정답 switch 포함) + 연관 언급 2 — 합계 보존 |
| "accordion" 검색 | 6개 = 정확 일치 1 + 연관 언급 5 |
| 딥링크 `?q=토글&filter=nav:plus-forms-toggles` | 7 = 5+2 — 필터 동반에서도 계층·합계 동일(검색은 전사전 대상, O8 계약 유지) |
| 0건 검색어 | 티어 섹션 0, EmptySearchRecovery 무회귀 |
| 브라우징(비검색) 화면 | 티어 섹션 0 — 기존 플랫 목록 그대로(variant 기본값 계약) |

- 순위 로직 불변 — `exact` 는 표현 채널(두 티어를 이어 붙이면 기존 정렬 그대로).

## 2. 재디자인 (askewly-design entry-protocol 경유)

- B레인(기존 UI 개선): anti-patterns 진단 → 시그니처 원칙(토큰 파생·절제된 계층·간격/타이포 위계) 안에서 설계.
- 요약 헤더: eyebrow + 검색어 강조 + "N개 결과 — 정확 일치 x · 연관 언급 y".
- hero 행(정확 일치): 비주얼 확대·이름 위계 강화·매치 배지 제거(정답 티어에선 잉여). compact 행(연관): 타이포 중심 한 줄 + 매치 근거 배지. **컴팩트 썸네일은 자가 판정에서 제거** — w-14 미니목의 한글 라벨 음절 세로쌓임(시그니처 하드 실패) 적발.
- 스크린샷: scratchpad `sq3_step2_{toggle,accordion}_desktop.png`·`sq3_step2_toggle_mobile.png`(390px 가로 오버플로 없음).

## 3. 회귀 게이트

- tsc·lint(에러 0)·build PASS · 디자인 verify **비악화**(7건 = SQ1 이월 타이포 그대로, 색 0 유지 — 수정 파일 위반 0).
- Playwright 스모크 4라우트(/ · /search?q=accordion · /terms/accordion · /patterns/marketing-hero-sections) 콘솔 0에러 · 정확 일치 행 클릭→상세 무회귀.

## 4. 실배포 확인 (push 3d70328 후)

- `ui.askewly.com` 신규 번들(index-DDEPZbX3.js) 반영(폴링 11회차). 라이브 `/search?q=토글` — 2티어 렌더(정확 일치 5·연관 언급 2), 요약 헤더 신형, 콘솔 에러 0.

## 5. 남은 게이트

- **사람 관측 1회 (DoD)**: 사용자 왕복 대기 — 결과는 이 파일에 추기.
