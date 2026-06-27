# Step 0: Origin UI Source Inventory

## 읽어야 할 파일

- `CLAUDE.md` — 왜: UI Vocabulary authoring workflow와 배포 승인 경계를 확인한다.
- `ROADMAP.md` — 왜: active milestone `ui-vocab-origin-ui-coverage`의 DoD/Evidence/Gap을 확인한다.
- `docs/plans/2026-06-27-external-ui-ecosystem-vocabulary.md` — 왜: 외부 UI 생태계 확장 전체 순서와 M1 step tree를 확인한다.
- `docs/ui-vocabulary/authoring-workflow.md` — 왜: 후보 수집, 중복 prefilter, 승격, 검증 절차의 정본이다.
- `docs/ui-vocabulary/terms.yml` — 왜: Origin UI/coss ui 후보와 기존 용어의 id/name/alias/source 중복을 비교한다.
- `docs/ui-vocabulary/sources.md` — 왜: 새 source id를 추가해야 하는지, 기존 source id를 재사용할 수 있는지 판단한다.

## 작업

Origin UI/coss ui의 공개 component/particle 목록을 조사하고, 기존 `terms.yml`과 중복될 후보를 먼저 제외한다.

산출물:

- Origin UI/coss ui source section 목록
- 기존 용어와 명백히 중복되는 항목 목록
- alias 또는 related로 처리할 후보 목록
- Step 1에 넘길 form/input/field composition 후보 20개 내외

## Acceptance Criteria

```bash
node scripts/audit-ui-vocabulary-candidates.mjs
```

## 검증 절차

1. Origin UI/coss ui 후보가 기존 `terms.yml`과 같은 의미인지 먼저 확인한다.
2. 신규 후보는 `docs/ui-vocabulary/inbox.yml` 또는 step note에 source-backed evidence와 함께 남긴다.
3. `phases/external-ui-ecosystem-vocabulary/index.json` step 0을 완료/blocked/error로 갱신한다.

## 금지사항

- 단순 variant, color treatment, visual flourish만으로 새 term을 만들지 않는다. 이유: vocabulary 중복과 장식어 증가를 막기 위해서다.
- 유료/로그인 뒤에 있는 자료를 근거로 쓰지 않는다. 이유: 검증 가능한 공개 source-backed loop를 유지해야 한다.
- 구현 코드나 `terms.yml` 승격은 Step 1부터 한다.
