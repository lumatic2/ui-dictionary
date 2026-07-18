# changeset: copy + interaction axes

- Date: 2026-07-19
- Milestone: ST4 step-1 (`plans/2026-07-19-st4-copy-axes-e2e.md`)
- 사용자: "히어로 문구·설명 문구·CTA 개수·마우스 인터랙션 등 선택 요소가 더 많을 것"

## 변경

- `templates/brief-studio.html` — 신규 축 4종(총 18축): **헤드라인**(카피 6안 실물 타이포, lg) · **서브 카피**(톤 변주 6안) · **CTA 구성**(개수·위계 실물 렌더 5안) · **마우스 인터랙션**(부양/틴트/글로우/밑줄/자석 — 만져보는 데모, 신규 CSS 3종). 헤드라인·서브·CTA 선택이 **미리보기 히어로에 즉시 반영**.
- `docs/design-system/design-brief.md` — 축 표 15~18 추가. llms 배포.

## 검증 checklist (Playwright 실측)

- [x] 총 18축 렌더
- [x] 헤드라인 hl-3 선택 → 미리보기에 "작게, 그러나 정확하게" 반영
- [x] CTA two-split 선택 → 미리보기 버튼 2개("더 알아보기" 포함)
- [x] 인터랙션 데모 5종 렌더
- [x] Failure probe: 미선택 시 제출 차단이 18축 기준으로 갱신(2/18 상태 확인) — 카피 축도 추천 기본값으로 미리보기는 항상 동작
- [ ] curl 축 표 15~18 배포 (통합 폴링에 합류)
