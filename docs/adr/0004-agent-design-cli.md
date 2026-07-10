# ADR 0004 — Agent Design CLI를 앱보다 먼저, CLI-first 인터페이스로

Date: 2026-07-10
Status: accepted

## Context

Docs Article Depth & Page Examples horizon close 후 "콘텐츠 저작으로 닫히는 갭"이 소진됐다. 남은 방향은 Download 껍데기가 약속한 데스크톱 앱, 에이전트용 CLI, Docs 심화(Principles·설치법)였고, 사용자가 앱+CLI 우선을 제안했다. 시장 조사(`docs/market/2026-07-10-agent-design-cli.md`)로 선례를 수집했다.

## Decision

1. **시퀀스: CLI → 앱 → Docs.** CLI를 코어 엔진으로 먼저 만들고(H1), 데스크톱 앱은 그 엔진의 GUI로 후속(H2), Docs는 실물 기반 설치법·사용법 + Principles로 마무리(H3). 사용자 확정 2026-07-10.
2. **CLI v1 범위: 조회 + 주입 + 검증.** terms/tokens/recipes 질의, init(DESIGN.md·tokens 생성)·add(레시피 주입), verify(색 리터럴/토큰 참조 lint). 조사 근거: 기존 토큰 CLI(Style Dictionary·Terrazzo)는 전부 변환기로 질의·검증 엔진이 공백, 주입은 shadcn registry 모델("소스 복사 주입", 오픈 스키마)이 검증됨.
3. **이름: npm `@askewly/design`, 바이너리 `askewly-design`.** 기존 일정관리 CLI `askewly`와 충돌 회피.
4. **위치: 이 레포 `packages/cli`.** SSOT(tokens/·docs/ui-vocabulary/·recipes/)가 이 레포에 있어 데이터 파생·검증이 직결. 후속 앱도 packages/로 확장.
5. **CLI 1차, MCP 보류.** 조사 근거: MCP의 CLI 대비 토큰비용 4-32배 담론("MCP is dead, long live the CLI") — 에이전트 소비는 CLI+llms.txt를 1차로, MCP 서버는 수요 확인 후 부가 옵션.

## Consequences

- H2 앱은 "OS-레벨 기능이 있어야 정당화"(조사: Sip/Raycast/Figma Desktop 선례) — 웹 wrapper 금지 제약을 계승한다.
- 수익화는 CLI 코어 무료 + 프리미엄 콘텐츠(blocks/pack) 패턴(shadcn 생태계·Tailwind Plus 선례)을 기본 가설로 둔다 — Pro 에셋 모델 결정(후속)과 연결.
- npm publish는 사용자 npm 계정 크레덴셜이 필요 — 해당 step은 발급/로그인 전까지 blocked로 둔다.
