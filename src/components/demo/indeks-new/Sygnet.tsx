"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/components/demo/forma/cn"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { MARK, REST_GLYPH, SECTION_GLYPHS, randomOf } from "./glyph/alphabet"
import { glyphFont } from "./glyph/fonts"
import { useActiveSection } from "./hooks"

/** Co tyle pikseli przewinięcia glif zmienia się na kolejny. */
const SCROLL_STEP = 56
/** Po takiej przerwie w przewijaniu glif staje na znaku sekcji. */
const SETTLE_MS = 220
const SCRAMBLE_MS = 42

/**
 * Sygnet: nazwisko + migający glif, jak w logo serwisu — ale glif „oddycha”
 * przewijaniem: zmienia się, gdy strona się rusza, i staje na znaku sekcji,
 * gdy przestajesz przewijać (Start ⎈, O mnie ◎, Kompetencje ⌘, Portfolio ◈,
 * Blog ⊛, Kontakt ⊕). Nie miga sam z siebie (WCAG 2.2.2); najechanie na
 * logo puszcza krótki szum. Krój własny — nigdy pusty prostokąt.
 */
export function Sygnet({
  sections,
  className,
}: {
  sections: readonly string[]
  className?: string
}) {
  const active = useActiveSection(sections)
  const reduced = useReducedMotion()
  const rest = SECTION_GLYPHS[active] ?? REST_GLYPH
  const [glyph, setGlyph] = useState(REST_GLYPH)
  const ref = useRef<HTMLSpanElement>(null)
  const restRef = useRef(rest)

  useEffect(() => {
    restRef.current = rest
  }, [rest])

  // Krótki szum kończący się na znaku sekcji.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    const scramble = (steps: number) => {
      clearTimeout(timer.current)
      let left = steps
      const step = () => {
        left--
        setGlyph(left > 0 ? randomOf(MARK) : restRef.current)
        if (left > 0) timer.current = setTimeout(step, SCRAMBLE_MS)
      }
      step()
    }
    if (reduced) return undefined

    // Pozycję czytamy raz na klatkę (rAF), nie w każdym zdarzeniu — bez wymuszania układu.
    let last = window.scrollY
    let travelled = 0
    let frame = 0
    let settle: ReturnType<typeof setTimeout> | undefined
    const sample = () => {
      frame = 0
      const y = window.scrollY
      travelled += Math.abs(y - last)
      last = y
      if (travelled >= SCROLL_STEP) {
        travelled = 0
        clearTimeout(timer.current)
        setGlyph(randomOf(MARK))
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sample)
      clearTimeout(settle)
      settle = setTimeout(() => scramble(3), SETTLE_MS)
    }
    const host = ref.current?.closest("a")
    const onEnter = () => scramble(7)
    window.addEventListener("scroll", onScroll, { passive: true })
    host?.addEventListener("pointerenter", onEnter)
    host?.addEventListener("focus", onEnter)
    // Wejście na stronę: jeden szum do znaku startu.
    const intro = setTimeout(() => scramble(8), 380)
    return () => {
      window.removeEventListener("scroll", onScroll)
      host?.removeEventListener("pointerenter", onEnter)
      host?.removeEventListener("focus", onEnter)
      cancelAnimationFrame(frame)
      clearTimeout(settle)
      clearTimeout(intro)
      clearTimeout(timer.current)
    }
  }, [reduced])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "ixn-glyph inline-grid w-[1.1em] place-items-center",
        glyphFont.className,
        className
      )}
    >
      {reduced ? rest : glyph}
    </span>
  )
}
