"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/components/demo/forma/cn"
import { MARK_GLYPHS, REST_GLYPH, randomOf } from "./alphabet"
import { useGlyphMotion } from "./motion"

/**
 * Sygnet: glif podmieniany co sekundę, jak w obecnym logo — ale z własnego
 * kroju (zawsze ten sam kształt, nigdy pusty prostokąt). Najechanie na
 * rodzica z klasą `group` przyspiesza go na chwilę. Zatrzymany albo przy
 * „ogranicz ruch” stoi na ⍤. Startowy znak jest stały (zgodna hydratacja).
 */
export function GlyphMark({ className }: { className?: string }) {
  const [glyph, setGlyph] = useState(REST_GLYPH)
  const [scrambling, setScrambling] = useState(false)
  const { auto, reduced } = useGlyphMotion()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!auto) return
    const interval = setInterval(() => setGlyph(randomOf(MARK_GLYPHS)), 1000)
    return () => clearInterval(interval)
  }, [auto])

  // Krótki „szum” po najechaniu na link z logo — ruch wywołany przez użytkownika.
  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>(".group")
    if (!host || reduced) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const scramble = () => {
      let left = 6
      const step = () => {
        setGlyph(randomOf(MARK_GLYPHS))
        if (--left > 0) timer = setTimeout(step, 45)
        else setScrambling(false)
      }
      clearTimeout(timer)
      setScrambling(true)
      step()
    }
    host.addEventListener("pointerenter", scramble)
    return () => {
      host.removeEventListener("pointerenter", scramble)
      clearTimeout(timer)
    }
  }, [reduced])

  return (
    <span ref={ref} aria-hidden="true" className={cn("gl-glyph gl-mark", className)}>
      {auto || scrambling ? glyph : REST_GLYPH}
    </span>
  )
}
