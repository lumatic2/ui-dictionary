# PLAN — TH9 텍스트 맞춤

> 생성: 2026-07-20 · 갈래: product · scope 결정: 글자가 캔버스를 넘치지 않게 하고, 넘침을 기계로 잡는다
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH9 — TH7이 산출물 실물에서 적발한 텍스트 넘침을 닫는다. 글자 크기가 슬롯 **높이만**이 아니라 글자 수·폭·줄 수를 보고 정해진다.

## 왜 TH4보다 먼저인가
- TH4는 산출물을 실제로 검사하는 게이트를 세운다. 지금 12장 중 4장이 잘려 있다 — 깨진 상태를 기준선으로 굳히면 되돌리기 비싸다. TH7을 TH4보다 먼저 둔 것과 같은 논리다.
- 반대 논리(게이트가 있어야 수정 효과를 기계로 확인)는 이 milestone이 자체 넘침 게이트를 포함하므로 해소된다.

## Scope Boundary
- **포함**: 문자폭 근사 모델, 폭·줄 수를 보는 글자 크기 결정, 줄바꿈 표현, SVG 여러 줄 출력, 넘침 검출 게이트.
- **제외**: 실제 폰트 메트릭 로딩(웹폰트 파일 파싱), 자간·커닝 미세 조정, 자동 줄바꿈 금칙어 처리(한글 어절 단위까지만), 슬롯 좌표 재설계.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: step별 독립 revert. dev·정적 서버는 각 실행 후 정리한다.

## 스캐폴딩 결정
- source-of-truth: 글자 크기는 컴파일러가 정한다. 청사진은 슬롯 경계와 **의도(역할·최대 줄 수)** 만 선언하고 크기를 직접 지정하지 않는다.
- **모델은 근사임을 인정하고 오차를 측정한다.** 실제 폰트 메트릭 없이 문자 종류별 평균 전진폭으로 근사하되, 브라우저 실측과 대조해 오차 범위를 기록한다. 근사를 정확한 척하지 않는다.
- 검증: Vitest(순수 함수) + Playwright `canvas.measureText` 실측 대조 + 산출물 12장 육안 확인.
- 배포/운영: 해당 없음 — 라이브러리와 로컬 편집기만 바뀐다.
- 디자인: 산출물은 읽기용(인쇄·소셜)이다. **화면 UI가 아니므로 `askewly-design` 스킬 대상이 아니다**(전역 규약 — 읽기용 산출물의 게이트는 최종 형식 그대로 렌더해 눈으로 확인). 편집기 캔버스 표시가 바뀌면 그때만 호출한다.
- 검토 후 제외: 인증·저장 서버·결제·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- **넘칠 때 무엇을 하는가**: 글자를 **줄인다**(최소 크기까지). 최소 크기에서도 안 들어가면 **거부한다**(`TEXT_DOES_NOT_FIT`). 잘린 채 내보내지 않는다 — 잘린 산출물이 조용히 나가는 게 지금 결함이다.
- **줄바꿈 표현**: 텍스트 노드가 `lines: string[]`를 갖지 않고 `text`를 유지한다. 줄 나눔은 렌더·내보내기 시점에 같은 함수로 계산한다 — 문서에 두면 편집 후 재계산과 어긋난다.
- **최대 줄 수**: 청사진 슬롯이 `maxLines`를 선언한다. 미선언이면 슬롯 높이 ÷ 행간으로 유도한다.
- 서명 기준선은 다시 바뀐다(글자 크기 변경). `rebaselines`에 근거를 남긴다.
- 사용자 결정 필요 항목: 없음(순서·범위는 2026-07-20 사용자 승인).

## Step 트리

- [ ] **step-1 — 문자폭 모델 + 맞춤 함수**
  - Artifact: 문자 종류별 전진폭 근사로 문자열 폭을 추정하고, 주어진 상자에 들어가는 최대 글자 크기와 줄 나눔을 돌려주는 순수 함수. 브라우저 실측 대비 오차가 기록된다.
  - Files: write `packages/template-core/src/text-fitting.ts`, `text-fitting.test.ts`, `index.ts`.
  - Dependencies: TH7 complete
  - Verify: Playwright에서 `canvas.measureText`로 한글·라틴·숫자·혼용 문자열 폭을 실측해 모델과 대조하고, **오차율을 evidence에 수치로 남긴다**. 단위 테스트로 줄 나눔·최소/최대 경계 확인.
  - Failure probe: 모델 오차가 선언한 허용치를 넘으면 테스트가 실패한다(허용치를 사후에 늘려 맞추지 않는다 — 늘리면 근거를 남긴다).
  - Commit: changeset `text-fitting-model`.

- [ ] **step-2 — 컴파일러가 맞춤을 쓴다**
  - Artifact: `fontSize = height * 0.45`가 사라지고 폭·줄 수를 보는 결정으로 바뀐다. 최소 크기에서도 안 들어가면 `TEXT_DOES_NOT_FIT`으로 거부한다.
  - Files: write `packages/template-core/src/compiler.ts`, `types.ts`(슬롯 `maxLines`), `blueprints/registry.ts`, 관련 테스트, `__fixtures__/signatures.json`.
  - Dependencies: step-1
  - Verify: 6청사진 × 2세트에서 모든 텍스트 노드의 추정 폭이 슬롯 폭 이내. 기존 청사진의 넘침 2건이 해소됨을 수치로 대조.
  - Failure probe: 슬롯에 비해 터무니없이 긴 문자열을 주면 잘린 채 통과하지 않고 `TEXT_DOES_NOT_FIT`을 던진다.
  - Commit: changeset `compiler-text-fitting`.

- [ ] **step-3 — 여러 줄 출력 + 넘침 게이트**
  - Artifact: SVG가 `<tspan>`으로 여러 줄을 낸다. 넘침을 검출하는 게이트가 단일 커맨드로 돌고 위반 시 exit≠0. 산출물 12장을 다시 띄워 잘림 0을 확인한다.
  - Files: write `packages/template-core/src/exporters.ts`, `scripts/check-text-overflow.mjs`, 테스트.
  - Dependencies: step-2
  - Verify: 12장 재생성 후 브라우저 육안 확인 + 게이트 exit 0. HTML과 SVG의 줄 수가 일치.
  - Failure probe: 청사진 하나의 슬롯 폭을 좁혀 게이트가 exit≠0을 내는지 확인하고 되돌린다.
  - Commit: changeset `svg-multiline-and-overflow-gate`.

## 검증/DoD
- **DoD**: 6청사진 × 2세트 산출물 12장에 캔버스를 넘치는 텍스트가 0이고, 넘침을 기계로 검출하는 게이트가 단일 커맨드로 돌며, 문자폭 모델의 브라우저 실측 대비 오차가 수치로 기록된다. 안 들어가는 텍스트는 잘리지 않고 거부된다.
- **Evidence**: `evidence/template-production-hardening/th9-text-fitting.md` + 산출물 12장 재확인 스크린샷 + 모델 오차 표

## finding 큐
- 실제 폰트 메트릭 로딩은 범위 밖 — 모델 오차가 실사용에서 문제가 되면 그때 승격한다.
- SVG 텍스트 정렬(가운데·오른쪽)은 현재 왼쪽 고정이다.

## 진행 로그
- 2026-07-20 계획 작성. TH4보다 먼저 두는 근거 기록.
