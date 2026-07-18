# changeset: composition recipe map + payload

- Date: 2026-07-19
- Target: RC3 (`plans/2026-07-19-rc3-composition-recipe-map.md`) Step 1

## Scope

- `templates/studio-data.default.json`: 구성 후보 13항의 `pv` 섹션마다 레시피 또는 registry 코드 자산 슬러그를 매핑한다.
- `templates/brief-studio.html`: 제출 payload의 `implementation`에 선택한 구성과 `recipes` 매핑을 동봉한다.
- `templates/make-studio.py`: 구성 `pv`와 `recipes` 키의 완전성, 불필요 키, 빈 값을 명시 오류로 거부한다.

Expected effect: 스튜디오에서 고른 구성이 수집 JSON의 구현 출발 자산으로 직접 이어진다.

## Contract

- Source of truth: `templates/studio-data.default.json`; HTML의 `STUDIO_DATA` 블록은 `templates/make-studio.py`로 생성한다.
- Deploy/sync target: 이 step은 로컬 템플릿과 수집 payload까지만 바꾼다. 계약·llms 배포는 RC3 Step 2가 소유한다.
- Compatibility: payload `version: 2`, `tile`, `selections`는 유지하고 additive `implementation`만 추가한다.
- Mapping: registry 자산이 있으면 해당 자산명, 없으면 동일 레시피 문서 슬러그를 사용한다.
- Out of scope: 디자인 룩, preview renderer, 서버 API, DESIGN.md 기록 지시.

## Verification

- [x] 구성 13항 전부에서 `pv`와 `recipes` 키가 1:1이고 값이 비어 있지 않다. (`COMPOSITIONS=13`, `MAP_ENTRIES=49`, registry 또는 recipe 문서 target 전수 확인)
- [x] `make-studio.py`가 기본 데이터로 HTML을 재생성하고 데이터 블록이 정본과 일치한다. (`tiles=4`, `axes=18`, `GENERATED_DATA_BLOCK=PASS`)
- [x] Failure probe: 구성 매핑 키 하나가 빠지면 `make-studio.py`가 명시 오류로 거부한다. (`recipes 키 누락: hero`, exit 1)
- [x] 실브라우저에서 18축 선택·제출 후 수집 JSON의 `implementation.recipes`를 관측했다. (`hero-cards-info`, recipes 3개, screenshot `evidence/recipe-code-reuse/rc3-studio-payload.png`)

## Result

- Status: complete (4/4)
