import { useEffect, useState } from "react"

export type PreviewTheme = "system" | "light" | "dark"
export type ResolvedPreviewTheme = Exclude<PreviewTheme, "system">

const STORAGE_KEY = "askewly-theme"

function readDomTheme(): ResolvedPreviewTheme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/** 사이트 전역 3-상태 테마 (라이트/다크/시스템 — DM3).
 *  기본값 = 라이트 (2026-07-31 사용자 확정 — OS 설정 무관). "system" 은 명시 선택 시에만 저장·OS 추종.
 *  첫 페인트 전 결정은 index.html head 인라인 스크립트가 담당 — 이 훅은 그 상태를 이어받는다. */
export function useSiteTheme(): { theme: PreviewTheme; resolvedTheme: ResolvedPreviewTheme; setTheme: (theme: PreviewTheme) => void } {
  const [theme, setThemeState] = useState<PreviewTheme>(() => {
    if (typeof window === "undefined") return "light"
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === "system" || stored === "dark" ? stored : "light"
  })
  const [systemTheme, setSystemTheme] = useState<ResolvedPreviewTheme>(() =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  )

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setSystemTheme(mediaQuery.matches ? "dark" : "light")
    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const resolvedTheme: ResolvedPreviewTheme = theme === "system" ? systemTheme : theme

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  }, [resolvedTheme])

  const setTheme = (next: PreviewTheme) => {
    setThemeState(next)
    // 세 값 모두 명시 저장 — 키 부재 = 기본값 라이트
    window.localStorage.setItem(STORAGE_KEY, next)
  }

  return { theme, resolvedTheme, setTheme }
}

/** 데모 프리뷰의 "system" 해석 기준 = 사이트 전역 테마 (2026-07-31 사용자 확정 — OS 직독 아님).
 *  <html>.dark 를 관찰하므로 어떤 컴포넌트 트리에서 불러도 사이트 테마를 따른다. */
export function useSystemPreviewTheme(): ResolvedPreviewTheme {
  const [theme, setTheme] = useState<ResolvedPreviewTheme>(readDomTheme)

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readDomTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    setTheme(readDomTheme())
    return () => observer.disconnect()
  }, [])

  return theme
}
