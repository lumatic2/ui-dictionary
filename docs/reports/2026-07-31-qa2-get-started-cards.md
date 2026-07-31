# QA2 — Get Started 카드 직관화 (완료)

- Date: 2026-07-31 · Plan: `plans/2026-07-31-qa2-get-started-cards.md` · Changeset: `changesets/20260731-qa2-get-started-cards/`

## 1. 결과

/get-started 가 primer.style 문법(사용자 확정 레퍼런스)으로 전면 재설계됐다: 센터 헤딩+서브 1줄, 비대칭 2카드 히어로(Patterns·Colors), 풀폭 Recipes 카드, "More ways in" 3소카드(Docs 31 articles·UI Vocabulary·Agents). 카드 일러스트 3장은 codex imagegen 생성 세트(무광 연보라 세계관, 같은 재질·조명·밀도, webp 18~44KB)로 통일했고, 카드는 hover 시 살짝 확대(1.015~1.02)+그림자+포인터 커서로 반응한다. 사람 관측 최종 통과("응 괜찮음").

## 2. 이슈와 해결

- **드리프트(승인 계약 대비)**: 원계획 = 기존 6카드 유지+라이브 미니 프리뷰 썸네일. 실행 중 사람 관측이 3회 연속 기각(스켈레톤 품질 → 축소 렌더 "AI slop" → 구조 자체 의문) → 레퍼런스 조사(10곳)·사용자 레퍼런스 순회를 거쳐 **구조와 썸네일 방식이 전부 교체**됐다(Primer 구조 + 생성 일러스트). 전 단계 사용자 지시·확정으로 진행했으나 계획서 재승인 없이 관측 왕복으로 흡수한 것은 기록해 둔다 — 취향 표면의 계획은 "실물 시안 관측 게이트"를 계약에 미리 넣는 게 맞다(QA1 교훈의 재확인).
- **일러스트 7라운드 왕복**: 축소 렌더는 글자가 안 읽혀 실패, 코드 콜라주는 조립 품질 한계, 생성 이미지는 ①경계 절단 ②톤 이탈(비비드) ③밀도 불일치가 차례로 적발됨. 수렴시킨 규칙 — **기준 이미지(patterns.png)를 직접 참조시켜 같은 재질·조명·채도로 시리즈화 + 피사체가 캔버스 75~85% + 절단 금지**. 프롬프트에 "이전 실패 원인"을 명시하는 게 라운드를 줄였다.
- Tailwind v4 프리플라이트가 button 커서를 default로 두는 것(cursor-pointer 필요), scale 유틸이 transform이 아닌 CSS `scale` 속성인 것(검증 방법 교정) 실측.

## 3. 증거

- Evidence: `evidence/site-polish/qa2-get-started-cards.md` — step 표 + 재작업 1~7 라운드 표.
- 실표면: 로컬 preview(4322) /get-started 에서 카드 4방향 클릭 라우팅(/patterns/marketing·/colors·/recipes·/docs) URL 어서션 통과, hover 시 computed `scale` 1.015·`cursor` pointer 어서션 통과, reduced-motion 에뮬레이션에서 animationName spin→none 어서션 통과, 라이트/다크 풀페이지 스크린샷 순회, **사용자 직접 관측 왕복 7회 → 최종 통과**(2026-07-31 "응 괜찮음. 다음").
- 재현: `cd examples/ui-vocabulary-site && npm run lint && npx tsc --noEmit && npm run build` → `npx vite preview` → /get-started 라이트/다크·hover·클릭.
- 크기 회고: changeset 1개·커밋 11건 — steps=2 계획이었으나 관측 왕복이 실질 작업량의 3배를 차지했다. 라벨 정합: 관측 왕복을 포함하면 milestone-grade 성립. 취향 표면 계획엔 왕복 예산(시안 게이트)을 명시할 것.
