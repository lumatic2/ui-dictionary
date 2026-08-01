# PLAN — M14: Figma 귀환 경로 재가동 + 왕복 2회차 실증 (figma-return-path 1/2)

> 생성: 2026-08-01 · 갈래: 제작 표면 왕복(Figma 브리지) · scope: 7월 파일럿(FW2-1) 이후 끊긴 채널을 복구하고, 드리프트한 SSOT를 재동기화한 뒤, 귀환(회수) 절차를 기계화해 왕복 2회차를 실증한다. goal `figma-return-path` 1번 milestone (연쇄: M14 → M15).
Status: approved (사용자 승인 2026-08-01 "ㄱㄱ" — 연쇄 M14→M15 일괄 승인, 결정 3건 추천안 확정)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "사람이 Figma 같은 익숙한 제작 표면에서 디자인하고, 그 결과가 정본 토큰·문서를 거쳐 production code로 무손실 왕복한다"는 성공 모습의 직접 구현.
- **goal**: `figma-return-path` — 사용자 확정 2026-08-01 "A를 다음 세션에서 한다" (핸드오프).
- **리서치 입력**: 기존 자산 4본 정독 완료 — `docs/design-system/figma-bridge-contract.md`(FB2 계약) · `research/figma-capability-map-2026-07.md`(FB1 채널 실측) · `research/figma-variables-sync-2026-07.md`(FB3 나가는 방향 idempotent PASS) · `research/figma-roundtrip-pilot-2026-07.md`(FW2-1 왕복 1회 수동 완주) + `methodology/figma-workflow.md`(왕복 5단계 방법론). **현행 갭 실측(2026-08-01)**: ① Figma MCP 이 기기 Claude Code 미연결(서드파티 read-only 래퍼만 mcp-disabled 보관) ② 토큰 SSOT 드리프트 — 7월 동기화(59변수) 이후 M2 emphasis·status 16변수(emphasis 6+status 10) + M6 타이포 스케일 9단계 추가 ③ 회수 절차 미기계화(파일럿 교훈 "승격 스냅숏 보존할 것"이 규약으로만 남음). 잔여 미지수(도구 목록 변화·유료화 여부)는 step-1 실측이 리서치 산출물로 닫는다.

## Scope Boundary
- **포함**: ① 원격 Figma MCP 재연결 + 현행 실측(research doc) ② SSOT→Figma variables 재동기화(idempotency 재검증) ③ 승격 스냅숏 장부 기계화 ④ 왕복 2회차 실증(승격→배리에이션 보드→사용자 디테일링→기계 회수→브라우저 재검증).
- **제외**: Figma→Askewly 토큰 역수입(계약 §3 금지 유지) · 라이브러리 publish·파일 공유 설정(fallback UI 조작) · 스킬·방법론 정본화(M15) · 배포 push(세션 일괄 — deploy batching).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped / **human gate 2곳** — step-1 OAuth 로그인(+MCP 도구 노출에 세션 재시작 필요 가능성, FB1 선례) · step-4 사용자 디테일링(사용자가 Figma에서 다듬는 동안 대기).
- rollback/cleanup: Figma 쪽은 `askewly/*` 컬렉션·이번 승격 페이지만 소유(계약 §2.4 — 그 밖 절대 불변). 코드 쪽은 커밋 단위 revert. 실패 시 승격 페이지 remove 스크립트로 원상복구(FB1 3차 실측 선례).

## 스캐폴딩 결정
- source-of-truth: `tokens/askewly.tokens.json`(SSOT 우위 — 계약 §0) · 왕복 절차 정본 = `methodology/figma-workflow.md` §2 · 채널 규약 = 계약 §1~2.
- 검증: step별 Verify + 통합 = 왕복 evidence(before/after 스크린샷 + 스냅숏 diff 표) + idempotency 표(2차 실행 created 0/removed 0) + Vite dev·Playwright 재검증·lint.
- 배포/운영: push 없음(M15 마감 시 일괄, 사용자 승인 후). Figma 쓰기는 `askewly/*` 소유 경계 내에서만.
- 자기선언 도메인 — 계정 경계: 원격 MCP OAuth = SKKU(`yusung345@g.skku.edu`), 대상 파일은 SKKU가 닿는 어스큐리 팀 — `whoami` 선행 확인 필수(계약 §1).
- 검토 후 제외: 로컬 Dev Mode MCP·REST variables API — FB1 3차 판정(플랜 게이트·Enterprise 전용)으로 제외 확정, 재검토 불요.

## 결정 로그
- status: resolved
- **[사용자 확정 2026-08-01] 왕복 2회차 대상 표면 = (a) 홈 ShowcaseAtlas 섹션** (추천안 승인 — 시각 밀도·디테일링 가치 기준).
- **[사용자 확정 2026-08-01] 대상 파일·계정 = 기존 "Askewly Design Tokens"(`xY42P22E7CtnvuxX8ZzZec`, 어스큐리 팀) 재사용 + SKKU OAuth 유지** — variables 59개가 살아있는 파일이라 바인딩 즉시 가능(파일럿 교훈).
- **기술 결정**: ① 회수 방식 = 승격 스냅숏 전수 대조(`use_figma` 읽기 스크립트, charCode 스캔 포함) — `get_design_context`보다 정밀·저렴(파일럿 실측) ② 배리에이션 보드 선제작 = 디테일링 핸드오프 기본(파일럿 교훈 확증분) ③ MCP 재연결은 `claude mcp add --transport http figma https://mcp.figma.com/mcp` 후 OAuth 창 즉시 띄움(전역 인증 절차 규칙 — 로그인은 사용자).

## Step 트리

- [x] **step-1 — 채널 복구 + 현행 실측 (research)**
  - Artifact: Figma MCP 재연결 + `whoami`·대상 파일 metadata·`askewly/*` variables 생존 확인 + 도구 목록·유료화 변화 실측 → `research/2026-08-01-m14-figma-channel-recheck.md` (FB1 형식, 소비처=이 plan 백링크).
  - Files: write research/2026-08-01-m14-figma-channel-recheck.md. read docs/design-system/figma-bridge-contract.md.
  - Risk: 기계적 (human gate — OAuth 로그인 사용자 몫 + 도구 노출에 세션 재시작 필요 가능성, 재시작 시 이 plan 이 이어받기 정본)
  - Dependencies: 없음
  - Verify: `whoami` 200(SKKU 계정 확인) + 대상 파일 `get_metadata` 성공 + variables 컬렉션 2개 존재 확인.
  - Failure probe: 유료화·플랜 게이트로 `use_figma` 쓰기 차단 시 — 실측 근거를 research doc에 남기고 decision_required 정지(대안 채널 재판정은 사용자 결정).
  - Commit: changeset `m14-figma-return-path-relaunch` (README 절: step-1).

- [x] **step-2 — SSOT 드리프트 재동기화 (나가는 방향 재가동)**
  - Artifact: `node scripts/generate-figma-variables-sync.mjs` 재실행 → 신규 토큰(emphasis·status 17변수 + 타이포 스케일 9단계 등) upsert + 2차 실행 idempotency 재검증 → 결과 표를 `research/figma-variables-sync-2026-07.md` Changelog 절 append(동결 본문 불변) 또는 신규 기록.
  - Files: read tokens/askewly.tokens.json, scripts/generate-figma-variables-sync.mjs. write tmp/figma-sync-*.js(gitignored), research 기록.
  - Risk: 기계적 (upsert·소유 경계 내 — 계약 §2.4)
  - Dependencies: step-1
  - Verify: 1차 실행 created>0(신규 토큰 반영) + 2차 실행 created 0/removed 0 + `get_variable_defs` 표본 대조 — **표본에 rem 단위 타이포 토큰 1개 필수**(단위 변환 정합 확인).
  - Failure probe: **확인된 결함(fresh 검증자)** — 스크립트 dimension 분기(`'unit' in val`→FLOAT)가 px/rem 미구분: M6 신규 단계(2xs·xs·3xl·5xl·7xl 등)는 rem 값(0.625 등)이라 px 값과 섞여 조용히 잘못 밀린다. 스크립트에 단위 인지 변환(rem→px 환산 또는 단위별 분리) 보수 후 재실행, 보수분 커밋.
  - Commit: changeset `m14-figma-return-path-relaunch` (README 절: step-2).

- [x] **step-3 — 승격 스냅숏 장부 기계화 (귀환의 전제 도구)**
  - Artifact: 승격 시 노드ID+push 값(fontSize/fills/padding/radius/strokes/characters)을 JSON 장부로 보존하고, 회수 시 현재 값과 전수 대조(charCode 10/13/8232/8233 스캔 포함)해 diff 를 출력하는 스크립트 쌍 — `scripts/figma-push-snapshot.mjs`(장부 생성용 use_figma 페이로드 생성) + `scripts/figma-return-diff.mjs`(장부 vs 회수 스냅숏 대조).
  - Files: write scripts/figma-push-snapshot.mjs, scripts/figma-return-diff.mjs. read research/figma-roundtrip-pilot-2026-07.md(교훈 목록).
  - Risk: 기계적 (신규 스크립트 — 기존 표면 불변)
  - Dependencies: step-1 (채널 확정 후 페이로드 형식 고정)
  - Verify: 파일럿 기록의 함정 4건(U+2028 은닉·정규식 리터럴 SyntaxError·스냅숏 미보존·눈대중 diff)이 스크립트로 각각 차단됨을 self-test 또는 픽스처로 확인.
  - Failure probe: use_figma 반환 크기 제한으로 전수 스냅숏 불가 — 노드 배치 분할 조회로 우회, 한계 기록.
  - Commit: changeset `m14-figma-return-path-relaunch` (README 절: step-3).

- [x] **step-4 — 왕복 2회차 실증 (통합 검증, human gate)**
  - Artifact: 확정 표면 1개를 승격(variables 바인딩·스냅숏 장부 생성) → 유한 선택지 배리에이션 보드 선제작 → **사용자 디테일링(human gate)** → `figma-return-diff` 기계 회수 → 코드 반영 → Vite+Playwright 재검증 → `evidence/figma-return-path/m14-roundtrip-2.md`(before/after 스크린샷 + diff 표 + 교훈).
  - Files: write examples/ui-vocabulary-site/src/**(확정 표면 코드), evidence/figma-return-path/m14-roundtrip-2.md. read 스냅숏 장부.
  - Risk: 위험 (사이트 실표면 변경은 브라우저 재검증·lint 게이트로 차단, human gate=디테일링 대기 — 사용자 부재 시 승격+보드까지 마치고 blocked 정지)
  - Dependencies: step-2, step-3
  - Verify: 회수 diff 가 사용자 변경만 정확히 검출(장부 대조 표) + 반영 후 dev 서버 실브라우저 스모크·콘솔 에러 0·lint PASS. **체크포인트**: 승격+장부+보드 완료 시점에 중간 커밋(README 절: step-4a) — human gate 이후 회수 실패 시 되돌아갈 경계.
  - Failure probe: 사용자 변경 0건(디테일링 없음)이어도 왕복 배관 검증은 성립 — "무변경 왕복 PASS"로 기록하되 디테일링 실증은 partial 명시.
  - Commit: changeset `m14-figma-return-path-relaunch` (README 절: step-4).

## 검증/DoD
- **DoD**: 왕복 2회차가 기계화된 회수로 닫힘 — 채널 현행 research doc + 재동기화 idempotency 표 + 스냅숏 장부·diff 스크립트 + 왕복 evidence(사용자 변경 검출→코드 반영→재검증). 실패 모드 확인: 채널 차단(step-1 probe)·스키마 확장 미지원(step-2 probe)·U+2028 은닉(step-3 픽스처) 중 최소 1건을 실제로 부딪혀 기록.
- **Evidence**: `evidence/figma-return-path/m14-roundtrip-2.md`
- **회귀 게이트**: 사이트 build·lint + 기존 Figma 파일 `askewly/*` 밖 무손실.

## 수치 출처
- charCode 스캔 대상 값 10/13/8232/8233(U+2028·U+2029 포함): `research/figma-roundtrip-pilot-2026-07.md` 실측 함정 목록(Figma Shift+Enter=U+2028 저장, JSON 출력에서 은닉) — 검증 커맨드는 step-3 self-test 픽스처.
- SSOT 드리프트 근거(emphasis·status 16변수 — emphasis 6+status 10 실계수, 타이포 9단계): `git log --oneline -- tokens/askewly.tokens.json` (커밋 e9e4a30·18392ee, 2026-08-01 실행).

## finding 큐
- use_figma 대형 반환은 20kb에서 절단 — 서브트리 스냅숏은 청크 분할 회수 필요. `figma-push-snapshot.mjs`에 청크 옵션 추가 후보 (M15 방법론 반영 대상).
- 브리지 계약 §2.2 "변수 description에 SSOT $description 복사" 규약이 생성기에 미구현 — 7월부터 잔존. 후속 후보.

## 진행 로그
- 2026-08-01 작성.
- 2026-08-01 fresh 검증자(sonnet) 반영 — step-2 rem/px 미구분 결함(확인됨) probe 승격·Verify 에 rem 표본 필수화, step-4 중간 커밋 체크포인트, 변수 수치 17→16 정정.
- 2026-08-01 step-1 완료 — MCP 재등록+OAuth(SKKU)+실측 3항 verify 전부 PASS. 산출물 `research/2026-08-01-m14-figma-channel-recheck.md`. 발견: 도구 노출에 세션 재시작 불필요(FB1 대비), get_metadata 페이지 목록 불완전 함정.
- 2026-08-01 step-2 완료 — 생성기 보수(rem×16 + scope 3경로) 후 재동기화: 1차 35/18 created → 2차 idempotent 0/0 PASS, rem 표본 8종 대조 PASS(2xs=10…7xl=72). 예고된 failure probe(스키마 확장 미지원)를 실제로 부딪혀 해소 — DoD 실패 모드 요건 충족.
- 2026-08-01 step-3 완료 — `figma-push-snapshot.mjs`(페이로드 생성기, U+2028 리터럴 자기검사) + `figma-return-diff.mjs`(charCode 대조 diff, --self-test 4항 PASS) + 파일럿 프레임 6:3 라이브 E2E(26노드, boundVar·breakCodes 캡처 확인).
- 2026-08-01 step-4a 체크포인트 — ShowcaseAtlas 승격(35:3, 12카드 variables 바인딩) + push 장부 102노드 + 배리에이션 보드(40:2, radius·데모배경 각 3안). human gate 진입: 사용자 디테일링 대기.
- 2026-08-02 step-4 완료 — 사용자 "손댈 부분 없음" → 무변경 왕복: 회수 지문 전수 대조 0/0/0 (102 unchanged), 코드 무변경·재검증 생략(사유 기록). partial 명시(변경 반영 구간은 FW2-1 선례가 실증). 함정 2건 추가 발견(20kb 절단·JS FNV Math.imul). Evidence: `evidence/figma-return-path/m14-roundtrip-2.md`.
