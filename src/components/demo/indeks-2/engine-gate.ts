"use client"

import { useEffect, useSyncExternalStore } from "react"

/**
 * Brama silnika glifów. Start silnika (shadery, atlasy) to jedno długie zadanie
 * — gdyby ruszył przy hydratacji, zatrzymałby „harmonijkę” wejścia w połowie
 * rozmycia. Powierzchnie montują się dopiero po wejściu (≈1,1 s, w bezczynności)
 * albo przy pierwszym przewinięciu / dotknięciu; do tej pory stoją statyczne
 * klatki w identycznych wymiarach (bez skoku układu).
 */
const ENTRANCE_MS = 1100
const EARLIEST_MS = 650

let open = false
const listeners = new Set<() => void>()

function openGate() {
  if (open) return
  open = true
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useEngineGate(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false
  )
}

/** Montowany raz na stronie: otwiera bramę po wejściu albo przy pierwszej interakcji. */
export function useEngineGateStarter() {
  useEffect(() => {
    if (open) return
    // Safari nie ma requestIdleCallback — wtedy zwykły timeout.
    const idle = (callback: () => void) => {
      if (typeof window.requestIdleCallback === "function")
        window.requestIdleCallback(callback, { timeout: 700 })
      else setTimeout(callback, 1)
    }
    const timer = window.setTimeout(() => idle(openGate), ENTRANCE_MS)
    const early = () => {
      if (performance.now() > EARLIEST_MS) openGate()
    }
    window.addEventListener("scroll", early, { passive: true })
    window.addEventListener("pointerdown", early)
    window.addEventListener("keydown", early)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", early)
      window.removeEventListener("pointerdown", early)
      window.removeEventListener("keydown", early)
    }
  }, [])
}
