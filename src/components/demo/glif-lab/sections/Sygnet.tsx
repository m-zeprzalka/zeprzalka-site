"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { CHARSET_SPECS, FONT_VAR, MARK_GLYPHS } from "../engine/charsets"
import { useGlyphMotion, useVariant } from "../lab/store"

/**
 * Sygnet: nazwisko i migający glif jak w obecnym logo — glif pochodzi z zestawu
 * wariantu A (0/1 w presecie binarnym, katakana w Matriksie…), zmienia się co
 * sekundę. Najechanie na link puszcza krótki szum. Zatrzymany ruch i
 * „ogranicz ruch” — glif stoi. Startowy znak jest stały (zgodna hydratacja).
 */
export function Sygnet({ className }: { className?: string }) {
  const variant = useVariant("hero")
  const glyphs = Array.from(MARK_GLYPHS[variant.charset])
  const [index, setIndex] = useState(0)
  const { auto, reduced } = useGlyphMotion()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!auto) return
    const interval = setInterval(
      () => setIndex((value) => value + 1 + Math.floor(Math.random() * 3)),
      1000
    )
    return () => clearInterval(interval)
  }, [auto])

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>(".group")
    if (!host || reduced) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const scramble = () => {
      let left = 7
      const step = () => {
        setIndex((value) => value + 1 + Math.floor(Math.random() * 4))
        if (--left > 0) timer = setTimeout(step, 1000 / Math.max(12, variant.fps))
      }
      clearTimeout(timer)
      step()
    }
    host.addEventListener("pointerenter", scramble)
    return () => {
      host.removeEventListener("pointerenter", scramble)
      clearTimeout(timer)
    }
  }, [reduced, variant.fps])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={className ?? "gll-mark"}
      style={{ fontFamily: FONT_VAR[CHARSET_SPECS[variant.charset].font] } as CSSProperties}
    >
      {glyphs[index % glyphs.length]}
    </span>
  )
}
