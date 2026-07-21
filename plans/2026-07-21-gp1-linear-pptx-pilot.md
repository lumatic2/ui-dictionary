# PLAN — GP1 Linear 기반 편집 가능한 PPTX 파일럿

> 생성: 2026-07-21 · 갈래: product · scope: Linear intake → 웹 미니 페이지 → native PPTX → 실물 검증
> 사용자 확정: `linear.app` 레퍼런스, Askewly Design 소개 6장, 최종 산출물은 수정 가능한 `.pptx`.

Status: approved 2026-07-21 (사용자: "파일럿 ㄱㄱ")

## 북극성 → horizon → milestone → step

- **북극성**: 에이전트가 의도적으로 디자인된 UI를 만들게 한다 (`OBJECTIVE.md`).
- **horizon**: getdesign 기반 편집 가능한 PPTX 파일럿 (`plans/horizons/2026-07-getdesign-pptx-pilot.md`).
- **milestone**: GP1 — 같은 프로젝트 `DESIGN.md`가 웹과 PowerPoint의 룩 소유권이 되는지 증명한다.

## 범위 · 중단점 · run 전 scope 결정

- Execution mode: continuous
- 중단점: blocked, decision_required, risk_gate, 사용자 중단, 또는 native PPTX가 열리지 않음. 모든 검증 PASS가 아니면 완료 선언하지 않는다.
- Rollback/cleanup: `examples/getdesign-pptx-pilot/`만 changeset 단위 revert. 전역 `getdesign` 설치와 기존 horizon 파일은 되돌리지 않는다.
- non-goals: 전역 명령·Askewly skill 배포·pptx 템플릿 카탈로그·PPTX 외부 앱 자동화.

## 스캐폴딩 결정

- source-of-truth: 프로젝트 룩은 `examples/getdesign-pptx-pilot/DESIGN.md`; 슬라이드 콘텐츠는 `src/deck-content.ts`; PPTX 레이아웃은 `src/generate-pptx.ts`; 웹은 `src/App.tsx`.
- 검증: `getdesign` 재수집, TypeScript/build, 생성된 `.pptx` OOXML 텍스트·도형 검사, 웹 브라우저 스모크, PPTX 렌더 또는 PowerPoint 열기 확인.
- 배포/운영: 해당 없음 — 로컬 산출물과 사람 확인이 파일럿의 종료점.
- 디자인: Linear의 어두운 표면 사다리·하나의 라벤더 액센트·컴팩트한 제품 타이포만 참고한다. Linear 로고·상표 카피·독점 서체는 사용하지 않는다.
- 프레젠테이션: PptxGenJS로 텍스트와 도형을 각각 작성한다. HTML을 스크린샷으로 평탄화해 넣지 않는다.
- 웹: Vite + React + TypeScript로 1페이지 미니 소개를 만든다. 웹과 PPTX는 같은 semantic token map을 사용한다.
- 검토 후 제외: 서버·DB·인증·배포·외부 PowerPoint 자동화 — 파일럿에 필요하지 않다.

## 결정 로그

- Linear 선택: 사용자 승인 2026-07-21.
- 산출물: 수정 가능한 `.pptx`, 16:9, 6장: 사용자 승인 2026-07-21.
- 내용: Askewly Design 소개: 이전 대화에서 확정.
- 남은 사용자 소유 결정: 없음. 내보내기 품질이 네이티브 PPTX 요구를 못 만족할 때만 중단하고 대안을 제시한다.
- status: resolved

## Step 트리

- [ ] **step-1 — Linear intake와 프로젝트 DESIGN.md**
  - Artifact: `examples/getdesign-pptx-pilot/DESIGN.md`, `source-intake.md`, semantic token map.
  - Files: 읽기 `tmp/getdesign-intake/linear.DESIGN.md`, `templates/DESIGN.md.tmpl`; 쓰기 `examples/getdesign-pptx-pilot/`.
  - Dependencies: none
  - Verify: `getdesign add linear.app --out` 재실행 결과와 출처를 기록하고, 브랜드 자산 제외 항목·웹/PPTX 공통 토큰이 명시된다.
  - Failure probe: Linear 이름·로고·고유 카피·서체가 최종 DESIGN.md/산출물에 들어가면 실패.
  - Commit: changeset `getdesign-linear-intake`.

- [ ] **step-2 — 동일 토큰의 웹 미니 페이지**
  - Artifact: `examples/getdesign-pptx-pilot/` Vite 페이지와 스크린샷.
  - Files: 쓰기 `package.json`, `src/App.tsx`, `src/theme.ts`, `src/styles.css`.
  - Dependencies: step-1
  - Verify: build PASS + Chrome에서 첫 화면·모바일 폭을 실제 확인.
  - Failure probe: raw 색/spacing literal가 컴포넌트에 직접 남거나, DESIGN.md와 다른 액센트가 나오면 실패.
  - Commit: changeset `getdesign-linear-web-pilot`.

- [ ] **step-3 — 네이티브 PPTX 생성과 교차 검증**
  - Artifact: `output/askewly-design-intro.pptx`, 재생성 명령, 검증 기록.
  - Files: 쓰기 `src/deck-content.ts`, `src/generate-pptx.ts`, `scripts/verify-pptx.mjs`, `README.md`, `output/` 제외 규칙.
  - Dependencies: step-1, step-2
  - Verify: 6장 생성 + OOXML에 여섯 slide와 네이티브 텍스트/도형이 존재 + 웹/PPTX 비교 스크린샷.
  - Failure probe: PPTX가 이미지 하나만 포함하거나 PowerPoint/LibreOffice에서 열리지 않으면 실패하고 완료 처리하지 않는다.
  - Commit: changeset `getdesign-linear-editable-pptx`.

## 검증/DoD

- `npm run build`와 PPTX 검증 명령이 통과한다.
- 웹과 PPTX의 대표 슬라이드를 실물로 비교한 스크린샷이 남는다.
- 사용자가 로컬 `.pptx`를 열어 편집 가능 여부를 확인하기 전에는 완료 선언하지 않는다.

## planning_gate

```yaml
planning_gate:
  team_validation_mode: manual-pass
  scope_posture: selective
  delegation_decision:
    remote_background_agents: skip
    reason: "파일럿은 단일 레포의 세 산출물이며, 외부 실행·비용 없이 로컬 생성과 실물 검증으로 충분하다."
    target_roles: []
    execution_path: local_manual
  spec_delta: "getdesign external intake와 editable PPTX라는 새 산출물 경로를 파일럿 범위로 명문화한다."
  perspectives:
    product: "디자인 요청이 실제 수정 가능한 슬라이드로 닫히는지 검증한다."
    architecture: "DESIGN.md와 token map을 웹/PPTX가 함께 소비한다."
    security: "외부 비밀값·업로드·배포 없음."
    qa: "build, OOXML 구조 검사, 웹 브라우저 스모크, 사람이 PPTX를 직접 연다."
    skeptic: "웹의 CSS 룩을 PPTX가 흉내만 내거나 이미지로 평탄화할 수 있다."
  role_lanes:
    reviewer:
      owns: "브랜드 복제와 scope drift 반박"
      must_ask: "PPTX가 수정 불가능하거나 사용자 확인 전 완료할 때 사용자"
      must_not_do: "기존 Askewly 토큰을 파일럿 룩으로 강제"
      handoff_artifact: "examples/getdesign-pptx-pilot/source-intake.md"
  dod:
    - "동일 DESIGN.md에서 웹과 편집 가능한 6장 PPTX를 생성하고 실제 표면에서 확인한다."
```
