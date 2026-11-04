"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "../forma/use-in-view"
import { cn } from "../forma/cn"

/**
 * Znak ASCII dla każdej sekcji — wariacja migającego sygnetu z logo serwisu.
 * Same znaki z ASCII: renderują się w Geist Mono na każdym systemie (stary
 * sygnet bywał pustym prostokątem bez czcionek z symbolami matematycznymi).
 */
export const SECTION_TOKENS: Record<string, string> = {
  start: "</>",
  "o-mnie": "#",
  realizacje: "[ ]",
  kompetencje: "{ }",
  portfolio: "[ ]",
  blog: "//",
  kontakt: "@",
}

const NOISE = "{}[]<>/\\*+#%&@$~^=?!|;:"
const FRAMES = 6
const FRAME_MS = 42

function noise(): string {
  const length = 1 + Math.floor(Math.random() * 3)
  let out = ""
  for (let i = 0; i < length; i++) out += NOISE[Math.floor(Math.random() * NOISE.length)]
  return out
}

/**
 * Sygnet nagłówka: kod ASCII, który mówi, gdzie jesteś. Zmienia się tylko
 * z powodu — wejście na stronę, zmiana sekcji, najechanie na logo — krótkim
 * „dekodowaniem” (6 klatek co 42 ms). Nie miga bez końca, więc nie potrzebuje
 * pauzy (WCAG 2.2.2); przy „ogranicz ruch” zmienia się bez dekodowania.
 */
export function Glyph({ className }: { className?: string }) {
  const [text, setText] = useState(SECTION_TOKENS.start ?? "</>")
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

  // Wejście na stronę: jedno dekodowanie do znaku pierwszej sekcji.
  useEffect(() => {
    const start = setTimeout(() => decode(target.current), 350)
    return () => clearTimeout(start)
  }, [decode])

  // Sekcja na środku ekranu wyznacza znak (linia 45% od góry).
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-es-section]")
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const token = SECTION_TOKENS[entry.target.getAttribute("data-es-section") ?? ""]
          if (token && token !== target.current) decode(token)
        }
      },
      { rootMargin: "-45% 0px -54% 0px" }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [decode])

  // Najechanie albo fokus na linku z logo: ponowne dekodowanie tego samego znaku.
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
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "es-glyph inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-fm-ink text-[0.75rem] font-medium tracking-[-0.02em] whitespace-pre text-fm-inverse",
        className
      )}
    >
      {text}
    </span>
  )
}
