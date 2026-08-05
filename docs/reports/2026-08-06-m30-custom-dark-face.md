# 완료 — M30 `custom` 테마의 다크 판본

> 완료: 2026-08-06 · M30 (goal `docs-block-and-theme-derive`) · 배치: `docs/reports/` (record — 작성 후 동결)

## 1. 결과

**임의의 레포가 자기 브랜드로 어두운 덱을 만들 수 있다.** `/pt` 의 4번째 테마 선택지 `custom` 이 대상 레포 `DESIGN.md` 로부터 라이트·다크 **두 얼굴**을 낸다(`--mode light|dark`). 다크는 그 파일에 **이미 실려 있던** `themes.dark` 오버라이드(ui-dictionary 기준 37행 = SSOT semantic 색 토큰 37/37)에서 나오고, 변환기가 그걸 한 번도 읽지 않았던 것이 유일한 빈 곳이었다. 이제 발표장 조명이 어두울 때 "브랜드를 포기하고 canonical dark 로 가는" 선택을 하지 않아도 된다.

**canonical 3종(dark·light·askewly)은 건드리지 않았다** — diff 0. 모드 미지정 호출은 M17 시점과 산출이 29/29 동일해 브랜드 탐지 경로에 회귀가 없다.

부수적으로 `slide-spec.md` §6 의 잔여 줄("dark/light canonical 테마의 SSOT 파생")을 **철회**로 정리했다. 그 줄이 가리키던 작업은 사용자 의도와 다른 물건이었고, 의도한 것(4번째 선택지가 레포 토큰을 따라감)은 M17 이 이미 만들어 둔 상태였다.

## 2. 이슈와 해결

- **계획서 자체가 이 milestone 의 최대 이슈였다.** 초안은 큐 문구를 문자 그대로 읽어 **canonical dark/light 2종을 파생물로 교체**하는 계획이었고, OKLCH 실측까지 붙인 뒤에야 사용자 확인으로 의도가 정반대에 가깝다는 게 드러났다(전면 재작성). 같은 성격의 오독이 M17 에서 두 번, 여기서 한 번 — **큐 문구는 그것을 적은 시점의 관심사를 담을 뿐이므로, 실행 대상으로 삼기 전에 의도와 대조한다.** 교훈은 `slide-spec.md` §6 에 남겼다.
- **도구 이스케이프 사고 2건**: 스크립트 편집 시 JSON 이스케이프가 `\r?\n` 을 **진짜 개행**으로 바꿔 정규식 리터럴이 두 번 깨졌고, 삽입 위치가 `if/else` 사슬을 끊어 self-test 가 13건 중 11건 FAIL 로 떨어졌다. **두 사고 모두 self-test 와 `node --check` 가 즉시 드러냈다** — 바이트 단위로 복구.
- **flat 양식 거부 순서가 틀렸다**: 1차 구현은 형식 판정 **전에** 다크 부재를 검사해, flat 사용자가 "themes 를 못 찾았다"는 엉뚱한 안내를 받았다. self-test 가 잡아 형식 판정 뒤로 옮겼다.
- **픽스처가 대비 미달로 FAIL 한 것은 변환기가 옳았던 것**: 다크 픽스처가 `text.muted` 를 안 덮어 다크 지면에서 AA 미달 → 변환기 자기검사가 거부. 픽스처를 보완했다(검사기 문제가 아니었다).
- **완료 감사 ① 드리프트**: 없다. 계획 Files(변환기 1 · SKILL.md · style-system.md · slide-spec.md · evidence) 그대로이고, 확장·누락 어느 방향도 없다.
- **완료 감사 ② 순조로움 재검증**: step-2 가 마찰 없이 끝나 두 곳을 되짚었다. ⓐ **canonical 3종 diff 0** 을 실제 확인(주장 아님) ⓑ 계획 Verify 는 "M17 2케이스 재현"을 요구했는데 그중 `3d-repolis/DESIGN.md` 는 **현재 존재하지 않는다** — 킥스타트가 생성한 flat `DESIGN.md` 로 flat 경로를 대신 검증했다(그 경로가 `--mode dark` 를 exit 1 로 거부하는 것까지 확인). 계획 문구를 그대로 통과 주장하지 않고 대체 사실을 남긴다.

## 3. 증거

- changeset: `changesets/20260805-m30-custom-dark-face` (step 1~2 절) · evidence: `evidence/docs-block-and-theme-derive/m30-custom-dark-face.md` · 커밋: custom-skills `7b444bb`·`2b3a8ac` / ui-dictionary `4a54e11`
- 검증: `--self-test` **13/13**(기존 6 + 신규 7, 배포본에서도 13/13) · 두 모드 각 **29변수**(`customThemeErrors` 통과) · 다크≠라이트 **24/29 상이** · 참조 미해석 **0** · 다크 WCAG AA 18.60/16.73/7.79:1 · 모드 미지정 산출 M30 이전과 **29/29 동일** · canonical 3종 **diff 0** · llms-sync PASS · 소스↔배포본 정합 훅 통과
- 평가 못 함: 계획 Verify 의 "M17 2케이스" 중 `3d-repolis/DESIGN.md` 는 **파일이 없어 재현 불가** — 킥스타트 생성 flat `DESIGN.md` 로 flat 경로를 대체 검증했다(`--mode dark` → exit 1 + 형식 안내). 3-tier 케이스(ui-dictionary)는 그대로 재현했다.
- 크기 회고: 2 step · changeset 1개 · human gate 1회 · 커밋 3개(cross-repo). **계획서가 스스로 "milestone 하한에 간신히 걸친다, 솔직히 작다"고 적었고 그 판정이 맞았다** — 코드 레이어와 배선·관측이 갈렸고 실덱 렌더가 통합 검증으로 따로 섰으므로 step 강등은 아니다. 다만 goal 전체(큐 ①②③)가 목표 크기였으므로 과소 그릇은 아니다.
- 실표면: `fixtures/custom-theme-smoke` 를 라이트/다크 두 판본으로 빌드해 실브라우저(1280×720)에서 렌더 — 표지·카드 4장. 실측 CSS 변수 다크 `--bg-primary #0b0d14`(SSOT `gray.12`)·`--text-primary #fafafa`·`--accent-start #b9faf8`·`--accent-end #a663cc`, 라이트 `#fafafa`/`#0b0d14`/`#6f2dbd`/`#a663cc`. 콘솔 에러 **0**. 사용자 관측 판정 **"민트로 두지"** — 다크 액센트를 SSOT 정의대로 확정.
- 배선: 신설 장치 = `parseThemeOverrides` + `--mode` 플래그. 호출자 = `/pt` 덱 제작 절차 §7-5 브랜드 탐지 단계(`SKILL.md` §6 「밝기 선택」이 지시). **실발화 1회 증거** = 위 실표면 관측이 그 경로로 `--mode dark` 를 실제로 돌려 덱 2본을 렌더했다. 배포는 `setup.sh` 단일 경로, 배포본 self-test 13/13 재확인.
- 재현: `cd ~/projects/custom-skills/promoted/pt/scripts && node design-md-to-theme.mjs --self-test` → 13/13 · `node design-md-to-theme.mjs ~/projects/ui-dictionary/DESIGN.md out.json --mode dark`
