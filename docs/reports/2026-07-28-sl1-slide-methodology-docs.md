# 완료 — SL1 발표 슬라이드 방법론 문서화

> 완료: 2026-07-28 · SL1 (goal `slide-methodology`) · 배치: `docs/reports/` (이 레포 특례 — archive/ gitignore)
> **짧게 쓴다.** 설계 논거·경위는 changeset 과 커밋 메시지에.

## 1. 결과

발표 슬라이드 방법론 2문서를 신설하고 에이전트 표면(llms.txt)에 배선했다. `knowledge/slide-principles.md` — 거장 8계보 수렴 원칙 5 + 표현 기법(근거 등급 분리: assertion-evidence만 실증, 수치 규칙은 folklore). `methodology/slide-production.md` — HTML 정본 원칙 · 3-format export 결정표(편집 가능성 분기) · 엔진 선택표 · G1~G7 순서 강제 · SL2 구현용 린트 규칙 스펙 R1~R4. llms.txt에 Methodology 섹션 첫 신설(사용자 확정). 상류 자산: KG 노드 2건 · toolshelf 카드 4건(별도 레포 커밋 eeefd22 · 7fb5776).

## 2. 이슈와 해결

- fresh 계획 검증자가 [HIGH] 이중 정본 사고를 계획 단계에서 예방 — 매체 게이트 정본(`docs/design-system/slide-spec.md`·`medium-taxonomy.md`)이 이미 존재하는데 리서치가 "없다"고 단정. step-2를 "게이트 인용/확장, 재서술 금지"로 재설계, 리서치 갭 서술 정정.
- llms 재생성이 EOL-only 부산물 87건 생성(diff 0줄) — 원복하고 실변경(+5줄·삭제 0)만 커밋.
- DoD 잔여 없음.

## 3. 증거

- changeset: `changesets/20260728-sl1-slide-methodology-docs` (step-1~4 절)
- 검증: evidence `evidence/slide-methodology/sl1-docs.md` — DoD 8항 PASS(인용 접근일 grep · 상대 링크 전건 실존 스크립트 PASS · llms grep 신규 2건 존재·기존 소실 0 · vite build ✓)
- 크기 회고: changeset 1개로 닫힘 — 단 독립 응집 변경 4개(문서 2·목차·배선 코드)라 milestone 라벨은 정합으로 판정, 재발 시 step 병합 검토.
- 실표면: llms.txt 산출물을 직접 열어 `## Methodology` 섹션·신규 문서 2건의 행(51·55)을 grep 으로 확인, 삭제 0줄 diff 확인 — 실배포 반영은 세션 말 일괄 push 후 Cloudflare Pages 자동(사용자 관례)이라 이 시점 미평가. 평가 못 함: 배포 URL(ui.askewly.com/llms.txt)에서의 반영 — push 전이라 잴 수 없음, push 후 세션 말 확인.
- 재현: `node scripts/generate-llms-txt.mjs && grep -n "slide-principles|## Methodology" -E examples/ui-vocabulary-site/public/llms.txt`
