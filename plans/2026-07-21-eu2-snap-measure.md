# PLAN — EU2 스냅·정렬 가이드·거리 측정

> 생성: 2026-07-21 · 갈래: product · scope 결정: 드래그 중 스냅과 정적 거리 측정이 별개 상호작용으로 실제 동작하는 데까지
Status: approved (2026-07-20 — 사용자가 horizon 5 milestone을 그대로 승인)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 편집기 판독성과 조작감 (← `plans/horizons/2026-07-editor-legibility.md`)
- **milestone**: EU2 — 드래그 중 자동 스냅과 정적 측정을 별개 상호작용으로. 기준은 바운딩 박스로 명문화.
- **리서치 입력**: `research/2026-07-20-editor-ui-horizon-canvas-interaction.md` §1.2·§3.2, 함의 2·3

## 현 상태 실사 (계획 전 확인)

- **가이드는 그려지는데 스냅이 없다.** `packages/canvas-core/src/manipulation.ts:74` `alignmentGuides()`는
  threshold 4 안에 든 이웃의 모서리·중심을 찾아 `{axis, value}`를 돌려주지만, **아무도 그 값으로 좌표를
  보정하지 않는다.** `CanvasSurface.tsx:314`는 `setGuides(alignmentGuides(document, next))`로 선만 그리고,
  `next`(= `moveBounds` 결과)는 그대로 커밋된다. 선이 떠도 요소는 붙지 않는다.
  → **이것이 horizon 미리 쓰는 실패 회고 3번("스냅이 스냅처럼 보이기만 한다")이 이미 코드에 있는 상태다.**
- **거리 측정이 없다.** `grep -i "measure\|distance"` 결과 0건. 정적 상태에서 두 요소 간 간격을 보는 경로가 없다.
- `alignmentGuides`는 리사이즈 중에는 호출되지만(같은 gesture 경로), 모서리 값만 보고 **간격(균등 배치)은 안 본다**.
- 측정 기준(바운딩 박스)이 문서에 명문화된 곳이 없다. 회전이 EU1에서 들어왔으므로 **회전된 노드의 bounds가
  무엇을 뜻하는지**가 지금 미정의다 — 축 정렬 bounds인지 회전 후 외접 사각형인지.

## Scope Boundary
- **포함**: 드래그 중 실제 스냅(이동·리사이즈), 스냅 on/off, 정적 거리 측정(모디파이어+호버), 측정 기준
  바운딩 박스 명문화(회전 노드 포함), 두 상호작용의 분리 게이트.
- **제외**:
  - 픽셀 그리드 스냅·수동 눈금자 가이드 — 이번 범위 밖(finding 큐).
  - 3개 이상 근접 시 균등 간격 자동 감지(Penpot §3.2) — 정적 측정이 먼저다. finding 큐.
  - 회전 스냅(15° 단위) — 회전 각도 스냅은 스냅 인프라가 선 뒤. finding 큐.
  - 레이어 패널·인스펙터 — EU3·EU4.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. 서명 재기준선은 근거와 함께 기록한다.

## 스캐폴딩 결정
- source-of-truth: **문서 좌표가 정본이다.** 가이드 선은 문서 좌표의 표현일 뿐이므로, 스냅은 렌더 층이 아니라 커밋되는 bounds를 바꿔야 한다. 측정값도 같은 좌표계에서 읽는다 — 화면 픽셀에서 되읽으면 zoom·pan이 섞인다.
- **스냅은 좌표 보정이다 — 렌더가 아니다.** 가이드 계산과 스냅 적용을 한 함수로 뭉치지 않고,
  `alignmentGuides`가 찾은 값으로 preview bounds를 **실제로 이동**시키는 경로를 만든다. 그래야 커밋된
  문서 좌표가 가이드와 일치한다(지금은 불일치해도 아무도 모른다).
- **측정 기준은 바운딩 박스로 못박고 문서에 적는다.** Figma도 같은 규약이며 스트로크·텍스트 베이스라인과
  다를 수 있음을 문서가 명시한다(리서치 §1.2). 회전 노드는 **회전 전 축 정렬 bounds**를 기준으로 하고,
  그것이 화면에 보이는 외곽과 다를 수 있음을 문서와 코드 주석 양쪽에 남긴다 — 지어내지 않고 우리 선택임을 밝힌다.
- 스냅 threshold 4px는 기존 값을 승계한다. 공식 출처가 없으므로(리서치 확인 실패 항목) **우리가 정한 값**임을 코드에 명시한다.
- 검증: 입력(포인터 좌표)에서 기대값을 유도한다. 스냅 검증은 "가이드가 떴다"가 아니라 **"커밋된 좌표가 이웃의 모서리와 정확히 같다"**로 한다.
- 디자인: 화면 UI다 — `askewly-design` 스킬을 호출한다(전역 규약). 사람 확인은 EU5 과업 관측이 정본.
- 배포/운영: 해당 없음 — 로컬 편집기와 라이브러리만 바뀐다. 서버·배포면·시크릿 무관.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션 — 걸리지 않음.

## 결정 로그
- status: resolved
- **스냅을 실제 좌표 보정으로 넣는다** — 가이드만 그리는 현 상태는 가짜다. 이건 버그 수정에 가깝다.
- **정적 측정은 모디파이어(Alt)+호버로 분리한다** — 드래그 중 자동 가이드와 같은 화면 언어를 쓰되 진입 경로가 다르다(리서치 함의 2).
- **측정 기준 = 회전 전 축 정렬 바운딩 박스.** 회전 외접 사각형을 쓰면 회전 각도에 따라 측정값이 흔들려 정렬 도구로 못 쓴다. 한계는 문서에 적는다.
- 사용자 결정 필요 항목: 없음(범위는 horizon 승인에 포함).

## Step 트리

- [ ] **step-1 — 스냅이 실제로 붙는다**
  - Artifact: 드래그(이동·리사이즈) 중 가이드가 뜨면 커밋된 좌표가 그 가이드 값에 **정확히** 맞는다. 스냅 on/off 토글.
  - Files: write `packages/canvas-core/src/manipulation.ts`, `manipulation.test.ts`, `apps/agent-design/src/CanvasSurface.tsx`, `CanvasSurface.test.tsx`.
  - Dependencies: 없음
  - Verify: 이웃 모서리에서 3px 떨어진 지점으로 드래그 → 커밋 좌표가 이웃 모서리와 **동일**. 토글을 끄면 3px 차이가 그대로 남는다.
  - Failure probe: 스냅 적용을 제거하고 가이드 계산만 남기면(=현 상태) 테스트가 실패한다.
  - Commit: changeset `snap-applies-coordinates`.

- [ ] **step-2 — 정적 거리 측정**
  - Artifact: 요소 선택 후 Alt를 누른 채 다른 요소를 호버하면 두 바운딩 박스 사이 가로·세로 거리가 수치로 표시된다. 드래그 중에는 뜨지 않는다.
  - Files: write `packages/canvas-core/src/manipulation.ts`(측정 함수), `apps/agent-design/src/CanvasSurface.tsx`, `styles.css`, 관련 테스트.
  - Dependencies: step-1
  - Verify: 알려진 좌표 두 요소 → 표시된 수치가 바운딩 박스 간 간격과 일치. Alt를 떼면 사라진다.
  - Failure probe: 측정을 드래그 gesture에 묶으면 "정적 상태 측정" 테스트가 실패한다.
  - Commit: changeset `static-distance-measure`.

- [ ] **step-3 — 분리 게이트 + 측정 기준 문서**
  - Artifact: 두 상호작용이 서로를 켜지 않음을 테스트로 고정하고, 측정 기준(바운딩 박스·회전 노드 규약·한계)을 문서에 적는다.
  - Files: write `apps/agent-design/src/CanvasSurface.test.tsx`, `docs/design-system/` 또는 `docs/ARCHITECTURE.md` 측정 규약 절, `evidence/editor-legibility/eu2-snap-measure.md`.
  - Dependencies: step-2
  - Verify: 드래그 중 측정 배지 0개, 정적 Alt 호버 중 스냅 가이드 0개. 회전된 노드의 측정값이 축 정렬 bounds와 일치.
  - Failure probe: 두 상태를 하나의 플래그로 합치면 분리 테스트가 실패한다.
  - Commit: changeset `snap-measure-separation`.

## 검증/DoD
- **DoD**: 드래그 중 자동 스냅과 정적 거리 측정이 **별개 상호작용**으로 동작하고, 모든 측정이 바운딩 박스 기준이며 그 정의가 문서에 있다.
- **Evidence**: `evidence/editor-legibility/eu2-snap-measure.md` + 브라우저 실조작 스크린샷

## finding 큐
- 픽셀 그리드 스냅·수동 눈금자 가이드.
- 3개 이상 근접 시 균등 간격 감지.
- 회전 스냅(15° 등) — 스냅 인프라 위에서.
- 회전 노드의 히트 테스트가 여전히 축 정렬 bounds 기준(EU1에서 넘어온 finding).

## 진행 로그
- 2026-07-21 작성. 현 상태 실사에서 `alignmentGuides`가 좌표를 보정하지 않음을 확인해 step-1을 "가짜 스냅 수정"으로 잡았다.
