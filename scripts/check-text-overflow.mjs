import {
  createTemplateProject,
  formatPackCatalog,
  listTokenSets,
  measureOverflow,
  TextFitError,
} from '../packages/template-core/dist/index.js'

/**
 * 텍스트 넘침 게이트 — 글자가 캔버스를 넘치는 산출물이 나가지 못하게 막는다.
 *
 * TH7이 산출물 12장을 **눈으로 보고서야** 잘림을 발견했다. 테스트 78개는 전부 통과한 상태였다.
 *
 * 기본 문구만 검사하면 이 게이트는 무의미하다 — 컴파일러가 그 문구에 맞춰 크기를 줄이므로
 * 항상 통과한다(실제로 청사진 폭을 좁혀 찔러봤더니 통과했다). 그래서 **내용 변주**로 훑는다.
 * 각 조합은 둘 중 하나여야 한다: 넘치지 않고 들어가거나, `TEXT_DOES_NOT_FIT`으로 **거부**되거나.
 * 잘린 채 통과하는 제3의 길은 없어야 한다.
 */

/** 길이·문자 구성이 다른 내용 변주. 실제 의뢰에서 나올 법한 극단을 포함한다. */
const CONTENT_VARIANTS = [
  { label: 'default', content: {} },
  {
    label: 'long-korean',
    content: {
      name: '전유성',
      headline: '손이 빚은 하루의 그릇, 매일 쓰는 잔의 무게를 다시 생각합니다',
      title: '편집 가능한 제작 시스템이 무엇을 바꾸는가',
      explanation: '구조화된 장면은 텍스트·이미지·도형을 각각 살아 있는 레이어로 보존하므로 이름 하나만 바꿔도 나머지가 흔들리지 않습니다.',
      product: '흙과 손 · 매일컵 한정판',
    },
  },
  {
    label: 'long-latin',
    content: {
      name: 'Bartholomew Featherstonehaugh',
      headline: 'Crafted for every single day of your working week',
      title: 'What structured template production actually changes',
      explanation: 'A structured scene preserves text, image and shape as living layers so that changing one name does not disturb anything else.',
      contact: 'bartholomew.featherstonehaugh@verylongdomainname.example.com',
    },
  },
  {
    label: 'short',
    content: { name: '유', headline: '가', title: '수', explanation: '.', product: '컵', contact: 'a@b.c' },
  },
]

const rows = []
let overflowing = 0
let rejected = 0
let fitted = 0

for (const blueprint of formatPackCatalog) {
  for (const tokenSet of listTokenSets()) {
    for (const variant of CONTENT_VARIANTS) {
      let project
      try {
        project = createTemplateProject({
          blueprintId: blueprint.id,
          tokenSetId: tokenSet.id,
          content: variant.content,
        })
      } catch (error) {
        if (error instanceof TextFitError) {
          // 명시 거부는 통과다 — 잘린 산출물이 나가지 않았다.
          rejected += 1
          continue
        }
        throw error
      }

      fitted += 1
      for (const node of Object.values(project.scene.nodes)) {
        if (node.kind !== 'text') continue

        const report = measureOverflow(node.text, node.textStyle.fontSize, node.bounds)
        if (report.width + report.height > 0) {
          overflowing += 1
          rows.push({
            blueprint: blueprint.id,
            tokenSet: tokenSet.id,
            variant: variant.label,
            node: node.id,
            fontSize: node.textStyle.fontSize,
            widthOverflow: Math.round(report.width),
            heightOverflow: Math.round(report.height),
            lines: report.lines,
          })
        }
      }
    }
  }
}

if (overflowing > 0) {
  console.error(`text-overflow: FAIL — 잘린 채 통과한 텍스트 ${overflowing}건`)
  for (const row of rows) {
    console.error(
      `  ${row.blueprint} / ${row.tokenSet} / ${row.variant} / ${row.node}: font=${row.fontSize} 폭+${row.widthOverflow} 높이+${row.heightOverflow} (${row.lines}줄)`,
    )
  }
  process.exit(1)
}

const total = fitted + rejected
console.log(`text-overflow: PASS (조합 ${total}건 — 맞춤 ${fitted}, 명시 거부 ${rejected}, 잘림 0)`)
