"use client"

import { useSyncExternalStore } from "react"
import { useReducedMotion } from "@/components/demo/forma/use-in-view"

/*
 * Jeden przełącznik dla całego ruchu, który dzieje się sam (logo, pole glifów,
 * emblematy) — WCAG 2.2.2: zapętlony ruch dłuższy niż 5 s musi dać się zatrzymać.
 * Stan żyje w module (jedna strona = jeden stan), komponenty słuchają go
 * przez `useSyncExternalStore`.
 */
let paused = false
const listeners = new Set<() => void>()

export function setGlyphsPaused(value: boolean) {
  paused = value
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useGlyphsPaused(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => paused,
    () => false
  )
}

/**
 * `auto` — czy wolno animować bez udziału użytkownika. `reduced` wyłącza też
 * ruch wywołany przez użytkownika (mieszanie pod kursorem, fale dekodowania).
 */
export function useGlyphMotion() {
  const reduced = useReducedMotion()
  const isPaused = useGlyphsPaused()
  return { reduced, paused: isPaused, auto: !reduced && !isPaused }
}
