"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
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
 * Scena w prawym torze siatki: mysz i co najmniej 1280 px (tor ≥ 256 px).
 * Węziej i na dotyku podglądy są kartami pod słowem na szerokość kolumny.
 */
export const STAGE = `${FINE} and (min-width: 80rem)`
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

/**
 * Karta pod słowem na szerokość siatki: przy otwarciu mierzymy kolumnę, w której
 * stoi wyzwalacz, i przesuwamy kartę (`alignOffset`) tak, żeby stała dokładnie
 * na jej krawędziach — niezależnie od miejsca słowa w zdaniu. `row` — wyzwalacz
 * stoi w wierszu siatki (fakty): karta schodzi pod cały wiersz, nie zasłania
 * dłuższego podpisu sąsiada.
 */
export function useColumnFit<T extends HTMLElement>({ row = false } = {}) {
  const trigger = useRef<T | null>(null)
  const [fit, setFit] = useState({ offset: 0, width: 0, drop: 0 })
  const measure = () => {
    const element = trigger.current
    const column = element?.closest(".i1-col")?.getBoundingClientRect()
    if (!element || !column) return
    const rect = element.getBoundingClientRect()
    let drop = 0
    const item = row ? element.closest("li") : null
    if (item?.parentElement) {
      const top = item.getBoundingClientRect().top
      const bottoms = [...item.parentElement.children]
        .map((child) => child.getBoundingClientRect())
        .filter((box) => Math.abs(box.top - top) < 2)
        .map((box) => box.bottom)
      drop = Math.max(0, Math.max(...bottoms) - rect.bottom)
    }
    setFit({ offset: column.left - rect.left, width: column.width, drop })
  }
  return { trigger, fit, measure }
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

/** Koniec „harmonijki” wejścia z zapasem — dopiero potem rusza silnik glifów (WebGL). */
const ENTRY_MS = 1500

/**
 * `true` po wejściu strony, gdy przeglądarka odpocznie: powierzchnie silnika
 * glifów (napis w stopce, okładka wpisu) montują się dopiero wtedy, więc
 * start WebGL (atlas, shadery) nie zatrzymuje animacji wejścia.
 */
export function useAfterEntry(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let idle = 0
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setReady(true), { timeout: 800 })
      } else setReady(true)
    }, ENTRY_MS)
    return () => {
      clearTimeout(timer)
      if (idle) window.cancelIdleCallback(idle)
    }
  }, [])
  return ready
}
