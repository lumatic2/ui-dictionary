# Plan - CF1 Docs Foundations And Agent Recipes 공개

Date: 2026-07-10
Milestone: CF1 (`ROADMAP.md`)

## 위계

- Objective: `docs/OBJECTIVE.md` — 공개 레퍼런스 사이트 + 에이전트용 디자인 시스템
- Horizon: `docs/horizons/2026-07-content-fill.md` (active)
- Milestone: CF1 — Docs Foundations And Agent Recipes 공개
- 완성 판정 계약: `docs/design-system/site-blueprint.md` — Docs 아티클 행(정의·사용 이유·실예시·상태/반응형/토큰 연결) + source-quality 공통 하한선

## Scope

이번 milestone: Foundations 아티클 7종 실콘텐츠 + Agent Recipes 표면 연결 + 게이트 열기 + 배포. Showcase(CF2)·Patterns(CF3)·Pro/Download는 범위 밖.

콘텐츠 소스(SSOT — 아티클은 파생, 발명 금지): `tokens/askewly.tokens.json`(3-tier 토큰), `knowledge/typography.md`·`color.md`·`spacing-layout.md`·`components.md`, `docs/design-system/pattern-taxonomy.md`, `recipes/`(5종), llms.txt 자산.

중단점: ① 아티클이 SSOT와 어긋나면 blocked(SSOT 우선) ② 배포는 push 승인 후.

## Step 트리

- [ ] Step 1 — 코어 3종 아티클: color / typography / spacing-layout — `knowledge/` 해당 문서 + tokens SSOT에서 파생. 각 아티클: 정의·사용 이유·실예시(토큰 참조 코드 스니펫, 복붙 가능)·good/bad 비교·라이트/다크·에이전트 제약. (verify: dev 렌더 + 스니펫이 실제 토큰 이름과 일치 + lint/build)
- [ ] Step 2 — 시스템 4종 아티클: tokens / dark-mode / motion / accessibility — tokens SSOT 3-tier 구조·다크 모드 semantic 컬렉션·knowledge/components.md·WCAG 기준에서 파생. 같은 완성 판정. (verify: 동일)
- [ ] Step 3 — Agent Recipes 표면 채우기: `recipes/` 5종 목록·요약 카드 + llms.txt 자산 링크(실링크 검증) + 소비 방법(Claude Code/Codex 안내) + 검증 체크리스트. (verify: dev 렌더 + llms.txt 링크 200 + lint/build)
- [ ] Step 4 — 게이트 열기 + 배포: Foundations 7종+Agent Recipes의 shell 플래그 해제, Colors 페이지 foundation 링크 게이트 해제, 프로덕션 preview 스모크(다른 껍데기 비노출 회귀 포함), Chrome evidence(데스크톱/모바일·라이트/다크), push 승인 후 실사이트 확인. (verify: 프로덕션 스모크 + 실패 모드 — Pro 하위/Download는 여전히 비노출)

## 결정 로그

- [확정 2026-07-10] CF1이 horizon 첫 milestone (사용자 승인 — 재료 준비도 순).
- [AI 기본값] 아티클 언어 = 영어 (사이트 기존 콘텐츠 일관), 서술 방식 = Tailwind docs 스타일 (blueprint 계약).
- [AI 기본값] 아티클은 SSOT 파생 원칙 — 새 디자인 규칙 발명 금지, tokens/knowledge에 없는 주장 넣지 않음.
- [사용자 소유 — 예정] 배포 push는 Step 4에서 승인 요청 (프로덕션 변화: Docs에 Foundations·Agent Recipes 공개).
