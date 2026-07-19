# 이월 finding 장부

> milestone·changeset이 남긴 미해결 항목의 적재처. `ROADMAP.md`는 상태판(≤150줄)이라 여기 모은다.
> 규칙: **닫힌 항목은 지우지 말고 `[x]`로 표시하고 닫은 milestone을 적는다** — 지우면 같은 결함이 새 발견으로 되돌아온다.
> 수집: 2026-07-20 (template-production-hardening TH1~TH9 전수 대조 — 코드로 현행성 확인해 이미 닫힌 항목은 제외).

## A. 인쇄 규격 — TH11에서 닫았다 (완료 2026-07-20)

- [x] `catalog.ts`의 `SAFE_AREA_INSET = 24`가 px 고정값이다. 도련·안전영역은 mm 개념이라 px 상수로는 발주 규격을 표현할 수 없다. (TH1·TH2) → **닫힘**: 규격 mm 유래 `safeMarginPx`로 대체 (TH11 step-1)
- [x] 도련(bleed) 개념 자체가 없다 — `business-card-vertical`의 인물 슬롯이 안전영역 때문에 인셋 배치이고 full-bleed가 불가능하다. (TH2) → **닫힘**: `bleedPx`·`printSheetGeometry`, SVG가 도련 포함 지면으로 나간다 (TH11 step-1·3)
- [x] 포스터·인포그래픽에 규격 프리셋이 없어 `matchPrintSpec`이 `null`을 반환한다. (TH2) → **닫힘**: A계열 4종 + 인쇄판 청사진 2종 (TH11 step-2)
- [x] 포스터 캔버스 1080×1350은 소셜 비율(4:5)이다 — 인쇄 표준 비율로 이전 필요. (TH2) → **닫힘(방향 변경)**: 소셜 비율은 실사용 산출물이라 보존하고, 인쇄용 A3 청사진을 따로 신설했다 (TH11 step-2)
- [x] HTML 내보내기에 `@page` 여백·재단 표시 규약이 없다. `surface.canvas`가 프레임 배경으로만 들어간다. (TH7) → **닫힘(경로 변경)**: `@page`의 bleed/marks는 브라우저 미지원(리서치 3.1~3.3). SVG에 벡터로 그린다. HTML은 화면 미리보기로 남는다 (TH11 step-3)

## B. 편집기 결함 — TH10에서 닫는다

- [ ] 토큰 모드 드롭다운이 문서 상태를 잘못 보고한다 — 문서가 `askewly.warm`인데 옵션에 `askewly.default`/`askewly.dark` 둘만 하드코딩돼 첫 항목이 선택돼 보인다. (TH7)
- [ ] `validateTokenMode`가 **모양만 본다**(`/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/`) — 존재하지 않는 세트(`foo.bar`)도 통과시켜 조용히 미해석 상태로 들어간다. (2026-07-20 정정: 이 항목은 원래 "편집기 세트 2개만 허용"으로 잘못 적혀 있었다. TH10 착수 전 실측으로 확인해 정정 — 기록을 믿고 계획을 세우면 틀린 문제를 푼다.)
- [ ] `App.tsx`의 `storageKey`가 `baseDocument.id` 기준이라 템플릿을 열어도 저장 키가 fixture 문서 키다 — 저장·재적재가 템플릿을 따라가지 않는다. (TH3)
- [ ] 뷰포트 크기 토글을 건드리면 `baseDocument`가 재생성돼 열어둔 템플릿이 fixture로 되돌아간다. (TH3)
- [ ] 토큰 **값** 개별 편집 UI가 없다 — 세트 전환만 가능하고 `resolveProjectTokens`의 override 경로는 계약·테스트만 있다. (TH3)
- [ ] `structureSummary`가 카탈로그에 없는 id를 만나면 조용히 '구조 정보 없음'을 표시한다 — 그 상태면 갤러리 카드 자체가 잘못된 것이므로 별도 가드가 필요하다. (TH3)
- [ ] `validateTemplateProject`가 형태 깨진 입력에 구조화된 오류 코드가 아니라 런타임 `TypeError`를 던진다. 차단은 되나 진단이 안 된다. (TH3)
- [ ] 편집기 chrome 자체의 다크모드가 없다 — `askewly.ink`는 캔버스 콘텐츠용이다. (TH3)

## C. 문서·장면 모델

- [ ] 컴파일러가 매니페스트 전체를 장면에 실어 템플릿이 안 쓰는 소재까지 포함된다(포스터 문서에 `starter-portrait`). 문서 크기·왕복 비용 증가. (TH7)
- [ ] `TemplateProject.assets`와 `scene.assets`가 이중으로 존재한다 — 편집기에서 소재를 교체하면 둘이 어긋날 수 있다. (TH7)
- [ ] `e2e-manifest.json`이 닫힌 horizon 경로(`evidence/template-production-system/`)에 계속 기록된다. (TH4)

## D. 타이포 정밀도 — TH8(hallmark 흡수)과 겹친다

- [ ] 글자 크기 **상한**(슬롯 높이의 45%)이 타당한 비율인지 검증한 적 없다. (TH9)
- [ ] 여러 줄 텍스트의 세로 정렬 규약이 없다 — `tspan`의 `dy`가 첫 줄 baseline과 합쳐지면 블록이 슬롯 하단으로 밀린다. (TH9)
- [ ] `maxLines`를 선언한 청사진이 0개다 — 헤드라인이 3줄로 접히는 것을 막을 수단이 선언만 있고 안 쓰인다. (TH9)
- [ ] HTML과 SVG의 줄 수가 다를 수 있다 — 계약은 "둘 다 넘치지 않는다"까지이고 줄 수 일치는 보장하지 않는다. (TH9)
- [ ] 문자폭 실측 표본이 Windows Chrome 1종이다 — 인쇄 발주 전 실제 조판 환경에서 재측정 대상. (TH9)
- [ ] `thin` 계열(`i`·`l` 다수) 문자열에서 +17.4% 과대추정 — 글자가 필요보다 작아진다. (TH9)
- [ ] 한글 금칙어(조사·괄호 분리 금지)가 미구현이다 — 현재 어절 단위까지만 끊는다. (TH9)
- [ ] 넘침 게이트의 내용 변주 4종은 손으로 고른 것이다 — TH6 실사용 문구를 추가할 대상. (TH9)
- [ ] `role`·`contact` 슬롯에 `fontFamily` 바인딩이 없어 `system-ui`로 떨어진다 — 의도인지 누락인지 미판정. (TH4)

## E. 게이트 한계

- [ ] 산출물 검사는 "값이 **어딘가에** 있다"까지다 — 어느 노드에 붙었는지 안 보므로 **색이 서로 뒤바뀐 경우는 못 잡는다**. (TH4)
- [ ] SVG 화면 요소 수를 backdrop `<rect>` 1개를 빼서 센다 — 내보내기 backdrop 규약이 바뀌면 이 상수도 함께 고쳐야 한다. (TH4)
- [ ] `exports`의 sha256을 12자로 자른다 — 동일성 비교용이지 무결성 보증용이 아니다. (TH4)
- [ ] HTML은 오류 관용 문법이라 파서가 거의 실패하지 않는다 — 구조 단언이 사실상 유일한 방어선이다. (TH4)

## F. 운영 잡음

- [ ] `scripts/generate-llms-txt.mjs`에 300자 초과 라인 2건(66행·154행) — 줄 길이 가드 감시 밖. (TH1)
- [ ] `apps/template-studio` 빈 디렉터리 껍데기가 남았다 — 내용물은 `archive/`로 옮겼으나 다른 프로세스가 경로를 붙잡고 있다. git 추적 대상은 아니다. (TH3)

## 이 horizon 밖

- 데스크톱 브리지 모드 human Undo/Redo 활성화 (QA2)
- 신뢰 프로젝트 소실 시 에러 표면 — 현재 조용한 데모 폴백 (QA2)
- 프로덕션 셸 정리: 기본 1,000-node fixture·dev 계기판 제거 (QA2)
- shortcuts dialog 배경 콘텐츠 inert/aria-hidden (키보드 트랩은 완료)
- Codex Windows workspace-write sandbox HTTPS 차단 — headless `codex exec`에서 토큰 fetch 불가 (AD1)
