# PLAN — HU3: 이미지 표현 트랙 (실사진 소싱·누끼·생성 이미지)

> 생성: 2026-07-31 · 갈래: changeset(cross-repo — custom-skills) · scope: goal `html-upgrade` 3/4.
Status: approved (사용자 "ㄱㄱ" 2026-07-31 — fresh 검증자 2회 발견 7건 반영 후 일괄 승인, chain hu1→hu2→hu3→hu4)

## 북극성 → milestone → step (위계)
- **북극성**: Askewly Design — 발표 매체 판 (`CLAUDE.md` 「북극성」 절).
- **goal**: `html-upgrade` 3/4 — 사용자 확장 요청(2026-07-31): "이미지를 쓸 수도 있겠지. Pexels, codex exec 으로 imagegen". 현행 HTML 트랙은 이미지 자산의 **소싱 경로가 계약에 없다**(레이아웃 슬롯은 있으나 어디서 어떤 라이선스로 가져오는지 규정 부재) — 실사진(스톡)·누끼(rmbg)·생성(imagegen) 3원천을 계약화하고 레이아웃 표현을 보강한다.
- **리서치 입력**: `research/2026-07-31-html-upgrade-goal-refs.md` §5 — shelf `adobe-stock-free`·`burst-shopify`(라이선스 확인 계약)·로컬 `rmbg`(누끼) + PB2 하이브리드 트랙 imagegen 프롬프트 템플릿(`decks/claude-ppt-lab/codex-image-deck/imagegen-prompts.md` — 팔레트 hex 고정·글자/로고 금지) + Pexels(사용자 언급, 셸프 미등재 — 소스 맵에 추가).

## Scope Boundary
- **포함**: ① 이미지 소싱 계약 문서화 — 실사진 소스 맵(Pexels·Adobe Stock free·Burst — 소스별 라이선스 확인 절차·출처 장부 양식), 누끼 = `rmbg` 경로, 생성 = codex exec image_gen(PB2 프롬프트 템플릿 스킬 이관 — 팔레트 hex 고정·**이미지 안 글자/로고 금지**·사실 검수는 텍스트 없는 장식 한정으로 불요) ② 레이아웃 이미지 표현 보강 — 풀블리드 이미지 히어로 + 기존 레이아웃(split-screen 등) 이미지 슬롯 계약 정리, 이미지 처리 규율(오버레이/틴트로 텍스트 대비 확보 — WCAG 대비 유지) ③ standalone/export 경로에서 이미지 인라인 정합(HU1 계약과 연결) ④ 등재·배포.
- **제외**: 유료 스톡 결제 · 이미지 CDN/호스팅 인프라 · 사진 보정 파이프라인(누끼 외) · PPTX 트랙 이미지 확장(bespoke 계약 §7 이 이미 소유).
- execution mode: continuous
- **중단점(stop points)**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped
- rollback/cleanup: custom-skills 커밋 revert + 재배포. 이미지 슬롯은 opt-in — 미사용 덱 산출 무변화.

## 스캐폴딩 결정
- source-of-truth: 이미지 소싱·표현 계약 정본 = 신규 `references/imagery.md`(소스 맵·라이선스 장부 양식·imagegen 프롬프트 템플릿·처리 규율). 레이아웃 슬롯 계약은 기존 `references/layouts.md` 관례를 따른다.
- 검증: fixture 덱에 3원천 이미지(스톡 1·누끼 1·생성 1) 실투입 → validate·build·overflow PASS + Chrome 렌더 육안(텍스트 대비 오버레이) + 출처 장부 실기록 + standalone 산출에 이미지 인라인 실동작.
- 배포/운영: setup.sh 단일 배포. 공유 레포 — add 경로 명시. imagegen 은 codex exec 위임(비용 소액·PB2 전례 — 위임 결정: use).
- 자기선언 — 소싱 계약: 모든 실사진은 **출처 URL + 라이선스 확인 + 접근일**을 덱 소스 장부(slides.json source 필드 또는 README)에 기록 — 미기록 이미지 사용 금지 · 생성 이미지는 "생성" 표기 + 프롬프트 보존 · **이미지 안 텍스트 금지**(글자는 HTML 레이어 소유 — PB2 풀-이미지 실측 결함의 경계) · **생성 이미지 치수 가드**(검증자 발견 — 레포 실증 전례 `packages/template-image-provider-codex`: image_gen 은 요청 치수를 안 지킨다, 정사각 요청에 1254×1254 실측) — 슬롯 적합/커버 크롭 손실 검사를 계약에 포함 · 사람 얼굴 식별 가능 사진은 라이선스 무관 회피(초상권, 기본값).
- 자기선언 — 표현 규율: 이미지 위 텍스트는 오버레이/그라디언트 스크림으로 대비 확보(WCAG 기준 유지) · 풀블리드는 `exportFallback` 불요(정적) · 이미지 파일은 덱 로컬 `assets/`(원본 경로·출처는 장부).
- 검토 후 제외: Unsplash — Pexels·Adobe free·Burst 3원 소스로 충분, 소스 맵은 추후 추가 가능 구조 · 이미지 최적화 빌드 단계(리사이즈·webp 변환) — 수요 확인 후(finding 큐).

## 결정 로그
- status: resolved
- **이미지 트랙 포함** — 사용자 확장 요청 2026-07-31 ("이미지를 쓸 수도 있겠지. pexel, codex exec으로 imagegen").
- 소스 맵 구성(Pexels+Adobe free+Burst)·얼굴 사진 회피 기본값 = 에이전트 결정(기록만 — 소스 추가는 열린 구조).

## Step 트리

- [x] **step-1 — 이미지 소싱·처리 계약 (`references/imagery.md`)**
  - Artifact: 신규 `references/imagery.md` — 실사진 소스 맵(Pexels·Adobe Stock free·Burst + 라이선스 확인 절차·출처 장부 양식), 누끼 `rmbg` 경로, imagegen 위임 계약(PB2 프롬프트 템플릿 이관·팔레트 hex 고정·이미지 안 글자 금지), 처리 규율(대비 스크림·얼굴 회피·assets 배치). SKILL.md 라우팅 1행.
  - Files: write custom-skills `references/imagery.md`·`SKILL.md`. read `decks/claude-ppt-lab/codex-image-deck/imagegen-prompts.md`·toolshelf 카드(adobe-stock-free·burst-shopify·rmbg).
  - Risk: 없음 (신규 문서 + 라우팅 1행)
  - Dependencies: 없음
  - Verify: 문서 존재 + SKILL.md 라우팅 표 갱신 + shelf used 기록(adobe-stock-free·burst-shopify·rmbg — 실사용 시).
  - Failure probe: imagegen-prompts.md 원문이 PPTX 맥락 전제 — HTML 트랙 맥락(해상도·비율 16:9 슬롯별)으로 번안, 원문 복사 금지.
  - Commit: changeset `20260731-hu3-image-track` (custom-skills, README 절: step-1).
- [x] **step-2 — 레이아웃 이미지 표현 (풀블리드·슬롯 계약·스크림)**
  - Artifact: 풀블리드 이미지 히어로(신규 layout 또는 기존 hero 계열 variant — 착수 시 layout-meta 실측으로 판정) + split-screen 등 기존 이미지 슬롯 계약 정리(layouts.md) + 텍스트 대비 스크림 스타일.
  - Files: write custom-skills `templates/`(renderer·layout-meta·schema — 신규 variant 범위)·`references/layouts.md`.
  - Risk: 위험 (layout-meta·schema 공유 계약 파일 — HU2 step-3 과 같은 3자 정합 규율)
  - Dependencies: step-1
  - Verify: fixture(로컬 자리표시 이미지) validate·build·overflow PASS + Chrome 육안(스크림 대비) + 미사용 덱 diff 0.
  - Failure probe: layout-meta·schema·renderer 3자 정합(validate 가 잡는지 확인).
  - Commit: changeset 동일 (README 절: step-2).
- [x] **step-3 — 3원천 fixture 실증 + standalone 인라인 + 배포**
  - Artifact: fixture 덱에 3원천(스톡 1·누끼 1·생성 1 — 생성은 codex exec 위임) 실투입 + 출처 장부 실기록 + setup.sh 배포.
  - Files: write custom-skills fixture 덱·`references/imagery.md`(실증 결과 반영). read `packages/template-image-provider-codex`(치수 가드 전례).
  - Risk: 없음 (fixture + 문서 + 배포)
  - Dependencies: step-2
  - 선행 게이트: HU1 standalone 완료(연쇄 순서가 보장 — 인라인 검증이 이를 소비, milestone 간 순서는 ROADMAP marker 소유)
  - Verify: 3원천 렌더 Chrome 육안 + 생성 이미지 치수/크롭 손실 가드 통과 + HU1 standalone 산출에 이미지 base64 인라인 실동작(오프라인 file:// 개봉) + 출처 장부 3건 + 배포 정합.
  - Failure probe: imagegen 산출에 글자 섞임 → 재생성(수용 금지) · 치수 불일치 → 크롭 손실 한도 검사(전례 계약 준용) · rmbg 가용 확인, 불가 시 기록하고 스톡·생성 2원천으로 실증(발명 금지).
  - Commit: changeset 동일 (README 절: step-3).

## 검증/DoD
- **DoD**: 이미지 소싱 계약(3원천·라이선스 장부·imagegen 위임)이 `references/imagery.md` 로 배포되고, fixture 덱에서 3원천 이미지가 레이아웃 표현(대비 스크림 포함)으로 실렌더되며, standalone 인라인·미사용 덱 무변화가 확인된다.
- **Evidence**: `evidence/html-upgrade/hu3-image-track.md`
- **회귀 게이트**: 이미지 미사용 fixture 재빌드 diff 0 + 기존 레이아웃 계약 무접촉(슬롯 정리는 문서화 — 렌더 변경은 신규 variant 만).

## 수치 출처
- 소스 3원(Pexels·Adobe free·Burst) = research §5 실측: `python3 ~/projects/toolshelf/bin/shelf.py recall "무료 사진 스톡 이미지 생성"` (2026-07-31).

## 재생성 장벽
- step-2 배포 후 배포본 검증(커밋 가드).

## finding 큐
- 이미지 최적화 빌드 단계(리사이즈·webp) — 수요 확인 후.
- Pexels API 키 발급 자동 검색 경로 — 수동 다운로드로 시작.

## 진행 로그
- 2026-07-31 작성 — 사용자 확장 요청(/kg /ts 발굴) 반영, goal 연쇄 3/4.
