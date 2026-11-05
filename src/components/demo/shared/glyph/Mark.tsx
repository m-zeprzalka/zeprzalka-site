"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/components/demo/forma/cn"
import { LOGO_GLYPHS } from "./charsets"
import { glyphFontVariables } from "./fonts"
import { useGlyphMotion } from "./motion"

const GLYPHS = Array.from(LOGO_GLYPHS)
/** Znak startowy jest stały — HTML z serwera i pierwszy render klienta są identyczne. */
const START = GLYPHS.indexOf("⨝")

/**
 * Sygnet logo w DOM, jak `src/components/layout/LogoGlyph.tsx` w serwisie:
 * znak z obecnego logo (pełny zestaw, start od „⨝”) podmieniany co sekundę.
 * Różnice: własny podzbiór kroju
 * (każdy znak ma krój — bez „tofu” i bez skoku wysokości wiersza przy zmianie
 * kroju zastępczego) i stałe pudełko 1,2 em; najechanie na link z logo
 * (najbliższy `a` albo `[data-gx-host]`) puszcza krótki szum znaków.
 * „Ogranicz ruch” i pauza — znak stoi.
 */
export function GlyphMark({ className }: { className?: string }) {
  const [index, setIndex] = useState(START)
  const { auto, reduced } = useGlyphMotion()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!auto) return
    const interval = setInterval(() => setIndex(Math.floor(Math.random() * GLYPHS.length)), 1000)
    return () => clearInterval(interval)
  }, [auto])

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("a, [data-gx-host]")
    if (!host || reduced) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const scramble = (event: PointerEvent | FocusEvent) => {
      if ("pointerType" in event && event.pointerType !== "mouse") return
      let left = 7
      const step = () => {
        setIndex(Math.floor(Math.random() * GLYPHS.length))
        if (--left > 0) timer = setTimeout(step, 1000 / 16)
      }
      clearTimeout(timer)
      step()
    }
    host.addEventListener("pointerenter", scramble)
    host.addEventListener("focusin", scramble)
    return () => {
      host.removeEventListener("pointerenter", scramble)
      host.removeEventListener("focusin", scramble)
      clearTimeout(timer)
    }
  }, [reduced])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        glyphFontVariables,
        "inline-grid size-[1.2em] shrink-0 place-items-center overflow-hidden [font-family:var(--gx-font-mono),var(--gx-font-symbols),var(--gx-font-math),monospace] leading-none font-normal",
        className
      )}
    >
      {GLYPHS[index]}
    </span>
  )
}
