"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"

/** Cały tytuł w ok. 800 ms; krok na literę 55–110 ms (krótkie słowa nie migną). */
const TOTAL = 720
const LEAD = 120

/**
 * Tytuł sekcji, który przy wejściu w kadr (pierwszy piksel) odkodowuje się
 * z kodu — dalej już w czasie, więc zawsze dochodzi do końca: każda litera
 * pokazuje najpierw jedną cyfrę binarną (stałą, bez migotania), potem cyfra
 * gaśnie, a litera wyostrza się z rozmycia — kolejno od lewej. Po tytule
 * dopływa szary lead nagłówka. Jeden spokojny akcent „to nie jest zwykła lista”.
 *
 * Bez JS, przy „ogranicz ruch” albo gdy nagłówek jest już widoczny przy
 * wejściu na stronę — zwykły tekst. Czytnik ekranu dostaje całe słowo raz.
 */
export function DecodeTitle({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return undefined
    // Nagłówek widoczny już przy wejściu (albo minięty) — bez animacji, bez mignięcia.
    if (root.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined
    const head = root.closest<HTMLElement>(".ixn-shead")
    const letters = [...root.querySelectorAll<HTMLElement>("[data-c]")]
    const step = Math.min(110, Math.max(55, TOTAL / Math.max(1, letters.length)))
    letters.forEach((letter, index) => {
      letter.dataset.g = (letter.textContent?.charCodeAt(0) ?? index) % 2 ? "1" : "0"
    })
    head?.setAttribute("data-armed", "")
    const timers: ReturnType<typeof setTimeout>[] = []

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        letters.forEach((letter, index) =>
          timers.push(setTimeout(() => delete letter.dataset.g, LEAD + index * step))
        )
        timers.push(
          setTimeout(() => head?.setAttribute("data-decoded", ""), LEAD + letters.length * step)
        )
      },
      { threshold: 0 }
    )
    observer.observe(root)
    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
      letters.forEach((letter) => delete letter.dataset.g)
      head?.removeAttribute("data-armed")
      head?.removeAttribute("data-decoded")
    }
  }, [reduced])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="ixn-decode">
        {Array.from(text).map((char, index) =>
          char === " " ? (
            " "
          ) : (
            <span key={index} data-c="">
              <span className="ixn-decode__l">{char}</span>
            </span>
          )
        )}
      </span>
    </>
  )
}
