# Changeset — M2: 강조·상태색 시맨틱 토큰 신설 + "토큰 부재" 마커 전수 해소

- Milestone: M2 (goal `dark-carryover`, plan: `plans/2026-08-01-m2-accent-semantic-tokens.md`)
- Date: 2026-08-01

## step-1 — 토큰 신설 + 재생성 배선

- `tokens/askewly.tokens.json`: primitive 4램프 신설(indigo 7단·skyx 7단·emerald 4단·rose 5단 — 값은 사이트가 이미 렌더하던 Tailwind v4 기본값 그대로, 라이트 무손실) + `askewly.violet-deep`(#5F22A8 승격). semantic 신설: `emphasis.*` 5종(indigo 계 강조·선택), `status.*` 10종(info=sky·success=emerald·danger=rose, 각 라이트/다크 값), `action.primary-hover`(라이트 violet-deep / 다크 orchid — 다크에서 어둡게 가면 대비 손실), `text.on-destructive`(양 테마 white — 기존 마커 3건의 "text-white correct" 판단을 토큰 값으로 승격).
- `scripts/generate-tokens.mjs`: `COLOR_MAPPINGS` 에 신설 17변수 배선 (tokens.css 는 매핑 등재분만 방출하는 구조 — 계획 Files 목록에 없던 write, 배선 artifact 에 내재된 표면이라 스코프 내 판정).
- 재생성: `src/tokens.css`(`:root`+`.dark` 17변수), `DESIGN.md` frontmatter, llms 사본(`generate-llms-txt.mjs` — 정본과 diff 0 확인). llms 재생성이 M1 의 `copy-language.md` 미반영분도 함께 정합화(부수 캐치업).
- `src/index.css` `@theme inline`: `--color-*` 17매핑 추가 (Tailwind 클래스: `bg-emphasis-surface`·`text-info-foreground`·`bg-danger-solid` 등).
- Verify: 재생성 diff 신설분만(기존 토큰 값 무변경) · build+prerender 755 PASS · tokens.css `:root`/`.dark` 17변수 전수 존재 · llms 사본 identical.
