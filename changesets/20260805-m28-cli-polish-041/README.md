# 20260805-m28-cli-polish-041 — M28 CLI 0.4.1 폴리싱

> plan: `plans/2026-08-05-m28-cli-polish-041.md` · milestone: M28

## step-1 — verify 속성 셀렉터 오탐 제거

- 증상: `[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50` 이 hex-literal 위반으로 잡혔다. 그 hex 는 recharts 내장 기본색을 **겨냥하는 매치 대상**이고 같은 줄이 그것을 토큰으로 덮는다 — 오탐이 아니라 **토큰 준수를 위반으로 부르는** 역전.
- 처리: `maskIgnoredRegions` 에 pass 추가(`ATTR_SELECTOR_HEX`) — 속성명 + `=`(CSS 매치 연산자 허용) + **따옴표 hex** 형태만 공백화. 파일 SKIP 목록은 채택하지 않았다(계획 기술결정 ①): 한 파일을 통째로 면제하면 그 파일의 진짜 위반까지 숨는다. 같은-따옴표 JS 문자열 안의 `\"` 이스케이프 형태도 포함(fixture 12행에서 실적발 — 1차 구현은 이걸 놓쳐 테스트가 잡았다).
- 경계: `bg-[#ccc]`(Tailwind arbitrary **값** — `=`·따옴표 없음)와 `color: "#112233"` 은 그대로 위반. fixture `attr-selector-outside.tsx` 5행이 면제 셀렉터와 `bg-[#ccc]` 를 한 줄에 두어 면제가 이웃을 삼키지 않는지 고정.
- 게이트: vitest 63/63(신규 3 케이스 + fixture 2) · `tsc --noEmit` exit 0 · 사이트 전체 스캔 전/후 diff = **chart.tsx:70 한 줄만 소멸**(154→153, 나머지 153건 판정 바이트 동일).
