# changeset — UE2 용어 상세에 바리에이션 갤러리

> milestone UE2 · plan `plans/2026-07-27-ue2-variation-gallery.md` · 2026-07-27

## step-1 — 변형 데이터 층 + 파일럿 데이터

- 신설 `src/data/term-variations.tsx` — 타입드 레지스트리(변형 id·라벨·한 줄 정의·tier·states·Demo). terms.yml 파이프라인 미통합 사유(YAML 이 코드 참조를 소유 불가)와 UE3 재확정 계획을 파일 머리에 기록.
- 신설 `variation-demos/accordion.tsx` — 기본(구분선)·보더 묶음형·분리 카드형·FAQ형 4변형, 실동작 단일 펼침 + disabled 항목. 근거 레퍼런스 주석: W3C APG accordion·shadcn/ui·MUI·Tailwind Plus FAQ (접근일 2026-07-27).
- 신설 `variation-demos/tabs.tsx` — 밑줄형·필형(세그먼트)·세로형 3변형, 실전환 + disabled 탭. 근거: W3C APG tabs·Material 3·Apple HIG segmented·Tailwind Plus (접근일 동일).
- Verify: `npx tsc -b` 0 에러 · `@askewly/design verify variation-demos` PASS(색 리터럴 0·타이포 한도 내).

## step-2 — 갤러리 렌더러 + term-page 배선

- 신설 `variation-gallery.tsx` — 레지스트리에 있는 용어만 섹션 렌더(노출 정책 정합), 변형 카드 = 라벨 + Pro 배지(2번째부터, 표시만) + 상태 칩 + 실동작 데모. `term-page.tsx` 에 "빠른 판단" 다음 배치.
- lazy 층 생략 사유: term-page 자체가 UE5 의 lazy 청크라 초기 청크 영향 0 — 계획의 목적 충족.
- Verify (Playwright, `UE2 STEP2: PASS`): 아코디언 변형 4카드·Pro 3·단일 펼침 실조작(4→3 카운트)·disabled 확인 · 탭 3카드·전환 실조작 · **미등록 용어(text-field) 섹션 미노출+기존 레이아웃 유지** · 라이트/다크 스크린샷 · 콘솔 에러 0. build·lint exit 0.
- 디자인 게이트: 신규 파일 verify PASS. `src/components` 전체의 위반 77건은 **기존 데모 파일들의 이월 부채**(UE2 무관) — finding 큐 기록.
- 시그니처 자가 판정: 토큰만 사용(리터럴 0)·기존 페이지 리듬 준수(Section 위계·간격)·변형 간 시각 차별성 확보(O10 교훈)·라이트/다크 검증·실동작 상호작용 — 하드 페일 없음.
