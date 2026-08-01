# M14 완료 보고 — Figma 귀환 경로 재가동 + 왕복 2회차 실증

Date: 2026-08-02 · Plan: `archive/plans/2026-08-01-m14-figma-return-path-relaunch.md` · Changeset: `changesets/20260801-m14-figma-return-path-relaunch/`

## 1. 결과

7월 파일럿(FW2-1) 이후 끊겼던 Figma 브리지를 재가동하고 귀환(회수) 구간을 기계화했다. ① 원격 Figma MCP 재등록+SKKU OAuth — 도구가 세션 재시작 없이 노출(FB1 대비 개선) ② SSOT 드리프트 재동기화 — 생성기 rem×16 결함·scope 미커버 3경로 보수 후 primitive 73·semantic 39 upsert, 2차 idempotent 0/0 ③ 승격 스냅숏 장부(`figma-push-snapshot.mjs`)·기계 회수 diff(`figma-return-diff.mjs`, charCode 대조) 스크립트 쌍 신설 ④ ShowcaseAtlas 섹션 승격(12카드 전부 semantic variables 바인딩) → 배리에이션 보드 선제작 → 사용자 판정 "손댈 부분 없음" → 무변경 왕복 회수 0/0/0 (102노드 unchanged, 오검출 0).

## 2. 이슈와 해결

- **rem/px 미구분(fresh 검증자 사전 적발 → 실행에서 실증)**: 생성기가 rem 토큰을 원값으로 밀어 타이포가 조용히 오염될 결함 — ×16 환산 보수, Verify에 rem 표본 8종 대조 추가로 폐구.
- **use_figma 대형 반환 20kb 절단**: 102노드 스냅숏 전량 회수 불가 — 청크 분할(3회)로 우회, 회수측은 노드별 지문(콤팩트)으로 전환. M15 방법론 반영 대상.
- **JS FNV 정밀도 유실**: `h*prime`이 2^53 초과로 1차 대조가 102/102 오검출 — `Math.imul` 교체 후 0/0/0 정합. 지문 대조 함정으로 기록.
- **partial 명시**: "사용자 변경→코드 반영" 구간은 이번 랩 미실증(변경 0건) — 그 구간 선례는 FW2-1(152→128px·U+2028 회수)이 보유.
- 드리프트 감사: 결정 로그(표면 ShowcaseAtlas·기존 파일·SKKU) 대비 이탈 없음. 무변경 전환은 plan failure probe에 예정된 경로.
- finding 큐 이월: 스냅숏 청크 옵션화 · 계약 §2.2 변수 description 복사 미구현(7월부터 잔존) — M15/후속.

## 3. 증거

- `evidence/figma-return-path/m14-roundtrip-2.md` (왕복 기록) · `m14-push-snapshot.json` (102노드 장부) · `m14-return-diff-result.json` (0/0/0)
- `research/2026-08-01-m14-figma-channel-recheck.md` (채널 현행 실측) · `research/figma-variables-sync-2026-07.md` Changelog (재동기화 표)
- 커밋: b8fdded(step-1) · f697271(step-2) · d464746(step-3) · 20ed22b(step-4a) · 5707efe(step-4)
- 실표면: Figma 실파일(어스큐리 팀)에서 사용자가 승격 섹션(35:3)·배리에이션 보드(40:2)를 직접 관측하고 "손댈 부분 없음" 판정 — 회수 지문 대조 assertion이 실제 평가되어 102노드 unchanged 보고. 사이트 코드 표면은 무변경(diff 0)이라 미접촉.
- 재현: `node scripts/figma-return-diff.mjs --self-test` (4항 PASS) · `node scripts/figma-push-snapshot.mjs 35:3 tmp/probe.js` → use_figma 실행 → 장부 대조. 재동기화 재현: `node scripts/generate-figma-variables-sync.mjs` → 페이로드 2본 use_figma 순차 실행(2차 실행 created 0/removed 0).
- 크기 회고: 4 step·changeset 1디렉터리(step 절 5개)·통합 검증(왕복) 보유 — milestone-grade 정합. 무마찰 구간 재검증(self-test·생성기) 2026-08-02 재실행 PASS.
