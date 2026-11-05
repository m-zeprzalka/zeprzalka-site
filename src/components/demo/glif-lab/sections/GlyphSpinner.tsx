"use client"

import { useEffect, useState } from "react"
import { CHARSET_SPECS, FONT_VAR, MARK_GLYPHS } from "../engine/charsets"
import { useGlyphMotion, useVariant } from "../lab/store"

/** Wskaźnik wysyłania: glif zestawu G podmieniany w tempie wariantu (przy „ogranicz ruch” stoi). */
export function GlyphSpinner({ active }: { active: boolean }) {
  const variant = useVariant("contact")
  const glyphs = MARK_GLYPHS[variant.charset]
  const [glyph, setGlyph] = useState(0)
  const { reduced } = useGlyphMotion()

  useEffect(() => {
    if (!active || reduced) return
    const interval = setInterval(() => setGlyph((value) => value + 1), 1000 / variant.fps)
    return () => clearInterval(interval)
  }, [active, reduced, variant.fps])

  return (
    <span
      aria-hidden="true"
      className="inline-grid w-[1.1em] place-items-center"
      style={{ fontFamily: FONT_VAR[CHARSET_SPECS[variant.charset].font] }}
    >
      {Array.from(glyphs)[(glyph * 7) % Array.from(glyphs).length]}
    </span>
  )
}
