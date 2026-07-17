# Plan - FW2 파일럿 실증 + 운영화

Date: 2026-07-07
Milestone: FW2 (`ROADMAP.md`)
Horizon: `docs/horizons/2026-07-figma-workflow.md`
Objective: `docs/OBJECTIVE.md`
방법론: `methodology/figma-workflow.md` (하이브리드 왕복 — 이 파일럿이 그 5단계 절차의 첫 실행)

## 산문 요약

FW1이 채택한 하이브리드 왕복 워크플로우(코드로 디자인 → Figma 승격 → 사람 디테일링 → 코드 회수)를 askewly 실작업 1건으로 실증하고, 발견한 함정을 방법론 문서에 축적한 뒤, figma-codex-workflow 스킬 갱신 3건(백로그 큐)으로 방법론을 소비 좌표에 흡수한다.

## Step 트리

- [x] FW2-1 파일럿 왕복 1회 — 랜딩 hero, 방법론 §2 ①~⑤ 전체 완주: 브라우저 검증 → Figma 승격(variables 바인딩, "Hero Pilot 2026-07-07" 페이지) → 사용자 디테일링(hero 152→128px) → 속성 스냅숏 diff 회수 → 코드 반영+재검증 (verify: before/after 스크린샷 `docs/research/evidence/` + 사례 노트 + oxlint PASS — 커밋 2ebefa8, 0f3e1fb)
- [x] FW2-2 figma-codex-workflow 스킬 갱신 — 3건(원격 MCP 주력·whoami 규칙·계약 링크) + 파일럿 발견 3건 반영, setup.sh 배포 (verify: 배포본 grep whoami=2·contract=1 + skill-trigger-acceptance PASS — custom-skills 커밋 10450ae)

## 중단점

- FW2-1 ④ 사용자 디테일링은 사용자 실작업 — 승격 완료 후 핸드오프하고 사용자가 "다듬었다"고 알릴 때까지 정지.
- FW2-2 완료(= milestone 완료 = horizon 닫는 기준 도달) 후 horizon close 판정.

## 결정 로그

- **파일럿 대상 화면**: **확정 (2026-07-07 사용자) — 랜딩 hero 첫 뷰포트** (ui.askewly.com). 근거: PSS2(pending)와 시너지 — 파일럿 산출물이 PSS2 재료가 됨, 실작업 가치 최대.
- **파일럿 방향**: 확정 (FW1 결정 로그) — 하이브리드 왕복.
- **스킬 갱신 범위**: 확정 — 백로그 큐 3건 + 파일럿 발견분.
- 그 외 예상 결정: 없음.
