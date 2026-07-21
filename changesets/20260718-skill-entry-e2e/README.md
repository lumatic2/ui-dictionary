# changeset: skill entry E2E evidence

- Date: 2026-07-18
- Milestone: SE2 step-2 (`plans/2026-07-18-se2-global-removal-e2e.md`)
- Evidence: `evidence/skill-entry/` (로그 3 + 스크린샷 5)

## 시나리오

전역 "디자인 판정" 절 제거 후, 토큰 없는 스크래치 프로젝트에서 askewly 언급 없이 소형 디자인 작업을 headless로 지시 — skill 자동 발화를 관측.

## 결과

- **Claude 1차 (FAIL — 계획된 failure probe)**: `claude -p` sonnet, "연락처 폼" — skill 미발화, Write 1회로 직행. → description 강화("MANDATORY, 소형 작업 예외 없음", custom-skills 535bf2b) 후 재시도.
- **Claude 2차 (PASS)**: "뉴스레터 배너" — Skill(askewly-design) 최초 호출 → llms.txt·entry-protocol·anti-patterns·principles·style-signature·tokens.css fetch → 무토큰 프로젝트라 askewly 토큰 fallback(정확 판정) → 구현 → Playwright 스크린샷 3장(light/dark/dark-error) → 5원칙 자가판정 보고 + "자가판정은 하한선" 사람 게이트 문구. (`e2e-claude2.log`, `banner-*.png`)
- **Codex (PASS)**: `codex exec --skip-git-repo-check`, "프로필 카드" — askewly-design skill 참조, ui.askewly.com fetch 78회(entry-protocol 7·anti-patterns 13·style-signature 6·tokens.css 8), Chrome 스크린샷 light/dark + 육안 재검토. 1차 exit 1은 비git 폴더 플래그 문제(라우팅 무관). (`e2e-codex2.log`, `card-*.png`)

## 검증 checklist

- [x] Claude E2E: skill 발화 + 프로토콜 fetch + 스크린샷 산출 (2차)
- [x] Codex E2E: skill 경유 fetch + 스크린샷 산출
- [x] Failure probe 실작동: 1차 미발화 FAIL 기록 → description 조정 → 재시도 PASS (plan 내장 절차)
- [x] 부수 관측: 기지 결함 "Codex sandbox HTTPS 차단"이 이번 실행(`--skip-git-repo-check`, temp 폴더)에서는 재현되지 않음 — ROADMAP 유지보수 후보 항목에 조건 명시 여지
