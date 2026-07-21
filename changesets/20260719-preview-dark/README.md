# changeset: preview dark toggle (SF3 step 1)

- Date: 2026-07-19
- Milestone: SF3 step-1 (`plans/2026-07-19-sf3-preview-upgrade.md`)
- Target: SF3 — 미리보기 고도화

## Scope

- `templates/brief-studio.html` — 미리보기 패널 타이틀 바에 **다크·모바일 토글** 추가(`aria-pressed`). `pvCtx()`가 다크 뷰에서 베이스를 다크 후보(첫 dark 계열 rank)로 오버라이드 — 새 축 없음(뷰 토글). 다크/접근성 축 연동: `light-only` 선택 → 토글 강제 off+비활성(사유 title), `dark-first` 선택 → 자동 다크(사용자 수동 토글 후엔 존중).

## Contract

- source of truth: `templates/brief-studio.html`
- out of scope: 모바일 뷰포트 실측·매트릭스 E2E·계약 배포 (step 2)

## Verification checklist (Playwright 실측)

- [x] 다크 토글 on → 미리보기 배경 rgb(250,248,244)→rgb(29,24,19), aria-pressed true
- [x] Failure probe: 다크 축 "라이트만" 선택 → 토글 비활성+off+라이트 복귀 (미정의 상태 0)
- [x] dark-first 재선택 → 토글 재활성, 수동 다크 동작
