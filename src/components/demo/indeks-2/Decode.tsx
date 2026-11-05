"use client"

import { useEffect, useRef, useState } from "react"
import { glyphFontVariables } from "@/components/demo/shared/glyph"
import { cn } from "@/components/demo/forma/cn"
import { useReduced } from "./hooks"

/** Znaki przejścia — formy z sygnetu (geometryczne, bez liter), wszystkie w kroju silnika. */
const GLYPHS = Array.from("⎈⎉⎊⎋⌘⊞⊛⊕⊗⍟❖◈⊡⊟⊠⌀∴⋆○◇")
const GLYPH_SET = new Set(GLYPHS)
const STEP_MS = 42

/**
 * Napis, który przechodzi przez znaki sygnetu: litery od lewej ustalają się
 * jedna po drugiej (~60 ms na znak). Zmiana `text` przepisuje stary napis
 * w nowy; zmiana `replay` dekoduje bieżący od szumu (wejście w kadr, wskazanie).
 * Serwer renderuje tekst docelowy; przy „ogranicz ruch” nic się nie rusza.
 */
export function Decode({
  text,
  replay = 0,
  className,
}: {
  text: string
  replay?: number
  className?: string
}) {
  const reduced = useReduced()
  const [shown, setShown] = useState(text)
  const last = useRef({ text, replay })

  useEffect(() => {
    const previous = last.current
    last.current = { text, replay }
    if (reduced || (previous.text === text && previous.replay === replay)) {
      setShown(text)
      return
    }
    const start = previous.text === text ? "" : previous.text
    const length = Math.max(start.length, text.length)
    let frame = 0
    const timer = setInterval(() => {
      frame += 1
      const settled = Math.floor(frame / 1.4)
      let next = ""
      for (let index = 0; index < length; index++) {
        const target = text[index]
        if (index < settled) next += target ?? ""
        else if (target === " ") next += " "
        else if (target !== undefined || index < start.length)
          next += GLYPHS[(index * 7 + frame * 3) % GLYPHS.length]
      }
      setShown(next)
      if (settled >= length) {
        clearInterval(timer)
        setShown(text)
      }
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [text, replay, reduced])

  // Znak w trakcie przejścia stoi w kroju silnika (bez „tofu” i bez skoku wysokości linii).
  return (
    <span className={cn(glyphFontVariables, className)}>
      {Array.from(shown).map((char, index) =>
        GLYPH_SET.has(char) ? (
          <span
            key={index}
            className="inline-block w-[0.6em] text-center [font-family:var(--gx-font-symbols),var(--gx-font-mono),monospace] leading-none text-fm-ink-3"
          >
            {char}
          </span>
        ) : (
          char
        )
      )}
    </span>
  )
}
