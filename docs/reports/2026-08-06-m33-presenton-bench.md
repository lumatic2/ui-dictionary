# M33 완료 보고 — Presenton 정밀 벤치마크

Date: 2026-08-06 · Plan: `plans/2026-08-06-m33-presenton-bench.md` · 산출물: `research/2026-08-06-m33-presenton-bench.md`

## 1. 결과

2026-07-31 에 D2 로 등록된 뒤 미착수였던 벤치를 실물로 닫았다. ① 레포 실사(commit `bed1fc6c`·Apache-2.0·파이프라인 4단 진입점·레이아웃 JSON 모델·테마 자동 파생) ② **유료 키 0으로 실구동** — 로컬 `gemma4:12b`(ollama)로 5장 덱 생성, 이미지 제공자 미설정으로도 완료 ③ `/pt` 와 10개 축 대조표(양쪽 출처 필수) + 산출물 1:1 육안 대조 ④ **판정 A 1건 · B 4건 · C 1건** ⑤ 후속 3건 finding 등록. 결론: 품질 게이트(오버플로·대비·캘리브레이션)는 우리가 앞서고, Presenton 이 앞선 곳은 제품성(웹 편집기·설치형 배포·MCP)이라 우리 트랙의 겨냥점이 아니다. 가져올 것은 **레이아웃 스키마로 LLM 출력을 강제하는 구조** 하나다.

## 2. 이슈와 해결

- **배포 문서에 없는 함정** — 앱이 컨테이너 안에서 루프백에만 바인딩해 `-p` 매핑이 통하지 않는다(호스트 000 / 내부 200). `--network host` 로도 `/` 가 500. 컨테이너 안에 Node TCP 포워더(`0.0.0.0:3009 → 127.0.0.1:3000`)를 띄워 열었다.
- **Docker Desktop 기동의 부작용** — 데몬을 띄우자 사용자의 기존 컨테이너(n8n·supabase 5종)가 자동 기동됐다. 내 컨테이너 2개만 제거했고 사용자 것은 건드리지 않았다. 이미지 5.27GB 는 남겨 뒀다(삭제 여부는 사용자 몫).
- **step-2 Failure probe 가 실제로 걸렸다** — 우리 기준선을 요약이 아니라 `/pt` 소스에서 재확인하자 stale 2건이 나왔다: `§0` "레이아웃 18종" → 실측 **19종**, `§1` "단일 HTML 배포 미보유" → 실제 **보유**. record 동결 규약대로 원문을 고치지 않고 findings 에 정정을 남겼다.
- **드리프트 1건** — 계획은 step 별 커밋이었으나 산출물이 문서 1개라 커밋을 합쳤다. 범위·내용 이탈은 없다.
- **위임 계약 준수** — 레포 실사는 하위 모델 1회 위임, 대조표·판정은 부모가 작성. child 결과는 부모가 파일 표본(SHA·LICENSE·`llm_provider.py`·export `Literal`)으로 재확인한 뒤에만 실었다.
- **크기 회고**: 2 step · 산출물 1문서 · 통합 검증(실구동 + 1:1 대조) 보유. changeset 디렉터리는 만들지 않았다 — 코드 변경이 0이라 기록 위치가 `research/` 다.

## 3. 증거

- `research/2026-08-06-m33-presenton-bench.md` · 커밋 61f8dc5 · 스크린샷 `<scratchpad>/bench-shots/presenton-deck-1.png`
실표면: CLI/컨테이너 — `docker run … ghcr.io/presenton/presenton:latest` 로 실제 인스턴스를 띄우고, 내부 API 로 `create → outlines/stream → prepare → presentation/stream` 4단을 **끝까지 실행**해 5장 덱을 생성했다(아웃라인 43초·슬라이드 6분). 이어서 브라우저(Playwright)로 로그인 후 `/presentation?id=…` 를 렌더해 **슬라이드 실물을 눈으로 확인**했고, 그 화면을 `/pt` exemplar 와 나란히 놓고 대조했다. 생성 결과는 어설션이 아니라 산출물 자체로 평가했다 — 5장이 서로 다른 레이아웃으로 채워졌고 본문·제목이 실제 텍스트를 담고 있다.
배선: none — 장치 신설 없음(리서치 산출물 1건, 코드·스크립트 변경 0).
재현: `git clone --depth 1 https://github.com/presenton/presenton.git` → `docker run -d -p 5111:3009 -e LLM=ollama -e OLLAMA_URL=http://host.docker.internal:11434 -e OLLAMA_MODEL=<로컬모델> -e CAN_CHANGE_KEYS=true -v <dir>:/app_data ghcr.io/presenton/presenton:latest` → 컨테이너 안에서 `0.0.0.0:3009→127.0.0.1:3000` 포워더 기동 → `POST /api/v1/auth/setup` → `create`/`outlines/stream`/`prepare`/`presentation/stream`. 우리 쪽 수치 재현: `node -e` 로 `~/projects/custom-skills/promoted/pt/templates/layout-meta.json` 키 수(19) · `ls templates/export-*.mjs`(4종).
평가 못 함: ① Presenton 의 오버플로·대비 관련 코드가 **자동 게이트인지 렌더 동작인지** 확정하지 못했다(grep 근거는 문서 §6 — 린트·테스트 파일에서는 안 나왔다) ② PPTX 변환 바이너리 내부 구현은 별도 레포라 안 봤다 ③ 1:1 육안 대조는 우리 쪽이 기존 exemplar 재사용이라 **주제가 다르다** — "양쪽 기본값의 생김새"까지만 말할 수 있고 같은 주제 품질 비교는 아니다 ④ 기본 DB 엔진·CI 워크플로·`layouts.json` 의 성격은 확인하지 않았다.
