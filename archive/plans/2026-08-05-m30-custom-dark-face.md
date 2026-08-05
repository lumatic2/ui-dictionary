# PLAN — M30: `custom` 테마의 다크 판본 — 4번째 선택지가 레포 토큰의 다크 얼굴도 따라간다

> 생성: 2026-08-05 (같은 날 **전면 재작성** — 아래 「재작성 경위」) · 갈래: goal `docs-block-and-theme-derive` (2/2 — M29 연쇄) · scope: `/pt` 의 4번째 테마 선택지 `custom` 이 대상 레포 `DESIGN.md` 의 **다크 오버라이드까지 읽어** 라이트/다크 두 얼굴을 낸다. **기존 canonical 3종(dark·light·askewly)은 건드리지 않는다.**
Status: approved (사용자 승인 2026-08-05 "ㄱㄱ" — M29 와 함께 1회 승인, 결정 C 재정의 = custom 테마의 다크 판본)

## 재작성 경위 (2026-08-05 — 큐 문구가 사용자 의도와 달랐다)

초안은 큐 항목 "dark/light SSOT 파생"을 문자 그대로 읽어 **기존 canonical `dark`·`light` 테마 2종을 SSOT 파생물로 교체**하는 계획이었다. 사용자 확인 결과 의도는 정반대에 가까웠다 — **"기존 3종을 수정하는 게 아니라, 4번째 선택지를 넣어서 거기가 해당 레포 디자인 토큰을 따라가게"** (2026-08-05).

그 4번째 선택지는 **이미 있다.** M17(2026-08-04)이 만든 `custom` 테마 + 브랜드 탐지 배선이 그것이고, 실측으로 확인했다(아래 입력 실측 ①). 즉 **큐 항목 ③ 은 이미 충족됐고, 큐 문구가 다른 물건(문서상 잔여 줄)을 가리키고 있었다.** 남은 진짜 빈 곳은 하나 — `custom` 이 **라이트 얼굴만** 만든다는 것. 이 계획서는 그 하나만 다룬다.

- 교훈(다음 계획에 승계): 큐 문구는 그것을 적은 시점의 관심사를 담는다. **문구를 실행 대상으로 삼기 전에 사용자 의도와 대조한다** — M17 이 같은 성격의 오독으로 계획을 두 번 재작성했고(형태가 여럿인 goal), 이번이 세 번째다.

## 북극성 → milestone → step (위계)

- **북극성**: Askewly Design (← `CLAUDE.md` 「북극성」 절) — "화면 UI든 슬라이드·지면 산출물이든 **같은 토큰 SSOT에서 출발**한다"는 앞절, 그리고 "어디에 가든 내 디자인 색채를 입힐 수 있는 이식 가능한 제품" 축. `custom` 테마는 **임의의 레포가 자기 토큰으로 덱을 만드는 경로**다 — 이식성이 실제로 발현되는 자리이고, 다크 얼굴이 없으면 그 이식이 절반이다.
- **왜 이 크기인가**: 2 step 이다. 리프 판정상 milestone 하한(≥2 독립 step + 가로지르는 통합 검증 1개 + 단독 capability)에 **간신히 걸친다** — 솔직히 작다. 그래도 step 으로 낮추지 않는 이유는 ⓐ 변환기 코드와 스킬 배선·문서가 다른 레이어이고 ⓑ 실덱 다크 렌더 사람 관측이 가로지르는 통합 검증으로 따로 서기 때문이다. 완료 보고에서 크기 회고로 재판정한다.
- **입력 실측 (2026-08-05 — 재작성 시 전건 재확인)**:
  - ① **4번째 선택지는 실재하고 동작한다.** `~/.claude/skills/pt/SKILL.md` §6 에 `custom: 브랜드 DESIGN.md 에서 변환한 덱 로컬 테마` 가 dark·light·askewly 와 나란히 등재돼 있고, 같은 절의 「프로젝트 브랜드 탐지(M17)」가 "덱 주제가 프로젝트면 그 루트 `DESIGN.md` 를 먼저 찾아 custom 을 **기본 제안**"까지 배선한다(§7-5 절차에서 호출). **실행 확인**: `node design-md-to-theme.mjs ~/projects/ui-dictionary/DESIGN.md out.json` → `3-tier, 29 vars, name: Askewly Design`, `accent-start #6f2dbd`(SSOT askewly violet), 대비 18.60/15.36/6.82:1 전건 AA 통과. `--self-test` 6/6.
  - ② **정확한 빈 곳 1개**: `DESIGN.md` 는 L143 `themes:` → L145 `dark:` → **L146~182 다크 오버라이드 37행**을 이미 싣고 있는데(이 37 은 `tokens/askewly.tokens.json` 의 semantic 색 토큰 **37/37 다크 보유**와 정확히 일치 — 다크 정보는 온전하다), **변환기가 `themes` 를 한 번도 읽지 않는다**(grep 0건). 그래서 `custom` 은 base(라이트)만 본다.
  - ③ **다크의 예상 함정 하나는 이미 막혀 있다.** SSOT 다크에서 `action.primary` 는 `gray.1`(거의 흰색)이라 그대로 액센트가 되면 무채색 액센트가 나온다. 그런데 변환기의 액센트 수집(L191~195)이 **`isNeutral` 로 무채색을 이미 배제**하므로, 다크에서는 `action.secondary`(askewly mint)·`border.accent`(orchid)·`emphasis.solid`(indigo.500)로 자연히 넘어간다. 즉 구조는 다크를 감당한다 — 남는 것은 **어느 순서가 보기 좋은가**(취향)이고 그래서 step-2 에 관측 게이트를 둔다.
  - ④ **변수 계약**: `templates/src/theme.mjs` 의 `REQUIRED_THEME_VARS` **29종**, `customThemeErrors` 가 누락·미지 키를 둘 다 막는다. 다크 산출물도 같은 29종을 정확히 채워야 한다.
- **조사 인용 (`research/` 선조회 — M12 규약)**: 신규 외부 조사 없음 — **조사 불요 · 사유**: 판정 기준(`slide-spec.md` §5 판정 A)과 구현 선례(M17)가 이미 있고, 필요한 것은 기존 변환기의 국소 확장이다. `research/2026-08-03-m16-media-token-audit.md` 는 방법론 선례로만 인용한다(**주의**: 그 문서의 "대응 부재 16" 전수 대조표는 `askewly` 테마 29변수에 대한 것이지 dark/light 나 custom 에 대한 것이 아니다 — 계획 검증에서 정정된 인용 범위).

## run 전 scope 결정

- **포함**: ① 변환기의 `themes.dark` 오버라이드 판독 + `--mode light|dark` 출력 + 두 모드 WCAG AA 자기검사 + self-test 확장 ② `/pt` 스킬 배선·문서 갱신(§6·`style-system.md` 커스텀 테마 절) + **실덱 다크 렌더 사람 관측** + 배포 + `slide-spec.md` §6 잔여 줄 정리 + evidence.
- **제외**: **canonical 3종(`dark`·`light`·`askewly`) 수정 — 명시 제외**(사용자 의도 확인 2026-08-05, M17 정정 "이미 잘 만들어진 테마" 승계) · SSOT 토큰 값 변경 · 슬라이드 레이아웃·export 경로 · 덱 런타임의 라이트/다크 실시간 토글(테마는 덱 생성 시 하나를 고른다 — 이 구조를 바꾸지 않는다) · `slide-spec` §6 의 나머지 두 잔여 항목(슬라이드 청사진 0건 · 게이트 자동 호출) · ui-dictionary 사이트 표면.
- **연쇄**: 없음 — goal `docs-block-and-theme-derive` 의 마지막 milestone. 완료 시 큐 잔여(책 스터디·D2·Around·Figma 후속 3건)는 `/harness-done` 에서 후보 제시만.
- execution mode: continuous
- **중단점**: completed / 증거가 있는 blocked / decision_required / risk_gate / user_stopped. **human gate 1개** — step-2 다크 덱 렌더 관측.
- rollback/cleanup: 커밋 단위 revert. **cross-repo 주의**: 소스는 `~/projects/custom-skills/promoted/pt/`, 배포본 `~/.claude/skills/pt/` 는 **직접 편집 금지**(글로벌 규약) — `bash ~/projects/custom-skills/setup.sh` 로만 배포. 관측용 정적 서버는 종료 시 정리(node 자식 잔존 주의).

## 스캐폴딩 결정

- source-of-truth: 변환기 SSOT = `custom-skills/promoted/pt/scripts/design-md-to-theme.mjs` · 테마 변수 계약 SSOT = `custom-skills/promoted/pt/templates/src/theme.mjs`(`REQUIRED_THEME_VARS`·`customThemeErrors`) · 스킬 절차 정본 = `promoted/pt/SKILL.md` §6 + `references/style-system.md` · 매체 판정 정본 = `ui-dictionary/docs/design-system/slide-spec.md` §5·§6 · 변환 입력 = 대상 레포의 `DESIGN.md`(ui-dictionary 의 경우 `tokens/askewly.tokens.json` 의 생성물).
- 검증: step 별 Verify + **통합 검증** = ui-dictionary `DESIGN.md` 로 `--mode dark` 테마를 만들어 **실덱을 다크로 렌더**하고 사람이 관측한다(라이트 판본과 나란히). 회귀 = `--self-test` 전건 + **모드 미지정 호출이 M17 시점과 동일 산출**(브랜드 탐지 경로 무회귀, 2케이스) + canonical 3종 **diff 0**.
- 배포/운영: `custom-skills` 커밋 + `bash ~/projects/custom-skills/setup.sh` 배포 + **배포본에서 self-test 재확인**(M17 완료 감사 선례). ui-dictionary 쪽은 문서 커밋(`slide-spec.md`) + llms 재생성. push 는 세션 일괄.
- 자기선언 도메인 — **다크는 base 위의 오버라이드 병합**: `themes.dark` 의 flat 키(`color.semantic.…` 형태)를 base 토큰 트리에 덮어 해석한 뒤 **같은 파생 규칙**을 태운다. 다크 전용 규칙 세트를 새로 만들지 않는다 — 규칙이 둘이 되면 어느 쪽이 정본인지 알 수 없어진다.
- 자기선언 도메인 — **`--mode` 는 하위호환 확장**: 모드 미지정 호출은 지금과 **완전히 동일한 산출**(base = 라이트 단일)을 유지한다. M17 이 깐 브랜드 탐지 경로가 조용히 바뀌면 안 된다.
- 자기선언 도메인 — **`themes.dark` 가 없는 DESIGN.md 의 처리**: 다크 정보가 없는 프로젝트에 `--mode dark` 를 걸면 **조용히 라이트를 내놓지 않는다** — 그 사실을 알리고 exit≠0(변환기의 기존 계약 "해석 못 한 필수 키는 조용히 기본값을 채우지 않는다"와 같은 결). 스킬 쪽은 그때 canonical `dark` 를 제안하면 된다.
- 검토 후 제외: canonical 테마 손대기(사용자 명시 제외) · 새 변환기 신설(기존 것이 양식 2종을 이미 판독 — 중복 정본 금지) · 덱 런타임 테마 토글 · SSOT 토큰 값 조정.

## 결정 로그

- status: resolved
- **결정 C(재정의) — ③ 자리에 무엇을 넣는가 [사용자 소유 · 확정 2026-08-05]**: **`custom` 테마의 다크 판본.** 초안의 결정 C(기존 dark/light 를 SSOT 파생으로 교체, "현행 룩 유지" 제약)는 **의도 오독 위에 세워진 것이라 폐기**한다. 그에 딸렸던 하위 결정(파생 하한 10종·ΔE 임계·매체 전용 상수 분리)도 함께 폐기 — 기존 테마를 안 건드리므로 성립하지 않는다.
- **남은 사용자 결정은 취향 1건이고 관측 게이트로 미룬다**: 다크에서 액센트 순서(mint / orchid / indigo 중 무엇이 accent-start 인가)는 실물을 봐야 정해진다. step-2 관측에서 지목받는다 — 계획 단계 추정으로 채우지 않는다.
- **기술 결정 (사전 소진 — 재질문 없음)**:
  - ① **파생 입력 = 대상 레포 `DESIGN.md`** (원본 토큰 JSON 직접 판독 아님). 사슬을 하나로 유지한다 — 변환기는 이미 이 입구를 갖고 있고, 다른 레포는 `DESIGN.md` 만 갖는다.
  - ② **다크 판독 = `themes.dark` 오버라이드 병합 후 동일 규칙** (위 자기선언).
  - ③ **`--mode` 기본값 = 미지정 시 현행 동작** (위 자기선언).
  - ④ **다크 정보 부재 시 exit≠0** (위 자기선언).
  - ⑤ **액센트 무채색 배제는 기존 `isNeutral` 을 그대로 쓴다** — 입력 실측 ③ 이 확인했듯 구조가 이미 다크를 감당한다. 다크 전용 예외를 새로 만들지 않는다.
- **위임 결정**: **skip** — 국소 코드 확장 + 사람 관측이라 위임 이득이 없다.

## Step 트리

- [x] **step-1 — 변환기 다크 판독 + `--mode` 출력**
  - Artifact: `custom-skills/promoted/pt/scripts/design-md-to-theme.mjs` — ⓐ `themes.dark` flat 키 오버라이드를 base 토큰 트리에 병합 판독(기술 결정 ②) ⓑ `--mode light|dark` 옵션(미지정 = 현행 동작, 기술 결정 ③) ⓒ 다크 정보 부재 시 명시 실패(기술 결정 ④) ⓓ 두 모드 각각 WCAG AA 자기검사 ⓔ `--self-test` 케이스 추가(다크 병합·모드별 산출 상이·29종 충족·다크 부재 실패·AA).
  - Files: edit ~/projects/custom-skills/promoted/pt/scripts/design-md-to-theme.mjs.
  - Risk: 기계적 (기존 파서 위의 국소 확장. 회귀 위험은 "미지정 호출의 동작 변화" 하나이고 self-test 가 그것을 잡는다)
  - Dependencies: 없음
  - Verify: `node design-md-to-theme.mjs --self-test` 전건 PASS(기존 6 + 신규) + ui-dictionary `DESIGN.md` 로 `--mode dark` / `--mode light` 각각 **29종 정확히**(`customThemeErrors` 통과) + 두 산출물이 **서로 다름**(다크가 라이트 복사가 아님을 값 비교로 확인) + 다크 AA 자기검사 PASS + **모드 미지정 산출이 재작성 전 실측값과 동일**(`accent-start #6f2dbd`·`bg-primary #fafafa`·대비 18.60/15.36/6.82:1).
  - Failure probe: ⓐ flat 키(`color.semantic.surface.base` 형태)를 중첩 경로로 해석 못 해 조용히 base 가 남는 경우 — 다크·라이트 산출물이 같아지면 FAIL(위 Verify 의 "서로 다름"이 이것을 잡는다). ⓑ 중괄호 토큰 참조가 다크 오버라이드 안에서 미해석돼 문자열이 그대로 나가는 경우 — 출력에 `{` 가 남으면 FAIL. ⓒ 다크에서 액센트가 무채색으로 떨어지는 경우 — `isNeutral` 배제가 실제로 작동하는지 산출물의 `accent-start` 채도로 확인(입력 실측 ③ 의 예측 검증).
  - Commit: changeset `20260805-m30-custom-dark-face` (README 절: step-1).

- [x] **step-2 — 스킬 배선·문서 + 실덱 다크 렌더 관측 + 배포**
  - Artifact: `SKILL.md` §6 `custom` 항목과 브랜드 탐지 문단에 **라이트/다크 선택**을 명시(덱 대상이 프로젝트면 두 얼굴을 제안, 다크 정보 없으면 그 사실 고지 후 canonical 제안) + `references/style-system.md` 커스텀 테마 절 갱신 → **ui-dictionary `DESIGN.md` 로 다크 덱을 실제로 만들어 실브라우저 렌더**, 라이트 판본과 나란히 **사용자 관측**(액센트 순서 지목받음) → 지목 반영 → `setup.sh` 배포 → `ui-dictionary/docs/design-system/slide-spec.md` §6 잔여 줄 정리(무엇이 충족됐고 무엇이 애초에 다른 물건이었는지 1~2줄) + llms 재생성 → `evidence/docs-block-and-theme-derive/m30-custom-dark-face.md`.
  - Files: edit ~/projects/custom-skills/promoted/pt/SKILL.md. edit ~/projects/custom-skills/promoted/pt/references/style-system.md. edit docs/design-system/slide-spec.md. write evidence/docs-block-and-theme-derive/m30-custom-dark-face.md. (지목 시) edit ~/projects/custom-skills/promoted/pt/scripts/design-md-to-theme.mjs.
  - Risk: 위험 (사람 취향 관측이 유일한 판정자 — 확인 전 완료 선언 금지. M17 에서 같은 성격의 판단이 두 번 뒤집혔다)
  - Dependencies: step-1
  - Verify: **canonical 3종 diff 0**(무변경 확인) + 다크 덱 실브라우저 렌더 콘솔 에러 0 + 라이트/다크 비교 스크린샷 ≥2장 + **사용자 관측 통과** + `setup.sh` 배포 후 **배포본 self-test 전건 PASS** + 소스↔배포본 hash 대조 + `check-llms-sync.mjs` PASS.
  - Failure probe: ⓐ 배포본만 고치고 소스를 안 고치는 사고(글로벌 규약 위반) — 배포는 `setup.sh` 경유만, 배포 후 hash 대조로 확인. ⓑ 다크 액센트가 관측에서 기각되는 경우 — 순서 규칙을 바꿔 재생성하고 재관측(변환기 국소 수정이라 되돌림이 싸다). ⓒ 다크 본문 대비가 AA 미달로 나오는 경우 — 취향보다 접근성이 우선, 변환기 자기검사가 이미 exit≠0 으로 막는다.
  - Commit: changeset (README 절: step-2).

## 검증/DoD

- **DoD**: `/pt` 의 4번째 선택지 `custom` 이 대상 레포 `DESIGN.md` 로부터 **라이트·다크 두 얼굴**을 만들고, 실덱 다크 렌더가 사용자 관측을 통과한다. **canonical 3종은 무변경**이고, 모드 미지정 호출(M17 경로)은 산출이 동일하다. 다크 정보가 없는 프로젝트에는 조용한 폴백 없이 명시 실패한다.
- **실패 모드 확인**: ① 다크 미병합으로 두 모드가 같아짐(step-1 probe ⓐ) ② 참조 미해석 문자열 유출(step-1 probe ⓑ) ③ 다크 액센트 무채색 추락(step-1 probe ⓒ) ④ 배포본 직접 편집 사고(step-2 probe ⓐ) ⑤ 관측 기각 시 재생성·재관측(step-2 probe ⓑ) ⑥ 다크 대비 AA 미달(step-2 probe ⓒ).
- **Evidence**: `evidence/docs-block-and-theme-derive/m30-custom-dark-face.md` (+ 라이트/다크 비교 스크린샷)
- **회귀 게이트**: `--self-test` 전건 · 모드 미지정 호출의 재작성 전 실측값 재현 · canonical 3종 diff 0 · 배포본 self-test · llms 동기화 PASS.

## 수치 출처

- **29 (`REQUIRED_THEME_VARS` 전건)** — `node -e "import('file:///C:/Users/yusun/projects/custom-skills/promoted/pt/templates/src/theme.mjs').then(m=>console.log(m.REQUIRED_THEME_VARS.length))"` (2026-08-05).
- **37 (다크 오버라이드 행) / 37 (semantic 색 토큰의 다크 모드 보유)** — 전자는 `DESIGN.md` L146~182 계수, 후자는 `tokens/askewly.tokens.json` 의 `color.semantic` 하위 `$value` 노드를 재귀 순회해 `$extensions."com.askewly.modes".dark` 유무를 계수(2026-08-05, 누락 0). 두 수가 일치하는 것이 "다크 정보가 온전히 실렸다"의 근거다.
- **6/6 (self-test) · 29 vars · 대비 18.60/15.36/6.82:1** — `cd ~/.claude/skills/pt/scripts && node design-md-to-theme.mjs --self-test` 및 `node design-md-to-theme.mjs ~/projects/ui-dictionary/DESIGN.md <out>` 실행 출력(2026-08-05).

## finding 큐

- (실행 중 발견분을 여기에 append)

## 진행 로그

- 2026-08-05 **전면 재작성** — 사용자 의도 확인 결과 큐 문구("dark/light SSOT 파생")가 다른 물건을 가리켰다. 의도는 "기존 3종 수정이 아니라 4번째 선택지가 레포 토큰을 따라가게". 그 선택지(`custom`)는 M17 에 이미 있고 실행으로 확인됨(29 vars·AA 통과·self-test 6/6). 남은 빈 곳 = 다크 얼굴 부재 하나. 초안의 결정 C 와 하위 기술 결정(파생 하한·ΔE 임계·상수 분리)은 전제가 사라져 폐기.
- 2026-08-05 초안 계획 검증 반영(폐기된 초안에 대한 것 — 기록만 남김) — fresh 검증자가 초안의 "primitive 근사원 존재" 주장을 OKLCH 실측으로 반증했고, 파생:상수 비율 하한 부재로 DoD 가 비는 구멍을 지적했다. 재작성으로 두 지적 모두 대상 소멸.
- 2026-08-05 초안 작성 — 결정 C(파생하되 현행 룩 유지) 기반. **폐기됨.**
