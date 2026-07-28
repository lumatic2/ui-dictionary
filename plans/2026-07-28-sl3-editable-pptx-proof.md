# PLAN — SL3: 편집 가능 PPTX 실증 (Askewly Design 소개 덱)

> 생성: 2026-07-28 · 갈래: 실증 실험(덱 제작 + export 비교) · scope: goal `slide-methodology` 연쇄 3/3. SL2 영수증 `--chain SL3` 집행.
Status: approved (연쇄 집행 — 단 덱 구성안·문구·디자인 방향은 사용자 소유: G2~G4 게이트에서 확정, 아래 결정 로그)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "제작 표면 왕복" + "매체 게이트" 축의 발표 매체 실증.
- **goal**: `slide-methodology` · **milestone**: SL3 — 편집 가능 PPTX 실증. pending goal `real-use-lap`("Askewly Design으로 Askewly Design 소개 덱 PPTX 실제 제작") 부활 조건 판정 포함.
- **입력**: `methodology/slide-production.md` §2 export 결정표(편집 가능 경로 2: pptxgenjs html2pptx / ppt-master SVG→DrawingML) · toolshelf 카드 `PptxGenJS`(4.0.1+)·`ppt-master`(클론 `~/projects/toolshelf/repos/ppt-master`) · 엔진 = `presentation-slides-yusung`(SL2 린트 포함).

## Scope Boundary
- **포함**: ① Askewly Design 소개 덱(6~7장, HTML 정본) 제작 — G1~G6 게이트 준수, `--lint` 자기적용 ② 경로 A: pptxgenjs로 slides.json→네이티브 shape PPTX 변환 실험 ③ 경로 B: ppt-master 파이프라인(SVG 재작성→svg_to_pptx)으로 동일 덱 PPTX ④ 두 산출물 실개봉 확인 + 비교 장부(편집 가능성·충실도·비용) ⑤ real-use-lap 부활 조건 판정.
- **제외**: 변환기의 범용화·스킬화(비교 장부가 결론을 내면 다음 goal 재료 — 여기서는 실험 스크립트) · 결제/배포 표면 · 영상 export.
- execution mode: continuous
- **중단점(stop points)**: G2 구성안 승인 / G3~G4(구성안 승인에 합본 제시) / completed / blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 신규 디렉터리(`decks/askewly-design-intro/`) 중심 — revert로 원복. PowerPoint 설치 부재 시 실개봉은 python-pptx 구조 검사 + 가능한 뷰어로 대체하고 partial 명시.

## 스캐폴딩 결정
- source-of-truth: 덱 정본 = `decks/askewly-design-intro/content/slides.json` (presentation-slides-yusung 계약). PPTX 2종은 파생 산출물 — 손편집 금지, 재생성으로만.
- 검증: validate(--lint 포함)·build·overflow PASS + 브라우저 실조작(§5 HTML 게이트) + PPTX 실개봉(§5 PPTX 게이트 — 텍스트 선택·개체 이동 실확인) + slide-spec `validateSlideDeclaration` 정합(캔버스 프리셋 선언 `pptx-widescreen-16-9`, hd 1280×720은 같은 16:9 비율 export 스케일).
- 배포/운영: 덱은 레포 내 산출물(사이트 배포 안 함). push 세션 말 일괄.
- 자기선언 — dogfood 계약: 이 덱 제작이 SL1 방법론·SL2 린터의 첫 실사용이다 — 막히는 지점을 finding 큐에 결함으로 기록(real-use-lap 정신).
- 검토 후 제외: slides-grab 경로(엔진 선택표상 이 케이스는 yusung 우선) · ppt-master AI 이미지 생성 기능(API 키 필요 — SVG 변환 파이프라인만 사용).

## 결정 로그
- status: resolved
- **G2 구성안·G3 문구 톤·G4 디자인 = 사용자 소유** — 계획 승인 전 합본 제시(7장 구성안 + askewly 테마 + 문구 방향)하고 사용자 승인 답변으로 확정한다. 수정 요청 시 이 절과 step-1을 반영 후 재승인. 승인된 구성안은 진행 로그에 기록.
- 기술 결정(에이전트 소유): 캔버스 = hd(16:9) + 프리셋 선언 pptx-widescreen-16-9 · 경로 A 구현 = Node 스크립트(pptxgenjs 4.0.1 고정) · 경로 B = ppt-master 클론 스크립트 직접 호출.

## Step 트리

- [ ] **step-1 — 덱 제작 (G1~G6)**
  - Artifact: `decks/askewly-design-intro/` — 표준 템플릿 복사 + `content/slides.json`(6~7장, 승인된 구성안대로) + 빌드된 HTML + 검증 로그. G1 자료 = 이 레포 자체(CLAUDE.md 북극성·ROADMAP·자산 수치 — 외부 조사 불요, 수치는 레포 실측).
  - Files: write decks/askewly-design-intro/** . read ~/.claude/skills/presentation-slides-yusung/references/authoring-contract.md(복사 명령), CLAUDE.md(내용 소스).
  - Risk: 없음 (신규 디렉터리)
  - Dependencies: 없음 (G2 승인 후 착수)
  - Verify: validate-slides --lint 위반 0(자기적용) · build · overflow PASS · Chrome 실조작(index·전 슬라이드·인터랙티브).
  - Failure probe: 자산 수치(용어 수 등)를 기억으로 쓰면 낡는다 — 레포에서 실측(grep/count)해 sourceNote에 근거 표기.
  - Commit: changeset `sl3-editable-pptx-proof` (README 절: step-1).

- [ ] **step-2 — 경로 A: pptxgenjs 네이티브 변환**
  - Artifact: `decks/askewly-design-intro/export/html2pptx.mjs`(slides.json→pptxgenjs 텍스트·도형·표 네이티브 개체 매핑, 레이아웃 3~4종 대응) + `askewly-design-intro.pptxgenjs.pptx` + 실개봉 관측 기록.
  - Files: write decks/askewly-design-intro/export/html2pptx.mjs. 실행: node + 실개봉.
  - Risk: 위험 (실험 코드 — 변환 손실 예상: 그라디언트·인터랙티브. 손실을 결함이 아니라 장부 데이터로 기록)
  - Dependencies: step-1
  - Verify: .pptx 생성 + python-pptx로 shape/텍스트 개체 수 검사 + 실개봉(가능 시)에서 텍스트 선택·개체 이동 확인.
  - Failure probe: pptxgenjs 구버전이 깔리면 "복구 필요" 손상 이력 — package.json에 4.0.1+ 명시 고정.
  - Commit: changeset `sl3-editable-pptx-proof` (README 절: step-2).

- [ ] **step-3 — 경로 B: ppt-master SVG→DrawingML + 비교 장부 + 마감**
  - Artifact: 대표 3~4장을 SVG로 재작성(ppt-master 캔버스 규격) → `svg_to_pptx.py`로 네이티브 PPTX + 비교 장부(`research/2026-07-28-sl3-pptx-path-comparison.md` — 편집 가능성·충실도·공수·의존성 표) + real-use-lap 부활 판정 + evidence.
  - Files: write decks/askewly-design-intro/export/svg/**, research/2026-07-28-sl3-pptx-path-comparison.md, evidence/slide-methodology/sl3-pptx.md. 실행: ppt-master 클론 스크립트(requirements 설치 필요 시 venv).
  - Risk: 위험 (외부 파이프라인 — 반입 심사 clean 완료·venv 격리·대표 장으로 공수 상한)
  - Dependencies: step-2
  - Verify: .pptx 생성 + 실개봉/python-pptx 검사 + 장부에 두 경로 실측 행 완성 + 미달·불가 항목 "평가 못 함" 명시.
  - Failure probe: ppt-master 전체 워크플로우(8확인·프로젝트 구조)를 다 밟으면 공수 폭발 — 변환 스크립트만 표적 사용.
  - Commit: changeset `sl3-editable-pptx-proof` (README 절: step-3).

## 검증/DoD
- **DoD**: 소개 덱이 HTML 정본으로 완성(자체 게이트+린트 PASS)되고, 같은 덱이 두 편집 가능 경로로 PPTX화되어 실개봉(불가 시 구조 검사+partial 명시) 확인되며, 편집 가능성·충실도 비교 장부가 실측으로 채워지고, real-use-lap 부활 조건 판정이 기록된다.
- **Evidence**: `evidence/slide-methodology/sl3-pptx.md`
- **회귀 게이트**: 기존 레포 파일 무접촉(신규 디렉터리 + research/evidence만).

## 수치 출처
- 덱 내 자산 수치 = 레포 실측(step-1에서 카운트, sourceNote 표기).

## finding 큐
- (dogfood 결함을 여기 적는다)

## 진행 로그
- 2026-07-28 작성 — SL2 완료 직후 연쇄 집행. G2~G4 사용자 게이트 제시 준비.
- 2026-07-28 G2~G4 사용자 승인("ㄱㄱ") — 7장 구성안(주장형 제목·레이아웃 표) · askewly 테마 · hd 16:9 + pptx-widescreen-16-9 선언 확정.
