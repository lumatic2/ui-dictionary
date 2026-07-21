# 최종 보고서 — VL3 참조 복구 + 역방향 매핑

> 완료: 2026-07-21 · 대상: VL3 (horizon `vocabulary-in-use`) · 작성: 완료 경계(§B3)

## 1. 문제 정의

VL1이 두 가지를 계수했다. 배포된 계약 안에 해소 불가능한 `term_refs`가 91곳 있었고, 용어 562개 중 레시피가 가리키는 것은 81개(14.4%)뿐이라 **481개는 구현 자산이 없었다**.

앞의 것은 계약이 거짓말을 하는 문제고, 뒤의 것은 더 근본적이다 — 판정이 정확해져도 그 481개 중 하나를 고르면 만들 근거가 없다. "combobox를 쓰세요"에서 멈추거나 감으로 그린다.

## 2. Objective 연결

북극성은 에이전트가 의도적으로 디자인된 UI를 *만들게* 하는 것이다. VL2가 "무엇을 고를 수 있는가"를 열었다면 VL3은 **"고른 것을 무엇으로 만드는가"**를 답했다. 판정과 구현 사이의 마지막 끊김을 이었다.

## 3. 경로

horizon의 세 번째 milestone, step 3개. 계획과 실제가 한 군데 달랐다 — step-2(끊긴 참조 해소)는 **VL2 배포가 이미 끝내놓은 상태였다**. VL1이 "사유가 전부 미배포"라고 계수한 그대로다. 그래서 step-2는 참조를 고치는 일이 아니라 다시 깨지지 않게 잠그는 일이 됐다.

## 4. 구현 결과

**용어별로 "무엇으로 만들 수 있나"에 답하는 매핑이 생겼다.** `term-asset-map.json`은 562개 전부에 대해 레시피·코드 자산 목록을 갖는다. 손으로 관리하는 목록이 아니라 세 원본에서 생성한 파생물이라 드리프트하지 않는다.

**무결성이 잠겼다.** `audit-vocabulary-reach.mjs --strict`가 끊긴 참조·샤드 누락·매핑 불일치 중 하나라도 걸리면 exit 1로 막는다. 규칙을 두 곳에 적으면 갈라지므로 각 생성기의 `--check`를 호출한다.

**자산 없는 481개에 구현 경로가 생겼다.** 핵심 주장은 하나다 — *자산이 없다는 것은 재료가 없다는 뜻이 아니다.* 용어 항목 자체가 재료다: `visual_anatomy`는 부위 체크리스트, `anti_use`는 넘지 말 선, `related`는 이웃과의 차이, 같은 그룹 인접 레시피는 구조 참고.

그 경로를 말로만 두지 않고 실제로 밟아 `combobox`를 만들었다. 부위 4/4를 갖췄고, `anti_use` 2개를 하나도 범하지 않았으며(목록 밖 문자열은 값이 될 수 없다), select·dropdown-menu와 무엇이 다른지 코드 주석에 남겼다.

## 5. 이슈와 해결

**계획한 일의 절반이 이미 끝나 있었다.** step-2의 목표 "끊긴 참조 91→0"이 VL2 배포로 달성된 상태였다. 이건 문제가 아니라 VL1 계측이 옳았다는 확인이다 — 끊긴 원인이 "이름이 틀렸다"가 아니라 "배포가 안 됐다"였으므로 배포가 곧 수리였다. 남는 위험은 *다시 깨지는 것*이라 판단해 step-2를 게이트 설치로 재해석했다.

**폴백 규약이 순환할 위험이 있었다.** 자산이 *없는* 상황의 경로인데 절차 어느 단계가 "레시피를 만들어라"로 흐르면 폴백이 아니라 순환이다. 4단계(구조 참고)에 "없으면 없는 대로 간다"를 명시했고, combobox 구현이 실제로 그 경로를 밟았다(`input-pickers` 그룹에 레시피 없음).

**near-miss는 없었다.** VL2에서 잡았던 배포 파이프라인 결함이 이미 고쳐진 뒤라 이번 milestone은 조용히 갔다.

## 6. 결과물과 증거

changeset 228(3자 매핑) · 229(무결성 게이트) · 230(폴백 규약 + combobox).

산출: `scripts/generate-term-asset-map.mjs`, `docs/ui-vocabulary/term-asset-map.json`, `docs/design-system/no-asset-fallback.md`, `examples/ui-vocabulary-site/src/components/fallback/combobox.tsx`, `audit-vocabulary-reach.mjs --strict`.

검증 관측:
- `node scripts/generate-term-asset-map.mjs` → 용어 562 · 레시피 45 · 코드 자산 27 · 레시피 있는 용어 81(14.4%) · 코드 자산까지 52 · **아무것도 없는 용어 481**
- 양방향 일치: 레시피→용어와 용어→레시피 집합이 완전히 같음(불일치 0)
- `node scripts/audit-vocabulary-reach.mjs --strict` → `무결성 PASS` exit 0
- probe(죽은 참조): 없는 용어를 `term_refs`에 주입 → exit 1, 파일·이름 지목
- probe(게이트): group 없는 용어 주입 → exit 1, 실패 사유 2건 각각 지목
- probe(순환): 폴백 4단계가 없는 레시피를 요구하지 않음 — combobox가 인접 레시피 없이 완주
- combobox: 부위 4/4, `anti_use` 2/2 미위반, `npx tsc --noEmit` exit 0

크기 회고: changeset 3개로 닫혔다. 선언은 `changesets>=3`이므로 **정합**.

- 실표면: 배포 인덱스에 `no-asset-fallback.md`와 `term-asset-map.json`을 등재하고 재생성해 `--strict` 무결성 PASS를 관측했다. 라이브 URL 확인은 push 후로 미뤄져 있다.
- 재현: `node scripts/generate-term-asset-map.mjs && node scripts/audit-vocabulary-reach.mjs --strict`

## 7. 후속 제안

- **자산 없는 481개를 줄이는 일은 별건이다.** 이 horizon은 경로 확보까지였다. 어느 용어부터 정식 레시피로 만들지는 `term-asset-map.json`과 실제 사용 빈도가 정해야 한다.
- **폴백 산출물의 승격 규칙**이 아직 없다. `no-asset-fallback.md`는 "반복해서 쓸 만하면 승격을 제안하라"고만 적었다 — 판정 기준은 비어 있다.
- VL4로 이어진다: 판별 데이터 계약.
