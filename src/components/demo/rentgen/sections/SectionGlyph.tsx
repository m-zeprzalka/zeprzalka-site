"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "../../forma/use-in-view"

/** Znak każdej sekcji — to, czym sekcja jest w kodzie (dwa znaki, mieszczą się w soczewce). */
const TOKENS: Record<string, string> = {
  start: "<>",
  "o-mnie": "{}",
  kompetencje: "fn",
  realizacje: "[]",
  wideo: "01",
  blog: "md",
  kontakt: "@",
}

const NOISE = "{}[]<>/\\*+#%&=?!|;:01"
const FRAMES = 6
const FRAME_MS = 45

function noise() {
  return Array.from(
    { length: 2 },
    () => NOISE[Math.floor(Math.random() * NOISE.length)] ?? "#"
  ).join("")
}

/**
 * Glif w soczewce sygnetu. Zmienia się wyłącznie z powodu: wejście na stronę,
 * zmiana sekcji (linia 45% ekranu), najechanie na logo — krótkim „dekodowaniem”
 * (6 klatek po 45 ms). Nie miga bez końca, więc nie potrzebuje pauzy
 * (WCAG 2.2.2); przy „ogranicz ruch” zmienia się bez dekodowania.
 */
export function SectionGlyph() {
  const [text, setText] = useState(TOKENS.start ?? "<>")
  const ref = useRef<HTMLSpanElement>(null)
  const target = useRef(text)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduced = useReducedMotion()

  const decode = useCallback(
    (to: string) => {
      target.current = to
      clearTimeout(timer.current)
      if (reduced) return setText(to)
      let frame = 0
      const step = () => {
        frame += 1
        if (frame >= FRAMES) return setText(to)
        setText(noise())
        timer.current = setTimeout(step, FRAME_MS)
      }
      step()
    },
    [reduced]
  )

  useEffect(() => {
    const start = setTimeout(() => decode(target.current), 420)
    return () => clearTimeout(start)
  }, [decode])

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-rg-section]")
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const token = TOKENS[entry.target.getAttribute("data-rg-section") ?? ""]
          if (token && token !== target.current) decode(token)
        }
      },
      { rootMargin: "-45% 0px -54% 0px" }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [decode])

  useEffect(() => {
    const link = ref.current?.closest("a")
    if (!link) return
    const replay = () => decode(target.current)
    link.addEventListener("pointerenter", replay)
    link.addEventListener("focus", replay)
    return () => {
      link.removeEventListener("pointerenter", replay)
      link.removeEventListener("focus", replay)
    }
  }, [decode])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <span ref={ref} className="rg-logo__glyph">
      {text}
    </span>
  )
}
