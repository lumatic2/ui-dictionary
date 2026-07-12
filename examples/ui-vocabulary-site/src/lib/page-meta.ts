import { useEffect } from "react"

const SITE_NAME = "Askewly Design"
const DEFAULT_DESCRIPTION = "Askewly Design은 제품 UI 패턴, 문서, 쇼케이스, 리소스, Pro 구현 자산을 탐색하는 디자인 시스템입니다."

type PageMetaInput = {
  page: "home" | "docs" | "plus" | "term" | "download" | "pro" | "colors" | "recipes"
  sectionTitle?: string | null
  description?: string | null
}

function getSectionLabel(page: PageMetaInput["page"]): string | null {
  switch (page) {
    case "home":
      return null
    case "docs":
      return "Docs"
    case "plus":
      return "Patterns"
    case "colors":
      return "Colors"
    case "recipes":
      return "Recipe Gallery"
    case "pro":
      return "Pro"
    case "download":
      return "Download"
    case "term":
      return null
    default:
      return null
  }
}

function setMetaDescription(content: string) {
  const el = document.querySelector('meta[name="description"]')
  if (el) {
    el.setAttribute("content", content)
  }
}

export function usePageMeta({ page, sectionTitle, description }: PageMetaInput) {
  useEffect(() => {
    const label = sectionTitle && sectionTitle.trim().length > 0 ? sectionTitle : getSectionLabel(page)
    document.title = label ? `${label} — ${SITE_NAME}` : SITE_NAME
    setMetaDescription(description && description.trim().length > 0 ? description : DEFAULT_DESCRIPTION)
  }, [page, sectionTitle, description])
}
