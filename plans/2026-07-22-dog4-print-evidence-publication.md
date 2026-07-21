# PLAN — DOG4 인쇄 근거가 에이전트 경로에 실린다

> 생성: 2026-07-22 · 갈래: product · scope 결정: 인쇄·매체 분류 문서를 만들고 등재한다 — 인쇄 파이프라인 기능은 손대지 않는다
Status: approved (2026-07-22 — 사용자가 horizon `design-output-gates` 6 milestone 묶음을 승인, horizon 전체 연쇄. horizon `2026-07-design-output-gates` 착수 브리핑에서 DOG4 milestone 명세·step 트리·changeset 번호가 확정 지시됨. 사용자 소유 미결 결정 5·6은 DOG3 착수 대상이고 이 milestone에는 걸리지 않는다)

## 북극성 → horizon → milestone → step (위계)
- **북극성**: Askewly Design을 공개 참고 시스템이자 에이전트가 직접 쓰는 구현 시스템으로 만든다. (← `OBJECTIVE.md`)
- **horizon**: 산출물이 좋은지 기계가 잰다, 매체마다 다른 자로 (← `plans/horizons/2026-07-design-output-gates.md`)
- **milestone**: DOG4 — 인쇄 근거가 에이전트 경로에 실린다.
- **리서치 입력**: `research/2026-07-20-template-production-hardening-print-spec.md`(인쇄 규격 계약의 사실 근거), horizon "매체 쪽 실사"(2026-07-22, `docs/design-system/`에 인쇄·발표 근거 실질 0건 확인), `plans/2026-07-21-vl2-vocabulary-publication.md`(등재·배포본 검증 규율 — VL8: 로컬 존재 ≠ 배포)

## 왜 이게 먼저인가

`packages/template-core/src/print-spec.ts`에 인쇄 규격 계약이 이미 **실재한다** — 한국 명함 두 표준(90×50mm/85×55mm), 미국 표준(88.9×50.8mm), ISO A계열(A4~A1), 도련 3mm, 안전영역 3mm, 게시 여백 15mm(포스터 전용), 300dpi, mm→px 환산 공식. 근거 리서치(`research/2026-07-20-template-production-hardening-print-spec.md`)도 있다.

그런데 이 지식은 에이전트가 실제로 fetch하는 경로(`docs/design-system/` → `https://ui.askewly.com/llms.txt`) **밖에** 있다. 직전 horizon `vocabulary-in-use`의 VL2와 구조가 같다 — 용어 562개가 사전 파일 안에는 있었지만 llms.txt 밖에 있었다. 여기서는 인쇄 규격이 코드 안에는 있지만 문서 경로 밖에 있다. "지식이 없다"가 아니라 "지식이 에이전트 경로 밖에 있다"는 것이 갭의 정체다.

동시에 2026-07-20 어록 PDF 사고가 보여준 것은 갭이 하나 더 있다는 사실이다 — 화면용 warm canvas 토큰을 지면에 그대로 깔아 `@page` 여백이 흰색으로 잘렸다. askewly-design 스킬의 화면 게이트는 전부 통과했는데 결과물은 깨졌다. 매체마다 다른 자가 필요하다는 것이 이 milestone의 두 번째 축이다.

이 milestone을 먼저 하는 이유: DOG5(슬라이드 신설)·DOG6(마무리 절차 배선)이 매체 분류 축을 전제로 한다. 인쇄가 첫 매체이자 유일하게 기존 계약이 이미 있는 매체이므로, 분류 축과 등재 규율을 여기서 세우고 DOG5가 그 틀에 슬라이드를 얹는다.

## Scope Boundary

- **포함**: `print-spec.ts` 계약의 문서 승격(코드→문서 드리프트 방지 포함), 화면/인쇄/발표 3매체 분류 축 문서, `llms.txt` 등재, 배포본 fetch 검증.
- **제외**:
  - 슬라이드(deck) 매체 신설 — DOG5.
  - `SKILL.md`·entry-protocol에 매체별 게이트 분기 배선 — DOG6.
  - 인쇄 파이프라인 기능 추가(PDF export·Prince/Paged.js 도입 등) — 이 milestone은 **기존 계약을 문서로 승격**하는 것이지 인쇄 렌더링 경로를 새로 만드는 것이 아니다.
  - `print-spec.ts` 코드 자체의 값 변경 — 코드는 정본으로 그대로 두고 문서가 따라간다(스캐폴딩 결정 참조).
- execution mode: continuous
- 중단점(stop points): completed / 증거가 있는 blocked / decision_required / risk_gate / secret_required / external_authority_required / user_stopped
- rollback/cleanup: step별 독립 revert. `docs/design-system/print-spec.md`는 생성물이므로 되돌릴 때 생성기(`scripts/generate-print-spec-doc.mjs`)부터 되돌리고 재실행한다. `llms.txt` 등재를 되돌릴 때는 `scripts/generate-llms-txt.mjs`의 `FIXED_ASSETS` 항목을 제거하고 재생성한다 — `public/llms.txt`를 손으로 고치지 않는다.

## 스캐폴딩 결정

- source-of-truth: `packages/template-core/src/print-spec.ts`가 인쇄 규격 값의 유일한 정본이다. `docs/design-system/print-spec.md`는 그 값을 손으로 옮긴 사본이 아니라 `scripts/generate-print-spec-doc.mjs`가 컴파일된 `packages/template-core/dist/index.js`를 import해 만드는 **생성물**이다. `docs/design-system/medium-taxonomy.md`는 반대로 코드에 대응물이 없는 정책 문서라 손으로 쓴다 — 이 문서는 정본이 곧 문서 자신이다(`pattern-taxonomy.md`와 같은 지위).
- 검증: (1) `node scripts/generate-print-spec-doc.mjs --check`가 재생성 결과와 커밋된 파일의 diff 0을 확인한다(드리프트 검사), (2) `node scripts/generate-llms-txt.mjs`의 무결성 검사(모든 인덱스 링크가 실제 파일을 가리키는지, 스크립트 자체 내장)가 통과한다, (3) 배포 후 실제 URL fetch로 확인한다 — 로컬 파일 존재는 검증으로 치지 않는다(VL8 교훈).
- 배포/운영: Cloudflare Pages(`ui-dictionary` 프로젝트, `ui.askewly.com`)가 `main` 브랜치 push에 자동 반응해 빌드·배포한다(`docs/ui-vocabulary/deployment.md`). 이 milestone은 새 시크릿·새 배포 대상을 만들지 않는다 — 기존 배포 표면에 파일 두 개가 늘어날 뿐이다.
- 문서 소비 표면(에이전트 경로): 이 milestone의 산출물은 화면 UI가 아니라 에이전트가 fetch하는 markdown 두 개다. 소비자는 `llms.txt`를 읽는 에이전트이므로, 등재 여부와 배포본 응답이 유일하게 의미 있는 완료 신호다 — 로컬 커밋만으로는 이 도메인의 완료 조건을 충족하지 못한다.
- 검토 후 제외: 인증·결제·시크릿·마이그레이션·관측 — 걸리지 않음(정적 markdown 두 파일과 인덱스 등재일 뿐). 디자인(화면 UI) — 해당 없음, 이 milestone은 상호작용 없는 읽기용 산출물(에이전트용 참고 문서)만 다루므로 전역 `CLAUDE.md` §askewly-design 적용 범위상 화면 UI 게이트의 대상이 아니다.

## 결정 로그
- status: none-required
- 사용자 소유 결정: 없음 — DOG4 범위는 horizon 승인과 이 milestone 명세(step 트리·changeset명 지정)에 이미 포함되어 있다. horizon 미결 결정 5(타이포 임계값)·6(검사 파일 범위)은 DOG3 대상이고 이 milestone에는 걸리지 않는다.

## Step 트리

- [ ] **step-1 — 계약을 문서로 승격**
  - Artifact: `docs/design-system/print-spec.md` — 명함 3규격(한국 90×50/85×55, 미국 88.9×50.8)과 ISO A계열(A4~A1)의 재단 크기·도련·안전영역·게시 여백, 300dpi 표준, mm→px 환산 공식과 예시가 **`scripts/generate-print-spec-doc.mjs`가 `packages/template-core/dist/index.js`에서 직접 읽어 낸 값**으로 채워진다. 문서 상단에 "GENERATED — do not edit by hand, 정본은 print-spec.ts"를 명시한다.
  - Files: write `scripts/generate-print-spec-doc.mjs`, `docs/design-system/print-spec.md`(생성물).
  - Dependencies: 없음
  - Verify: `npm run build --workspace packages/template-core`로 `dist/index.js`를 최신화한 뒤 `node scripts/generate-print-spec-doc.mjs`를 실행해 `docs/design-system/print-spec.md`를 만든다. `node scripts/generate-print-spec-doc.mjs --check`가 exit 0(재생성 결과와 커밋된 파일이 바이트 단위로 같음)을 낸다. 문서 안에 `printSpecs`의 실제 키 전부(`kr-business-card-90x50`, `kr-business-card-85x55`, `us-business-card-3.5x2`, `iso-a4`, `iso-a3`, `iso-a2`, `iso-a1`)가 표로 나타나고, 값(90×50, 3mm 도련, 300dpi 등)이 `print-spec.ts` 리터럴과 일치한다.
  - Failure probe: `print-spec.ts`의 `bleedMm: 3`을 임시로 `5`로 바꾸고 `npm run build --workspace packages/template-core` 후 `--check`를 돌리면 커밋된 문서와 재생성 결과가 달라 nonzero exit로 실패한다. 원복 후 다시 `--check`가 exit 0으로 돌아오는지 확인해 생성물임을 왕복 증명한다.
  - Commit: changeset `print-spec-doc`.

- [ ] **step-2 — 매체 분류 축 신설**
  - Artifact: `docs/design-system/medium-taxonomy.md` — 화면/인쇄/발표 3매체를 표로 나눠 각 매체의 대표 산출물·정본 문서·**서로 다른 게이트**를 명시한다: 화면=상태·다크모드·컴포넌트 계약(`askewly-design` 스킬 마무리 절차), 인쇄=도련/안전영역 계약 준수 + **최종 형식 래스터화 확인**(PDF는 HTML 스크린샷이 아니라 PDF 페이지를 PyMuPDF로 래스터화해서 봄, 첫/중간/끝 최소 3장), 발표=DOG5에서 신설(이 문서에는 자리만 예약하고 "DOG5 대상 — 규격·게이트는 DOG5가 정한다"라고 명시해 빈칸으로 남기지 않는다). 문서 서두에 계기 사고를 근거로 남긴다: 2026-07-20 어록 PDF에서 화면용 warm canvas 토큰을 지면에 그대로 깔아 `@page` 여백이 흰색으로 잘렸고, 스킬의 화면 게이트는 통과했는데 결과물은 깨졌다.
  - Files: write `docs/design-system/medium-taxonomy.md`.
  - Dependencies: step-1
  - Verify: 문서에 매체 3행이 있고, 각 행의 게이트 서술이 서로 다른 문자열이다(화면 행에 "다크모드"·"상태" 언급, 인쇄 행에 "래스터화"·"PyMuPDF"·"도련" 언급, 발표 행에 "DOG5" 명시). `grep -c "래스터화" docs/design-system/medium-taxonomy.md`가 1 이상, `grep -q "2026-07-20"`으로 계기 사고 인용이 존재함을 확인한다. `docs/design-system/print-spec.md`로의 링크가 인쇄 행에 있어 step-1 산출물과 연결됨을 확인한다.
  - Failure probe: 인쇄 행의 게이트 서술을 화면 행과 같은 문구("상태·다크모드 확인")로 바꾸면 "서로 다른 게이트" 검증(각 행 문자열이 서로 겹치지 않아야 한다는 grep 대조)이 실패한다 — 표만 있고 게이트가 실은 같은 문서로 닫히지 않았음을 잡는다.
  - Commit: changeset `medium-taxonomy`.

- [ ] **step-3 — 등재와 배포본 검증**
  - Artifact: `scripts/generate-llms-txt.mjs`의 `FIXED_ASSETS`에 `docs/design-system/print-spec.md`와 `docs/design-system/medium-taxonomy.md`가 새 섹션(`Media` 또는 기존 `Contracts` 인접)으로 추가되고, 재생성된 `examples/ui-vocabulary-site/public/llms.txt`와 `public/llms/docs/design-system/{print-spec,medium-taxonomy}.md`가 커밋·push·Cloudflare Pages 자동배포된 뒤, **실제 배포 URL fetch**로 두 문서가 살아있음을 확인한다.
  - Files: write `scripts/generate-llms-txt.mjs`, `examples/ui-vocabulary-site/public/llms.txt`(생성물), `examples/ui-vocabulary-site/public/llms/docs/design-system/print-spec.md`(생성물), `examples/ui-vocabulary-site/public/llms/docs/design-system/medium-taxonomy.md`(생성물), `evidence/design-output-gates/dog4-print-publication.md`.
  - Dependencies: step-2
  - Verify: `node scripts/generate-llms-txt.mjs` 실행이 무결성 검사(인덱스에 등재된 모든 URL이 실제 파일로 존재)를 exit 0으로 통과한다. `git push`로 `main`에 반영해 Cloudflare 자동배포가 끝난 뒤(빌드 완료는 Cloudflare 대시보드 또는 배포 URL의 최신 커밋 해시로 확인), 배포된 `https://ui.askewly.com/llms.txt` 응답 본문에 `print-spec.md`와 `medium-taxonomy.md` 두 문자열이 모두 나타나고, 두 문서의 배포 URL(`https://ui.askewly.com/llms/docs/design-system/print-spec.md`, `.../medium-taxonomy.md`)을 각각 fetch한 HTTP 응답 코드가 둘 다 성공(200) 코드다. 구체 커맨드는 아래 코드 블록. **로컬 파일 확인(`test -f` 등)으로 이 Verify를 대체하지 않는다** — VL8이 "로컬에 있다고 배포된 게 아니다"로 세운 규율.

```bash
curl -sf https://ui.askewly.com/llms.txt | grep -q "print-spec.md"
curl -sf https://ui.askewly.com/llms.txt | grep -q "medium-taxonomy.md"
curl -sI https://ui.askewly.com/llms/docs/design-system/print-spec.md | head -n 1
curl -sI https://ui.askewly.com/llms/docs/design-system/medium-taxonomy.md | head -n 1
```
  - Failure probe: `FIXED_ASSETS` 등재는 하되 실제 push를 건너뛰면 배포본 fetch가 404를 반환해 이 Verify가 실패한다 — "등재했다"와 "배포됐다"가 다른 사건임을 구조적으로 드러낸다. 반대로 등재 없이 push만 하면 `llms.txt` grep이 실패해 "파일은 있지만 인덱스에 없다"는 VL2류 실패를 잡는다.
  - Commit: changeset `print-evidence-publication`.

## 검증/DoD

- **DoD**: 인쇄 규격이 `docs/design-system/` 문서로 존재하고 `llms.txt` 경로에서 fetch되며, 매체별로 게이트가 다르다는 것이 분류 축으로 명시된다.
- **Evidence**: `evidence/design-output-gates/dog4-print-publication.md` — 배포본 fetch 응답(URL·HTTP 상태·grep 매치)을 원문 그대로 남긴다.
- **회귀 게이트**: `node scripts/generate-print-spec-doc.mjs --check` + `node scripts/generate-llms-txt.mjs`(무결성 검사 내장) + `npm run verify`(canvas-core/template-core/agent-design 전체) + `npm run typecheck` 전부 PASS (horizon 닫는 기준 5·9).

## 수치 출처

- 이 문서의 DoD·통합 검증 서술에는 임계값 성격의 신규 수치가 없다(참조하는 인쇄 규격 수치는 전부 `packages/template-core/src/print-spec.ts`가 정본이고, step-1의 생성기가 그 값을 그대로 읽어 문서화하므로 이 plan이 별도로 수치를 단정하지 않는다). 값을 재확인하려면: `node -e "import('./packages/template-core/dist/index.js').then(m => console.log(m.printSpecs))"`.

## finding 큐
- (실행 중 발견 항목을 여기 적는다)

## 진행 로그
- 2026-07-22 작성.
