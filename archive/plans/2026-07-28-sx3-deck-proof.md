# PLAN — SX3: 실증 (소개 덱 적용)

> 생성: 2026-07-28 · 갈래: 실증(덱 갱신 + export 게이트 왕복) · scope: goal `slide-expressive` 연쇄 3/3. SX2 영수증 `--chain SX3` 집행.
Status: approved (연쇄 승인 집행 — 승인된 덱 문구 무변경 원칙, 새 사용자 소유 결정 없음)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — "매체 게이트·제작 왕복" 축. **goal**: `slide-expressive` · **milestone**: SX3.
- **입력**: SX1 레이아웃 2종(배포됨) · SX2 벡터 PDF 트랙(배포됨) · SL3 산출 소개 덱 `decks/askewly-design-intro/`(G2~G4 승인된 7장).

## Scope Boundary
- **포함**: ① 덱 tools를 최신 템플릿으로 재복사(신규 레이아웃·벡터 exporter 수급) ② 표지(cover)를 hero-motion으로 전환 — **승인된 문구 그대로**(제목·부제·칩 무변경, 레이아웃만) ③ 벡터 PDF 산출 + HTML/PDF 게이트 왕복 ④ 표준 직행 예외(SX1 결정 로그)의 실사용 판정 + goal 마감.
- **제외**: 새 슬라이드 추가·문구 변경(G2~G3 재승인 사안 — 하지 않는다) · svg-filter-scene의 소개 덱 삽입(새 문구 필요 — 카탈로그·fixture 실증으로 갈음, 판정에 명시) · PPTX 재산출(SL3 종결).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: 덱 디렉터리 한정 — revert로 원복.

## 스캐폴딩 결정
- source-of-truth: slides.json 정본 유지 — 레이아웃 필드 1건 + exportFallback 추가만. tools는 배포본 템플릿의 사본(authoring-contract 계약).
- 검증: validate --lint·build·overflow + 브라우저 실조작(모션·reduced-motion) + 벡터 PDF(페이지 수·텍스트 추출·3면 눈 확인 — PDF는 브라우저 실개봉).
- 배포/운영: 레포 내 산출물 — push 세션 말 일괄.
- 자기선언 — 실사용 판정 기준: 표준 직행 예외가 정당했는가 = 신규 레이아웃이 실덱에서 문구 무변경으로 자연 착지하는가(스키마·오버플로·게이트 마찰 0).
- 검토 후 제외: raster PDF 재산출(SL3에서 확인 — 벡터가 이번 대상).

## 결정 로그
- status: resolved
- 덱 문구·구성 = SL3 승인분 동결. 표지 레이아웃 전환은 goal 승인에 포함된 "소개 덱에 신규 레이아웃 적용"의 최소 실행 — 문구 무변경이라 재승인 불요.
- **새 사용자 소유 결정: 없음.**

## Step 트리

- [x] **step-1 — 덱 갱신 + 적용**
  - Artifact: tools 재복사(최신 템플릿+export-vector-pdf) + slides.json 표지 `layout: hero-motion`+exportFallback + 재빌드 + 검증.
  - Files: write decks/askewly-design-intro/tools/**, decks/askewly-design-intro/content/slides.json, 재생성 HTML. read ~/.claude/skills/presentation-slides-yusung/templates/**.
  - Risk: 없음 (덱 한정 — 문구 무변경)
  - Dependencies: 없음
  - Verify: validate --lint 0경고 · build 7장 · overflow 0 · 브라우저에서 hero-motion 표지 모션 실확인.
  - Failure probe: cover 전용 CSS(중앙 배치)가 hero-motion과 다르게 동작할 수 있다 — 표지 렌더를 눈으로 확인.
  - Commit: changeset `sx3-deck-proof` (README 절: step-1).

- [x] **step-2 — 벡터 PDF 게이트 왕복**
  - Artifact: `exports/*.vector.pdf` + PyMuPDF 검사(7페이지·텍스트 추출·한글) + 3면 눈 확인 + 브라우저 PDF 실개봉.
  - Files: write decks/askewly-design-intro/exports/**. 실행: export-vector-pdf.
  - Risk: 없음 (산출물 생성·검사)
  - Dependencies: step-1
  - Verify: 페이지 7·추출 문자수 >0·3면 정상·실개봉.
  - Failure probe: chart-interactive 슬라이드는 인쇄에서 exportFallback 노트로 대체된다 — 그 상태가 계약대로인지 4페이지에서 확인.
  - Commit: changeset `sx3-deck-proof` (README 절: step-2).

- [x] **step-3 — 실사용 판정 + goal 마감**
  - Artifact: 표준 직행 예외 판정 기록 + evidence + 보고서 + ROADMAP goal 마감.
  - Files: write evidence/slide-expressive/sx3-deck-proof.md, docs/reports/, ROADMAP.md.
  - Risk: 없음 (기록)
  - Dependencies: step-1, step-2
  - Verify: report_close·roadmap complete 통과.
  - Failure probe: svg-filter-scene 미적용을 숨기면 판정이 부풀려진다 — "카탈로그·fixture 실증으로 갈음" 명시.
  - Commit: changeset `sx3-deck-proof` (README 절: step-3).

## 검증/DoD
- **DoD**: 소개 덱이 신규 레이아웃 ≥1장(hero-motion 표지, 문구 무변경)으로 갱신되고 자체 게이트 전부 PASS, 벡터 PDF가 실산출·실개봉되며(7페이지·텍스트 추출), 표준 직행 예외의 실사용 판정이 기록되고 goal이 마감된다. svg-filter-scene은 실덱 미적용을 정직하게 명시(문구 동결 원칙).
- **Evidence**: `evidence/slide-expressive/sx3-deck-proof.md`
- **회귀 게이트**: 덱 문구 diff 0(레이아웃·fallback 필드 제외) · 기존 6장 렌더 무변화.

## 수치 출처
- 없음 (기존 승인 덱 재사용).

## finding 큐
- dogfood 적발: hero-motion이 R1 면제 목록에 없어 표지 제목이 의심 보고 — 린터 면제 추가·배포 (custom-skills 수리 커밋).

## 진행 로그
- 2026-07-28 작성 — SX2 완료 직후 연쇄 집행.
