# 완료 — SP2 HTML 트랙 스킬 업그레이드

> 완료: 2026-07-31 · SP2 (goal `slide-pipeline-upgrade`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.** 설계 논거·경위는 custom-skills changeset 과 커밋 메시지에.

## 1. 결과

SP1 채택 3건을 presentation-slides-yusung 에 구현·배포했다. ① 커스텀 브랜드 테마 트랙 — `meta.template: "custom"` + 덱 로컬 `content/theme.json` 주입(REQUIRED_THEME_VARS 29키 전건 검증, 누락=FAIL) + `scripts/design-md-to-theme.mjs`(DESIGN.md→theme.json 휴리스틱 변환, 미해석 키는 기본값 미채움+exit 1) + fixture. ② G5 를 "대표 1장 스타일 캘리브레이션 루프"로 승격(편차 체크 4항·코드 diff 교정·수렴 반복). ③ 리디자인 입력 트랙(md 소스) 문서화. custom-skills 커밋 9346b41·f64a4ee, changeset `20260731-sp2-html-track-upgrade`.

## 2. 이슈와 해결

- 커밋 가드가 배포 정합을 요구해 step-3 예정이던 setup.sh 배포가 step-1 커밋 시점으로 앞당겨짐 — 정합 통과로 해소, 절차 영향 없음.
- python heredoc 경유 JS 작성에서 `\n` 이스케이프 한 겹 소실 → 문법 오류 — Edit 로 직접 수정.
- 변환기 chart-3 이 SP1 수동 선택과 다른 브랜드색 선택(휴리스틱 순서 차이) — `--set` 보완 경로 실존, evidence 기록으로 수용.

## 3. 증거

- evidence: `evidence/slide-pipeline/sp2-skill-upgrade.md`.
- 검증: smoke-runner 18 fixtures + 3 negative 전부 PASS(기존 17 무회귀) · 음성 케이스(chart-3 제거 → validator exit 1) · 배포 출고 정합 2건 통과(claude·codex).
- 실표면: 배포본(`~/.claude/skills/...`) 변환기를 MiniMax DESIGN.md 에 실행 → theme.json 29 vars 생성 → custom 템플릿 덱 빌드(validate·build·overflow PASS) → Chrome 실렌더에서 MiniMax 색 주입을 스크린샷으로 확인(`evidence/slide-pipeline/img/lab-custom-theme-proof.png`), 변환 산출이 fixture 고정본과 identical·SP1 수동 매핑 핵심 hex 10키 일치 assertion 성공.
- 평가 못 함: 없음 — DoD 전 항목 기계 평가됨.
- 재현: `node ~/.claude/skills/presentation-slides-yusung/scripts/design-md-to-theme.mjs research/sources/minimax-design-md.md /tmp/theme.json && node ~/.claude/skills/presentation-slides-yusung/../presentation-slides-yusung/scripts/smoke-runner.mjs` (소스 레포에서는 `node scripts/smoke-runner.mjs`)
- 크기 회고: step 3개·changeset 1개(custom-skills)+실증 커밋(본 레포) — milestone 라벨 정합.
