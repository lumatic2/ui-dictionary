# 완료 — SP3 PPTX 파이프라인 정본화

> 완료: 2026-07-31 · SP3 (goal `slide-pipeline-upgrade` — 이로써 goal 완주) · 배치: `docs/reports/` (이 레포 특례)
> **짧게 쓴다.** 설계 논거·경위는 custom-skills changeset 과 커밋 메시지에.

## 1. 결과

pptxgenjs 를 스킬 정식 export 트랙으로 승격했다. `templates/export-pptx.mjs` — 테마 판독(canonical CSS 정규식 / custom theme.json, SL3·SP1 하드코딩 계보 해소), 네이티브 매핑 7종(차트=addChart), 미지원 레이아웃 카드 폴백·고지, CSS 전용 값 hex 근사(판독 불가=에러). SKILL.md·verification.md 등재 + 라우팅 정정("슬라이드 덱 PPTX = 이 스킬"). methodology 결정표를 pptxgenjs 단일 경로로 갱신하되 2026-07-28 "중단" 결론은 record 보존 + 정정 기록(좁히기 확정·ppt-master 은퇴). custom-skills 커밋 3507d5a·5ff3d41, changeset `20260731-sp3-pptx-canonical-track`. goal `slide-pipeline-upgrade` SP1~SP3 완주.

## 2. 이슈와 해결

- `??` 와 `||` 혼용 문법 오류 1건 — 괄호로 수정.
- pptxgenjs 가 덱 루트 node_modules 에 없는 기존 덱 — junction 으로 해석 경로 확보(스크립트는 설치 안내 계약 유지).
- finding: exporter 가 미지 template 값을 light 로 조용히 폴백 — 에러 표면화가 정합, 유지보수 후보로 기록.

## 3. 증거

- evidence: `evidence/slide-pipeline/sp3-pptx-canonical.md`.
- 검증: fixture 2종(custom·askewly) PPTX 산출 + python-pptx pictures 0 · smoke 18+3 무회귀 · 배포 출고 정합 통과.
- 실표면: 배포본 exporter 로 실덱 2본(askewly-design-intro 7장·topic-deck 6장) 산출 → PowerPoint COM 실개봉에서 Opened·ChartShapes 1·Workbook 접근 1 assertion 성공(두 파일 모두), hero-motion 카드 폴백 stderr 고지 실확인, 프로세스 잔존 0.
- 평가 못 함: GUI 차트 더블클릭 편집 UX — COM 자동화 범위 밖, 사용자 관측 1회 대기(SP1 과 공유 항목).
- 재현: `cd decks/askewly-design-intro && node ~/.claude/skills/presentation-slides-yusung/templates/export-pptx.mjs export/askewly-design-intro.skill-track.pptx && pwsh -File ../claude-ppt-lab/scripts/open-verify-pptx.ps1 export/askewly-design-intro.skill-track.pptx`
- 크기 회고: step 3개·changeset 1개(custom-skills)+methodology·실증 커밋(본 레포) — milestone 라벨 정합.
