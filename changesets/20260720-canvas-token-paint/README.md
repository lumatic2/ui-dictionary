# changeset: 캔버스 토큰 채색

- Date: 2026-07-20
- Plan: TH7 step 1 (`plans/2026-07-20-th7-canvas-render-fidelity.md`)

편집기가 템플릿을 **디자인 색으로** 그린다. 회색 상자가 사라졌다.

## 왜 회색이었나

토큰 어휘가 둘인데 편집기가 하나만 알았다.

- **편집기 문서**: `surface.base`·`text.default`·`action.primary` (chrome 어휘, `editorTokens.ts`)
- **템플릿 문서**: `surface.canvas`·`text.primary`·`brand.primary`·`type.heading` (디자인 어휘, `template-core/tokens.ts`)

`resolveNodeBackground`는 `editorTokenMaps[tokenSetId] ?? editorTokenMaps['askewly.default']`로 폴백한 뒤 `map[tokenName] ?? map['surface.muted']`로 또 폴백했다. 템플릿 이름은 어느 것도 맞지 않으니 **모든 노드가 `surface.muted` 한 색**이 됐다. 폴백이 두 겹이라 실패가 화면에 드러날 길이 없었다.

## 무엇을 바꿨나

- **`documentTokens.ts` 신설** — 문서의 `tokenSetId`로 **출처를 가른다**(`template` / `editor` / `unknown`). 별칭 테이블로 두 어휘를 잇지 않는다 — 템플릿을 편집기 chrome 색으로 칠하면 디자인이 아니라 편집기가 보인다.
- **`nodeStyle` 재작성** — 규칙 하나로 정리했다: **바인딩이 있으면 그 바인딩만이 값을 정한다. 안 풀리면 칠하지 않는다.** 도형 `fill`, 텍스트 `color`·`fontFamily`, 프레임 `background`, 그리고 `textStyle`(크기·굵기·행간)까지 반영한다.
- **미해결 표시** — 안 풀린 바인딩이 있는 노드에 `data-token-unresolved`를 달고 빗금으로 표시한다.
- **line-length 가드 수리** — 감시 대상에 은퇴한 `apps/template-studio/src`가 남아 있어 스크립트가 `ENOENT`로 죽었다. 대상을 갱신하고, **대상이 사라지면 조용히 건너뛰지 않고 실패**하도록 고쳤다.

## Verification

- [x] `npm --prefix apps/agent-design test` — **90 PASS** (기존 83 + 신규 7), 기존 테스트 무회귀
- [x] `npm --prefix apps/agent-design run build` — PASS
- [x] `node scripts/check-line-length.mjs` — PASS

### 실브라우저 채색 실측 (inline style)

| 대상 | askewly.warm | askewly.ink |
|---|---|---|
| 캔버스 배경 | `rgb(247, 242, 232)` | `rgb(28, 35, 32)` |
| accent 도형 | `rgb(47, 125, 79)` | `rgb(127, 212, 160)` |
| 이름 색 | `rgb(43, 36, 27)` | `rgb(244, 239, 228)` |
| 이름 글꼴 | `Georgia, "Noto Serif KR", serif` | 동일 |
| 이름 크기/굵기 | 41px / 700 | 동일 |

증거: `evidence/template-production-hardening/th7/token-paint-warm.png`, `token-paint-ink.png`.

### Failure probe — 안 풀리는 토큰을 그럴듯한 색으로 덮는가

템플릿 문서를 편집기 토큰 모드(`askewly.dark`)로 강제 전환했다. 템플릿 어휘가 그 세트에 없으므로 전부 미해결이어야 한다.

```
canvasInline : (none)     ← 인라인 채색 없음
accentInline : (none)
nameInline   : (none)
unresolved   : 3 노드
```

**이 probe는 두 번 실패한 뒤에야 통과했다.**

1. 1차: accent가 `rgb(0,0,0)`으로 칠해졌다 — 토큰이 안 풀리자 `node.fill`의 `#000000` 리터럴로 폴백했다.
2. 2차: accent가 `oklch(0.35 0.03 270)`, 이름이 흰색으로 칠해졌다 — 도형이 `fill` 실패 후 `background` 경로로, 텍스트가 `color` 실패 후 `text.default`로 **흘러내렸다**.
3. 3차: "바인딩이 있으면 그 바인딩만이 값을 정한다"로 규칙을 단일화하자 통과.

세 번 다 "화면은 그럴듯한데 값은 틀린" 상태였다. probe를 안 돌렸으면 세 번 다 완료로 보고했을 것이다.

## finding 큐

- **token mode 드롭다운이 문서 상태를 잘못 보고한다.** 문서가 `askewly.warm`인데 옵션에 없어서 브라우저가 첫 항목(`askewly.default`)을 표시한다. 사용자는 자기 문서의 토큰 세트를 잘못 읽게 된다. `canvas-core`의 `validateTokenMode`도 두 값만 허용해 템플릿 세트로는 전환이 불가능하다.
- **TH3 step-3의 "check-line-length PASS" 기록은 그 시점엔 참이었으나 커밋 시점엔 이미 깨져 있었다.** 스튜디오 은퇴와 가드 대상 갱신이 한 커밋에 묶이지 않았다 — 검증 실행과 커밋 사이에 상태가 바뀐 사례.
- 이미지 노드·자산 URI는 step-2 소관. 현재도 빈 상자다.
