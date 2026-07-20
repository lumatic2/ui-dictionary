# HORIZON — 템플릿 제작 시스템 경화

> 생성: 2026-07-20 · marker: `harness:goal id="template-production-hardening"` · 상태: active (승인 2026-07-20)
> 위계: Objective(`OBJECTIVE.md`) → **Horizon**(이 문서) → Milestone(`plans/2026-07-20-th*.md`) → Step.
> 진행 상태의 정본은 `ROADMAP.md` marker다. `template-production-system` close(2026-07-19) 직후 실사에서 드러난 갭으로 개설한다.

## 목표

- `template-production-system`이 세운 제작 파이프라인을 **선언 수준에서 실제 동작 수준으로** 끌어올린다.
- 세 축을 동시에 닫는다: ① 청사진이 진짜로 구별되는 구성일 것 ② 스튜디오가 토큰을 진짜로 소비할 것 ③ 검증이 진짜로 실행되고 실패할 것.
- 소재 생성 경로를 OpenAI HTTP 직결에서 **Codex 내장 `image_gen`** 으로 확정한다(키 불필요, 사용자 확정 2026-07-20).
- **무감독 분량: 승인 후 최소 3 무감독 세션.** 6 milestone, 예상 15 leaf.

## 왜 지금 (직전 horizon 이 드러낸 갭)

직전 horizon은 TPS1~TPS5를 1일에 완주했고 close 시 **디플레가 재적발**됐다. 그 속도의 대가가 close 직후 실사에서 드러났다:

1. **선언과 구현의 괴리** — `plans/2026-07-19-tps3-browser-template-studio.md` step-2는 산출물로 "semantic token 변경"을 명시했으나, 배포된 `apps/template-studio/src/App.tsx:8`은 팔레트를 하드코딩하고 `tokenSetId`를 렌더 경로에서 무시한다. **계획에 있었고 게이트를 통과했는데 구현이 없었다.**
2. **가짜 변주** — `packages/template-core/src/blueprints/registry.ts:38-44`의 `-split` 3종은 모든 슬롯에 `x+24`/`width-48`을 균일 적용한 clone이다. 카탈로그 숫자 6은 실질 3이다.
3. **선언 수준 검증** — `scripts/verify-template-production-system.mjs`는 컴파일·무결성은 실제로 돌리지만 `exports:['json','html','svg']`는 하드코딩 문자열이고 exporter를 호출하지 않는다. fixture 훼손 시 실패하는 negative probe가 없다.
4. **깨진 외부 계약** — `packages/template-image-provider-openai`의 응답 타입은 OpenAI 실제 응답과 구조가 다르다(실제는 `{data:[{b64_json}]}` 배열). 라이브 연결 시 100% 실패한다.
5. **압축된 코드** — TPS 산출물 전반이 한 줄 300~1,000자로 압축돼 있다(`App.tsx`는 18줄 중 한 줄이 JSX 1,000자 이상, verify 스크립트는 전체 2줄). 위 1~4를 손대려면 어차피 해제가 선행돼야 한다.

사용자 확정(2026-07-20): 6 milestone 풀스코프 · 코드 가독성 전면 복구 · 이미지 생성은 Codex imagegen 실호출 경로 · 설계 전 리서치 2건 선행. monetization 방향은 후보에서 제거.

## 담을 milestone — 설계 번들 인덱스

| milestone | 제목 (왜 milestone 규모인가) | plan doc | 승인 | 리서치 입력 |
|---|---|---|---|---|
| **TH1** | 코드 가독성 복구 + 회귀 방어망 — core/studio/스크립트 3표면 + 불변 증명 | `plans/2026-07-20-th1-code-legibility.md` | 승인 | 없음 (내부 실사) |
| **TH2** | 청사진 6종 실재화 — 타입 계약 변경 + 6청사진 + 규격 검증 | `plans/2026-07-20-th2-blueprint-archetypes.md` | 승인 | `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md` |
| **TH3** | 스튜디오 토큰 구동 + 실편집 — 토큰 배선·편집 UI·왕복 실측 | `plans/2026-07-20-th3-studio-real-editing.md` | 승인 | 위와 같음 (청사진 선택 UI) |
| **TH4** | 검증 실체화 — exporter 실행 + negative probe | `plans/2026-07-20-th4-verification-materialization.md` | 승인 | 없음 (내부 실사) |
| **TH7** | 캔버스 렌더 충실도 — 편집기·내보내기가 토큰 색·글꼴·이미지를 실제로 그린다 | `plans/2026-07-20-th7-canvas-render-fidelity.md` | 승인 | 없음 (TH3 적발) |
| **TH9** | 텍스트 맞춤 — 글자 크기가 폭·줄 수를 보고 정해진다 | `plans/2026-07-20-th9-text-fitting.md` | 승인 | 없음 (TH7 적발) |
| **TH5** | Codex imagegen 소재 공급자 — 계약 재작성 + 실호출 실증 | `plans/2026-07-20-th5-codex-imagegen-provider.md` | 승인 | `research/2026-07-20-template-production-hardening-openai-image-api-contract.md` + 2026-07-20 실호출 실측 |
| **TH10** | 편집기 결함 마감 — 템플릿을 열어 작업하다 잃는 결함 7건 | `plans/2026-07-20-th10-editor-defects.md` | 대기 | 없음 (TH3·TH7 적발) |
| **TH11** | 인쇄 규격 mm 기반 재정의 — 발주 가능한 도련·안전영역·규격 | `plans/2026-07-20-th11-print-spec-mm.md` | 대기 | `research/2026-07-20-template-production-hardening-print-spec.md` |
| **TH6** | 실사용 실연 + horizon close — 전 루프 1건 + 사람 게이트 | `plans/2026-07-20-th6-real-commission.md` | 승인 | 위 두 리서치 |

## 닫는 기준

각 기준은 close 시 `선언 / 실측 / 판정` 한 줄로 대조한다.

1. **가독성** — `packages/template-core`·`apps/template-studio`·`scripts/verify-*.mjs`에 300자 초과 라인이 0개다. 관측: lint 규칙 실행 결과 exit 0.
2. **불변** — 가독성 복구 전후로 세 기준 fixture의 `templateSignature`가 동일하다. 관측: 복구 전 서명을 파일로 고정해두고 복구 후 대조.
3. **청사진 실재성** — 6개 청사진 각각에 대해, 같은 포맷의 다른 청사진과 **슬롯 개수 또는 그리드 열 수가 다르다**. 관측: 기계 검증 테스트 PASS (좌표 차이만으로는 통과 불가).
4. **토큰 구동** — **AskewlyDesign**에서 토큰 세트·값을 바꾸면 캔버스 렌더 결과가 바뀐다. 관측: Playwright로 변경 전후 요소 computed style 대조. (2026-07-20 개정 — TH3에서 편집 표면이 template-studio에서 AskewlyDesign 단일로 바뀌었다.)
5. **검증 실체성** — verify 스크립트가 exporter를 실제 실행해 산출물을 파싱 검사하고, fixture 훼손 3종에 대해 각각 exit≠0을 낸다. 관측: negative probe 3종 실행 로그.
6. **소재 경로** — Codex imagegen 실호출 1회로 생성한 이미지가 `AssetManifestEntry`로 편입돼 템플릿에 렌더된다. 관측: 실호출 로그 + 결과 이미지 + 스튜디오 스크린샷.
7. **실사용** — 실제 의뢰 1건이 청사진 선택→토큰→소재→편집→내보내기 전 루프를 통과하고 사람 확인 게이트를 받는다. 관측: `evidence/template-production-hardening/th6-commission.md`.
8. **편집 지속성** — 템플릿을 열어 편집한 상태가 저장·재적재·뷰포트 변경을 건너 살아남는다. 관측: TH10 실측. (2026-07-20 추가 — 사용자 확정)
9. **발주 가능성** — 명함·포스터 규격이 도련·안전영역을 mm 기반으로 선언하고, 내보낸 산출물이 인쇄 발주 요건을 충족한다. 관측: TH11 실측. (2026-07-20 추가 — 사용자 확정)

## 미리 쓰는 실패 회고

이 horizon이 끝났는데 실패했다. 왜 실패했나?

1. **가독성 복구가 동작을 조용히 바꿨다.** 포맷 해제 중 연산자 우선순위나 조건식이 미묘하게 달라져 이후 5개 milestone이 전부 오염된 기반 위에 쌓였다.
   → 예방: TH1 DoD에 **복구 전 서명 고정 → 복구 후 대조**를 못박는다. 서명 불일치 시 TH1은 미완료다.
2. **청사진 B안이 또 좌표 변형으로 퇴화했다.** "구별되게 만들라"는 지시를 받고도 결국 슬롯을 옮기고 크기만 바꿔 6종을 채웠다.
   → 예방: 닫는 기준 3을 **기계 검증**으로 만든다 — 슬롯 개수 또는 그리드 열 수 차이를 테스트가 요구하므로 좌표 변형은 통과 자체가 불가능하다.
3. **스튜디오가 토큰을 읽는 척만 했다.** TPS3와 똑같이, 토큰 편집 UI는 붙었는데 렌더는 여전히 하드코딩 값을 쓴다.
   → 예방: 닫는 기준 4를 UI 존재가 아니라 **값 변경 시 computed style이 실제로 바뀌는지**로 정의한다. 이 실패는 이미 한 번 일어났으므로 예방 장치를 가장 강하게 건다.
4. **imagegen 비결정성이 E2E를 흔들었다.** 매 실행마다 다른 이미지가 나와 결정성 fixture가 깨지고, 재현 불가능한 실패가 반복됐다.
   → 예방: 파이프라인 검증은 **커밋된 고정 이미지 fixture**로만 돌린다. 라이브 호출은 TH5의 계약 검증 1회로 격리하고 E2E 경로에서 분리한다.
5. **verify가 또 선언으로 퇴화했다.** exporter를 부르긴 하는데 산출물을 검사하지 않아, 빈 문자열을 내보내도 통과한다.
   → 예방: negative probe 자체를 게이트로 만든다 — **fixture를 일부러 훼손했을 때 exit≠0이 나오는지**를 확인해야 TH4가 완료된다. 통과만 확인하는 검증은 미완료로 본다.
6. **분량을 채우려 라벨만 부풀렸다.** 6개 milestone이 실은 각각 1 changeset짜리 step이었고 또 1일에 끝났다.
   → 예방: 각 milestone의 `Scale` 선언에 changesets>=2를 요구하고, close 시 §A1 크기 회고로 실제 changeset 수를 대조한다.

## Objective 임팩트 (close 시 기록)

- 이 horizon은 Objective의 "시각적 영감에서 → 구현 가능한 코드·에셋·에이전트 가이드로" 축을 민다. close 시 실제로 움직인 지점과 실측을 기록한다.

## 링크

- 위(Objective): `OBJECTIVE.md`
- 직전 horizon(경화 대상): `plans/horizons/2026-07-template-production-system.md`
- 리서치: `research/2026-07-20-template-production-hardening-format-layout-taxonomy.md`, `research/2026-07-20-template-production-hardening-openai-image-api-contract.md`
- 아래: `plans/2026-07-20-th1-code-legibility.md` ~ `plans/2026-07-20-th6-real-commission.md`

## 개정 이력

- **2026-07-20** — milestone 표에 TH7·TH9 등재(개설 후 추가된 milestone이 표에 없었다). TH4 계획 경로를 실제 실행된 문서로 정정.
- **2026-07-20** — 사용자 결정으로 TH10(편집기 결함)·TH11(인쇄 규격)을 추가하고 닫는 기준을 7항 → 9항으로 확장. 순서: TH5 → TH10 → TH11 → TH6.

## Close audit (2026-07-20) — 판정: **close 보류**

계획(TH6 step-2)이 못박은 규칙: "기준 하나라도 미달이면 close 판정을 내리지 않는다 —
선언만으로 닫는 것이 이 horizon이 고치려던 병리다."

9개 기준 중 **8개 충족, 1개 미달**(기준 7 실사용 — 편집기 축). 그래서 닫지 않는다.
미달을 통과로 적지 않으며, 그 항목은 다음 horizon(편집기 UI 재설계)의 개설 근거가 된다.
close 여부는 사용자 결정이다.

### 닫는 기준 대조 (선언 / 실측 / 판정)

| # | 기준 | 실측 | 판정 |
|---|---|---|---|
| 1 | 가독성 300자 초과 0 | `check:lines` exit 0 | PASS |
| 2 | 복구 전후 서명 동일 | `signature-lock` 6 PASS, 재기준선 4건 전부 근거 기록 | PASS |
| 3 | 청사진 실재성 | `blueprint-distinctness` 11 PASS — 좌표 변형 clone은 통과 불가(테스트가 직접 재현해 확인) | PASS |
| 4 | 토큰 구동 | TH7 computed style 대조 — 캔버스 `#f7f2e8`↔`#1c2320`, 강조 `#2f7d4f`↔`#7fd4a0` | PASS |
| 5 | 검증 실체성 | negative probe **5종** 전부 exit≠0 (선언 3종보다 많다) | PASS |
| 6 | 소재 경로 | Codex 실호출 2회(TH5 1000×800, TH6 504×396/302.9s)가 매니페스트로 편입돼 렌더 | PASS |
| 7 | 실사용 | 전 루프 9단계 통과. **사람 게이트: 인쇄 산출물 통과 / 편집기 판단 불가** | **부분 미달** |
| 8 | 편집 지속성 | TH10 자동 검증 98 PASS + 브라우저 실조작. 단 사람이 화면을 읽지 못해 육안 확인 미성립 | 조건부 |
| 9 | 발주 가능성 | mm 계약·A계열 프리셋·도련·재단 표시 8선. TH12로 소재까지 문서에 실려 한 파일로 완결 | PASS |

기준 7이 미달인 이유는 편집기 구현이 아니라 **편집기 UI가 판단 가능한 물건이 아니라는 것**이다.
사용자 판정(2026-07-20): "뭐가 뭔지 눈으로 판단이 안 간다. Figma만큼이라도 UI 업그레이드가 필요."
자동 검증이 통과해도 사람이 화면을 읽지 못하면 실사용감은 미확인이다.

### 크기 회고

| milestone | changeset 수 | 선언 | 판정 |
|---|---|---|---|
| TH1·TH2·TH3·TH4·TH5·TH7·TH9·TH10·TH11 | 각 3 | >=2 | 적정 |
| TH12 | 2 | >=2 | 적정 |
| TH6 | 1(+close) | >=2 | **인플레 아님** — 실연은 코드 변경이 없는 관측이므로 changeset 수로 재지 않는다. 다만 다음에 같은 성격의 일은 milestone이 아니라 close 절차의 일부로 잡는다 |

milestone 11개 / changeset 32개. **직전 horizon의 "1 changeset짜리 milestone" 인플레는 재발하지 않았다**(프리모템 6 예방 성공).

### 분량 회고 (디플레 점검)

선언: **최소 3 무감독 세션**, 6 milestone / 15 leaf 예상.
실측: milestone **11개**(TH1~TH12, TH8 제외), leaf **32개**, changeset 32개.
판정: 선언보다 **크게** 나왔다 — 디플레 없음. 도중에 TH7·TH9·TH10·TH11·TH12가 발견으로 추가됐고, 그 다섯은 전부 **앞 milestone의 검증이 잡아낸 결함**에서 나왔다. 계획이 작았던 게 아니라 검증이 일을 찾아냈다.

### 프리모템 대조

| # | 예측한 실패 | 실제 |
|---|---|---|
| 1 | 가독성 복구가 동작을 조용히 바꾼다 | 일어나지 않음 — 서명 고정이 막았다 |
| 2 | 청사진이 좌표 변형으로 퇴화 | 일어나지 않음 — 기계 검증이 통과 자체를 막았다 |
| 3 | 스튜디오가 토큰을 읽는 척만 한다 | **일어났다** — TH7이 적발(하드코딩 팔레트). 예방 장치가 아니라 **후속 milestone**이 잡았다 |
| 4 | imagegen 비결정성이 E2E를 흔든다 | 일어나지 않음 — 고정 fixture 분리가 유효했다 |
| 5 | verify가 선언으로 퇴화 | **일어났다** — TH4가 적발. 그리고 TH9·TH11·TH12에서 **게이트 자체의 동어반복**이 3번 더 나왔다 |
| 6 | 라벨만 부풀린 milestone | 일어나지 않음 — 32 changeset |

프리모템이 못 본 실패 유형: **게이트가 자기 출력만 보는 동어반복**과 **사람이 읽을 수 없는 UI**. 둘 다 "통과했는데 틀린" 종류다.

### Objective 임팩트

"시각적 영감 → 구현 가능한 코드·에셋" 축이 실제로 움직였다: 명함 의뢰 1건이 사람 손을 거의 타지 않고 **인쇄 발주 가능한 SVG 한 장**으로 나왔다. 반대로 "사람이 조작하는 편집 표면"은 아직 Objective를 뒷받침하지 못한다.

### 다음 horizon으로 넘기는 것

- 편집기 UI 재설계 (사용자 확정 2026-07-20 — 캔버스 조작감 + 화면 읽힘 **둘 다**).
- 소재 생성 302.9초 · 진행 표시·취소 부재.
- data URI로 문서가 커진다(JSON 848KB) — 리사이즈·압축.
- PDF 변환·300dpi 래스터화·CMYK.
- TH8(hallmark 흡수)은 리서치 재수집이 선행 조건인 채로 미등록.
