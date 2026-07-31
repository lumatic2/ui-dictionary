# SP3 — PPTX 파이프라인 정본화 검증

> 2026-07-31 · plan: `plans/2026-07-31-sp3-pptx-canonical-track.md` · changeset: custom-skills `changesets/20260731-sp3-pptx-canonical-track` (커밋 3507d5a·5ff3d41)

## 구현

- **`templates/export-pptx.mjs` 신설** — pptxgenjs 단일 정본 경로. 테마 판독(canonical THEME_ROOTS CSS 정규식 / custom content/theme.json — SL3·SP1 하드코딩 계보 해소), 네이티브 매핑 7종 + 미지원 레이아웃 카드 폴백·stderr 고지, CSS 전용 값(gradient·color-mix) 첫 hex 근사·판독 불가는 에러, pptxgenjs 의존성은 raster-pdf 의 playwright 해석 패턴 준용.
- **문서 정본화** — SKILL.md description·G7·§7-10·라우팅("슬라이드 덱 PPTX = 이 스킬 / 문서형 PPTX = ppt 스킬") + verification.md PPTX 체크리스트. ui-dictionary `methodology/slide-production.md` 결정표 pptxgenjs 단일 경로 갱신 + 2026-07-28 "중단" 결론 정정 기록(이력 보존 — 좁히기 확정·ppt-master 은퇴).

## 검증

- fixture: custom-theme-smoke·theme-askewly-smoke 두 fixture PPTX 산출 + python-pptx pictures 0 확인.
- 실증 2본 (배포본 exporter):
  - `askewly-design-intro.skill-track.pptx` — canonical askewly 테마 판독, 7장·차트 1·pictures 0. **hero-motion 카드 폴백 고지 stderr 실확인** (폴백 계약 동작 실증).
  - `claude-ppt-lab.topic.skill-track.pptx` — custom 테마(theme.json), 6장·차트 1·pictures 0. topic-deck 은 SP1의 덱 로컬 minimax 테마에서 **스킬 정식 custom 트랙으로 전환**(SP2 경로의 실사용 이관).
- COM 실개봉 (`open-verify-pptx.ps1`): 두 파일 Opened·ChartShapes 1·Workbook 접근 1 — PASS. 프로세스 잔존 0 (3초 유예 후 확인).
- 배포: setup.sh 출고 정합 통과 2회(step-1·step-2 커밋 가드).
- 회귀: smoke 18 fixtures + 3 negative 무회귀(step-1 시점 실행), PDF 2트랙 무접촉.

## finding

- exporter 가 **미지 template 값(예: 구 덱 로컬 테마명)을 light 로 조용히 폴백** — THEME_ROOTS[template] || light. 에러 표면화가 계약에 더 맞다 (차기 유지보수 후보).
- GUI 차트 더블클릭 편집 UX = SP1 과 동일하게 사용자 관측 대기 항목 유지.
