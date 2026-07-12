# 20260712 QA2 재패키징 + 실설치

Target: QA2 Step 1 — AskewlyDesign 이름 반영 재패키징과 첫 실설치.

## Scope

- 리네임 changeset(20260712-askewly-design-rename) 이후 첫 `make:win` 실행 — 산출물이 `out/AskewlyDesign-win32-x64/AskewlyDesign.exe` + `AskewlyDesign-UnsignedDevelopment-Setup.exe` 로 생성되는지 확인.
- `verify-package` 통과.
- 인스톨러로 실제 설치(`%LOCALAPPDATA%\askewly_design`) → 실행 확인 → 언인스톨/재설치 lifecycle 1회 관측.
- 코드 변경 없음 (빌드·설치·관측 changeset).

## Verification

- [x] `npm run make:win` — exit 0, `out/AskewlyDesign-win32-x64/AskewlyDesign.exe` + `out/make/squirrel.windows/x64/AskewlyDesign-UnsignedDevelopment-Setup.exe` + `askewly_design-0.1.0-full.nupkg` 생성
- [x] `npm run verify:package` — PASS (5 artifacts, 5 resources, 9 fuses)
- [x] `node scripts/run-installer-lifecycle.mjs` — PASS (install, launch, renderer security contract, shortcut, uninstall, cleanup) → `results/packaged/installer-lifecycle.json`
- [x] 영구 설치: 인스톨러 재실행 → `%LOCALAPPDATA%\askewly_design\app-0.1.0\AskewlyDesign.exe` + 시작 메뉴 `Programs\Askewly\AskewlyDesign.lnk` + 바탕화면 바로가기 → 실행 관측 `docs/research/assets/qa2-step1-installed-launch.png` (창 제목 "AskewlyDesign Canvas", onboarding 빈 상태)

## Result

Completed. 리네임 후 첫 재패키징이 AskewlyDesign 이름으로 전 산출물을 생성하고 verify:package를 통과했다. installer lifecycle 스크립트가 설치→실행(renderer 보안 계약 검증)→언인스톨→잔여물 검사를 PASS로 관측했고, 이어 dogfooding용 영구 설치를 수행해 설치 경로·시작 메뉴/바탕화면 바로가기·실행 화면을 확인했다. 미서명 dev 인스톨러로 로컬 사용자 범위 설치이며 코드 변경은 없다.
