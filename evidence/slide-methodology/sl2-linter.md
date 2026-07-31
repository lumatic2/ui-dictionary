# Evidence — SL2: 슬라이드 린터

- Plan: `plans/2026-07-28-sl2-slide-linter.md` (연쇄 승인 집행 — SL1 영수증 `--chain SL2,SL3`)
- 구현 레포: custom-skills 커밋 `7cb207c`(모듈+배선) · `02ad517`(fixture) · SKILL.md 1줄(후속 커밋)

## DoD 대조

| 항목 | 결과 |
|---|---|
| R1~R3 옵트인 구현 (`--lint`) — 규칙 정본 백링크 | PASS (`templates/src/lint-principles.mjs` 머리 주석 = methodology §6 경로) |
| 위반 fixture 각 규칙 ≥1건 검출 | PASS — R1 "개요" 블랙리스트 1 · R2 병렬 신호 2개 1 · R3 275자>250 1 (stdout 실관측) |
| 대조군 오탐 0 | PASS — clean 슬라이드(완결 문장 제목·저밀도) lint 경고 0 |
| 기존 출력 무회귀 | PASS — polish-smoke `--lint` 없이 warning 0(종전과 동일), exit 0 계약 유지(warning 비차단) |
| setup.sh 배포 + 배포본 동일 동작 | PASS — `--skill presentation-slides-yusung` 단일 배포(남의 pdf dirty 미포함), `~/.claude/skills/.../fixtures/lint-principles-smoke`에서 동일 3건 검출 |

## 특기

- polish-smoke 기존 fixture에서 R1이 "정리" 제목 1건을 실제 적발 — 기존 자산에도 유효한 신호임을 부수 확인.
- R1 종결어미 부재는 위반이 아니라 "의심 N건" 요약으로만 보고(오탐 폭주 방지 — 계획 failure probe 반영).

## 판정

SL2 DoD 충족 — completed (2026-07-28).
