"use client"

import { useEffect, useRef, type ElementType } from "react"
import { MARK_GLYPHS, randomOf } from "./alphabet"
import { useGlyphMotion } from "./motion"

/** Kolejne litery odsłaniają się co 14 ms (słowo ≤ 250 ms); przed odsłonięciem migają glifami. */
const STEP_MS = 14
const LEAD_MS = 80

/**
 * Tekst, który przy pierwszym wejściu w kadr „dekoduje się” z glifów w litery
 * (ok. 400–600 ms). Litera zostaje w układzie przez cały czas (przezroczysta),
 * a glif rysuje się nad nią — szerokość i podział wierszy nie drgną. Czytnik
 * ekranu dostaje zwykły tekst; bez JS, przy „ogranicz ruch” albo gdy tekst jest
 * już widoczny przy wejściu na stronę — od razu same litery.
 */
export function DecodeText({
  text,
  as: Tag = "span",
  id,
  className,
  delay = 0,
}: {
  text: string
  as?: ElementType
  id?: string
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const { reduced } = useGlyphMotion()

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    if (root.getBoundingClientRect().top < window.innerHeight * 0.92) return
    const letters = [...root.querySelectorAll<HTMLElement>("[data-c]")]
    letters.forEach((letter) => (letter.dataset.g = randomOf(MARK_GLYPHS)))
    let frame = 0

    const play = () => {
      const start = performance.now() + delay
      const step = (now: number) => {
        let pending = false
        letters.forEach((letter, index) => {
          if (now >= start + LEAD_MS + index * STEP_MS) {
            if (letter.dataset.g) delete letter.dataset.g
          } else {
            pending = true
            if (now >= start && Math.random() < 0.3) letter.dataset.g = randomOf(MARK_GLYPHS)
          }
        })
        if (pending) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        play()
      },
      { rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(root)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      letters.forEach((letter) => delete letter.dataset.g)
    }
  }, [reduced, delay])

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="gl-decode">
        {Array.from(text).map((char, index) =>
          char === " " ? (
            " "
          ) : (
            <span key={index} data-c="">
              {char}
            </span>
          )
        )}
      </span>
    </Tag>
  )
}
