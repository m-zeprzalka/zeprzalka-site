"use client"

import { useEffect, useRef, useState } from "react"
import { randomGlyph, START_GLYPH } from "@/lib/glyphs"
import { useReducedMotion } from "@/lib/hooks"

const INTERVAL_MS = 1000
/** Najechanie: krótki szum sygnetu — kilka znaków co tyle ms. */
const SCRAMBLE_STEPS = 7
const SCRAMBLE_MS = 42

/**
 * Sygnet: znak podmieniany co sekundę, bez końca (decyzja właściciela — sygnet żyje
 * jak w obecnym logo serwisu), a przy najechaniu albo fokusie na logo krótki szum.
 * „Ogranicz ruch” zatrzymuje go na znaku startowym.
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
    const tick = () => setGlyph(randomGlyph())
    let timer = setInterval(tick, INTERVAL_MS)
    let scramble: ReturnType<typeof setTimeout>[] = []
    const play = (event: Event) => {
      if (event instanceof PointerEvent && event.pointerType !== "mouse") return
      scramble.forEach(clearTimeout)
      clearInterval(timer)
      scramble = Array.from({ length: SCRAMBLE_STEPS }, (_, step) =>
        setTimeout(tick, (step + 1) * SCRAMBLE_MS)
      )
      // Rytm co sekundę rusza od nowa po szumie — zwykła zmiana nie wpada tuż po nim.
      scramble.push(
        setTimeout(() => (timer = setInterval(tick, INTERVAL_MS)), SCRAMBLE_STEPS * SCRAMBLE_MS)
      )
    }
    host.addEventListener("pointerenter", play)
    host.addEventListener("focus", play)
    return () => {
      clearInterval(timer)
      host.removeEventListener("focus", play)
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
