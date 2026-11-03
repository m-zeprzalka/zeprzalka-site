"use client"

import { useEffect, useRef, type ReactNode } from "react"

/**
 * „Przekształcam”: szara połowa nagłówka czernieje w miękkim świetle pod
 * kursorem. Nad nagłówkiem leży jego kopia w atramencie (aria-hidden),
 * odsłaniana maską radialną — ten sam tekst w tym samym bloku, więc łamanie
 * wierszy zgadza się co do piksela. Pozycja maski to dwie zmienne CSS
 * ustawiane raz na klatkę; React nie renderuje się przy ruchu myszy.
 * Dotyk: jedno łagodne przejście światła po nagłówku. „Ogranicz ruch”: nic.
 */
export function InkHeadline({ children, ink }: { children: ReactNode; ink: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) {
      node.dataset.sweep = ""
      return
    }

    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect()
        node.style.setProperty("--ink-x", `${event.clientX - rect.left}px`)
        node.style.setProperty("--ink-y", `${event.clientY - rect.top}px`)
        node.dataset.ink = ""
      })
    }
    const leave = () => delete node.dataset.ink
    node.addEventListener("pointermove", move)
    node.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      node.removeEventListener("pointermove", move)
      node.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <div ref={ref} className="zi-ink relative">
      {children}
      <div aria-hidden="true" className="zi-ink__layer pointer-events-none absolute inset-0">
        {ink}
      </div>
    </div>
  )
}
