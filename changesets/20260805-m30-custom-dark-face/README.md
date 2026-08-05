# 20260805-m30-custom-dark-face — M30 `custom` 테마의 다크 판본

> plan: `plans/2026-08-05-m30-custom-dark-face.md` · milestone: M30 · cross-repo(`custom-skills/promoted/pt`)

## step-1 — 변환기 다크 판독 + `--mode` 출력

- 4번째 테마 선택지 `custom` 은 M17 부터 있었다. 비어 있던 것은 **다크 얼굴** 하나 — `DESIGN.md` 에 `themes.dark` 오버라이드 **37행**(SSOT semantic 색 토큰 37/37 과 일치)이 실려 있는데 **변환기가 `themes` 를 한 번도 읽지 않았다**(grep 0건). 그래서 브랜드 덱이 늘 라이트로만 나왔고, 다크가 필요하면 브랜드를 포기하고 canonical `dark` 로 가야 했다.
- `parseThemeOverrides(fmText, mode)`: `themes.<mode>` 의 **점 경로 리프**를 수집해 base leaves 에 덮는다. 참조는 primitive 를 가리키고 primitive 는 모드와 무관하므로 기존 `resolve`/`get` 이 그대로 동작한다 — **다크 전용 규칙 세트를 만들지 않았다**(규칙이 둘이면 어느 쪽이 정본인지 알 수 없어진다).
- `--mode light|dark`. **미지정은 기존 동작 유지** — M17 이 깐 브랜드 탐지 경로가 조용히 바뀌면 안 된다.
- 다크를 달라 했는데 실을 게 없으면 **exit≠0**(조용한 폴백 금지, 변환기의 기존 "필수 키를 조용히 채우지 않는다" 계약과 같은 결). **flat 양식은 형식 판정 뒤에 거부** — 순서가 뒤집히면 flat 사용자가 "themes 를 못 찾았다"는 엉뚱한 안내를 받는다(1차 구현이 실제로 그랬고 self-test 가 잡았다).
- **구현 중 사고 2건 — 도구 이스케이프**: 스크립트 편집 시 JSON 이스케이프가 `\r?\n` 을 **진짜 개행**으로 바꿔 정규식 리터럴이 두 번 깨졌다(`node --check` 로 즉시 적발 → 바이트 단위 복구). 그리고 삽입 위치가 `if/else` 사슬을 끊어 self-test 가 13건 중 11건 FAIL 로 떨어졌다 — **self-test 가 두 사고를 모두 즉시 드러냈다**.
- 게이트: `--self-test` **13/13**(기존 6 + 신규 7 — 다크 병합·라이트 복사 아님·오버라이드 반영·참조 미해석 0·모드 미지정 무회귀·다크 부재 실패·flat 거부) · 두 모드 각 **29변수** · **24/29 상이** · 다크 AA 18.60/16.73/7.79:1 · 모드 미지정 산출이 M30 이전과 **29/29 동일**.

## step-2 — 스킬 배선·문서 + 실덱 다크 렌더 관측 + 배포

- `SKILL.md` §6 「밝기 선택(M30)」 — custom 제안 시 라이트/다크를 함께 묻는다(커맨드 2줄 + 다크 부재 시 canonical 제안). `references/style-system.md` 커스텀 테마 절에 계약 추가.
- 관측: `fixtures/custom-theme-smoke` 를 두 판본으로 빌드해 실브라우저(1280×720) 렌더, 표지·카드 × 2모드 4장. 실측 CSS 변수 — 다크 `--bg-primary #0b0d14`(SSOT `gray.12`)·`--text-primary #fafafa`·`--accent-start #b9faf8`·`--accent-end #a663cc`. 콘솔 에러 **0**.
- **사용자 판정(2026-08-06) — "민트로 두지"**: SSOT 다크에서 `action.primary` 가 `gray.1`(거의 흰색)이고 `isNeutral` 이 무채색을 액센트에서 배제하므로 다음 후보인 `action.secondary`(askewly mint)가 `accent-start` 가 된다. **결함이 아니라 SSOT 정의대로 나온 결과**이며 그대로 확정 — 다크 전용 액센트 예외를 만들지 않는다(기술결정 ⑤ 유지).
- `ui-dictionary/docs/design-system/slide-spec.md` §6 잔여 줄 **철회 처리**: 그 줄("dark/light canonical 테마의 SSOT 파생")이 가리키던 작업은 사용자 의도와 다른 물건이었다 — 의도는 4번째 선택지가 레포 토큰을 따라가는 것이었고 M17 이 이미 만들었다. canonical 3종은 존치. 경위와 교훈(큐 문구를 실행 대상으로 삼기 전에 의도와 대조한다)을 같은 자리에 남겼다.
- 배포: `bash setup.sh` 단일 경로(배포본 직접 편집 금지) → **배포본 self-test 13/13** + 소스↔배포본 정합 훅 통과. 커밋 `7b444bb`(step-1)·`2b3a8ac`(step-2).
- Evidence: `evidence/docs-block-and-theme-derive/m30-custom-dark-face.md`.
