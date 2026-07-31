# 완료 — SL2 슬라이드 린터

> 완료: 2026-07-28 · SL2 (goal `slide-methodology`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.**

## 1. 결과

거장 원칙 3개(R1 제목=완결 문장 · R2 슬라이드당 메시지 1 · R3 텍스트 과밀)가 `presentation-slides-yusung` validator의 옵트인 검사(`--lint`)로 구현됐다. 전부 warning·비차단이고 각 경고가 규칙 id+근거 등급(실증/통설)을 문자열로 들고 다닌다. 규칙 정본은 이 레포 `methodology/slide-production.md` §6 — 코드가 백링크한다. 배포 완료(setup.sh 단일 스킬 배포), 이후 만드는 모든 덱에서 사용 가능.

## 2. 이슈와 해결

- custom-skills pre-commit 훅이 출고 정합(소스=배포본)을 강제 — 배포 후 커밋 순서로 해소. `--skill` 단일 배포 옵션으로 남의 dirty(pdf 스킬 진행분)를 격리했다.
- R1 종결어미 부재를 위반으로 올리면 오탐이 폭주할 위험 — 블랙리스트=위반 / 종결어미 부재="의심 N건" 요약 2단으로 설계(계획 failure probe 선반영).
- DoD 잔여 없음. R4(폰트 하한)는 스펙대로 구현 제외 — template-core `checkSlideHeuristics` 기존 코드 지정.

## 3. 증거

- changeset: `changesets/20260728-sl2-slide-linter` (custom-skills 커밋 7cb207c·02ad517+SKILL.md)
- 검증: evidence `evidence/slide-methodology/sl2-linter.md` — DoD 5항 PASS. 부수 발견: 기존 polish-smoke fixture에서 R1이 "정리" 제목 실적발.
- 크기 회고: changeset 1개(cross-repo 커밋 3)로 닫힘 — 독립 응집 변경 3개(모듈·fixture·문서/배포)라 정합.
- 실표면: 배포본 `~/.claude/skills/presentation-slides-yusung/`에서 `validate-slides.mjs --lint`를 위반 fixture에 실행 — R1·R2·R3 각 1건 검출 stdout 관측, 대조군 오탐 0, 플래그 없으면 출력 불변.
- 재현: `cd ~/.claude/skills/presentation-slides-yusung/fixtures/lint-principles-smoke && node ../../templates/validate-slides.mjs --lint`
