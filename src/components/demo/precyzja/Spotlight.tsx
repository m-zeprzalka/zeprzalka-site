"use client"

import { useEffect, useRef } from "react"

/**
 * Siatka konstrukcyjna widoczna tylko w „świetle” wokół kursora. Jedyny
 * JavaScript to zapis pozycji do dwóch zmiennych CSS w rytmie klatek;
 * maskę, siatkę i przejście robi CSS. Na ekranach dotykowych siatka
 * pokazuje się w spoczynku, delikatnie, w górnej części kadru.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = ref.current
    const host = layer?.parentElement
    if (!layer || !host) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = host.getBoundingClientRect()
        layer.style.setProperty("--mx", `${event.clientX - rect.left}px`)
        layer.style.setProperty("--my", `${event.clientY - rect.top}px`)
        layer.dataset.active = ""
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      delete layer.dataset.active
    }

    host.addEventListener("pointermove", onMove, { passive: true })
    host.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return <div ref={ref} className="pz-spot" aria-hidden="true" />
}
