import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Block-local mobile query. Inlined instead of importing a site hook so the
 * block's import surface stays within the block contract (relative + ui/*).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
