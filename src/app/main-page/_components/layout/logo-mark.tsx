"use client"

import { useEffect, useRef, useState } from "react"
import { randomGlyph, START_GLYPH } from "@/app/main-page/_lib/glyphs"
import { useReducedMotion } from "@/app/main-page/_lib/hooks"

const INTERVAL_MS = 1000
/** Najechanie: krótki szum sygnetu — kilka znaków co tyle ms. */
const SCRAMBLE_STEPS = 7
const SCRAMBLE_MS = 42

/**
 * Sygnet: znak podmieniany co sekundę, a przy najechaniu na logo krótki szum.
 * Pudełko o stałej szerokości, znak przy lewej krawędzi — rysunek zaczyna się
 * na linii kolumny, a domena nie przesuwa się przy zmianie znaku. Znak startowy
 * stały (bez rozjazdu hydratacji). `aria-hidden`: nazwa linku się nie zmienia.
 */
export function LogoMark() {
  const ref = useRef<HTMLSpanElement>(null)
  const [glyph, setGlyph] = useState(START_GLYPH)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const host = ref.current?.closest("a")
    if (reducedMotion || !host) return
    const timer = setInterval(() => setGlyph(randomGlyph()), INTERVAL_MS)
    let scramble: ReturnType<typeof setTimeout>[] = []
    const play = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      scramble.forEach(clearTimeout)
      scramble = Array.from({ length: SCRAMBLE_STEPS }, (_, step) =>
        setTimeout(() => setGlyph(randomGlyph()), (step + 1) * SCRAMBLE_MS)
      )
    }
    host.addEventListener("pointerenter", play)
    return () => {
      clearInterval(timer)
      scramble.forEach(clearTimeout)
      host.removeEventListener("pointerenter", play)
    }
  }, [reducedMotion])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="inline-flex h-[1em] w-[1.15em] items-center font-logo text-[1.15em] leading-none"
    >
      {glyph}
    </span>
  )
}
