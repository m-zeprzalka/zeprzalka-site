"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { PeekCard } from "./peek-card"
import { usePeek } from "./peek-context"

export const STAGE_ID = "podglad"

/** Karta trzyma się pod nagłówkiem i nad dolną krawędzią okna. */
const TOP = 88
const BOTTOM = 24
/** Wierzch karty stoi odrobinę nad linią frazy — oko czyta je jako parę. */
const LIFT = 12

/**
 * Karta podglądu w prawym torze (desktop z myszą od 1280 px). Płynie za
 * wskazaną frazą (przejście CSS na `translate`, bez przerysowań Reacta przy
 * przewijaniu), dopasowuje wysokość do kolejnej treści, a poprzednia treść
 * gaśnie w rozmyciu, gdy nowa się wyostrza — morf zamiast przeskoku.
 */
export function PeekStage() {
  const { peeks, stage, state } = usePeek()
  const frame = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [shown, setShown] = useState<{ id: string | null; leaving: string | null }>({
    id: null,
    leaving: null,
  })

  // Zmiana treści: poprzednia zostaje na chwilę jako warstwa gasnąca.
  if (shown.id !== state.id) setShown({ id: state.id, leaving: shown.id })

  // Wysokość karty = wysokość bieżącej treści (płynna zmiana przez `transition-[height]`).
  useLayoutEffect(() => {
    const node = body.current
    if (!node) return
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight))
    observer.observe(node)
    return () => observer.disconnect()
  }, [shown.id])

  // Położenie: za kotwicą przy przewijaniu i zmianie rozmiaru okna.
  useEffect(() => {
    const element = frame.current
    const anchor = state.anchor
    if (!element || !anchor) return
    const place = () => {
      const top = anchor.getBoundingClientRect().top - LIFT
      const max = window.innerHeight - element.offsetHeight - BOTTOM
      element.style.translate = `0 ${Math.round(Math.max(TOP, Math.min(top, max)))}px`
    }
    // Pierwsze pojawienie się bez dojazdu — karta staje od razu przy frazie.
    if (element.dataset.visible !== "true") {
      element.style.transition = "none"
      place()
      void element.offsetHeight
      element.style.transition = ""
    } else place()
    window.addEventListener("scroll", place, { passive: true })
    window.addEventListener("resize", place)
    return () => {
      window.removeEventListener("scroll", place)
      window.removeEventListener("resize", place)
    }
  }, [state.anchor, height])

  if (!stage) return null

  const current = shown.id ? peeks[shown.id] : undefined
  const leaving = shown.leaving ? peeks[shown.leaving] : undefined
  const visible = Boolean(current)

  return (
    <div
      ref={frame}
      id={STAGE_ID}
      data-peek-stage=""
      data-visible={visible}
      aria-live={state.pinned ? "polite" : "off"}
      className={cn(
        "fixed top-0 z-30 transition-[translate,opacity] duration-500 ease-(--ease-out)",
        "left-[calc(50%+var(--container-column)/2+var(--spacing-track))] w-[min(24rem,calc(50%-var(--container-column)/2-2*var(--spacing-track)))]",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
        !state.pinned && "pointer-events-none"
      )}
    >
      <div
        style={{ height: height || undefined }}
        className="relative overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg transition-[height] duration-300 ease-(--ease-out)"
      >
        {leaving && (
          <div
            key={`out-${shown.leaving}`}
            aria-hidden="true"
            className="animate-peek-out absolute inset-x-0 top-0"
            onAnimationEnd={() => setShown((value) => ({ ...value, leaving: null }))}
          >
            <PeekCard peek={leaving} play={false} />
          </div>
        )}
        {current && (
          <div key={`in-${shown.id}`} ref={body} className="animate-peek-in">
            <PeekCard peek={current} play />
          </div>
        )}
      </div>
    </div>
  )
}
