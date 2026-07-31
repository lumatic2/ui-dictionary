# Evidence — M3: forced-colors(고대비 모드) 대응

- Date: 2026-08-01 · Plan: `plans/2026-08-01-m3-forced-colors.md` · Changeset: `changesets/20260801-m3-forced-colors/`

## step-1 — 감사 (Playwright `emulateMedia({forcedColors:'active'})`, 로컬 빌드 preview)

순회 표면: 홈 · 용어 상세(/terms/accordion) · /docs · /search?q=button · /colors(Generator+Palettes 탭) · /patterns · 팔레트 Export 다이얼로그 · 다크(.dark)+forced 동시 활성. 스크린샷: scratchpad `fc_*.png` (세션 산출물 — 판정 결과는 이 장부가 정본).

### 결함 장부

| ID | 요소 | 증상 (실측) | 수리 수단 |
|---|---|---|---|
| D1 | 팔레트 색 스와치 — /colors PaletteCard 색 스트립·Generator 5컬럼 (inline `backgroundColor`) | **색이 전부 소멸해 빈 칸** — forced-colors 가 background-color 를 강제, hex 라벨만 남음. 색 자체가 정보인 표면 | 스와치 요소에 `forced-color-adjust: none` (MDN 권고 사용처 그대로) |
| D2 | 홈 장식 플로팅 블록·그리드 필드 (`.floating-*`·`.inverted-*`) | 그라디언트·배경 강제 소멸로 **빈 외곽선 상자들이 화면에 떠다님** — 장식이 노이즈화 | `@media (forced-colors: active)` 에서 장식 필드 숨김 (콘텐츠 아님) |
| D3 | topbar 로고 버튼 | 포커스 시 `outline: none` (타 버튼은 `auto`) — box-shadow 링도 forced 에서 소멸이라 **포커스 완전 불가시** | forced 블록 전역 `:focus-visible { outline: 2px solid ButtonText }` (일반 모드 무영향) |

### 결함 아님 (판정 기록)

- 링크·버튼 텍스트가 시스템 팔레트 색(라이트 HC 적갈·다크 HC 녹색)으로 렌더 — UA 강제의 정상 동작.
- Pro 잠금 블러 프리뷰 — 의도된 차단, forced 에서도 유지됨.
- 다크(.dark)+forced 동시 활성: body `rgb(0,0,0)`/`rgb(255,255,255)` — 충돌 없이 판독 가능(스크린샷 `fc_dark_home.png`).
- Export 다이얼로그: 스크림·본문 판독 가능, 시스템 색으로 정상 강제.
- 용어 미니목(term-visual)·데모 콘텐츠 내부 — 스코프 제외(콘텐츠), 관측상 판독 가능.

### 스코프 밖 관측 (finding 큐 이관)

- `/search?q=button` 문서 title 이 "Patterns — Askewly Design" — 라우팅/메타 이슈 의심(forced-colors 무관).
- 로고 버튼은 **일반 모드에서도** 포커스 불가시(outline none + 링 없음) — D3 수리는 forced 한정이므로 일반 모드 포커스 링은 별도 후보.

## step-2 — 수리 (아래 실행 후 기입)
