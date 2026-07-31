# M1 — 이월 유지보수 마감 (verify 타이포 게이트 보정 + SEO 메타 영어 통일)

- Date: 2026-07-31 · Plan: `plans/2026-07-31-m1-carryover-maintenance.md` · Milestone: M1

이월 finding 2건을 닫는다. ① SQ1(2026-07-28)이 "게이트 보정 후"로 미룬 타이포 위반 8건 ② QA1(2026-07-31)이 finding 큐로 보낸 SEO 메타 언어.

## step-1 — CLI 타이포 게이트 보정 (@askewly/design 0.2.0 → 0.3.0)

**규칙이 잘못 세고 있었다.** `text-5xl md:text-7xl` 은 어느 화면에서도 한 크기로 렌더되는데 2단계로 계수됐다. 파일당 5단계 예산이 반응형 쌍만으로 소진되니, 타이포 규율에 문제가 없는 파일이 위반으로 잡혔다.

- `resolveTypographyBuckets` 신설 — 크기를 **렌더되는 브레이크포인트별로** 모은다. 무접두는 base 버킷, `sm:`~`2xl:`·`min-*`·`max-*` 는 각자 버킷. `hover:`·`dark:` 같은 비반응형 변형은 같은 화면의 상태라 base 에 남긴다.
- `typographyViolation` 이 버킷별로 독립 판정. 어느 브레이크포인트가 초과했는지 출력에 표시.
  - 의도적 과소 계수: md 화면은 md 가 덮지 않은 base 크기도 함께 보여주지만, 텍스트 스캐너는 어느 것이 덮였는지 모른다. base 를 모든 버킷에 더하면 이 규칙이 없애려던 오탐이 그대로 돌아오므로, 확신할 수 없는 자리에서는 조용히 있는 쪽을 택했다.
- 파일 단위 opt-out `askewly-typography-ok: <사유>` — **사유 필수**(빈 사유는 `typography-marker-no-reason` 위반). 면제 파일은 PASS/FAIL 양쪽 출력에 이름·사유가 나열된다 — 정당화 없이 빠지는 면제가 게이트를 게이트가 아니게 만든다.
- 부수 적발: `min-[900px]:text-lg` 처럼 **임의 브레이크포인트 변형이 붙은 유틸리티는 정규식에 아예 안 잡혔다**(접두만이 아니라 유틸리티 전체가 스캔에서 사라짐). 테스트가 드러내 함께 수정.
- 테스트 60건 PASS (신규 12건 — 버킷 분리·변형 정규화·마커 skip·빈 사유 거부·마커가 색 위반을 면제하지 못함·무접두 초과는 여전히 위반).

## step-2 — 사이트 잔여 타이포 처리 (위반 8 → 0)

보정된 규칙으로 재실측하니 8 → 7(반응형 쌍이 유일 원인이던 `term-page.tsx` 해소, 나머지도 단계 수 감소). 남은 7건을 성격으로 갈랐다.

**마커 4건** — 파일 하나에 화면이 여럿이라 "이 화면의 크기 수"라는 질문 자체가 성립하지 않는 것들: `home-page`(Showcase Atlas 12칸), `marketing-section-preview`(섹션 데모 수십 종 variant 스위치), `term-visual`(용어 562개 미니어처), `article-documentation-layout`(아티클 셸 + 인터랙티브 데모 8종).

**임계 5 → 7** (사용자 확정 2026-08-01, 계획서의 "임계 변경 제외" 조항을 실측으로 갱신). 남은 3건(`colors-page` 6·`get-started-page` 6·`recipe-gallery` 7)은 전부 진짜 단일 화면이고 위계도 교과서적이었다 — 마이크로 라벨 1 + 본문 2~3 + 헤딩 2, 접을 중복 없음.

임계 5의 근거는 "우리 토큰 스케일이 5단계"였는데 **실사용이 그 전제를 배반하고 있었다**: 화면들은 헤딩(30/48/72)과 마이크로 라벨(10/12)을 스케일 밖 Tailwind 기본값에서 가져다 쓴다. 5는 본문 스케일의 크기이지 화면 하나가 필요로 하는 크기가 아니었다. 7은 정상 화면 3개를 통과시키면서 이 규칙이 애초에 겨냥한 것(마커 단 파일들은 14~15단계)은 그대로 잡는다 — 어느 임계로 재도 두 배 초과다.

- 결과: `verify PASS — 90 file(s) scanned` · 면제 4건은 매 실행 사유와 함께 출력.
- Failure probe: `term-visual` 마커의 사유를 지우니 `typography-marker-no-reason` 으로 다시 FAIL — 게이트가 살아 있다.
- 사이트 lint(색 0)·build(755 라우트 prerender) PASS.

## step-3 — SEO 셸 메타 영어 통일

사이트 카피는 2026-07-31 에 영어 단일로 확정됐는데 검색 메타만 한국어로 남아 있었다 — 검색 결과에는 한국어 스니펫이 뜨고 들어오면 영어 페이지인 상태.

- `index.html`: `lang="ko"` → `"en"`, description·og:description·twitter:description 영어화.
- `page-meta.ts`: 기본 설명 영어화(라우트별 설명이 없을 때의 폴백).
- `scripts/prerender-ui-vocabulary.ts`: 셸 정적 라우트(홈·get-started·docs 허브·patterns 허브·컬렉션·colors·recipes·pro·search)의 description 과 첫 페인트 body 영어화.
- **콘텐츠는 그대로**: 용어 562건의 이름·설명, docs 아티클 본문(`documentation-pages.ts`)은 한국어가 의도된 콘텐츠다. 전환 대상은 셸 메타뿐 — `docs/design-system/copy-language.md` 에 이 경계를 기록.
- 검증: 전환 전 셸 라우트 8곳의 `<head>` 메타에서 한국어 3건씩 검출(양성 대조) → 전환 후 전부 0. build 755 라우트 PASS, 실브라우저(preview 4322)에서 홈·/get-started 렌더·콘솔 에러 0·`documentElement.lang === "en"` 확인.
