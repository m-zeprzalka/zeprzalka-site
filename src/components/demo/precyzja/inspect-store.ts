"use client"

import { useSyncExternalStore } from "react"

/**
 * Stan trybu „Wymiary” współdzielony przez przełącznik w nagłówku i nakładkę
 * pomiarową. Mały zewnętrzny magazyn zamiast kontekstu: dwa odległe liście
 * drzewa nie wymuszają owijania całej strony w providera.
 */
let enabled = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setInspect(next: boolean) {
  enabled = next
  document.documentElement.toggleAttribute("data-pz-inspect", next)
  listeners.forEach((listener) => listener())
}

export function useInspect(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false
  )
}
