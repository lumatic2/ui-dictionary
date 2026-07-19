# ROADMAP

> Last updated: 2026-07-20
> Status: 템플릿 제작 시스템 경화 — TH1~TH5·TH7·TH9·TH10 완료, TH11(인쇄 규격) 진행 중 → TH6(close). TH8은 리서치 재수집 후
> North star: Build Askewly Design as both a public reference website and an agent-usable implementation system.
> line budget: <=150

## Current Horizon

<!-- harness:goal id="template-production-hardening" status="active" -->
Goal: 템플릿 제작 파이프라인을 선언 수준에서 실제 동작 수준으로 끌어올린다 — 구별되는 청사진·토큰 구동 스튜디오·실행되는 검증·Codex imagegen 소재 경로. Details: `plans/horizons/2026-07-template-production-hardening.md`.

<!-- harness:goal-archive6 id="template-production-system" status="completed" -->
Goal: 브리프·토큰·레시피를 명함·제품 포스터·인포그래픽의 편집 가능한 CanvasDocument와 브라우저 제작 루프로 바꾼다. Details: `plans/horizons/2026-07-template-production-system.md`.

<!-- harness:goal-archive5 id="recipe-code-reuse" status="completed" -->
Goal: 사이트 레시피 데모 실구현을 registry 코드 자산으로 배포하고, 에이전트 코드 출발 계약과 스튜디오 구성↔레시피 매핑을 배선한다. Details: `plans/horizons/2026-07-recipe-code-reuse.md`.

<!-- harness:goal-archive4 id="studio-finish" status="completed" -->
Goal: 스튜디오 이월 갭 3건 마감 — 데이터 주도 주입 자동화·구성 패턴 완편(4유형+예약형)·미리보기 고도화(다크·반응형). Details: `plans/horizons/2026-07-studio-finish.md`.

<!-- harness:goal-archive3 id="cascade-studio" status="completed" -->
Goal: 스튜디오를 폭포식(영향순·캐스케이드 적용)으로 재구축하고 스크롤 추종 라이브 미리보기·영상 후보·카피/인터랙션 축을 더한다. Details: `plans/horizons/2026-07-cascade-studio.md`.

## Active Milestones

<!-- harness:milestone id="TH1" status="completed" priority="P0" evidence="evidence/template-production-hardening/th1-legibility.md, changesets/20260720-template-core-legibility/README.md, changesets/20260720-template-studio-script-legibility/README.md, changesets/20260720-template-line-length-guard/README.md" -->
### TH1 — 코드 가독성 복구 + 회귀 방어망
- DoD: template 제작 스택 3표면에 300자 초과 라인 0개 + 해제 전후 세 fixture `templateSignature` 동일 + 재발 차단 lint가 단일 커맨드로 실행.
- Evidence: evidence/template-production-hardening/th1-legibility.md, changesets/20260720-template-core-legibility/README.md, changesets/20260720-template-studio-script-legibility/README.md, changesets/20260720-template-line-length-guard/README.md
- Gap: TPS 산출물이 한 줄 300~1,000자로 압축돼 이후 5개 milestone의 편집을 막는다 (App.tsx 18줄 중 JSX 1,000자 라인, verify 스크립트 전체 2줄)
- Scale: changesets>=2; surfaces: template-core·template-studio·verify 스크립트; capability: 사람이 읽고 고칠 수 있는 제작 스택
- Status: [x]

- Completed at: 2026-07-20
- Summary: 압축 해제 3표면 + 서명 불변 증명 + 줄 길이 가드 (300자 초과 13→0)
<!-- harness:milestone id="TH2" status="completed" priority="P0" evidence="evidence/template-production-hardening/th2-blueprints.md, changesets/20260720-template-repeating-slot-contract/README.md, changesets/20260720-template-six-blueprints/README.md, changesets/20260720-template-print-spec-validation/README.md" -->
### TH2 — 청사진 6종 실재화
- DoD: 6개 청사진 명시 선언 + 같은 포맷 두 청사진이 슬롯 개수 또는 그리드 열 수에서 다름을 기계 검증 + 인쇄 규격·안전영역 위반 명시 거부.
- Evidence: evidence/template-production-hardening/th2-blueprints.md, changesets/20260720-template-repeating-slot-contract/README.md, changesets/20260720-template-six-blueprints/README.md, changesets/20260720-template-print-spec-validation/README.md
- Gap: `-split` 3종이 전 슬롯 x+24/width-48 균일 변형이라 카탈로그 6이 실질 3이다
- Scale: changesets>=3; surfaces: 타입 계약·blueprint registry·검증; capability: 근거 있는 두 번째 아키타입
- Status: [x]

- Completed at: 2026-07-20
- Summary: 6청사진 실재화(-split 삭제) + 구조 구별 기계검증 + 인쇄 규격·안전영역 게이트
<!-- harness:milestone id="TH3" status="completed" priority="P0" evidence="evidence/template-production-hardening/th3-studio.md, changesets/20260720-studio-token-driven-render/README.md, changesets/20260720-askewly-design-template-gallery/README.md, changesets/20260720-askewly-design-roundtrip-and-studio-retire/README.md" -->
### TH3 — AskewlyDesign 템플릿 편집 배선
- DoD: 토큰 세트 변경 시 렌더 computed style이 실제로 바뀜 + AskewlyDesign에서 청사진 6종 열어 편집 + 내보내기→재가져오기 왕복 무손실 + 편집 표면 단일화.
- Evidence: evidence/template-production-hardening/th3-studio.md, changesets/20260720-studio-token-driven-render/README.md, changesets/20260720-askewly-design-template-gallery/README.md, changesets/20260720-askewly-design-roundtrip-and-studio-retire/README.md
- Gap: TPS3 plan이 "semantic token 변경"을 선언했으나 App.tsx가 팔레트를 하드코딩하고 tokenSetId를 무시했다 (해소). 2026-07-20 사용자 지시로 편집 표면을 AskewlyDesign 단일로 개정, template-studio 은퇴.
- Scale: changesets>=3; surfaces: AskewlyDesign 렌더러·template-core; capability: 템플릿에서 시작해 편집하고 왕복하는 단일 편집기
- Status: [x]

- Completed at: 2026-07-20
<!-- harness:milestone id="TH7" status="completed" priority="P0" evidence="evidence/template-production-hardening/th7-render-fidelity.md, changesets/20260720-canvas-token-paint/README.md, changesets/20260720-canvas-image-typography/README.md, changesets/20260720-export-token-fidelity/README.md" -->
### TH7 — 캔버스 렌더 충실도
- DoD: 편집기와 내보낸 SVG/HTML 양쪽에서 템플릿이 토큰 색·글꼴·타이포·이미지를 갖고 나타나고, 토큰 세트 변경 시 셋 다 함께 바뀜 + 해석 실패는 진단으로 드러남.
- Evidence: evidence/template-production-hardening/th7-render-fidelity.md, changesets/20260720-canvas-token-paint/README.md, changesets/20260720-canvas-image-typography/README.md, changesets/20260720-export-token-fidelity/README.md
- Gap: 편집기가 템플릿을 회색 상자로 그린다 — 토큰 세트 우주가 둘이라 조용히 폴백, fill/color/fontFamily 미해석, 이미지 노드 미렌더 + 자산 URI 계약 공백 (TH3 적발)
- Scale: changesets>=3; surfaces: CanvasSurface·canvas-core 타입·exporters; capability: 디자인대로 보이는 템플릿
- Status: [x]

- Completed at: 2026-07-20
<!-- harness:milestone id="TH9" status="completed" priority="P0" evidence="evidence/template-production-hardening/th9-text-fitting.md, changesets/20260720-text-fitting-model/README.md, changesets/20260720-compiler-text-fitting/README.md, changesets/20260720-svg-multiline-and-overflow-gate/README.md" -->
### TH9 — 텍스트 맞춤
- DoD: 6청사진 × 2세트 산출물 12장에 캔버스를 넘치는 텍스트 0 + 넘침을 기계로 검출하는 게이트 + 한글·라틴 혼용 문자열에서 검증.
- Evidence: evidence/template-production-hardening/th9-text-fitting.md, changesets/20260720-text-fitting-model/README.md, changesets/20260720-compiler-text-fitting/README.md, changesets/20260720-svg-multiline-and-overflow-gate/README.md
- Gap: fontSize = bounds.height * 0.45가 글자 수·폭을 보지 않는다 — editorial headline(필요폭 1216 > 920), stats explanation(4404 > 1000)이 잘린다. 두 청사진 산출물은 인쇄 발주 불가 (TH7 적발)
- Scale: changesets>=2; surfaces: 컴파일러 타이포 결정·내보내기·검증; capability: 잘리지 않는 산출물
- Status: [x]

- Completed at: 2026-07-20
<!-- harness:milestone id="TH4" status="completed" priority="P0" evidence="evidence/template-production-hardening/th4-verification.md, changesets/20260720-export-artifact-parsing/README.md, changesets/20260720-export-input-derived-assertions/README.md, changesets/20260720-verify-manifest-materialization/README.md" -->
### TH4 — 검증 실체화
- DoD: exporter 실제 실행 + 18개 산출물 파싱 검사 + 훼손 3종 각각 exit≠0 + probe 무력화 시 전체 실패.
- Evidence: evidence/template-production-hardening/th4-verification.md
- Gap: verify 스크립트의 exports 목록이 하드코딩 문자열이고 negative probe가 없다 — 통과만 확인하는 검증
- Note: TH7 완료로 색 충실도 blocker 해소. TH9를 먼저 두는 이유 = 깨진 산출물을 게이트 기준선으로 굳히지 않기 위해서
- Scale: changesets>=2; surfaces: verify 스크립트·npm script; capability: 훼손을 실제로 잡는 게이트
- Status: [x]

- Completed at: 2026-07-20
- Summary: 산출물 18개 실제 실행·범용 파서 검사 + 입력 유래 단언(HTML 글꼴 이스케이프 결함 적발) + 매니페스트 실측화

<!-- harness:milestone id="TH5" status="completed" priority="P1" evidence="evidence/template-production-hardening/th5-imagegen.md, changesets/20260720-codex-imagegen-provider/README.md, changesets/20260720-codex-imagegen-live-proof/README.md, changesets/20260720-retire-openai-image-adapter/README.md" -->
### TH5 — Codex imagegen 소재 공급자
- DoD: codex exec 경유 공급자 계약 테스트 PASS + 라이브 실호출 1회 소재가 템플릿에 렌더 + 깨진 OpenAI 어댑터 제거.
- Evidence: evidence/template-production-hardening/th5-imagegen.md
- Gap: 현 OpenAI 어댑터의 응답 타입이 실제 API 구조와 달라 라이브에서 100% 실패한다 (사용자 확정: Codex imagegen으로 전환)
- Scale: changesets>=3; surfaces: 신규 공급자 패키지·codex exec 실호출·AskewlyDesign 렌더; capability: 동작하는 소재 생성 경로
- Status: [x]

- Completed at: 2026-07-20
- Summary: codex exec 공급자(PNG 헤더 정본·실제 치수·잘림 1/3 거부) + 라이브 1회 실증(spawn ENOENT 적발·stdin 전환) + 구 어댑터 제거

<!-- harness:milestone id="TH10" status="completed" priority="P1" evidence="evidence/template-production-hardening/th10-editor-defects.md, changesets/20260720-editor-state-persistence/README.md, changesets/20260720-token-set-parity/README.md, changesets/20260720-structured-input-rejection/README.md" -->
### TH10 — 편집기 결함 마감
- DoD: 템플릿을 열어 편집한 상태가 저장·재적재·뷰포트 변경을 건너 살아남고 + 토큰 세트 표시가 문서 상태와 일치하며 + 형태 깨진 입력이 구조화된 오류 코드로 거부된다.
- Evidence: evidence/template-production-hardening/th10-editor-defects.md
- Gap: AskewlyDesign이 유일 편집 표면이 됐는데 storageKey가 fixture에 고정, 뷰포트 토글이 열어둔 템플릿을 되돌림, 토큰 모드 드롭다운이 문서 상태 오보고 — 전부 "작업하다 잃는" 종류 (docs/findings.md B군 7건)
- Note: TH6 실사용 실연 전에 둔다 — 실연이 결함 재발견에 소모되지 않게
- Scale: changesets>=2; surfaces: App.tsx·PropertyInspector·validation; capability: 편집 상태가 살아남는 편집기
- Status: [x]

- Completed at: 2026-07-20
- Summary: 저장이 fixture를 직렬화하던 결함·크기 토글의 템플릿 파괴·드롭다운 오보고·TypeError 거부를 닫고 브라우저 실조작으로 관측 (사람 눈 게이트 대기)

<!-- harness:milestone id="TH11" status="active" priority="P1" -->
### TH11 — 인쇄 규격 mm 기반 재정의
- DoD: 도련·안전영역이 mm 기반으로 선언되고 + 명함·포스터에 발주 요건을 충족하는 규격 프리셋이 있으며 + 내보낸 산출물이 재단 표시·도련을 담고 + full-bleed 배치가 가능하다.
- Evidence: evidence/template-production-hardening/th11-print-spec.md
- Gap: SAFE_AREA_INSET=24가 px 고정값이고 도련 개념 자체가 없다. 포스터 캔버스 1080×1350은 소셜 비율. @page 여백 규약 없음 (docs/findings.md A군 5건)
- Note: 사용자 확정 2026-07-20 — 실제 인쇄 발주를 목표에 둔다. 기하 변경이라 TH6 실연 전에 끝내 서명 재기준선을 한 번만 낸다
- Scale: changesets>=2; surfaces: catalog·print-spec·blueprints·exporters; capability: 발주 가능한 산출물
- Status: [ ]

<!-- harness:milestone id="TH6" status="pending" priority="P1" -->
### TH6 — 실사용 실연 + horizon close
- DoD: 실제 의뢰 1건 전 루프(청사진→토큰→소재→편집→내보내기) 통과 + 사람 확인 게이트 + 닫는 기준 7항 선언/실측 대조.
- Evidence: evidence/template-production-hardening/th6-commission.md
- Gap: 경화가 실사용감으로 검증돼야 close (RC4·TPS5 교훈)
- Scale: changesets>=2; surfaces: 대화형 실연·산출물 형식 그대로 렌더; capability: 경화된 루프 실증
- Status: [ ]

## 유지보수 후보 (milestone 아님)

> 이월 finding 전수 장부는 `docs/findings.md` (2026-07-20 수집 — A~F 6군). 아래는 이 horizon 밖 항목만.

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2 dogfooding 결함 #2)
- 신뢰 프로젝트 소실 시 에러 표면 (QA2 dogfooding 결함 #3 — 현재 조용한 데모 폴백)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2 dogfooding 결함 #4)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (스크린리더 가상 커서 — 키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단("Authentication failed") — headless codex exec에서 토큰 fetch 불가 (AD1 E2E 적발, changeset #101)

## Archive Pointer

Completed or archived milestone history lives in `docs/BACKLOG.md`; template-production-system (TPS1–TPS5) closed 2026-07-19, recipe-code-reuse (RC1–RC4) closed 2026-07-19, skill-entry (SE1–SE2) closed 2026-07-18, design-brief (DB2) closed 2026-07-19, Quality & Dogfooding (QA2–QA3) closed 2026-07-12, Living Design System (RL–SD) closed 2026-07-12, Canvas Production Environment (UX3–AI) closed 2026-07-12, Agent-Native UI Canvas (AUC0–AUC4) closed 2026-07-11.
