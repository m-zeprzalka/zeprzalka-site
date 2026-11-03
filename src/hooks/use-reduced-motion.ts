import { useEffect, useRef, useSyncExternalStore, type SyntheticEvent } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

/** `true`, gdy użytkownik prosi o ograniczenie ruchu (system / przeglądarka). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Zapętlone wideo to ruch ciągły (WCAG 2.2.2). Przy „ogranicz ruch” zostaje
 * pierwsza klatka: pauza po zmianie ustawienia i przy każdym starcie
 * odtwarzania (`autoPlay` potrafi ruszyć już po efekcie).
 */
export function useReducedMotionVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) ref.current?.pause()
  }, [reducedMotion])

  const onPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (reducedMotion) event.currentTarget.pause()
  }

  return { ref, onPlay }
}
