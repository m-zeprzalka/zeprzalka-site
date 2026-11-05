"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * Kiedy dekodować napis ze znaków:
 * - `wait` — jeszcze poza oknem: stoi czytelny (bez stanu znaków na zgięciu),
 * - `play` — wszedł w okno z dołu: dekoduje się od razu,
 * - `still` — był w oknie już przy załadowaniu: zostaje czytelny (bez „gotowe → szum”).
 */
export type Arming = "wait" | "play" | "still"

export function useArmed(ref: RefObject<HTMLElement | null>): Arming {
  const [state, setState] = useState<Arming>("wait")
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let first = true
    const observer = new IntersectionObserver(([entry]) => {
      const initial = first
      first = false
      if (!entry?.isIntersecting) return
      observer.disconnect()
      setState(initial ? "still" : "play")
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])
  return state
}

/** Wyzwalacz silnika dla stanu: dekodowanie tylko przy wejściu z dołu, poza tym czytelny tekst. */
export const triggerFor = (state: Arming) => (state === "play" ? "mount" : "hover")
