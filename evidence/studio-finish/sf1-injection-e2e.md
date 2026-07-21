# SF1 — 데이터 주도 주입 E2E 실측 (2026-07-19)

## 생성기 실행 (CLI)

```
$ python templates/make-studio.py --data templates/studio-data.default.json --out studio-default.html
make-studio: OK — tiles=4 axes=18 -> studio-default.html
$ python templates/make-studio.py --data custom-data.json --out studio-custom.html
make-studio: OK — tiles=4 axes=18 -> studio-custom.html
$ python templates/make-studio.py --data bad-data.json --out bad.html   # cands 삭제한 불량 JSON
make-studio: FAIL — axes[0] (base) 필수 필드 누락: cands
exit=1
$ python templates/make-studio.py --data badfont.json --out bad2.html   # http://evil.example 폰트
make-studio: FAIL — 'fonts' 는 fonts.googleapis.com CSS URL 이어야 함: http://evil.example/x.css
exit=1
```

## Playwright 실구동 (http.server 경유)

| 대상 | 관측 |
|---|---|
| studio-default.html | sections 19(타일+18축) · tiles 4 · 미리보기 조립(pvLen 2247) · 헤드라인 "오늘 만든 것이 제일 좋다" |
| studio-custom.html | 타일명 "커스텀 검증 타일" · 헤드라인 "커스텀 헤드라인 검증 문구" · 미리보기 반영 true · stylesheet href에 커스텀 폰트(Gowun+Batang:wght@400;700) 주입 확인 |
| brief-studio.html (템플릿 단독) | 18축 렌더 · 타일 클릭 → "타일과 한 세트" 배지 4개(캐스케이드 보존) · status "0 / 18 축 선택됨 · 타일: 조용하고 문학적인" |

콘솔 에러는 favicon 404 1건뿐(무해).

## 계약 교체 확인

- `docs/design-system/brief-studio.md` §1 절차 2 = 데이터 JSON + `make-studio.py` 1커맨드 (HTML 직접 편집 금지 명문).
- 구 지시 grep 0: `AGENT: 주석 | AGENT DATA | 주석 지점에서 후보` → docs·llms 사본에서 0건.
- `node scripts/generate-llms-txt.mjs` → 60 assets, llms 사본 갱신 확인.
- 배포(ui.askewly.com curl): push 후 확인 — 세션 단위 push 규칙(사용자)로 커밋 시점엔 미배포. 확인 커맨드: `curl -s https://ui.askewly.com/llms/docs/design-system/brief-studio.md | grep "make-studio.py"`
