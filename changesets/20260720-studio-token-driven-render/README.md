# changeset: 스튜디오 토큰 구동 렌더링

- Date: 2026-07-20
- Plan: TH3 step 1 (`plans/2026-07-20-th3-studio-real-editing.md`)

TPS3가 "semantic token 변경"을 선언해놓고 구현하지 않은 지점을 실제로 배선했다. `tokenSetId`는 이제 조회되는 값이고, 조회 실패는 조용한 폴백 대신 진단으로 드러난다.

## 무엇이 문제였나

`tokenSetId`는 request에 실려 다니기만 하고 **아무것도 조회하지 않는 죽은 문자열**이었다. 조회 대상 자체가 레포에 없었다. 스튜디오는 `App.tsx`에 팔레트를 하드코딩해두고 이 값을 무시했고, fixture는 `warm.craft`라는 존재하지 않는 id를 들고 있었다. 어느 쪽도 아무 신호를 내지 않아 세 milestone 동안 결함이 보이지 않았다.

## 무엇을 바꿨나

- **`tokens.ts` 신설** — 토큰 세트가 색·타이포의 정본이 됐다. `askewly.warm`, `askewly.ink` 2종을 등록해 전환이 관측 가능하다.
- **`resolveProjectTokens()`** — 장면의 모든 `tokenBindings`를 값으로 해석하고, 실패한 binding은 **키를 만들지 않는다**. 폴백 값을 넣으면 진단이 무의미해진다.
- **`App.tsx` 팔레트 삭제** — 렌더러에 색 리터럴 0. 토큰 세트 선택기를 툴바에 추가했다.
- **진단 패널** — 실패 시 원인 코드와 대상 노드를 글로 밝힌다. 해석 안 된 캔버스·노드는 그럴듯한 색 대신 빗금 표면으로 남는다.
- **fixture 정정** — `warm.craft` → `askewly.warm`.

### 적발: fontFamily 바인딩은 통째로 버려지고 있었다

청사진은 `type.heading`·`type.display`를 바인딩하는데, 하드코딩 팔레트에는 색 5개뿐이라 **타이포 바인딩이 전부 조용히 무시됐다**. 이제 명함의 `name`이 실제로 `Georgia, "Noto Serif KR", serif`로 렌더된다(브라우저 computed style 확인).

## Verification

- [x] `npm --prefix packages/template-core test` — **53 tests PASS** (기존 41 + 신규 12)
- [x] `npm --prefix packages/template-core run build` — tsc PASS
- [x] `npm --prefix apps/template-studio test` — 3 PASS · `run build` PASS
- [x] `node scripts/check-line-length.mjs` — PASS
- [x] `App.tsx` 색 리터럴 grep — **0건**
- [x] 브라우저 console error 0

### 토큰 전환이 실제로 렌더를 바꾸는가 (Playwright computed style)

| 대상 | askewly.warm | askewly.ink |
|---|---|---|
| 캔버스 배경 | `rgb(247, 242, 232)` | `rgb(28, 35, 32)` |
| `name` 색 | `rgb(43, 36, 27)` | `rgb(244, 239, 228)` |
| `role` 색 | `rgb(104, 93, 80)` | `rgb(195, 188, 174)` |
| `accent` 채움 | `rgb(47, 125, 79)` | `rgb(127, 212, 160)` |

서명도 함께 바뀐다 — 토큰 세트는 request의 일부이므로 `tpl-4261b9bf` → `tpl-29f6c5e9`. 증거: `evidence/template-production-hardening/th3/token-warm.png`, `token-ink.png`.

### Failure probe — 없는 토큰 세트가 조용히 넘어가는가

fixture의 `tokenSetId`를 존재하지 않는 `warm.craft`로 되돌려 관측했다.

```
diagnosticShown : true
heading         : "토큰 조회 실패 1건"
firstIssue      : "TOKEN_SET_NOT_FOUND 토큰 세트 'warm.craft'가 없습니다.
                   등록된 세트: askewly.warm, askewly.ink"
canvasClass     : "canvas canvas--unresolved"   (빗금 표면)
nameInlineColor : (none)                         ← 폴백 색을 주입하지 않았다
```

증거: `evidence/template-production-hardening/th3/token-diagnostic-probe.png`. 되돌린 뒤 진단 0건 / 미해결 노드 0개 확인.

단위 진단도 4종을 테스트로 고정했다 — `TOKEN_SET_NOT_FOUND`, `TOKEN_NOT_DEFINED`(노드 지목), `TOKEN_KIND_MISMATCH`(색 토큰을 fontFamily 자리에), override가 미정의 토큰을 만들어내지 않음.

### 커버리지 가드

`등록된 모든 세트가 청사진 6종의 binding을 빠짐없이 갖는다` 테스트가 2×6 조합을 컴파일해 issue 0을 요구한다. 세트를 새로 추가하며 토큰 하나를 빠뜨리면 화면이 아니라 여기서 먼저 터진다.

## finding 큐

- `style.css`는 여전히 minified 1줄이다(TH1은 `.ts`/`.tsx`만 대상). 진단 패널 규칙만 가독형으로 추가해 혼재 상태다.
- 토큰 값 **개별 편집**은 step-2 소관 — 지금은 세트 전환만 가능하다. `resolveProjectTokens(project, overrides)`의 override 경로는 이미 계약·테스트가 있고 UI만 없다.
- 다크 세트(`askewly.ink`)는 캔버스 콘텐츠용이고 스튜디오 chrome 자체의 다크모드는 아직 없다.
