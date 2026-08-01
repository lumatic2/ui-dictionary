# M14 왕복 2회차 실증 — ShowcaseAtlas (무변경 왕복)

Date: 2026-08-01 승격 → 2026-08-02 회수
Plan: `plans/2026-08-01-m14-figma-return-path-relaunch.md` step-4
대상: 홈 ShowcaseAtlas 섹션 (사용자 확정 표면) → Figma "Askewly Design Tokens" 파일 "Atlas Pilot 2026-08-01" 페이지(35:2), 프레임 35:3 (1440×2572)

## 왕복 기록

1. **승격**: 헤더+12카드를 use_figma 6회 incremental 구축 — 색 전부 semantic variables 바인딩(surface/base·raised, text/default·muted·secondary, border/default, action/primary), Geist/Geist Mono. 구축 중 결함 2건을 스크린샷 검증으로 잡아 폐구(제목 clip→wrap 전환, 헤더 2줄화로 그리드 60px 시프트).
2. **push 스냅숏 장부**: `m14-push-snapshot.json` — 102노드 전수(fills/strokes/radius/padding/characters/breakCodes/boundVar).
3. **배리에이션 보드 선제작**(40:2): Row A 카드 radius 4/6/8 · Row B 데모 배경 base/muted/raised.
4. **사용자 디테일링**: **"딱히 손댈 부분이 없어"** (2026-08-02) — 변경 0건 확정, 무변경 왕복으로 전환(plan failure probe 예정 경로).
5. **기계 회수**: 회수측 지문(노드별 FNV-1a 32bit, 동일 snap 인코딩) vs push 장부 전수 대조 → **changed 0 / added 0 / removed 0 / unchanged 102**. 결과: `m14-return-diff-result.json`.
6. **코드 반영·브라우저 재검증**: 변경 0건이므로 코드 무변경 — 재검증 생략(사유: diff 0, 적용 대상 없음).

## 판정

- **왕복 배관 PASS** — 승격→장부→디테일링 창구→기계 회수 감지의 전 구간이 도구로 닫힘. 무변경이 무음(0/0/0)으로 판정되는 것 자체가 diff 정밀도의 실물 검증(오검출 0).
- **partial 명시**: "사용자 변경이 코드로 반영"되는 구간은 이번 랩에서 실증되지 않음(변경 0건). 그 구간의 실증 선례는 FW2-1(2026-07-07, 152→128px + U+2028 줄바꿈 회수 — `research/figma-roundtrip-pilot-2026-07.md`)이 보유.

## parity 한계 (기록)

- 라이브 데모 12종 → placeholder 프레임("live demo (id)"), lucide 아이콘 → 스트로크 rect, hover 상태 미이관 — 파일럿과 동일 계열의 승격 한계.

## 이번에 부딪힌 함정 (방법론 반영 대상, M15)

1. **use_figma 대형 반환 20kb 절단** — 102노드 스냅숏은 한 번에 못 받는다. 청크 분할(top-level children slice) 또는 노드별 지문(콤팩트) 회수로 우회. `figma-push-snapshot.mjs` 청크 옵션 후보.
2. **JS FNV 해시는 `Math.imul` 필수** — `h * 0x01000193`가 2^53 정밀도를 넘어 유실, 1차 대조가 102/102 오검출(전량 변경으로 오판). Math.imul 교체 후 0/0/0 정합. 지문 대조를 방법론에 넣는다면 이 함정 명기.
3. `get_metadata`(nodeId 생략) 페이지 목록 불완전 — 페이지 전수는 use_figma 읽기가 정본 (step-1 발견 재확인).

## 증거 좌표

- push 장부: `evidence/figma-return-path/m14-push-snapshot.json` (102노드)
- 회수 대조 결과: `evidence/figma-return-path/m14-return-diff-result.json`
- Figma: https://www.figma.com/design/xY42P22E7CtnvuxX8ZzZec/?node-id=35-3 (섹션) · node 40:2 (보드)
- 승격 시각 검증 스크린샷: use_figma/get_screenshot 3회(구축 중간·결함 수정 후·최종) — 세션 기록.
