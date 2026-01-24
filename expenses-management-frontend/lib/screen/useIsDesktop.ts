import { useEffect, useState } from "react"

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")

    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    setIsDesktop(mql.matches)

    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isDesktop
}
