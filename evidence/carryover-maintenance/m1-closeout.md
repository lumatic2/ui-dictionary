# M1 evidence — 이월 유지보수 마감

- 2026-08-01 · plan: `plans/2026-07-31-m1-carryover-maintenance.md` · changeset: `changesets/20260731-m1-carryover-maintenance/`

## step-1 — CLI 타이포 게이트 보정 (@askewly/design 0.3.0)

| 항목 | 결과 |
|---|---|
| `npm test` (packages/cli) | PASS 60/60 (신규 12) |
| `npm run build` | PASS (terms=563 recipes=47) |
| 반응형 쌍 1계수 | PASS — `text-5xl md:text-7xl` → base{48}·md{72} 분리 |
| 변형 체인 정규화 | PASS — `md:hover:` 와 `hover:md:` 가 같은 버킷 |
| 임의 브레이크포인트 | PASS — `min-[900px]:text-lg` 가 이제 스캔됨 (기존 갭 적발·수정) |
| 비반응형 변형 base 유지 | PASS — `hover:`·`dark:` 는 버킷 안 만듦 |
| **Failure probe** 빈 사유 마커 | PASS — `typography-marker-no-reason` 위반 |
| **Failure probe** 마커가 색 위반 면제 못 함 | PASS — hex-literal 그대로 보고 |
| **Failure probe** 무접두 초과 파일 | PASS — 여전히 위반 |

## step-2 — 사이트 잔여 타이포 → 0

| 단계 | 위반 |
|---|---|
| 시작(SQ1 이월 + QA2 증분) | 8 |
| 버킷 계수 보정 후 | 7 (`term-page.tsx` 해소 — 반응형 쌍이 유일 원인이었음) |
| 마커 4건 적용 후 | 3 |
| 임계 5→7 후 | **0** |

마커 대상(집합 파일 — 한 파일에 화면 여럿): `home-page`(Showcase Atlas 12칸) · `marketing-section-preview`(섹션 데모 수십 종) · `term-visual`(용어 562 미니어처) · `article-documentation-layout`(셸 + 데모 8종). 전건 사유 명시, 매 실행 출력.

임계 재산정 근거 — 남은 3건의 실측 구성:

| 파일 | 단계 | 구성 |
|---|---|---|
| `colors-page` | 6 | 10(모노 마이크로 2곳) 12 14 16(리드) 20 48(h1, md:72) |
| `get-started-page` | 6 | 12 14 20 30 40(h2, md:30) 48(h1) |
| `recipe-gallery` | 7 | 10(배지) 12(eyebrow) 14(카드·code) 16(리드) 20(h2) 30(목록 h1) 40(상세 h1) |

셋 다 마이크로 라벨 1 + 본문 2~3 + 헤딩 2 의 정상 위계로 접을 중복이 없었다. 임계 5 의 근거였던 "토큰 스케일 5단계"가 실사용과 어긋남 — 화면은 헤딩(30/48/72)·마이크로(10/12)를 스케일 밖에서 가져다 쓴다. 사용자 결정으로 7 채택(2026-08-01).

- 최종: `verify PASS — 90 file(s) scanned, no color literals and no file over 7 type sizes` · 면제 4건 사유 출력.
- 사이트 `npm run lint` PASS (색 0 violations, allowlist 6) · `npm run build` PASS (755 라우트 prerender).

## step-3 — SEO 셸 메타 영어 통일

| 라우트 | 전환 전 head 한국어 메타 | 전환 후 |
|---|---|---|
| `/` `/get-started` `/colors` `/recipes` `/pro` `/search` `/patterns` `/docs` `/patterns/marketing` | 각 3건 | **각 0건** |

- `lang="ko"` → `"en"` (dist 산출물 확인).
- 실브라우저(preview 4322, Playwright): 홈·/get-started 렌더 PASS · 콘솔 에러 **0** · `documentElement.lang === "en"` · title/description 영어 확인.
- 제외 경계 준수: 용어 라우트·docs 아티클 본문은 한국어 유지(콘텐츠) — `docs/design-system/copy-language.md` 에 기록.

## 회귀 게이트

| 항목 | 결과 |
|---|---|
| 색 위반 0 유지 | PASS |
| `lint:colors --max 0` 무회귀 | PASS (신규 allowlist 0) |
| 용어 라우트 메타 무변경 | PASS (전환 대상에서 제외) |
| CLI 기존 테스트 무회귀 | PASS (DOG1 마스킹·DOG3 fixture 포함 60/60) |

## 평가 못 함

- npm publish(@askewly/design 0.3.0)·git push — 세션 말 사용자 보고 후 일괄(계획서 제외 항목). 실배포 반영은 push 후 확인.
