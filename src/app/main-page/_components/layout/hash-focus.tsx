"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { focusTarget } from "@/app/main-page/_lib/anchors"

/**
 * Wejście na stronę z kotwicą (link z innej strony, ⌘K z podstrony do sekcji startu):
 * przeglądarka i Next przewijają do celu, ale fokus zostaje na `body`. Tu przechodzi
 * na cel — tak samo jak przy skoku w obrębie strony (`goToAnchor`). Klatkę później,
 * bo lista realizacji otwiera wiersz z adresu we własnym efekcie.
 */
export function HashFocus() {
  const pathname = usePathname()

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (target) focusTarget(target)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
