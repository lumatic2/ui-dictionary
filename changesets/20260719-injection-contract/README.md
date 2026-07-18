# changeset: injection contract swap + deploy (SF1 step 2)

- Date: 2026-07-19
- Milestone: SF1 step-2 (`plans/2026-07-19-sf1-studio-data-injection.md`)
- Target: SF1 — 데이터 주도 스튜디오 주입

## Scope

- `docs/design-system/brief-studio.md` — §1 구동 절차의 후보 커스터마이즈를 "HTML `AGENT:` 주석 지점 교체" → "**HTML 직접 편집 금지** + 데이터 JSON 작성 + `make-studio.py` 1커맨드 생성"으로 교체. §4 이미지 주입 문구·폰트(`fonts` 필드) 규칙 동기화. Changelog 추가.
- `examples/ui-vocabulary-site/public/llms/**` — `generate-llms-txt.mjs` 재생성 (60 assets).

## Contract

- source of truth: `docs/design-system/brief-studio.md`
- deploy: llms (ui.askewly.com — push 후 자동 반영)
- out of scope: 렌더러·데이터 변경 (step 1에서 완료)

## Verification checklist

- [x] 구 지시 grep 0 — `AGENT: 주석 | AGENT DATA | 주석 지점에서 후보` docs·llms 사본 0건 (프리모템 1 예방)
- [x] llms 재생성 60 assets + 사본 diff에 신규 절차 포함
- [x] 커스텀 데이터 E2E (스튜디오 생성→렌더 관측 — `evidence/studio-finish/sf1-injection-e2e.md`)
- [x] curl 배포 확인 — make-studio.py 4건 grep (2026-07-19 push 후 실측)
