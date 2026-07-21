# changeset: 토큰 세트 표시·검증 정합

- Date: 2026-07-20
- Plan: TH10 step 2 (`plans/2026-07-20-th10-editor-defects.md`)

드롭다운이 문서 상태를 잘못 보고하던 것과, 없는 세트를 조용히 받아들이던 것을 함께 고쳤다.

## 착수 전에 장부가 틀린 걸 발견했다

`docs/findings.md`는 "`validateTokenMode`가 편집기 세트 2개만 허용해 템플릿 세트로 전환 불가"라고 적었다. **직접 돌려보니 틀렸다** — `validateTokenMode`는 `/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/` **모양만** 본다. `askewly.warm`도 `foo.bar`도 통과한다.

기록을 믿고 계획을 세웠으면 틀린 문제를 풀 뻔했다. 장부도 정정했다.

## 진짜 결함 둘

**① 표시** — 드롭다운 옵션이 `askewly.default`/`askewly.dark` 두 개로 하드코딩돼 있었다. 문서가 `askewly.warm`이면 그 값이 옵션에 없어 브라우저가 첫 항목을 선택한 것처럼 보여준다. **화면이 문서 상태를 잘못 보고한다.**

**② 검증** — 모양만 보므로 실재하지 않는 세트를 받아들인다. 그러면 `documentTokens`가 `unknown`으로 떨어져 모든 바인딩이 미해석되는데, 그 진입 자체를 아무도 막지 않았다.

## 무엇을 바꿨나

- **`listDocumentTokenSets()`** — 편집기 세트(`editorTokenMaps`)와 템플릿 세트(`listTokenSets()`)를 합쳐 **실재하는 목록**을 만든다. UI가 옵션을 손으로 적지 않는다.
- **`isKnownTokenSet()`** — 모양이 아니라 **실재**를 묻는다. 모양 검사는 하한선으로 남긴다(canvas-core는 템플릿 세트를 알 수 없다).
- **알 수 없는 세트도 숨기지 않는다** — 문서가 목록 밖 세트를 들고 있으면 `<id> (알 수 없음)` 옵션으로 표시한다. 조용히 다른 값처럼 보이는 것보다 낫다.
- **비활성 select 스타일** — step-1에서 fixture 크기 토글에 `disabled`를 붙였는데 스타일이 없어 브라우저 기본에 노출돼 있었다. 편집기 토큰으로 상태를 명시했다.

## 디자인 판정 (askewly-design)

`ui.askewly.com/llms.txt` → entry-protocol fetch. 과제 유형 **B(기존 UI 개선)** — anti-patterns 진단 + 토큰 파생.

- **Token Derivation** — 새 CSS는 `--ad-surface-muted`·`--ad-text-muted`·`--ad-gray-9`에서 파생. 리터럴 없음. PASS
- **Complete States** — `:disabled`가 없어 브라우저 기본에 노출돼 있었다(anti-pattern "Crude CSS: exposed browser defaults"). **이번에 채웠다.**
- **Status Signals via Text + Visual** — 거부는 색이 아니라 문구(`토큰 세트 'x'가 없습니다.`)로 알린다. PASS
- **Empty/Error States by Root Cause** — "모양이 틀림"과 "실재하지 않음"을 한 메시지로 뭉개지 않는다. PASS
- 편집기는 자체 토큰(`--ad-*`)을 가지므로 askewly 팔레트를 주입하지 않았다.

**사람 눈 확인은 아직이다** — TH10 step-3 뒤 브라우저 실조작으로 함께 받는다.

## Verification

- [x] `npm --prefix apps/agent-design test` — **98 PASS** (93 + 신규 5)
- [x] `npm --prefix apps/agent-design run build` — vite exit 0

### Failure probe

옵션을 다시 하드코딩 2개로 되돌리고 검증을 모양 검사만으로 되돌렸다.

```
→ expected 'askewly.default' to be 'askewly.warm'
→ expected [ 'askewly.default', 'askewly.dark' ] to include 'askewly.warm'
Tests  2 failed | 96 passed (98)
```

첫 줄이 결함 그 자체다 — `askewly.warm` 템플릿을 열었는데 화면은 `askewly.default`라고 말한다.

## finding 큐

- `set-token-mode` 연산 계층(canvas-core)은 여전히 모양 검사만 한다. canvas-core가 템플릿 세트를 알 수 없기 때문인데, 그래서 **앱을 우회한 연산은 없는 세트를 통과시킬 수 있다**. 세트 레지스트리를 주입 가능하게 만드는 것이 근본 해법.
- 세트를 편집기용/템플릿용으로 섞어 한 목록에 놓았다. 편집기 문서에 템플릿 세트를 붙이면 chrome 어휘가 미해석된다 — 지금은 진단으로만 드러난다.
