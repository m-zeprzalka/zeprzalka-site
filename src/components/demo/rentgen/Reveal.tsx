"use client"

import { useEffect } from "react"

/**
 * Jeden obserwator dla całej strony: elementy z `data-rg-in` wyostrzają się
 * z rozmycia, gdy wejdą w kadr — raz. Ukrycie przed wejściem włącza dopiero
 * `data-rg-js` na korzeniu, więc bez JavaScriptu treść po prostu stoi; to, co
 * jest widoczne już przy hydratacji, dostaje `data-in` od razu i bez animacji.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-rg-root]")
    if (!root) return
    const items = root.querySelectorAll<HTMLElement>("[data-rg-in]")
    const reveal: IntersectionObserverCallback = (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute("data-in", "")
        observer.unobserve(entry.target)
      }
    }
    const inner = new IntersectionObserver(reveal, {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.1,
    })
    const edge = new IntersectionObserver(reveal, { threshold: 0.25 })
    for (const item of items) {
      const box = item.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) {
        item.setAttribute("data-in", "")
        item.setAttribute("data-instant", "")
      } else (item.dataset.rgIn === "edge" ? edge : inner).observe(item)
    }
    root.setAttribute("data-rg-js", "")
    return () => {
      inner.disconnect()
      edge.disconnect()
    }
  }, [])

  return null
}
