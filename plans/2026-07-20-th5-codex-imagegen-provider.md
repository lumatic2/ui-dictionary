# PLAN — TH5 Codex imagegen 소재 공급자

> 생성: 2026-07-20 · 갈래: tooling · scope 결정: OpenAI HTTP 어댑터 은퇴·codex exec 경유 공급자 재작성·실호출 실증까지
Status: approved (2026-07-20)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 템플릿 제작 시스템 경화 (← `plans/horizons/2026-07-template-production-hardening.md`)
- **milestone**: TH5 — 소재 생성 경로를 실제로 동작하는 것으로 교체하고, 그 계약을 실호출로 증명한다.

## Scope Boundary
- **결정**: OpenAI HTTP 직결을 버리고 Codex 내장 `image_gen`(via `codex exec`)을 유일한 생성 경로로 삼는다. API 키를 요구하는 CLI 폴백(`scripts/image_gen.py`)은 쓰지 않는다.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- **진행 보고**: commentary only. 미완 leaf는 턴 종료점이 아니다.
- rollback/cleanup: 구 어댑터는 삭제하지 않고 은퇴 표기 후 별도 커밋으로 제거해 revert 가능하게 둔다. 생성 이미지는 지정 fixture 경로 외에 남기지 않는다.

## 스캐폴딩 결정
- source-of-truth: 소재의 정본은 **커밋된 고정 이미지 fixture**다. 라이브 생성은 fixture를 만드는 수단이지 파이프라인 검증의 입력이 아니다.
- 검증: 오프라인 계약 테스트(고정 응답) + 라이브 실호출 1회 실증(별도, E2E 경로에서 분리).
- 배포/운영: 해당 없음 — 로컬 개발 도구. 서버·키·과금 설정 없음.
- 외부 연동: `codex exec --skip-git-repo-check --sandbox workspace-write` 서브프로세스. 키 불필요(2026-07-20 실측 확인).
- 치수 계약: **종횡비 검사 + cover 크롭**(사용자 확정 2026-07-20). 생성 실제 치수를 그대로 기록하고, 슬롯 종횡비와의 오차가 허용 범위를 넘을 때만 거부한다. 렌더는 기존 `node.fit`(objectFit cover)로 처리하며 이미지 리사이즈 라이브러리를 도입하지 않는다.
- 크레덴셜: 없음. Codex 자체 인증을 사용하므로 `.env`·시크릿 항목이 발생하지 않는다.
- 검토 후 제외: 배치 생성·이미지 편집(edit)·투명 배경 — 이번 범위 밖. 인증·DB·관측 — 걸리지 않음.

## 결정 로그
- status: resolved
- 사용자 확정(2026-07-20): OpenAI 키를 쓰지 않고 **Codex imagegen**을 쓴다. Claude는 `codex exec`으로 호출한다.
- 사용자 확정(2026-07-20): 치수 불일치는 **종횡비 검사 + cover 크롭**으로 처리한다. 결정론적 리사이즈 단계 추가는 기각(의존성·빌드 복잡도).
- 실측 근거(2026-07-20 probe): 키 없이 성공, 산출물은 `~/.codex/generated_images/<session>/exec-<id>.png`에 생성 후 지정 경로로 복사됨, 정사각 요청에 1254×1254 반환(16의 배수 아님 — 정확 치수 보장 없음), 이미지 1장당 약 47.6k 토큰.
- 리서치 근거: 구 어댑터의 응답 타입은 OpenAI 실제 응답(`{data:[{b64_json}]}` 배열)과 구조가 다르고, `mimeType`/`width`/`height`/`requestId` 필드는 실재하지 않는다. 이 계약은 라이브에서 100% 실패한다.
- 사용자 결정 필요 항목 없음 — 실호출은 이미 승인됨(비용은 Codex 구독 내, 별도 과금 없음).

## Step 트리

- [ ] **step-1 — codex-imagegen-provider**
  - Artifact: `codex exec` 경유 공급자가 프롬프트를 받아 이미지 파일을 얻고 `AssetManifestEntry`(provenance `generated` / `codex:image_generation`)로 변환한다. 종횡비 검사와 cover 크롭 계약이 구현된다.
  - Files: write `packages/template-image-provider-codex/**`(신규); read/write `packages/template-image-provider-openai/**`(은퇴 표기); read `packages/template-core/src/types.ts`.
  - Dependencies: TH4 complete
  - Verify: 고정 응답(커밋된 fixture 이미지)으로 공급자 계약 테스트 PASS — 종횡비 허용 범위 내 수용, 실제 치수 기록 확인.
  - Failure probe: 종횡비가 허용 오차를 넘는 이미지·존재하지 않는 파일 경로·비이미지 파일이 각각 명시 오류 코드로 거부된다.
  - Commit: changeset `codex-imagegen-provider`.

- [ ] **step-2 — live-call-proof**
  - Artifact: 라이브 `codex exec` 호출 1회로 실제 소재를 생성해 fixture로 커밋하고, 그 소재가 템플릿에 렌더된 증거를 남긴다.
  - Files: write `packages/template-core/src/__fixtures__/assets/**`(생성 이미지), `evidence/template-production-hardening/th5-imagegen.md`.
  - Dependencies: step-1
  - Verify: 실호출 로그 + 생성 이미지 파일 + 그 이미지를 쓴 포스터 청사진의 스튜디오 렌더 스크린샷.
  - Failure probe: `codex exec`이 실패하거나(비로그인·네트워크 차단) 이미지가 생성되지 않는 경우, 공급자가 조용히 빈 asset을 반환하지 않고 명시 실패한다 — 잘못된 경로로 호출해 확인한다.
  - Commit: changeset `codex-imagegen-live-proof`.

- [ ] **step-3 — retire-openai-adapter**
  - Artifact: `packages/template-image-provider-openai`가 제거되고 참조가 전부 새 공급자로 이관된다.
  - Files: delete `packages/template-image-provider-openai/**`; read/write 참조 지점(워크스페이스 설정·import).
  - Dependencies: step-2
  - Verify: 전체 빌드·테스트·TH4 검증 커맨드 PASS + `template-image-provider-openai` grep 0.
  - Failure probe: 제거 후 빌드가 깨지지 않음을 확인. 깨지면 참조 이관 누락이므로 되돌린다.
  - Commit: changeset `retire-openai-image-adapter`.

## 검증/DoD
- **DoD**: Codex imagegen 공급자가 계약 테스트를 통과하고, 라이브 실호출 1회로 생성한 소재가 템플릿에 렌더되며, 깨진 OpenAI 어댑터가 제거되고 전체 검증이 통과한다.
- **Evidence**: `evidence/template-production-hardening/th5-imagegen.md`

## finding 큐
- 정확 치수가 필요해지면 CLI 폴백(`scripts/image_gen.py`, 키 필요) 또는 리사이즈 단계가 후보 — 지금은 필요 없다.
- 이미지 편집(edit) 경로로 기존 소재를 변형하는 건 별도 후보.

## 진행 로그
- 2026-07-20 계획 작성, 승인 대기.
