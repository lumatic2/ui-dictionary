/**
 * SQ4 — 정적 셸+메타 프리렌더 생성기.
 *
 * 빌드 산출물(dist/index.html)을 템플릿으로 라우트별 `dist/<route>/index.html` 을 생성한다:
 * 고유 title·description·og·canonical + `#root` 안 첫 페인트용 정적 콘텐츠(React 마운트 시 교체).
 *
 * 실행: 사이트 디렉터리에서 `vite-node ../../scripts/prerender-ui-vocabulary.ts` (postbuild 훅).
 * vite-node 가 사이트 vite.config 의 `@` alias 를 해석하므로 앱 데이터 모듈을 그대로 임포트한다
 * (Node .mjs 는 TS·alias 체인을 직접 임포트할 수 없다 — 계획서 기술 결정 ⑤).
 *
 * 주의: exposure.ts(SHOW_UNFILLED=import.meta.env.DEV)는 vite-node 아래서 DEV=true 로 평가되어
 * 프로덕션 게이트와 어긋난다 — 노출 판정(shell·unfilled)은 여기서 데이터 필드로 직접 계산한다.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { terms } from "@/data/terms.generated"
import { navigationCollections } from "@/lib/navigation-model"
import { docsArticlePages, docsNavGroups } from "@/lib/documentation-pages"
import { categoryLabels } from "@/lib/search"

const SITE_ORIGIN = "https://ui.askewly.com"
const SITE_NAME = "Askewly Design"
const DIST = path.resolve(process.cwd(), "dist")

/** 모든 삽입 문자열은 이 함수를 거친다 — terms.yml 에 raw `&`/`>` 가 실재한다 (계획서 기술 결정 ⑥). */
function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

type Page = {
  route: string
  title: string
  description: string
  /** #root 에 넣을 첫 페인트 정적 마크업 (이미 escape 된 조각) */
  body: string
}

function link(href: string, label: string): string {
  return `<a href="${esc(href)}">${esc(label)}</a>`
}

function buildPages(): Page[] {
  const pages: Page[] = []
  const defaultDescription =
    "Askewly Design은 제품 UI 패턴, 문서, 쇼케이스, 리소스, Pro 구현 자산을 탐색하는 디자인 시스템입니다."

  pages.push({
    route: "/",
    title: SITE_NAME,
    description: defaultDescription,
    body: `<h1>${esc(SITE_NAME)}</h1><p>A visual library and agent-ready system for designing better product interfaces.</p><nav><ul><li>${link("/get-started", "Get Started")}</li><li>${link("/patterns", "Patterns")}</li><li>${link("/docs", "Docs")}</li><li>${link("/colors", "Colors")}</li><li>${link("/recipes", "Recipe Gallery")}</li></ul></nav>`,
  })

  pages.push({
    route: "/get-started",
    title: `Get Started — ${SITE_NAME}`,
    description:
      "Askewly Design 시작 가이드 — 패턴 탐색, UI 용어 사전, 문서, 에이전트 진입 경로를 안내합니다.",
    body: `<h1>Start exploring ${esc(SITE_NAME)}</h1><p>A visual library of product UI, the vocabulary behind it, and an agent-ready system that ships the same design decisions as code.</p><ul><li>${link("/patterns", "Browse patterns")}</li><li>${link("/docs", "Read the docs")}</li><li>${link("/colors", "Study the colors")}</li><li>${link("/recipes", "Try the recipes")}</li><li>${link("/llms.txt", "Agent entry: llms.txt")}</li></ul>`,
  })

  // Docs 허브 + 문서 (shell 페이지는 프로덕션 미노출 — 데이터 필드로 직접 판정)
  const docsGroupsHtml = docsNavGroups
    .map((group) => {
      const items = group.items.filter((item) => !item.shell)
      if (items.length === 0) return ""
      const links = items
        .map((item) => {
          const slug = item.filter.slice("nav:docs-".length)
          return `<li>${link(`/docs/${slug}`, item.label)}</li>`
        })
        .join("")
      return `<section><h2>${esc(group.label)}</h2><ul>${links}</ul></section>`
    })
    .join("")
  pages.push({
    route: "/docs",
    title: `Docs — ${SITE_NAME}`,
    description:
      "Askewly Design 문서 — 원칙, 파운데이션, 엘리먼트 가이드, UI 용어 레퍼런스, 에이전트 레시피.",
    body: `<h1>${esc(SITE_NAME)} docs</h1><p>Askewly Design is a design system for product interfaces: a visual pattern library, a UI vocabulary, and agent-ready guidance that all ship from the same tokens.</p>${docsGroupsHtml}`,
  })

  for (const page of docsArticlePages.values()) {
    if (page.shell) continue
    const slug = page.filter.slice("nav:docs-".length)
    pages.push({
      route: `/docs/${slug}`,
      title: `${page.title} — ${SITE_NAME}`,
      description: page.lead,
      body: `<p>${esc(page.breadcrumb)}</p><h1>${esc(page.title)}</h1><p>${esc(page.lead)}</p>${page.sections.map((section) => `<h2>${esc(section.title)}</h2>`).join("")}`,
    })
  }

  // Patterns 허브 + 컬렉션 (unfilled = termIds 명시 빈 배열 · plus-templates 게이트 — exposure.ts 와 동일 규칙)
  const termNameById = new Map(terms.map((term) => [term.id, term] as const))
  const visibleCollections = navigationCollections.filter((collection) => {
    if (!collection.id.startsWith("plus-") || collection.id === "plus-all") return false
    if (collection.id.startsWith("plus-templates")) return false
    return !(collection.termIds && collection.termIds.length === 0)
  })

  pages.push({
    route: "/patterns",
    title: `Patterns — ${SITE_NAME}`,
    description: "Marketing, application UI, ecommerce 표면의 UI 패턴과 실동작 데모를 탐색합니다.",
    body: `<h1>Patterns</h1><ul>${visibleCollections.map((collection) => `<li>${link(`/patterns/${collection.id.slice("plus-".length)}`, collection.path.join(" / "))}</li>`).join("")}</ul>`,
  })

  for (const collection of visibleCollections) {
    const slug = collection.id.slice("plus-".length)
    const termLinks = (collection.termIds ?? [])
      .flatMap((id) => {
        const term = termNameById.get(id)
        return term ? [`<li>${link(`/terms/${term.id}`, `${term.ko.name} (${term.en.name})`)}</li>`] : []
      })
      .join("")
    pages.push({
      route: `/patterns/${slug}`,
      title: `${collection.label} — ${SITE_NAME}`,
      description: `${collection.path.join(" / ")} — ${SITE_NAME} UI 패턴 컬렉션.`,
      body: `<p>${esc(collection.path.join(" / "))}</p><h1>${esc(collection.label)}</h1>${termLinks ? `<ul>${termLinks}</ul>` : ""}`,
    })
  }

  // 용어 전부
  for (const term of terms) {
    pages.push({
      route: `/terms/${term.id}`,
      title: `${term.ko.name} (${term.en.name}) — ${SITE_NAME}`,
      description: term.one_liner,
      body: `<p>${esc(categoryLabels[term.category])}</p><h1>${esc(term.ko.name)} <span lang="en">${esc(term.en.name)}</span></h1><p>${esc(term.one_liner)}</p><p>${esc(term.description)}</p><p>${link("/", SITE_NAME)} UI vocabulary</p>`,
    })
  }

  // 정적 페이지 — 메타 중심
  pages.push(
    {
      route: "/colors",
      title: `Colors — ${SITE_NAME}`,
      description: "Askewly Design 팔레트와 시맨틱 토큰, 컬러 램프 생성기.",
      body: `<h1>Colors</h1><p>${esc(SITE_NAME)} 팔레트와 시맨틱 토큰, 컬러 램프 생성기.</p>`,
    },
    {
      route: "/recipes",
      title: `Recipe Gallery — ${SITE_NAME}`,
      description: "그라디언트, 모션 코레오그래피, 3D 등 고임팩트 비주얼 기법의 실구현 레시피.",
      body: `<h1>Recipe Gallery</h1><p>그라디언트, 모션 코레오그래피, 3D 등 고임팩트 비주얼 기법의 실구현 레시피.</p>`,
    },
    {
      route: "/pro",
      title: `Pro — ${SITE_NAME}`,
      description: "Askewly Design Pro — 구현 팩, 에셋, 상업적 재사용.",
      body: `<h1>Pro Plan</h1><p>Askewly Design Pro — 구현 팩, 에셋, 상업적 재사용.</p>`,
    },
    {
      route: "/search",
      title: `Search — ${SITE_NAME}`,
      description: "UI 용어 사전 562개 항목에서 이름·별칭·설명·사용 상황으로 검색합니다.",
      body: `<h1>Search</h1><p>UI 용어 사전에서 이름·별칭·설명·사용 상황으로 검색합니다.</p>`,
    }
  )

  return pages
}

function renderPage(template: string, page: Page): string {
  const url = `${SITE_ORIGIN}${page.route === "/" ? "/" : page.route}`
  let html = template
  const replaceOnce = (pattern: RegExp, replacement: string, label: string) => {
    if (!pattern.test(html)) {
      throw new Error(`template anchor missing: ${label} (route ${page.route})`)
    }
    html = html.replace(pattern, replacement)
  }

  replaceOnce(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`, "title")
  replaceOnce(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(page.description)}" />`,
    "meta description"
  )
  replaceOnce(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    "og:title"
  )
  replaceOnce(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${esc(url)}" />`,
    "og:url"
  )
  replaceOnce(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    "og:description"
  )
  replaceOnce(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    "twitter:title"
  )
  replaceOnce(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    "twitter:description"
  )
  replaceOnce(/<\/head>/, `<link rel="canonical" href="${esc(url)}" />\n  </head>`, "head close")
  replaceOnce(/<div id="root"><\/div>/, `<div id="root">${page.body}</div>`, "root")

  return html
}

function main() {
  const started = Date.now()
  // dist/index.html 은 어떤 프리렌더보다 먼저 원본을 템플릿으로 고정한다 ("/" 가 자기 출력 위에 덮이는 사고 방지)
  const template = readFileSync(path.join(DIST, "index.html"), "utf8")
  if (!template.includes('<div id="root"></div>')) {
    throw new Error("dist/index.html: #root anchor not found — build output changed?")
  }

  const pages = buildPages()
  const seen = new Set<string>()
  for (const page of pages) {
    if (seen.has(page.route)) {
      throw new Error(`duplicate prerender route: ${page.route}`)
    }
    seen.add(page.route)
    if (page.route !== "/" && !/^\/[A-Za-z0-9/_-]+$/.test(page.route)) {
      throw new Error(`unsafe route path: ${page.route}`)
    }

    const outPath =
      page.route === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, ...page.route.slice(1).split("/"), "index.html")
    mkdirSync(path.dirname(outPath), { recursive: true })
    writeFileSync(outPath, renderPage(template, page))
  }

  console.log(`prerender: ${pages.length} routes → dist (${Date.now() - started}ms)`)
}

main()
