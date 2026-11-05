"use client"

import type { FocusEvent, PointerEvent } from "react"
import { getPeek, hidePeek, showPeek } from "./peek-store"

/** Zamiar wskazania: kursor musi się ruszyć nad elementem i chwilę na nim zostać. */
const INTENT_MS = 70
/** Przez tyle po ostatnim przewinięciu wiersze przejeżdżające pod kursorem nic nie otwierają. */
const SCROLL_QUIET_MS = 180

let lastScroll = 0
let intent: ReturnType<typeof setTimeout> | undefined
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true })
}

/**
 * Wyzwalacz podglądu na marginesie: kursor myszy (dotyk nie ma „wskazania”)
 * albo fokus z klawiatury — wtedy karta staje na wysokości elementu.
 * Zamiar wskazania zamiast samego wejścia: przy przewijaniu wiersze przesuwają
 * się pod nieruchomym kursorem i dostają `pointerenter` — bez ruchu myszy
 * i w trakcie przewijania karta (i jej klip) się nie otwiera.
 */
export function peekHandlers(key: string) {
  return {
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return
      if (event.movementX === 0 && event.movementY === 0) return
      if (performance.now() - lastScroll < SCROLL_QUIET_MS) return
      if (getPeek().key === key) return
      clearTimeout(intent)
      intent = setTimeout(() => showPeek(key, "pointer"), INTENT_MS)
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return
      clearTimeout(intent)
      hidePeek(key)
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.matches(":focus-visible")) return
      showPeek(key, "focus", event.currentTarget)
    },
    onBlur: () => hidePeek(key, 0),
  }
}
