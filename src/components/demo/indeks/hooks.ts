"use client"

import { useSyncExternalStore } from "react"

/** Id korzenia koncepcji — portale Radiksa renderują się do środka, żeby działały tokeny `.fm`. */
export const ROOT_ID = "indeks"

export function portalRoot(): HTMLElement | undefined {
  return typeof document === "undefined"
    ? undefined
    : (document.getElementById(ROOT_ID) ?? undefined)
}

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

const noop = () => () => {}

/** Mac/iOS pokazują ⌘, reszta Ctrl. Serwer i hydratacja zakładają ⌘. */
export function useIsApple(): boolean {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => true
  )
}
