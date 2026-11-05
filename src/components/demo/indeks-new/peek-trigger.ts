"use client"

import type { FocusEvent, PointerEvent } from "react"
import { hidePeek, showPeek } from "./peek-store"

/**
 * Wyzwalacz podglądu na marginesie: kursor myszy (dotyk nie ma „wskazania”)
 * albo fokus z klawiatury — wtedy karta staje na wysokości elementu.
 */
export function peekHandlers(key: string) {
  return {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") showPeek(key, "pointer")
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") hidePeek(key)
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.matches(":focus-visible")) return
      showPeek(key, "focus", event.currentTarget)
    },
    onBlur: () => hidePeek(key, 0),
  }
}
