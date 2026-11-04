"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/components/demo/forma/cn"
import { MARK_GLYPHS, randomOf } from "./alphabet"
import { useGlyphMotion } from "./motion"

/** Słowo odkodowuje się w całości: 160 ms migania glifami, potem od razu litery (≤ 250 ms). */
const WORD_MS = 160
/** Kolejne słowa odblokowane jednym ruchem przewijania startują co 40 ms (fala, nie błysk). */
const WORD_STAGGER = 40

/**
 * Akapit, który dekoduje się z glifów w tekst w tempie przewijania — wariant
 * „tekstu wypełniającego się przy przewijaniu” w języku tej koncepcji. Jednostką
 * jest całe słowo (nigdy pół słowa liter i pół glifów). Odblokowywanie biegnie
 * od chwili, gdy akapit wchodzi na 90% wysokości ekranu, i kończy się, zanim
 * jego góra minie 45%; odczytane słowa zostają tekstem. Pozycję liczymy w JS
 * (bez zależności od animacji przewijania w CSS). Czytnik ekranu, „ogranicz
 * ruch” i brak JS — zwykły tekst.
 */
export function Statement({
  parts,
  className,
}: {
  parts: readonly { text: string; tone: "ink" | "muted" }[]
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const { reduced } = useGlyphMotion()

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const words = [...root.querySelectorAll<HTMLElement>("[data-w]")].map((word) => [
      ...word.querySelectorAll<HTMLElement>("[data-c]"),
    ])
    const state = new Uint8Array(words.length) // 0 glify, 1 w trakcie, 2 tekst
    const start = new Float64Array(words.length)
    words.flat().forEach((letter) => (letter.dataset.g = randomOf(MARK_GLYPHS)))
    let unlocked = 0
    let lastStart = 0
    let frame = 0
    let visible = false

    const unlock = (now: number) => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh * 0.9 - rect.top) / (vh * 0.45)))
      const target = Math.round(progress * words.length)
      // Dużo słów naraz (szybkie przewijanie, wejście w połowie strony) — fala nie dłuższa niż 400 ms.
      const stagger = Math.min(WORD_STAGGER, 400 / Math.max(1, target - unlocked))
      for (; unlocked < target; unlocked++) {
        state[unlocked] = 1
        lastStart = Math.max(now, lastStart + stagger)
        start[unlocked] = lastStart
      }
    }

    const tick = (now: number) => {
      frame = 0
      unlock(now)
      let busy = false
      for (let i = 0; i < words.length; i++) {
        if (state[i] !== 1) continue
        const elapsed = now - (start[i] ?? 0)
        const letters = words[i] ?? []
        if (elapsed >= WORD_MS) {
          letters.forEach((letter) => delete letter.dataset.g)
          state[i] = 2
        } else {
          busy = true
          if (elapsed >= 0) {
            letters.forEach((letter) => {
              if (Math.random() < 0.5) letter.dataset.g = randomOf(MARK_GLYPHS)
            })
          }
        }
      }
      if (busy || (visible && unlocked < words.length)) frame = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible) wake()
    })
    observer.observe(root)
    window.addEventListener("scroll", wake, { passive: true })
    window.addEventListener("resize", wake)
    wake()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", wake)
      window.removeEventListener("resize", wake)
      cancelAnimationFrame(frame)
      words.flat().forEach((letter) => delete letter.dataset.g)
    }
  }, [reduced])

  let index = 0
  return (
    <p className={cn("gl-statement", className)}>
      <span className="sr-only">{parts.map((part) => part.text).join(" ")}</span>
      <span ref={ref} aria-hidden="true">
        {parts.map((part, partIndex) => (
          <span key={partIndex} className={part.tone === "ink" ? "text-fm-ink" : "text-fm-ink-2"}>
            {part.text.split(" ").map((word, wordIndex, all) => (
              <span key={wordIndex}>
                <span data-w="">
                  {Array.from(word).map((char) =>
                    char === "\u00a0" ? (
                      char
                    ) : (
                      <span key={index++} data-c="">
                        {char}
                      </span>
                    )
                  )}
                </span>
                {wordIndex < all.length - 1 && " "}
              </span>
            ))}
            {partIndex < parts.length - 1 && " "}
          </span>
        ))}
      </span>
    </p>
  )
}
