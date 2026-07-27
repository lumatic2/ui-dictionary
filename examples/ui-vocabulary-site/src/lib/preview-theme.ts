import { useEffect, useState } from "react"

export type PreviewTheme = "system" | "light" | "dark"
export type ResolvedPreviewTheme = Exclude<PreviewTheme, "system">

export function useSystemPreviewTheme(): ResolvedPreviewTheme {
  const getSystemTheme = (): ResolvedPreviewTheme => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return "light"
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  const [systemTheme, setSystemTheme] = useState<ResolvedPreviewTheme>(getSystemTheme)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setSystemTheme(mediaQuery.matches ? "dark" : "light")

    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return systemTheme
}
