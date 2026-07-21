# changeset: 스튜디오·verify 스크립트 가독성 복구

- Date: 2026-07-20
- Plan: TH1 step 2 (`plans/2026-07-20-th1-code-legibility.md`)

`apps/template-studio`와 `scripts/verify-template-production-system.mjs`의 압축된 소스를 정상 포맷으로 해제했다. 동작 변경 없음.

## 무엇을 바꿨나

- **`App.tsx`** — 18줄(최장 2,303자) → 정상 포맷. JSX를 줄 단위로 펼치고 `serialize()`·`EXPORT_KINDS`를 추출했다. 하드코딩 팔레트에는 TH3용 `TODO` 주석을 달았다(제거는 TH3 소관).
- **`exporters.ts`** — HTML/SVG 내보내기의 중첩 삼항을 `if` 분기로 펼치고 `paintableNodes()`·`assetUris()`·`HTML_ENTITIES`를 추출했다. SVG baseline 보정에 주석을 달았다.
- **`verify-template-production-system.mjs`** — 전체 2줄(최장 1,393자) → 정상 포맷. `exports` 하드코딩과 `-split` 제외 로직에 TH4/TH2용 `TODO` 주석을 달았다.

300자 초과 라인: 스튜디오 5개 → 0개, 스크립트 1개 → 0개.

## Verification

- [x] `npm --prefix apps/template-studio run build` — tsc -b + vite build PASS
- [x] `npm --prefix apps/template-studio test` — 3 tests PASS
- [x] `node scripts/verify-template-production-system.mjs` — exit 0, manifest가 해제 전과 **바이트 단위 동일**(`git stash` 전후 `diff` 무출력)
- [x] **실제 브라우저 구동** — dev 서버(:5199) + Playwright로 세 형식 전환·렌더 관측. 콘솔 에러는 `favicon.ico` 404 1건뿐. 스크린샷 `evidence/template-production-hardening/th1/`.

## 적발: 선언된 검증이 실재하지 않음

`evidence/template-production-system/tps3-studio.md`는 "Playwright desktop 1440×1000, mobile 390×844, console errors 0"을 기록했으나 **레포에 `apps/template-studio`용 Playwright 설정도 스펙도 없다**(`playwright.config*`는 `examples/glass-landing`에만 존재). 이번 검증은 Playwright MCP로 직접 브라우저를 몰아 대체했다. TH3가 실제 스펙 파일을 만들어야 한다.

이로써 이 horizon이 겨냥한 "선언과 구현의 괴리" 패턴이 세 번째로 확인됐다 — ① 토큰 편집 선언·미구현 ② exports 하드코딩 ③ Playwright 증거·스펙 부재.

## finding 큐 (TH2~TH3으로 이월)

- **인포그래픽 텍스트 오버플로 (시각 결함)** — `explanation` 슬롯이 렌더에서 크게 넘쳐 `source` 줄을 덮는다. 원인은 `compiler.ts`의 `fontSize = max(18, round(slotHeight * 0.45))` 휴리스틱: explanation 슬롯 높이 420px → fontSize 189px. 서명이 해제 전후 동일하므로 **이번 변경이 만든 회귀가 아니라 기존 결함**이며, TPS4 검증이 이를 통과시켰다. 조판 규칙을 슬롯 높이 비율이 아니라 타이포 토큰 기반으로 바꾸는 것이 TH3 과제.
- `maxChars`(explanation 360자) 제약이 실제 렌더 오버플로를 막지 못한다 — 문자 수와 조판 높이는 별개 축이다. TH4 negative probe 후보.
