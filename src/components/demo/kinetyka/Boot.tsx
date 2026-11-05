"use client"

import { useEffect } from "react"
import { kinetic } from "./gsap"
import { ROOT_ID } from "./ids"

/**
 * Włącza sceny ruchu: `data-kn-js` na korzeniu (CSS dopiero wtedy wydłuża
 * sceny przewijania i chowa ich wersje statyczne) i jedno przeliczenie
 * ScrollTriggera po wczytaniu krojów — szerokości liter zmieniają wysokości
 * sekcji, a więc punkty startu scen.
 */
export function Boot() {
  useEffect(() => {
    const root = document.getElementById(ROOT_ID)
    if (!root) return
    root.setAttribute("data-kn-js", "")
    const { ScrollTrigger } = kinetic()
    let alive = true
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh())
    return () => {
      alive = false
      root.removeAttribute("data-kn-js")
    }
  }, [])

  return null
}
