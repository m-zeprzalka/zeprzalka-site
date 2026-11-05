"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "../forma/use-in-view"
import { MARK_GLYPHS, REST_GLYPH, randomOf } from "./glyphs/alphabet"

/** Dekodowanie: 6 klatek szumu po 42 ms, potem nowy znak. */
const FRAMES = 6
const FRAME_MS = 42
/** Seria mrugnięć: nowy znak co 700 ms przez 4 s po wejściu na stronę (WCAG 2.2.2: < 5 s). */
const BLINK_MS = 700
const INTRO_MS = 4000

/**
 * Sygnet — wariacja logo serwisu (nazwisko + migający glif): znak w czarnym
 * kole „mruga”, czyli dekoduje się przez szum do kolejnego geometrycznego
 * glifu z logo. Mruga z powodu, nie bez końca: seria 4 s po wejściu na stronę,
 * jedno mrugnięcie przy każdej zmianie sekcji i ciągła seria, dopóki kursor
 * albo fokus jest na logo. Krój „Glif Symbols” — w DOM i w canvasie te same
 * kształty, bez pustych prostokątów. „Ogranicz ruch” — stały znak.
 */
export function Sygnet() {
  const [glyph, setGlyph] = useState(REST_GLYPH)
  const ref = useRef<HTMLSpanElement>(null)
  const current = useRef(REST_GLYPH)
  const scramble = useRef<ReturnType<typeof setTimeout>>(undefined)
  const series = useRef<ReturnType<typeof setInterval>>(undefined)
  const stop = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduced = useReducedMotion()

  const blink = useCallback(() => {
    clearTimeout(scramble.current)
    let next = randomOf(MARK_GLYPHS)
    while (next === current.current) next = randomOf(MARK_GLYPHS)
    current.current = next
    let frame = 0
    const step = () => {
      frame += 1
      if (frame >= FRAMES) return setGlyph(next)
      setGlyph(randomOf(MARK_GLYPHS))
      scramble.current = setTimeout(step, FRAME_MS)
    }
    step()
  }, [])

  const startSeries = useCallback(
    (duration?: number) => {
      clearInterval(series.current)
      clearTimeout(stop.current)
      blink()
      series.current = setInterval(blink, BLINK_MS)
      if (duration) stop.current = setTimeout(() => clearInterval(series.current), duration)
    },
    [blink]
  )

  useEffect(() => {
    if (reduced) return
    const start = setTimeout(() => startSeries(INTRO_MS), 320)
    return () => {
      clearTimeout(start)
      clearTimeout(scramble.current)
      clearTimeout(stop.current)
      clearInterval(series.current)
    }
  }, [reduced, startSeries])

  // Sekcja na wysokości 45% ekranu: jedno mrugnięcie przy każdej zmianie.
  useEffect(() => {
    if (reduced) return
    let section: string | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.getAttribute("data-bo-section")
          if (id && id !== section) {
            if (section !== null) blink()
            section = id
          }
        }
      },
      { rootMargin: "-45% 0px -54% 0px" }
    )
    document.querySelectorAll("[data-bo-section]").forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [reduced, blink])

  // Kursor albo fokus na logo: seria trwa, dopóki tam jest.
  useEffect(() => {
    const link = ref.current?.closest("a")
    if (!link || reduced) return
    const on = () => startSeries()
    const off = () => clearInterval(series.current)
    link.addEventListener("pointerenter", on)
    link.addEventListener("pointerleave", off)
    link.addEventListener("focus", on)
    link.addEventListener("blur", off)
    return () => {
      link.removeEventListener("pointerenter", on)
      link.removeEventListener("pointerleave", off)
      link.removeEventListener("focus", on)
      link.removeEventListener("blur", off)
    }
  }, [reduced, startSeries])

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-fm-ink text-fm-inverse"
    >
      <span className="bo-mark bo-glyph">{reduced ? REST_GLYPH : glyph}</span>
    </span>
  )
}
