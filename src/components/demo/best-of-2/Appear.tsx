"use client"

import { useEffect } from "react"
import { ROOT_ID } from "./ids"

/**
 * Jeden obserwator dla całej strony (wzór: `esencja/Appear.tsx`): elementy
 * z `data-b2-in` (blok z rozmycia) i `data-b2-words` (słowa nagłówka) dostają
 * `data-in`, gdy wejdą w kadr — raz. Ukrycie przed wejściem włącza dopiero
 * `data-b2-js` na korzeniu, więc bez JavaScriptu treść po prostu stoi. To, co
 * widać już przy hydratacji, dostaje `data-in` od razu i bez animacji.
 */
export function Appear() {
  useEffect(() => {
    const root = document.getElementById(ROOT_ID)
    if (!root) return
    const selector = "[data-b2-in], [data-b2-words]"
    const reveal: IntersectionObserverCallback = (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute("data-in", "")
        observer.unobserve(entry.target)
      }
    }
    // Zwykle element wchodzi chwilę po przekroczeniu krawędzi (−8%); to, co leży
    // na samym dole strony (`data-b2-in="edge"`), nigdy by jej nie przekroczyło.
    const inner = new IntersectionObserver(reveal, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    })
    const edge = new IntersectionObserver(reveal, { threshold: 0.3 })
    for (const item of root.querySelectorAll<HTMLElement>(selector)) {
      const box = item.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) {
        item.setAttribute("data-in", "")
        item.setAttribute("data-instant", "")
      } else (item.dataset.b2In === "edge" ? edge : inner).observe(item)
    }
    root.setAttribute("data-b2-js", "")
    return () => {
      inner.disconnect()
      edge.disconnect()
    }
  }, [])

  return null
}
