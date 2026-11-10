"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { LEGACY_ANCHORS, focusTarget, hashId } from "@/lib/anchors"

/**
 * Wejście na stronę z kotwicą (link z innej strony, realizacja z ⌘K, dowód kompetencji):
 * przeglądarka i Next przewijają do celu, ale fokus zostaje na `body`. Tu przechodzi
 * na cel — tak samo jak przy skoku w obrębie strony (`goToAnchor`). Klatkę później,
 * bo lista realizacji otwiera wiersz z adresu we własnym efekcie.
 *
 * Przejście na inną podstronę bez kotwicy (menu w torze, ⌘K, linki): fokus idzie na
 * `<main>` — czytnik zaczyna od nowej treści, a Tab prowadzi dalej od jej początku,
 * zamiast od `body`. Pierwsze wczytanie strony zostawia fokus w spokoju.
 *
 * Kotwica z poprzedniej wersji strony (`/#contact`) nie ma celu — przeglądarka nie
 * przewinęła, więc przewijamy do jej odpowiednika (`LEGACY_ANCHORS`).
 */
export function HashFocus() {
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    const initial = first.current
    first.current = false
    const id = hashId(window.location.hash)
    if (!id && initial) return
    const frame = requestAnimationFrame(() => {
      const legacy = id && !document.getElementById(id) ? LEGACY_ANCHORS[id] : undefined
      const target = document.getElementById(legacy ?? (id || "main"))
      if (!target) return
      if (legacy) target.scrollIntoView()
      focusTarget(target)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
