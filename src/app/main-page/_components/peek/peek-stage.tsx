"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { HEADER_OFFSET } from "@/app/main-page/_lib/anchors"
import { cn } from "@/lib/utils"
import { PeekCard } from "./peek-card"
import { usePeekActions, usePeekState } from "./peek-context"

export const STAGE_ID = "podglad"

/** Karta trzyma się pod nagłówkiem i nad dolną krawędzią okna. */
const TOP = HEADER_OFFSET + 8
const BOTTOM = 24
/** Tyle gaśnie karta (`duration-500` ramki). Schowana dłużej — pojawia się od razu przy kursorze. */
const FADE_MS = 500

/**
 * Karta podglądu w prawym torze (desktop z myszą od 1280 px), widoczna tylko
 * na czas najechania albo fokusu.
 * - Pionowo stoi środkiem przy kursorze i płynie za nim (przejście CSS na
 *   `translate`, przerywane przy każdym ruchu — zero pętli JS); przy fokusie
 *   z klawiatury stoi przy elemencie.
 * - Wysokość płynnie dopasowuje się do kolejnej treści (kadry w naturalnych
 *   proporcjach), a poprzednia treść gaśnie w rozmyciu, gdy nowa się wyostrza.
 * Wizualne uzupełnienie treści strony: `aria-hidden`, a linki poza kolejnością
 * Tab — klawiatura i czytnik dostają tę samą kartę jako popover (`PeekTrigger`).
 * Kursor może przejechać na kartę (zwłoka ukrycia, `hold`) i kliknąć jej link.
 */
export function PeekStage() {
  const { peeks, stage, hide, hold } = usePeekActions()
  const state = usePeekState()
  const frame = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  /** Ostatnia pozycja kursora w pionie — karta pojawia się od razu tam, gdzie on jest. */
  const pointerY = useRef(0)
  /** Od kiedy karta jest schowana (`null` — widoczna). */
  const hiddenAt = useRef<number | null>(-Infinity)
  const [height, setHeight] = useState(0)
  const [layers, setLayers] = useState<{ id: string | null; leaving: string | null }>({
    id: null,
    leaving: null,
  })

  // Zmiana treści: poprzednia zostaje na chwilę jako warstwa gasnąca.
  if (layers.id !== state.id) setLayers({ id: state.id, leaving: layers.id })

  useLayoutEffect(() => {
    const node = body.current
    if (!node) return
    const observer = new ResizeObserver(() => setHeight(node.offsetHeight))
    observer.observe(node)
    return () => observer.disconnect()
  }, [layers.id])

  useEffect(() => {
    if (!stage) return
    const track = (event: PointerEvent) => {
      pointerY.current = event.clientY
    }
    window.addEventListener("pointermove", track, { passive: true })
    return () => window.removeEventListener("pointermove", track)
  }, [stage])

  // Pojawienie się po przerwie: karta staje od razu przy kursorze (gaśnie tylko
  // przezroczystość) i od razu w swojej wysokości — bez dojazdu z poprzedniego
  // miejsca i bez zmiany rozmiaru po drodze. Przejścia wracają po dwóch klatkach.
  const visible = layers.id !== null
  useLayoutEffect(() => {
    const element = frame.current
    if (!element) return
    if (!visible) {
      hiddenAt.current = performance.now()
      return
    }
    const since = hiddenAt.current
    hiddenAt.current = null
    if (since === null || performance.now() - since < FADE_MS) return
    element.dataset.appearing = ""
    let next = requestAnimationFrame(() => {
      next = requestAnimationFrame(() => delete element.dataset.appearing)
    })
    return () => cancelAnimationFrame(next)
  }, [visible, stage])

  useLayoutEffect(() => {
    const element = frame.current
    const { anchor, via, id } = state
    if (!element || !id || !anchor) return
    const place = () => {
      const box = anchor.getBoundingClientRect()
      const center = via === "focus" ? box.top + box.height / 2 : pointerY.current
      const max = window.innerHeight - BOTTOM - element.offsetHeight
      const top = Math.max(TOP, Math.min(center - element.offsetHeight / 2, max))
      element.style.translate = `0 ${Math.round(top)}px`
    }
    place()
    // Kursor na samej karcie — karta stoi (inaczej uciekałaby spod niego).
    const onMove = (event: PointerEvent) =>
      event.pointerType === "mouse" && !element.contains(event.target as Node) && place()
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", place, { passive: true })
    window.addEventListener("resize", place)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", place)
      window.removeEventListener("resize", place)
    }
  }, [state, height])

  if (!stage) return null

  const current = layers.id ? peeks[layers.id] : undefined
  const leaving = layers.leaving ? peeks[layers.leaving] : undefined

  return (
    <div
      ref={frame}
      id={STAGE_ID}
      // Wizualny duplikat treści strony: poza drzewem dostępności, linki poza Tabem
      // (`PeekCard inStage`) — klawiatura dostaje tę samą kartę jako popover.
      aria-hidden="true"
      onPointerEnter={hold}
      onPointerLeave={() => state.id && hide(state.id)}
      className={cn(
        "fixed top-0 z-30 transition-[translate,opacity] duration-500 ease-out data-appearing:transition-opacity data-instant:transition-none",
        "left-[calc(50%+var(--container-column)/2+var(--spacing-track))] w-[min(24rem,calc(50%-var(--container-column)/2-2*var(--spacing-track)))]",
        // Widoczną kartę da się wskazać kursorem i kliknąć jej link (WCAG 1.4.13).
        current ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        style={{ height: height || undefined }}
        className="relative overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg transition-[height] duration-300 ease-out in-data-appearing:transition-none"
      >
        {leaving && (
          <div
            key={`out-${layers.leaving}`}
            className="absolute inset-x-0 top-0 animate-peek-out"
            onAnimationEnd={() => setLayers((value) => ({ ...value, leaving: null }))}
          >
            <PeekCard peek={leaving} play={false} inStage />
          </div>
        )}
        {current && (
          <div
            key={`in-${layers.id}`}
            ref={body}
            data-peek-layer={layers.id ?? undefined}
            className="animate-peek-in"
          >
            <PeekCard peek={current} play inStage />
          </div>
        )}
      </div>
    </div>
  )
}
