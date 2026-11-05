"use client"

import { useSyncExternalStore } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/*
 * Ruch efektów ze znaków: „ogranicz ruch” z systemu oraz wspólna pauza
 * strony (WCAG 2.2.2 — zapętlony ruch > 5 s musi dać się zatrzymać).
 * Konsument może podpiąć własny przycisk przez `setGlyphsPaused`.
 */

let paused = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setGlyphsPaused(value: boolean) {
  if (paused === value) return
  paused = value
  listeners.forEach((listener) => listener())
}

export function useGlyphsPaused(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => paused,
    () => false
  )
}

/** `auto` — wolno ruszać się samemu; `reduced` — żadnego ruchu (statyczne klatki). */
export function useGlyphMotion() {
  const reduced = useReducedMotion()
  const isPaused = useGlyphsPaused()
  return { reduced, paused: isPaused, auto: !reduced && !isPaused }
}
