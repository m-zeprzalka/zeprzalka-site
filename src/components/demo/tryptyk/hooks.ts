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

/** Scena istnieje od 1024 px — wtedy realizacje trafiają do niej, a nie rozwijają się w liście. */
export function useHasStage(): boolean {
  return useMedia("(min-width: 64rem)")
}

const noop = () => () => {}

/** Mac/iOS pokazują ⌘, reszta Ctrl. Serwer i hydratacja zakładają ⌘. */
export function useIsApple(): boolean {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => true
  )
}

/** `true`, gdy co najmniej `threshold` elementu jest w kadrze (na bieżąco, nie jednorazowo). */
export function useVisible<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      threshold,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, visible] as const
}
