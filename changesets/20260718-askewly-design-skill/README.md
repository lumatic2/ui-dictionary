# changeset: askewly-design entry skill (기록)

- Date: 2026-07-18
- Milestone: SE1 step-2 (`plans/2026-07-18-se1-skill-and-human-gate.md`)
- 실변경 위치: `~/projects/custom-skills/askewly-design/SKILL.md` (커밋 eedebd1) — 본 changeset은 ui-dictionary 측 기록

## 변경

- `askewly-design` skill 신설: 디자인·UI 작업 진입 라우터. 얇은 라우터 계약 — 정본(entry-protocol·시그니처·레시피)은 ui.askewly.com에서 매번 fetch, 내용 복제 금지.
- 마무리 안무: 스크린샷(라이트/다크 ≥2장 + 핵심 상태) + 시그니처 자가 판정 첨부 + **사람 확인 전 완료 선언·배포 금지**.
- `setup.sh --skill askewly-design` 배포: Claude(`~/.claude/skills/`)·Codex(`~/.codex/skills/`) 양쪽.

## 검증 checklist

- [x] 양 배포처 SKILL.md 존재 (ls 확인)
- [x] 배포 직후 현 세션 skill 목록에 askewly-design 등장 (available-skills reminder 관측)
- [x] Failure probe: `setup.sh --skill <미존재이름>` 이 exit 0으로 조용히 성공(배포 0건)함을 확인 — 배포 검증은 파일 존재 확인으로 보완해야 함 (setup.sh 개선 후보로 custom-skills에 인계 가능)
