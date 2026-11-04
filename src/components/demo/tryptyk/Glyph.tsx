"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"
import { GLYPH, SCRAMBLE } from "./anchors"
import { useStage } from "./store"

/** Krok losowania i liczba znaków po drodze: 6 × 45 ms ≈ 280 ms. */
const STEP = 45
const STEPS = 6

/**
 * Znak w logo = znacznik sekcji, którą czytasz (* & # ¶ @). Przy zmianie
 * sekcji glif „przelatuje” przez kilka znaków ASCII i staje na nowym — ruch
 * wywołany lekturą, a nie zegarem, więc nie jest ciągły (obecne logo zmienia
 * znak co sekundę bez końca). Wskazanie myszą losuje, dopóki kursor jest na
 * logo (stan `hover` podaje rodzic — cały link). Przy „ogranicz ruch” znak zmienia się od razu.
 */
export function Glyph({ hover = false, className }: { hover?: boolean; className?: string }) {
  const section = useStage((s) => s.section)
  const target = GLYPH[section]
  const reduced = useReducedMotion()
  // Losowany znak; `null` = stoi na glifie sekcji (serwer, „ogranicz ruch”, koniec losowania).
  const [scrambled, setScrambled] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Pierwsza klatka stoi (rusza tylko nagłówek) — glif losuje dopiero przy zmianie sekcji.
  const lastTarget = useRef(target)

  useEffect(() => {
    if (reduced) return
    if (!hover && target === lastTarget.current) {
      // Ta sama sekcja (wejście na stronę albo koniec wskazania): glif wraca na znak sekcji.
      timer.current = setTimeout(() => setScrambled(null), 0)
      return () => clearTimeout(timer.current)
    }
    lastTarget.current = target
    let step = 0
    const tick = () => {
      step += 1
      if (!hover && step > STEPS) {
        setScrambled(null)
        return
      }
      setScrambled(SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] ?? null)
      timer.current = setTimeout(tick, hover ? 70 : STEP)
    }
    timer.current = setTimeout(tick, 0)
    return () => clearTimeout(timer.current)
  }, [target, hover, reduced])

  const shown = reduced ? target : (scrambled ?? target)

  return (
    <span aria-hidden="true" className={className}>
      {shown}
    </span>
  )
}
