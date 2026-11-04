"use client"

import { useEffect, useState } from "react"
import { MARK_GLYPHS, REST_GLYPH, randomOf } from "./alphabet"
import { useGlyphMotion } from "./motion"

/** Wskaźnik pracy: glif sygnetu podmieniany co 70 ms (przy „ogranicz ruch” stoi). */
export function GlyphSpinner({ active }: { active: boolean }) {
  const [glyph, setGlyph] = useState(REST_GLYPH)
  const { reduced } = useGlyphMotion()

  useEffect(() => {
    if (!active || reduced) return
    const interval = setInterval(() => setGlyph(randomOf(MARK_GLYPHS)), 70)
    return () => clearInterval(interval)
  }, [active, reduced])

  return (
    <span aria-hidden="true" className="gl-glyph gl-mark">
      {glyph}
    </span>
  )
}
