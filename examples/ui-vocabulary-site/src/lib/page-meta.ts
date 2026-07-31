import { useEffect } from "react"

const SITE_NAME = "Askewly Design"
const DEFAULT_DESCRIPTION =
  "Askewly Design is a design system for exploring product UI patterns, docs, showcases, resources, and Pro implementation assets."

type PageMetaInput = {
  page: "home" | "docs" | "plus" | "term" | "download" | "pro" | "colors" | "recipes" | "get-started"
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
    case "get-started":
      return "Get Started"
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
