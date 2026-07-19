# TH1 — 코드 가독성 복구 + 회귀 방어망 (증거)

- 완료: 2026-07-20
- Plan: `plans/2026-07-20-th1-code-legibility.md`
- Changesets: `20260720-template-core-legibility`, `20260720-template-studio-script-legibility`, `20260720-template-line-length-guard`

## DoD 대조

| DoD 항목 | 선언 | 실측 | 판정 |
|---|---|---|---|
| 300자 초과 라인 0개 | template 제작 스택 3표면 | `node scripts/check-line-length.mjs` → `PASS (300자 초과 라인 없음)`, exit 0 | PASS |
| 서명 불변 | 해제 전후 세 fixture `templateSignature` 동일 | `tpl-a5add834` / `tpl-e523954b` / `tpl-f864dd3b` — 기준선과 일치, manifest는 `git stash` 전후 `diff` 무출력(바이트 동일) | PASS |
| 재발 차단 lint | 단일 커맨드 실행 | `node scripts/check-line-length.mjs` (의존성 0, Node만) | PASS |

## 해제 전후 (300자 초과 라인 수)

| 파일 | 전 | 최장 라인(전) | 후 |
|---|---|---|---|
| `apps/template-studio/src/App.tsx` | 3 | 2,303자 | 0 |
| `scripts/verify-template-production-system.mjs` | 1 | 1,393자 | 0 |
| `packages/template-core/src/catalog.test.ts` | 1 | 819자 | 0 |
| `apps/template-studio/src/exporters.ts` | 2 | 658자 | 0 |
| `packages/template-core/src/fixtures.ts` | 2 | 389자 | 0 |
| `packages/template-core/src/assets/provider.ts` | 1 | 365자 | 0 |
| `packages/template-core/src/compiler.ts` | 2 | 317자 | 0 |
| `packages/template-core/src/catalog.ts` | 1 | 316자 | 0 |
| **합계** | **13** | | **0** |

## 실패 경로 확인 (optimistic-path 금지)

세 방어망 각각이 **실제로 실패하는지** 확인했다. 통과만 본 항목은 없다.

1. **서명 대조** — `signatures.json`의 `tpl-a5add834`를 `tpl-a5add835`로 1글자 훼손 → 1 failed / 13 passed. 되돌린 뒤 14 passed.
2. **줄 길이 가드** — `App.tsx`에 403자 라인 주입 → `FAIL — 300자를 넘는 라인 1개 / App.tsx:244 (403자)`, exit 1. 되돌린 뒤 exit 0.
3. **브라우저 렌더** — 빌드 통과만으로는 JSX 구조 파손을 못 잡으므로 실제 dev 서버(:5199)를 띄워 세 형식 렌더를 관측했다.

## 실제 표면 구동 (E2E)

dev 서버 + Playwright MCP로 실제 브라우저 구동. 세 형식 전환·렌더 관측, 콘솔 에러는 `favicon.ico` 404 1건뿐.

- `th1/th1-business-card.png` — 명함: accent rail·이름·직함·연락처·인물 이미지 정상
- `th1/th1-poster.png` — 제품 포스터: 제품 이미지·헤드라인·제품명·CTA 정상
- `th1/th1-infographic.png` — 인포그래픽: 렌더되나 **텍스트 오버플로 결함 관측**(아래)

## 적발 사항

### ① 선언된 Playwright 증거의 스펙이 레포에 없다

`evidence/template-production-system/tps3-studio.md`는 "Playwright desktop 1440×1000, mobile 390×844, console errors 0"을 기록했으나, `apps/template-studio`에는 `playwright.config*`도 `*.spec.ts`도 없다(레포 내 Playwright 설정은 `examples/glass-landing`에만 존재). 이번 검증은 Playwright MCP로 직접 브라우저를 몰아 대체했다. **실제 스펙 파일 작성은 TH3 과제.**

### ② 인포그래픽 텍스트 오버플로 (기존 결함, 회귀 아님)

`explanation` 슬롯의 텍스트가 슬롯을 크게 넘쳐 `source` 줄을 덮는다. 원인은 `compiler.ts`의 조판 휴리스틱:

```
fontSize = max(18, round(slotHeight * 0.45))   // explanation 슬롯 420px → 189px
```

세 서명이 해제 전후 동일하므로 **이번 변경이 만든 회귀가 아니라 TPS4 시점부터 있던 결함**이며, TPS4 검증이 이를 통과시켰다. `maxChars`(360자) 제약은 문자 수만 보므로 조판 높이 초과를 잡지 못한다.

→ TH3(조판을 타이포 토큰 기반으로) + TH4(오버플로 negative probe)로 이월.

## 크기 회고

changeset 3개(선언 `changesets>=2`) — 라벨 정합. 인플레·디플레 없음.
