import { useEffect, useState, useSyncExternalStore, type RefObject } from "react"
import { observeReveal, REDUCED_MOTION } from "@/app/main-page/_lib/motion"

/**
 * Zapytanie medialne jako stan Reacta. Na serwerze i przy hydratacji zwraca
 * `serverValue`, więc pierwszy render klienta zgadza się z HTML-em.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  )
}

/** `true`, gdy system albo przeglądarka prosi o ograniczenie ruchu. */
export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION)
}

/** Desktop z myszą od 1280 px — tylko tam karta podglądu stoi na marginesie. */
export const STAGE_QUERY = "(min-width: 80rem) and (hover: hover) and (pointer: fine)"

/**
 * Stan animacji wejścia dla komponentu: `rest` (spoczynek — także bez JS,
 * przy „ogranicz ruch” i gdy element był w kadrze od razu), `armed` (czeka
 * pod zgięciem), `playing` (wjechał w kadr). Zasady — `observeReveal`.
 */
export function useReveal(
  ref: RefObject<Element | null>,
  options?: Parameters<typeof observeReveal>[2]
): "rest" | "armed" | "playing" {
  const [state, setState] = useState<"rest" | "armed" | "playing">("rest")
  const rootMargin = options?.rootMargin
  const threshold = options?.threshold
  useEffect(() => {
    const node = ref.current
    if (!node) return
    return observeReveal(
      node,
      { arm: () => setState("armed"), play: () => setState("playing") },
      { rootMargin, threshold }
    )
  }, [ref, rootMargin, threshold])
  return state
}
