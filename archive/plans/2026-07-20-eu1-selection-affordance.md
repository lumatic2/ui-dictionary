# PLAN — EU1 조작 종류가 구분되는 선택

> 생성: 2026-07-20 · 갈래: product · scope 결정: 조작 종류가 화면에서 갈리고, 회전이 실제로 되는 데까지
Status: approved (2026-07-20 — 사용자가 horizon 5 milestone을 그대로 승인)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기 판독성과 조작감 (← `plans/horizons/2026-07-editor-legibility.md`)
- **milestone**: EU1 — "지금 뭘 조작하는지"가 커서가 닿기 전에 구분돼야 한다.
- **리서치 입력**: `research/2026-07-20-editor-ui-horizon-canvas-interaction.md` §1.1, 함의 1

## 현 상태 실사 (계획 전 확인)

- `apps/agent-design/src/styles.css:139-147` — 핸들 8개가 **전부 같은 9×9 흰 사각형**이다. 변과 모서리가 커서(`ns-resize`/`nwse-resize`)로만 갈리고 **보이는 모양은 같다**. 리서치가 말한 "역할 분리"가 시각적으로 없다.
- **회전이 없다.** `packages/canvas-core/src/manipulation.ts:4`의 `ResizeHandle`은 8방향뿐이고, `grep rotation packages/canvas-core/src/types.ts` 결과가 **0건**이다. 노드에 회전 각도를 담을 자리 자체가 없다.
- `styles.css:125` — 선택 표시는 `outline 1px`. 호버 상태 표현이 없고, 다중선택과 단일선택이 같아 보인다.

**회전 핫존만 그리는 것은 가짜다.** 문서 모델에 각도가 없으면 핫존을 드래그해도 아무 일도 일어나지 않는다.
그래서 이 milestone은 회전을 **장면 모델부터** 넣는다.

## Scope Boundary
- **포함**: 핸들 역할 시각 분리, 호버/선택/다중선택 상태 구분, 회전(모델·조작·렌더·내보내기), 입력→결과 테스트.
- **제외**:
  - 스냅·거리 측정 — EU2.
  - 레이어 패널·인스펙터 — EU3·EU4.
  - 회전 스냅(15° 단위 등) — 스냅은 EU2 소관. 여기선 자유 회전만.
  - 다중선택 묶음 회전 — 단일 노드 회전까지. 묶음은 finding 큐.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 서명 재기준선은 근거와 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: **문서 모델이 회전을 소유한다.** 렌더 층에서 CSS transform만 얹으면 내보내기·좌표 계산이 각도를 모른다.
- 리서치의 수치 확인 실패(회전 핫존 반경 px, 핸들 시각 규격)를 **지어내지 않는다.** 우리가 정한 값임을 코드에 명시하고, 근거는 "역할이 구분돼야 한다"는 구조 규칙에서만 가져온다.
- 검증: 입력(포인터 이벤트)에서 기대값을 유도한다 — 렌더 결과를 렌더 코드로 검사하지 않는다(직전 horizon에서 3번 나온 동어반복).
- 디자인: **화면 UI다 — `askewly-design` 스킬을 호출한다**(전역 규약). 사람 확인은 EU5 과업 관측이 정본이며, 여기선 스크린샷까지.
- 배포/운영: 해당 없음 — 로컬 편집기와 라이브러리만 바뀐다. 서버·배포면·시크릿 무관.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션 — 걸리지 않음.

## 결정 로그
- status: resolved
- **회전을 모델에 넣는다** — 핫존만 그리는 대안은 가짜 UI라 채택하지 않는다.
- **각도 단위는 도(degree), 회전 중심은 바운딩 박스 중심** — SVG `rotate(a cx cy)`·CSS `rotate()`와 직결돼 변환 손실이 없다.
- 서명 재기준선이 발생한다(노드에 각도 필드 추가). 근거를 `rebaselines`에 남긴다.
- 사용자 결정 필요 항목: 없음(범위는 horizon 승인에 포함).

## Step 트리

- [ ] **step-1 — 핸들 역할이 보인다**
  - Artifact: 변 핸들과 모서리 핸들이 **다른 모양**이고, 호버·선택·다중선택이 각각 다르게 표현된다.
  - Files: write `apps/agent-design/src/styles.css`, `CanvasSurface.tsx`, `CanvasSurface.test.tsx`.
  - Dependencies: 없음
  - Verify: 변/모서리 핸들의 계산된 스타일이 서로 다르다(폭·높이 또는 형태). 호버 시 상태 속성이 바뀐다. 브라우저 스크린샷 3종(idle·hover·multi).
  - Failure probe: 두 핸들 스타일을 같게 되돌리면 테스트가 실패한다.
  - Commit: changeset `handle-role-affordance`.

- [ ] **step-2 — 회전이 실제로 된다**
  - Artifact: 노드가 각도를 갖고, 모서리 바깥 핫존 드래그로 회전하며, 캔버스·HTML·SVG 내보내기가 각도를 반영한다.
  - Files: write `packages/canvas-core/src/types.ts`, `manipulation.ts`, `apps/agent-design/src/CanvasSurface.tsx`, `packages/template-core/src/exporters.ts`, `__fixtures__/signatures.json`, 관련 테스트.
  - Dependencies: step-1
  - Verify: 회전 조작 → 문서 각도 변화 → 내보낸 SVG의 `transform`에 같은 각도. 세 층이 같은 값을 말한다.
  - Failure probe: 렌더에서만 회전하고 모델을 안 바꾸면 내보내기 검사가 실패한다. 각도 필드를 지우면 컴파일이 거부한다.
  - Commit: changeset `node-rotation`.

- [ ] **step-3 — 조작 결과 게이트**
  - Artifact: 각 조작(변 리사이즈·모서리 리사이즈·회전·이동)의 **입력→결과**가 테스트로 고정되고, 브라우저 실조작으로 관측된다.
  - Files: write `apps/agent-design/src/CanvasSurface.test.tsx`, `evidence/editor-legibility/eu1-selection.md`.
  - Dependencies: step-2
  - Verify: 조작 4종 각각에 대해 포인터 입력 시퀀스 → 기대 bounds/각도. 기대값은 입력에서 계산하고 렌더 출력에서 읽지 않는다.
  - Failure probe: 변 핸들을 양축 리사이즈로 되돌리면 테스트가 실패한다(역할 분리가 실재함을 증명).
  - Commit: changeset `manipulation-result-gate`.

## 검증/DoD
- **DoD**: 변·모서리·회전이 서로 다른 조작이고 시각적으로 구분되며, 호버/선택/다중선택이 각각 다르게 표현되고, 각 조작의 입력→결과가 테스트로 고정된다.
- **Evidence**: `evidence/editor-legibility/eu1-selection.md` + 상태별 스크린샷

## finding 큐
- 다중선택 묶음 회전은 범위 밖.
- 회전 스냅(15° 등)은 EU2.

## 진행 로그
- 2026-07-20 horizon 승인 직후 작성. 현 상태 실사에서 회전이 모델에 아예 없음을 확인해 step-2를 모델 변경으로 잡았다.
