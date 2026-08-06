# M34 완료 보고 — Around 재판정 (C → A)

Date: 2026-08-06 · Plan: `plans/2026-08-06-m34-around-reverdict.md` · 판정서: `research/2026-08-06-m34-around-reverdict.md`

## 1. 결과

M11 이 2026-08-01 에 **C(보류)** 로 닫으며 남긴 재판정 조건("이식 가능한 제품/패키징 방향이 milestone 로 승격되면 A 재검")이 충족됐음을 코드로 확인하고 **A** 로 재판정했다. 흡수는 판정서가 지정한 2건으로 한정 — ① `knowledge/customizer-and-packaging.md` 신설(무엇을 컨트롤로 열고 무엇을 고정하는가, 톤 프리셋이 색이 아니라 radius 까지 묶는 이유, 생성물이 "복사 가능"하다는 것의 조건, 의도적 미보유 2건) ② `docs/PRD.md` 「제품 약속」 신설(스택·자산·검증·왕복). absorption-criteria 행 갱신 + ledger 1행 + llms 등재·재생성. **코드·토큰·registry 변경 0.**

## 2. 이슈와 해결

- **판정의 성격이 M11 시점과 달랐다.** 조건 충족을 확인하러 갔더니 Around customizer 원리가 지목한 세 요소(토큰을 만질 수 있는 컨트롤로 / 생성 스타일 복사 가능하게 / 타이포·radius 포함)가 **이미 킥스타트에 구현돼 있었다**. 그래서 흡수가 "새 기능 도입"이 아니라 "이미 만든 것에 규칙 붙이기"가 됐고, A 이면서도 코드 변경이 0이다. 이 성격 차이를 판정서·ledger에 명시했다.
- **Failure probe 가 제 역할을 했다.** 조건 충족을 로드맵 문구로 판단했다면 "이식 축이 열렸다"까지만 적고 끝났을 것이다. 코드를 열어 질문 3종·프리셋 구성·생성 변수 61종을 확인한 덕에 흡수 대상이 "기능"이 아니라 "규칙"임이 드러났다.
- **결론 편향 방어**: 승인이 "흡수까지"였으므로 A 로 기울 위험이 있었다. B·C 조기 종료 경로를 계획에 미리 박아 두고, 판정 근거를 코드·브라우저 실측에만 걸었다. 결과적으로 A 가 나왔지만 근거는 승인이 아니라 실측이다.
- **드리프트 없음** — 흡수 대상 2건 외 확장 없음. 실시간 프리뷰·타이포 배수 조절은 "의도적 미보유"로 문서에 상한만 적고 구현하지 않았다(범위 밖).
- **크기 회고**: 2 step · 문서 산출물 4개 · 통합 검증(llms 배포본 대조) 보유. changeset 디렉터리는 만들지 않았다 — 코드 변경 0이라 기록 위치가 `research/`·`knowledge/` 다.

## 3. 증거

- `research/2026-08-06-m34-around-reverdict.md` · `knowledge/customizer-and-packaging.md` · `docs/PRD.md` 「제품 약속」 · 커밋 85d9eee(step-1) · 6e0a5cf 계열(step-2)
실표면: 웹 — https://around.createx.studio/ 를 실브라우저(Playwright)로 열어 카탈로그 IA·`Around customizer` 절·라이트/다크 이미지 쌍·타이포 스케일 셀렉트(`.75`~`1.375`)·`Buy now` 패키지 링크가 **모두 살아 있음을 접근성 스냅숏으로 확인**(접근 2026-08-06, 2026-08-01 캡처 대비 무변동). 우리 쪽 표면은 `packages/cli/src/kickstart.ts` 를 실제로 파싱해 질문 3종·`CANVASES` 3종(각 light/dark + radius `0.5`/`0.625`/`0.375rem`)·`ACCENTS` 5종·`FONT_STACKS` 3종을 값으로 뽑아 확인했다.
배선: none — 장치 신설 없음(문서 4건, 스크립트 변경은 llms 등재 1행뿐이며 그 발화 증거는 아래 재현의 `check-llms-sync` PASS + 배포본 파일 실재다).
재현: `node scripts/generate-llms-txt.mjs && node scripts/check-llms-sync.mjs` → PASS · `ls examples/ui-vocabulary-site/public/llms/knowledge/customizer-and-packaging.md` → 실재 · `grep -c customizer-and-packaging examples/ui-vocabulary-site/public/llms.txt` → 1 · `git diff HEAD --stat tokens/ examples/ui-vocabulary-site/registry.json` → 변경 없음
평가 못 함: Around 의 customizer 가 **내부적으로 무엇을 생성해 주는지**(복사되는 산출물의 실제 형태)는 확인하지 않았다 — 유료 템플릿 구매 영역이라 데모 페이지의 컨트롤 존재까지만 봤다. 따라서 "복사 가능성" 규칙은 우리 구현 기준으로 쓴 것이고 Around 와의 동등 비교가 아니다.
