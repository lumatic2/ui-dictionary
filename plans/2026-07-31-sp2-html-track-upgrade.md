# PLAN — SP2: HTML 트랙 스킬 업그레이드 (슬라이드 파이프라인 업그레이드)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `slide-pipeline-upgrade` 연쇄 2/3.
Status: approved (연쇄 승인 — SP1 계획 승인 시 chain 영수증 sp2 등록, 2026-07-31. 새 사용자 소유 결정 없음 — SP1 흡수 판정이 scope 입력)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — 발표 매체 판.
- **goal**: `slide-pipeline-upgrade` 연쇄 2/3. SP1 흡수 판정(`evidence/slide-pipeline/sp1-video-lab.md` §2): 채택 ① 브랜드 DESIGN.md→테마 변환 ② 1장 캘리브레이션 ④ 리디자인 입력(md 우선) / 보류 ③ 비교쌍 교정.
- **리서치 입력**: SP1 충실도 장부 + 랩 실증(minimax 수동 변환 26변수 매핑이 실제로 통함).

## Scope Boundary
- **포함**: ① custom-skills presentation-slides-yusung 에 커스텀 브랜드 테마 트랙(DESIGN.md→theme.json 변환 스크립트 + builder 지원 + 스키마·검증) ② 절차 2종 문서화(1장 캘리브레이션 편차 교정 루프 → G5 승격 · 리디자인 입력 트랙[md 소스]) ③ 배포 + ui-dictionary 랩 실증(minimax 재현) + 기존 fixture 무회귀.
- **제외**: 비교쌍 교정(보류 판정) · PDF/PPTX 파싱 입력(미실증 — 확장 후보) · PPTX export 트랙(SP3) · methodology 갱신(SP3).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 커스텀 테마는 opt-in(meta.template 신규 값 — 기존 덱 무접촉).

## 스캐폴딩 결정
- source-of-truth: 테마 계약 = `templates/src/theme.mjs` + `slides.schema.json` + validator (동시 갱신 — SKILL.md §5 원칙 승계). 커스텀 테마 정본 = 덱 로컬 `content/theme.json`(변환 스크립트 산출물). 절차 정본 = SKILL.md + references(중복 금지 — §8 routing 원칙).
- 검증: 신규 fixture(custom-theme-smoke) validate·build PASS + 기존 fixture 무회귀 + 배포본 동일 동작 + ui-dictionary 랩 재현(변환 스크립트로 minimax theme.json 생성→빌드→브라우저 실렌더 1장).
- 배포/운영: custom-skills 원본 수정 → `setup.sh` 단일 배포(SL2 확립 경로).
- 자기선언 — 테마 계약: 커스텀 테마는 canonical 3종과 같은 CSS 변수 26키 전부 필수(누락 시 validator FAIL) · 폰트 링크 명시 · 변환 스크립트는 DESIGN.md YAML frontmatter 만 읽음(본문 rationale 은 사람/에이전트 몫) · 브랜드 복사 경고 문구(재현·시안 한정, 최종 아이덴티티 복사 금지) 문서 명기.
- 검토 후 제외: 테마 마켓/카탈로그화(getdesign 75종 일괄 변환 — 수요 실증 전 과잉) · 비교쌍 교정 절차.

## 결정 로그
- status: resolved
- **채택 범위 = SP1 판정 그대로** (채택 3, 보류 1) — 판정 근거는 evidence §2, 사용자 승인 범위(연쇄 제시) 내.
- **리디자인 입력 = md/보고서 소스 우선** — PDF 파싱 미실증(SP1 편차 기록)에 따른 축소, 확장은 finding 큐.
- **새 사용자 소유 결정: 없음** (변수 키 집합·스크립트 이름은 튜닝값).

## Step 트리

- [x] **step-1 — 커스텀 브랜드 테마 트랙 (변환 스크립트 + builder 지원)**
  - Artifact: `scripts/design-md-to-theme.mjs`(DESIGN.md YAML → `content/theme.json`: name·vars 26키·fontLinks — 색 토큰 휴리스틱 매핑 + 미해결 키 보고) + builder 지원(`meta.template: "custom"` 시 `content/theme.json` 로드·주입 — theme.mjs·builder-core/shell·schema·validator 동시 갱신) + fixture `custom-theme-smoke`(minimax theme.json 고정본).
  - Files: write ~/projects/custom-skills/promoted/presentation-slides-yusung/{scripts/design-md-to-theme.mjs,templates/src/theme.mjs,templates/src/shell.mjs,templates/slides.schema.json,templates/validate-slides.mjs,fixtures/custom-theme-smoke/**}. read SP1 랩 theme.mjs diff.
  - Risk: 위험 (schema·theme 공유 파일 수정 — 기존 fixture 무회귀로 격리)
  - Dependencies: 없음
  - Verify: fixture validate·build PASS + 변수 26키 누락 시 validator FAIL 확인(음성 케이스) + 기존 fixture(polish-smoke 등) 무회귀.
  - Failure probe: DESIGN.md 색 이름이 자유형이라 휴리스틱 매핑이 빈 키를 남긴다 — 빈 키는 조용히 기본값 채우지 말고 stderr 로 나열 + exit 1(에이전트가 수동 보완). schema enum 에 "custom" 추가 시 validator 의 CANONICAL_THEMES 검사와 충돌 주의 — 둘을 한 커밋에서 동시 갱신.
  - Commit: changeset `20260731-sp2-html-track-upgrade` (custom-skills, README 절: step-1).
- [x] **step-2 — 절차 2종 문서화 (캘리브레이션 루프 승격 · 리디자인 입력 트랙)**
  - Artifact: SKILL.md G5 를 "대표 1장 스타일 캘리브레이션 루프"로 강화(편차 체크리스트: 앵커 위치·제목-부제 간격·키컬러 단일성·푸터 규칙 — 수렴까지 반복, 교정은 코드 diff 로 기록) + §1 입력에 리디자인 소스(md/보고서) 추가 + authoring-contract.md 에 리디자인 절차 절(소스→구성안 매핑, 수치·인용 보존 규칙) + style-system.md 에 커스텀 테마 절(step-1 계약 + 브랜드 복사 경고).
  - Files: write custom-skills SKILL.md·references/{authoring-contract.md,style-system.md}. read SP1 evidence.
  - Risk: 없음 (문서만 — SKILL.md·reference 중복 금지 원칙 준수)
  - Dependencies: step-1
  - Verify: SKILL.md 와 reference 간 상세 중복 없음(routing 원칙) + 문서 내 상대 링크 실존.
  - Failure probe: G5 강화가 기존 "대표 1~3장" 문구와 충돌해 이중 절차가 되면 안 된다 — G5 본문을 대체 서술로 갱신(추가 아님).
  - Commit: changeset 동일 (README 절: step-2).
- [x] **step-3 — 배포 + 랩 실증 + 무회귀 (SP2 마감)**
  - Artifact: `setup.sh` 배포 → ui-dictionary 랩에서 배포본으로 실증: `design-md-to-theme.mjs` 를 `research/sources/minimax-design-md.md` 에 실행 → theme.json 생성 → custom 테마 경로로 1장 빌드·브라우저 실렌더 스크린샷(SP1 수동 변환 결과와 대조) + evidence.
  - Files: write evidence/slide-pipeline/sp2-skill-upgrade.md + 랩 산출물(decks/claude-ppt-lab/custom-theme-proof/). 실행: 배포 + node + Chrome.
  - Risk: 위험 (배포 — 단일 스킬 배포 경로로 격리)
  - Dependencies: step-1, step-2
  - Verify: 배포본 fixture 빌드 PASS + 랩 실렌더가 SP1 minimax 렌더와 시각 동등(스크린샷 대조) + 기존 fixture 무회귀.
  - Failure probe: 배포본과 소스 어긋남 → setup.sh 후 배포본 경로에서 재검증. 변환 산출 색이 SP1 수동 매핑과 다르면 어느 쪽이 정본인지 명시(변환 스크립트 우선, 편차는 evidence 기록).
  - Commit: changeset 동일 (README 절: step-3) + ui-dictionary 커밋 `docs(sp2)`.

## 검증/DoD
- **DoD**: SP1 채택 3건이 custom-skills 에 구현·문서화·배포되고, ui-dictionary 랩에서 배포본으로 DESIGN.md→테마 변환→빌드→실렌더가 재현되며, 기존 fixture 무회귀.
- **Evidence**: `evidence/slide-pipeline/sp2-skill-upgrade.md`
- **회귀 게이트**: 기존 fixture validate·build 출력 불변 + canonical 3테마 무접촉.

## 수치 출처
- 채택/보류 판정·26변수 매핑 = `evidence/slide-pipeline/sp1-video-lab.md` (랩 실측 2026-07-31).

## 재생성 장벽
- step-3 배포(setup.sh) 후에만 배포본 검증 가능 — 소스 검증과 분리.

## finding 큐
- 변환기 chart-3 휴리스틱이 SP1 수동 선택과 다른 브랜드색 선택 — --set 보완 경로로 수용 (evidence 기록).
- REQUIRED_THEME_VARS 코드 정본 = 29키 (계획서 26은 추정치 — 결정 로그의 튜닝값 원칙대로 코드 우선).

## 진행 로그
- 2026-07-31 step-1~3 완주 — smoke 18+3 PASS·음성 케이스 확인·배포 정합·랩 실증(변환 산출 fixture identical).
- 2026-07-31 작성 — SP1 완료 경계에서 연쇄 개설 (chain 영수증 sp2).
