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
| **TH4** | 검증 실체화 — exporter 실행 + negative probe | `plans/2026-07-20-th4-real-verification.md` | 승인 | 없음 (내부 실사) |
| **TH5** | Codex imagegen 소재 공급자 — 계약 재작성 + 실호출 실증 | `plans/2026-07-20-th5-codex-imagegen-provider.md` | 승인 | `research/2026-07-20-template-production-hardening-openai-image-api-contract.md` + 2026-07-20 실호출 실측 |
| **TH6** | 실사용 실연 + horizon close — 전 루프 1건 + 사람 게이트 | `plans/2026-07-20-th6-real-commission.md` | 승인 | 위 두 리서치 |

## 닫는 기준

각 기준은 close 시 `선언 / 실측 / 판정` 한 줄로 대조한다.

1. **가독성** — `packages/template-core`·`apps/template-studio`·`scripts/verify-*.mjs`에 300자 초과 라인이 0개다. 관측: lint 규칙 실행 결과 exit 0.
2. **불변** — 가독성 복구 전후로 세 기준 fixture의 `templateSignature`가 동일하다. 관측: 복구 전 서명을 파일로 고정해두고 복구 후 대조.
3. **청사진 실재성** — 6개 청사진 각각에 대해, 같은 포맷의 다른 청사진과 **슬롯 개수 또는 그리드 열 수가 다르다**. 관측: 기계 검증 테스트 PASS (좌표 차이만으로는 통과 불가).
4. **토큰 구동** — 스튜디오에서 semantic token 값을 바꾸면 캔버스 렌더 결과가 바뀐다. 관측: Playwright로 변경 전후 요소 computed style 대조.
5. **검증 실체성** — verify 스크립트가 exporter를 실제 실행해 산출물을 파싱 검사하고, fixture 훼손 3종에 대해 각각 exit≠0을 낸다. 관측: negative probe 3종 실행 로그.
6. **소재 경로** — Codex imagegen 실호출 1회로 생성한 이미지가 `AssetManifestEntry`로 편입돼 템플릿에 렌더된다. 관측: 실호출 로그 + 결과 이미지 + 스튜디오 스크린샷.
7. **실사용** — 실제 의뢰 1건이 청사진 선택→토큰→소재→편집→내보내기 전 루프를 통과하고 사람 확인 게이트를 받는다. 관측: `evidence/template-production-hardening/th6-commission.md`.

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
