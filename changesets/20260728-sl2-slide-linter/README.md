# Changeset — SL2: 슬라이드 린터

- Plan: `plans/2026-07-28-sl2-slide-linter.md` · cross-repo: custom-skills (VI8 선례)

## step-1 — lint 모듈 + 배선

- custom-skills `7cb207c`: `templates/src/lint-principles.mjs` 신규(R1 블랙리스트+종결어미 의심 2단·R2 병렬 신호·R3 텍스트 총량, methodology §6 백링크) + `validate-slides.mjs` `--lint` 옵트인 배선.
- Verify: polish-smoke에서 `--lint` 실행 성공, 플래그 없이 출력 불변.

## step-2 — 위반 fixture

- custom-skills `02ad517`: `fixtures/lint-principles-smoke/content/slides.json` — R1·R2·R3 위반 각 1장 + 면제(cover) + 대조군 1장.
- Verify: 각 규칙 1건 검출·오탐 0·exit 0 (stdout 실관측).

## step-3 — 문서·배포·마감

- custom-skills: SKILL.md §9에 `--lint` 안내 1줄. `setup.sh --skill presentation-slides-yusung` 단일 배포(공유 레포 dirty 격리 — pdf 스킬 미포함). 배포본 재실행 동일 3건 검출.
- 커밋 훅 관측: custom-skills pre-commit이 출고 정합(배포본=소스)을 강제 — 배포 후 커밋 순서 필요.
