# UE2 — 용어 상세에 바리에이션 갤러리 · 증거

> milestone UE2 · goal `ui-encyclopedia` · 2026-07-27
> plan: `plans/2026-07-27-ue2-variation-gallery.md` · changeset: `changesets/20260727-ue2-variation-gallery/`

## 기계 검증 (실행 관측 — 원문)

```
1 accordion gallery: PASS  cards=4 pro=3
2 accordion interact (single-open): PASS  before=4 after=3 opened=True
3 disabled state: PASS  disabled=True
4 tabs gallery+switch: PASS  cards=3 switched=True
5 unregistered term unchanged: PASS  no_section=True
6 dark screenshot: PASS  captured
CONSOLE ERRORS: 0 · UE2 STEP2: PASS
```

- 아코디언 4변형(기본/보더 묶음형/분리 카드형/FAQ형) — 단일 펼침 실조작, disabled 항목, Pro 배지 3개(2번째 변형부터).
- 탭 3변형(밑줄형/필형/세로형) — 전환 실조작.
- 미등록 용어(text-field): 갤러리 섹션 미노출 + 기존 레이아웃 유지 (노출 정책 정합).
- 디자인 게이트: 신규 파일 `@askewly/design verify` PASS(색 리터럴 0·타이포 한도 내). 기존 컴포넌트 위반 77건은 이월 부채 — finding 큐.
- 시그니처 자가 판정: 토큰만 사용 · 기존 페이지 위계·리듬 준수 · 변형 간 시각 차별성(O10 교훈) · 라이트/다크 캡처 · 실동작 — 하드 페일 없음.
- 회귀: `npx tsc -b` 0 에러 · `npm run build` exit 0 · `npm run lint` exit 0.
- 근거 레퍼런스(직접 구현 재해석, 접근일 2026-07-27): W3C APG accordion/tabs · shadcn/ui · MUI · Material 3 · Apple HIG segmented · Tailwind Plus FAQ/Tabs — 각 데모 파일 머리 주석에 URL 기록.

## 사람 관측 (DoD 최종 항목)

- 과업: "아코디언 페이지에서 바리에이션들을 만져 보세요 — 서로 달라 보이나요? 원하시던 '생김새·쓰임·바리에이션' 그림에 가까운가요?"
- **상태: 대기** — 발화 인용과 함께 기록한다. 기계 PASS 만으로 닫지 않는다.
