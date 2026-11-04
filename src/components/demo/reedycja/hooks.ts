"use client"

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react"

function useMedia(query: string, serverValue: boolean): boolean {
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
export function useFinePointer(): boolean {
  return useMedia("(hover: hover) and (pointer: fine)", false)
}

/**
 * Czy element jest w kadrze (co najmniej `threshold` jego powierzchni,
 * z marginesem `rootMargin`). Śledzi ciągle — do pauzowania wideo poza ekranem.
 */
export function useVisible(
  ref: RefObject<Element | null>,
  { threshold = 0, rootMargin = "0px" }: { threshold?: number; rootMargin?: string } = {}
): boolean {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) =>
        setVisible(!!entry && entry.isIntersecting && entry.intersectionRatio >= threshold),
      { threshold: threshold > 0 ? [0, threshold, 1] : 0, rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin])

  return visible
}

/**
 * Czy element leży w całości w widocznej części okna (pod lepkim nagłówkiem) —
 * warunek morfu kadru. Grupa przejścia maluje się nad wszystkim, więc kafel
 * schowany częściowo pod nagłówkiem „wyskoczyłby” na niego w trakcie ruchu.
 */
export function inViewport(node: Element | null): node is HTMLElement {
  if (!node) return false
  const box = node.getBoundingClientRect()
  const top = document.querySelector(".re-header")?.getBoundingClientRect().bottom ?? 0
  return box.height > 0 && box.top >= top && box.bottom <= innerHeight
}
