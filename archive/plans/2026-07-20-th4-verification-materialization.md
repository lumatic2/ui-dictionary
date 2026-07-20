# PLAN — TH4 검증 실체화

> 생성: 2026-07-20 · 갈래: tooling · scope 결정: 통과만 확인하는 검증을 훼손을 실제로 잡는 게이트로 바꾼다
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH4 — exporter를 실제로 실행해 산출물을 독립적으로 파싱 검사하고, 훼손 시 실제로 실패하는 게이트를 세운다.

## 지금 무엇이 가짜인가
- `scripts/verify-template-production-system.mjs`가 매니페스트에 `exports: ['json','html','svg']`를 **문자열로 적는다.** 내보내기를 한 번도 실행하지 않는다.
- `negativePaths` 6종도 문자열 목록이다. 그 경로가 실제로 exit≠0을 내는지 이 스크립트는 확인하지 않는다.
- 즉 현재 매니페스트는 **계약 선언**이지 측정 기록이 아니다. TPS5 마감 때 남긴 부채다.

## TH9의 교훈을 여기에 적용한다
TH9의 첫 넘침 게이트는 **컴파일러 출력만 봐서 동어반복**이었다 — 청사진을 좁혀도 통과했다. TH4는 같은 함정 위에 있다: exporter가 만든 문자열을 exporter의 규칙으로 검사하면 항상 통과한다.

그래서 이 milestone의 설계 원칙은 하나다 — **단언의 근거를 산출물이 아니라 입력에서 가져온다.**
- 산출물에 있어야 할 문자열 = **요청 내용**(`content`, `lists`)에서 가져온다.
- 산출물에 있어야 할 색·글꼴 = **`tokens.ts`의 값**에서 가져온다(exporter가 뭘 썼는지 보지 않는다).
- 산출물의 치수 = **청사진·인쇄 규격**에서 가져온다.
- 구조 검사는 **범용 파서**(HTML/XML)로 한다 — exporter가 만든 문자열을 exporter와 같은 정규식으로 되읽지 않는다.

## Scope Boundary
- **포함**: 18개 산출물(6청사진 × json·html·svg) 실제 생성·파싱·입력 유래 단언, 훼손 3종 negative probe, probe 무력화 감지, 매니페스트 실측화, npm script 배선.
- **제외**: 픽셀 렌더 비교(스크린샷 diff), PDF·PNG 래스터화, CI 워크플로 파일, TH5 공급자 검증, 성능 측정.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: step별 독립 revert. 산출물은 gitignored `tmp/`에 쓰고 실행 후 남기지 않는다(증거용 사본만 `evidence/`).

## 스캐폴딩 결정
- source-of-truth: 게이트는 `scripts/`에 산다. 매니페스트는 **게이트 실행 결과로만** 쓰인다 — 손으로 적는 필드를 없앤다.
- 파서: HTML은 `parse5`, SVG는 XML 파서를 쓴다. 손으로 쓴 정규식 검사는 exporter의 실수를 같이 반복하므로 피한다. **루트 `package.json`을 신설**해 devDependency와 npm script를 둔다(ROADMAP이 선언한 surface). 오프라인 등으로 설치가 불가하면 그 사실을 기록하고 엄격한 자체 파서로 대체하되, 대체했음을 evidence에 명시한다.
- 검증: 게이트 자체의 실패 능력을 probe로 증명한다. probe는 임시 수정이 아니라 **게이트 안의 자기검사**로 상주시킨다(훼손 입력을 만들어 검사기에 먹여 거부되는지 확인).
- 배포/운영: 해당 없음 — 로컬 게이트만 바뀐다. 배포면·시크릿 무관.
- 디자인: 해당 없음 — 화면 UI 변경 없음.
- 검토 후 제외: 인증·결제·배포·시크릿 — 걸리지 않음.

## 결정 로그
- status: resolved
- **probe를 어디에 두는가**: 게이트 스크립트 **안**에 상주시킨다. 별도 파일로 빼면 안 도는 채로 썩는다(`check-line-length.mjs`가 은퇴한 경로를 가리킨 채 죽어 있던 선례).
- **훼손 3종**: ① 산출물의 토큰 색값을 다른 색으로 바꾼다 ② 요청 내용 중 한 문자열을 산출물에서 지운다 ③ 이미지 자산 URI를 지운다. 각각 검사기가 잡아야 한다.
- **probe 무력화 감지**: 검사기가 훼손을 못 잡으면 게이트 전체가 exit≠0. "probe가 없어도 통과"하는 상태를 만들지 않는다.
- **산출물 보관**: `tmp/`에 쓰고 커밋하지 않는다. 증거용으로 대표 3장만 `evidence/`에 복사한다.
- 사용자 결정 필요 항목: 없음(순서·범위는 2026-07-20 사용자 승인).

## Step 트리

- [ ] **step-1 — 산출물을 실제로 만들고 파싱한다**
  - Artifact: 6청사진 × 3형식 = 18개 산출물을 실제로 생성해 디스크에 쓰고, 범용 파서로 읽어 구조를 확인하는 게이트. 형식이 깨진 산출물은 거부된다.
  - Files: write `package.json`(루트 신설), `scripts/check-export-artifacts.mjs`; read `packages/template-core/src/exporters.ts`.
  - Dependencies: TH9 complete
  - Verify: `node scripts/check-export-artifacts.mjs` — 18개 생성·파싱 성공, 개수가 18임을 단언. SVG는 XML로 well-formed, HTML은 파싱 후 요소 트리 존재, JSON은 스키마 필드 존재.
  - Failure probe: 잘린 SVG 문자열·닫히지 않은 태그를 파서에 먹여 **거부되는지** 확인한다. 파서가 관대해 통과시키면 엄격 모드로 바꾸거나 파서를 교체한다.
  - Commit: changeset `export-artifact-parsing`.

- [ ] **step-2 — 단언의 근거를 입력에서 가져온다 + 훼손 3종**
  - Artifact: 산출물 검사가 요청 내용·토큰 값·청사진 치수와 대조된다. 훼손 3종이 각각 검출되고 exit≠0.
  - Files: write `scripts/check-export-artifacts.mjs`.
  - Dependencies: step-1
  - Verify: 모든 요청 문자열이 html·svg 텍스트에 실재, 토큰 세트의 색 hex가 산출물에 실재, svg `width`/`height`가 청사진 치수와 일치, 이미지 노드의 자산 URI가 산출물에 실재.
  - Failure probe: 훼손 3종(색값 치환·문자열 삭제·자산 URI 삭제)을 게이트 안에서 만들어 먹이고 **셋 다 검출**되는지 확인. 하나라도 통과하면 게이트 실패.
  - Commit: changeset `export-input-derived-assertions`.

- [ ] **step-3 — 매니페스트 실측화 + 통합 커맨드**
  - Artifact: `verify-template-production-system.mjs`의 하드코딩 `exports`·`negativePaths`가 사라지고 실제 실행 결과로 채워진다. 단일 npm script가 세 게이트를 함께 돌린다.
  - Files: write `scripts/verify-template-production-system.mjs`, `package.json`; write `evidence/template-production-hardening/th4-verification.md`.
  - Dependencies: step-2
  - Verify: `npm run verify` — 줄 길이·넘침·산출물 게이트 + 통합 검증이 모두 돌고 exit 0. 매니페스트의 `exports`가 실제 산출물 크기·해시를 담는다.
  - Failure probe: 게이트 하나를 실패시키면 통합 커맨드 전체가 exit≠0(`&&` 연쇄가 끊기는지 실제로 확인).
  - Commit: changeset `verify-manifest-materialization`.

## 검증/DoD
- **DoD**: exporter가 실제로 실행돼 18개 산출물이 만들어지고 범용 파서로 검사되며, 단언의 근거가 입력에서 오고, 훼손 3종이 각각 exit≠0을 내며, probe를 무력화하면 게이트 전체가 실패한다. 매니페스트에 손으로 적은 선언 필드가 없다.
- **Evidence**: `evidence/template-production-hardening/th4-verification.md` + 훼손 3종 출력 + 실측 매니페스트

## finding 큐
- 픽셀 단위 렌더 비교는 범위 밖 — 파싱 검사는 "글자·색·치수가 있다"까지고 "보기 좋다"는 아니다.
- `negativePaths` 6종 중 3종만 이번에 실증한다. 나머지 3종(source-unit-integrity·provider-invalid-mime-size·invalid-token)의 실증은 TH5 이후로 남는다.

## 진행 로그
- 2026-07-20 계획 작성. TH9의 동어반복 교훈을 설계 원칙으로 승격.
