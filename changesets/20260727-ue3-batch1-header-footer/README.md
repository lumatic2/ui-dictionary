# changeset — UE3 배치 1: Header Sections · Footers

> milestone UE3 (배치 1) · plan `plans/2026-07-27-ue3-batch1-header-footer.md` · 2026-07-27~28

## step-1 — 레퍼런스 헌팅 장부

- `research/2026-07-27-ue3-batch1-references.md` — 헤더 6·푸터 6 레퍼런스(전 항목 URL+접근일), 기존 8+7 변형 전수 대조표, 갭 3건 도출: G-H1 타입 우선 헤더 · G-H2 비대칭 분할(편집형) 헤더 · G-F1 대형 브랜드 워드마크 푸터. O10 중복감은 콘텐츠 시나리오 차별화로 조치 예정.

## step-2 — Header Sections 정비

- 안내문 개정: "페이지 머리말 섹션 — hero 와 역할 구분, 내비바는 Elements > Headers" 명시 (O10 분류 혼동 해소).
- 신규 변형 2종 (장부 갭 G-H1·G-H2, 참고 재해석): `header-type-first`(초대형 타이포+얇은 메타 행, 2026 타입 우선) · `header-split-editorial`(비대칭 12그리드, 좌 제목 열 + 우 내려앉은 리드·목차 열). 목록 앞쪽 배치.
- O10 중복감: Centered↔Simple 설명을 서로 대비되게 재작성 (대칭 기본형 vs 좌측 정렬 최소 구성).
- 수정 variant 타 사용처 grep: 없음 — 회귀 리스크 0. 기존 렌더러 무변경(설명·데이터만).

## step-3 — Footers 보강

- 장부 대조: 기존 7변형은 링크 그리드 계열로 충분 — 갭은 G-F1(대형 브랜드 타이포) 하나.
- 신규 변형 `footer-brand-wordmark`: 얇은 링크 행 + 소셜 → 초대형 워드마크("Vocab") → 법적 행. 참고 재해석(Digital Silk 브랜드 강화형·Sitebuilder bold typography 관례).

**Verify**: Playwright 4항 PASS — 헤더 10예제·안내문·신규 2종 렌더("Measured,"·"What shipped this quarter") · 푸터 8예제·워드마크 렌더 · 다크 캡처 · 콘솔 에러 0. tsc 0 에러 · build·lint exit 0. 신규 코드 hex 리터럴 0(기존 파일의 verify 위반은 이월 부채 — UE2 finding 큐 기존 항목).
