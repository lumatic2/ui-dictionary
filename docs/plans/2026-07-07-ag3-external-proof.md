# Plan - AG3 외부 프로젝트 실전 실증 (development-dictionary)

Date: 2026-07-07
Status: completed 2026-07-07 (3/3 steps PASS — record frozen)

## 위계

- Objective: `docs/OBJECTIVE.md` (장기 아크 5)
- Horizon: `docs/horizons/2026-07-agent-integration.md` (active, AG1·AG2 완료)
- Milestone: ROADMAP `AG3`

## Scope

외부 레포 `~/projects/development-dictionary`(Askewly Dev Guide)에 "VS Code 최대로 활용하기" 가이드 페이지 1개를 추가한다 — Extension 활용 위주 + Cursor(VS Code fork) 사이드 패널 에이전트의 작동원리와 활용법 (2026-07-07 사용자 지정 주제). 구현 에이전트는 **live 진입점(`https://ui.askewly.com/llms.txt`)만으로** Askewly Design SSOT(토큰·레시피)를 소비한다 — ui-dictionary 로컬 파일 직접 읽기 금지(실증 무결성).

중단점: ① 게이트 검증 FAIL 시 blocked 보고 ② development-dictionary push는 별도 승인 ③ AG3 완료 시 horizon 닫는 기준 도달 → close 판정 보고 후 정지.

## Step 트리

- [x] Step 1 — 소비 구현 (PASS) (sonnet 위임): 에이전트가 llms.txt 진입점 경유로 토큰·레시피를 fetch해 `#/guides/vscode` 해시 뷰 + `vscode-guide.tsx` 구현, 소비 경로 로그 반환 (verify: 에이전트 산출물 + fetch한 URL 목록)
- [x] Step 2 — 게이트 검증 (PASS) (Fable): development-dictionary `npm run build`·`npm run lint` PASS + 색 리터럴 스캔 0(hex/rgb 금지, 토큰 var만) + dev server 브라우저 렌더 확인 (verify: 커맨드 출력 + 스크린샷)
- [x] Step 3 — 사례 기록 (PASS) + 완료: 소비 경로·적용 레시피를 `docs/research/ag3-external-proof-2026-07-07.md`에 기록, AG3 complete, horizon close 판정(Objective 임팩트) (verify: roadmap_sync + horizon doc)

## 결정 로그

1. **주제·범위** — 확정(사용자, 2026-07-07): VS Code 활용 페이지, Extension 위주 + Cursor 에이전트 원리·활용.
2. **통합 방식** — 기술 기본값: 해시 뷰(`#/guides/vscode`) + 최소 진입 링크, 기존 도시 맵 랜딩 미변경 (router 없는 단일 App.tsx 구조 존중).
3. **토큰 반입** — 기술 기본값: fetch한 tokens.json에서 페이지 스코프 CSS vars 생성(생성 출처 URL 주석), 색 리터럴 0.

이 외 예상 사용자 결정: 없음.

## planning_gate (요약)

- team_validation_mode: subagent
- delegation_decision: remote_background_agents=use — 실증 자체가 "에이전트가 진입점으로 소비"이므로 구현을 sonnet 에이전트에 위임하는 것이 증거 정합적. target_roles=["explorer/구현"], execution_path=claude_subagent. 결과는 Fable 게이트(Step 2) 통과 전 미완료.
- spec_delta: 없음 (spec_skip_reason: horizon doc·ROADMAP AG3 계약의 이행)
- dod: build/lint PASS + 색 리터럴 0 + 브라우저 렌더 관측 + **실패 모드**: 소비 로그에 로컬 ui-dictionary 경로 접근이 없음을 확인(진입점 우회 적발)
