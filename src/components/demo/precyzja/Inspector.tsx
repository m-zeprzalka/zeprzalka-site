"use client"

import { useEffect, useRef } from "react"
import { Columns } from "./Columns"
import { useInspect, setInspect } from "./inspect-store"

/**
 * Tryb „Wymiary”: siatka konstrukcyjna strony i pomiar elementu pod
 * kursorem — znacznik HTML, szerokość × wysokość, stopień pisma. To, co
 * projektant widzi w edytorze, a programista w narzędziach przeglądarki.
 * Włączany przyciskiem w nagłówku, wyłączany tym samym przyciskiem albo Esc.
 */
export function Inspector() {
  const enabled = useInspect()
  const boxRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!enabled) return
    const box = boxRef.current
    const label = labelRef.current
    if (!box || !label) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const element = document.elementFromPoint(event.clientX, event.clientY)
        if (!(element instanceof HTMLElement) || element.closest("[data-pz-ui]")) {
          box.hidden = true
          return
        }
        const rect = element.getBoundingClientRect()
        const style = getComputedStyle(element)
        const text = element.childNodes.length && element.textContent?.trim()
        box.hidden = false
        box.style.transform = `translate(${rect.left}px, ${rect.top}px)`
        box.style.width = `${rect.width}px`
        box.style.height = `${rect.height}px`
        label.textContent =
          `${element.tagName.toLowerCase()} ${Math.round(rect.width)} × ${Math.round(rect.height)}` +
          (text
            ? ` · ${Math.round(parseFloat(style.fontSize))}/${Math.round(parseFloat(style.lineHeight) || 0)}`
            : "")
      })
    }
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setInspect(false)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("keydown", onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("keydown", onKey)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pz-inspector" data-pz-ui aria-hidden="true">
      <div className="pz-container pz-inspector__grid">
        <Columns className="pz-inspector__columns" />
      </div>
      <div ref={boxRef} className="pz-inspector__box" hidden>
        <span ref={labelRef} className="pz-inspector__label" />
      </div>
    </div>
  )
}
