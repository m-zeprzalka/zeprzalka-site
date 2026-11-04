"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"

/**
 * Logo: glif w kwadracie + imię i nazwisko. Glif to znaki ASCII z Geist Mono
 * (zawsze w subsecie kroju, więc nigdy pusty prostokąt). Po wejściu na stronę
 * i przy najechaniu albo fokusie znak przetasowuje się przez kod i ląduje na
 * „&” — projektant & programista. Ruch trwa ~1,3 s (poniżej progu WCAG 2.2.2),
 * przy „ogranicz ruch” znak stoi. W scenie kwadrat zaczyna jako szkic.
 */
const GLYPHS = Array.from("{}[]<>/\\#%*+=~^$?@|01")
const FINAL = "&"
const STEPS = 14
const STEP_MS = 90

export function Logo({ href, name }: { href: string; name: string }) {
  const [glyph, setGlyph] = useState(FINAL)
  const reduced = useReducedMotion()
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)

  const shuffle = useCallback(() => {
    if (reduced) return
    clearInterval(timer.current)
    let step = 0
    timer.current = setInterval(() => {
      step += 1
      if (step >= STEPS) {
        clearInterval(timer.current)
        setGlyph(FINAL)
        return
      }
      setGlyph(GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? FINAL)
    }, STEP_MS)
  }, [reduced])

  useEffect(() => {
    shuffle()
    return () => clearInterval(timer.current)
  }, [shuffle])

  return (
    <a
      href={href}
      onPointerEnter={shuffle}
      onFocus={shuffle}
      className="group -mx-1.5 flex h-11 items-center gap-2.5 rounded-full px-1.5 fm-focus"
    >
      <span aria-hidden="true" className="tf-mark">
        <span className="tf-mark__fill tf-anim" />
        <span className="tf-mark__wire tf-anim" />
        <span className="tf-mark__glyph tf-anim">{glyph}</span>
        <span className="tf-mark__frame tf-anim">
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-fm-ink">{name}</span>
    </a>
  )
}
