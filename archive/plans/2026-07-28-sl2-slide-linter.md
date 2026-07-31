# PLAN — SL2: 슬라이드 린터 (거장 원칙 자동 검사)

> 생성: 2026-07-28 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `slide-methodology` 연쇄 2/3. SL1 영수증 `--chain SL2,SL3` 집행.
Status: approved (연쇄 승인 집행 — 새 사용자 소유 결정 없음, 규칙 스펙은 SL1 methodology 문서가 정본)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "에이전트가 의도적으로 디자인된 결과물을 만든다" 축.
- **goal**: `slide-methodology` · **milestone**: SL2 — 슬라이드 린터.
- **입력**: `methodology/slide-production.md` §6 린트 규칙 스펙 (R1 제목=완결문장 · R2 슬라이드당 메시지 1 · R3 텍스트 과밀 — 전부 warning·옵트인, R4는 template-core 기존 코드 지정이라 구현 제외). 구현 표면 실측: `~/projects/custom-skills/promoted/presentation-slides-yusung/templates/validate-slides.mjs`(234줄, errors/warnings 패턴·layout polish 스위치 기존재).

## Scope Boundary
- **포함**: ① lint 모듈 + validator 옵트인 배선(`--lint` 플래그) ② 위반 fixture + 검출 실증 + 기존 fixture 무회귀 ③ 스킬 문서 반영 + setup.sh 배포 + evidence.
- **제외**: R4 폰트 하한(template-core `checkSlideHeuristics` 기존 코드 — 신규 구현 금지, 스펙에 명시됨) · title-only read test(기계 판정 불가 — G3 체크리스트 소속) · slides-grab 쪽 린트 · 기본(플래그 없는) 출력 변경.
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + setup.sh 재배포로 원복. 기본 경로 무변경(옵트인)이라 기존 사용 덱 영향 0.

## 스캐폴딩 결정
- source-of-truth: 규칙 정의·임계값의 정본은 ui-dictionary `methodology/slide-production.md` §6 — 코드 주석에 그 경로를 백링크하고 임계값을 재발명하지 않는다.
- 검증: 위반 fixture에서 R1·R2·R3 각각 최소 1건 검출(stdout 실관측) + 기존 fixture(polish-smoke) `--lint` 없이 출력 불변·`--lint` 켜도 오탐 확인 + exit code 0(warning은 비차단).
- 배포/운영: custom-skills 원본 수정 → `bash ~/projects/custom-skills/setup.sh` 배포(배포본 직접 편집 금지 규칙). custom-skills는 공유 레포 — add 경로 명시, 남의 dirty(pdf 스킬 변경) 무접촉.
- 자기선언 — 옵트인 계약: `--lint` 플래그 없으면 출력 diff 0. 각 경고에 규칙 id(R1/R2/R3)와 근거 등급을 문자열에 포함(slide-spec 철학 — 근거가 값으로 다닌다).
- 검토 후 제외: schema 변경(불필요 — 검사만 추가) · overflow-checker 접촉.

## 결정 로그
- status: resolved
- SL1 결정 3건 승계(연쇄·위치·정본). 임계값(블랙리스트 어휘·병렬 신호 2·250자)은 methodology §6 기재값 — 튜닝값이지 사용자 결정 아님(스펙에 "조정 가능 옵션" 명시).
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — lint 모듈 + validator 옵트인 배선**
  - Artifact: `templates/src/lint-principles.mjs`(R1·R2·R3 구현, methodology §6 백링크 주석) + `templates/validate-slides.mjs`에 `--lint` 플래그 배선(경고를 기존 warnings 배열에 합류).
  - Files: write ~/projects/custom-skills/promoted/presentation-slides-yusung/templates/src/lint-principles.mjs, ~/projects/custom-skills/promoted/presentation-slides-yusung/templates/validate-slides.mjs. read methodology/slide-production.md §6.
  - Risk: 없음 (옵트인 — 플래그 없으면 코드 경로 미진입)
  - Dependencies: 없음
  - Verify: node 구문 오류 없음(기존 fixture 1건에 `--lint` 실행 성공).
  - Failure probe: 한국어 종결어미 판정을 정규식 과신하면 오탐 폭주 — 블랙리스트=위반 / 종결어미 부재=의심(문구 구분) 2단으로 설계, 의심은 개수만 요약.
  - Commit: changeset `sl2-slide-linter` (custom-skills 커밋 + 이 레포 README 절: step-1).

- [x] **step-2 — 위반 fixture + 검출 실증 + 무회귀**
  - Artifact: `fixtures/lint-principles-smoke/content/slides.json`(R1 명사구 제목·R2 병렬 제목·R3 텍스트 과밀 각 1장 이상 + 정상 1장) + 검출 stdout 기록.
  - Files: write ~/projects/custom-skills/promoted/presentation-slides-yusung/fixtures/lint-principles-smoke/content/slides.json. 실행: validate-slides.mjs --lint (fixture 대상), polish-smoke 무회귀 대조.
  - Risk: 없음 (fixture 신규)
  - Dependencies: step-1
  - Verify: R1·R2·R3 각 ≥1건 검출 stdout 실관측 + 정상 슬라이드 오탐 0 + polish-smoke `--lint` 미사용 출력 불변.
  - Failure probe: fixture가 스키마 필수 필드(no/slug/section) 누락으로 에러에 묻히면 lint 경고가 안 보인다 — 스키마 통과 형태로 작성.
  - Commit: changeset `sl2-slide-linter` (README 절: step-2).

- [x] **step-3 — 스킬 문서 반영 + 배포 + 마감**
  - Artifact: 스킬 검증 절(SKILL.md §9 또는 references/verification.md)에 `--lint` 1줄 + setup.sh 배포 + `evidence/slide-methodology/sl2-linter.md`.
  - Files: write ~/projects/custom-skills/promoted/presentation-slides-yusung/SKILL.md(또는 references/verification.md), evidence/slide-methodology/sl2-linter.md. 실행: bash ~/projects/custom-skills/setup.sh, 배포본에서 --lint 재실행 확인.
  - Risk: 위험 (setup.sh 전체 배포 — 다른 스킬 소스 dirty 시 배포가 그걸 함께 밀 수 있음: 배포 전 custom-skills git 상태 확인, dirty 무관 스킬이 배포에 섞이면 중단하고 finding)
  - Dependencies: step-2
  - Verify: 배포본 `~/.claude/skills/presentation-slides-yusung/templates/`에서 `--lint` 실행이 fixture 위반을 동일 검출.
  - Failure probe: VI8 선례 — setup.sh가 전 스킬을 밀므로 남의 미완 변경(pdf 스킬 dirty)이 섞일 수 있다. 배포 결과를 해당 스킬 파일만 diff 확인.
  - Commit: changeset `sl2-slide-linter` (README 절: step-3).

## 검증/DoD
- **DoD**: R1~R3이 validator 옵트인으로 구현되고, 위반 fixture로 검출이 실증되며(각 규칙 ≥1건, 오탐 0, 기존 출력 무회귀), setup.sh 배포 후 배포본에서 동일 동작. 규칙 정본 백링크 존재.
- **Evidence**: `evidence/slide-methodology/sl2-linter.md`
- **회귀 게이트**: polish-smoke fixture 기본 실행 출력 불변 · exit code 계약 불변(warning 비차단).

## 수치 출처
- 임계값·블랙리스트 = `methodology/slide-production.md` §6 (2026-07-28).

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 — SL1 완료 직후 연쇄 집행. validator 234줄 실측 후 옵트인 모듈 설계.
