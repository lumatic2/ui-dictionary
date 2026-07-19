# PLAN — TH12 자기완결 산출물

> 생성: 2026-07-20 · 갈래: product · scope 결정: 내보낸 한 파일이 그대로 발주 가능해질 때까지
Status: approved (2026-07-20 — 사용자 확정: "UI보다 먼저")

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH12 — TH6 실연이 잡은 결함 1을 닫는다. 이걸 두고 horizon을 닫으면 "발주 가능한 산출물"이 거짓 주장이 된다.

## 왜 지금인가 — TH6이 실물로 잡았다

소재 URI가 **파일 경로**(`C:/Users/.../askewly-portrait.png`)라서:

- 내보낸 SVG(1,415 bytes)와 PNG(315,785 bytes)가 **따로 다닌다**.
- SVG를 `<img>`로 끼우면 외부 참조가 차단돼 **그림 없이 조용히** 렌더된다 — 인쇄소에 그대로 넘기면 빈 카드가 나온다.
- 스튜디오에 JSON을 가져오려면 URI를 **손으로 웹 경로로 바꿔야** 했다.

TH5는 이 결함을 못 잡았다. HTML 경로로만 렌더를 확인했기 때문이다.

## Scope Boundary
- **포함**: 소재를 data URI로 싣는 계약, 용량 상한과 거부 경로, 산출물에 외부 참조가 없다는 게이트, 서명 재기준선.
- **제외**:
  - PDF 변환·300dpi 래스터화 — 여전히 범위 밖.
  - 편집기 UI 재설계 — **별도 horizon**(사용자 확정 2026-07-20).
  - 소재 생성 지연(302.9초) 개선 — finding 큐.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 서명 재기준선은 근거와 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: **매니페스트가 소재 바이트를 소유한다.** exporter를 고치는 게 아니라 공급자가 처음부터 자기완결적 URI를 낸다 — 그러면 JSON·HTML·SVG 세 경로가 자동으로 함께 고쳐진다.
- `CodexImageProvider`는 이미 PNG 헤더를 읽으려고 **바이트를 읽고 있다**. 같은 바이트로 data URI를 만든다 — 새 I/O가 생기지 않는다.
- 용량은 무한정 허용하지 않는다. 상한을 넘으면 조용히 부풀리지 말고 거부한다.
- 검증: 게이트가 **산출물에 외부 참조가 하나도 없음**을 검사한다(입력에서 유도: 매니페스트의 모든 URI가 `data:`로 시작).
- 디자인: 화면 UI 아님 — `askewly-design` 미호출.
- 배포/운영: 해당 없음 — 라이브러리와 로컬 산출물만 바뀐다. 서버·배포면·시크릿 무관.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션 — 걸리지 않음.

## 결정 로그
- status: resolved
- **인라인 위치**: exporter가 아니라 **공급자**. exporter 3개를 각각 고치면 새 exporter마다 같은 실수를 반복한다.
- **원본 파일 보존**: 디스크의 PNG는 남긴다(증적·재생성용). 매니페스트만 data URI를 가리킨다.
- 서명 재기준선이 발생한다(소재 URI가 문서에 들어간다). 근거를 `rebaselines`에 남긴다.
- 사용자 결정 필요 항목: 없음.

## Step 트리

- [ ] **step-1 — 소재가 자기완결적으로 나온다**
  - Artifact: `CodexImageProvider`가 data URI를 담은 매니페스트를 낸다. 용량 상한 초과는 거부한다.
  - Files: write `packages/template-image-provider-codex/src/index.ts`, 관련 테스트.
  - Dependencies: TH6 step-1
  - Verify: 공급자 산출 URI가 `data:image/png;base64,`로 시작하고, 원본 바이트와 base64가 왕복한다.
  - Failure probe: 파일 경로를 되돌리면 테스트가 실패한다. 상한 초과 소재는 `ASSET_TOO_LARGE`로 거부된다.
  - Commit: changeset `self-contained-assets`.

- [ ] **step-2 — 외부 참조 0 게이트 + 실물 재확인**
  - Artifact: 게이트가 모든 산출물에서 외부 참조를 찾아 실패시킨다. TH6 명함을 재생성해 **그림이 있는 채로** 렌더된다.
  - Files: write `scripts/check-export-artifacts.mjs`, `packages/template-core/src/__fixtures__/signatures.json`, `evidence/template-production-hardening/th6/`.
  - Dependencies: step-1
  - Verify: `npm run verify` exit 0 + TH6 산출물 SVG를 `<img>`로 끼워 렌더했을 때 그림이 보인다(같은 방식으로 전에는 안 보였다).
  - Failure probe: 매니페스트 URI를 파일 경로로 되돌리면 게이트가 exit≠0.
  - Commit: changeset `no-external-references`.

## 검증/DoD
- **DoD**: 내보낸 파일 하나를 옮겨도 그림이 함께 간다. 게이트가 외부 참조를 막고, TH6 명함이 그림 있는 채로 렌더된다.
- **Evidence**: `evidence/template-production-hardening/th12-self-contained.md`

## finding 큐
- 용량: 316KB PNG가 base64로 약 421KB가 된다. 소재가 여러 개인 포스터에서 문서가 커진다 — 압축·리사이즈는 별도 후보.
- 소재 생성 302.9초와 진행 표시 부재는 여전히 미해결.

## 진행 로그
- 2026-07-20 TH6 실연 결함 1을 받아 작성. 사용자가 UI 재설계보다 먼저 처리하도록 순서 확정.
