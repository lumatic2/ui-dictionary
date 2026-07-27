# UE5 — 페이지 분리 (라우팅 전환) · 증거

> milestone UE5 · goal `ui-encyclopedia` · 2026-07-27
> plan: `plans/2026-07-27-ue5-routing-split.md` · changeset: `changesets/20260727-ue5-routing-split/`

## step-1 — 라우터 골격 + 리다이렉트 (실행 관측)

```
1 /patterns/:slug: PASS          /patterns/marketing-header-sections
2 /terms/accordion: PASS
3 legacy ?page=term&id=accordion: PASS → /terms/accordion
3 legacy ?filter=nav:plus-marketing-header-sections: PASS → /patterns/marketing-header-sections
3 legacy ?q=아코디언: PASS → /search?q=아코디언
3 legacy ?page=docs&filter=nav:docs-getting-started-setup: PASS → /docs/getting-started-setup
3b search redirect renders: PASS (결과에 아코디언 행)
4 detail->back: PASS (브라우저 기본 뒤로가기)
5 sidebar -> path url: PASS (/patterns/marketing-footers)
6 unknown path -> home: PASS
CONSOLE ERRORS: 0 · UE5 STEP1: PASS
```

- OAuth 리턴 `?auth=ok` → 파라미터 제거·"Sign out" 표시·JS 에러 0.
- Failure probe: `legacyRedirectPath` term 분기 일시 오염 → `?page=term&id=accordion` 이 `/patterns` 오착지, 검증 FAIL 로 적발 후 원복(diff 0).

## step-2 — 코드 분할 (build 실측, 동일 커맨드 전/후)

| | index 청크 | gzip |
|---|---|---|
| 전 (step-1 HEAD, stash 실측) | **3,324.47 kB** (사실상 단일) | 786.30 kB |
| 후 | **1,757.83 kB** | 474.63 kB |
| 감소 | **-47%** | **-40%** |

lazy 청크: marketing-section-preview 941kB · three-object-scene 882kB · term-visual 281kB · recipe-gallery 253kB · term-page 20kB · colors-page 7kB. App.tsx 23,507 → 약 6,300줄.
전 측정(stash 상태)이 곧 "lazy 를 동기로 되돌린" failure probe 실측이다 — 단일 3,324kB 로 감소가 소멸함을 확인.

계획 편차(정직 기록): `src/pages/*` 신설 대신 기존 컴포넌트 파일 경계로 분리 — 같은 효과, 더 작은 이동 diff. Pro/Download/카탈로그 골격 완전 분리는 finding 큐.

## step-3 — 통합 시나리오 (실행 관측)

```
home: PASS
search results: PASS (Ctrl+F → "아코디언")
term detail: PASS  /terms/accordion
header sections listing: PASS  /patterns/marketing-header-sections
deeplink share (new tab): PASS
CONSOLE ERRORS: 0 · STEP3 INTEGRATED: PASS
```

회귀 게이트: `npx tsc -b` 에러 0 · `npm run build` exit 0 · `npm run lint` exit 0.

## 사람 관측 (DoD 최종 항목)

- 과업: "아코디언 찾아서 보고, 헤더 목록 가고, 뒤로가기 해보세요 + 주소창이 읽을 수 있는 경로로 보이는가"
- **상태: 대기** — 관측 후 발화 인용과 함께 기록한다. 기계 PASS 만으로 닫지 않는다.
