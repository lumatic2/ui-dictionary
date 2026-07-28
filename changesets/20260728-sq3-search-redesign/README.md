# changeset — SQ3: O9 검색 결과 UI 재디자인

> Milestone: SQ3 (goal `site-quality`) · Plan: `plans/2026-07-28-sq3-search-redesign.md` · 2026-07-28

## step-1 — 계층화 정보구조 + 요약 헤더

- `src/lib/search.ts` — `SearchResult` 에 정답 티어 채널 `exact: boolean` 추가: 이름·별칭 일치 또는 discoveryQueryBoosts 매치(별도 `boostMatched` 플래그 — reasons "prompt_phrase" 로는 실필드 매치와 구별 불가). 스코어·정렬 불변.
- `App.tsx` `applyUseCaseResults` — use-case 칩 pin 결과를 `exact: true` 로 승격(큐레이션 정답 — fresh 검증자 적발 경로).
- `App.tsx` 검색 렌더 — 요약 헤더 재디자인(eyebrow + 검색어 강조 h2 + "N개 결과 — 정확 일치 x · 연관 언급 y") + 결과를 2티어 섹션(`data-search-tier="exact"|"related"`)으로 분리. 탐색(비검색) 모드는 기존 플랫 목록 그대로.

검증: tsc·build PASS · Playwright — "토글" 7=5+2(부스트 정답 티어 포함)·"accordion" 6=1+5 합계 보존, 브라우징 화면 티어 섹션 0(무회귀), 0건 검색 EmptySearchRecovery 무회귀, 콘솔 0에러.
