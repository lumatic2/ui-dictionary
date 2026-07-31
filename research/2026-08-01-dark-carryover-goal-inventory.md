# 리서치 — 다크모드 이월 3건 실측 인벤토리 (goal `dark-carryover` 계획 입력)

> 2026-08-01 · 소비처: `plans/2026-08-01-m2-accent-semantic-tokens.md` · `plans/2026-08-01-m3-forced-colors.md` · `plans/2026-08-01-m4-og-image-dark.md`
> 선행 리서치: `research/2026-07-31-dark-mode-goal-dark-mode.md` (다크모드 goal 계획 입력 — forced-colors 정의·경계 포함)

## A. "토큰 부재" 마커 실측 (M2 입력)

2026-08-01 `hardcoded-color-ok` 마커 전수 grep 실측. 사유가 "토큰 부재"인 것만 M2 대상 — 의도 고정색(브랜드 카카오/구글, 코드 에디터 관례 다크, 오버레이 스크림, 인쇄/내보내기 백지)은 대상 아님.

| 색 | 용도 (마커 사유) | 위치 표본 |
|---|---|---|
| indigo | topbar 피드백 칩 강조 · 예시 태그 칩 · 선택된 role 강조 · 포커스 링 · 강조 버튼 | `App.tsx:636,661,2185` · `article-documentation-layout.tsx:312,340,347` |
| sky | docs 섹션 아이콘 타일 · "Get the code" 링크 강조 | `App.tsx:1859,2240` |
| emerald | Pro unlocked 배지 (성공 상태) | `App.tsx:2179` |
| rose | Delete 항목·파괴적 버튼·경고 아이콘 칩 (`--destructive` 와 shade 불일치로 "정확 대응 토큰 없음" 판정) | `article-documentation-layout.tsx:143,203,209` |
| 브랜드 보라 hover shade (`#5f22a8` 계열) | 브랜드 보라 버튼 hover | `App.tsx:625,991` |
| (파생) destructive-foreground 부재 | `text-white` 대체 중 — 마커 3건 | `ui/button.tsx:14` · `ui/badge.tsx:16` · `bottom-tab-bar.tsx:61` |

- 토큰 SSOT: `tokens/askewly.tokens.json` (3-tier: primitive → semantic → component) → `scripts/generate-tokens.mjs` → `examples/ui-vocabulary-site/src/tokens.css`(`:root` + `.dark` 블록 생성) → `src/index.css` `@theme inline` 매핑.
- 현재 primitive 는 white/gray/askewly/red 뿐 — indigo·sky·emerald·rose 는 primitive 부터 없다.
- 배포 사본: `examples/ui-vocabulary-site/public/llms/tokens/askewly.tokens.json` (llms 배포물 — 재생성 필요).
- ⚠ `article-documentation-layout.tsx` 마커 일부는 문서 데모 콘텐츠 내부일 수 있음 — 치환 대상인지(셸) 콘텐츠인지 step 실측에서 최종 판정.

## B. forced-colors 구현 기법 (M3 입력)

정의·경계는 선행 리서치 §High contrast 참조 (출처: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors 접근일 2026-07-31 — 본 레포 research 기확인).

구현 기법 (MDN 본문 확인 2026-08-01 — M3 step-1):
- 강제 대상: `color`·`background-color`·`border-color`·`outline-color`·`text-decoration-color`·SVG `fill`/`stroke` 등이 시스템 팔레트로 대체. **`box-shadow`·`text-shadow` → `none` 강제**(box-shadow 포커스 링 소실 → border/outline 대응) · **비URL `background-image`(그라디언트 등) → `none` 강제**(URL 이미지는 보존) · `color-scheme` → `light dark` 강제. 출처: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors (접근일 2026-08-01)
- `forced-color-adjust: none|auto|preserve-parent-color` — `none` 은 색이 곧 정보인 요소(색 견본 등)에만, 사용자 선택 무력화 용도 금지. 출처: https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust (접근일 2026-08-01)
- 시스템 색 키워드: `Canvas`/`CanvasText`(문서), `ButtonFace`/`ButtonText`/`ButtonBorder`(컨트롤), `Field`/`FieldText`(입력), `Highlight`/`HighlightText`·`SelectedItem`/`SelectedItemText`(선택), `LinkText`·`GrayText` 등 — forced 블록의 커스텀 규칙은 이 팔레트만 쓴다. 출처: https://developer.mozilla.org/en-US/docs/Web/CSS/system-color (접근일 2026-08-01)
- 원칙: 별도 디자인 금지 — "작은 보정(usability/legibility tweaks)"만. 검증: Playwright `page.emulateMedia({ forcedColors: 'active' })` — Windows 실물이 정본, 자동화 게이트는 에뮬레이션.

## C. og-image 제약 (M4 입력)

- `og:image` 는 크롤러(카카오톡·트위터·슬랙 등)가 **이미지 1장을 정적으로 캐시** — 뷰어 다크/라이트 테마별 분기 수단이 프로토콜에 없다. 따라서 "다크 전용 og-image 추가"는 성립하지 않고, **양 테마 채팅 UI 에서 다 자연스러운 단일 이미지** 전략이 정답 공간이다. (사용자 확정 2026-08-01: 다크 톤 단일 이미지로 교체)
- 현행: `examples/ui-vocabulary-site/index.html:32` `og:image = /og-image.svg` — **SVG**. 플랫폼 규격 근거(M4 step-1 확인): Facebook 공유 이미지 문서는 1200×630 권장·8MB 상한 등 래스터 전제 규격만 규정하고 SVG 를 언급하지 않으며(출처: https://developers.facebook.com/docs/sharing/webmasters/images/ 접근일 2026-08-01), LinkedIn 광고/공유 이미지 문서는 "JPG, PNG, or GIF"만 명시(출처: https://www.linkedin.com/help/linkedin/answer/a521928 접근일 2026-08-01). X 카드 문서는 유료장벽(402)으로 본문 미확인. **어느 규격도 SVG 를 지원 포맷으로 명시하지 않음** → 래스터 PNG 1200×630 이 안전 기본값. 최종 실증은 배포 후 카드 디버거 실확인(DoD 기재)이 게이트.
- ~~라우트별 메타는 prerender 파이프라인이 og:image 도 찍는다~~ → **정정(2026-08-01 fresh 검증자 실측)**: prerender(`scripts/prerender-ui-vocabulary.ts:184-210`)는 og:title/url/description·twitter:title/description 만 라우트별 재작성 — **og:image 는 셸(index.html) 단일 선언을 전 라우트가 상속**한다. `src/lib/page-meta.ts` 는 클라이언트 useEffect(title·description만)라 크롤러와 무관. 교체 작업 = index.html 한 곳.
