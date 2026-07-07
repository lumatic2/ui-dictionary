# Plan - FW2 파일럿 실증 + 운영화

Date: 2026-07-07
Milestone: FW2 (`ROADMAP.md`)
Horizon: `docs/horizons/2026-07-figma-workflow.md`
Objective: `docs/OBJECTIVE.md`
방법론: `methodology/figma-workflow.md` (하이브리드 왕복 — 이 파일럿이 그 5단계 절차의 첫 실행)

## 산문 요약

FW1이 채택한 하이브리드 왕복 워크플로우(코드로 디자인 → Figma 승격 → 사람 디테일링 → 코드 회수)를 askewly 실작업 1건으로 실증하고, 발견한 함정을 방법론 문서에 축적한 뒤, figma-codex-workflow 스킬 갱신 3건(백로그 큐)으로 방법론을 소비 좌표에 흡수한다.

## Step 트리

- [ ] FW2-1 파일럿 왕복 1회 — 대상(결정 로그) 화면을 방법론 §2 절차대로: ①taste direction 고정 → ②코드 디자인+브라우저 검증 → ③Figma 승격(`whoami` 확인, figma-use 로드, 어스큐리 팀) → ④**사용자 디테일링(사용자 작업 — 자연 정지점)** → ⑤`get_design_context` 회수+재검증. 사례 노트 `docs/research/figma-roundtrip-pilot-2026-07.md` (verify: Figma/코드 양쪽 증거 스크린샷 + 왕복 전후 diff 기록 + 브라우저 재검증)
- [ ] FW2-2 figma-codex-workflow 스킬 갱신 (artifact: changeset, 소스 `~/projects/custom-skills/figma-codex-workflow/`) — ①원격 MCP 주력 채널 명시 ②`whoami` 계정 확인 규칙 ③브리지 계약+방법론 문서 링크 + 파일럿 발견 함정 반영 (verify: `bash ~/projects/custom-skills/setup.sh` 배포 + 배포본 grep)

## 중단점

- FW2-1 ④ 사용자 디테일링은 사용자 실작업 — 승격 완료 후 핸드오프하고 사용자가 "다듬었다"고 알릴 때까지 정지.
- FW2-2 완료(= milestone 완료 = horizon 닫는 기준 도달) 후 horizon close 판정.

## 결정 로그

- **파일럿 대상 화면**: **확정 (2026-07-07 사용자) — 랜딩 hero 첫 뷰포트** (ui.askewly.com). 근거: PSS2(pending)와 시너지 — 파일럿 산출물이 PSS2 재료가 됨, 실작업 가치 최대.
- **파일럿 방향**: 확정 (FW1 결정 로그) — 하이브리드 왕복.
- **스킬 갱신 범위**: 확정 — 백로그 큐 3건 + 파일럿 발견분.
- 그 외 예상 결정: 없음.
