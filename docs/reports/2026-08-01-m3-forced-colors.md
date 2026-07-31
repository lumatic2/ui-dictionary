# M3 — forced-colors(고대비 모드) 대응 (완료)

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m3-forced-colors.md` · Changeset: `changesets/20260801-m3-forced-colors/`

## 1. 결과

사이트 셸이 forced-colors(Windows 고대비) 렌더링 모드에서 판독·조작 가능해졌다. 감사에서 실결함 3건을 찾아 전건 수리: ① 컬러 팔레트 스와치 색 소멸 → `forced-color-adjust: none` 컨테이너 상속으로 보존 ② 홈 장식 플로팅 필드가 빈 외곽선 상자로 노이즈화 → forced 에서만 숨김 ③ 로고 버튼 포커스 불가시 → forced 블록 전역 `:focus-visible` 시스템 색 outline. 수리는 전부 `@media (forced-colors: active)` 안에 격리 — 일반 라이트/다크 무영향. 다크(.dark)+forced 동시 활성 조합도 판독 확인.

## 2. 이슈와 해결

- 에뮬레이션 팔레트(라이트 HC)와 실물(검정 테마)이 달랐으나 수리 3건의 동작은 동일 — 에뮬레이션을 자동화 게이트로, 실물을 교차 스팟으로 쓰는 구도가 유효함을 확인.
- 실물 스팟은 사용자 위임("너가 처리할 수 있으면 해")으로 에이전트가 `SystemParametersInfo` 로 고대비를 잠깐 켜 실측 후 원복 — OS 상태 원복 확인까지 절차에 포함.
- 스코프 밖 관측 2건 finding 이관: `/search?q=button` 의 문서 title 이 Patterns 로 찍힘(라우팅/메타 의심) · 로고 버튼은 일반 모드에서도 포커스 링 부재.

## 3. 증거

- Evidence: `evidence/dark-carryover/m3-forced-colors.md` — 감사 장부(결함/비결함 판정)·재순회 표·실물 스팟.
- 실표면: ① 에뮬레이션 재순회 — D1 스와치 bg `rgb(255,153,200)` 보존·D2 장식 29요소 display:none·D3 로고 outline `solid 2px` assertion 전부 성공 ② **Windows 실물 고대비** — 실브라우저에서 `matchMedia('(forced-colors: active)')` true 확인 후 홈·Colors 판독 실측(스크린샷), 원복 완료.
- 재현: `cd examples/ui-vocabulary-site && npm run build && npx vite preview` → Playwright `emulateMedia({forcedColors:'active'})` 로 홈·/colors 순회.
- 크기 회고: changeset 1개·커밋 2건(감사/수리) — steps=2 계획 정합. 감사(장부)와 수리(전역 CSS+컴포넌트 2)는 독립 응집 변경이며 통합 검증(재순회+무영향 대조)을 가졌다.
