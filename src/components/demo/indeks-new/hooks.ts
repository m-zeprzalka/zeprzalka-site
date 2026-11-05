"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { ROOT_ID } from "./anchors"

export function portalRoot(): HTMLElement | undefined {
  return typeof document === "undefined"
    ? undefined
    : (document.getElementById(ROOT_ID) ?? undefined)
}

export function useMedia(query: string, serverValue = false): boolean {
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

/** Mysz albo gładzik: hover istnieje i wskaźnik jest precyzyjny. Na serwerze `false`. */
export const FINE = "(hover: hover) and (pointer: fine)"
export const useFinePointer = () => useMedia(FINE)

/**
 * Scena na marginesie: mysz i co najmniej 1024 px (od 1280 karta stoi obok
 * kolumny, niżej płynie przy kursorze). Na dotyku podglądy są w kolumnie.
 */
export const STAGE = `${FINE} and (min-width: 64rem)`
export const useStage = () => useMedia(STAGE)

const noop = () => () => {}

/** `true` po hydratacji (bez rozjazdu HTML z serwerem). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
}

/** Mac/iOS pokazują ⌘, reszta Ctrl. Serwer i hydratacja zakładają ⌘. */
export function useIsApple(): boolean {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => true
  )
}

/**
 * Aktywna sekcja: ta, która przecina pas na ~40% wysokości ekranu.
 * Jeden obserwator na komponent; sekcje szukane po id.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "")
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [ids])
  return active
}

/** `true`, gdy element jest w kadrze (na bieżąco). */
export function useVisible<T extends Element>(ref: React.RefObject<T | null>, threshold = 0.35) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      threshold,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold])
  return visible
}

/** `true`, gdy karta przeglądarki jest widoczna — ukryta karta nie gra wideo. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange)
      return () => document.removeEventListener("visibilitychange", onChange)
    },
    () => document.visibilityState === "visible",
    () => true
  )
}
