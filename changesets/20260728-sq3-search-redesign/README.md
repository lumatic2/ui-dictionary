# changeset — SQ3: O9 검색 결과 UI 재디자인

> Milestone: SQ3 (goal `site-quality`) · Plan: `plans/2026-07-28-sq3-search-redesign.md` · 2026-07-28

## step-1 — 계층화 정보구조 + 요약 헤더

- `src/lib/search.ts` — `SearchResult` 에 정답 티어 채널 `exact: boolean` 추가: 이름·별칭 일치 또는 discoveryQueryBoosts 매치(별도 `boostMatched` 플래그 — reasons "prompt_phrase" 로는 실필드 매치와 구별 불가). 스코어·정렬 불변.
- `App.tsx` `applyUseCaseResults` — use-case 칩 pin 결과를 `exact: true` 로 승격(큐레이션 정답 — fresh 검증자 적발 경로).
- `App.tsx` 검색 렌더 — 요약 헤더 재디자인(eyebrow + 검색어 강조 h2 + "N개 결과 — 정확 일치 x · 연관 언급 y") + 결과를 2티어 섹션(`data-search-tier="exact"|"related"`)으로 분리. 탐색(비검색) 모드는 기존 플랫 목록 그대로.

검증: tsc·build PASS · Playwright — "토글" 7=5+2(부스트 정답 티어 포함)·"accordion" 6=1+5 합계 보존, 브라우징 화면 티어 섹션 0(무회귀), 0건 검색 EmptySearchRecovery 무회귀, 콘솔 0에러.

## step-2 — 결과 행 비주얼 재디자인 (askewly-design 경유)

entry-protocol(원격 정본) fetch·준수 — B레인(기존 UI 개선): anti-patterns 진단 → 시그니처 원칙(토큰 파생·절제된 계층·간격/타이포 우선 위계) 안에서 변형 설계.

- `term-result-row.tsx` 에 `variant` 프롭 도입 — **기본값 "default" = 기존 렌더 그대로**(브라우징 무회귀 계약).
  - `hero`(정확 일치): 비주얼 9.5rem 확대 + 이름 text-xl 위계 강화 + 영문명 인라인 + 매치 근거 배지 제거(정답 티어에선 잉여) — 카테고리 배지만.
  - `compact`(연관 언급): 타이포 중심 한 줄 밀도 + 매치 근거 배지 우측 정렬. **썸네일 미표시** — 1차 구현(w-14 미니목)에서 한글 라벨 음절 세로쌓임(시그니처 하드 실패) 적발 후 제거.
- `App.tsx` 티어 섹션에 variant 배선.

검증: tsc·build PASS · 디자인 verify 비악화(7건=이월분, term-result-row 무위반 — 파일 5단계 이내) · Playwright — 데스크톱 1440·모바일 390(가로 오버플로 없음) 스크린샷, 정확 일치 행 클릭→상세 무회귀, 콘솔 0에러.
