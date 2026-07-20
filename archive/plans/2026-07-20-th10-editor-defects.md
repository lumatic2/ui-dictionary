# PLAN — TH10 편집기 결함 마감

> 생성: 2026-07-20 · 갈래: product · scope 결정: "작업하다 잃는" 결함만 닫는다. 기능 추가는 하지 않는다
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH10 — TH3에서 AskewlyDesign이 유일 편집 표면이 됐는데, 템플릿을 열어 작업한 상태가 여러 경로로 사라진다. 그 경로들을 막는다.

## 왜 TH6 앞인가
- TH6은 실사용 실연이다. 이 결함들이 남아 있으면 실연이 "경화된 루프가 도는가"를 보는 대신 결함 재발견에 소모된다. (사용자 확정 2026-07-20)

## 장부 정정 — 착수 전 실측으로 확인한 것
`docs/findings.md` B군은 "`validateTokenMode`가 편집기 세트 2개만 허용해 템플릿 세트로 전환 불가"라고 적었다. **틀렸다.** 실제로 돌려보니 `validateTokenMode`는 `/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/` 모양만 본다 — `askewly.warm`도 `foo.bar`도 통과한다.

그래서 진짜 결함은 둘로 갈린다:
- **표시**: 드롭다운이 `askewly.default`/`askewly.dark` 두 옵션을 하드코딩한다. 문서가 `askewly.warm`이면 값이 옵션에 없어 첫 항목이 선택돼 보인다 — **문서 상태를 잘못 보고한다.**
- **검증**: 모양만 보므로 **존재하지 않는 세트를 받아들인다**. 조용히 미해석 상태로 들어간다.

장부의 오류도 이번에 정정한다. 기록을 믿고 계획을 세우면 틀린 문제를 푼다.

## Scope Boundary
- **포함**: 편집 상태 지속성(저장 키·fixture 크기 토글), 토큰 세트 표시·검증 정합, 형태 깨진 입력의 구조화된 거부, 갤러리 카드의 조용한 폴백 제거.
- **제외**:
  - **편집기 chrome 다크모드** — 결함이 아니라 기능이다. DoD에 없다.
  - **토큰 값 개별 편집 UI** — 기능 추가다. `resolveProjectTokens` override 경로가 계약·테스트만 있고 UI가 없는 건 사실이나, 그건 "잃는" 결함이 아니다. finding으로 남긴다.
  - dev fixture·계기판 제거(별도 유지보수 후보), 캔버스 렌더 성능.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: step별 독립 revert. dev 서버는 각 실행 후 정리한다.

## 스캐폴딩 결정
- source-of-truth: 화면에 열려 있는 **현재 문서**(`history.present`)가 정본이다. `baseDocument`는 fixture 시작점일 뿐인데 지금 저장 키·리셋이 그걸 정본으로 취급한다.
- 토큰 세트 목록의 정본은 **실재하는 세트 레지스트리**다 — UI가 목록을 손으로 적지 않는다.
- 검증: Vitest(상태 전이·거부 경로) + **실제 브라우저 조작**(템플릿 열기 → 편집 → 저장 → 재적재 → 크기 토글).
- 배포/운영: 해당 없음 — 로컬 편집기.
- 디자인: 편집기는 **사람이 조작하는 화면 UI**다. 표시가 바뀌는 변경(드롭다운 옵션·오류 표면)이 있으므로 `askewly-design` 스킬 대상이다 — step-2·3 착수 전 호출한다.
- 검토 후 제외: 인증·결제·시크릿·배포 — 걸리지 않음.

## 결정 로그
- status: resolved
- **fixture 크기 토글과 템플릿이 충돌할 때**: 템플릿이 이긴다. 템플릿이 열려 있으면 크기 토글이 문서를 갈아치우지 않고, 토글 자체를 비활성화해 UI가 거짓말하지 않게 한다.
- **저장 키**: 현재 문서 id를 따라간다. 템플릿마다 독립 슬롯을 갖는다.
- **토큰 세트 검증**: 모양 검사(`validateTokenMode`)를 **membership 검사**로 바꾼다. 없는 세트는 거부한다.
- **드롭다운 옵션**: 실재하는 세트에서 생성한다. 편집기 세트와 템플릿 세트를 함께 노출한다.
- 사용자 결정 필요 항목: 없음(범위·순서는 2026-07-20 사용자 승인).

## Step 트리

- [ ] **step-1 — 편집 상태가 살아남는다**
  - Artifact: 저장 키가 현재 문서를 따라가고, fixture 크기 토글이 열린 템플릿을 파괴하지 않는다.
  - Files: write `apps/agent-design/src/App.tsx`, 관련 테스트.
  - Dependencies: TH5 complete
  - Verify: 템플릿을 열어 편집 → 저장 → 재적재하면 **편집이 살아 있다**. 템플릿이 열린 상태에서 크기 토글을 눌러도 문서가 fixture로 돌아가지 않는다.
  - Failure probe: 저장 키를 `baseDocument.id`로 되돌리면 재적재가 fixture를 복원해 테스트가 실패한다 — 확인 후 되돌린다.
  - Commit: changeset `editor-state-persistence`.

- [ ] **step-2 — 토큰 세트 표시·검증 정합**
  - Artifact: 드롭다운이 실재하는 세트 목록에서 생성되고 문서 값을 그대로 보여준다. 존재하지 않는 세트는 거부된다.
  - Files: write `packages/canvas-core/src/properties.ts`, `apps/agent-design/src/PropertyInspector.tsx`, 관련 테스트.
  - Dependencies: step-1
  - Verify: `askewly.warm` 템플릿을 열면 드롭다운이 **`askewly.warm`을 표시**한다. 세트를 바꾸면 캔버스 computed style이 실제로 바뀐다.
  - Failure probe: 존재하지 않는 세트 id(`foo.bar`)를 넣으면 조용히 통과하지 않고 거부된다 — 현재는 통과한다.
  - Commit: changeset `token-set-parity`.

- [ ] **step-3 — 깨진 입력을 코드로 거부한다**
  - Artifact: `validateTemplateProject`가 형태 깨진 입력에 `TypeError` 대신 구조화된 오류 코드를 낸다. 갤러리 카드가 미지의 청사진을 조용히 표시하지 않는다.
  - Files: write `packages/template-core/src/validation.ts`, `apps/agent-design/src/TemplateGallery.tsx`, 관련 테스트.
  - Dependencies: step-2
  - Verify: `{}`·`null`·필드가 빠진 객체를 넣으면 각각 오류 **코드**로 거부되고 화면에 진단이 뜬다.
  - Failure probe: 방어 코드를 제거하면 `TypeError`가 되살아나 테스트가 실패한다.
  - Commit: changeset `structured-input-rejection`.

## 검증/DoD
- **DoD**: 템플릿을 열어 편집한 상태가 저장·재적재·뷰포트 변경을 건너 살아남고, 토큰 세트 표시가 문서 상태와 일치하며, 형태 깨진 입력이 구조화된 오류 코드로 거부된다. 전부 **실제 브라우저 조작**으로 관측한다.
- **Evidence**: `evidence/template-production-hardening/th10-editor-defects.md` + 브라우저 조작 스크린샷

## finding 큐
- 토큰 값 개별 편집 UI 부재는 여기서 닫지 않는다 — 다음 후보.
- 편집기 chrome 다크모드도 여기서 닫지 않는다.

## 진행 로그
- 2026-07-20 계획 작성. 착수 전 `validateTokenMode` 실측으로 장부 오류를 발견해 반영.
