# design-lint

DESIGN.md 검증기. 4단계 fail-fast 파이프라인.

## 설치

```bash
cd ~/projects/desing-manual/scripts/lint
npm install
```

## 사용

```bash
node ~/projects/desing-manual/scripts/lint/index.js /path/to/DESIGN.md
```

종료 코드: `0` PASS / `1` lint FAIL / `2` IO 에러.
산출: `<DESIGN.md 디렉토리>/.design/lint.json`.

## 단계

1. **parse** — gray-matter 로 frontmatter 파싱
2. **schema** — ajv + `schema/design-md.schema.json` 검증
3. **alias** — `{group.name}` alias 모두 resolve 되는지 확인
4. **contrast** — culori `wcagContrast` 로 주요 text/surface 쌍 AA(4.5:1) 검증.
   `color-mix(...)` 같은 함수형 값은 정보만 출력, fail 시키지 않음.

## 확장 후보

- stage 5: stylelint / eslint-plugin-tailwindcss invoke
- stage 6: axe-core CLI on built HTML
- stage 7: Playwright `toHaveScreenshot` baseline diff

자세한 근거: [methodology/research-findings.md](../../methodology/research-findings.md) §C.
