# DQ2 — 표현 기계 업그레이드 (연속 전환 + 이미지 최적화 + sourceNote 배치)

> 2026-07-31 · plan: `plans/2026-07-31-dq2-expressive-mechanics.md` · changeset: custom-skills `20260731-dq2-expressive-mechanics`

## step-1 — 장간 요소 연속 전환 (animId · custom-skills c10a2a8)

- **선행 게이트(계획 명시)**: cross-document View Transitions 의 file:// 동작 실측 — `pagereveal.viewTransition` 계측으로 **chromium 151 `true`** + **사용자 설치 Chrome stable 150(headed, channel:'chrome') `true`**. Playwright 만으로 실크롬을 대체하지 않는다는 전역 규약대로 실크롬 채널까지 확인. 더블클릭 실행 경로의 잔여 차이는 DQ3 사용자 관측이 최종 게이트.
- 구현: `slides.schema.json` `items[].animId`(kebab, opt-in) + shell — animId 덱만 ① `@view-transition { navigation: auto }` 주입(최상위 창·비 print/capture, reduced-motion 은 `navigation: none`) ② `view-transition-name: anim-<id>` 태깅 ③ navigateTo 가 즉시 이동(네이티브 전환 소유). lint: 같은 장 animId 중복 경고.
- 검증 `ANIM-VT PASS`: 출발 장 태깅(`anim-monitor`)·도착 문서 `pagereveal.viewTransition true`·도착 장 동일 태깅·`?capture` 미주입·콘솔 에러 0.
- **비-animId 덱 산출 diff 0** — 정본 덱 재빌드로 확인(초판이 템플릿 빈 줄 2개를 유출한 것을 이 게이트가 잡아 수정).

## step-2 — 이미지 최적화 + sourceNote 수리 (custom-skills 9c2dad8)

- 검증 이미지 재확보(HU3 fixture 소멸분): Pexels 6000×4000·2.2MB 사진 + rmbg(BiRefNet) 누끼 투명 PNG, 출처 장부 2행(라이선스·접근일).
- `optimize-images.mjs`(opt-in, sharp): 3840px 리사이즈 + webp, 원본 `assets/src/` 보존, slides.json 참조 자동 재작성. **실측 2371KB→553KB(77% 감소)**, 누끼 알파 보존(`RGBA`, extrema 하한 0), 화질 열화 없음(실렌더 육안).
- sourceNote 겹침 수리: split-screen 노트를 플로우로 — **이미지 하단 760 < 노트 상단 768**(수리 전 노트가 이미지 위 744에 얹힘). overflow 0 issue.
- imagery.md §5 계약 절.

## 회귀 게이트

- HU4 재현 5종(POSTMESSAGE-SYNC·IFRAME-GUARD·TWO-DECKS·SYNC-LAG·REHEARSAL) + ANIM-VT 전부 PASS.
- 정본 덱 capture 픽셀: 4장 비트 동일, 3장 파랑 채널 최대 2/255 렌더 노이즈(color-mix 지터 — HU4 와 동일 성질, 콘텐츠 무변).

## 게이트

- DoD 충족: 연속 전환 opt-in 동작(실측 근거)·이미지 최적화 실측 개선·sourceNote 겹침 해소·미사용 덱 무변화. PASS.
