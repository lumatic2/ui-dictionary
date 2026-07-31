# PLAN — PB2: bespoke 실증 — askewly-design-intro 고품질 산출

> 생성: 2026-07-31 · 갈래: 덱 산출물(본 레포) + evidence · scope: goal `pptx-bespoke` 2/2.
Status: approved (연쇄 승인 — PB1 승인 시 chain 영수증 pb2 등록, 사용자 "ㄱㄱ" 2026-07-31)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `pptx-bespoke` 연쇄 2/2 — PB1 이 박제한 트랙(시각 자기검사 + 계약 문서)으로 실덱 1본을 고품질 산출해 트랙이 실제로 영상급 품질을 내는지 실증한다. 실증 덱 = `decks/askewly-design-intro`(사용자 확정).
- **품질 기준**: 같은 덱 HTML 렌더 근접(사용자 확정 2026-07-31) — HTML 스크린샷이 기준 이미지, 최종 게이트는 사용자 관측 1회.

## Scope Boundary
- **포함**: ① askewly-design-intro HTML 렌더 기준 스크린샷 확보 ② 덱 로컬 `tools/export-pptx-bespoke.mjs` 생성(pptx-bespoke.md 계약 준수) ③ 대표 1장 미세조정 라운드(영상 3단계 등가) ④ 전장(7장) 적용 + 구조 검증(python-pptx·COM) + 사용자 관측 ⑤ evidence + 라운드 장부.
- **제외**: topic-deck 등 다른 덱 bespoke 산출 · HTML/PDF 트랙 변경 · 스킬 소스 수정(발견 사항은 finding 큐로 — 단 pptx-bespoke.md 의 명백한 결함은 PB2 안에서 정정 가능, changeset 기록).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked (미세조정 라운드 상한 5 초과 포함) / decision_required / risk_gate / user_stopped
- rollback/cleanup: 덱 로컬 파생 산출물뿐 — 커밋 revert 로 충분. 기존 `askewly-design-intro.skill-track.pptx`(범용 매퍼 산출)는 비교 대조본으로 보존.

## 스캐폴딩 결정
- source-of-truth: bespoke 코드 = 덱 로컬 파생(`tools/export-pptx-bespoke.mjs`, slides.json+theme 판독 — 팔레트 하드코딩 금지). 기준 이미지 = HTML 렌더 스크린샷(`evidence/slide-pipeline/img/` 에 대표만 커밋).
- 검증: 라운드마다 pptx-to-png(PB1) → HTML 스크린샷과 나란히 육안 비교 → 라운드 장부(조정 항목·근거) 기록. 종료 게이트 = 구조 검증(has_chart·pictures 0·COM Workbook 접근) + 사용자 관측 1회(고품질 판정).
- 배포/운영: 해당 없음(덱 로컬 — 스킬 배포 없음).
- 자기선언 — 실증 계약: hero-motion 등 모션 레이아웃은 카드 폴백이 아니라 **정지 프레임 아트디렉션으로 재해석**(bespoke 의 존재 이유) · 표현 불가 항목(예: 글래스 블러)은 편차 장부 기록 후 대체 표현 · 네이티브 차트·엑셀 연동은 회귀 없이 유지.
- 검토 후 제외: 발표자 노트 이관(범용 매퍼가 이미 함 — bespoke 도 동일 계승, 별도 작업 아님) · 픽셀 diff 자동화.

## 결정 로그
- status: resolved
- **실증 덱 = askewly-design-intro** — 사용자 확정 2026-07-31.
- **품질 기준 = HTML 렌더 근접, 최종 게이트 = 사용자 관측 1회** — 사용자 확정 2026-07-31.
- 대표 미세조정 슬라이드 선정(구도 복잡도 최상 1장) = 튜닝값(에이전트 결정, 장부 기록).

## Step 트리

- [ ] **step-1 — 기준 확보 + bespoke v1 + 대표 1장 미세조정**
  - Artifact: ① HTML 렌더 7장 스크린샷(Playwright, 기준 세트) ② `decks/askewly-design-intro/tools/export-pptx-bespoke.mjs` v1 — pptx-bespoke.md 계약 준수(테마 판독·표현 레시피·슬라이드별 아트디렉션) ③ 대표 1장(복잡도 최상)을 pptx-to-png → 기준 비교 → 조정 라운드(상한 5)로 수렴 + 라운드 장부.
  - Files: write decks/askewly-design-intro/tools/export-pptx-bespoke.mjs·라운드 장부(plan doc 진행 로그 또는 evidence 초안). read ~/.claude/skills/presentation-slides-yusung/references/pptx-bespoke.md(배포본)·decks/askewly-design-intro/content/*. 실행: node·http-server+Playwright·pwsh COM.
  - Risk: 위험 (COM 반복 실행 — 라운드마다 Quit 확인 / http-server 캐시 — `-c-1` 필수, SP1 finding)
  - Dependencies: 없음
  - 선행 게이트(milestone 간 순서는 ROADMAP 소유 — PB1 완료가 전제): 착수 시 PB1 배포본 존재를 검사한다 — `~/.claude/skills/presentation-slides-yusung/scripts/pptx-to-png.ps1` + `references/pptx-bespoke.md` 둘 다 없으면 진행하지 않고 blocked.
  - Verify: 대표 1장 최종 라운드 PNG vs HTML 스크린샷 비교 — **고정 체크리스트 5항**(① 배경·카드 표면 색 ② 팔레트 정확도: theme hex 와 일치 ③ 타이포 위계: 크기 순서·굵기 대응 ④ 구도: 요소 배치·정렬 대응 ⑤ 표현 디테일: 그림자·액센트 존재) 각각 pass/fail 을 라운드 장부에 기록. "근접" = 편차 장부 등재 항목을 제외한 전 항 pass. 상한 도달 시 blocked 보고.
  - Failure probe: pptxgenjs 표현 한계(gradient fill 미지원 등)로 HTML 룩 재현 불가 항목 발생 — 편차 장부에 기록하고 대체 표현으로 진행(침묵 근사 금지). 폰트는 Pretendard 설치 확인됨(2026-07-31).
  - Commit: 본 레포 `feat(pb2)` — bespoke v1 + 기준 세트 + 라운드 장부.
- [ ] **step-2 — 전장 적용 + 구조 검증 + 사용자 관측 (PB2 마감)**
  - Artifact: 7장 전장 bespoke 산출 `export/askewly-design-intro.bespoke.pptx` → 전장 PNG 세트 + python-pptx(has_chart·pictures 0) + COM open-verify(Opened·ChartShapes·Workbook 접근) → **사용자 관측 1회**(PowerPoint 실개봉, 고품질 판정 — 범용 매퍼 산출본과 대조) → `evidence/slide-pipeline/pb2-bespoke-proof.md`(라운드 장부·편차 장부 포함).
  - Files: write export/askewly-design-intro.bespoke.pptx·evidence/slide-pipeline/pb2-bespoke-proof.md·img/ 대표 비교컷. 실행: node·python·pwsh COM.
  - Risk: 위험 (COM)
  - Dependencies: step-1
  - Verify: 구조 검증 PASS + 사용자 관측 "품질 충분" 판정. 미달 판정 시 라운드 재개(상한 내) or blocked.
  - Failure probe: 전장 적용에서 대표 1장에 없던 레이아웃별 결함 노출 — 슬라이드별 편차 장부로 수렴, 상한 = **전장 추가 라운드 합산 3 이내**(슬라이드당이 아니라 전체 합산, 튜닝값).
  - Commit: 본 레포 `feat(pb2)` 마감 커밋.

## 검증/DoD
- **DoD**: askewly-design-intro 가 bespoke 트랙으로 산출되어 HTML 렌더 근접 판정(라운드 장부 증거)과 구조 검증(네이티브 차트·비트맵 0·COM PASS)을 통과하고, 사용자 관측 1회에서 범용 매퍼 산출 대비 품질 향상이 확인된다.
- **Evidence**: `evidence/slide-pipeline/pb2-bespoke-proof.md`
- **회귀 게이트**: 기존 HTML 덱·범용 매퍼 산출본·PDF 트랙 무접촉.

## 수치 출처
- 라운드 상한 5(대표 1장)·3(전장 추가) = PB1 계약 튜닝값.

## 재생성 장벽
- 없음 (스킬 배포 없음 — 덱 로컬).

## finding 큐

## 진행 로그
- 2026-07-31 작성 — PB1 연쇄 2/2 로 개설.
