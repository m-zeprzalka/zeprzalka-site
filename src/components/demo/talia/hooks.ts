"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

/** Zapytanie medialne jako stan. Na serwerze i przy hydratacji: `false`. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

/** Urządzenie z prawdziwym kursorem — tylko tam wideo rusza po najechaniu. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)"

/**
 * `true`, gdy strona skończyła się ładować i przeglądarka ma wolną chwilę.
 * Wideo startuje dopiero wtedy — bajty pętli nie konkurują z fontami, CSS
 * i plakatami w oknie LCP.
 */
export function usePageReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancel = () => {}
    const idle = () => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
        cancel = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(() => setReady(true), 300)
        cancel = () => window.clearTimeout(id)
      }
    }
    if (document.readyState === "complete") idle()
    else window.addEventListener("load", idle, { once: true })
    return () => {
      window.removeEventListener("load", idle)
      cancel()
    }
  }, [])

  return ready
}

/** `true`, dopóki element jest w kadrze (w odróżnieniu od jednorazowego useInView z Formy). */
export function useVisible<T extends Element>(node: T | null, threshold = 0.35): boolean {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, threshold])

  return visible
}
