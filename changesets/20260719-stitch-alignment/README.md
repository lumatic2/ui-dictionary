# changeset: stitch official spec alignment

- Date: 2026-07-19
- Milestone: VB1 (`plans/2026-07-19-vb1-stitch-alignment.md`)
- 입력 리서치: `research/2026-07-19-vb1-stitch-design-md.md` (공식 출처 8 + 커뮤니티 6, 전 항목 URL+접근일)

## Diff 판정 (채택/교정/유지)

| 항목 | 판정 | 근거 |
|---|---|---|
| frontmatter flat 스키마 (`name/colors/typography/rounded/spacing/components`) | **채택** — 템플릿 재작성 | 공식 spec.md Schema 절 |
| 고정 순서 8섹션 (Overview→…→Do's and Don'ts) | **채택** — 구 9섹션(Personality/Anti-patterns/Changelog) 대체, Changelog는 주석으로 | spec.md Section Order |
| `{path.to.token}` 참조 + `colors.primary` 필수 + hex 권장 | **채택** | spec.md Token Types |
| DTCG `{ value, type }` 표기 (구 템플릿) | **제거** | 공식은 DTCG "영감"만 — 표기법 다름 |
| 3-tier primitive→semantic 강제 서술 | **교정** — "공식 규칙 아님, 본 레포 확장 관례" 라벨. flat map 안 시맨틱 네이밍으로 동일 규율(unknown-key 허용이 근거) | spec.md Unknown-content 표 |
| askewly 판단 관례(순백 금지·keep-all·명도 사다리·상태 완비) | **유지** — 본문 프로즈로 이식 | 우리 자산, 공식과 무충돌 |

## 변경

- `templates/DESIGN.md.tmpl` — 공식 스키마 정합판으로 재작성 (frontmatter flat + 8섹션 + 브리프 결정/추정 기록 지점).
- `methodology/design-md-guide.md` — 상단 정합 경고 절 추가 (3-tier=확장 관례 교정, 근거 백링크).
- `docs/design-system/design-brief.md` §3 — 저장 계약이 공식 스펙 참조로 갱신 (llms 배포 대상).

## 검증 checklist

- [x] 리서치 전 인용 출처 URL+접근일 + 무작위 1건(raw spec.md) 실 curl 검증
- [x] diff 표: 채택 3·제거 1·교정 1·유지 1 각 사유
- [x] Failure probe: 공식 미발견 항목(stitch 사이트 SPA 본문·예시 2종)은 "발견 실패"로 정직 기록 — 추정 작성 없음
- [ ] llms 재생성 + push + curl design-brief §3 반영 (커밋 시)
