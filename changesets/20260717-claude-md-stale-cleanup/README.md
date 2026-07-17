# CLAUDE.md stale 정리 — Structure/Related 를 실제 레포 상태에 동기화

- Date: 2026-07-17
- Milestone: 유지보수 (ROADMAP 유지보수 후보 — AD1 실사에서 발견)
- Scope: `CLAUDE.md` (Structure 블록, 스킬 소스 주석, 작업 패턴 1, Related)

## What

- Structure 블록이 실제와 불일치: `templates/minimal.md` 등 스타일 템플릿 4종은 존재하지 않음(실제는 `DESIGN.md.tmpl` 등 부트스트랩 템플릿), `docs/OBJECTIVE.md`는 루트 `OBJECTIVE.md`로 이동됨, `knowledge/` 세부 파일 목록 stale, `docs/design-system/` 미기재.
- Related의 `/design-bootstrap` 진입점 서술 제거 — `~/projects/custom-skills/design-bootstrap/` 소스 부재(AD1 실사 2026-07-17). 에이전트 진입 경로를 `llms.txt → entry-protocol.md`로 교체.
- 존재하지 않는 `design-consultation`·`design-harness`·`design-bridge` 스킬 언급 제거.

## Verification

- [x] `ls templates/ knowledge/ methodology/ docs/ examples/` 실측과 Structure 블록 대조
- [x] `ls ~/projects/custom-skills/` 에 design-* 스킬 소스 부재 확인
- [x] OBJECTIVE.md 루트 존재 확인
