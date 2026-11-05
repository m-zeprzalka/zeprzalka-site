"use client"

import { useEffect } from "react"
import { ROOT_ID } from "./ids"

/**
 * Jeden obserwator dla wejść z rozmycia: elementy z `data-kn-in` dostają
 * `data-in`, gdy wejdą w kadr (raz). `data-kn-in="chars"` składa litery
 * (jak H1), `data-kn-in=""` wyostrza cały blok. Ukrycie przed wejściem
 * włącza dopiero `data-kn-js` na korzeniu — bez JS treść po prostu stoi;
 * to, co jest widoczne już przy hydratacji, pokazuje się od razu.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.getElementById(ROOT_ID)
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-in", "")
          observer.unobserve(entry.target)
        }
      },
      // Start od pierwszego piksela w kadrze — nic nie czeka ukryte przy dolnej krawędzi.
      { threshold: 0 }
    )
    for (const item of root.querySelectorAll<HTMLElement>("[data-kn-in]")) {
      const box = item.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) item.setAttribute("data-in", "")
      else observer.observe(item)
    }
    return () => observer.disconnect()
  }, [])

  return null
}
